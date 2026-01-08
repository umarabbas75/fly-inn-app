"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { lodgingType } from "@/constants/stays";
import {
  Table,
  Button,
  Space,
  Image,
  Tag,
  message,
  Badge,
  Input,
  Row,
  Col,
} from "antd";
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
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  ClearOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import { FaPowerOff } from "react-icons/fa";
import FeaturedUpgradeModal from "./_components/FeaturedUpgradeModal";

// Status filter options matching getStatusConfig labels
const statusFilterOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Waiting for Approval" },
  { value: "approved", label: "Published" },
  { value: "deactivated", label: "Deactivated" },
  { value: "is_featured", label: "Featured" },
];

interface StayListing {
  id: number;
  host_id: number;
  listing_type: string;
  lodging_type: string;
  address: string;
  unit_no: string | null;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  area: string | null;
  latitude: string;
  longitude: string;
  fake_latitude?: string | null;
  fake_longitude?: string | null;
  type_of_space: string;
  title: string;
  no_of_guest: number;
  no_of_bedrooms: number;
  no_of_beds: number;
  no_of_bathrooms: string;
  no_of_rooms: number;
  size: number;
  unit_of_measure: string;
  description: string;
  instant_booking: number;
  nightly_price: string;
  tax_percentage: string;
  is_featured: number | boolean;
  created_at: string;
  updated_at: string;
  is_disable: number;
  status: string; // "draft", "pending", "approved", "rejected"
  closest_runway_distance: string;
  host: {
    id: number;
    display_name: string;
    image: string;
    email: string;
    country: string;
    languages: string[];
  };
  images: Array<{
    id: number;
    image: string;
    sort_order: number;
    description: string;
  }>;
}

interface StaysListingPageProps {
  editRoute?: string;
  addRoute?: string;
  settingsRoute?: string;
  isAdmin?: boolean;
}

