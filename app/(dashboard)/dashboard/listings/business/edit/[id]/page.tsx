"use client";

import React from "react";
import BusinessForm from "../../_components/BusinessForm";

interface EditBusinessPageProps {
  params: Promise<{ id: string }>;
}

const EditBusinessPage = async ({ params }: EditBusinessPageProps) => {
  const { id } = await params;
  return <BusinessForm businessId={id} />;
};

export default EditBusinessPage;
