const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const SALT_ROUNDS = 10;

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true },
);

// Hash the password before saving the user
AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

AdminSchema.methods = {
  comparePassword: function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  },
  getSignedToken: function () {
    const accessToken = jwt.sign(
      { id: this._id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: "1h",
      },
    );
    const refreshToken = jwt.sign(
      { id: this._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    return { accessToken, refreshToken };
  },

  getResetPasswordToken: async function () {
    const randomString = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = jwt.sign(
      {
        randomString,
        id: this._id,
        email: this.email,
      },
      process.env.RESET_PASSWORD_SECRET_KEY,
      {
        expiresIn: "3min",
      },
    );
    this.resetPasswordToken = randomString;
    await this.save();
    return resetPasswordToken;
  },
};

module.exports = model("Admin", AdminSchema);
