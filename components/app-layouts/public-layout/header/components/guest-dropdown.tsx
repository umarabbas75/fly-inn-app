"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  updateGuestCount,
  resetGuests,
} from "../../../../../redux/slices/filter-slice";
import { RootState } from "../../../../../redux/store";
import { cn } from "@/lib/utils";

const guestTypes = [
  { key: "adults", label: "Adults", description: "Ages 13 or above" },
  // { key: "children", label: "Children", description: "Ages 2 – 12" },
  // { key: "infants", label: "Infants", description: "Under 2" },
  { key: "pets", label: "Pets", description: "" },
];

export default function AddGuestsDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { guests, destination, dates, lodgingType, price } = useSelector(
    (state: RootState) => state.filters
  );

  const updateCount = (type: keyof typeof guests, delta: number) => {
    const newValue = Math.max(0, guests[type] + delta);
    dispatch(updateGuestCount({ type, value: newValue }));
  };

  const hasSelection =
    guests.adults > 0 ||
    guests.children > 0 ||
    guests.infants > 0 ||
    guests.pets > 0;

  // Build label like "2 adults, 1 child, 1 infant, 2 pets"
  const getLabel = () => {
    if (!hasSelection) return "Add guests";

    const parts: string[] = [];
    if (guests.adults > 0) {
      parts.push(`${guests.adults} adult${guests.adults > 1 ? "s" : ""}`);
    }
    if (guests.children > 0) {
      parts.push(
        `${guests.children} ${guests.children > 1 ? "children" : "child"}`
      );
    }
    if (guests.infants > 0) {
      parts.push(`${guests.infants} infant${guests.infants > 1 ? "s" : ""}`);
    }
    if (guests.pets > 0) {
      parts.push(`${guests.pets} pet${guests.pets > 1 ? "s" : ""}`);
    }
    return parts.join(", ");
  };

  const label = getLabel();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(resetGuests());
  };

  const handleSearch = () => {
    // Build query parameters matching backend API format
    const queryParams = new URLSearchParams();

    // Add city (destination)
    if (destination && destination.trim()) {
      queryParams.append("city", destination.trim());
    }

    // Add dates
    if (dates?.start && dates?.end) {
      queryParams.append("arrival_date", dates.start);
      queryParams.append("departure_date", dates.end);
    }

    // Add lodging type
    if (lodgingType && lodgingType.trim()) {
      queryParams.append("stay_type", lodgingType.trim());
    }

    // Add guests (adults count)
    if (guests?.adults && guests.adults > 0) {
      queryParams.append("guests", guests.adults.toString());
    }

    // Add children
    if (guests?.children && guests.children > 0) {
      queryParams.append("children", guests.children.toString());
    }

    // Add infants
    if (guests?.infants && guests.infants > 0) {
      queryParams.append("infants", guests.infants.toString());
    }

    // Add pets
    if (guests?.pets && guests.pets > 0) {
      queryParams.append("pets", guests.pets.toString());
    }

    // Add price range
    if (price?.min !== null && price?.min !== undefined) {
      queryParams.append("min_price", price.min.toString());
    }
    if (price?.max !== null && price?.max !== undefined) {
      queryParams.append("max_price", price.max.toString());
    }

    // Navigate to search page with query parameters
    const searchUrl = `/public/stays/stay-search?${queryParams.toString()}`;
    router.push(searchUrl);
  };

  // Check if search should be enabled (at least 1 adult)
  const isSearchEnabled = guests.adults > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "relative rounded-full text-sm min-w-[200px] hover:bg-gray-200 hover:rounded-full flex gap-2 items-center py-4 px-4 cursor-pointer transition",
            hasSelection ? "text-gray-900 font-medium" : "text-gray-500"
          )}
        >
          <span>{label}</span>
          {hasSelection && (
            <button
              onClick={handleClear}
              className="hover:bg-gray-300 border-0 mr-[40px] rounded-full p-0.5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <div
            className={cn(
              "absolute flex right-3 top-1/2 -translate-y-1/2",
              "bg-gradient-to-br from-primary to-primary/80",
              "text-white rounded-full p-2 shadow-lg",
              "hover:scale-110 active:scale-95",
              "transition-all duration-150 ease-in-out",
              !isSearchEnabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (isSearchEnabled) {
                handleSearch();
              }
            }}
          >
            <Search size={20} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[340px] bg-white rounded-2xl shadow-xl border-0 p-0"
        align="end"
        sideOffset={12}
      >
        <div className="p-5 space-y-5">
          {guestTypes.map(({ key, label, description }) => (
            <div key={key} className="flex justify-between items-center">
              <div>
                <div className="text-[15px] font-medium text-gray-900">
                  {label}
                </div>
                <div className="text-sm text-gray-500">{description}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCount(key as keyof typeof guests, -1)}
                  disabled={guests[key as keyof typeof guests] === 0}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    guests[key as keyof typeof guests] === 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 active:scale-95"
                  )}
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="w-6 text-center font-medium text-gray-900">
                  {guests[key as keyof typeof guests]}
                </span>
                <button
                  onClick={() => updateCount(key as keyof typeof guests, 1)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 active:scale-95"
                  )}
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}

          {/* Clear / Apply buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => dispatch(resetGuests())}
              className="text-sm text-gray-500 hover:text-gray-900 underline-offset-2 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
