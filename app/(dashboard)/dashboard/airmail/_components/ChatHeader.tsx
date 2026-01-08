"use client";

import React from "react";
import { Avatar, Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import { bffQuery } from "@/lib/bff-client";
import { useAuth } from "@/providers/AuthProvider";

interface Participant {
  id: number;
  name: string;
  email: string;
  image?: string;
}

interface Chat {
  chat_id: number;
  participant_1: Participant;
  participant_2: Participant;
  booking_id: number;
  status: "open" | "closed";
}

interface ChatHeaderProps {
  selectedChatId: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChatId }) => {
  const { user } = useAuth();

  // Fetch chats to get current chat info
  const { data: chatsList, isLoading } = useQuery<Chat[]>({
    queryKey: ["user-chats", user?.id],
    queryFn: () => bffQuery<Chat[]>("/api/airmail/chats"),
    enabled: !!user?.id,
  });

  const currentChat = chatsList?.find(
    (chat) => chat.chat_id === selectedChatId
  );

  if (isLoading || !currentChat) {
    return (
      <div className="w-full p-4 bg-white border-b border-gray-200 shadow-sm">
        <Skeleton avatar active paragraph={{ rows: 0 }} />
      </div>
    );
  }

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="w-full p-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between">
      {/* User Info Section */}
      <div className="flex items-center space-x-4">
        {/* Overlapping Avatars */}
        <div className="relative flex items-center">
          <Avatar
            src={currentChat.participant_1?.image}
            size={48}
            className="border-2 border-white shadow-md"
            style={{ backgroundColor: "#AF2322" }}
          >
            {getInitial(currentChat.participant_1?.name)}
          </Avatar>
          <Avatar
            src={currentChat.participant_2?.image}
            size={48}
            className="border-2 border-white shadow-md -ml-4"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            {getInitial(currentChat.participant_2?.name)}
          </Avatar>
        </div>

        {/* Participant Names */}
        <div>
          <span className="text-base font-semibold capitalize text-gray-700">
            {currentChat.participant_1?.name} - {currentChat.participant_2?.name}
          </span>
          <p className="text-sm text-gray-500 m-0">
            Booking #{currentChat.booking_id}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      {currentChat.status === "closed" && (
        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
          Closed
        </span>
      )}
    </div>
  );
};

export default ChatHeader;


