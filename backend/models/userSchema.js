const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const SALT_ROUNDS = 10;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    addresses: [
      {
        fullName: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String,
      },
    ],
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true },
);

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
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

UserSchema.methods = {
  comparePassword: function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  },
  getSignedToken: function () {
    const accessToken = jwt.sign(
      { id: this._id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: "30s",
      },
    );
    const refreshToken = jwt.sign(
      { id: this._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: "2min",
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

module.exports = model("User", UserSchema);