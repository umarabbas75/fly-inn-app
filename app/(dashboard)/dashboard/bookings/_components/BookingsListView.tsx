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
import {
  BookingStatus,
  PaymentStatus,
  bookingStatusFilterOptions,
  paymentStatusFilterOptions,
  getBookingStatusConfig,
  getPaymentStatusConfig,
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
  // Admin-specific filters
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    string | undefined
  >(undefined);
  const [guestIdFilter, setGuestIdFilter] = useState<string>("");
  const [hostIdFilter, setHostIdFilter] = useState<string>("");
  const [stayIdFilter, setStayIdFilter] = useState<string>("");

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

    // Admin-specific filters
    if (viewMode === "admin") {
      if (paymentStatusFilter) {
        params.append("payment_status", paymentStatusFilter);
      }
      if (guestIdFilter.trim()) {
        params.append("guest_id", guestIdFilter.trim());
      }
      if (hostIdFilter.trim()) {
        params.append("host_id", hostIdFilter.trim());
      }
      if (stayIdFilter.trim()) {
        params.append("stay_id", stayIdFilter.trim());
      }
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
        return `/api/bookings/admin/all?${buildQueryParams()}`;
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
      // Admin-specific filter keys
      ...(viewMode === "admin"
        ? [paymentStatusFilter, guestIdFilter, hostIdFilter, stayIdFilter]
        : []),
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
    // Clear admin-specific filters
    if (viewMode === "admin") {
      setPaymentStatusFilter(undefined);
      setGuestIdFilter("");
      setHostIdFilter("");
      setStayIdFilter("");
    }
    setCurrentPage(1);
  };

  // Check if any admin filter is active
  const hasAdminFiltersActive =
    viewMode === "admin" &&
    (paymentStatusFilter ||
      guestIdFilter.trim() ||
      hostIdFilter.trim() ||
      stayIdFilter.trim());

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

  // Admin-specific columns with pricing breakdown
  const adminColumns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        sorter: (a: Booking, b: Booking) => a.id - b.id,
        render: (id: number) => (
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {id}
          </span>
        ),
      },
      {
        title: "Guest",
        key: "guest",
        width: 250,
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {record.guest?.display_name ||
                  `${record.guest?.first_name || ""} ${
                    record.guest?.last_name || ""
                  }`.trim() ||
                  "—"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {record.guest?.email || ""}
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Host",
        key: "host",
        width: 180,
        render: (_: any, record: Booking) => (
          <div>
            <p className="text-sm font-medium text-gray-900">
              {record.host?.display_name || "—"}
            </p>
            <p className="text-xs text-gray-500">{record.host?.email || ""}</p>
          </div>
        ),
      },
      {
        title: "Date Created",
        dataIndex: "created_at",
        key: "created_at",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-600">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Title",
        key: "stay_title",
        width: 250,
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
                  width={40}
                  height={40}
                  className="rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
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
      {
        title: "Check In",
        dataIndex: "arrival_date",
        key: "arrival_date",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.arrival_date).getTime() -
          new Date(b.arrival_date).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-900">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Check Out",
        dataIndex: "departure_date",
        key: "departure_date",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.departure_date).getTime() -
          new Date(b.departure_date).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-900">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Rent $",
        key: "base_total_price",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.base_total_price || 0) -
          Number(b.pricing?.base_total_price || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.base_total_price || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Add. Guests $",
        key: "extra_guest_fee",
        width: 130,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.extra_guest_fee || 0) -
          Number(b.pricing?.extra_guest_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.extra_guest_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Pet Fee $",
        key: "pet_fee",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.pet_fee || 0) - Number(b.pricing?.pet_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.pet_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Cleaning Fee $",
        key: "cleaning_fee",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.cleaning_fee || 0) -
          Number(b.pricing?.cleaning_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.cleaning_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Platform Fee $",
        key: "platform_fee",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.platform_fee || 0) -
          Number(b.pricing?.platform_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.platform_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Total Before Tax",
        key: "total_before_tax",
        width: 160,
        sorter: (a: Booking, b: Booking) => {
          const totalA =
            Number(a.pricing?.total_price || 0) +
            Number(a.pricing?.cleaning_fee || 0) +
            Number(a.pricing?.platform_fee || 0);
          const totalB =
            Number(b.pricing?.total_price || 0) +
            Number(b.pricing?.cleaning_fee || 0) +
            Number(b.pricing?.platform_fee || 0);
          return totalA - totalB;
        },
        render: (_: any, record: Booking) => {
          const amount =
            Number(record.pricing?.total_price || 0) +
            Number(record.pricing?.cleaning_fee || 0) +
            Number(record.pricing?.platform_fee || 0);
          return (
            <span className="text-xs sm:text-sm font-semibold text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "City Fee $",
        key: "city_fee",
        width: 150,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.city_fee || 0) - Number(b.pricing?.city_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.city_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Taxes $",
        key: "lodging_tax",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.lodging_tax || 0) -
          Number(b.pricing?.lodging_tax || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.lodging_tax || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Total",
        key: "grand_total",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.grand_total || a.grand_total || 0) -
          Number(b.pricing?.grand_total || b.grand_total || 0),
        render: (_: any, record: Booking) => {
          const total = record.pricing?.grand_total || record.grand_total || 0;
          return (
            <span className="text-xs sm:text-sm font-bold text-green-600">
              ${Number(total).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 140,
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
        title: "Payment",
        dataIndex: "payment_status",
        key: "payment_status",
        width: 130,
        sorter: (a: Booking, b: Booking) =>
          (a.payment_status || "").localeCompare(b.payment_status || ""),
        render: (paymentStatus: string) => {
          const config = getPaymentStatusConfig(paymentStatus);
          return (
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}
            >
              {config.text}
            </span>
          );
        },
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
    [isMobile]
  );

  // Guest-specific columns with pricing breakdown
  const guestColumns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        sorter: (a: Booking, b: Booking) => a.id - b.id,
        render: (id: number) => (
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {id}
          </span>
        ),
      },
      {
        title: "Host",
        key: "host",
        width: 180,
        render: (_: any, record: Booking) => (
          <div>
            <p className="text-sm font-medium text-gray-900">
              {record.host?.display_name || "—"}
            </p>
          </div>
        ),
      },
      {
        title: "Date Created",
        dataIndex: "created_at",
        key: "created_at",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-600">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Title",
        key: "stay_title",
        width: 250,
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
                  width={40}
                  height={40}
                  className="rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
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
      {
        title: "Check In",
        dataIndex: "arrival_date",
        key: "arrival_date",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.arrival_date).getTime() -
          new Date(b.arrival_date).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-900">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Check Out",
        dataIndex: "departure_date",
        key: "departure_date",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.departure_date).getTime() -
          new Date(b.departure_date).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-900">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Rent $",
        key: "base_total_price",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.base_total_price || 0) -
          Number(b.pricing?.base_total_price || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.base_total_price || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Add. Guests $",
        key: "extra_guest_fee",
        width: 130,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.extra_guest_fee || 0) -
          Number(b.pricing?.extra_guest_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.extra_guest_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Pet Fee $",
        key: "pet_fee",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.pet_fee || 0) - Number(b.pricing?.pet_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.pet_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Cleaning Fee $",
        key: "cleaning_fee",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.cleaning_fee || 0) -
          Number(b.pricing?.cleaning_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.cleaning_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Platform Fee $",
        key: "platform_fee",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.platform_fee || 0) -
          Number(b.pricing?.platform_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.platform_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Total Before Tax",
        key: "total_before_tax",
        width: 160,
        sorter: (a: Booking, b: Booking) => {
          const totalA =
            Number(a.pricing?.total_price || 0) +
            Number(a.pricing?.cleaning_fee || 0) +
            Number(a.pricing?.platform_fee || 0);
          const totalB =
            Number(b.pricing?.total_price || 0) +
            Number(b.pricing?.cleaning_fee || 0) +
            Number(b.pricing?.platform_fee || 0);
          return totalA - totalB;
        },
        render: (_: any, record: Booking) => {
          const amount =
            Number(record.pricing?.total_price || 0) +
            Number(record.pricing?.cleaning_fee || 0) +
            Number(record.pricing?.platform_fee || 0);
          return (
            <span className="text-xs sm:text-sm font-semibold text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "City Fee $",
        key: "city_fee",
        width: 150,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.city_fee || 0) - Number(b.pricing?.city_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.city_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Taxes $",
        key: "lodging_tax",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.lodging_tax || 0) -
          Number(b.pricing?.lodging_tax || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.lodging_tax || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Total",
        key: "grand_total",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.grand_total || a.grand_total || 0) -
          Number(b.pricing?.grand_total || b.grand_total || 0),
        render: (_: any, record: Booking) => {
          const total = record.pricing?.grand_total || record.grand_total || 0;
          return (
            <span className="text-xs sm:text-sm font-bold text-green-600">
              ${Number(total).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 140,
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
          if (
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
    [isMobile]
  );

  // Host columns with detailed pricing breakdown
  const hostColumns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        sorter: (a: Booking, b: Booking) => a.id - b.id,
        render: (id: number) => (
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {id}
          </span>
        ),
      },
      {
        title: "Guest",
        key: "guest",
        width: 250,
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {record.guest?.display_name ||
                  `${record.guest?.first_name || ""} ${
                    record.guest?.last_name || ""
                  }`.trim() ||
                  "—"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {record.guest?.email || ""}
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Date Created",
        dataIndex: "created_at",
        key: "created_at",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-600">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Property",
        key: "stay_title",
        width: 250,
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
                  width={40}
                  height={40}
                  className="rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
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
      {
        title: "Check In",
        dataIndex: "arrival_date",
        key: "arrival_date",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.arrival_date).getTime() -
          new Date(b.arrival_date).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-900">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Check Out",
        dataIndex: "departure_date",
        key: "departure_date",
        width: 120,
        sorter: (a: Booking, b: Booking) =>
          new Date(a.departure_date).getTime() -
          new Date(b.departure_date).getTime(),
        render: (date: string) => (
          <span className="text-xs sm:text-sm text-gray-900">
            {dayjs(date).format("MMM D, YYYY")}
          </span>
        ),
      },
      {
        title: "Rent $",
        key: "base_total_price",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.base_total_price || 0) -
          Number(b.pricing?.base_total_price || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.base_total_price || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Add. Guests $",
        key: "extra_guest_fee",
        width: 130,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.extra_guest_fee || 0) -
          Number(b.pricing?.extra_guest_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.extra_guest_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Pet Fee $",
        key: "pet_fee",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.pet_fee || 0) - Number(b.pricing?.pet_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.pet_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Cleaning Fee $",
        key: "cleaning_fee",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.cleaning_fee || 0) -
          Number(b.pricing?.cleaning_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.cleaning_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Platform Fee $",
        key: "platform_fee",
        width: 140,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.platform_fee || 0) -
          Number(b.pricing?.platform_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.platform_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Total Before Tax",
        key: "total_before_tax",
        width: 160,
        sorter: (a: Booking, b: Booking) => {
          const totalA =
            Number(a.pricing?.total_price || 0) +
            Number(a.pricing?.cleaning_fee || 0) +
            Number(a.pricing?.platform_fee || 0);
          const totalB =
            Number(b.pricing?.total_price || 0) +
            Number(b.pricing?.cleaning_fee || 0) +
            Number(b.pricing?.platform_fee || 0);
          return totalA - totalB;
        },
        render: (_: any, record: Booking) => {
          const amount =
            Number(record.pricing?.total_price || 0) +
            Number(record.pricing?.cleaning_fee || 0) +
            Number(record.pricing?.platform_fee || 0);
          return (
            <span className="text-xs sm:text-sm font-semibold text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "City Fee $",
        key: "city_fee",
        width: 150,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.city_fee || 0) - Number(b.pricing?.city_fee || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.city_fee || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Taxes $",
        key: "lodging_tax",
        width: 100,
        sorter: (a: Booking, b: Booking) =>
          Number(a.pricing?.lodging_tax || 0) -
          Number(b.pricing?.lodging_tax || 0),
        render: (_: any, record: Booking) => {
          const amount = record.pricing?.lodging_tax || 0;
          return (
            <span className="text-xs sm:text-sm text-gray-900">
              ${Number(amount).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: amountLabel,
        key: "grand_total",
        width: 120,
        sorter: (a: Booking, b: Booking) => {
          // For host view (Earnings), exclude platform_fee and stripe_fee (3%)
          const grandTotalA = Number(
            a.pricing?.grand_total || a.grand_total || 0
          );
          const grandTotalB = Number(
            b.pricing?.grand_total || b.grand_total || 0
          );
          const platformFeeA = Number(a.pricing?.platform_fee || 0);
          const platformFeeB = Number(b.pricing?.platform_fee || 0);
          const stripeFeeA = grandTotalA * 0.03; // 3% processing fee
          const stripeFeeB = grandTotalB * 0.03; // 3% processing fee
          const earningsA = grandTotalA - platformFeeA - stripeFeeA;
          const earningsB = grandTotalB - platformFeeB - stripeFeeB;
          return earningsA - earningsB;
        },
        render: (_: any, record: Booking) => {
          // For host view (Earnings), exclude platform_fee and stripe_fee (3%)
          const grandTotal = Number(
            record.pricing?.grand_total || record.grand_total || 0
          );
          const platformFee = Number(record.pricing?.platform_fee || 0);
          const stripeFee = grandTotal * 0.03; // 3% processing fee
          const earnings = grandTotal - platformFee - stripeFee;
          return (
            <span className="text-xs sm:text-sm font-bold text-green-600">
              ${Number(earnings).toFixed(2)}
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

  // Select the appropriate columns based on view mode
  const columns =
    viewMode === "admin"
      ? adminColumns
      : viewMode === "guest"
      ? guestColumns
      : hostColumns;

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

            {/* Admin-specific filters - hidden for now, will be enabled later */}
            {/* TODO: Set showAdminFilters to true to enable admin filters */}
            {viewMode === "admin" && false && (
              <>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <SearchableSelect
                    value={paymentStatusFilter}
                    onValueChange={(value) => {
                      const stringValue = Array.isArray(value)
                        ? value[0]
                        : value;
                      setPaymentStatusFilter(stringValue);
                      setCurrentPage(1);
                    }}
                    options={paymentStatusFilterOptions}
                    placeholder="Payment status"
                    showSearch={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Input
                    placeholder="Guest ID"
                    prefix={<UserOutlined />}
                    value={guestIdFilter}
                    onChange={(e) => {
                      setGuestIdFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    allowClear
                    size={isMobile ? "middle" : "large"}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Input
                    placeholder="Host ID"
                    prefix={<UserOutlined />}
                    value={hostIdFilter}
                    onChange={(e) => {
                      setHostIdFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    allowClear
                    size={isMobile ? "middle" : "large"}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Input
                    placeholder="Stay ID"
                    prefix={<HomeOutlined />}
                    value={stayIdFilter}
                    onChange={(e) => {
                      setStayIdFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    allowClear
                    size={isMobile ? "middle" : "large"}
                  />
                </Col>
              </>
            )}

            {(searchTerm || statusFilter) && (
              <Col xs={24} sm={24} md={6} lg={4}>
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  size={isMobile ? "middle" : "large"}
                  className="w-full"
                >
                  Clear
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
            scroll={{
              x:
                viewMode === "admin" ||
                viewMode === "guest" ||
                viewMode === "host"
                  ? 2400
                  : isMobile
                  ? 800
                  : 1400,
            }}
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
