"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Spin } from "antd";
import { CloseOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Image from "next/image";
import {
  FaBed,
  FaBath,
  FaUser,
  FaPlane,
  FaMapMarkerAlt,
  FaDollarSign,
  FaHome,
  FaRuler,
} from "react-icons/fa";
import { useQueries } from "@tanstack/react-query";
import { useCompare } from "@/providers/CompareProvider";

const CompareStaysPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCompare, removeFromCompare } = useCompare();
  const ids =
    searchParams.get("ids")?.split(",").filter(Boolean).map(Number) || [];

  // Fetch each stay individually using useQueries from public API
  const stayQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["stay-public", id],
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URI}/stays/${id}/public`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stay");
        }
        return response.json();
      },
      enabled: !!id,
    })),
  });

  const isLoading = stayQueries.some((query) => query.isLoading);
  const stays = stayQueries.map((query) => query.data).filter(Boolean);

  useEffect(() => {
    // Redirect if no IDs provided
    if (ids.length === 0) {
      router.push("/");
    }
  }, [ids, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (stays.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">No stays found to compare</p>
        <Button type="primary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const comparisonRows = [
    {
      label: "Image",
      icon: <FaHome />,
      getValue: (stay: any) => (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image
            src={stay.images?.[0]?.url || stay.image || "/placeholder.jpg"}
            alt={stay.title || stay.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ),
    },
    {
      label: "Title",
      icon: <FaHome />,
      getValue: (stay: any) => (
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            {stay.title || stay.name}
          </h3>
          <a
            href={`/public/stays/${stay.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#AF2322] hover:underline"
          >
            View Details →
          </a>
        </div>
      ),
    },
    {
      label: "Location",
      icon: <FaMapMarkerAlt />,
      getValue: (stay: any) =>
        stay.city && stay.state
          ? `${stay.city}, ${stay.state}`
          : stay.address || stay.location || "N/A",
    },
    {
      label: "Price per Night",
      icon: <FaDollarSign />,
      getValue: (stay: any) => (
        <span className="text-lg font-bold text-[#AF2322]">
          ${stay.nightly_price || stay.price}
        </span>
      ),
    },
    {
      label: "Bedrooms",
      icon: <FaBed />,
      getValue: (stay: any) => stay.no_of_bedrooms || stay.beds || "N/A",
    },
    {
      label: "Bathrooms",
      icon: <FaBath />,
      getValue: (stay: any) => stay.no_of_bathrooms || stay.baths || "N/A",
    },
    {
      label: "Max Guests",
      icon: <FaUser />,
      getValue: (stay: any) => stay.no_of_guest || stay.guests || "N/A",
    },
    {
      label: "Nearest Airport",
      icon: <FaPlane />,
      getValue: (stay: any) => {
        const airport = stay.airports?.[0];
        return airport ? (
          <div>
            <p className="font-semibold">{airport.identifier}</p>
            <p className="text-xs text-gray-500">
              {airport.distance_from_runway} mi away
            </p>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      label: "Size",
      icon: <FaRuler />,
      getValue: (stay: any) =>
        stay.size && stay.unit_of_measure
          ? `${stay.size} ${stay.unit_of_measure}`
          : "N/A",
    },
    {
      label: "Type of Space",
      icon: <FaHome />,
      getValue: (stay: any) => stay.type_of_space || "N/A",
    },
    {
      label: "Lodging Type",
      icon: <FaHome />,
      getValue: (stay: any) => stay.lodging_type || "N/A",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="app-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              className="flex items-center"
            >
              Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Compare Stays ({stays.length})
            </h1>
          </div>
          <Button
            onClick={() => {
              clearCompare();
              router.push("/");
            }}
            danger
          >
            Clear All
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-48">
                    Features
                  </th>
                  {stays.map((stay: any) => (
                    <th
                      key={stay.id}
                      className="px-6 py-4 text-center relative min-w-[280px]"
                    >
                      <button
                        onClick={() => {
                          removeFromCompare(stay.id);
                          if (stays.length <= 1) {
                            router.push("/");
                          }
                        }}
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors border border-gray-200"
                      >
                        <CloseOutlined className="text-xs text-gray-600 hover:text-red-600" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-b border-gray-100 ${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-700 bg-gray-50/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[#AF2322]">{row.icon}</span>
                        <span className="text-sm">{row.label}</span>
                      </div>
                    </td>
                    {stays.map((stay: any) => (
                      <td
                        key={stay.id}
                        className="px-6 py-4 text-center text-sm text-gray-600"
                      >
                        {typeof row.getValue(stay) === "string" ||
                        typeof row.getValue(stay) === "number"
                          ? row.getValue(stay)
                          : row.getValue(stay)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button size="large" onClick={() => router.back()}>
            Continue Browsing
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              clearCompare();
              router.push("/");
            }}
            className="bg-[#AF2322] hover:!bg-[#8A1C1C] border-none"
            style={{ backgroundColor: "#AF2322" }}
          >
            Clear Comparison
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareStaysPage;
