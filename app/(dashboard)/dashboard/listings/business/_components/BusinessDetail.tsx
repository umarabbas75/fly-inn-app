"use client";

import React from "react";
import { Button } from "antd";
import { getBusinessSubTypeLabel } from "@/constants/business";

interface BusinessDetailProps {
  businessData: any;
  setIsModalOpen: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
}

const BusinessDetail: React.FC<BusinessDetailProps> = ({
  businessData,
  setIsModalOpen,
  setCurrentStep,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl">
      <h2 className="text-sm font-medium text-gray-900 mb-3">
        Business Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">Name</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.name || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">Type</span>
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(businessData?.type)
              ? businessData.type
              : [businessData?.type]
            ).map(
              (type: string, idx: number) =>
                type && (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full"
                  >
                    {getBusinessSubTypeLabel(type)}
                  </span>
                )
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">Hours of Operation</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.operational_hrs || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">Phone Number</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.phone || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1 sm:col-span-2">
          <span className="text-xs text-gray-600">Address</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.address || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">City</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.city || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">State</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.state || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">Country</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.country || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs text-gray-600">Airport</span>
          <span className="text-xs font-medium text-gray-900 break-words">
            {businessData?.airport || "-"}
          </span>
        </div>
        <div className="flex flex-col space-y-1 sm:col-span-2">
          <span className="text-xs text-gray-600">Website</span>
          <a
            href={businessData?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#AF2322] font-medium hover:underline break-all"
          >
            {businessData?.url || "-"}
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
        <Button
          type="primary"
          size="middle"
          className="bg-[#AF2322] text-white hover:bg-[#9e1f1a] text-sm w-full sm:w-auto"
          onClick={() => setCurrentStep(2)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BusinessDetail;
