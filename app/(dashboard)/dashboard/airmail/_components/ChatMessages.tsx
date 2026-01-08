"use client";

import React, { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { bffQuery } from "@/lib/bff-client";
import { useAuth } from "@/providers/AuthProvider";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

interface Message {
  message_id: number;
  chat_id: number;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  message: string;
  status: string;
  created_at: string;
}

interface ChatMessagesProps {
  selectedChatId: number;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ selectedChatId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages for the selected chat
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["chat-messages", selectedChatId],
    queryFn: () =>
      bffQuery<Message[]>(`/api/airmail/messages/${selectedChatId}`),
    enabled: !!selectedChatId,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });

    // Mark messages as read when chat is opened
    if (selectedChatId) {
      fetch(`/api/airmail/messages/${selectedChatId}/read`, {
        method: "PUT",
      }).catch(console.error);
    }
  }, [messages, selectedChatId]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <Skeleton.Input
                active
                style={{ width: 250, height: 60, borderRadius: 12 }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages && messages.length > 0 ? (
        messages.map((msg) =>
          msg.sender?.id === user?.id ? (
            <SenderMessage
              key={msg.message_id}
              message={msg}
              chatId={selectedChatId}
            />
          ) : (
            <ReceiverMessage key={msg.message_id} message={msg} />
          )
        )
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
      {/* Invisible div to keep scrolling to the last message */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;


