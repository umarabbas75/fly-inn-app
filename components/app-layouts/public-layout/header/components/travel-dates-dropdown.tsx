"use client";
import { setDates } from "../../../../../redux/slices/filter-slice";
import { RootState } from "../../../../../redux/store";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import "react-day-picker/style.css";

const TravelDatesDropdown = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { start, end } = useSelector((state: RootState) => state.filters.dates);

  const selectedRange: DateRange | undefined =
    start && end
      ? { from: new Date(start), to: new Date(end) }
      : start
      ? { from: new Date(start), to: undefined }
      : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      dispatch(
        setDates({
          start: dayjs(range.from).format("YYYY-MM-DD"),
          end: dayjs(range.to).format("YYYY-MM-DD"),
        })
      );
    } else if (range?.from) {
      dispatch(
        setDates({
          start: dayjs(range.from).format("YYYY-MM-DD"),
          end: null,
        })
      );
    } else {
      dispatch(setDates({ start: null, end: null }));
    }
  };

  const handleClear = () => {
    dispatch(setDates({ start: null, end: null }));
  };

  const displayLabel =
    start && end
      ? `${dayjs(start).format("MMM D")} - ${dayjs(end).format("MMM D")}`
      : "Travel Dates";

  const today = new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "text-sm px-4 py-4 hover:bg-gray-200 hover:rounded-full cursor-pointer transition-all flex items-center gap-2",
            start && end ? "text-gray-900" : "text-gray-500"
          )}
        >
          <span>{displayLabel}</span>
          {start && end && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="hover:bg-gray-300 border-0 rounded-full p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 bg-white rounded-2xl shadow-xl border border-gray-200",
          isMobile && "max-w-[calc(100vw-32px)]"
        )}
        align={isMobile ? "center" : "center"}
        sideOffset={12}
      >
        <div className={cn("p-4", isMobile && "p-3")}>
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={isMobile ? 1 : 2}
            disabled={{ before: today }}
            showOutsideDays={false}
            classNames={{
              today: "border-2 border-primary text-primary font-semibold",
              selected: "!bg-primary !text-white",
              range_start: "!bg-primary !text-white",
              range_end: "!bg-primary !text-white",
              range_middle: "!bg-primary/15 !text-gray-900",
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft className="h-4 w-4 text-gray-900" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-900" />
                ),
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TravelDatesDropdown;
