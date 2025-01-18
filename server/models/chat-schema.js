const mongoose = require("mongoose");

// Conversation schema
const chatSchema = new mongoose.Schema(
  {
    participant: {
      name: {
        type: String,
        required: true,
      },
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    support: {
      name: { type: String },
      avatar: { type: String },
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
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
