"use client";

import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";
import React from "react";

export function GoogleOAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    "";

  // if (!clientId) {
  //   console.error("Google Client ID is not defined in environment variables");
  //   return <>{children}</>;
  // }

  return (
    <GoogleProvider clientId="353769498177-22m10lkgb1omls5dnuked75dlfl9tp5a.apps.googleusercontent.com">
      {children}
    </GoogleProvider>
  );
}
