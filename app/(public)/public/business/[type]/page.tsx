"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { Spin, Input, Button } from "antd";
import Link from "next/link";
import { DEFAULT_TYPE_ICONS } from "@/constants/business";
import NewsletterSection from "../../../_components/newsletter-section";
import BusinessDisclaimer from "../../../_components/business-disclaimer";
import { staticRecords } from "./_data/staticRecords";

interface Business {
  business_id: number;
  name: string;
  type: string;
  state?: string;
  country?: string;
  distance_from_runway?: string;
  airport?: string;
  business_logo?: string;
}

const BusinessTypeListing = () => {
  const params = useParams();
  const businessType = params?.type as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  // Format title based on business type
  const formatTitle = (type: string) => {
    if (type === "cfis") {
      return "CFIs";
    }
    if (type.includes("_") && type.split("_").length > 2) {
      return type
        .replace(/_(?=[^_]*$)/, " / ") // Replace the last underscore with a space and a slash
        .replace(/_/g, " ") // Replace all other underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
    }
    return type
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Format description text
  const formatDescription = (type: string) => {
    if (type === "shopping") {
      return "Shop for your favorite Products";
    }
    const title = formatTitle(type);
    return `Browse your favorite ${title}`;
  };

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);

      // If type is 'flying_clubs', use static data instead of API call
      if (businessType === "flying_clubs") {
        // Filter static data based on search query if any
        let filteredData = staticRecords;
        if (searchQuery.trim()) {
          filteredData = staticRecords.filter(
            (business) =>
              business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              business.state
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              business.country
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        }
        setBusinesses(filteredData as Business[]);
        setLoading(false);
        return;
      }

      // For other types, fetch from API
      const params = new URLSearchParams();
      params.append("type", businessType);
      params.append("limit", "2000");

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/business?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }
      const data = await response.json();
      console.log({ data });
      const fetchedBusinesses = data?.data?.businesses || [];
      setBusinesses(fetchedBusinesses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setLoading(false);
    }
  }, [searchQuery, businessType]);

  // Trigger fetch on page load and when search changes
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Group businesses by country and then by state
  const groupByCountryState = useMemo(() => {
    const groupedData: Record<string, Record<string, Business[]>> = {};

    businesses.forEach((business) => {
      const { country, state } = business;
      const countryKey = country || "Unknown";
      const stateKey = state || "Unknown";

      if (!groupedData[countryKey]) {
        groupedData[countryKey] = {};
      }
      if (!groupedData[countryKey][stateKey]) {
        groupedData[countryKey][stateKey] = [];
      }
      groupedData[countryKey][stateKey].push(business);
    });

    return groupedData;
  }, [businesses]);

  const handleSearch = () => {
    fetchBusinesses(); // Trigger the fetch with the current search query
  };

  // Get icon class for business type
  const iconClass =
    DEFAULT_TYPE_ICONS[businessType as keyof typeof DEFAULT_TYPE_ICONS] ||
    DEFAULT_TYPE_ICONS.default;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin
          size="large"
          tip="Loading the data, please wait. it can take time...."
        />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Search Field and Button */}
      <div className="flex justify-center gap-3 p-4">
        <Input
          type="text"
          placeholder="Search for a business by name, airport, country, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearch}
          className="!w-1/3"
          size="large"
        />
        <Button type="primary" onClick={handleSearch} size="large">
          Filter
        </Button>
      </div>

      <section
        style={{ backgroundColor: "#f6f8fa" }}
        id="sec1"
        data-scrollax-parent="true"
      >
        <div className="app-container">
          <div
            style={{ paddingTop: "50px", color: "#3B4249" }}
            className="section-title"
          >
            <h2 className="!text-left text-3xl font-bold">
              {formatTitle(businessType)}
            </h2>

            <p
              className="!text-left"
              style={{ fontSize: "15px", color: "#3B4249" }}
            >
              {formatDescription(businessType)} &nbsp; .
            </p>
          </div>

          {/* Loop through grouped data */}
          <div className="my-8 about-wrap">
            <div style={{ display: "flex", flexWrap: "wrap" }} className="row">
              {Object.keys(groupByCountryState).map((country) => (
                <div key={country} className="col-md-12">
                  <div style={{ paddingLeft: "0px" }} className="ab_text">
                    <div className="ab_text-title fl-wrap">
                      <h3
                        style={{
                          marginBottom: "15px",
                          color: "#3B4249",
                          textDecoration: "underline",
                        }}
                      >
                        {country}
                      </h3>
                      {Object.keys(groupByCountryState[country])
                        .sort()
                        .map((state) => (
                          <div
                            key={`${country}-${state}`}
                            className="col-md-3 !mr-0 !ml-0"
                            style={{
                              display: "inline-block",
                              verticalAlign: "top",
                              marginRight: "20px",
                              marginBottom: "20px",
                            }}
                          >
                            <h4
                              style={{
                                marginBottom: "10px",
                                color: "#3B4249",
                                textDecoration: "underline",
                                fontSize: "18px",
                              }}
                            >
                              {state}
                            </h4>
                            {groupByCountryState[country][state].map(
                              (business) => {
                                // Handle business_logo - it might be a full URL or a path
                                const logoUrl = business.business_logo
                                  ? business.business_logo.startsWith("http")
                                    ? business.business_logo
                                    : `https://s3.amazonaws.com/flyinn-app-bucket/${business.business_logo}`
                                  : null;

                                return (
                                  <div
                                    key={business.business_id}
                                    style={{ marginBottom: "15px" }}
                                  >
                                    <Link
                                      href={`/public/business/${businessType}/${business.business_id}`}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {logoUrl ? (
                                        <img
                                          src={logoUrl}
                                          alt={business.name}
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            marginRight: "10px",
                                            borderRadius: "5px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : (
                                        <i
                                          className={`fa ${iconClass} text-5xl`}
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            marginRight: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#3B4249",
                                          }}
                                        ></i>
                                      )}
                                      <p
                                        className="!m-0 flex flex-col"
                                        style={{
                                          fontSize: "16px",
                                          color: "#3B4249",
                                        }}
                                      >
                                        <span className="">
                                          {business.name}
                                        </span>
                                        {business?.distance_from_runway &&
                                          business?.airport && (
                                            <small>
                                              {`${business.distance_from_runway} miles away from ${business.airport}`}
                                            </small>
                                          )}
                                      </p>
                                    </Link>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <BusinessDisclaimer />
      <section className="bg-gray-100 mt-20">
        <div className="app-container py-12">
          <NewsletterSection />
        </div>
      </section>
    </div>
  );
};

export default BusinessTypeListing;
