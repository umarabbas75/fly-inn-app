"use client";

import React, { useState, useMemo } from "react";
import { BUSINESS_SUBTYPES } from "@/constants/business";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import NewsletterSection from "../../_components/newsletter-section";
import BusinessDisclaimer from "../../_components/business-disclaimer";

const { Panel } = Collapse;

const BusinessMarketPlace = () => {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize all panels as active (open) by default
  const [activeKeys, setActiveKeys] = useState<string[]>(
    BUSINESS_SUBTYPES.map((_, index) => index.toString())
  );

  // Memoize the filtering logic for performance
  const filteredBusinessSubtypes = useMemo(() => {
    if (!searchQuery) {
      // If no search query, return all categories and their original subcategories
      return BUSINESS_SUBTYPES;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    return BUSINESS_SUBTYPES.map((group) => {
      // Filter subcategories within each group
      const filteredSubcategories = group.subcategories.filter(
        (sub) =>
          sub.label.toLowerCase().includes(lowerCaseQuery) ||
          sub.description?.toLowerCase().includes(lowerCaseQuery) // Optional: search by description too
      );

      // If category title itself matches OR any subcategory matches, include the category
      if (
        group.category.toLowerCase().includes(lowerCaseQuery) ||
        filteredSubcategories.length > 0
      ) {
        return {
          ...group,
          // If category title matches, show all its original subcategories (or you can show only filtered ones)
          // For now, if category title matches, we include all original subcategories for that group.
          // If only subcategories matched, we use the filteredSubcategories.
          subcategories: group.category.toLowerCase().includes(lowerCaseQuery)
            ? group.subcategories // If category name matches, show all its original subcategories
            : filteredSubcategories, // Otherwise, show only the filtered subcategories
        };
      }
      return null; // Exclude category if no match
    }).filter(Boolean) as typeof BUSINESS_SUBTYPES; // Remove null entries
  }, [searchQuery]); // Re-run filtering when searchQuery changes

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Title and Description */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Aviation Business Directory
          </h1>
          <p className="mt-3 text-lg text-gray-600 !text-center mx-auto max-w-2xl">
            Navigate the skies of opportunity. Discover specialized businesses
            across the aviation sector.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-lg mx-auto relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search business categories or types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF2322] focus:border-transparent transition-all duration-200 text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchOutlined className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Business Categories Grid (Two Accordions per Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBusinessSubtypes.length > 0 ? (
            filteredBusinessSubtypes.map((group, index) => {
              return (
                <div
                  key={group.category}
                  className="rounded-xl shadow-md border border-gray-100 overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200"
                >
                  <Collapse
                    activeKey={activeKeys}
                    onChange={(keys) => setActiveKeys(keys as string[])}
                    className="!border-none"
                    expandIcon={({ isActive }) => (
                      <i
                        className={`fa-solid fa-chevron-${
                          isActive ? "up" : "down"
                        } text-[#AF2322] transition-transform duration-300`}
                      />
                    )}
                  >
                    <Panel
                      key={index.toString()}
                      header={
                        <h3 className="text-xl font-semibold text-gray-900">
                          {group.category}
                        </h3>
                      }
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
                        {group.subcategories.map((sub) => {
                          // If there's a search query, only show subcategories that match it,
                          // unless the parent category itself was the primary match.
                          const subMatchesQuery =
                            !searchQuery ||
                            sub.label
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            sub.description
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase());

                          if (subMatchesQuery) {
                            return (
                              <Link
                                key={sub.type}
                                href={`/public/business/${sub.type}`}
                                className="group flex flex-col items-start text-left p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200"
                              >
                                <p className="text-base font-semibold text-gray-900 group-hover:text-[#AF2322] transition-colors duration-200 !mb-2">
                                  {sub.label}
                                </p>
                                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 leading-relaxed">
                                  {sub.description}
                                </p>
                              </Link>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              );
            })
          ) : (
            // No Results Found Message
            <div className="md:col-span-2 text-center py-8">
              <p className="text-lg text-gray-500">
                No business categories or types match your search.
              </p>
            </div>
          )}
        </div>
      </div>

      <section className="bg-gray-100 mt-20">
        <div className="app-container py-12">
          <NewsletterSection />
        </div>
      </section>

      <BusinessDisclaimer />
    </div>
  );
};

export default BusinessMarketPlace;
