"use client";

import React from "react";
import StaysListingPage from "@/app/(dashboard)/dashboard/listings/stays/page";

const AdminStaysPage = () => {
  return (
    <StaysListingPage
      editRoute="/admin-dashboard/stays/edit"
      addRoute="/admin-dashboard/stays/add"
      settingsRoute="/admin-dashboard/stays/settings"
      isAdmin={true}
    />
  );
};

export default AdminStaysPage;
