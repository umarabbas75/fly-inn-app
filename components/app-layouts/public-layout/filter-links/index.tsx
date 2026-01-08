"use client";

import {
  CarOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  ApartmentOutlined,
  StarOutlined,
  BankOutlined,
  ShopOutlined,
  SearchOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import FiltersModal from "./components/filter-modal";
import { MdFlight } from "react-icons/md";
import { BUSINESS_SUBTYPES } from "@/constants/business";
import { usePathname } from "next/navigation";

type FilterType = "stays" | "business";

// Distance filter options matching the API
export type DistanceFromRunwayFilter = 0 | 1 | 3 | 7 | 8 | null;

interface FilterContextType {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  selectedBusinessSubtype: string | null;
  setSelectedBusinessSubtype: (subtype: string | null) => void;
  // Distance from runway filter
  distanceFromRunwayFilter: DistanceFromRunwayFilter;
  setDistanceFromRunwayFilter: (distance: DistanceFromRunwayFilter) => void;
  // Map visibility (for home page)
  isMapVisible: boolean;
  setIsMapVisible: (visible: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider");
  }
  return context;
};

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("stays");
  const [selectedBusinessSubtype, setSelectedBusinessSubtype] = useState<
    string | null
  >(null);
  const [distanceFromRunwayFilter, setDistanceFromRunwayFilter] =
    useState<DistanceFromRunwayFilter>(null);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(true);

  // Reset business subtype when switching away from business filter
  const handleSetSelectedFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
    if (filter !== "business") {
      setSelectedBusinessSubtype(null);
    }
  };

  // Reset distance filter when map becomes hidden
  const handleSetIsMapVisible = (visible: boolean) => {
    setIsMapVisible(visible);
    if (!visible) {
      setDistanceFromRunwayFilter(null);
    }
  };

  return (
    <FilterContext.Provider
      value={{
        selectedFilter,
        setSelectedFilter: handleSetSelectedFilter,
        selectedBusinessSubtype,
        setSelectedBusinessSubtype,
        distanceFromRunwayFilter,
        setDistanceFromRunwayFilter,
        isMapVisible,
        setIsMapVisible: handleSetIsMapVisible,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Distance from runway filter options with colors
const DISTANCE_OPTIONS = [
  { value: 0, label: "0 miles away", color: "#22c55e", bgLight: "#dcfce7" }, // Green
  { value: 1, label: "Within 1 Mile", color: "#eab308", bgLight: "#fef9c3" }, // Yellow
  { value: 3, label: "Within 3 Miles", color: "#ef4444", bgLight: "#fee2e2" }, // Red
  { value: 7, label: "Within 7 Miles", color: "#f97316", bgLight: "#ffedd5" }, // Orange
  { value: 8, label: "Over 7 Miles away", color: "#06b6d4", bgLight: "#cffafe" }, // Cyan
] as const;

const DistanceFromRunwayFilter = () => {
  const pathname = usePathname();
  const {
    selectedFilter,
    distanceFromRunwayFilter,
    setDistanceFromRunwayFilter,
    isMapVisible,
  } = useFilter();

  // Only show on home page, when map is visible, and stays filter is selected
  const isHomePage = pathname === "/" || pathname === "";
  if (!isHomePage || !isMapVisible || selectedFilter !== "stays") {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-100 shadow-sm">
      <div className="app-container">
        <div className="flex items-center justify-center gap-6 md:gap-10 py-3">
          {/* Title with icon */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-[#AF2322] to-[#8A1C1C] rounded-full" />
            <span className="text-sm font-bold text-gray-800 whitespace-nowrap tracking-tight">
              Distance From Runway
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gray-200" />

          {/* Distance options */}
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
            {DISTANCE_OPTIONS.map((option) => {
              const isSelected = distanceFromRunwayFilter === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    setDistanceFromRunwayFilter(
                      isSelected ? null : option.value
                    )
                  }
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full
                    transition-all duration-300 ease-out
                    border cursor-pointer
                    ${
                      isSelected
                        ? "shadow-md scale-105 border-transparent"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm hover:scale-[1.02]"
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? option.bgLight : undefined,
                    borderColor: isSelected ? option.color : undefined,
                  }}
                  title={option.label}
                >
                  {/* Animated dot */}
                  <div className="relative">
                    <div
                      className={`
                        w-3 h-3 rounded-full transition-all duration-300
                        ${isSelected ? "scale-110" : "group-hover:scale-105"}
                      `}
                      style={{
                        backgroundColor: option.color,
                        boxShadow: isSelected
                          ? `0 0 0 2px white, 0 0 0 3px ${option.color}40`
                          : `0 1px 2px ${option.color}30`,
                      }}
                    />
                    {/* Pulse animation when selected */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      text-xs font-medium whitespace-nowrap transition-colors duration-200
                      ${isSelected ? "text-gray-900" : "text-gray-600"}
                    `}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Clear filter button - animated appearance */}
          {distanceFromRunwayFilter !== null && (
            <button
              onClick={() => setDistanceFromRunwayFilter(null)}
              className="
                flex items-center gap-1.5 px-3 py-1.5
                bg-gray-800 hover:bg-gray-900 text-white
                text-xs font-medium rounded-full
                transition-all duration-200
                border-0 cursor-pointer
                shadow-sm hover:shadow-md
              "
            >
              <CloseOutlined className="text-[10px]" />
              Clear Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterLinks = () => {
  const { selectedFilter, setSelectedFilter } = useFilter();

  const filterItems = [
    {
      icon: <HomeOutlined />,
      label: "Stays",
      value: "stays" as FilterType,
      enabled: true,
    },
    {
      icon: <ShopOutlined />,
      label: "Business",
      value: "business" as FilterType,
      enabled: true,
    },
    {
      icon: <CarOutlined />,
      label: "Car Rentals",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <EnvironmentOutlined />,
      label: "Attractions",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <MdFlight />,
      label: "Flights",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <ApartmentOutlined />,
      label: "Vacation Homes",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <ApartmentOutlined />,
      label: "Apartments",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <StarOutlined />,
      label: "Resorts",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <HomeOutlined />,
      label: "Villas",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <BankOutlined />,
      label: "Hostels",
      value: "stays" as FilterType,
      enabled: false,
    },
    {
      icon: <BankOutlined />,
      label: "B&Bs",
      value: "stays" as FilterType,
      enabled: false,
    },
  ];

  return (
    <>
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="app-container">
          <div className="flex items-center justify-center md:justify-center gap-4 md:gap-8 py-2">
            {/* Scrollable filter links container - only on mobile */}
            <div className="flex-1 md:flex-none overflow-x-auto md:overflow-visible scrollbar-hide">
              <div className="flex items-center space-x-4 md:space-x-8 min-w-max md:min-w-0 px-2 md:px-0">
                {filterItems.map((item, index) => {
                  // Only mark as selected if item is enabled AND matches the selected filter
                  const isSelected =
                    item.enabled && selectedFilter === item.value;
                  const isEnabled = item.enabled;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-center flex-shrink-0 ${
                        isEnabled
                          ? "cursor-pointer group"
                          : "cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => {
                        if (
                          isEnabled &&
                          (item.value === "stays" || item.value === "business")
                        ) {
                          setSelectedFilter(item.value);
                        }
                      }}
                    >
                      <div
                        className={`p-1.5 md:p-2 rounded-full transition-all duration-200 ${
                          isEnabled
                            ? "transform group-hover:scale-[1.1] group-hover:bg-white group-hover:shadow-md"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-center transition-transform duration-200 text-base md:text-lg">
                          {React.cloneElement(item.icon, {
                            className: isSelected
                              ? "text-[#AF2322]"
                              : isEnabled
                              ? "text-black"
                              : "text-gray-400",
                          })}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] md:text-xs transition-colors duration-200 whitespace-nowrap ${
                          isSelected
                            ? "text-[#AF2322] font-semibold"
                            : isEnabled
                            ? "text-gray-700 group-hover:text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* here show the option to filter by distance from runwany */}
            {/* Filters Modal */}
            <div className="flex-shrink-0 ml-2 md:ml-0">
              <FiltersModal />
            </div>
          </div>
        </div>
      </div>
      {/* Distance from Runway Filter - only shows on home page when map is visible */}
      <DistanceFromRunwayFilter />
      <BusinessFilterLinks />
    </>
  );
};

const BusinessFilterLinks = () => {
  const {
    selectedFilter,
    selectedBusinessSubtype,
    setSelectedBusinessSubtype,
  } = useFilter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Flatten all subtypes for display
  const allSubtypes = useMemo(() => {
    return BUSINESS_SUBTYPES.flatMap((category) =>
      category.subcategories.map((sub) => ({
        ...sub,
        category: category.category,
      }))
    );
  }, []);

  // Filter subtypes based on search query (by label only)
  const filteredSubtypes = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return allSubtypes;
    return allSubtypes.filter((subtype) =>
      subtype.label.toLowerCase().includes(trimmedQuery)
    );
  }, [allSubtypes, searchQuery]);

  // Scroll to selected item on mount or when selection changes
  useEffect(() => {
    if (
      selectedBusinessSubtype &&
      selectedRef.current &&
      scrollContainerRef.current
    ) {
      const container = scrollContainerRef.current;
      const element = selectedRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (
        elementRect.left < containerRect.left ||
        elementRect.right > containerRect.right
      ) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedBusinessSubtype]);
  console.log({ filteredSubtypes });
  // Don't render if business filter is not selected
  if (selectedFilter !== "business") return null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      <div className="app-container py-3">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div
            className={`relative flex-shrink-0 transition-all duration-300 ${
              isSearchFocused ? "w-36 md:w-64" : "w-28 md:w-48"
            }`}
          >
            <div
              className={`flex items-center bg-white rounded-full border-1 transition-all duration-200 ${
                isSearchFocused
                  ? "border-[#AF2322] shadow-md shadow-[#AF2322]/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <SearchOutlined
                className={`ml-2 md:ml-3 text-xs md:text-sm transition-colors duration-200 ${
                  isSearchFocused ? "text-[#AF2322]" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full py-1.5 md:py-2 px-1.5 md:px-2 text-xs md:text-sm bg-transparent outline-none placeholder:text-gray-400 border-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mr-1.5 md:mr-2 p-0.5 md:p-1 text-sm rounded-full hover:bg-gray-100 transition-colors border-0 w-4 h-4 md:w-5 md:h-5 min-w-4 min-h-4 flex items-center justify-center"
                >
                  <CloseOutlined className="text-gray-400 text-[8px] md:text-[10px]" />
                </button>
              )}
            </div>
          </div>

          {/* Clear Filter Button (when a subtype is selected) */}
          {selectedBusinessSubtype && (
            <button
              onClick={() => setSelectedBusinessSubtype(null)}
              className="flex-shrink-0 border-0 flex items-center gap-1 px-2 py-1 bg-black text-white text-xs font-medium rounded-full hover:bg-[#8A1C1C] transition-all duration-200 shadow-sm"
            >
              <CloseOutlined className="text-[10px]" />
              Clear Filter
            </button>
          )}

          {/* Horizontally Scrollable Subtypes */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            key={`scroll-container-${searchQuery}-${filteredSubtypes.length}`}
          >
            <div className="flex items-center gap-1 min-w-max px-1 py-1">
              {filteredSubtypes.length === 0 ? (
                <div className="text-sm text-gray-500 py-2 px-4">
                  No businesses found matching "{searchQuery}"
                </div>
              ) : (
                filteredSubtypes.map((subtype) => {
                  const isSelected = selectedBusinessSubtype === subtype.type;
                  return (
                    <button
                      key={subtype.type}
                      ref={isSelected ? selectedRef : null}
                      onClick={() =>
                        setSelectedBusinessSubtype(
                          isSelected ? null : subtype.type
                        )
                      }
                      className={`flex items-center gap-2 px-2 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all duration-200 border-1 ${
                        isSelected
                          ? "bg-[#AF2322] text-white border-[#AF2322] shadow-md shadow-[#AF2322]/20"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#AF2322]/50 hover:text-[#AF2322] hover:shadow-sm"
                      }`}
                      title={subtype.description}
                    >
                      <i
                        className={`${subtype.icon} text-xs ${
                          isSelected ? "text-white" : "text-[#AF2322]"
                        }`}
                      />
                      <span>{subtype.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Results count when filtered */}
        {/* {searchQuery && filteredSubtypes.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Showing {filteredSubtypes.length} of {allSubtypes.length} business
            types
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FilterLinks;
