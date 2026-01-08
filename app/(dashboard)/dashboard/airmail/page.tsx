"use client";

import React, { useState, useEffect, Suspense } from "react";
import { MdOutlineChat } from "react-icons/md";
import { Skeleton } from "antd";
import { socket, connectSocket, SOCKET_EVENTS } from "@/lib/socket";
import { useAuth } from "@/providers/AuthProvider";
import ChatSidebar from "./_components/ChatSidebar";
import ChatMainContent from "./_components/ChatMainContent";

const AirMailContent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isChatActive, setIsChatActive] = useState(true);
  const { user, isLoading: isAuthLoading } = useAuth();

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (user?.id && !socket.connected) {
      connectSocket(user.id);
    }

    const onConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const onError = (error: any) => {
      console.error("Socket error:", error);
    };

    socket.on(SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    socket.on(SOCKET_EVENTS.ERROR, onError);

    // Set initial connection state
    setIsConnected(socket.connected);

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
      socket.off(SOCKET_EVENTS.ERROR, onError);
    };
  }, [user?.id]);

  // Show loading skeleton while auth is loading
  if (isAuthLoading) {
    return (
      <div className="h-[calc(100vh-140px)] flex bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="w-[35%] border-r border-gray-200 p-4">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
        <div className="flex-1 p-4">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  // Show connecting state
  if (!isConnected && user?.id) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <MdOutlineChat className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <p className="text-gray-500">Connecting to chat server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Chat Sidebar */}
      <ChatSidebar
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        setIsChatActive={setIsChatActive}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <ChatMainContent
            isChatActive={isChatActive}
            selectedChatId={selectedChatId}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <MdOutlineChat className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Welcome to AirMail
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Select a conversation from the sidebar to start messaging.
              <br />
              Your booking-related conversations will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Mobile: Show sidebar when no chat selected */}
      {!selectedChatId && (
        <div className="md:hidden fixed inset-0 bg-white z-50">
          <ChatSidebar
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            setIsChatActive={setIsChatActive}
          />
        </div>
      )}
    </div>
  );
};

export default function AirMailPage() {
  return (
    <div className="p-0 -mt-2 -mx-4">
      <Suspense
        fallback={
          <div className="h-[calc(100vh-140px)] flex bg-white rounded-lg shadow-sm overflow-hidden">
            <Skeleton active className="w-full h-full" />
          </div>
        }
      >
        <AirMailContent />
      </Suspense>
    </div>
  );
}
