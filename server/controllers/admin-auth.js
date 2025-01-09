const Admin = require("../models/admin-schema");
const ErrorResponse = require("../utils/error-response");
const jwt = require("jsonwebtoken");

exports.postCreateAccount = async (req, res) => {
  const { username, password } = req.body;

  // Step 1: Validate input
  if (!username || !password) {
    return res.status(400).json({
      message: "Please, enter username and password",
    });
  }

  // Step 2: Check if the email already exists
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exist." });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create account.",
      error: err.message,
    });
  }

  // Step 3: Create the user and save to the database
  try {
    const newAdmin = new Admin({
      username,
      password, // Save the password directly, it will be hashed by the model's pre-save hook
    });

    await newAdmin.save();

    const { accessToken, refreshToken } = newAdmin.getSignedToken();

    res.cookie("adminToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/admin/auth/refresh-token",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set 'None' in production, otherwise 'Lax' in development
    });

    const filteredAdmin = await Admin.findById(newAdmin.id).select("-password");

    // send accessToken to client
    return res.status(200).json({
      success: true,
      admin: filteredAdmin,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to create account.",
      error: err.message,
    });
  }
};

exports.postLoginAccount = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const { accessToken, refreshToken } = admin.getSignedToken();

    res.cookie("adminToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/admin/auth/refresh-token",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set 'None' in production, otherwise 'Lax' in development
    });

    const filteredAdmin = await Admin.findById(admin.id).select("-password");

    // send accessToken to client
    res.status(200).json({
      success: true,
      admin: filteredAdmin,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to signin to account.",
      error: err.message,
    });
  }
};

exports.getRefreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.adminToken;

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
  res.clearCookie("adminToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set 'None' in production, otherwise 'Lax' in development
    secure: true,
    path: "/api/admin/auth/refresh-token",
  });
  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
  res.end();
};

exports.getAdminExistence = async (req, res) => {
  try {
    const adminQuantity = await Admin.countDocuments();

    const isAdminExist = adminQuantity > 0; // This can be simplified

    return res.json(isAdminExist);
  } catch (error) {
    return res.status(500).json({ error: "Server error" }); // Use a 500 status code for server errors
  }
};
