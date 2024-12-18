const User = require("../models/user-schema");
const ErrorResponse = require("../utils/error-response");
const jwt = require("jsonwebtoken");

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
    const newUser = new User({
      fullName,
      email,
      password, // Save the password directly, it will be hashed by the model's pre-save hook
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully.", user: newUser });
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "invalid_credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "invalid_credentials" });
    }

    const { accessToken, refreshToken } = user.getSignedToken();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh-token",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set 'None' in production, otherwise 'Lax' in development
    });

    const filteredUser = await User.findById(user.id).select("-password");

    // send accessToken to client
    res.status(200).json({
      success: true,
      user: filteredUser,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "error_login_account",
      error: err.message,
    });
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
    path: "/api/auth/refresh-token",
  });
  res.status(200).json({
    success: true,
    message: "Signout Successfully",
  });
  res.end();
};
