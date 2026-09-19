import { io } from "socket.io-client";
import { getBaseURL } from "@/lib/api/client";

let socket = null;

export async function getSocket() {
  if (!socket) {
    const base = await getBaseURL();
    socket = io(base, {
      autoConnect: false,
      transports: ["polling", "websocket"],
    });
  }
  return socket;
}