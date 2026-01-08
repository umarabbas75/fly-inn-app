"use client";

import { useParams } from "next/navigation";
import BusinessForm from "@/app/(dashboard)/dashboard/listings/business/_components/BusinessForm";

const AdminEditBusinessPage = () => {
  const params = useParams();
  const businessId = params.id as string;

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Business (Admin)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Editing business as administrator
        </p>
      </div>

      <BusinessForm businessId={businessId} />
    </div>
  );
};

export default AdminEditBusinessPage;
