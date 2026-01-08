"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { message } from "antd";

const MAX_COMPARE_ITEMS = 3;

interface CompareStay {
  id: number;
  title: string;
  name?: string;
  nightly_price: string;
  images?: Array<{ url: string; image?: string }>;
  city?: string;
  state?: string;
  no_of_bedrooms?: number;
  no_of_bathrooms?: string;
  no_of_guest?: number;
  airports?: any[];
  [key: string]: any;
}

interface CompareContextType {
  compareStays: CompareStay[];
  addToCompare: (stay: CompareStay) => void;
  removeFromCompare: (stayId: number) => void;
  clearCompare: () => void;
  isInCompare: (stayId: number) => boolean;
  canAddMore: boolean;
  maxReached: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
};

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareStays, setCompareStays] = useState<CompareStay[]>([]);

  const addToCompare = useCallback((stay: CompareStay) => {
    setCompareStays((prev) => {
      // Check if already in compare
      if (prev.some((s) => s.id === stay.id)) {
        message.info("This stay is already in your comparison");
        return prev;
      }

      // Check if limit reached
      if (prev.length >= MAX_COMPARE_ITEMS) {
        message.warning(
          `You can only compare up to ${MAX_COMPARE_ITEMS} stays at once. Remove one to add another.`
        );
        return prev;
      }

      message.success(`Added "${stay.title || stay.name}" to comparison`);
      return [...prev, stay];
    });
  }, []);

  const removeFromCompare = useCallback((stayId: number) => {
    setCompareStays((prev) => {
      const removedStay = prev.find((s) => s.id === stayId);
      if (removedStay) {
        message.info(
          `Removed "${removedStay.title || removedStay.name}" from comparison`
        );
      }
      return prev.filter((s) => s.id !== stayId);
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareStays([]);
    message.info("Comparison cleared");
  }, []);

  const isInCompare = useCallback(
    (stayId: number) => {
      return compareStays.some((s) => s.id === stayId);
    },
    [compareStays]
  );

  const canAddMore = compareStays.length < MAX_COMPARE_ITEMS;
  const maxReached = compareStays.length >= MAX_COMPARE_ITEMS;

  return (
    <CompareContext.Provider
      value={{
        compareStays,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore,
        maxReached,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};




