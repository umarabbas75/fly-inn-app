"use client";

import { useUrlFilters } from "@/hooks/use-url-filters";

/**
 * Client component to initialize filters from URL query parameters
 * This must be a client component because it uses hooks
 */
export default function FilterInitializer() {
  useUrlFilters();
  return null; // This component doesn't render anything
}










