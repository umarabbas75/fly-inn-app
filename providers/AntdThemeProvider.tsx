"use client";

import { ConfigProvider } from "antd";
import React from "react";
import { StyleProvider } from "@ant-design/cssinjs";
const AntdThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Custom theme configuration
  const antdTheme = {
    hashed: false,
    token: {
      colorPrimary: "#af2322",
      colorLink: "#c8102e",
      colorBgContainer: "#fff", // Set input background to white
      colorBgBase: "#fff", // Ensure all base backgrounds are white
      colorBorder: "#d9d9d9",
      colorText: "#666666",
      colorTextSecondary: "#999999",
      transitionDuration: "0.3s",
    },
    components: {
      Input: {
        hoverBorderColor: "#9ca3af", // Gray-400 on hover instead of red
        activeBorderColor: "#9ca3af", // Gray-500 when focused
        activeShadow: "0 0 0 2px rgba(156, 163, 175, 0.1)", // Gray shadow instead of red
      },
      InputNumber: {
        hoverBorderColor: "#9ca3af", // Gray-400 on hover
        activeBorderColor: "#9ca3af", // Gray-500 when focused
        activeShadow: "0 0 0 2px rgba(156, 163, 175, 0.1)", // Gray shadow
      },
      Select: {
        hoverBorderColor: "#9ca3af", // Gray-400 on hover
        activeBorderColor: "#9ca3af", // Gray-500 when focused
        activeShadow: "0 0 0 2px rgba(156, 163, 175, 0.1)", // Gray shadow
      },
      DatePicker: {
        hoverBorderColor: "#9ca3af", // Gray-400 on hover
        activeBorderColor: "#9ca3af", // Gray-500 when focused
        activeShadow: "0 0 0 2px rgba(156, 163, 175, 0.1)", // Gray shadow
      },
    },
  };

  return (
    <StyleProvider layer>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </StyleProvider>
  );
};

export default AntdThemeProvider;
