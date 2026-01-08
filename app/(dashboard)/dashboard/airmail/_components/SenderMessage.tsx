"use client";

import React from "react";
import { Tooltip } from "antd";
import { Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

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

interface SenderMessageProps {
  message: Message;
  chatId: number;
}

const SenderMessage: React.FC<SenderMessageProps> = ({ message }) => {
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return "";
    }
  };

  return (
    <div className="mb-4 flex justify-end">
      <div className="p-3 rounded-2xl rounded-tr-sm bg-[#AF2322] text-white shadow-md min-w-[120px] max-w-[75%]">
        <div className="flex flex-col gap-1">
          {/* Sender Name & Status */}
          <div className="flex justify-between items-center gap-3">
            <span className="capitalize font-medium text-sm text-white/90">
              {message.sender?.name || "You"}
            </span>
            <Tooltip
              title={message.status === "read" ? "Seen" : "Delivered"}
              placement="top"
            >
              {message.status === "read" ? (
                <Eye className="w-4 h-4 text-white/70" />
              ) : (
                <EyeOff className="w-4 h-4 text-white/50" />
              )}
            </Tooltip>
          </div>

          {/* Message Content */}
          <p className="break-words text-sm leading-relaxed m-0">
            {message.message}
          </p>
        </div>

        {/* Timestamp */}
        <span className="block text-xs text-white/60 mt-2 text-left">
          {message.created_at ? formatTime(message.created_at) : ""}
        </span>
      </div>
    </div>
  );
};

export default SenderMessage;


