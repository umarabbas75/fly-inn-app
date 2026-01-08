"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setDestination,
  setDates,
  setLodgingType,
  updateGuestCount,
  setMinPrice,
  setMaxPrice,
} from "@/redux/slices/filter-slice";

/**
 * Hook to sync URL query parameters with Redux filter state
 * This allows filters to be pre-populated from URL on page reload
 */
export function useUrlFilters() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once on mount to avoid infinite loops
    if (hasInitialized.current) return;
    
    // Check if there are any relevant query parameters
    const hasQueryParams =
      searchParams.has("city") ||
      searchParams.has("arrival_date") ||
      searchParams.has("departure_date") ||
      searchParams.has("guests") ||
      searchParams.has("children") ||
      searchParams.has("infants") ||
      searchParams.has("pets") ||
      searchParams.has("stay_type") ||
      searchParams.has("min_price") ||
      searchParams.has("max_price");

    // Only initialize if there are query parameters to process
    if (!hasQueryParams) return;

    hasInitialized.current = true;

    // Get all query parameters
    const city = searchParams.get("city");
    const arrivalDate = searchParams.get("arrival_date");
    const departureDate = searchParams.get("departure_date");
    const guests = searchParams.get("guests");
    const children = searchParams.get("children");
    const infants = searchParams.get("infants");
    const pets = searchParams.get("pets");
    const stayType = searchParams.get("stay_type");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");

    // Set destination (city)
    if (city && city.trim()) {
      dispatch(setDestination(city.trim()));
    }

    // Set dates
    if (arrivalDate || departureDate) {
      dispatch(
        setDates({
          start: arrivalDate || null,
          end: departureDate || null,
        })
      );
    }

    // Set lodging type
    if (stayType && stayType.trim()) {
      dispatch(setLodgingType(stayType.trim()));
    }

    // Set guests
    if (guests) {
      const adultsCount = parseInt(guests, 10);
      if (!isNaN(adultsCount) && adultsCount > 0) {
        dispatch(updateGuestCount({ type: "adults", value: adultsCount }));
      }
    }

    if (children) {
      const childrenCount = parseInt(children, 10);
      if (!isNaN(childrenCount) && childrenCount > 0) {
        dispatch(updateGuestCount({ type: "children", value: childrenCount }));
      }
    }

    if (infants) {
      const infantsCount = parseInt(infants, 10);
      if (!isNaN(infantsCount) && infantsCount > 0) {
        dispatch(updateGuestCount({ type: "infants", value: infantsCount }));
      }
    }

    if (pets) {
      const petsCount = parseInt(pets, 10);
      if (!isNaN(petsCount) && petsCount > 0) {
        dispatch(updateGuestCount({ type: "pets", value: petsCount }));
      }
    }

    // Set price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min) && min >= 0) {
        dispatch(setMinPrice(min));
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max) && max >= 0) {
        dispatch(setMaxPrice(max));
      }
    }
  }, [searchParams, dispatch]);
}

