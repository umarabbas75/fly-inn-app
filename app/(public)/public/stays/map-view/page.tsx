"use client";

import React, { useState } from "react";
import { Card, Input, Button, Space, Divider } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import StaysMap from "@/components/shared/StaysMap";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

const lodgingTypeOptions: SearchableSelectOption[] = [
  { label: "House", value: "House" },
  { label: "Apartment", value: "Apartment" },
  { label: "Cabin", value: "Cabin" },
  { label: "Villa", value: "Villa" },
];

const priceRangeOptions: SearchableSelectOption[] = [
  { label: "$0 - $100", value: "0-100" },
  { label: "$100 - $200", value: "100-200" },
  { label: "$200 - $300", value: "200-300" },
  { label: "$300 - $500", value: "300-500" },
  { label: "$500+", value: "500-1000" },
];

const MapViewPage = () => {
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim()) {
      setQueryParams((prev) => ({
        ...prev,
        "address.state[or]": JSON.stringify([searchInput.trim()]),
      }));
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setQueryParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setQueryParams({});
    setSearchInput("");
  };

  return (
    <div className="app-container my-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stays Map View
        </h1>
        <p className="text-gray-600">
          Explore stays on an interactive map with advanced filtering
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by city or state..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              size="large"
            />
          </div>

          <Space>
            <div style={{ width: 150 }}>
              <SearchableSelect
                placeholder="Lodging Type"
                options={lodgingTypeOptions}
                onValueChange={(val) => {
                  const value =
                    typeof val === "string"
                      ? val
                      : Array.isArray(val)
                      ? val[0]
                      : undefined;
                  handleFilterChange("stay_type", value);
                }}
                showSearch={false}
              />
            </div>

            <div style={{ width: 150 }}>
              <SearchableSelect
                placeholder="Price Range"
                options={priceRangeOptions}
                onValueChange={(val) => {
                  const value =
                    typeof val === "string"
                      ? val
                      : Array.isArray(val)
                      ? val[0]
                      : undefined;
                  if (value) {
                    const [min, max] = value.split("-");
                    handleFilterChange("pricing.nightly_price[gte]", min);
                    handleFilterChange("pricing.nightly_price[lte]", max);
                  } else {
                    handleFilterChange("pricing.nightly_price[gte]", undefined);
                    handleFilterChange("pricing.nightly_price[lte]", undefined);
                  }
                }}
                showSearch={false}
              />
            </div>

            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              size="large"
            >
              Search
            </Button>

            <Button
              icon={<FilterOutlined />}
              onClick={clearFilters}
              size="large"
            >
              Clear
            </Button>
          </Space>
        </div>

        {/* Active Filters Display */}
        {Object.keys(queryParams).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {Object.entries(queryParams).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Map */}
      <div className="h-[700px]">
        <StaysMap
          queryParams={queryParams}
          height="700px"
          onStayClick={(stay) => {
            console.log("Stay clicked:", stay);
            // You can navigate to stay details here
            // router.push(`/public/stays/${stay.id}`);
          }}
        />
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold mb-3">How to use the map:</h3>
        <ul className="text-gray-600 space-y-2">
          <li>
            • <strong>Search:</strong> Enter a city or state name to filter
            stays by location
          </li>
          <li>
            • <strong>Filters:</strong> Use the dropdown filters to narrow down
            your search
          </li>
          <li>
            • <strong>Map Interaction:</strong> Click on markers to see stay
            details
          </li>
          <li>
            • <strong>Zoom:</strong> Use mouse wheel or zoom controls to explore
            different areas
          </li>
          <li>
            • <strong>Pan:</strong> Click and drag to move around the map
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default MapViewPage;
