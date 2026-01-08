"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import minMax from "dayjs/plugin/minMax";
import { useFormContext } from "react-hook-form";
import { expandBlockedDateRangesWithSource } from "@/utils/timezone";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

interface FlyInnCalenderProps {
  context?: "calender" | "datepicker";
  targetMonth?: Dayjs;
  initialBlockedDates?:
    | string[]
    | Map<string, string>
    | Array<{
        start_date: string;
        end_date: string;
        source?: string;
      }>;
}

const FlyInnCalender = ({
  context = "calender",
  targetMonth,
  initialBlockedDates = [],
}: FlyInnCalenderProps) => {
  // Use Map to track dates with their sources (for different colors)
  const [unavailableDates, setUnavailableDates] = useState<Map<string, string>>(
    new Map()
  );

  // Initialize blocked dates from props
  useEffect(() => {
    if (!initialBlockedDates) {
      return;
    }

    let datesMap = new Map<string, string>();

    // Check if it's already a Map
    if (initialBlockedDates instanceof Map) {
      datesMap = new Map(initialBlockedDates);
    }
    // Check if it's an array
    else if (Array.isArray(initialBlockedDates)) {
      // Check if it's an array of date strings
      if (
        initialBlockedDates.length > 0 &&
        typeof initialBlockedDates[0] === "string"
      ) {
        (initialBlockedDates as string[]).forEach((date: string) => {
          datesMap.set(date, "custom");
        });
      }
      // Check if it's an array of range objects
      else if (
        initialBlockedDates.length > 0 &&
        typeof initialBlockedDates[0] === "object" &&
        "start_date" in initialBlockedDates[0]
      ) {
        datesMap = expandBlockedDateRangesWithSource(
          initialBlockedDates as Array<{
            start_date: string;
            end_date: string;
            source?: string;
          }>
        );
      }
    }

    if (datesMap.size > 0) {
      setUnavailableDates(datesMap);
    }
  }, [initialBlockedDates]);

  // Try to get form context, but don't fail if it's not available
  let formContext;
  try {
    formContext = useFormContext();
  } catch (error) {
    // Form context not available, component is being used outside of a form
    formContext = null;
  }

  const { control, setValue, formState: { errors } = {} } = formContext || {};
  console.log({ unavailableDates });

  const isDragging = useRef(false);
  const dragStartDate = useRef<Dayjs | null>(null);
  const dragEndDate = useRef<Dayjs | null>(null);

  const handleMouseDown = (date: Dayjs) => {
    isDragging.current = true;
    dragStartDate.current = date;
    dragEndDate.current = date;
  };

  const handleMouseEnter = (date: Dayjs) => {
    if (isDragging.current) {
      dragEndDate.current = date;
    }
  };

  const handleMouseUp = () => {
    if (context !== "calender") return;
    if (!dragStartDate.current || !dragEndDate.current) {
      isDragging.current = false;
      return;
    }

    const start = dragStartDate.current;
    const end = dragEndDate.current;

    if (start.isSame(end, "day")) {
      const dateStr = start.format("YYYY-MM-DD");
      const newDates = new Map(unavailableDates);

      if (newDates.has(dateStr) && newDates.get(dateStr) === "custom") {
        newDates.delete(dateStr);
      } else {
        newDates.set(dateStr, "custom");
      }

      setUnavailableDates(newDates);
      if (setValue) {
        setValue("calendar", groupDatesIntoRanges(newDates));
      }
    } else {
      const newDates = new Map(unavailableDates);
      const min = dayjs.min(start, end);
      const max = dayjs.max(start, end);

      for (
        let d = min.clone();
        d.isSameOrBefore(max, "day");
        d = d.add(1, "day")
      ) {
        newDates.set(d.format("YYYY-MM-DD"), "custom");
      }

      setUnavailableDates(newDates);
      if (setValue) {
        setValue("calendar", groupDatesIntoRanges(newDates));
      }
    }

    isDragging.current = false;
    dragStartDate.current = null;
    dragEndDate.current = null;
  };

  const isBlocked = (date: Dayjs) => {
    return unavailableDates.has(date.format("YYYY-MM-DD"));
  };

  const getBlockedSource = (date: Dayjs): string | undefined => {
    return unavailableDates.get(date.format("YYYY-MM-DD"));
  };

  const isPrevDayBlocked = (date: Dayjs) => {
    const prevDay = date.subtract(1, "day");
    return unavailableDates.has(prevDay.format("YYYY-MM-DD"));
  };

  const getPrevDaySource = (date: Dayjs): string | undefined => {
    const prevDay = date.subtract(1, "day");
    return unavailableDates.get(prevDay.format("YYYY-MM-DD"));
  };

  const dateFullCellRender = (date: Dayjs) => {
    const isInDragRange =
      isDragging.current &&
      dragStartDate.current &&
      dragEndDate.current &&
      date.isSameOrAfter(
        dayjs.min(dragStartDate.current, dragEndDate.current),
        "day"
      ) &&
      date.isSameOrBefore(
        dayjs.max(dragStartDate.current, dragEndDate.current),
        "day"
      );

    const isUnavailable = isBlocked(date) || isInDragRange;
    const prevDayUnavailable = isPrevDayBlocked(date);
    const currentSource = getBlockedSource(date);
    const prevSource = getPrevDaySource(date);

    // Determine color based on source (for datepicker context)
    // Colors match the legend: Red=Booked, Yellow=Pending, Green=Available
    const getSourceColor = (source?: string): string => {
      if (!source) return "#f87171"; // Light red for booked/blocked (default)
      switch (source.toLowerCase()) {
        case "booked":
        case "reservation":
        case "blocked":
        case "custom":
          return "#f87171"; // Light red (#fca5a5) for booked - matches bg-red-200
        case "pending":
          return "#fde047"; // Light yellow (#fef08a) for pending - matches bg-yellow-200
        case "available":
          return "#86efac"; // Light green (#bbf7d0) for available - matches bg-green-200
        default:
          return "#f87171"; // Default light red for booked
      }
    };

    // Text color is always black
    const renderColor = () => {
      return "black";
    };

    // For datepicker context, determine availability
    const currentDateBlocked = isBlocked(date);
    const prevDateBlocked = isPrevDayBlocked(date);

    // Logic for datepicker:
    // - If date is NOT blocked and previous day is NOT blocked: full green background
    // - If date is blocked: right triangle (second half/night) = red/yellow, left half = green
    // - If previous day is blocked: left triangle (first half) = red/yellow, right half = green
    const isFullyAvailable =
      context === "datepicker" &&
      !currentDateBlocked &&
      !prevDateBlocked &&
      !isInDragRange;
    const showRightTriangle =
      context === "datepicker" && (currentDateBlocked || isInDragRange);
    const showLeftTriangle = context === "datepicker" && prevDateBlocked;

    return (
      <div
        className={`ant-picker-cell-inner ant-picker-calendar-date`}
        onMouseDown={() => context === "calender" && handleMouseDown(date)}
        onMouseEnter={() => context === "calender" && handleMouseEnter(date)}
        onMouseUp={handleMouseUp}
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: 0,
          // Full green background if fully available (not blocked and previous day not blocked)
          backgroundColor: isFullyAvailable ? "#bbf7d0" : undefined, // bg-green-200
        }}
      >
        {/* Green background for first half if current date is blocked but previous is not */}
        {context === "datepicker" && currentDateBlocked && !prevDateBlocked && (
          <div
            className="triangle-left-green"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#bbf7d0", // Green for available first half (day)
              clipPath: "polygon(0px 100%, 0px 0px, 100% 0px)",
              zIndex: 0,
            }}
          />
        )}

        {/* Green background for second half if previous date is blocked but current is not */}
        {context === "datepicker" && prevDateBlocked && !currentDateBlocked && (
          <div
            className="triangle-right-green"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#bbf7d0", // Green for available second half (night)
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              zIndex: 0,
            }}
          />
        )}

        {/* Right triangle for current day - second half (night) if blocked */}
        {showRightTriangle && (
          <div
            className="triangle-right"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              backgroundColor:
                context === "datepicker"
                  ? getSourceColor(currentSource)
                  : "#ff4d4f",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              zIndex: 1,
            }}
          />
        )}

        {/* Left triangle for previous day - first half if previous day was blocked */}
        {showLeftTriangle && (
          <div
            className="triangle-left"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor:
                context === "datepicker"
                  ? getSourceColor(prevSource)
                  : "#ff4d4f",
              clipPath: "polygon(0px 100%, 0px 0px, 100% 0px)",
              zIndex: 1,
            }}
          />
        )}

        {isBlocked(date) && context === "calender" && (
          <div
            style={{
              fontSize: "0.65em",
              lineHeight: 1.1,
              textAlign: "center",
              padding: "0 2px",
              marginTop: 2,
              fontWeight: "normal",
              position: "absolute",
              zIndex: 99999,
              right: 0,
              color: "white",
            }}
          >
            Blocked
          </div>
        )}

        <div
          className="ant-picker-calendar-date-content relative"
          style={{
            zIndex: 2,
            fontWeight:
              context === "datepicker"
                ? "normal"
                : isUnavailable
                ? "bold"
                : "normal",
            color: renderColor(),
          }}
        >
          {date.date()}

          {/* Blocked text indicator */}
        </div>
      </div>
    );
  };

  const groupDatesIntoRanges = (dates: Map<string, string>) => {
    if (dates.size === 0) return [];

    // Filter only custom dates for form submission
    const customDates = Array.from(dates.entries())
      .filter(([_, source]) => source === "custom")
      .map(([date]) => date);

    if (customDates.length === 0) return [];

    const sorted = customDates.map((d) => dayjs(d)).sort((a, b) => a.diff(b));

    const ranges: { start: Dayjs; end: Dayjs }[] = [];
    let currentStart = sorted[0];
    let currentEnd = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const currentDate = sorted[i];
      const isConsecutive = currentEnd.add(1, "day").isSame(currentDate, "day");

      if (isConsecutive) {
        currentEnd = currentDate;
      } else {
        ranges.push({ start: currentStart, end: currentEnd });
        currentStart = currentDate;
        currentEnd = currentDate;
      }
    }

    ranges.push({ start: currentStart, end: currentEnd });
    return ranges;
  };
  return (
    <>
      {context === "datepicker" && (
        <div className="">
          <Calendar
            fullscreen={false}
            fullCellRender={dateFullCellRender}
            // Control the displayed month
            value={targetMonth || dayjs()}
            // Hide header to prevent navigation
            headerRender={() => null}
            // Disable dates outside the target month
            disabledDate={(current) => true}
            // Set mode to 'month' to ensure it's always showing a month view
            mode="month"
            // Add a class to apply specific styles for read-only mode if needed
            className="read-only-calendar"
          />
        </div>
      )}

      {context === "calender" && (
        <div className="flex flex-row">
          <div className="max-w-[900px] mx-auto p-4 select-none">
            <Calendar fullscreen fullCellRender={dateFullCellRender} />
          </div>
        </div>
      )}
    </>
  );
};

export default FlyInnCalender;
