import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "https://example.com"; // PRODUCTION UNCOMMENT, VICE VERSA

const SOCKET_URL = "http://localhost:3000"; // DEVELOPMENT UNCOMMENT, VICE VERSA

const socket: Socket = io(SOCKET_URL);

export default socket;
