"use client";

import { io, Socket } from "socket.io-client";

// Socket.io client configuration
const SOCKET_URL = process.env.NEXT_PUBLIC_AIRMAIL_URL || "http://localhost:3001";

// Create socket instance
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect automatically, we'll connect manually when needed
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ["websocket", "polling"],
});

// Socket connection helpers
export const connectSocket = (userId: number | string) => {
  if (!socket.connected) {
    socket.auth = { userId };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Export socket events for type safety
export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_CHAT: "joinChat",
  LEAVE_CHAT: "leaveChat",
  SEND_MESSAGE: "sendMessage",
  NEW_MESSAGE: "newMessage",
  MESSAGE_READ: "messageRead",
  TYPING: "typing",
  STOP_TYPING: "stopTyping",
  ERROR: "error",
} as const;


