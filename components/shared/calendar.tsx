"use client";

import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import {
  Calendar,
  Button,
  Card,
  Badge,
  Tooltip,
  Divider,
  Input,
  Modal,
  Switch,
  Select,
  message,
  Progress,
  Tag,
  Space,
  Collapse,
  DatePicker,
} from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CalendarOutlined,
  BlockOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  ClearOutlined,
  ImportOutlined,
  ExportOutlined,
  SyncOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import minMax from "dayjs/plugin/minMax";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchAndParseICal, extractBlockedDates } from "@/utils/ical-parser";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);
dayjs.extend(relativeTime);

const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

interface FlyInnCalenderProps {
  context?: string;
  targetMonth?: any;
  initialBlockedDates?: string[] | Map<string, string>; // Array of date strings OR Map with source
  onDatesChange?: (dates: string[]) => void; // Callback when dates change
}

export interface BlockedDateRange {
  start_date: string; // YYYY-MM-DD format
  end_date: string; // YYYY-MM-DD format
  source: string; // Source name (custom, airbnb, vrbo, etc.)
}

export interface FlyInnCalenderRef {
  getBlockedDates: () => string[]; // Returns array of date strings (only custom source)
  setBlockedDates: (dates: string[]) => void; // Sets blocked dates (as custom source)
  getAllBlockedDates: () => Map<string, string>; // Returns all dates with source
  getBlockedDateRanges: () => BlockedDateRange[]; // Returns date ranges in optimized format for API/DB
}

