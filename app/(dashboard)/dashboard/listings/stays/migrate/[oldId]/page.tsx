"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Spin, Alert } from "antd";
import StaysForm from "../../stays-form/page";
import { transformOldListingToFormData } from "@/lib/transform-old-listing-to-form";
import { listingsStaticDataComplete } from "@/listing-static-data-complete";

const MigrateListingPage = () => {
  const params = useParams();
  const oldId = params?.oldId as string;
  const oldListingId = oldId ? parseInt(oldId, 10) : null;

  // Find the old listing data
  const oldListing = oldListingId
    ? listingsStaticDataComplete.find(
        (listing: any) => listing.id === oldListingId
      )
    : null;

  // Transform old listing to form format
  const formData = oldListing
    ? transformOldListingToFormData(oldListing, { hostId: 25 })
    : null;

  if (!oldListingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert
          message="Invalid Listing ID"
          description="Please provide a valid old listing ID in the URL"
          type="error"
        />
      </div>
    );
  }

  if (!oldListing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert
          message="Listing Not Found"
          description={`No listing found with ID: ${oldListingId}`}
          type="error"
        />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Pass transformed data as initialData to the form
  // Form will be in create mode (no stayId)
  return (
    <div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <h2 className="font-semibold text-blue-800">
          Migrating Listing: {oldListing.title}
        </h2>
        <p className="text-sm text-blue-600 mt-1">
          Old ID: {oldListing.id} | Review the data below and click &quot;Save
          as Draft&quot; when ready
        </p>
      </div>
      <StaysForm initialData={formData} />
    </div>
  );
};

export default MigrateListingPage;
