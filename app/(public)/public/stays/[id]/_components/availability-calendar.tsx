import FlyInnCalender from "@/components/shared/calender";
import dayjs, { Dayjs } from "dayjs";
import React, { useState, useMemo } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

interface BlockedDateRange {
  start_date: string;
  end_date: string;
  source?: string;
}

interface AvailabilityCalendarProps {
  blockedDates?: string[] | BlockedDateRange[];
}

const AvailabilityCalendar = ({ blockedDates }: AvailabilityCalendarProps) => {
  console.log("blockedDates logs", { blockedDates });

  // Convert blocked dates to the format expected by the calendar
  const processedBlockedDates = useMemo(() => {
    if (!blockedDates || blockedDates.length === 0) return [];

    // Check if it's an array of range objects
    if (
      typeof blockedDates[0] === "object" &&
      "start_date" in blockedDates[0]
    ) {
      return blockedDates as BlockedDateRange[];
    }

    // If it's an array of date strings, convert to range format
    if (typeof blockedDates[0] === "string") {
      return (blockedDates as string[]).map((date) => ({
        start_date: date,
        end_date: date,
        source: "custom",
      }));
    }

    return [];
  }, [blockedDates]);
  const [currentBaseMonth, setCurrentBaseMonth] = useState<Dayjs>(dayjs());

  // Get today's month (start of current month)
  const today = useMemo(() => dayjs().startOf("month"), []);

  // Check if we can go to previous month (only if current view is after today's month)
  const canGoPrev = useMemo(() => {
    return currentBaseMonth.isAfter(today, "month");
  }, [currentBaseMonth, today]);

  const handlePrevMonth = () => {
    if (canGoPrev) {
      setCurrentBaseMonth((prev) => prev.subtract(1, "month"));
    }
  };

  const handleNextMonth = () => {
    setCurrentBaseMonth((prev) => prev.add(1, "month"));
  };

  const handleReset = () => {
    setCurrentBaseMonth(dayjs());
  };

  const formatMonthYear = (date: Dayjs) => {
    return date.format("MMMM YYYY");
  };

  // Generate month options (filter out past months if viewing current year)
  const monthOptions: SearchableSelectOption[] = useMemo(() => {
    const currentYear = currentBaseMonth.year();
    const todayYear = today.year();
    const todayMonth = today.month();

    return Array.from({ length: 12 }).map((_, i) => ({
      value: String(i),
      label: dayjs().month(i).format("MMMM"),
      // Disable past months in current year
      disabled: currentYear === todayYear && i < todayMonth,
    }));
  }, [currentBaseMonth, today]);

  // Generate year options (only current year and forward)
  const yearOptions: SearchableSelectOption[] = useMemo(() => {
    const currentYear = today.year();
    return Array.from({ length: 6 }).map((_, i) => {
      const year = currentYear + i;
      return {
        value: String(year),
        label: String(year),
      };
    });
  }, [today]);

  // Format blocked dates for print display
  const formatBlockedDatesForPrint = useMemo(() => {
    if (!processedBlockedDates || processedBlockedDates.length === 0) {
      return [];
    }
    return processedBlockedDates.map((range) => {
      const start = dayjs(range.start_date).format("MMM D, YYYY");
      const end = dayjs(range.end_date).format("MMM D, YYYY");
      if (start === end) {
        return start;
      }
      return `${start} - ${end}`;
    });
  }, [processedBlockedDates]);

  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-1">
          Availability Calendar
        </h2>
      </div>

      {/* Screen version - Interactive calendar */}
      <div className="screen-only">
        {/* Calendar Controls */}
        <div className="flex justify-between items-center mb-6 p-3 bg-white rounded-lg shadow-sm">
          <Button
            onClick={handlePrevMonth}
            type="text"
            icon={<LeftOutlined className="text-lg" />}
            aria-label="Previous month"
            disabled={!canGoPrev}
          />

          <div className="flex items-center md:gap-6 gap-2">
            <div className="min-w-[120px]">
              <SearchableSelect
                value={String(currentBaseMonth.month())}
                onValueChange={(val) => {
                  const monthValue =
                    typeof val === "string"
                      ? Number(val)
                      : Array.isArray(val)
                      ? Number(val[0])
                      : 0;
                  // Only allow selecting months that are today or in the future
                  const newDate = currentBaseMonth.month(monthValue);
                  if (!newDate.isBefore(today, "month")) {
                    setCurrentBaseMonth(newDate);
                  }
                }}
                options={monthOptions}
                showSearch={false}
              />
            </div>

            <Button onClick={handleReset} className="px-4 py-1 text-sm">
              Today
            </Button>

            <div className="min-w-[100px]">
              <SearchableSelect
                value={String(currentBaseMonth.year())}
                onValueChange={(val) => {
                  const yearValue =
                    typeof val === "string"
                      ? Number(val)
                      : Array.isArray(val)
                      ? Number(val[0])
                      : dayjs().year();
                  // When changing year, ensure we don't go to a past month
                  let newDate = currentBaseMonth.year(yearValue);
                  if (newDate.isBefore(today, "month")) {
                    // Reset to today's month if the new date would be in the past
                    newDate = today;
                  }
                  setCurrentBaseMonth(newDate);
                }}
                options={yearOptions}
                showSearch={false}
              />
            </div>
          </div>

          <Button
            onClick={handleNextMonth}
            type="text"
            icon={<RightOutlined className="text-lg" />}
            aria-label="Next month"
          />
        </div>

        {/* Dual Calendar Display */}
        <div className="flex gap-8 flex-col md:flex-row justify-center">
          <div className="w-full bg-white p-4 rounded-lg shadow-sm">
            <p className="mb-2 text-sm">{formatMonthYear(currentBaseMonth)}</p>
            <FlyInnCalender
              context="datepicker"
              targetMonth={currentBaseMonth}
              initialBlockedDates={processedBlockedDates}
            />
          </div>

          <div className="w-full bg-white p-4 rounded-lg shadow-sm">
            <p className="mb-2 text-sm">
              {formatMonthYear(currentBaseMonth.add(1, "month"))}
            </p>

            <FlyInnCalender
              context="datepicker"
              targetMonth={currentBaseMonth.add(1, "month")}
              initialBlockedDates={processedBlockedDates}
            />
          </div>
        </div>

        {/* Month/Year Selector - (Original empty div, now placeholder for legend) */}
        <div className="flex justify-center gap-4"></div>

        {/* Legend Section */}
        <div className="mt-8 flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-200" />
            Available
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-200" />
            Booked
          </div>
        </div>
      </div>

      {/* Print version - Text-based blocked dates list */}
      <div className="print-only">
        <div className="text-sm">
          {formatBlockedDatesForPrint.length === 0 ? (
            <p className="text-gray-600">No blocked dates - property is available for booking.</p>
          ) : (
            <>
              <p className="font-medium mb-2">Blocked/Unavailable Dates:</p>
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 pl-4">
                {formatBlockedDatesForPrint.map((dateStr, index) => (
                  <div key={index} className="text-gray-700">• {dateStr}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
