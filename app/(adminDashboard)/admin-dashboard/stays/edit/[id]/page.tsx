"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Spin } from "antd";
import { useApiGet } from "@/http-service";
import StaysForm from "@/app/(dashboard)/dashboard/listings/stays/stays-form/page";

const AdminEditStayPage = () => {
  const params = useParams();
  const stayId = params?.id as string;

  const {
    data: stayData,
    isLoading,
    error,
  } = useApiGet({
    endpoint: `/api/stays/${stayId}`,
    queryKey: ["admin-stay", stayId],
    config: {
      enabled: !!stayId,
      select: (res) => res?.stay || res?.data || res,
    },
  });

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

  return (
    <StaysForm stayId={stayId} initialData={stayData} showHostSelector={true} />
  );
};

export default AdminEditStayPage;
