"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Space, Image, Tag, Input, Row, Col } from "antd";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  ClearOutlined,
  CalendarOutlined,
  HomeOutlined,
  UserOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);
import {
  BookingStatus,
  PaymentStatus,
  bookingStatusFilterOptions,
  getBookingStatusConfig,
  canCancelBooking,
  isBookingInProgress,
} from "@/constants/bookings";

export interface Booking {
  id: number;
  booking_reference: string;
  stay_id: number;
  guest_id: number;
  host_id?: number;
  status: BookingStatus | string;
  arrival_date: string;
  departure_date: string;
  guests: number;
  children: number;
  infants: number;
  pets: number;
  nights: number;
  grand_total: number | string;
  pricing?: {
    base_avg_nightly_price?: number;
    base_total_price?: number;
    extra_guest_fee?: number;
    pet_fee?: number;
    avg_nightly_price?: number;
    total_price?: number;
    nights?: number;
    cleaning_fee?: number;
    city_fee?: number;
    platform_fee?: number;
    lodging_tax?: number;
    grand_total?: number;
  };
  listing_snapshot?: string | Record<string, any>;
  payment_intent_id?: string;
  payment_status?: PaymentStatus | string;
  created_at: string;
  updated_at?: string;
  confirmed_at?: string;
  cancelled_at?: string;
  checked_in_at?: string;
  checked_in_by?: "guest" | "host";
  stay?: {
    id: number;
    title: string;
    city: string;
    state: string;
    images?: Array<{ id: number; url: string; image?: string }>;
  };
  guest?: {
    id: number;
    display_name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    image?: string;
  };
  host?: {
    id: number;
    display_name: string;
    email: string;
  };
}

export type ViewMode = "guest" | "host" | "admin";

interface BookingsListViewProps {
  /**
   * View mode determines the perspective and columns shown:
   * - "guest": My Trips - bookings where user is the guest
   * - "host": My Bookings - bookings where user is the host
   * - "admin": All Bookings - admin view with both guest and host columns
   */
  viewMode: ViewMode;
  /**
   * Page title
   */
  title: string;
  /**
   * Page subtitle/description
   */
  subtitle: string;
  /**
   * Label for the total amount column
   * - For guests: "Total Paid"
   * - For hosts: "Earnings"
   */
  amountLabel?: string;
}

