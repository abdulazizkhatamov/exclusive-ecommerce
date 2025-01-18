let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: [process.env.CLIENT_BASE_URL, process.env.ADMIN_BASE_URL], // Allow both development and production origins
        methods: ["GET", "POST"],
        credentials: true, // Include this if you need cookies/auth headers
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
