"use client";
import {
  setDestination,
  setOpenDropdown,
} from "../../../../../redux/slices/filter-slice";
import { RootState } from "../../../../../redux/store";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApiGet } from "@/http-service";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CitiesResponse {
  status: boolean;
  message: string;
  data: Record<string, string>;
}

const DestinationDropdown = () => {
  const [search, setSearch] = useState("");
  const currentId = "userMenu";
  const dispatch = useDispatch();
  const { destination, openDropdown } = useSelector(
    (state: RootState) => state.filters
  );

  // API call to fetch cities
  const {
    data: citiesData,
    isLoading,
    error,
  } = useApiGet<CitiesResponse>({
    endpoint: "/api/stays/cities",
    queryKey: ["cities"],
  });

  // Extract cities from API response
  const cities = useMemo(() => {
    if (!citiesData) return [];
    return Object.values(citiesData);
  }, [citiesData]);

  console.log({ citiesData });

  const filteredCities = useMemo(() => {
    return cities.filter((city) =>
      city.toLowerCase().includes(search.toLowerCase())
    );
  }, [cities, search]);

  const handleOpenChange = (open: boolean) => {
    dispatch(setOpenDropdown(open ? currentId : null));
  };

  const handleCitySelect = (city: string) => {
    dispatch(setDestination(city));
    dispatch(setOpenDropdown(null));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setDestination(""));
  };

  const hasSelection = Boolean(destination && destination.trim());

  return (
    <Popover open={openDropdown === currentId} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "relative rounded-full text-sm min-w-[200px] hover:bg-gray-200 hover:rounded-full flex gap-2 items-center py-4 px-4 cursor-pointer transition",
            hasSelection ? "text-gray-900 font-medium" : "text-gray-500"
          )}
        >
          <span>{destination || "Destination"}</span>
          {hasSelection && (
            <button
              onClick={handleClear}
              className="hover:bg-gray-300 border-0 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[340px] bg-white rounded-2xl shadow-xl border-0 p-0"
        align="start"
        sideOffset={12}
      >
        <div className="p-5 space-y-4">
        <h3 className="text-base font-semibold mb-3">Where are you going?</h3>
        <input
          type="text"
          placeholder="Search destinations"
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="max-h-[200px] overflow-y-auto">
          {isLoading ? (
            <div className="text-gray-400 p-2">Loading cities...</div>
          ) : error ? (
            <div className="p-2">
              <p className="text-sm text-red-600 mb-2">
                {(error as any)?.response?.data?.message ||
                  (error as any)?.message ||
                  "Unable to load cities. Please try again."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          ) : filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </div>
            ))
          ) : (
            <div className="text-gray-400 p-2">No results found</div>
          )}
          </div>

          {/* Clear / Done buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => dispatch(setDestination(""))}
              className="text-sm text-gray-500 hover:text-gray-900 underline-offset-2 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={() => dispatch(setOpenDropdown(null))}
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DestinationDropdown;