const BookingsListView: React.FC<BookingsListViewProps> = ({
  viewMode,
  title,
  subtitle,
  amountLabel = "Total",
}) => {
  const router = useRouter();
  const { message: appMessage } = useApp();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  // Detect mobile screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build query parameters for API call
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("per_page", pageSize.toString());

    if (searchTerm.trim()) {
      params.append("search", searchTerm.trim());
    }

    if (statusFilter) {
      params.append("status", statusFilter);
    }

    return params.toString();
  };

  // Determine the endpoint based on view mode
  const getEndpoint = () => {
    switch (viewMode) {
      case "guest":
        return `/api/bookings/me/guest?${buildQueryParams()}`;
      case "host":
        return `/api/bookings/me/host?${buildQueryParams()}`;
      case "admin":
        return `/api/bookings?${buildQueryParams()}`;
      default:
        return `/api/bookings/me/guest?${buildQueryParams()}`;
    }
  };

  // Fetch bookings data
  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useApiGet({
    endpoint: getEndpoint(),
    queryKey: [
      "bookings",
      viewMode,
      currentPage,
      pageSize,
      searchTerm,
      statusFilter,
    ],
  });

  console.log({ bookingsData });

  // Extract pagination from backend response
  const paginationData = bookingsData?.pagination || {
    current_page: bookingsData?.current_page || 1,
    per_page: bookingsData?.per_page || 50,
    total: bookingsData?.total || 0,
    last_page: bookingsData?.last_page || 1,
  };

  // Extract stats from backend response
  const stats = bookingsData?.stats || {
    total: 0,
    pending_payment: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(undefined);
    setCurrentPage(1);
  };

  // Cancel booking mutation
  const { mutate: cancelBooking, isPending: cancellingBooking } =
    useApiMutation({
      endpoint: `/api/bookings/${selectedBooking?.id}/cancel`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking cancelled successfully!");
          setCancelModalVisible(false);
          setSelectedBooking(null);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to cancel booking"
          );
        },
      },
    });

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelModalVisible(true);
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      cancelBooking({});
    }
  };

  // Accept booking mutation (host only)
  const { mutate: acceptBooking, isPending: acceptingBooking } = useApiMutation(
    {
      endpoint: `/api/bookings/${selectedBooking?.id}/accept`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking accepted successfully!");
          setSelectedBooking(null);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to accept booking"
          );
        },
      },
    }
  );

  const handleAcceptBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    acceptBooking({});
  };

  // Decline booking mutation (host only)
  const { mutate: declineBooking, isPending: decliningBooking } =
    useApiMutation({
      endpoint: `/api/bookings/${selectedBooking?.id}/decline`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking declined");
          setSelectedBooking(null);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to decline booking"
          );
        },
      },
    });

  const handleDeclineBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    declineBooking({});
  };

  // Complete booking mutation (guest, host, or admin)
  const { mutate: completeBooking, isPending: completingBooking } =
    useApiMutation({
      endpoint: `/api/bookings/${selectedBooking?.id}/complete`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking marked as completed successfully!");
          setSelectedBooking(null);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to complete booking"
          );
        },
      },
    });

  const handleCompleteBooking = (booking: Booking) => {
    if (
      !confirm(
        "Are you sure you want to mark this booking as completed? This action cannot be undone."
      )
    ) {
      return;
    }
    setSelectedBooking(booking);
    completeBooking({});
  };

  const handleViewDetails = (booking: Booking) => {
    // Navigate to the appropriate detail page based on view mode
    switch (viewMode) {
      case "guest":
        router.push(`/dashboard/trips/${booking.id}`);
        break;
      case "host":
        router.push(`/dashboard/bookings/${booking.id}`);
        break;
      case "admin":
        router.push(`/admin-dashboard/bookings/${booking.id}`);
        break;
      default:
        router.push(`/dashboard/bookings/${booking.id}`);
    }
  };

  // Parse listing snapshot if it's a string
  const parseListingSnapshot = (snapshot: string | any) => {
    if (!snapshot) return null;
    if (typeof snapshot === "string") {
      try {
        return JSON.parse(snapshot);
      } catch {
        return null;
      }
    }
    return snapshot;
  };

  // Get stay image from booking
  const getStayImage = (booking: Booking) => {
    if (booking.stay?.images && booking.stay.images.length > 0) {
      return booking.stay.images[0]?.url || booking.stay.images[0]?.image;
    }
    const snapshot = parseListingSnapshot(booking.listing_snapshot);
    return snapshot?.primary_image;
  };

  // Get stay title from booking
  const getStayTitle = (booking: Booking) => {
    if (booking.stay?.title) return booking.stay.title;
    const snapshot = parseListingSnapshot(booking.listing_snapshot);
    return snapshot?.title || `Stay #${booking.stay_id}`;
  };

  // Get stay location from booking
  const getStayLocation = (booking: Booking) => {
    if (booking.stay?.city || booking.stay?.state) {
      return [booking.stay.city, booking.stay.state].filter(Boolean).join(", ");
    }
    const snapshot = parseListingSnapshot(booking.listing_snapshot);
    if (snapshot?.city || snapshot?.state) {
      return [snapshot.city, snapshot.state].filter(Boolean).join(", ");
    }
    return "";
  };

  // Check if checkout datetime has passed
  const hasCheckoutPassed = (booking: Booking): boolean => {
    if (!booking.departure_date) return false;

    const snapshot = parseListingSnapshot(booking.listing_snapshot);
    const propertyTimezone =
      (booking.stay as any)?.timezone ||
      snapshot?.timezone ||
      "America/New_York";

    const now = dayjs().tz(propertyTimezone);

    // Get checkout time (default to 11:00:00 if not specified)
    const checkOutTime =
      (booking.stay as any)?.check_out_before ||
      snapshot?.check_out_before ||
      "11:00:00";

    // Combine departure date + checkout time in property's timezone
    const checkOutDateTime = dayjs.tz(
      `${booking.departure_date} ${checkOutTime}`,
      propertyTimezone
    );

    // Return true if checkout datetime has passed
    return now.isAfter(checkOutDateTime);
  };

  const columns = useMemo(
    () => [
      {
        title: "Ref #",
        dataIndex: "booking_reference",
        key: "booking_reference",
        width: 180,
        render: (ref: string) => (
          <span className="text-xs sm:text-sm font-mono font-medium text-gray-900">
            {ref || "—"}
          </span>
        ),
      },
      {
        title: viewMode === "host" ? "Property" : "Stay",
        key: "stay",
        width: isMobile ? 180 : 280,
        render: (_: any, record: Booking) => {
          const image = getStayImage(record);
          const stayTitle = getStayTitle(record);
          const location = getStayLocation(record);

          return (
            <div className="flex items-center gap-3">
              {image ? (
                <Image
                  src={image}
                  alt="Stay"
                  width={isMobile ? 40 : 50}
                  height={isMobile ? 40 : 50}
                  className="rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className={`${
                    isMobile ? "w-10 h-10" : "w-[50px] h-[50px]"
                  } bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <HomeOutlined className="text-gray-400" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {stayTitle}
                </p>
                {location && (
                  <p className="text-xs text-gray-500 truncate">{location}</p>
                )}
              </div>
            </div>
          );
        },
      },
      // Guest column - show for host view and admin
      ...(viewMode === "host" || viewMode === "admin"
        ? [
            {
              title: "Guest",
              key: "guest",
              width: 220,
              render: (_: any, record: Booking) => (
                <div className="flex items-center gap-2">
                  {record.guest?.image ? (
                    <Image
                      src={record.guest.image}
                      alt="Guest"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-gray-400 text-sm" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {record.guest?.display_name ||
                        `${record.guest?.first_name || ""} ${
                          record.guest?.last_name || ""
                        }`.trim() ||
                        "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.guest?.email || ""}
                    </p>
                  </div>
                </div>
              ),
            },
          ]
        : []),
      // Host column - show for guest view and admin
      ...(viewMode === "guest" || viewMode === "admin"
        ? [
            {
              title: "Host",
              key: "host",
              width: 180,
              render: (_: any, record: Booking) => (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {record.host?.display_name || "—"}
                  </p>
                  {/* Only show host email to admin, not to guest */}
                  {viewMode === "admin" && record.host?.email && (
                    <p className="text-xs text-gray-500">{record.host.email}</p>
                  )}
                </div>
              ),
            },
          ]
        : []),
      {
        title: "Dates",
        key: "dates",
        width: 230,
        render: (_: any, record: Booking) => (
          <div>
            <div className="flex items-center gap-1.5">
              <CalendarOutlined className="text-gray-400 text-xs" />
              <span className="text-xs sm:text-sm text-gray-900">
                {dayjs(record.arrival_date).format("MMM D")} –{" "}
                {dayjs(record.departure_date).format("MMM D, YYYY")}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {record.nights ||
                dayjs(record.departure_date).diff(
                  dayjs(record.arrival_date),
                  "day"
                )}{" "}
              night
              {(record.nights || 1) > 1 ? "s" : ""}
            </p>
          </div>
        ),
      },
      {
        title: "Guests",
        key: "guests_info",
        width: 120,
        render: (_: any, record: Booking) => (
          <div className="text-xs sm:text-sm text-gray-700">
            <span>
              {record.guests} adult{record.guests > 1 ? "s" : ""}
            </span>
            {record.children > 0 && (
              <span className="text-gray-500">
                , {record.children} child{record.children > 1 ? "ren" : ""}
              </span>
            )}
            {record.pets > 0 && (
              <span className="text-gray-500">
                , {record.pets} pet{record.pets > 1 ? "s" : ""}
              </span>
            )}
          </div>
        ),
      },
      {
        title: amountLabel,
        key: "grand_total",
        width: 130,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.grand_total || a.grand_total || 0) -
          Number(b.pricing?.grand_total || b.grand_total || 0),
        render: (_: any, record: Booking) => {
          const total = record.pricing?.grand_total || record.grand_total || 0;
          return (
            <span className="text-xs sm:text-sm font-semibold text-green-600">
              ${Number(total).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 180,
        sorter: (a: Booking, b: Booking) =>
          (a.status || "").localeCompare(b.status || ""),
        render: (status: string, record: Booking) => {
          const isInProgress = isBookingInProgress(record);
          const statusConfig = getBookingStatusConfig(status);
          return (
            <span
              className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                isInProgress
                  ? "bg-blue-500 text-white"
                  : `${statusConfig.bgColor} ${statusConfig.textColor}`
              }`}
            >
              {isInProgress ? "In Progress" : statusConfig.text}
            </span>
          );
        },
      },
      {
        title: "Booked On",
        dataIndex: "created_at",
        key: "created_at",
        width: isMobile ? 100 : 130,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-600">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: isMobile ? 60 : 80,
        fixed: isMobile ? undefined : ("right" as const),
        render: (_: any, record: Booking) => {
          const menuItems = [
            {
              key: "view",
              label: (
                <Space>
                  <EyeOutlined />
                  View Details
                </Space>
              ),
              onClick: () => handleViewDetails(record),
            },
            {
              key: "view-stay",
              label: (
                <Space>
                  <HomeOutlined />
                  View Stay
                </Space>
              ),
              onClick: () =>
                window.open(`/public/stays/${record.stay_id}`, "_blank"),
            },
          ];

          // Add cancel option if booking can be cancelled and arrival date hasn't passed
          // Guests can cancel their own bookings
          if (
            viewMode === "guest" &&
            canCancelBooking(record.status as BookingStatus) &&
            dayjs(record.arrival_date).isAfter(dayjs())
          ) {
            menuItems.push({
              key: "cancel",
              label: (
                <Space className="text-red-500">
                  <CloseCircleOutlined />
                  Cancel Trip
                </Space>
              ),
              onClick: () => handleCancelBooking(record),
            });
          }

          // Add accept/decline options for host when booking is pending
          if (
            viewMode === "host" &&
            record.status === BookingStatus.PENDING_PAYMENT &&
            (record.payment_status === "authorized" ||
              record.payment_status === "pending")
          ) {
            menuItems.push(
              {
                key: "accept",
                label: (
                  <Space className="text-green-600">
                    <CheckCircleOutlined />
                    Accept Booking
                  </Space>
                ),
                onClick: () => handleAcceptBooking(record),
              },
              {
                key: "decline",
                label: (
                  <Space className="text-red-500">
                    <CloseCircleOutlined />
                    Decline Booking
                  </Space>
                ),
                onClick: () => handleDeclineBooking(record),
              }
            );
          }

          // Add complete booking option for confirmed bookings where checkout has passed
          if (
            record.status === BookingStatus.CONFIRMED &&
            hasCheckoutPassed(record)
          ) {
            menuItems.push({
              key: "complete",
              label: (
                <Space className="text-green-600">
                  <CheckCircleOutlined />
                  Mark as Completed
                </Space>
              ),
              onClick: () => handleCompleteBooking(record),
            });
          }

          const menuItemClassName =
            "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[rgba(175,35,34,0.08)] hover:text-[#AF2322] focus:bg-[rgba(175,35,34,0.08)] focus:text-[#AF2322] cursor-pointer";

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  size={isMobile ? "small" : "middle"}
                  className="hover:bg-gray-100"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isMobile ? "start" : "end"}
                className="min-w-[180px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)]"
                sideOffset={8}
              >
                {menuItems.map((item) => {
                  const labelContent = item.label;
                  let icon: React.ReactNode = null;
                  let text: React.ReactNode = null;
                  let textColor = "";

                  if (React.isValidElement(labelContent)) {
                    const props = labelContent.props as any;
                    if (props?.className?.includes("red")) {
                      textColor = "text-red-500";
                    }
                    const children = React.Children.toArray(
                      props?.children || []
                    );
                    icon = children[0];
                    text = children[1];
                  }

                  return (
                    <DropdownMenuItem
                      key={item.key}
                      className={`${menuItemClassName} ${textColor}`}
                      onSelect={(e) => {
                        e.preventDefault();
                        item.onClick?.();
                      }}
                    >
                      {icon}
                      <span>{text}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isMobile, viewMode, amountLabel]
  );

  // Get bookings array from response
  const bookings = bookingsData?.data || bookingsData?.bookings || [];

  // Get search placeholder based on view mode
  const getSearchPlaceholder = () => {
    switch (viewMode) {
      case "guest":
        return "Search by reference, host, stay...";
      case "host":
        return "Search by reference, guest, property...";
      case "admin":
        return "Search by reference, guest, host, stay...";
      default:
        return "Search...";
    }
  };

  return (
    <div className="bg-white p-3 md:p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={10} lg={8}>
              <Input
                placeholder={getSearchPlaceholder()}
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                allowClear
                size={isMobile ? "middle" : "large"}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <SearchableSelect
                value={statusFilter}
                onValueChange={(value) => {
                  const stringValue = Array.isArray(value) ? value[0] : value;
                  handleStatusFilterChange(stringValue);
                }}
                options={bookingStatusFilterOptions}
                placeholder="Filter by status"
                showSearch={false}
              />
            </Col>
            {(searchTerm || statusFilter) && (
              <Col xs={24} sm={24} md={6} lg={4}>
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  size={isMobile ? "middle" : "large"}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </Col>
            )}
          </Row>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <i className="fa fa-info-circle" aria-hidden="true"></i>
              Please scroll right and left to view more columns.
            </p>
          </div>
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: paginationData.current_page,
              pageSize: paginationData.per_page,
              total: paginationData.total,
              showSizeChanger: !isMobile,
              showQuickJumper: !isMobile,
              showTotal: (total, range) =>
                isMobile
                  ? `${range[0]}-${range[1]} of ${total}`
                  : `${range[0]}-${range[1]} of ${total} ${
                      viewMode === "guest" ? "trips" : "bookings"
                    }`,
              size: isMobile ? "small" : "default",
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              onShowSizeChange: (_, size) => {
                setCurrentPage(1);
                setPageSize(size);
              },
            }}
            scroll={{ x: isMobile ? 800 : 1400 }}
            className="ant-table-bookings"
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Dialog
        open={cancelModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setCancelModalVisible(false);
            setSelectedBooking(null);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              {viewMode === "guest" ? "Cancel Trip" : "Cancel Booking"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel{" "}
              {viewMode === "guest" ? "your trip" : "booking"}{" "}
              <strong>{selectedBooking?.booking_reference}</strong>? This action
              may be subject to the property&apos;s cancellation policy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setCancelModalVisible(false);
                setSelectedBooking(null);
              }}
            >
              Keep {viewMode === "guest" ? "Trip" : "Booking"}
            </Button>
            <Button
              type="primary"
              danger
              onClick={confirmCancelBooking}
              loading={cancellingBooking}
            >
              Cancel {viewMode === "guest" ? "Trip" : "Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsListView;
