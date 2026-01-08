"use client";

import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";

interface ChatMainContentProps {
  selectedChatId: number;
  isChatActive: boolean;
}

const ChatMainContent: React.FC<ChatMainContentProps> = ({
  selectedChatId,
  isChatActive,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader selectedChatId={selectedChatId} />
      <ChatMessages selectedChatId={selectedChatId} />
      <ChatInput isChatActive={isChatActive} selectedChatId={selectedChatId} />
    </div>
  );
};

export default ChatMainContent;


