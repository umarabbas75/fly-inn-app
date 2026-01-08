"use client";

import React, { useState, useRef } from "react";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import minMax from "dayjs/plugin/minMax";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

const UnavailableDateSelector: React.FC = () => {
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(
    new Set()
  );

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
    if (!dragStartDate.current || !dragEndDate.current) {
      isDragging.current = false;
      return;
    }

    const start = dragStartDate.current;
    const end = dragEndDate.current;

    if (start.isSame(end, "day")) {
      // This was a click
      const dateStr = start.format("YYYY-MM-DD");
      const newDates = new Set(unavailableDates);

      if (newDates.has(dateStr)) {
        newDates.delete(dateStr); // Deselect
      } else {
        newDates.add(dateStr); // Select
      }

      setUnavailableDates(newDates);
    } else {
      // This was a drag
      const newDates = new Set(unavailableDates);
      const min = dayjs.min(start, end);
      const max = dayjs.max(start, end);

      for (
        let d = min.clone();
        d.isSameOrBefore(max, "day");
        d = d.add(1, "day")
      ) {
        newDates.add(d.format("YYYY-MM-DD")); // Only add
      }

      setUnavailableDates(newDates);
    }

    // Reset drag refs
    isDragging.current = false;
    dragStartDate.current = null;
    dragEndDate.current = null;
  };

  const isBlocked = (date: Dayjs) => {
    return unavailableDates.has(date.format("YYYY-MM-DD"));
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

    return (
      <div
        className={`ant-picker-cell-inner ant-picker-calendar-date ${
          isUnavailable ? "unavailable" : ""
        }`}
        onMouseDown={() => handleMouseDown(date)}
        onMouseEnter={() => handleMouseEnter(date)}
        onMouseUp={handleMouseUp}
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ...(isUnavailable && {
            backgroundColor: "#ff4d4f",
            color: "white",
            fontWeight: "bold",
          }),
        }}
      >
        <div className="ant-picker-calendar-date-content">{date.date()}</div>
      </div>
    );
  };

  return (
    <div className="max-w-[900px] mx-auto p-4 select-none">
      <h2 className="text-xl font-semibold mb-4">Block Unavailable Dates</h2>
      <p className="text-sm text-gray-600 mb-2">
        - Click to toggle a single day.
        <br />- Drag to block a range (does not deselect).
      </p>
      <Calendar fullscreen fullCellRender={dateFullCellRender} />
    </div>
  );
};

export default UnavailableDateSelector;
