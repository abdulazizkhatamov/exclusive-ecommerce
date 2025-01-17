const mongoose = require("mongoose");

// Conversation schema
const emailSchema = new mongoose.Schema(
  {
    participant: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "admin"], // 'user' or 'admin' to distinguish who sent the message
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