const StaysListingPage = ({
  editRoute = "/dashboard/listings/stays/edit",
  addRoute = "/dashboard/listings/stays/stays-form",
  settingsRoute = "/dashboard/listings/stays/settings",
  isAdmin = false,
}: StaysListingPageProps = {}) => {
  const router = useRouter();
  const { message: appMessage } = useApp();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedStay, setSelectedStay] = useState<StayListing | null>(null);
  const [fakeCoordsModalVisible, setFakeCoordsModalVisible] = useState(false);
  const [stayNeedingFakeCoords, setStayNeedingFakeCoords] =
    useState<StayListing | null>(null);
  const [paymentMethodModalVisible, setPaymentMethodModalVisible] =
    useState(false);
  const [featuredUpgradeModalVisible, setFeaturedUpgradeModalVisible] =
    useState(false);
  const [stayToFeature, setStayToFeature] = useState<StayListing | null>(null);
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
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

    if (statusFilter && statusFilter !== "is_featured") {
      params.append("status", statusFilter);
    }

    // Handle featured filter separately
    if (statusFilter === "is_featured") {
      params.append("is_featured", "true");
    }

    return params.toString();
  };

  // Fetch current user data to check payment method
  const { data: userData } = useApiGet({
    endpoint: "/api/users/current-user",
    queryKey: ["current-user"],
  });

  // Fetch stays data via BFF with pagination, search, and status filter
  const {
    data: staysData,
    isLoading,
    refetch,
  } = useApiGet({
    endpoint: `/api/stays?${buildQueryParams()}`,
    queryKey: ["stays", currentPage, pageSize, searchTerm, statusFilter],
    // config: {
    //   select: (res) => res?.stays || [],
    // },
  });

  // Extract pagination from backend response
  // Handle both cases: pagination nested in response or at root level
  const paginationData = staysData?.pagination || {
    current_page: staysData?.current_page || 1,
    per_page: staysData?.per_page || 50,
    total: staysData?.total || 0,
    last_page: staysData?.last_page || 1,
    next_page_url: staysData?.next_page_url || null,
    prev_page_url: staysData?.prev_page_url || null,
  };

  // Extract stats from backend response
  const stats = staysData?.stats || {
    total: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    featured: 0,
    by_status: {},
  };

  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(undefined);
    setCurrentPage(1);
  };

  // Delete stay mutation via BFF
  const { mutate: deleteStay, isPending: deletingStay } = useApiMutation({
    endpoint: `/api/stays/${selectedStay?.id}`,
    method: "delete",
    config: {
      onSuccess: () => {
        appMessage.success("Stay deleted successfully!");
        setDeleteModalVisible(false);
        setSelectedStay(null);
        refetch();
      },
      onError: (err) => {
        appMessage.error(
          err?.response?.data?.message || "Failed to delete stay"
        );
      },
    },
  });

  // Update stay status mutation (approve/deactivate/draft/etc)
  const { mutate: updateStayStatus, isPending: updatingStatus } =
    useApiMutation({
      endpoint: `/api/stays/${selectedStay?.id}/approve`,
      method: "patch",
      config: {
        onSuccess: () => {
          appMessage.success("Stay status updated successfully!");
          refetch();
        },
        onError: (err) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to update stay status"
          );
        },
      },
    });

  const handleDelete = (stay: StayListing) => {
    setSelectedStay(stay);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedStay) {
      deleteStay(selectedStay.id);
    }
  };

  const handleUpdateStatus = (stay: StayListing, newStatus: string) => {
    setSelectedStay(stay);
    updateStayStatus({
      id: stay.id,
      status: newStatus,
    });
  };

  const getStatusConfig = (status: string) => {
    console.log({ status });
    // Handle null/undefined status
    if (!status) {
      return {
        text: "Unknown",
        bgColor: "bg-gray-400",
        textColor: "text-white",
      };
    }

    switch (status?.toLowerCase().trim()) {
      case "approved":
        return {
          text: "Published",
          bgColor: "bg-green-500",
          textColor: "text-white",
        };
      case "pending":
        return {
          text: "Waiting for Approval",
          bgColor: "bg-yellow-500",
          textColor: "text-white",
        };
      case "draft":
        return {
          text: "Draft",
          bgColor: "bg-gray-500",
          textColor: "text-white",
        };
      // case "rejected":
      //   return {
      //     text: "Rejected",
      //     bgColor: "bg-red-500",
      //     textColor: "text-white",
      //   };
      case "deactivated":
        return {
          text: "Deactivated",
          bgColor: "bg-red-500",
          textColor: "text-white",
        };
      default:
        return {
          text: status,
          bgColor: "bg-gray-400",
          textColor: "text-white",
        };
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "short-term rental":
        return "blue";
      case "long-term rental":
        return "green";
      case "vacation rental":
        return "purple";
      default:
        return "default";
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: isMobile ? 60 : 80,
        sorter: (a: StayListing, b: StayListing) => a.id - b.id,
        render: (id: number) => (
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            #{id}
          </span>
        ),
      },
      {
        title: "Image",
        dataIndex: "images",
        key: "image",
        width: isMobile ? 60 : 100,
        render: (images: any[], record: StayListing) => {
          // Sort images by sort_order and get the one with smallest order (0 or 1)
          const sortedImages =
            images && images.length > 0
              ? [...images].sort(
                  (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)
                )
              : [];
          const displayImage = sortedImages[0];

          return (
            <div className="flex flex-col items-center justify-center gap-1">
              {displayImage ? (
                <Image
                  src={displayImage.url}
                  alt="Stay"
                  width={isMobile ? 40 : 60}
                  height={isMobile ? 40 : 60}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div
                  className={`${
                    isMobile ? "w-10 h-10" : "w-15 h-15"
                  } bg-gray-200 rounded-lg flex items-center justify-center`}
                >
                  <span className="text-gray-400 text-[10px] sm:text-xs text-center">
                    No Image
                  </span>
                </div>
              )}
              {record.is_featured === true && (
                <div className="flex items-center gap-1">
                  <StarOutlined className="text-yellow-500 text-xs" />
                  <span className="text-[10px] text-yellow-600 font-medium">
                    Featured
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        width: isMobile ? 150 : 250,
        sorter: (a: StayListing, b: StayListing) =>
          (a.title || "").localeCompare(b.title || ""),
        render: (title: string) => (
          <span className="text-xs leading-[12px]  sm:text-sm font-medium text-gray-900 break-words">
            {title || "-"}
          </span>
        ),
      },
      // Host column - only show for admin and desktop
      ...(isAdmin
        ? [
            {
              title: "Host",
              key: "host",
              width: 200,
              render: (_: any, record: StayListing) => (
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {record.host?.display_name || "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {record.host?.email || "-"}
                  </div>
                </div>
              ),
            },
          ]
        : []),
      {
        title: "Stay Type",
        dataIndex: "listing_type",
        key: "listing_type",
        width: isMobile ? 100 : 140,
        render: (type: string) =>
          type ? (
            <Tag
              color={getListingTypeColor(type)}
              className="text-[10px] sm:text-xs"
            >
              {type}
            </Tag>
          ) : (
            <span className="text-xs sm:text-sm text-gray-400">-</span>
          ),
      },
      {
        title: "Lodging Type",
        dataIndex: "lodging_type",
        key: "lodging_type",
        width: 160,
        render: (lodging_type_value: string, record: any) => {
          const lodgingOption = lodgingType.find(
            (option) => option.value === lodging_type_value
          );
          const label = lodgingOption?.label || lodging_type_value || "-";

          // If it's a hotel room, show floor number as well
          if (lodging_type_value === "hotel_room" && record.floor_number) {
            return (
              <div className="text-sm text-gray-700">
                <div>{label}</div>
                <div className="text-xs text-gray-500">
                  Floor {record.floor_number}
                </div>
              </div>
            );
          }

          return <span className="text-sm text-gray-700">{label}</span>;
        },
      },

      {
        title: "Space Type",
        dataIndex: "type_of_space",
        key: "type_of_space",
        width: 130,
        render: (type_of_space: string) => (
          <span className="text-sm text-gray-700">{type_of_space || "-"}</span>
        ),
      },
      {
        title: "Price",
        dataIndex: "nightly_price",
        key: "nightly_price",
        width: isMobile ? 80 : 100,
        sorter: (a: StayListing, b: StayListing) =>
          parseFloat(a.nightly_price || "0") -
          parseFloat(b.nightly_price || "0"),
        render: (price: string) =>
          price ? (
            <span className="text-xs sm:text-sm font-semibold text-green-600">
              ${parseFloat(price).toFixed(2)}
            </span>
          ) : (
            <span className="text-xs sm:text-sm text-gray-400">-</span>
          ),
      },
      {
        title: "Bedrooms",
        dataIndex: "no_of_bedrooms",
        key: "no_of_bedrooms",
        width: isMobile ? 70 : 120,
        sorter: (a: StayListing, b: StayListing) =>
          (a.no_of_bedrooms || 0) - (b.no_of_bedrooms || 0),
        render: (bedrooms: number) => (
          <span className="text-xs sm:text-sm text-gray-700">
            {bedrooms != null ? bedrooms : "-"}
          </span>
        ),
      },
      {
        title: "Bathrooms",
        dataIndex: "no_of_bathrooms",
        key: "no_of_bathrooms",
        width: isMobile ? 70 : 120,
        sorter: (a: StayListing, b: StayListing) =>
          parseFloat(a.no_of_bathrooms || "0") -
          parseFloat(b.no_of_bathrooms || "0"),
        render: (bathrooms: string) =>
          bathrooms ? (
            <span className="text-xs sm:text-sm text-gray-700">
              {parseFloat(bathrooms).toFixed(1)}
            </span>
          ) : (
            <span className="text-xs sm:text-sm text-gray-400">-</span>
          ),
      },
      {
        title: "Guests",
        dataIndex: "no_of_guest",
        key: "no_of_guest",
        width: isMobile ? 60 : 80,
        sorter: (a: StayListing, b: StayListing) =>
          (a.no_of_guest || 0) - (b.no_of_guest || 0),
        render: (guests: number) => (
          <span className="text-xs sm:text-sm text-gray-700">
            {guests != null ? guests : "-"}
          </span>
        ),
      },

      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 200,
        sorter: (a: StayListing, b: StayListing) =>
          (a.status || "").localeCompare(b.status || ""),
        render: (status: string, record: StayListing) => {
          console.log(
            "Status for record",
            record.id,
            ":",
            status,
            typeof status
          );
          const statusConfig = getStatusConfig(status);
          return (
            <span
              className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}
            >
              {statusConfig.text}
            </span>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: isMobile ? 60 : 120,
        fixed: isMobile ? undefined : ("right" as const),
        render: (_: any, record: StayListing) => {
          const menuItems = [
            {
              key: "view",
              label: (
                <Space>
                  <EyeOutlined />
                  View Stay
                </Space>
              ),
              onClick: () =>
                window.open(`/public/stays/${record.id}`, "_blank"),
            },
            {
              key: "edit",
              label: (
                <Space>
                  <EditOutlined />
                  Edit Stay
                </Space>
              ),
              onClick: () => router.push(`${editRoute}/${record.id}`),
            },
            {
              key: "duplicate",
              label: (
                <Space>
                  <PlusOutlined />
                  Duplicate Stay
                </Space>
              ),
              onClick: () =>
                router.push(
                  `${editRoute.replace("/edit", "/duplicate")}/${record.id}`
                ),
            },
          ];

          // Add fake coordinates option (not for drafts)
          if (isAdmin && record.status?.toLowerCase() !== "draft") {
            menuItems.push({
              key: "fake-coordinates",
              label: (
                <Space>
                  <EnvironmentOutlined />
                  {record.fake_latitude && record.fake_longitude
                    ? "Update Fake Coordinates"
                    : "Set Fake Coordinates"}
                </Space>
              ),
              onClick: () => {
                window.open(
                  `${settingsRoute}/${record.id}?update=${
                    record.fake_latitude && record.fake_longitude ? "1" : "0"
                  }`,
                  "_blank"
                );
              },
            });
          }

          // Add approve option if status is pending
          if (isAdmin && record.status?.toLowerCase() === "pending") {
            menuItems.push({
              key: "approve",
              label: (
                <Space className="text-green-600">
                  <CheckCircleOutlined />
                  Approve
                </Space>
              ),
              onClick: () => {
                // Check if fake coordinates are set before approving
                if (!record.fake_latitude || !record.fake_longitude) {
                  setStayNeedingFakeCoords(record);
                  setFakeCoordsModalVisible(true);
                  return;
                }
                handleUpdateStatus(record, "approved");
              },
            });
          }

          // Add deactivate option if status is approved
          if (record.status?.toLowerCase() === "approved") {
            menuItems.push({
              key: "deactivate",
              label: (
                <Space className="text-orange-600">
                  <PoweroffOutlined />
                  Deactivate
                </Space>
              ),
              onClick: () => handleUpdateStatus(record, "deactivated"),
            });
          }

          // Add activate/reactivate option if status is deactivated
          if (isAdmin && record.status?.toLowerCase() === "deactivated") {
            menuItems.push({
              key: "activate",
              label: (
                <Space className="text-blue-600">
                  <FaPowerOff />
                  Reactivate
                </Space>
              ),
              onClick: () => handleUpdateStatus(record, "approved"),
            });
          }

          // Add upgrade to featured option if stay is approved and not already featured
          if (
            record.status?.toLowerCase() === "approved" &&
            record.is_featured !== 1
          ) {
            menuItems.push({
              key: "upgrade-featured",
              label: (
                <Space className="text-yellow-600">
                  <StarOutlined />
                  Upgrade to Featured
                </Space>
              ),
              onClick: () => {
                console.log({ record });
                // Determine which user's payment methods to fetch
                // If admin, fetch stay owner's payment methods; otherwise fetch current user's
                if (isAdmin) {
                  setTargetUserId(record.host?.id);
                } else {
                  // Get current user ID from session/userData
                  const currentUserId =
                    userData?.data?.id ||
                    userData?.data?.doc?.id ||
                    userData?.id ||
                    null;
                  setTargetUserId(currentUserId ? Number(currentUserId) : null);
                }
                // Set stay and open modal after targetUserId is set
                setStayToFeature(record);
                setFeaturedUpgradeModalVisible(true);
              },
            });
          }

          // Add delete option
          menuItems.push({
            key: "delete",
            label: (
              <Space className="text-red-500">
                <DeleteOutlined />
                Delete Stay
              </Space>
            ),
            onClick: () => handleDelete(record),
          });

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
                className="min-w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                sideOffset={8}
              >
                {menuItems.map((item) => {
                  // Extract icon and text from label (Space component)
                  const labelContent = item.label;
                  let icon: React.ReactNode = null;
                  let text: React.ReactNode = null;
                  let textColor = "";

                  if (React.isValidElement(labelContent)) {
                    // Check if it's a Space component and extract className for color
                    const props = labelContent.props as any;
                    if (props?.className) {
                      if (props.className.includes("green")) {
                        textColor = "text-green-600";
                      } else if (props.className.includes("orange")) {
                        textColor = "text-orange-600";
                      } else if (props.className.includes("blue")) {
                        textColor = "text-blue-600";
                      } else if (props.className.includes("red")) {
                        textColor = "text-red-500";
                      }
                    }
                    // Extract children from Space component
                    const children = React.Children.toArray(
                      props?.children || []
                    );
                    icon = children[0];
                    text = children[1];
                  }

                  return (
                    <DropdownMenuItem
                      key={item.key}
                      className={`${menuItemClassName} ${textColor || ""}`}
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
    [isMobile, isAdmin, router, editRoute, handleDelete, handleUpdateStatus]
  );

  console.log("my users and stays data", { userData, staysData });

  return (
    <div className=" bg-white p-3 md:p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8 space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Stays
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage your properties.
            </p>
          </div>
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size={isMobile ? "middle" : "large"}
              onClick={() => {
                // Check profile completeness and status for non-admin users
                if (!isAdmin) {
                  const profileCompleteness =
                    userData?.profile_completeness ?? 0;
                  const profileStatus = userData?.profile_status;
                  const hasPaymentMethod =
                    userData?.has_payment_method ??
                    userData?.data?.has_payment_method;

                  // Check profile completeness first
                  if (profileCompleteness < 100) {
                    setPaymentMethodModalVisible(true);
                    return;
                  }

                  // Then check profile status
                  if (profileStatus === "in-review") {
                    setPaymentMethodModalVisible(true);
                    return;
                  }

                  // Finally check payment method if profile is approved
                  if (
                    profileStatus === "verified" &&
                    hasPaymentMethod === false
                  ) {
                    setPaymentMethodModalVisible(true);
                    return;
                  }
                }
                router.push(addRoute);
              }}
              className="bg-[#AF2322] hover:bg-[#9e1f1a] shadow-sm w-full sm:w-auto"
            >
              <span className="text-xs sm:text-sm">Add Stay</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={10} lg={8}>
              <Input
                placeholder="Search stays, hosts..."
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
                options={statusFilterOptions}
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

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6} md={4}>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Total</div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-gray-800">
                  {stats.draft}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Draft</div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Pending</div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  {stats.approved}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Approved</div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-red-600">
                  {stats.rejected}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Rejected</div>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-yellow-500">
                  {stats.featured || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Featured</div>
              </div>
            </Col>
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
            dataSource={staysData?.stays || staysData?.data || []}
            rowKey="id"
            loading={isLoading}
            pagination={false}
            scroll={{ x: isMobile ? 800 : 1500 }}
            className="ant-table-stays"
            size={isMobile ? "small" : "middle"}
          />

          {/* Custom Pagination with Native Select */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Total {paginationData.total} stays</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#AF2322] focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ««
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹ Prev
                </button>

                <span className="px-3 py-1.5 text-sm text-gray-700">
                  Page {currentPage} of{" "}
                  {Math.ceil(paginationData.total / pageSize) || 1}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        Math.ceil(paginationData.total / pageSize),
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    currentPage >= Math.ceil(paginationData.total / pageSize)
                  }
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next ›
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.ceil(paginationData.total / pageSize))
                  }
                  disabled={
                    currentPage >= Math.ceil(paginationData.total / pageSize)
                  }
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  »»
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteModalVisible(false);
            setSelectedStay(null);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Delete Stay</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the stay "{selectedStay?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDeleteModalVisible(false);
                setSelectedStay(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={confirmDelete}
              loading={deletingStay}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Featured Upgrade Modal */}
      {targetUserId && (
        <FeaturedUpgradeModal
          open={featuredUpgradeModalVisible}
          onClose={() => {
            setFeaturedUpgradeModalVisible(false);
            setStayToFeature(null);
            setTargetUserId(null);
          }}
          stay={stayToFeature}
          targetUserId={targetUserId}
          isAdmin={isAdmin}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Fake Coordinates Modal */}
      <Dialog
        open={fakeCoordsModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setFakeCoordsModalVisible(false);
            setStayNeedingFakeCoords(null);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Fake coordinates not set</DialogTitle>
            <DialogDescription>
              You have not set the fake coordinates for this location. Please
              set the fake coordinates before approving this listing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setFakeCoordsModalVisible(false);
                setStayNeedingFakeCoords(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                if (stayNeedingFakeCoords) {
                  window.open(
                    `${settingsRoute}/${stayNeedingFakeCoords.id}?update=0`,
                    "_blank"
                  );
                }
                setFakeCoordsModalVisible(false);
                setStayNeedingFakeCoords(null);
              }}
            >
              Set Fake Coordinates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile/Payment Method Required Modal */}
      <Dialog
        open={paymentMethodModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setPaymentMethodModalVisible(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              {userData?.profile_completeness < 100
                ? "Profile Incomplete"
                : userData?.profile_status === "in-review"
                ? "Profile Under Review"
                : "Payment Method Required"}
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-3 mt-2">
                {userData?.profile_completeness < 100 ? (
                  <>
                    <p>
                      Your profile is not complete. You will not be able to host
                      or book until it is complete. Please complete your profile
                      to 100%. Once we have verified your identity, you will
                      receive a message, letting you know you are all set!
                    </p>
                    <p className="text-sm text-gray-600">
                      To complete your profile properly, watch the Registration
                      video on our{" "}
                      <a
                        href="https://www.youtube.com/@Fly-Inn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold hover:text-red-800 text-[#AF2322]"
                      >
                        YouTube Channel
                      </a>
                      .
                    </p>
                  </>
                ) : userData?.profile_status === "in-review" ? (
                  <>
                    <p>
                      Your profile is currently under review. Once we have
                      verified your identity, you will receive a message letting
                      you know you are all set!
                    </p>
                    <p className="text-sm text-gray-600">
                      This process typically takes 1-2 business days. Thank you
                      for your patience.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      A payment method is required to create a stay listing.
                      Please add a payment method in your settings before
                      creating a new stay.
                    </p>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {userData?.profile_completeness < 100 ? (
              <Button
                type="primary"
                onClick={() => {
                  router.push("/dashboard/profile");
                  setPaymentMethodModalVisible(false);
                }}
                className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm"
                size="middle"
              >
                Go to Profile
              </Button>
            ) : userData?.profile_status === "in-review" ? (
              <Button
                type="primary"
                onClick={() => {
                  setPaymentMethodModalVisible(false);
                }}
                className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm"
                size="middle"
              >
                OK
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setPaymentMethodModalVisible(false);
                  }}
                  size="middle"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    router.push("/dashboard/settings");
                    setPaymentMethodModalVisible(false);
                  }}
                  className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm"
                  size="middle"
                >
                  Go to Settings
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaysListingPage;
