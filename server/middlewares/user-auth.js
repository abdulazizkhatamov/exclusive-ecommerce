const ErrorResponse = require("../utils/error-response");
const jwt = require("jsonwebtoken");
const User = require("../models/user-schema");

const authenticate = async (req, res, next) => {
  let accessToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  console.log(accessToken);

  if (!accessToken) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY,
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ErrorResponse("User does not exist", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
