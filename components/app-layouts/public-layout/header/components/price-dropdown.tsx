"use client";

import {
  setMinPrice,
  setMaxPrice,
  setOpenDropdown,
} from "../../../../../redux/slices/filter-slice";
import { RootState } from "../../../../../redux/store";
import { Dropdown, Input, Button } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PriceDropdown() {
  const { price, openDropdown } = useSelector(
    (state: RootState) => state.filters
  );
  const dispatch = useDispatch();
  const currentId = "price";

  const [localMinPrice, setLocalMinPrice] = useState<string>("");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>("");

  // Sync local state with Redux state
  useEffect(() => {
    setLocalMinPrice(price.min?.toString() || "");
    setLocalMaxPrice(price.max?.toString() || "");
  }, [price.min, price.max]);

  const handleApply = () => {
    const min = localMinPrice ? parseFloat(localMinPrice) : null;
    const max = localMaxPrice ? parseFloat(localMaxPrice) : null;

    dispatch(setMinPrice(min));
    dispatch(setMaxPrice(max));
    dispatch(setOpenDropdown(null)); // Close dropdown
  };

  const handleClear = () => {
    dispatch(setMinPrice(null));
    dispatch(setMaxPrice(null));
    setLocalMinPrice("");
    setLocalMaxPrice("");
  };

  const handleOpenChange = (open: boolean) => {
    dispatch(setOpenDropdown(open ? currentId : null));
  };

  const getDisplayText = () => {
    if (price.min !== null && price.max !== null) {
      return `$${price.min} - $${price.max}`;
    } else if (price.min !== null) {
      return `From $${price.min}`;
    } else if (price.max !== null) {
      return `Up to $${price.max}`;
    }
    return "Price range";
  };

  const content = (
    <div className="w-[280px] bg-white rounded-xl shadow-lg p-5">
      <h3 className="text-base font-semibold mb-4">Set your price range</h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min price per night
          </label>
          <Input
            type="number"
            placeholder="0"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            prefix="$"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max price per night
          </label>
          <Input
            type="number"
            placeholder="1000"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            prefix="$"
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-between pt-3 border-t border-gray-200">
        <Button
          onClick={handleClear}
          className="text-sm text-gray-500 hover:underline"
          type="link"
        >
          Clear
        </Button>
        <Button
          onClick={handleApply}
          className="text-sm font-semibold text-[#af2322]"
          type="default"
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown
      popupRender={() => content}
      trigger={["click"]}
      open={openDropdown === currentId}
      onOpenChange={handleOpenChange}
    >
      <div
        onClick={(e) => e.preventDefault()}
        className={`text-sm px-4 py-4 min-w-[200px] hover:bg-gray-200 hover:rounded-full cursor-pointer transition-all ${
          openDropdown === currentId
            ? "border-gray-200 rounded-full shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)] text-gray-700"
            : "text-gray-500"
        }`}
      >
        {getDisplayText()}
      </div>
    </Dropdown>
  );
}
