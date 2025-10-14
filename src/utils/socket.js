import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_PORT, {
  transports: ["websocket", "polling"],
});

export default socket;