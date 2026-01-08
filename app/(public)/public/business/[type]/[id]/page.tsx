"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Spin, Alert, Button, Card, Tag } from "antd";
import {
  PhoneOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ShareAltOutlined,
  LinkOutlined,
  DownloadOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useApiGet } from "@/http-service";
import {
  getBusinessSubTypeLabel,
  DEFAULT_TYPE_ICONS,
} from "@/constants/business";
import { HeroImagesSection } from "../../../stays/[id]/_components/hero-section";
import NewsletterSection from "../../../../_components/newsletter-section";
import BusinessDisclaimer from "../../../../_components/business-disclaimer";
import MenuCarousel from "./_components/menu-carousel";
import NearbyBusinesses from "./_components/nearby-businesses";
import { useApp } from "@/providers/AppMessageProvider";
import { FacebookOutlined, TwitterOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

const BusinessDetail = () => {
  const params = useParams();
  const businessId = params?.id as string;
  const businessType = params?.type as string;
  const { message: appMessage } = useApp();
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch business details from API
  const {
    data: businessData,
    isLoading,
    error,
  } = useApiGet({
    endpoint: `/business/${businessId}/public`,
    queryKey: ["business-details", businessId],
    config: {
      enabled: !!businessId,
    },
    axiosConfig: {
      baseURL: process.env.NEXT_PUBLIC_API_URI,
    },
  });

  const business = businessData?.data || businessData;

  // Get current page URL dynamically
  const currentUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  }, []);

  const handleShare = () => {
    const shareData = {
      title: business?.name || "Business",
      text: `Check out ${business?.name} on Fly-Inn!`,
      url: currentUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCopyLink = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      appMessage.success("Link copied to clipboard!");
    }
  };

  const handleShareFacebook = () => {
    if (currentUrl) {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`,
        "_blank"
      );
    }
  };

  const handleShareTwitter = () => {
    if (currentUrl) {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          currentUrl
        )}&text=${encodeURIComponent(
          business?.name || "Check out this business"
        )}`,
        "_blank"
      );
    }
  };

  const shareMenu = {
    items: [
      {
        key: "copyLink",
        label: "Copy link",
        icon: <LinkOutlined />,
        onClick: handleCopyLink,
      },
      {
        key: "facebook",
        label: "Share on Facebook",
        icon: <FacebookOutlined />,
        onClick: handleShareFacebook,
      },
      {
        key: "twitter",
        label: "Share on Twitter",
        icon: <TwitterOutlined />,
        onClick: handleShareTwitter,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading business details..." />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert
          message="Error Loading Business"
          description={
            error
              ? "There was an error loading the business details."
              : "The business you're looking for could not be found or has been removed."
          }
          type="error"
          showIcon
          action={
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          }
        />
      </div>
    );
  }

  const businessImages = business?.images?.filter(
    (item: any) => item?.type === "photo"
  );
  const menuImages = business?.images?.filter(
    (item: any) => item?.type === "menu"
  );

  // Get icon class for business type
  const iconClass =
    DEFAULT_TYPE_ICONS[business?.type as keyof typeof DEFAULT_TYPE_ICONS] ||
    DEFAULT_TYPE_ICONS.default;

  // Parse discounts
  let business_discounts: Array<{ title: string; description: string }> = [];
  if (business?.discounts) {
    // Check if discounts is already an array (from backend) or a string that needs parsing
    if (typeof business.discounts === "string") {
      try {
        business_discounts = JSON.parse(business.discounts);
      } catch (error) {
        business_discounts = [];
      }
    } else if (Array.isArray(business.discounts)) {
      business_discounts = business.discounts;
    }
  }

  // Get logo URL - use business_logo if available, otherwise first image
  const logoUrl =
    business?.business_logo ||
    (businessImages && businessImages.length > 0
      ? businessImages[0]?.url || businessImages[0]?.image
      : null);

  return (
    <div className="py-12">
      <main className="app-container">
        {/* Hero Images Section */}
        {businessImages && businessImages.length > 0 && (
          <HeroImagesSection images={businessImages} />
        )}

        {/* Business Header Card */}
        <Card className="mt-8 shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logoUrl ? (
                <img
                  src={
                    logoUrl.startsWith("http")
                      ? logoUrl
                      : `https://s3.amazonaws.com/flyinn-app-bucket/${logoUrl}`
                  }
                  alt="Business Logo"
                  className="w-28 h-28 object-cover rounded-xl "
                />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300 shadow-inner">
                  <i className={`fa ${iconClass} text-5xl`}></i>
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-gray-900">
                    {business?.name}
                  </h1>
                  {business?.tag_line && (
                    <div className="text-lg text-gray-600 mb-3 max-w-2xl">
                      {business.tag_line}
                    </div>
                  )}

                  {/* Business Type Badge */}
                  {business?.type && (
                    <div className="mb-3">
                      <Tag
                        color="#AF2322"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border-0 shadow-sm"
                        style={{
                          backgroundColor: "#AF2322",
                          color: "white",
                        }}
                      >
                        <i className={`fa ${iconClass} text-base`}></i>
                        <span>{getBusinessSubTypeLabel(business.type)}</span>
                      </Tag>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-700 mb-6">
                    <EnvironmentOutlined className="text-gray-500" />
                    <span className="text-gray-600">{business?.address}</span>
                  </div>
                </div>

                {/* Share Button */}
                <div className="flex-shrink-0">
                  <Dropdown menu={shareMenu} trigger={["click"]}>
                    <Button
                      icon={<ShareAltOutlined />}
                      className="flex items-center gap-2"
                    >
                      Share
                    </Button>
                  </Dropdown>
                </div>
              </div>

              {/* Info Row */}
              <div className="flex flex-wrap gap-3 mt-4">
                {/* Phone */}
                {business?.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                  >
                    <PhoneOutlined className="text-gray-600" />
                    <span className="font-medium text-gray-700">
                      {business.phone}
                    </span>
                  </a>
                )}

                {/* Operational Hours */}
                {business?.operational_hrs && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <ClockCircleOutlined className="text-gray-600" />
                    <span className="text-gray-700">
                      {business.operational_hrs}
                    </span>
                  </div>
                )}

                {/* Distance from Runway */}
                {business?.distance_from_runway && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <EnvironmentOutlined className="text-gray-600" />
                    <span className="text-gray-700">
                      {business.distance_from_runway} miles from{" "}
                      {business?.airport}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        {business?.business_details && (
          <Card className="mt-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
              About {business?.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {business.business_details}
            </p>
          </Card>
        )}

        {/* Discounts Section */}
        {(() => {
          // Filter out discounts with empty title or description
          const validDiscounts =
            business_discounts?.filter(
              (discount) =>
                discount?.title?.trim() && discount?.description?.trim()
            ) || [];

          return validDiscounts.length > 0 ? (
            <Card className="mt-8 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TagOutlined className="text-gray-700" />
                Available Discounts
              </h2>
              <div className="space-y-3">
                {validDiscounts.map((discount, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-[#AF2322] bg-gray-50 p-4 rounded-r-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-[#AF2322] bg-opacity-10 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-800 mb-1">
                          {discount.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {discount.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null;
        })()}

        {/* Menu Section */}
        {menuImages && menuImages.length > 0 && (
          <div className="mt-8">
            <MenuCarousel
              menuImages={menuImages}
              onImageClick={setSelectedImage}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-20 justify-center">
          {/* Contact Button */}
          {business?.phone && (
            <a
              href={`tel:${business.phone}`}
              className="relative group min-w-[300px] flex items-center justify-center gap-3 px-8 py-4 border-2 border-[#AF2322] rounded-xl text-[#AF2322] font-bold hover:text-white transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#AF2322] to-[#9e1f1a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0"></div>
              <PhoneOutlined className="text-lg z-10" />
              <span className="z-10 group-hover:text-white">
                Contact {business?.name}
              </span>
            </a>
          )}

          {/* Book Now / Visit Website Button */}
          {business?.url && (
            <Button
              onClick={() => window.open(business.url, "_blank")}
              className="relative min-w-[300px] group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#AF2322] to-[#9e1f1a] rounded-xl text-white font-bold hover:shadow-xl transition-all duration-300 h-auto"
              size="large"
            >
              <LinkOutlined className="text-lg" />
              <span>Visit Website</span>
            </Button>
          )}
        </div>

        {/* Nearby Businesses */}
        {business?.nearbyBusinesses &&
          business?.nearbyBusinesses?.length > 0 && (
            <div className="mt-8">
              <NearbyBusinesses
                nearbyBusinesses={business.nearbyBusinesses}
                currentType={businessType}
              />
            </div>
          )}
      </main>

      <section className="bg-gray-100 mt-20">
        <div className="app-container py-12">
          <NewsletterSection />
        </div>
      </section>

      <BusinessDisclaimer />

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[99999] px-4">
          <div className="relative bg-white rounded-xl overflow-hidden max-w-3xl w-full">
            {/* Close Button */}
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full z-10"
            />

            {/* Image */}
            <img
              src={selectedImage}
              alt="Menu Full"
              className="w-full h-[70vh] object-contain bg-black"
            />

            {/* Download Button */}
            <div className="p-4 bg-white flex justify-end">
              <a
                href={selectedImage}
                download
                className="inline-flex items-center gap-2 bg-[#AF2322] text-white px-4 py-2 rounded hover:bg-[#9e1f1a] transition"
              >
                <DownloadOutlined />
                Download Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetail;
