"use client";

import React, { useEffect, useState } from "react";
import { Input, Avatar, Skeleton, Badge } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { socket, SOCKET_EVENTS } from "@/lib/socket";
import { useAuth } from "@/providers/AuthProvider";
import { bffQuery } from "@/lib/bff-client";

interface Participant {
  id: number;
  name: string;
  email: string;
  image?: string;
}

interface LastMessage {
  message: string;
  status: string;
  created_at: string;
}

interface Chat {
  chat_id: number;
  participant_1: Participant;
  participant_2: Participant;
  last_message?: LastMessage;
  booking_id: number;
  status: "open" | "closed";
  unreadMessageCount: number;
}

interface ChatSidebarProps {
  selectedChatId: number | null;
  setSelectedChatId: (id: number | null) => void;
  setIsChatActive: (active: boolean) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChatId,
  setSelectedChatId,
  setIsChatActive,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  // Fetch user's chats
  const { data: chatsList, isLoading } = useQuery<Chat[]>({
    queryKey: ["user-chats", user?.id],
    queryFn: () => bffQuery<Chat[]>("/api/airmail/chats"),
    enabled: !!user?.id,
  });

  // Join all chat rooms when chats are loaded
  useEffect(() => {
    if (chatsList && chatsList.length > 0 && socket.connected) {
      chatsList.forEach((chat) => {
        socket.emit(SOCKET_EVENTS.JOIN_CHAT, chat.chat_id);
      });
    }
  }, [chatsList]);

  // Handle new messages
  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      console.log("New message received:", newMessage);

      // Update chat list with new message
      queryClient.setQueryData(["user-chats", user?.id], (old: Chat[] | undefined) => {
        if (!old) return old;
        return old.map((chat) => {
          if (chat.chat_id === newMessage.chat_id) {
            return {
              ...chat,
              last_message: {
                message: newMessage.message,
                status: newMessage?.newMessage?.status || "unread",
                created_at: newMessage?.newMessage?.created_at || new Date().toISOString(),
              },
              unreadMessageCount:
                selectedChatId === newMessage.chat_id
                  ? 0
                  : (chat.unreadMessageCount || 0) + 1,
            };
          }
          return chat;
        });
      });

