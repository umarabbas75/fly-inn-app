"use client";

import { createContext, useContext } from "react";
import { App, message, ConfigProvider } from "antd";

const AppContext = createContext<{
  message: ReturnType<typeof message.useMessage>[0];
  modal: ReturnType<typeof App.useApp>["modal"];
} | null>(null);

export const AppMessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messageApi, messageContextHolder] = message.useMessage({
    top: 80, // Distance from top of viewport in pixels (default is 8)
    maxCount: 3, // Maximum number of messages to show at once
  });
  const { modal } = App.useApp();

  return (
    <AppContext.Provider value={{ message: messageApi, modal }}>
      <ConfigProvider
        theme={{
          components: {
            Message: {
              contentPadding: "12px 20px", // Larger padding (default is ~10px 16px)
              contentBg: "#ffffff",
            },
          },
        }}
      >
        {/* Wrapper to add custom styles for larger messages */}
        <style jsx global>{`
          .ant-message .ant-message-notice-content {
            font-size: 16px;
            padding: 14px 24px;
            border-radius: 10px;
            box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.12),
              0 3px 6px -4px rgba(0, 0, 0, 0.08);
          }
          .ant-message .ant-message-notice-content .anticon {
            font-size: 20px;
          }
        `}</style>
        {messageContextHolder}
      </ConfigProvider>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppMessageProvider");
  }
  return context;
};
