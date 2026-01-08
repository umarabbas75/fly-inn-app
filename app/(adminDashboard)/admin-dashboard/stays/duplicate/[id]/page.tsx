"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Spin } from "antd";
import { useApiGet } from "@/http-service";
import StaysForm from "@/app/(dashboard)/dashboard/listings/stays/stays-form/page";

const AdminDuplicateStayPage = () => {
  const params = useParams();
  const stayId = params?.id as string;

  const {
    data: stayData,
    isLoading,
    error,
  } = useApiGet({
    endpoint: `/api/stays/${stayId}`,
    queryKey: ["admin-stay", stayId, "duplicate"],
    config: {
      enabled: !!stayId,
      select: (res) => {
        const stay = res?.stay || res?.data || res;
        // Remove images, ID, and is_featured for duplication
        // Also remove created_at, updated_at, and status to start fresh
        const {
          images,
          id,
          created_at,
          updated_at,
          status,
          is_featured,
          ...duplicatedData
        } = stay;
        // Explicitly set is_featured to false for duplicated stay
        return { ...duplicatedData, is_featured: false };
      },
    },
  });
  console.log("admin duplicate stay data", stayData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading stay data</div>
      </div>
    );
  }

  // Pass data without stayId so it's in create mode (not edit mode)
  // Include showHostSelector for admin
  return <StaysForm initialData={stayData} showHostSelector={true} />;
};

export default AdminDuplicateStayPage;