      // If this chat is currently open, add message to messages list
      if (selectedChatId === newMessage.chat_id) {
        const updatedNewMessage = {
          message_id: newMessage?.message_id,
          chat_id: newMessage?.chat_id,
          sender: {
            id: newMessage?.newMessage?.sender_id,
            name: newMessage?.newMessage?.sender_name,
            email: "",
          },
          message: newMessage?.message,
          status: newMessage?.newMessage?.status,
          created_at: newMessage?.created_at,
        };

        queryClient.setQueryData(
          ["chat-messages", selectedChatId],
          (oldMessages: any[] | undefined) => {
            if (!oldMessages) return [updatedNewMessage];
            return [...oldMessages, updatedNewMessage];
          }
        );

        // Mark messages as read since chat is open
        fetch(`/api/airmail/messages/${selectedChatId}/read`, {
          method: "PUT",
        }).catch(console.error);
      }
    };

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    };
  }, [queryClient, user?.id, selectedChatId]);

  // Auto-select chat based on bookingId query param
  useEffect(() => {
    if (chatsList && chatsList.length > 0 && bookingId) {
      const currentChat = chatsList.find(
        (item) => item.booking_id === parseInt(bookingId)
      );
      if (currentChat?.chat_id) {
        setSelectedChatId(currentChat.chat_id);
        setIsChatActive(currentChat.status !== "closed");
      }
    }
  }, [chatsList, bookingId, setSelectedChatId, setIsChatActive]);

  const onSelectChat = (chat: Chat) => {
    // Reset unread count for selected chat
    queryClient.setQueryData(["user-chats", user?.id], (old: Chat[] | undefined) => {
      if (!old) return old;
      return old.map((oldChat) => {
        if (chat.chat_id === oldChat.chat_id) {
          return { ...oldChat, unreadMessageCount: 0 };
        }
        return oldChat;
      });
    });

    setIsChatActive(chat.status !== "closed");
    setSelectedChatId(chat.chat_id);
  };

  // Filter chats based on search term
  const filteredChats =
    chatsList?.filter((chat) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        chat.participant_1?.name?.toLowerCase().includes(searchLower) ||
        chat.participant_2?.name?.toLowerCase().includes(searchLower) ||
        chat.participant_1?.email?.toLowerCase().includes(searchLower) ||
        chat.participant_2?.email?.toLowerCase().includes(searchLower) ||
        chat.booking_id?.toString().includes(searchLower)
      );
    }) || [];

  // Get initials for avatar
  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-[35%] h-full border-r border-gray-200 overflow-y-auto hidden md:block bg-white">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} avatar active paragraph={{ rows: 2 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[35%] h-full border-r border-gray-200 overflow-y-auto hidden md:block bg-white">
      {/* Profile & Search Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <ProfileCard />
        <Input
          placeholder="Search chats..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4"
          allowClear
        />
      </div>

      {/* Chat List */}
      <ul className="h-full bg-white">
        {filteredChats.length === 0 ? (
          <li className="p-8 text-center text-gray-500">
            {searchTerm ? "No chats found" : "No conversations yet"}
          </li>
        ) : (
          filteredChats.map((chat) => (
            <li
              key={chat.chat_id}
              role="button"
              onClick={() => onSelectChat(chat)}
              className={`p-4 cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                selectedChatId === chat.chat_id ? "bg-[#fef2f2] border-l-4 border-l-[#AF2322]" : ""
              }`}
            >
              <div className="flex items-center">
                {/* Overlapping Avatars */}
                <div className="relative flex">
                  <Avatar
                    src={chat.participant_1?.image}
                    className="h-10 w-10 border-2 border-white shadow-sm"
                    style={{ backgroundColor: "#AF2322" }}
                  >
                    {getInitial(chat.participant_1?.name)}
                  </Avatar>
                  <Avatar
                    src={chat.participant_2?.image}
                    className="h-10 w-10 border-2 border-white shadow-sm -ml-3"
                    style={{ backgroundColor: "#1a1a1a" }}
                  >
                    {getInitial(chat.participant_2?.name)}
                  </Avatar>
                </div>

                {/* Chat Info */}
                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm font-semibold capitalize truncate ${
                        selectedChatId === chat.chat_id
                          ? "text-[#AF2322]"
                          : "text-gray-700"
                      }`}
                    >
                      {chat.participant_1?.name} - {chat.participant_2?.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {chat.last_message?.created_at
                        ? format(
                            new Date(chat.last_message.created_at),
                            "hh:mm a"
                          )
                        : ""}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {chat.last_message?.message || "No messages yet"}
                  </p>

                  <div className="flex justify-between items-center mt-1">
                    <button
                      className="text-xs text-[#AF2322] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/bookings/${chat.booking_id}`);
                      }}
                    >
                      Booking #{chat.booking_id}
                    </button>
                    <div className="flex items-center gap-2">
                      {chat.status === "closed" && (
                        <span className="text-xs text-red-500 font-medium">
                          Closed
                        </span>
                      )}
                      {chat.unreadMessageCount > 0 && (
                        <Badge
                          count={
                            chat.unreadMessageCount > 99
                              ? "99+"
                              : chat.unreadMessageCount
                          }
                          style={{ backgroundColor: "#AF2322" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

// Profile Card Component
const ProfileCard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton avatar active paragraph={{ rows: 1 }} />;
  }

  const displayName =
    user?.display_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "User";

  return (
    <div className="flex items-center py-2">
      <div className="relative">
        <Avatar
          src={user?.image}
          size={48}
          className="border-2 border-white shadow-sm"
          style={{ backgroundColor: "#AF2322" }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="ml-3">
        <h3 className="font-semibold text-gray-900 capitalize mb-0">
          {displayName}
        </h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
};

export default ChatSidebar;


