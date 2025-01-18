const Chat = require("../models/chat-schema");
const io = require("../utils/socket");

exports.getChat = async (req, res) => {
  const { _id } = req.params;

  try {
    const dbChat = await Chat.findById(_id);

    if (!dbChat) {
      return res.status(404).send({ message: "No chat" });
    }

    return res.status(200).send(dbChat);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.postCreateChat = async (req, res) => {
  const { name } = req.body;

  try {
    // Create a new chat session
    const newSession = new Chat({
      participant: { name },
      messages: [], // Initialize with no messages
      isDeleted: false, // You can modify this if required
    });

    // Save the new session to the database
    await newSession.save();

    // Add a welcome message from the admin
    const welcomeMessage = {
      sender: "admin",
      message: `Hello ${name}! Welcome to our support chat. We have received your message and one of our team members will get in touch with you shortly. Please feel free to share more details if needed.`,
      sentAt: Date.now(),
    };

    // Push the welcome message to the chat session's messages array
    newSession.messages.push(welcomeMessage);

    // Save the updated chat session
    await newSession.save();

    return res
      .status(201)
      .send({ message: "Chat session created successfully", chat: newSession });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

exports.postMessage = async (req, res) => {
  const { _id: chatId, sender, message, sentAt } = req.body;

  try {
    // Find the chat session by chatId
    const dbChat = await Chat.findById(chatId);

    if (!dbChat) {
      return res.status(404).send({ message: "Chat not found" });
    }

    const newMessage = {
      sender,
      message,
      sentAt,
    };

    // Add the new message to the messages array
    dbChat.messages.push(newMessage);

    // Save the updated chat session
    await dbChat.save();
    io.getIO().emit("new_chat_message", {
      chatId: dbChat._id,
      message: newMessage,
      by: {
        name: dbChat.participant.name,
        role: "user",
      },
    });

    // Return the updated chat session
    return res.status(200).send({ message: "Message sent", chat: dbChat });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};
