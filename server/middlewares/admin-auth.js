const ErrorResponse = require("../utils/error-response");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin-schema");

const authenticate = async (req, res, next) => {
  let accessToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
    );

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return next(new ErrorResponse("Admin does not exist", 404));
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
