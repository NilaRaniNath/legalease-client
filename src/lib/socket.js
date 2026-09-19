import { io } from "socket.io-client";
import { BASE_URL } from "@/lib/api/client";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(BASE_URL, {
      autoConnect: false,
      transports: ["polling", "websocket"],
    });
  }
  return socket;
}