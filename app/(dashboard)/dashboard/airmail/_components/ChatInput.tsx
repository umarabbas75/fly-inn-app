"use client";

import React, { useState } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { socket, SOCKET_EVENTS } from "@/lib/socket";
import { useAuth } from "@/providers/AuthProvider";

interface ChatInputProps {
  selectedChatId: number;
  isChatActive: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  selectedChatId,
  isChatActive,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !user?.id) return;

    const newMessage = {
      message: message.trim(),
      sender_id: user.id,
      chat_id: selectedChatId,
    };

    try {
      setIsSending(true);
      console.log("Sending message:", newMessage);
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, newMessage);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!isChatActive) {
    return (
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="bg-red-50 border border-red-200 py-4 px-6 rounded-lg flex items-center justify-center">
          <span className="text-red-600 font-semibold text-lg">
            This conversation has been closed
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSend} className="flex items-center gap-3">
        <Input.TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="flex-1 rounded-lg border-gray-200 focus:border-[#AF2322] hover:border-[#AF2322]"
          disabled={isSending}
        />
        <Button
          type="primary"
          htmlType="submit"
          icon={<SendOutlined />}
          loading={isSending}
          disabled={!message.trim()}
          className="h-10 px-6"
          style={{
            backgroundColor: message.trim() ? "#AF2322" : undefined,
            borderColor: message.trim() ? "#AF2322" : undefined,
          }}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;


