"use client";

import React from "react";
import BusinessListingPage from "@/app/(dashboard)/dashboard/listings/business/page";

const AdminBusinessPage = () => {
  return (
    <BusinessListingPage
      editRoute="/admin-dashboard/business/edit"
      addRoute="/admin-dashboard/business/add"
      isAdmin={true}
    />
  );
};

export default AdminBusinessPage;















