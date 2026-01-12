"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Badge } from "antd";
import { FaTimes } from "react-icons/fa";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  multiple?: boolean;
  showSearch?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  disabled = false,
  error = false,
  className,
  multiple = false,
  showSearch = true,
}) => {
  const [open, setOpen] = useState(false);

  // Handle both single and multiple selection
  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
    ? [value]
    : [];

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue];
      onValueChange?.(newValues);
    } else {
      // Allow deselecting in single selection mode by clicking the selected option again
      if (value === selectedValue) {
        // Deselect if clicking the already selected option
        onValueChange?.("");
      } else {
        // Select new option
        onValueChange?.(selectedValue);
      }
      setOpen(false);
    }
  };

  const handleRemove = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter((v) => v !== valueToRemove);
      onValueChange?.(newValues);
    }
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    if (multiple) {
      return `${selectedOptions.length} selected`;
    }
    return selectedOptions[0]?.label;
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full min-h-10 h-auto justify-between text-sm font-normal bg-white border-gray-300 hover:border-gray-400 hover:bg-white",
              selectedValues.length === 0 && "text-gray-400",
              error && "!border-red-500",
              className
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1 items-center min-w-0 overflow-hidden">
              {multiple && selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {option.label}
                      <FaTimes
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={(e) => handleRemove(e, option.value)}
                      />
                    </span>
                  ))}
                </div>
              ) : (
                <span
                  className={cn(
                    "truncate text-left",
                    selectedValues.length === 0 ? "text-gray-400" : ""
                  )}
                  title={selectedOptions[0]?.label || placeholder}
                >
                  {getDisplayText()}
                </span>
              )}
            </div>
            <FaChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border-gray-300"
          align="start"
        >
          <Command className="bg-white">
            {showSearch && (
              <CommandInput
                placeholder={searchPlaceholder}
                className="border-0 border-none"
              />
            )}
            <CommandList className="bg-white">
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="hover:bg-gray-50 text-black! data-[selected=true]:text-black! "
                  >
                    <FaCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="text-black!">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
