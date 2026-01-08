import FlyInnCalender, { BlockedDateRange } from "@/components/shared/calendar";
import { CalendarOutlined } from "@ant-design/icons";
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";

interface BlockedDateCalenderProps {
  successResponse?: any;
  setSuccessResponse?: (response: any) => void;
  initialBlockedDates?: string[] | Map<string, string>; // Array of date strings OR Map with source
  onDatesChange?: (dates: string[]) => void; // Callback when dates change
}

export interface BlockedDateCalenderRef {
  getBlockedDates: () => string[]; // Returns array of date strings (legacy format)
  setBlockedDates: (dates: string[]) => void; // Sets blocked dates
  getBlockedDateRanges: () => BlockedDateRange[]; // Returns optimized range format for API/DB
}

const BlockedDateCalender = forwardRef<
  BlockedDateCalenderRef,
  BlockedDateCalenderProps
>(
  (
    {
      successResponse,
      setSuccessResponse,
      initialBlockedDates = [],
      onDatesChange,
    },
    ref
  ) => {
    const calendarRef = useRef<any>(null);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getBlockedDates: () => {
        // Get dates from calendar component (legacy format - array of date strings)
        if (calendarRef.current?.getBlockedDates) {
          return calendarRef.current.getBlockedDates();
        }
        return [];
      },
      setBlockedDates: (dates: string[]) => {
        // Set dates in calendar component
        if (calendarRef.current?.setBlockedDates) {
          calendarRef.current.setBlockedDates(dates);
        }
      },
      getBlockedDateRanges: () => {
        // Get dates in optimized range format for API/DB
        if (calendarRef.current?.getBlockedDateRanges) {
          return calendarRef.current.getBlockedDateRanges();
        }
        return [];
      },
    }));

    return (
      <div className="">
        <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
          <CalendarOutlined className="text-xl text-primary mr-3" />
          Availability Calendar
        </h2>

        <div className="text-gray-600 mb-6">
          Block dates when your property is unavailable. Simply click and drag
          to select date ranges, or click individual dates to toggle them.
        </div>
        <FlyInnCalender
          ref={calendarRef}
          context="calender"
          initialBlockedDates={initialBlockedDates}
          onDatesChange={onDatesChange}
        />
      </div>
    );
  }
);

BlockedDateCalender.displayName = "BlockedDateCalender";

export default BlockedDateCalender;
