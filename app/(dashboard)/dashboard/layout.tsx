import DashboardLayout from "@/components/app-layouts/dashboard-layout/index";
import React from "react";

export default function DashboardMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
