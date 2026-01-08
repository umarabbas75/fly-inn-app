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

interface ReceiverMessageProps {
  message: Message;
}

const ReceiverMessage: React.FC<ReceiverMessageProps> = ({ message }) => {
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return "";
    }
  };

  return (
    <div className="mb-4 flex justify-start items-start">
      <div className="p-3 rounded-2xl rounded-tl-sm bg-white text-gray-800 shadow-md border border-gray-100 min-w-[120px] max-w-[75%]">
        <div className="flex flex-col gap-1">
          {/* Sender Name & Status */}
          <div className="flex justify-between items-center gap-3">
            <span className="capitalize font-medium text-sm text-gray-700">
              {message.sender?.name || "Unknown"}
            </span>
            <Tooltip
              title={message.status === "read" ? "Seen" : "Delivered"}
              placement="top"
            >
              {message.status === "read" ? (
                <Eye className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-300" />
              )}
            </Tooltip>
          </div>

          {/* Message Content */}
          <p className="break-words text-sm leading-relaxed m-0">
            {message.message}
          </p>
        </div>

        {/* Timestamp */}
        <span className="block text-xs text-gray-400 mt-2 text-right">
          {message.created_at ? formatTime(message.created_at) : ""}
        </span>
      </div>
    </div>
  );
};

export default ReceiverMessage;


