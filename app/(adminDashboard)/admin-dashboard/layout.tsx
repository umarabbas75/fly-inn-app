import AdminDashboardLayout from "@/components/app-layouts/admin-dashboard-layout/index";
import React from "react";

export default function AdminDashboardMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
