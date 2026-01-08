import type React from "react";
import AuthLayout from "@/components/app-layouts/auth-layout";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
