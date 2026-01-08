import React from "react";
import ReduxProvider from "./ReduxProvider";
import QueryProvider from "./QueryClientProvider";
import AntdThemeProvider from "./AntdThemeProvider";
import { App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppMessageProvider } from "./AppMessageProvider";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { GoogleOAuthProvider } from "./GoogleOAuthProvider";
import NextAuthProvider from "./NextAuthProvider";
import { AuthProvider } from "./AuthProvider";
import { CompareProvider } from "./CompareProvider";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthProvider>
      <ReduxProvider>
        <QueryProvider>
          <AuthProvider>
            <CompareProvider>
              <AntdRegistry>
                <AntdThemeProvider>
                  <AppMessageProvider>
                    <GoogleOAuthProvider>
                      <GoogleMapsProvider>{children}</GoogleMapsProvider>
                    </GoogleOAuthProvider>
                  </AppMessageProvider>
                </AntdThemeProvider>
              </AntdRegistry>
            </CompareProvider>
          </AuthProvider>
        </QueryProvider>
      </ReduxProvider>
    </NextAuthProvider>
  );
};

export default AppProviders;