const FlyInnCalender = forwardRef<FlyInnCalenderRef, FlyInnCalenderProps>(
  (
    {
      context = "calender",
      targetMonth,
      initialBlockedDates = [],
      onDatesChange,
    },
    ref
  ) => {
    // Map of date (YYYY-MM-DD) -> source (custom, airbnb, vrbo, google, etc.)
    const [unavailableDates, setUnavailableDates] = useState<
      Map<string, string>
    >(new Map());
    console.log({ unavailableDates });

    // Initialize with blocked dates from props
    useEffect(() => {
      if (initialBlockedDates) {
        // Check if it's already a Map (with source) or just an array
        if (initialBlockedDates instanceof Map) {
          // Already has source - use directly
          setUnavailableDates(new Map(initialBlockedDates));
        } else if (
          Array.isArray(initialBlockedDates) &&
          initialBlockedDates.length > 0
        ) {
          // Legacy array format - convert to Map with "custom" source
          const initialMap = new Map<string, string>();
          initialBlockedDates.forEach((date) => {
            initialMap.set(date, "custom");
          });
          setUnavailableDates(initialMap);
        }
      }
    }, []); // Only run on mount

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getBlockedDates: () => {
        // Return only dates with "custom" source (user-selected dates)
        const customDates: string[] = [];
        unavailableDates.forEach((source, date) => {
          if (source === "custom") {
            customDates.push(date);
          }
        });
        return customDates;
      },
      setBlockedDates: (dates: string[]) => {
        const newDates = new Map(unavailableDates);
        // Clear existing "custom" source dates
        Array.from(unavailableDates.entries()).forEach(([date, source]) => {
          if (source === "custom") {
            newDates.delete(date);
          }
        });
        // Add new dates with "custom" source
        dates.forEach((date) => {
          newDates.set(date, "custom");
        });
        setUnavailableDates(newDates);
      },
      getAllBlockedDates: () => {
        return new Map(unavailableDates);
      },
      getBlockedDateRanges: () => {
        // Group dates into ranges and return in optimized format for API/DB
        const ranges = groupDatesIntoRanges(unavailableDates);
        return ranges.map((range) => ({
          start_date: range.start.format("YYYY-MM-DD"),
          end_date: range.end.format("YYYY-MM-DD"),
          source: range.source,
        }));
      },
    }));

    // Track previous dates to avoid unnecessary callbacks
    const prevDatesRef = useRef<string>("");

    // Notify parent when dates change (only when dates actually change, not callback)
    useEffect(() => {
      if (onDatesChange) {
        const customDates: string[] = [];
        unavailableDates.forEach((source, date) => {
          if (source === "custom") {
            customDates.push(date);
          }
        });
        const datesString = customDates.sort().join(",");

        // Only call callback if dates actually changed
        if (prevDatesRef.current !== datesString) {
          prevDatesRef.current = datesString;
          onDatesChange(customDates);
        }
      }
    }, [unavailableDates]); // Removed onDatesChange from dependencies
    // iCal Sync States
    const [icalSyncModalVisible, setIcalSyncModalVisible] = useState(false);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [reservePeriodModalVisible, setReservePeriodModalVisible] =
      useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState<
      [Dayjs | null, Dayjs | null] | null
    >(null);
    const [icalUrl, setIcalUrl] = useState("");
    const [icalName, setIcalName] = useState("");
    const [syncInterval, setSyncInterval] = useState("daily");
    const [autoSync, setAutoSync] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);

    // External Calendar States
    const [externalCalendars, setExternalCalendars] = useState([
      {
        id: 1,
        name: "Airbnb Calendar",
        url: "https://calendar.google.com/calendar/ical/airbnb.com_1234567890@group.calendar.google.com/public/basic.ics",
        type: "airbnb",
        status: "synced",
        lastSync: "2024-01-15T10:30:00Z",
        nextSync: "2024-01-16T10:30:00Z",
        enabled: true,
      },
      {
        id: 2,
        name: "VRBO Calendar",
        url: "https://calendar.google.com/calendar/ical/vrbo.com_0987654321@group.calendar.google.com/public/basic.ics",
        type: "vrbo",
        status: "syncing",
        lastSync: "2024-01-15T09:15:00Z",
        nextSync: "2024-01-16T09:15:00Z",
        enabled: true,
      },
      {
        id: 3,
        name: "Google Calendar",
        url: "https://calendar.google.com/calendar/ical/example@gmail.com/public/basic.ics",
        type: "google",
        status: "error",
        lastSync: "2024-01-14T16:45:00Z",
        nextSync: "2024-01-16T16:45:00Z",
        enabled: false,
      },
    ]);

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
          // If date exists with "custom" source, remove it
          newDates.delete(dateStr);
        } else if (!newDates.has(dateStr)) {
          // User-selected dates are marked as "custom"
          newDates.set(dateStr, "custom");
        }

        setUnavailableDates(newDates);
      } else {
        const newDates = new Map(unavailableDates);
        // Use dayjs.min and dayjs.max with array syntax
        const min = dayjs.min([start, end]);
        const max = dayjs.max([start, end]);

        for (
          let d = min.clone();
          d.isSameOrBefore(max, "day");
          d = d.add(1, "day")
        ) {
          const dateStr = d.format("YYYY-MM-DD");
          // User-selected dates are marked as "custom"
          newDates.set(dateStr, "custom");
        }

        setUnavailableDates(newDates);
      }

      isDragging.current = false;
      dragStartDate.current = null;
      dragEndDate.current = null;
    };

    const clearAllBlockedDates = () => {
      setUnavailableDates(new Map());
    };

    const removeDateRange = (startDate: Dayjs, endDate: Dayjs) => {
      const newDates = new Map(unavailableDates);
      for (
        let d = startDate.clone();
        d.isSameOrBefore(endDate, "day");
        d = d.add(1, "day")
      ) {
        const dateStr = d.format("YYYY-MM-DD");
        // Remove only if source is "custom"
        if (newDates.has(dateStr) && newDates.get(dateStr) === "custom") {
          newDates.delete(dateStr);
        }
      }
      setUnavailableDates(newDates);
    };

    const isBlocked = (date: Dayjs) => {
      return unavailableDates.has(date.format("YYYY-MM-DD"));
    };

    const isPrevDayBlocked = (date: Dayjs) => {
      const prevDay = date.subtract(1, "day");
      return unavailableDates.has(prevDay.format("YYYY-MM-DD"));
    };

    // Helper function to get source of a blocked date
    const getDateSource = (date: Dayjs): string | undefined => {
      return unavailableDates.get(date.format("YYYY-MM-DD"));
    };

    // Helper function to add dates with a specific source (for syncing external calendars)
    const addDatesWithSource = (dates: string[], source: string) => {
      const newDates = new Map(unavailableDates);
      dates.forEach((date) => {
        newDates.set(date, source);
      });
      setUnavailableDates(newDates);
    };

    // Helper function to remove dates with a specific source (for unsyncing calendars)
    const removeDatesWithSource = (dates: string[], source: string) => {
      const newDates = new Map(unavailableDates);
      dates.forEach((date) => {
        if (newDates.has(date) && newDates.get(date) === source) {
          newDates.delete(date);
        }
      });
      setUnavailableDates(newDates);
    };

    // Helper function to get display name for source
    const getSourceDisplayName = (source?: string): string => {
      if (!source) return "Unknown";
      const sourceMap: { [key: string]: string } = {
        custom: "Custom",
        airbnb: "Airbnb",
        vrbo: "VRBO",
        google: "Google Calendar",
      };
      return (
        sourceMap[source] || source.charAt(0).toUpperCase() + source.slice(1)
      );
    };

    // Helper function to get source color/badge
    const getSourceColor = (source?: string): string => {
      if (!source) return "default";
      const colorMap: { [key: string]: string } = {
        custom: "blue",
        airbnb: "red",
        vrbo: "orange",
        google: "green",
      };
      return colorMap[source] || "default";
    };

    const dateFullCellRender = (date: Dayjs) => {
      const isInDragRange =
        isDragging.current &&
        dragStartDate.current &&
        dragEndDate.current &&
        date.isSameOrAfter(
          dayjs.min([dragStartDate.current, dragEndDate.current]),
          "day"
        ) &&
        date.isSameOrBefore(
          dayjs.max([dragStartDate.current, dragEndDate.current]),
          "day"
        );

      const isUnavailable = isBlocked(date) || isInDragRange;
      const prevDayUnavailable = isPrevDayBlocked(date);

      const renderColor = () => {
        if (context === "datepicker") return "black";

        if (!isUnavailable && !prevDayUnavailable) return "black";

        if (isUnavailable && prevDayUnavailable) {
          return "white";
        }

        return isUnavailable ? "black" : "white";
      };

      // Check if date is fully available (not blocked and previous day not blocked)
      const isFullyAvailable = !isUnavailable && !prevDayUnavailable;

      return (
        <div
          className="ant-picker-cell-inner ant-picker-calendar-date relative h-full flex items-center justify-center overflow-hidden"
          onMouseDown={() => context === "calender" && handleMouseDown(date)}
          onMouseEnter={() => context === "calender" && handleMouseEnter(date)}
          onMouseUp={handleMouseUp}
          style={{
            backgroundColor: isFullyAvailable ? "#bbf7d0" : undefined, // Professional muted green background for available dates
            borderTopColor: "#b0e9c4",
            borderTopWidth: "1px",
            borderTopStyle: "solid",
          }}
        >
          {/* Green background for first half if current date is blocked but previous is not */}
          {isUnavailable && !prevDayUnavailable && (
            <div
              className="absolute top-0 left-0 w-full h-full z-0"
              style={{
                backgroundColor: "#bbf7d0", // Professional muted green
                clipPath: "polygon(0px 100%, 0px 0px, 100% 0px)",
              }}
            />
          )}

          {/* Green background for second half if previous date is blocked but current is not */}
          {prevDayUnavailable && !isUnavailable && (
            <div
              className="absolute top-0 right-0 w-full h-full z-0"
              style={{
                backgroundColor: "#bbf7d0", // Professional muted green
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            />
          )}

          {/* Right triangle for current day */}
          {isUnavailable && (
            <div
              className="absolute top-0 right-0 w-full h-full bg-red-500 z-10"
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            />
          )}

          {/* Left triangle for next day */}
          {prevDayUnavailable && (
            <div
              className="absolute top-0 left-0 w-full h-full bg-red-500 z-10"
              style={{
                clipPath: "polygon(0px 100%, 0px 0px, 100% 0px)",
              }}
            />
          )}

          {isBlocked(date) && context === "calender" && (
            <div className="hidden sm:block absolute bottom-1 right-1 z-20 text-white text-[9px] sm:text-xs font-medium">
              Blocked
            </div>
          )}

          <div
            className="ant-picker-calendar-date-content relative z-20 text-center"
            style={{
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
          </div>
        </div>
      );
    };

    const groupDatesIntoRanges = (dates: Map<string, string>) => {
      if (dates.size === 0) return [];

      const sorted = Array.from(dates.keys())
        .map((d) => dayjs(d))
        .sort((a, b) => a.diff(b));

      const ranges: { start: Dayjs; end: Dayjs; source: string }[] = [];
      let currentStart = sorted[0];
      let currentEnd = sorted[0];
      let currentSource = dates.get(sorted[0].format("YYYY-MM-DD")) || "custom";

      for (let i = 1; i < sorted.length; i++) {
        const currentDate = sorted[i];
        const dateSource =
          dates.get(currentDate.format("YYYY-MM-DD")) || "custom";
        const isConsecutive = currentEnd
          .add(1, "day")
          .isSame(currentDate, "day");

        // Check if source is the same
        const sameSource = currentSource === dateSource;

        if (isConsecutive && sameSource) {
          currentEnd = currentDate;
        } else {
          ranges.push({
            start: currentStart,
            end: currentEnd,
            source: currentSource,
          });
          currentStart = currentDate;
          currentEnd = currentDate;
          currentSource = dateSource;
        }
      }

      ranges.push({
        start: currentStart,
        end: currentEnd,
        source: currentSource,
      });
      return ranges;
    };

    const getTotalBlockedDays = () => unavailableDates.size;

    // iCal Sync Functions
    const handleImportIcal = async () => {
      if (!icalUrl.trim() || !icalName.trim()) {
        message.error("Please provide both calendar name and URL");
        return;
      }

      // Normalize source name to lowercase for consistency
      const sourceName = icalName.toLowerCase().replace(/\s+/g, "_");
      console.log({ sourceName });
      try {
        // Show loading message
        const hideLoading = message.loading(
          "Fetching and parsing iCal data...",
          0
        );

        // Fetch and parse iCal
        const events = await fetchAndParseICal(icalUrl);

        if (events.length === 0) {
          hideLoading();
          message.warning("No events found in the iCal calendar");
          return;
        }

        // Extract blocked dates
        const blockedDates = extractBlockedDates(events);

        if (blockedDates.length === 0) {
          hideLoading();
          message.warning("No blocked dates found in the calendar");
          return;
        }

        // Add dates to the calendar with the source
        const newDates = new Map(unavailableDates);
        blockedDates.forEach((dateStr) => {
          newDates.set(dateStr, sourceName);
        });

        setUnavailableDates(newDates);

        // Add to external calendars list
        const newCalendar = {
          id: Date.now(),
          name: icalName,
          url: icalUrl,
          type: "custom",
          status: "synced",
          lastSync: new Date().toISOString(),
          nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          enabled: true,
        };

        setExternalCalendars([...externalCalendars, newCalendar]);

        // Clear form and close modal
        setIcalUrl("");
        setIcalName("");
        setImportModalVisible(false);

        hideLoading();
        message.success(
          `Successfully imported ${blockedDates.length} blocked dates from ${icalName}!`
        );

        // Trigger onDatesChange callback
        if (onDatesChange) {
          const allDates = Array.from(newDates.keys());
          onDatesChange(allDates);
        }
      } catch (error: any) {
        console.error("iCal import error:", error);
        message.error(error.message || "Failed to import iCal calendar");
      }
    };

    const handleExportIcal = () => {
      // Generate iCal content from blocked dates
      const icalContent = generateIcalContent();
      downloadIcalFile(icalContent, "flyinn-calendar.ics");
      setExportModalVisible(false);
      message.success("Calendar exported successfully!");
    };

    const generateIcalContent = () => {
      const now = new Date();
      const icalHeader = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//FlyInn//Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
      ];

      const events = Array.from(unavailableDates.entries()).map(
        ([date, source]) => {
          const sourceDisplay = getSourceDisplayName(source);
          return [
            "BEGIN:VEVENT",
            `UID:${Date.now()}-${Math.random()}`,
            `DTSTAMP:${now.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DTSTART;VALUE=DATE:${date.replace(/-/g, "")}`,
            `DTEND;VALUE=DATE:${dayjs(date).add(1, "day").format("YYYYMMDD")}`,
            "SUMMARY:Blocked Date",
            `DESCRIPTION:Date blocked for FlyInn calendar (Source: ${sourceDisplay})`,
            "STATUS:CONFIRMED",
            "END:VEVENT",
          ].join("\r\n");
        }
      );

      const icalFooter = ["END:VCALENDAR"];

      return [...icalHeader, ...events, ...icalFooter].join("\r\n");
    };

    const downloadIcalFile = (content: string, filename: string) => {
      const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    };

    const handleSyncNow = async (calendarId: number) => {
      setIsSyncing(true);
      setSyncProgress(0);

      // Find the calendar being synced
      const calendar = externalCalendars.find((cal) => cal.id === calendarId);
      if (!calendar) {
        setIsSyncing(false);
        return;
      }

      // Simulate sync process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setSyncProgress(i);
      }

      // TODO: When implementing actual iCal sync, parse the calendar and use:
      // const syncedDates = parseIcalDates(calendar.url); // Array of date strings
      // addDatesWithSource(syncedDates, calendar.type); // Add dates with source (airbnb, vrbo, google, etc.)

      // For now, this is just a simulation
      // Example: addDatesWithSource(["2024-01-20", "2024-01-21"], calendar.type);

      // Update calendar status
      setExternalCalendars((prev) =>
        prev.map((cal) =>
          cal.id === calendarId
            ? { ...cal, status: "synced", lastSync: new Date().toISOString() }
            : cal
        )
      );

      setIsSyncing(false);
      setSyncProgress(0);
      message.success("Calendar synced successfully!");
    };

    const toggleCalendarStatus = (calendarId: number) => {
      setExternalCalendars((prev) =>
        prev.map((cal) =>
          cal.id === calendarId ? { ...cal, enabled: !cal.enabled } : cal
        )
      );
    };

    const removeCalendar = (calendarId: number) => {
      setExternalCalendars((prev) =>
        prev.filter((cal) => cal.id !== calendarId)
      );
      message.success("Calendar removed successfully!");
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "synced":
          return "success";
        case "syncing":
          return "processing";
        case "error":
          return "error";
        default:
          return "default";
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "synced":
          return <CheckCircleOutlined />;
        case "syncing":
          return <SyncOutlined spin />;
        case "error":
          return <ExclamationCircleOutlined />;
        default:
          return <ClockCircleOutlined />;
      }
    };

    const getCalendarTypeIcon = (type: string) => {
      switch (type) {
        case "airbnb":
          return "🏠";
        case "vrbo":
          return "🏡";
        case "google":
          return "📅";
        default:
          return "📋";
      }
    };

    const handleReservePeriod = () => {
      if (
        !selectedDateRange ||
        !selectedDateRange[0] ||
        !selectedDateRange[1]
      ) {
        message.error("Please select a date range");
        return;
      }

      const [startDate, endDate] = selectedDateRange;
      const newDates = new Map(unavailableDates);

      // Add all dates in the range with "custom" source
      for (
        let d = startDate.clone();
        d.isSameOrBefore(endDate, "day");
        d = d.add(1, "day")
      ) {
        const dateStr = d.format("YYYY-MM-DD");
        newDates.set(dateStr, "custom");
      }

      setUnavailableDates(newDates);
      setReservePeriodModalVisible(false);
      setSelectedDateRange(null);

      const daysCount = endDate.diff(startDate, "days") + 1;
    };

    return (
      <>
        {context === "datepicker" && (
          <div className="w-full">
            <Calendar
              fullscreen={false}
              fullCellRender={dateFullCellRender}
              value={targetMonth || dayjs()}
              headerRender={() => null}
              disabledDate={(current) => true}
              mode="month"
              className="read-only-calendar"
            />
          </div>
        )}

        {context === "calender" && (
          <div className="">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar Section */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-0">
                  <Calendar
                    fullscreen
                    fullCellRender={dateFullCellRender}
                    className="border-0"
                    mode="month"
                    headerRender={({ value, onChange }) => {
                      const current = value.clone();
                      const month = current.month();
                      const year = current.year();

                      const months = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];

                      return (
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Button
                              type="text"
                              icon={<span className="text-lg">‹</span>}
                              onClick={() => {
                                const prevMonth = current.subtract(1, "month");
                                onChange(prevMonth);
                              }}
                              className="hover:bg-gray-100"
                            />
                          </div>

                          <div className="text-lg font-semibold text-gray-800">
                            {months[month]} {year}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              type="text"
                              icon={<span className="text-lg">›</span>}
                              onClick={() => {
                                const nextMonth = current.add(1, "month");
                                onChange(nextMonth);
                              }}
                              className="hover:bg-gray-100"
                            />
                          </div>
                        </div>
                      );
                    }}
                  />
                </Card>
              </div>

              {/* Sidebar Section */}
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {getTotalBlockedDays()}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {getTotalBlockedDays() === 1
                        ? "Day Blocked"
                        : "Days Blocked"}
                    </div>
                  </div>
                </Card>

                {/* iCal Sync Section */}
                <Card
                  title={
                    <div className="flex items-center justify-between">
                      <span className="font-semibold flex items-center">
                        <LinkOutlined className="mr-2 text-green-500" />
                        Calendar Sync
                      </span>
                      <Button
                        type="text"
                        icon={<SettingOutlined />}
                        onClick={() => setIcalSyncModalVisible(true)}
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        size="small"
                      />
                    </div>
                  }
                  className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50"
                >
                  <div className="space-y-4">
                    {/* Quick Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        type="primary"
                        icon={<CalendarOutlined />}
                        onClick={() => setReservePeriodModalVisible(true)}
                        className="w-full"
                        size="small"
                      >
                        Reserve a Period
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          type="primary"
                          icon={<ImportOutlined />}
                          onClick={() => setImportModalVisible(true)}
                          className="flex-1 bg-green-500 hover:bg-green-600 border-green-500"
                          size="small"
                        >
                          Import
                        </Button>
                        <Button
                          type="default"
                          icon={<ExportOutlined />}
                          onClick={() => setExportModalVisible(true)}
                          className="flex-1 border-green-300 text-green-600 hover:bg-green-50"
                          size="small"
                        >
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Blocked Dates List */}
                <Card
                  title={
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Blocked Date Ranges</span>
                      {unavailableDates.size > 0 && (
                        <Button
                          type="text"
                          icon={<ClearOutlined />}
                          onClick={clearAllBlockedDates}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          size="small"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                  }
                  className="shadow-lg border-0"
                >
                  {unavailableDates.size === 0 ? (
                    <div className="text-center py-8">
                      <BlockOutlined className="text-4xl text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">
                        No dates blocked yet
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Start by selecting dates on the calendar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {groupDatesIntoRanges(unavailableDates).map(
                        (range, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors duration-200"
                          >
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                              <div className="text-sm">
                                <div className="font-medium text-gray-800">
                                  {range.start.format("MMM D, YYYY")}
                                </div>
                                {!range.start.isSame(range.end, "day") && (
                                  <div className="text-gray-600">
                                    to {range.end.format("MMM D, YYYY")}
                                  </div>
                                )}
                                {range.source && (
                                  <div className="mt-1">
                                    <Tag color={getSourceColor(range.source)}>
                                      {range.source}
                                    </Tag>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                removeDateRange(range.start, range.end)
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                              size="small"
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* iCal Sync Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <LinkOutlined className="text-green-500" />
              <span>Calendar Sync Settings</span>
            </div>
          }
          open={icalSyncModalVisible}
          onCancel={() => setIcalSyncModalVisible(false)}
          footer={null}
          width={800}
          className="ical-sync-modal"
        >
          <div className="space-y-6">
            {/* Global Settings */}
            <Card title="Global Sync Settings" size="small">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Sync
                  </label>
                  <Switch
                    checked={autoSync}
                    onChange={setAutoSync}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sync Interval
                  </label>
                  <Select
                    value={syncInterval}
                    onChange={setSyncInterval}
                    className="w-full"
                  >
                    <Option value="hourly">Every Hour</Option>
                    <Option value="daily">Daily</Option>
                    <Option value="weekly">Weekly</Option>
                    <Option value="monthly">Monthly</Option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* External Calendars Management */}
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>External Calendars</span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setImportModalVisible(true)}
                    size="small"
                    className="bg-green-500 hover:bg-green-600 border-green-500"
                  >
                    Add Calendar
                  </Button>
                </div>
              }
              size="small"
            >
              <div className="space-y-3">
                {externalCalendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getCalendarTypeIcon(calendar.type)}
                      </span>
                      <div>
                        <div className="font-medium text-gray-800">
                          {calendar.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {calendar.url}
                        </div>
                        <div className="text-xs text-gray-400">
                          Last sync:{" "}
                          {dayjs(calendar.lastSync).format(
                            "MMM D, YYYY h:mm A"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(calendar.status)}
                        <Badge
                          status={getStatusColor(calendar.status) as any}
                        />
                      </div>
                      <Button
                        type="text"
                        icon={<ReloadOutlined />}
                        onClick={() => handleSyncNow(calendar.id)}
                        loading={isSyncing}
                        size="small"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Sync Now
                      </Button>
                      <Switch
                        checked={calendar.enabled}
                        onChange={() => toggleCalendarStatus(calendar.id)}
                      />
                      <Button
                        type="text"
                        icon={<MinusOutlined />}
                        onClick={() => removeCalendar(calendar.id)}
                        danger
                        size="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sync Progress */}
            {isSyncing && (
              <Card title="Sync Progress" size="small">
                <div className="space-y-3">
                  <Progress percent={syncProgress} status="active" />
                  <div className="text-sm text-gray-600 text-center">
                    Syncing calendar data...
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Modal>

        {/* Import iCal Dialog */}
        <Dialog
          open={importModalVisible}
          onOpenChange={(open) => {
            if (!open) setImportModalVisible(false);
          }}
        >
          <DialogContent className="max-w-[500px] [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ImportOutlined className="text-green-500" />
                <span>Import Calendar</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calendar Name
                </label>
                <Input
                  placeholder="e.g., Airbnb Calendar, VRBO Calendar"
                  value={icalName}
                  onChange={(e) => setIcalName(e.target.value)}
                  size="large"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  iCal URL
                </label>
                <Input
                  placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                  value={icalUrl}
                  onChange={(e) => setIcalUrl(e.target.value)}
                  size="large"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the iCal URL from your external calendar service
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Supported Servicess:</strong> Airbnb, VRBO, Google
                  Calendar, Outlook, Apple Calendar, and more
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setImportModalVisible(false)}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleImportIcal}
                className="text-sm bg-green-500 hover:bg-green-600 border-green-500"
              >
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export iCal Dialog */}
        <Dialog
          open={exportModalVisible}
          onOpenChange={(open) => {
            if (!open) setExportModalVisible(false);
          }}
        >
          <DialogContent className="max-w-[500px] [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ExportOutlined className="text-green-500" />
                <span>Export Calendar</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircleOutlined className="text-green-500 text-lg mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800 mb-1">
                      Export Your Blocked Dates
                    </div>
                    <div className="text-sm text-green-700">
                      This will create an iCal file containing all your blocked
                      dates that you can import into other calendar
                      applications.
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">
                    {getTotalBlockedDays()}
                  </div>
                  <div className="text-gray-500">Dates to Export</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">iCal 2.0</div>
                  <div className="text-gray-500">Format</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setExportModalVisible(false)}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleExportIcal}
                className="text-sm bg-green-500 hover:bg-green-600 border-green-500"
              >
                Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reserve Period Dialog */}
        <Dialog
          open={reservePeriodModalVisible}
          onOpenChange={(open) => {
            if (!open) {
              setReservePeriodModalVisible(false);
              setSelectedDateRange(null);
            }
          }}
        >
          <DialogContent className="max-w-[500px] [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarOutlined />
                <span>Reserve a Period</span>
              </DialogTitle>
              <DialogDescription>
                Select a date range to block on your calendar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date Range
                </label>
                <RangePicker
                  size="large"
                  className="w-full"
                  format="MMM D, YYYY"
                  value={selectedDateRange}
                  onChange={(dates) =>
                    setSelectedDateRange(
                      dates as [Dayjs | null, Dayjs | null] | null
                    )
                  }
                  placeholder={["Start Date", "End Date"]}
                />
              </div>
              {selectedDateRange &&
                selectedDateRange[0] &&
                selectedDateRange[1] && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <InfoCircleOutlined className="text-gray-600 text-lg mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-800 mb-1">
                          Period Summary
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div>
                            <strong>From:</strong>{" "}
                            {selectedDateRange[0].format("MMMM D, YYYY")}
                          </div>
                          <div>
                            <strong>To:</strong>{" "}
                            {selectedDateRange[1].format("MMMM D, YYYY")}
                          </div>
                          <div>
                            <strong>Total Days:</strong>{" "}
                            {selectedDateRange[1].diff(
                              selectedDateRange[0],
                              "days"
                            ) + 1}{" "}
                            days
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setReservePeriodModalVisible(false);
                  setSelectedDateRange(null);
                }}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleReservePeriod}
                disabled={
                  !selectedDateRange ||
                  !selectedDateRange[0] ||
                  !selectedDateRange[1]
                }
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

FlyInnCalender.displayName = "FlyInnCalender";

export default FlyInnCalender;
