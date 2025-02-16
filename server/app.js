/**
 * Module dependencies.
 */
require("dotenv").config();
const debug = require("debug")("server:server");
const http = require("node:http");
const express = require("express");
const path = require("node:path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const mongoose = require("mongoose");

const apiRouter = require("./routes/api");
const chatRouter = require("./routes/chat-api");

const authRouter = require("./routes/user-auth");
const userRouter = require("./routes/user");

const adminAuthRouter = require("./routes/admin-auth");
const adminRouter = require("./routes/admin");

const analyticsRouter = require("./routes/analytics");

const app = express();

app.use("/api", require("./routes/webhooks"));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ADMIN_BASE_URL, process.env.CLIENT_BASE_URL],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/api", apiRouter);
app.use("/api", chatRouter);
app.use("/api/user/auth", authRouter);
app.use("/api/user", userRouter);

app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin", adminRouter);

app.use("/api/analytics", analyticsRouter);

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces and connect to database.
 */

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
}

// Start the server and connect to MongoDB
async function startServer() {
  await connectToDatabase();

  server.listen(port);
  const io = require("./utils/socket").init(server);
  io.on("connection", (socket) => {
    console.log(`New socket connection: ${socket.id}`);
  });
  server.on("error", onError);
  server.on("listening", onListening);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

startServer()
  .then(() => {
    console.log("Server started!");
  })
  .catch((err) => {
    console.error(err);
  });
