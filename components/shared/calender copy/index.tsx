"use client";

import React, { useState, useRef } from "react";
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
} from "antd";
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
import isSameOrBefore from "dayjs/plugin/minMax";
import minMax from "dayjs/plugin/minMax";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);
dayjs.extend(relativeTime);

const { Option } = Select;
const { Panel } = Collapse;

const FlyInnCalender = ({ context = "calender", targetMonth }: any) => {
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(
    new Set()
  );

  // iCal Sync States
  const [icalSyncModalVisible, setIcalSyncModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [icalUrl, setIcalUrl] = useState("");
  const [icalName, setIcalName] = useState("");
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
      const newDates = new Set(unavailableDates);

      if (newDates.has(dateStr)) {
        newDates.delete(dateStr);
      } else {
        newDates.add(dateStr);
      }

      setUnavailableDates(newDates);
    } else {
      const newDates = new Set(unavailableDates);
      const min = dayjs.min(start, end);
      const max = dayjs.max(start, end);

      for (
        let d = min.clone();
        d.isSameOrBefore(max, "day");
        d = d.add(1, "day")
      ) {
        newDates.add(d.format("YYYY-MM-DD"));
      }

      setUnavailableDates(newDates);
    }

    isDragging.current = false;
    dragStartDate.current = null;
    dragEndDate.current = null;
  };

  const clearAllBlockedDates = () => {
    setUnavailableDates(new Set());
  };

  const removeDateRange = (startDate: Dayjs, endDate: Dayjs) => {
    const newDates = new Set(unavailableDates);
    for (
      let d = startDate.clone();
      d.isSameOrBefore(endDate, "day");
      d = d.add(1, "day")
    ) {
      newDates.delete(d.format("YYYY-MM-DD"));
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

    const renderColor = () => {
      if (context === "datepicker") return "black";

      if (!isUnavailable && !prevDayUnavailable) return "black";

      if (isUnavailable && prevDayUnavailable) {
        return "white";
      }

      return isUnavailable ? "black" : "white";
    };

    return (
      <div
        className="ant-picker-cell-inner ant-picker-calendar-date relative h-full flex items-center justify-center overflow-hidden"
        onMouseDown={() => context === "calender" && handleMouseDown(date)}
        onMouseEnter={() => context === "calender" && handleMouseEnter(date)}
        onMouseUp={handleMouseUp}
      >
        {/* Right triangle for current day */}
        {isUnavailable && (
          <div
            className="absolute top-0 right-0 w-full h-full bg-red-500 z-10"
            style={{
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              // REMOVE pointerEvents: "none",
            }}
          />
        )}

        {/* Left triangle for next day */}
        {prevDayUnavailable && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-red-500 z-10"
            style={{
              clipPath: "polygon(0px 100%, 0px 0px, 100% 0px)",
              // REMOVE pointerEvents: "none",
            }}
          />
        )}

        {isBlocked(date) && context === "calender" && (
          <div
            className="absolute bottom-1 right-1 z-20 text-white text-xs font-medium"
            style={
              {
                // REMOVE pointerEvents: "none"
              }
            }
          >
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
            // REMOVE pointerEvents: "none",
          }}
        >
          {date.date()}
        </div>
      </div>
    );
  };

  const groupDatesIntoRanges = (dates: Set<string>) => {
    if (dates.size === 0) return [];

    const sorted = Array.from(dates)
      .map((d) => dayjs(d))
      .sort((a, b) => a.diff(b));

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

  const getTotalBlockedDays = () => unavailableDates.size;

  // iCal Sync Functions
  const handleImportIcal = () => {
    if (!icalUrl.trim() || !icalName.trim()) {
      message.error("Please provide both calendar name and URL");
      return;
    }

    const newCalendar = {
      id: Date.now(),
      name: icalName,
      url: icalUrl,
      type: "custom",
      status: "syncing",
      lastSync: new Date().toISOString(),
      nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      enabled: true,
    };

    setExternalCalendars([...externalCalendars, newCalendar]);
    setIcalUrl("");
    setIcalName("");
    setImportModalVisible(false);
    message.success("Calendar imported successfully!");
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

    const events = Array.from(unavailableDates).map((date) =>
      [
        "BEGIN:VEVENT",
        `UID:${Date.now()}-${Math.random()}`,
        `DTSTAMP:${now.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART;VALUE=DATE:${date.replace(/-/g, "")}`,
        `DTEND;VALUE=DATE:${dayjs(date).add(1, "day").format("YYYYMMDD")}`,
        "SUMMARY:Blocked Date",
        "DESCRIPTION:Date blocked for FlyInn calendar",
        "STATUS:CONFIRMED",
        "END:VEVENT",
      ].join("\r\n")
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

    // Simulate sync process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setSyncProgress(i);
    }

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
    setExternalCalendars((prev) => prev.filter((cal) => cal.id !== calendarId));
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
              {/* Blocked Dates List */}
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <div>
                      {getTotalBlockedDays() < 1 && (
                        <span className="font-semibold">
                          Blocked Date Ranges
                        </span>
                      )}
                      {getTotalBlockedDays() > 1 && (
                        <span>
                          {getTotalBlockedDays()}{" "}
                          {getTotalBlockedDays() === 1
                            ? "Day Blocked"
                            : "Days Blocked"}
                        </span>
                      )}
                    </div>

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
                  <div className="text-center ">
                    <BlockOutlined className="text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      No dates blocked yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Start by selecting dates on the calendar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {groupDatesIntoRanges(unavailableDates).map(
                      (range, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-1.5 bg-red-50 rounded border border-red-200 hover:bg-red-100 transition-colors duration-200"
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
                            <div className="text-xs flex">
                              <div className="font-medium text-gray-800">
                                {range.start.format("MMM D")}
                              </div>
                              {!range.start.isSame(range.end, "day") && (
                                <div className="text-gray-600">
                                  - {range.end.format("MMM D")}
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

                  {/* External Calendars */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Connected Calendars (
                      {externalCalendars.filter((cal) => cal.enabled).length})
                    </div>
                    {externalCalendars.slice(0, 3).map((calendar) => (
                      <div
                        key={calendar.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getCalendarTypeIcon(calendar.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {calendar.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {dayjs(calendar.lastSync).fromNow()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            <Badge
                              status={getStatusColor(calendar.status) as any}
                              size="small"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {externalCalendars.length > 3 && (
                      <div className="text-center">
                        <Button
                          type="text"
                          size="small"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => setIcalSyncModalVisible(true)}
                        >
                          View All ({externalCalendars.length})
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Instructions */}
              <Card className="shadow-lg border-0 bg-gray-50">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <InfoCircleOutlined className="mr-2 text-blue-500" />
                    How to Use
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <Badge count="1" className="mr-3 mt-0.5" />
                      <span>Click and drag to select multiple dates</span>
                    </div>
                    <div className="flex items-start">
                      <Badge count="2" className="mr-3 mt-0.5" />
                      <span>Click individual dates to toggle them</span>
                    </div>
                    <div className="flex items-start">
                      <Badge count="3" className="mr-3 mt-0.5" />
                      <span>Remove ranges by clicking the delete button</span>
                    </div>
                  </div>
                </div>
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
                        {dayjs(calendar.lastSync).format("MMM D, YYYY h:mm A")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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

      {/* Import iCal Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <ImportOutlined className="text-green-500" />
            <span>Import Calendar</span>
          </div>
        }
        open={importModalVisible}
        onOk={handleImportIcal}
        onCancel={() => setImportModalVisible(false)}
        okText="Import"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-green-500 hover:bg-green-600 border-green-500",
        }}
      >
        <div className="space-y-4">
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
              <strong>Supported Services:</strong> Airbnb, VRBO, Google
              Calendar, Outlook, Apple Calendar, and more
            </div>
          </div>
        </div>
      </Modal>

      {/* Export iCal Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <ExportOutlined className="text-green-500" />
            <span>Export Calendar</span>
          </div>
        }
        open={exportModalVisible}
        onOk={handleExportIcal}
        onCancel={() => setExportModalVisible(false)}
        okText="Export"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-green-500 hover:bg-green-600 border-green-500",
        }}
      >
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircleOutlined className="text-green-500 text-lg mt-0.5" />
              <div>
                <div className="font-medium text-green-800 mb-1">
                  Export Your Blocked Dates
                </div>
                <div className="text-sm text-green-700">
                  This will create an iCal file containing all your blocked
                  dates that you can import into other calendar applications.
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
      </Modal>
    </>
  );
};

export default FlyInnCalender;
