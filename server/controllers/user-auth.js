const Admin = require("../models/admin-schema");
const User = require("../models/user-schema");

const ErrorResponse = require("../utils/error-response");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const postmark = require("postmark");

exports.postCreateAccount = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Step 1: Validate input
  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "all_fields_required",
    });
  }

  // Step 2: Check if the email already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email_exist" });
    }
  } catch (err) {
    return res.status(500).json({
      message: "error_checking_email",
      error: err.message,
    });
  }

  // Step 3: Create the user and save to the database
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const verificationLink = `${process.env.CLIENT_BASE_URL}/verify-email?token=${token}`;

    const newUser = new User({
      fullName,
      email,
      password, // Save the password directly, it will be hashed by the model's pre-save hook
      verificationToken: token,
      verificationTokenExpiration: Date.now() + 60 * 60 * 1000, // 1-hour expiry
    });

    const dbAdmin = await Admin.findOne();
    const postmarkName = dbAdmin.mail_accounts[0].name;
    const postmarkKey = dbAdmin.mail_accounts[0].key;

    if (!postmarkKey) {
      return res.status(401).json({
        message:
          "Something went wrong during registration. Please try again later.",
      });
    }

    const postmarkClient = new postmark.ServerClient(postmarkKey);

    // Send an email to the user via Postmark
    await postmarkClient.sendEmail({
      From: postmarkName,
      To: email,
      Subject: "Verify Your Email Address",
      HtmlBody: `
        <p>Dear ${fullName},</p>
        <p>Thank you for registering on our platform. Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Support Team</p>
      `,
      TextBody: `
        Dear ${fullName},

        Thank you for registering on our platform. Please verify your email address by visiting the link below:
        ${verificationLink}

        This link will expire in 1 hour.

        Best regards,
        Support Team
      `,
      MessageStream: "outbound",
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully. Please verify your email.",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "error_creating_indb",
      error: err.message,
    });
  }
};

exports.postLoginAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "invalid_credentials" });
    }

    // Step 2: Verify the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid_credentials" });
    }

    // Step 3: Check if the user is verified
    if (!user.isVerified) {
      const currentTime = new Date();
      const dbAdmin = await Admin.findOne();

      const postmarkAccount = dbAdmin.mail_accounts[0].name;
      const postmarkKey = dbAdmin.mail_accounts[0].key;

      if (!postmarkKey) {
        return res.status(500).json({ message: "email_service_unavailable" });
      }

      if (
        user.verificationTokenExpiration &&
        user.verificationTokenExpiration > currentTime
      ) {
        // Token is still valid
        return res.status(401).json({ message: "email_not_verified" });
      }

      // Generate a new token and set its expiration
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpiration = new Date(
        currentTime.getTime() + 60 * 60 * 1000, // 1 hour from now
      );

      user.verificationToken = verificationToken;
      user.verificationTokenExpiration = verificationTokenExpiration;

      try {
        const postmarkClient = new postmark.ServerClient(postmarkKey);

        // Send verification email
        await postmarkClient.sendEmail({
          From: postmarkAccount,
          To: email,
          Subject: "Verify Your Account",
          HtmlBody: `
            <h1>Account Verification</h1>
            <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
            <a href="${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}">Verify Email</a>
            <p>If you did not request this, please ignore this email.</p>
          `,
          TextBody: `
            Account Verification

            Thank you for signing up. Please verify your email by clicking the link below:
            ${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}

            If you did not request this, please ignore this email.
          `,
          MessageStream: "outbound",
        });

        await user.save(); // Save the updated user to the database
        return res.status(401).json({
          message: "email_not_verified",
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        return res.status(500).json({
          message: "email_send_failed",
        });
      }
    }

    // Step 4: Generate tokens
    const { accessToken, refreshToken } = user.getSignedToken();

    // Step 5: Set refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/api/user/auth/refresh-token",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // Step 6: Fetch the user with populated fields and exclude sensitive data
    const filteredUser = await User.findById(user.id)
      .populate({
        path: "cart.product",
        model: "Product",
      })
      .populate({
        path: "cart.variant",
        model: "Variant",
      })
      .populate("orderHistory")
      .select("-password");

    // Step 7: Respond with the access token and user details
    return res.status(200).json({
      success: true,
      user: filteredUser,
      accessToken,
    });
  } catch (err) {
    console.error("Error in postLoginAccount:", err);
    return res.status(500).json({
      message: "error_login_account",
      error: err.message,
    });
  }
};

exports.postVerifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    // Find user with matching token and valid expiration
    const dbUser = await User.findOne({
      verificationToken: token,
      verificationTokenExpiration: { $gt: Date.now() },
    });

    // If user not found or token expired
    if (!dbUser) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Mark the user as verified and remove token/expiration fields
    dbUser.isVerified = true;
    dbUser.verificationToken = null;
    dbUser.verificationTokenExpiration = null;

    // Save updated user
    await dbUser.save();

    return res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getRefreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  // Verify the refresh token
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
    );

    if (!decoded || !decoded.id) {
      return next(new ErrorResponse("Unauthorized", 401));
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

exports.postLogoutAccount = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set 'None' in production, otherwise 'Lax' in development
    secure: true,
    path: "/api/user/auth/refresh-token",
  });
  res.status(200).json({
    success: true,
    message: "Signout Successfully",
  });
  res.end();
};
