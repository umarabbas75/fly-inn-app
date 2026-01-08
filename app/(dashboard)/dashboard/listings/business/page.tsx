"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Select,
  Space,
  Image,
  Tag,
  message,
  Input,
  Row,
  Col,
} from "antd";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  SettingOutlined,
  SearchOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import { formatBusinessType } from "@/constants/business";

const { Option } = Select;
const { Search } = Input;

interface BusinessListing {
  business_id: number;
  name: string;
  type: string;
  distance_from_runway: string;
  airport: string;
  state: string;
  country: string;
  url: string;
  package: string;
  isPaid: boolean;
  is_active?: boolean;
  address: string;
  city: string;
  zipcode: string;
  phone: string;
  operational_hrs: string;
  tag_line: string;
  business_details: string;
  logo_image?: string;
  business_logo?: string;
  images?: Array<{
    id: number;
    image: string;
    url: string;
    type: string;
  }>;
}

interface BusinessListingPageProps {
  editRoute?: string;
  addRoute?: string;
  isAdmin?: boolean;
}

const BusinessListingPage = ({
  editRoute = "/dashboard/listings/business/edit",
  addRoute = "/dashboard/listings/business/add",
  isAdmin = false,
}: BusinessListingPageProps = {}) => {
  const router = useRouter();
  const { message: appMessage } = useApp();
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    show: boolean;
    business: BusinessListing | null;
  }>({ show: false, business: null });
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessListing | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");

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
    params.append("limit", pageSize.toString());

    if (searchTerm.trim()) {
      params.append("search", searchTerm.trim());
    }

    return params.toString();
  };

  // Fetch businesses data via BFF with pagination and search
  // Using /business/me endpoint to get MY businesses
  const {
    data: businessesData,
    isLoading,
    refetch,
  } = useApiGet({
    endpoint: `/api/business/me?${buildQueryParams()}`,
    queryKey: ["businesses", currentPage, pageSize, searchTerm],
  });
  console.log({ businessesData });
  // Extract pagination from backend response
  // Backend returns: { data: [...], totalCount: number }
  const businesses = businessesData?.businesses || [];
  const totalCount = businessesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginationData = {
    current_page: currentPage,
    per_page: pageSize,
    total: totalCount,
    last_page: totalPages,
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Delete business mutation (hard delete) - for both admin and regular users
  const { mutate: deleteBusiness, isPending: deletingBusiness } =
    useApiMutation({
      endpoint: `/api/business/${deleteConfirmModal.business?.business_id}`,
      method: "delete",
      config: {
        onSuccess: () => {
          appMessage.success("Business deleted successfully!");
          setDeleteConfirmModal({ show: false, business: null });
          setSelectedBusiness(null);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to delete business"
          );
        },
      },
    });

  // Activate business mutation (admin only)
  const { mutate: activateBusiness, isPending: activatingBusiness } =
    useApiMutation({
      endpoint: `/api/business/${selectedBusiness?.business_id}/activate`,
      method: "patch",
      config: {
        onSuccess: () => {
          appMessage.success("Business activated successfully!");
          setSelectedBusiness(null);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to activate business"
          );
        },
      },
    });

  // Deactivate business mutation (admin only - soft delete)
  const { mutate: deactivateBusiness, isPending: deactivatingBusiness } =
    useApiMutation({
      endpoint: `/api/business/${selectedBusiness?.business_id}/deactivate`,
      method: "patch",
      config: {
        onSuccess: () => {
          appMessage.success("Business deactivated successfully!");
          setSelectedBusiness(null);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to deactivate business"
          );
        },
      },
    });

  const handleDelete = useCallback((business: BusinessListing) => {
    setDeleteConfirmModal({ show: true, business });
  }, []);

  const handleActivate = useCallback(
    (business: BusinessListing) => {
      setSelectedBusiness(business);
      activateBusiness(business.business_id);
    },
    [activateBusiness]
  );

  const handleDeactivate = useCallback(
    (business: BusinessListing) => {
      setSelectedBusiness(business);
      deactivateBusiness(business.business_id);
    },
    [deactivateBusiness]
  );

  const executeDelete = useCallback(() => {
    if (deleteConfirmModal.business) {
      deleteBusiness(deleteConfirmModal.business.business_id);
    }
  }, [deleteConfirmModal.business, deleteBusiness]);

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "business_id",
        key: "business_id",
        width: isMobile ? 60 : 80,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          a.business_id - b.business_id,
        render: (id: number) => (
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            #{id}
          </span>
        ),
      },
      {
        title: "Logo",
        dataIndex: "business_logo",
        key: "logo",
        width: isMobile ? 60 : 100,
        render: (logo: string, record: BusinessListing) => {
          // Use business_logo if available, otherwise use first image from images array
          const imageUrl =
            logo ||
            (record.images && record.images.length > 0
              ? record.images[0].url
              : null);

          return (
            <div className="flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={
                    imageUrl.startsWith("http")
                      ? imageUrl
                      : `https://s3.amazonaws.com/flyinn-app-bucket/${imageUrl}`
                  }
                  alt="Business Logo"
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
                    No Logo
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: isMobile ? 150 : 200,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          (a.name || "").localeCompare(b.name || ""),
        render: (name: string) => (
          <span className="text-xs leading-[12px] sm:text-sm font-medium text-gray-900 break-words">
            {name || "-"}
          </span>
        ),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: isMobile ? 120 : 180,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          (a.type || "").localeCompare(b.type || ""),
        render: (type: string) => (
          <Tag className="text-[10px] sm:text-xs bg-gray-100 text-gray-900 border-gray-300">
            {formatBusinessType(type)}
          </Tag>
        ),
      },
      {
        title: "Distance from Runway",
        dataIndex: "distance_from_runway",
        key: "distance_from_runway",
        width: 150,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          parseFloat(a.distance_from_runway || "0") -
          parseFloat(b.distance_from_runway || "0"),
        render: (distance: string) => (
          <span className="text-sm text-gray-700">
            {distance ? `${distance} miles` : "-"}
          </span>
        ),
      },
      {
        title: "Airport",
        dataIndex: "airport",
        key: "airport",
        width: isMobile ? 80 : 120,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          (a.airport || "").localeCompare(b.airport || ""),
        render: (airport: string) => (
          <span className="text-xs sm:text-sm text-gray-700">
            {airport || "-"}
          </span>
        ),
      },
      {
        title: "State",
        dataIndex: "state",
        key: "state",
        width: 120,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          (a.state || "").localeCompare(b.state || ""),
        render: (state: string) => (
          <span className="text-sm text-gray-700">{state || "-"}</span>
        ),
      },
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        width: 120,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          (a.country || "").localeCompare(b.country || ""),
        render: (country: string) => (
          <span className="text-sm text-gray-700">{country || "-"}</span>
        ),
      },
      {
        title: "Website",
        dataIndex: "url",
        key: "url",
        width: 200,
        render: (url: string) =>
          url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {url.length > 30 ? `${url.substring(0, 30)}...` : url}
            </a>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          ),
      },
      {
        title: "Subscription Plan",
        dataIndex: "package_name",
        key: "package_name",
        width: isMobile ? 200 : 250,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          (a.package || "").localeCompare(b.package || ""),
        render: (pkg: string) => (
          <Tag className="text-[10px] sm:text-xs bg-gray-100 text-gray-900 border-gray-300">
            {pkg || "-"}
          </Tag>
        ),
      },
      {
        title: "Subscription Status",
        dataIndex: "isPaid",
        key: "isPaid",
        width: isMobile ? 90 : 120,
        sorter: (a: BusinessListing, b: BusinessListing) =>
          (a.isPaid ? 1 : 0) - (b.isPaid ? 1 : 0),
        render: (isPaid: boolean) => {
          return (
            <span
              className={`text-xs sm:text-sm font-medium ${
                isPaid ? "text-[#AF2322]" : "text-gray-600"
              }`}
            >
              {isPaid ? "Paid" : "Unpaid"}
            </span>
          );
        },
      },
      // Status column - only show for admin
      ...(isAdmin
        ? [
            {
              title: "Status",
              dataIndex: "is_active",
              key: "is_active",
              width: isMobile ? 90 : 120,
              sorter: (a: BusinessListing, b: BusinessListing) =>
                (a.is_active === false ? 1 : 0) -
                (b.is_active === false ? 1 : 0),
              render: (isActive: boolean) => {
                const isActiveValue = isActive !== false;
                return (
                  <span
                    className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                      isActiveValue
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {isActiveValue ? "Active" : "Deactivated"}
                  </span>
                );
              },
            },
          ]
        : []),
      {
        title: "Actions",
        key: "actions",
        width: isMobile ? 60 : 120,
        fixed: isMobile ? undefined : ("right" as const),
        render: (_: any, record: BusinessListing) => {
          // Admin only sees Edit option
          const adminMenuItems = [
            {
              key: "view",
              label: (
                <Space>
                  <EyeOutlined />
                  View Business
                </Space>
              ),
              onClick: () =>
                window.open(
                  `/public/business/${record.type}/${record.business_id}`,
                  "_blank",
                  "noopener,noreferrer"
                ),
            },
            {
              key: "edit",
              label: (
                <Space>
                  <EditOutlined />
                  Edit Business
                </Space>
              ),
              onClick: () => {
                // Use admin edit route for admin users
                const adminEditRoute = "/admin-dashboard/business/edit";
                router.push(
                  `${isAdmin ? adminEditRoute : editRoute}/${
                    record.business_id
                  }`
                );
              },
            },
          ];

          // Regular users see all options
          const userMenuItems = [
            {
              key: "view",
              label: (
                <Space>
                  <EyeOutlined />
                  View Business
                </Space>
              ),
              onClick: () =>
                window.open(
                  `/public/business/${record.type}/${record.business_id}`,
                  "_blank",
                  "noopener,noreferrer"
                ),
            },
            {
              key: "edit",
              label: (
                <Space>
                  <EditOutlined />
                  Edit Business
                </Space>
              ),
              onClick: () => router.push(`${editRoute}/${record.business_id}`),
            },
            {
              key: "update-plan",
              label: (
                <Space>
                  <SettingOutlined />
                  Update Payment Plan
                </Space>
              ),
              onClick: () =>
                router.push(
                  `${editRoute}/${record.business_id}?update-plan=true`
                ),
            },
            {
              key: "delete",
              label: (
                <Space className="text-red-500">
                  <DeleteOutlined />
                  Delete Business
                </Space>
              ),
              onClick: () => handleDelete(record),
            },
          ];

          // Add activate/deactivate options for admin
          if (isAdmin) {
            // Add deactivate option if business is active
            // if (record.is_active !== false) {
            //   adminMenuItems.push({
            //     key: "deactivate",
            //     label: (
            //       <Space className="text-orange-600">
            //         <PoweroffOutlined />
            //         Deactivate
            //       </Space>
            //     ),
            //     onClick: () => handleDeactivate(record),
            //   });
            // }

            // Add activate option if business is deactivated
            // if (record.is_active === false) {
            //   adminMenuItems.push({
            //     key: "activate",
            //     label: (
            //       <Space className="text-green-600">
            //         <CheckCircleOutlined />
            //         Activate
            //       </Space>
            //     ),
            //     onClick: () => handleActivate(record),
            //   });
            // }

            // Add delete option for admin
            adminMenuItems.push({
              key: "delete",
              label: (
                <Space className="text-red-500">
                  <DeleteOutlined />
                  Delete Business
                </Space>
              ),
              onClick: () => handleDelete(record),
            });
          }

          const menuItems = isAdmin ? adminMenuItems : userMenuItems;

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
                      if (props.className.includes("red")) {
                        textColor = "text-red-500";
                      } else if (props.className.includes("orange")) {
                        textColor = "text-orange-600";
                      } else if (props.className.includes("green")) {
                        textColor = "text-green-600";
                      } else if (props.className.includes("gray")) {
                        textColor = "text-gray-600";
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
    [
      isMobile,
      router,
      editRoute,
      isAdmin,
      handleDelete,
      handleActivate,
      handleDeactivate,
    ]
  );

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Businesses
          </h1>
          <p className="text-sm text-gray-500">Manage your business listings</p>
        </div>
        {!isAdmin && (
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => router.push(addRoute)}
              className="bg-[#AF2322] hover:bg-[#9e1f1a] shadow-sm"
            >
              Add Business
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search businesses..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              allowClear
              size={isMobile ? "middle" : "large"}
            />
          </Col>
        </Row>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6} md={4}>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-[#AF2322]">
                {paginationData.total || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Total</div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-[#AF2322]">
                {businesses.filter((b: BusinessListing) => b.isPaid)?.length ||
                  0}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Paid</div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-gray-600">
                {businesses.filter((b: BusinessListing) => !b.isPaid)?.length ||
                  0}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">Unpaid</div>
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
          dataSource={businesses}
          rowKey="business_id"
          loading={isLoading}
          pagination={false}
          scroll={{ x: isMobile ? 800 : 1500 }}
          className="ant-table-businesses"
          size={isMobile ? "small" : "middle"}
        />

        {/* Custom Pagination with Native Select */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Total {paginationData.total} businesses</span>
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmModal.show}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmModal({ show: false, business: null });
          }
        }}
      >
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <p className="text-gray-700">
                  You're about to permanently delete:
                </p>
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <h4 className="font-bold text-lg text-gray-900 mb-1">
                    {deleteConfirmModal.business?.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    ID: {deleteConfirmModal.business?.business_id}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-yellow-700 text-sm">
                      This action will delete your business and any active
                      subscription associated with it. Your payment method will
                      not be billed again. Any subscription fees already paid
                      will not be refunded.
                    </p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 sm:justify-end">
            <Button
              onClick={() =>
                setDeleteConfirmModal({ show: false, business: null })
              }
              disabled={deletingBusiness}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={executeDelete}
              loading={deletingBusiness}
              disabled={deletingBusiness}
              className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessListingPage;
