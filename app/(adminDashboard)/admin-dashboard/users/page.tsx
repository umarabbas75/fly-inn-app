"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Avatar,
  Space,
  Image,
  Badge,
  Tooltip,
  Descriptions,
  App,
} from "antd";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import type { TableColumnsType, TablePaginationConfig } from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  EyeOutlined,
  SafetyOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  MoreOutlined,
  EditOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { useApp } from "@/providers/AppMessageProvider";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { bffQuery, bffMutation } from "@/lib/bff-client";

const { Search } = Input;

const userTypeOptions: SearchableSelectOption[] = [
  { label: "All Users", value: "all" },
  { label: "Hosts", value: "host" }, // Users with at least 1 approved listing
  { label: "Business Owners", value: "business" }, // Users with at least 1 business
];

const activeStatusOptions: SearchableSelectOption[] = [
  { label: "Active Users", value: "true" },
  { label: "Deactivated Users", value: "false" },
];

interface UserType {
  id: number;
  email: string;
  roles: string[];
  first_name: string;
  last_name: string;
  middle_name: string | null;
  phone: string;
  other_phone: string | null;
  display_name: string;
  native_language: string;
  other_language: string | null;
  additional_email: string | null;
  bio: string | null;
  address: string;
  unit_no: number | null;
  city: string;
  state: string;
  zip_code: string;
  neighbourhood: string | null;
  country: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact_relationship: string;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  google_plus_url: string | null;
  instagram_url: string | null;
  pinterest_url: string | null;
  youtube_url: string | null;
  vimeo_url: string | null;
  airbnb_url: string | null;
  top_advisor_url: string | null;
  image: string | null;
  status: boolean;
  profile_status: string | null;
  driver_license_verified: boolean | null;
  arimen_license_verified: boolean | null;
  driver_license_rejected: boolean | null;
  arimen_license_rejected: boolean | null;
  driver_license_accept_reason: string | null;
  driver_license_reject_reason: string | null;
  arimen_license_accept_reason: string | null;
  arimen_license_reject_reason: string | null;
  air_men: string | null;
  air_men_back: string | null;
  driving_license: string | null;
  driving_license_back: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  payment_customer_id: string | null;
  is_subscribed_to_newsletter: boolean;
  profile_completeness: number;
  account_type: string | null;
  account_id: string | null;
  stays_count: number;
  is_host: boolean;
}

interface PaginationType {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page: number | null;
  prev_page: number | null;
}

const UsersManagementPage = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [userTypeFilter, setUserTypeFilter] = useState<string | undefined>(
    undefined
  );
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined
  );
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Modal states
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [documentType, setDocumentType] = useState<
    "driving_license" | "airmen"
  >("driving_license");
  const [reason, setReason] = useState("");
  const [toggleStatusModalVisible, setToggleStatusModalVisible] =
    useState(false);
  const [userToToggle, setUserToToggle] = useState<UserType | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  // Fetch users data with pagination via BFF
  const {
    data: usersResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "users",
      searchTerm,
      currentPage,
      pageSize,
      userTypeFilter,
      activeFilter,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("search", searchTerm);
      params.append("per_page", pageSize.toString());
      params.append("page", currentPage.toString());

      // User type filter
      if (userTypeFilter === "host") {
        params.append("is_host", "1");
      } else if (userTypeFilter === "business") {
        params.append("is_business_owner", "1");
      }
      // "all" or undefined means no filter

      if (activeFilter !== undefined) params.append("is_active", activeFilter);
      return bffQuery(`/api/admin/users/all?${params.toString()}`);
    },
    select: (res) => res?.data,
  });

  const users: UserType[] = usersResponse?.users || [];
  const pagination: PaginationType = usersResponse?.pagination || {
    current_page: 1,
    per_page: 50,
    total: 0,
    last_page: 1,
    next_page: null,
    prev_page: null,
  };

  // Mutation for email verification via BFF
  const { mutate: updateEmailVerification, isPending: isUpdatingEmail } =
    useMutation({
      mutationFn: ({
        userId,
        verified,
      }: {
        userId: number;
        verified: boolean;
      }) =>
        bffMutation(`/api/admin/users/${userId}/email-verification`, {
          method: "PATCH",
          body: { verified },
        }),
      onSuccess: (_, variables) => {
        message.success(
          variables.verified
            ? "Email verified successfully!"
            : "Email unverified successfully!"
        );
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (err: any) => {
        message.error(err?.message || "Failed to update email verification");
      },
    });

  // Mutation to toggle user status via BFF
  const { mutate: toggleUserStatus, isPending: isTogglingStatus } = useMutation(
    {
      mutationFn: ({
        userId,
        newStatus,
      }: {
        userId: number;
        newStatus: boolean;
      }) =>
        bffMutation(`/api/admin/users/${userId}/status`, {
          method: "PATCH",
          body: { status: newStatus }, // Don't stringify - bffMutation does it
        }),
      onSuccess: () => {
        message.success("User status updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        // Close modal after successful API response
        setToggleStatusModalVisible(false);
        setUserToToggle(null);
      },
      onError: (err: any) => {
        message.error(err?.message || "Failed to update user status");
        // Close modal even on error for better UX
        setToggleStatusModalVisible(false);
        setUserToToggle(null);
      },
    }
  );

  // Mutation to delete user via BFF
  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation({
    mutationFn: (userId: number) =>
      bffMutation(`/api/admin/users/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      message.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteModalVisible(false);
      setUserToDelete(null);
    },
    onError: (err: any) => {
      message.error(err?.message || "Failed to delete user");
      setDeleteModalVisible(false);
      setUserToDelete(null);
    },
  });

  // Single mutation for document verification/rejection via BFF
  const { mutate: updateDocumentStatus, isPending: updatingDocument } =
    useMutation({
      mutationFn: ({
        userId,
        payload,
      }: {
        userId: number;
        payload: {
          document_type: string;
          status: string;
          reason: string;
        };
      }) =>
        bffMutation(`/api/admin/users/${userId}/verify-document`, {
          method: "PATCH",
          body: payload, // Don't stringify - bffMutation does it
        }),
      onSuccess: (res: any) => {
        const status =
          res?.data?.user?.driver_license_verified ||
          res?.data?.user?.arimen_license_verified
            ? "verified"
            : "rejected";
        message.success(`Document ${status} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setVerifyModalVisible(false);
        setRejectModalVisible(false);
        setReason("");
        setSelectedUser(null);
      },
      onError: (err: any) => {
        message.error(err?.message || "Failed to update document status");
      },
    });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setCurrentPage(paginationConfig.current || 1);
    setPageSize(paginationConfig.pageSize || 50);
  };

  const handleUserTypeFilterChange = (value: string | undefined) => {
    setUserTypeFilter(value === "all" ? undefined : value);
    setCurrentPage(1);
  };

  const handleActiveFilterChange = (value: string | undefined) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  // Handle verify action
  const handleVerify = (docType: "driving_license" | "airmen") => {
    setDocumentType(docType);
    setReason(
      docType === "driving_license"
        ? "Documents are clear and valid. License is current and matches the user's information."
        : "Certificate is valid and matches the user's information."
    );
    setVerifyModalVisible(true);
  };

  // Handle reject action
  const handleReject = (docType: "driving_license" | "airmen") => {
    setDocumentType(docType);
    setReason(
      "Documents are not clear or do not match the user's information."
    );
    setRejectModalVisible(true);
  };

  // Confirm verification
  const confirmVerify = () => {
    if (!reason.trim()) {
      message.error("Please provide a reason");
      return;
    }

    if (!selectedUser?.id) {
      message.error("No user selected");
      return;
    }

    const payload = {
      document_type: documentType,
      status: "accepted",
      reason: reason.trim(),
    };

    updateDocumentStatus({
      userId: selectedUser.id,
      payload,
    });
  };

  // Confirm rejection
  const confirmReject = () => {
    if (!reason.trim()) {
      message.error("Please provide a reason");
      return;
    }

    if (!selectedUser?.id) {
      message.error("No user selected");
      return;
    }

    const payload = {
      document_type: documentType,
      status: "rejected",
      reason: reason.trim(),
    };

    updateDocumentStatus({
      userId: selectedUser.id,
      payload,
    });
  };

  // Expandable row render - Clean and simple
  const expandedRowRender = (record: UserType) => {
    const getImageUrl = (imagePath: string | null) => {
      if (!imagePath) return null;
      // If already a full URL (S3), return as-is
      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
      }
      // Otherwise, construct old format URL for backward compatibility
      return `${process.env.NEXT_PUBLIC_API_URI}/uploads/${imagePath}`;
    };

    const hasDriverLicense =
      record.driving_license || record.driving_license_back;
    const hasAirmenCertificate = record.air_men || record.air_men_back;
    const isEmailVerified = !!record.email_verified_at;

    return (
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Driver License Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IdcardOutlined className="text-white text-lg" />
                  <span className="text-white font-semibold">
                    Driver License
                  </span>
                </div>
                {record.driver_license_verified ? (
                  <Tag
                    color="#AF2322"
                    className="!bg-[#AF2322] !text-white !border-0"
                    icon={<CheckCircleOutlined />}
                  >
                    Verified
                  </Tag>
                ) : record.driver_license_rejected ? (
                  <Tag
                    color="default"
                    className="!bg-gray-600 !text-white !border-0"
                    icon={<CloseCircleOutlined />}
                  >
                    Rejected
                  </Tag>
                ) : (
                  <Tag className="!bg-gray-400 !text-white !border-0">
                    Pending
                  </Tag>
                )}
              </div>
            </div>
            <div className="p-4">
              {hasDriverLicense ? (
                <>
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-600 mb-2">
                      Documents
                    </div>
                    <Space size="middle">
                      {record.driving_license && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Front
                          </div>
                          <Image
                            src={getImageUrl(record.driving_license) || ""}
                            alt="License Front"
                            width={120}
                            height={80}
                            className="rounded border border-gray-300"
                          />
                        </div>
                      )}
                      {record.driving_license_back && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Back</div>
                          <Image
                            src={getImageUrl(record.driving_license_back) || ""}
                            alt="License Back"
                            width={120}
                            height={80}
                            className="rounded border border-gray-300"
                          />
                        </div>
                      )}
                    </Space>
                  </div>
                  {record.driver_license_accept_reason && (
                    <div className="mb-2">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Status
                      </div>
                      <div className="text-sm text-[#AF2322]">
                        ✓ {record.driver_license_accept_reason}
                      </div>
                    </div>
                  )}
                  {record.driver_license_reject_reason && (
                    <div className="mb-2">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Status
                      </div>
                      <div className="text-sm text-gray-600">
                        ✗ {record.driver_license_reject_reason}
                      </div>
                    </div>
                  )}
                  {!record.driver_license_verified &&
                    !record.driver_license_rejected && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="small"
                          type="primary"
                          className="!bg-[#AF2322] !border-[#AF2322] hover:!bg-[#8f1c1b]"
                          onClick={() => {
                            setSelectedUser(record);
                            handleVerify("driving_license");
                          }}
                        >
                          Verify
                        </Button>
                        <Button
                          size="small"
                          className="!bg-gray-600 !border-gray-600 !text-white hover:!bg-gray-700"
                          onClick={() => {
                            setSelectedUser(record);
                            handleReject("driving_license");
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No documents uploaded
                </div>
              )}
            </div>
          </div>
          {/* Airmen Certificate Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SafetyOutlined className="text-white text-lg" />
                  <span className="text-white font-semibold">
                    Airmen Certificate
                  </span>
                </div>
                {record.arimen_license_verified ? (
                  <Tag
                    color="#AF2322"
                    className="!bg-[#AF2322] !text-white !border-0"
                    icon={<CheckCircleOutlined />}
                  >
                    Verified
                  </Tag>
                ) : record.arimen_license_rejected ? (
                  <Tag
                    color="default"
                    className="!bg-gray-600 !text-white !border-0"
                    icon={<CloseCircleOutlined />}
                  >
                    Rejected
                  </Tag>
                ) : (
                  <Tag className="!bg-gray-400 !text-white !border-0">
                    Pending
                  </Tag>
                )}
              </div>
            </div>
            <div className="p-4">
              {hasAirmenCertificate ? (
                <>
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-600 mb-2">
                      Documents
                    </div>
                    <Space size="middle">
                      {record.air_men && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Front
                          </div>
                          <Image
                            src={getImageUrl(record.air_men) || ""}
                            alt="Certificate Front"
                            width={120}
                            height={80}
                            className="rounded border border-gray-300"
                          />
                        </div>
                      )}
                      {record.air_men_back && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Back</div>
                          <Image
                            src={getImageUrl(record.air_men_back) || ""}
                            alt="Certificate Back"
                            width={120}
                            height={80}
                            className="rounded border border-gray-300"
                          />
                        </div>
                      )}
                    </Space>
                  </div>
                  {record.arimen_license_accept_reason && (
                    <div className="mb-2">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Status
                      </div>
                      <div className="text-sm text-[#AF2322]">
                        ✓ {record.arimen_license_accept_reason}
                      </div>
                    </div>
                  )}
                  {record.arimen_license_reject_reason && (
                    <div className="mb-2">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Status
                      </div>
                      <div className="text-sm text-gray-600">
                        ✗ {record.arimen_license_reject_reason}
                      </div>
                    </div>
                  )}
                  {!record.arimen_license_verified &&
                    !record.arimen_license_rejected && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="small"
                          type="primary"
                          className="!bg-[#AF2322] !border-[#AF2322] hover:!bg-[#8f1c1b]"
                          onClick={() => {
                            setSelectedUser(record);
                            handleVerify("airmen");
                          }}
                        >
                          Verify
                        </Button>
                        <Button
                          size="small"
                          className="!bg-gray-600 !border-gray-600 !text-white hover:!bg-gray-700"
                          onClick={() => {
                            setSelectedUser(record);
                            handleReject("airmen");
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No documents uploaded
                </div>
              )}
            </div>
          </div>

          {/* Email Verification Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-white text-lg" />
                  <span className="text-white font-semibold">
                    Email Verification
                  </span>
                </div>
                {isEmailVerified ? (
                  <Tag
                    color="#AF2322"
                    className="!bg-[#AF2322] !text-white !border-0"
                    icon={<CheckCircleOutlined />}
                  >
                    Verified
                  </Tag>
                ) : (
                  <Tag className="!bg-gray-400 !text-white !border-0">
                    Not Verified
                  </Tag>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">
                  Email Address
                </div>
                <div className="text-sm text-gray-900 font-medium">
                  {record.email}
                </div>
              </div>
              {isEmailVerified && record.email_verified_at && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Verified At
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(record.email_verified_at).toLocaleString()}
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button
                  size="small"
                  type="primary"
                  className="!bg-[#AF2322] !border-[#AF2322] hover:!bg-[#8f1c1b]"
                  loading={isUpdatingEmail}
                  onClick={() => {
                    updateEmailVerification({
                      userId: record.id,
                      verified: !isEmailVerified,
                    });
                  }}
                >
                  {isEmailVerified ? "Unverify" : "Verify"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const columns: TableColumnsType<UserType> = [
    {
      title: "User",
      key: "user",
      width: 220,
      ellipsis: true,
      fixed: "left",
      render: (_, record) => (
        <div className="flex items-center gap-2 max-w-[280px]">
          <Avatar
            size={40}
            // src={
            //   record.image
            //     ? `${process.env.NEXT_PUBLIC_API_URI}/uploads/${record.image}`
            //     : undefined
            // }
            src={record.image}
            icon={!record.image && <UserOutlined />}
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="font-medium text-gray-900 text-sm truncate whitespace-nowrap overflow-hidden text-ellipsis">
              {record.first_name} {record.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate whitespace-nowrap overflow-hidden text-ellipsis">
              @{record.display_name}
            </p>
            <p className="text-xs text-gray-400 truncate whitespace-nowrap overflow-hidden text-ellipsis">
              {record.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Email",
      key: "email_verified",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div>
          {record.email_verified_at ? (
            <span className="text-xs text-green-600 flex items-center justify-center gap-1">
              <CheckCircleFilled /> Verified
            </span>
          ) : (
            <span className="text-xs text-red-600 whitespace-nowrap flex items-center justify-center gap-1">
              <CloseCircleFilled /> Not Verified
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Driver License",
      key: "driver_license_status",
      width: 160,
      align: "center",
      render: (_, record) => {
        if (!record.driving_license && !record.driving_license_back) {
          return (
            <div className="flex justify-center">
              <div className="px-3 py-1 text-white text-xs rounded-md bg-gray-400">
                Not Uploaded
              </div>
            </div>
          );
        }

        if (record.driver_license_verified) {
          return (
            <div className="flex justify-center">
              <div className="px-3 py-1 text-white text-xs rounded-md bg-green-500 flex items-center gap-1">
                <CheckCircleOutlined /> Verified
              </div>
            </div>
          );
        }

        if (record.driver_license_rejected) {
          return (
            <div className="flex justify-center">
              <div className="px-3 py-1 text-white text-xs rounded-md bg-red-500 flex items-center gap-1">
                <CloseCircleOutlined /> Rejected
              </div>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <div className="px-3 py-1 text-white text-xs rounded-md bg-orange-500">
              Pending
            </div>
          </div>
        );
      },
    },
    {
      title: "Airmen Certificate",
      key: "airmen_certificate_status",
      width: 180,
      align: "center",
      render: (_, record) => {
        if (!record.air_men && !record.air_men_back) {
          return (
            <div className="flex justify-center">
              <div className="px-3 py-1 text-white text-xs rounded-md bg-gray-400">
                Not Uploaded
              </div>
            </div>
          );
        }

        if (record.arimen_license_verified) {
          return (
            <div className="flex justify-center">
              <div className="px-3 py-1 text-white text-xs rounded-md bg-green-500 flex items-center gap-1">
                <CheckCircleOutlined /> Verified
              </div>
            </div>
          );
        }

        if (record.arimen_license_rejected) {
          return (
            <div className="flex justify-center">
              <div className="px-3 py-1 text-white text-xs rounded-md bg-red-500 flex items-center gap-1">
                <CloseCircleOutlined /> Rejected
              </div>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <div className="px-3 py-1 text-white text-xs rounded-md bg-orange-500">
              Pending
            </div>
          </div>
        );
      },
    },

    // {
    //   title: "Profile Status",
    //   key: "profile_status",
    //   width: 140,
    //   align: "center",
    //   render: (_, record) => {
    //     const completeness = record.profile_completeness;
    //     const status = record.profile_status;

    //     // Determine status color
    //     let statusColor = "default";
    //     if (status) {
    //       const statusColors: Record<string, string> = {
    //         pending: "warning",
    //         approved: "success",
    //         rejected: "error",
    //         incomplete: "default",
    //       };
    //       statusColor = statusColors[status.toLowerCase()] || "default";
    //     }

    //     return (
    //       <div className="flex flex-col items-center gap-1">
    //         <div className="text-sm font-medium text-gray-700">
    //           {completeness}%
    //         </div>
    //         {status ? (
    //           <Tag color={statusColor} className="capitalize m-0">
    //             {status}
    //           </Tag>
    //         ) : (
    //           <Tag color="default" className="m-0">
    //             Not Set
    //           </Tag>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Account Status",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center">
          <div
            className={`px-2 py-1 text-white text-xs rounded-md w-[85px] ${
              record.status ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {record.status ? "Active" : "Deactivated"}
          </div>
        </div>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const menuItemClassName =
          "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[rgba(175,35,34,0.08)] hover:text-[#AF2322] focus:bg-[rgba(175,35,34,0.08)] focus:text-[#AF2322] cursor-pointer";

        const menuItems = [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "View",
            onClick: () => {
              window.open(`/admin-dashboard/users/${record.id}`, "_blank");
            },
            color: "",
          },
          {
            key: "edit",
            icon: <EditOutlined />,
            label: "Edit",
            onClick: () => {
              router.push(`/admin-dashboard/users/edit/${record.id}`);
            },
            color: "",
          },
          {
            key: "toggle-status",
            icon: record.status ? (
              <CloseCircleOutlined />
            ) : (
              <CheckCircleOutlined />
            ),
            label: record.status ? "Deactivate" : "Activate",
            onClick: () => {
              setUserToToggle(record);
              setToggleStatusModalVisible(true);
            },
            color: record.status ? "text-red-500" : "text-green-600",
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            onClick: () => {
              setUserToDelete(record);
              setDeleteModalVisible(true);
            },
            color: "text-red-600",
          },
        ];

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="text"
                icon={<MoreOutlined />}
                size="middle"
                className="hover:bg-gray-100"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[200px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              sideOffset={8}
            >
              {menuItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  {index === 2 && <DropdownMenuSeparator className="my-1" />}
                  <DropdownMenuItem
                    className={`${menuItemClassName} ${item.color || ""}`}
                    onSelect={(e) => {
                      e.preventDefault();
                      item.onClick?.();
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Users Management
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Manage users, verify documents, and control access
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        {/* Desktop: Single row layout | Mobile: Stacked layout */}
        <div className="flex flex-col md:flex-row gap-4">
          <Search
            placeholder="Search by name, email, or display name..."
            allowClear
            enterButton="Search"
            size="large"
            onSearch={handleSearch}
            onChange={(e) => {
              if (!e.target.value) {
                handleSearch("");
              }
            }}
            className="flex-1"
            style={{ maxWidth: 600 }}
          />
          <div className="hidden md:block w-[180px]">
            <SearchableSelect
              placeholder="User Type"
              options={userTypeOptions}
              value={userTypeFilter || "all"}
              onValueChange={(val) => {
                handleUserTypeFilterChange(
                  typeof val === "string"
                    ? val
                    : Array.isArray(val)
                    ? val[0]
                    : undefined
                );
              }}
              showSearch={false}
            />
          </div>
          <div className="hidden md:block w-[180px]">
            <SearchableSelect
              placeholder="Account Status"
              options={activeStatusOptions}
              value={activeFilter}
              onValueChange={(val) => {
                handleActiveFilterChange(
                  typeof val === "string"
                    ? val
                    : Array.isArray(val)
                    ? val[0]
                    : undefined
                );
              }}
              showSearch={false}
            />
          </div>
          {(userTypeFilter || activeFilter || searchTerm) && (
            <Button
              onClick={() => {
                setUserTypeFilter(undefined);
                setActiveFilter(undefined);
                setSearchTerm("");
                setCurrentPage(1);
              }}
              size="large"
              className="hidden md:block"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Mobile only: Filter dropdowns */}
        <div className="flex flex-col gap-3 mt-3 md:hidden">
          <div className="w-full">
            <SearchableSelect
              placeholder="User Type"
              options={userTypeOptions}
              value={userTypeFilter || "all"}
              onValueChange={(val) => {
                handleUserTypeFilterChange(
                  typeof val === "string"
                    ? val
                    : Array.isArray(val)
                    ? val[0]
                    : undefined
                );
              }}
              showSearch={false}
            />
          </div>
          <div className="w-full">
            <SearchableSelect
              placeholder="Account Status"
              options={activeStatusOptions}
              value={activeFilter}
              onValueChange={(val) => {
                handleActiveFilterChange(
                  typeof val === "string"
                    ? val
                    : Array.isArray(val)
                    ? val[0]
                    : undefined
                );
              }}
              showSearch={false}
            />
          </div>
          {(userTypeFilter || activeFilter || searchTerm) && (
            <Button
              onClick={() => {
                setUserTypeFilter(undefined);
                setActiveFilter(undefined);
                setSearchTerm("");
                setCurrentPage(1);
              }}
              size="large"
              className="w-full"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <i className="fa fa-info-circle" aria-hidden="true"></i>
            Please scroll right and left to view more columns.
          </p>
        </div>
        <div
          className="overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <Table<UserType>
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={isLoading}
            tableLayout="fixed"
            expandable={{
              expandedRowRender,
              expandIcon: ({ expanded, onExpand, record }) => (
                <PlusIcon
                  className="text-gray-500 w-4 h-4 cursor-pointer"
                  onClick={(e: any) => onExpand(record, e)}
                />
              ),
            }}
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </div>

        {/* Custom Pagination with Native Select */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Total {pagination.total} users</span>
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
                {Math.ceil(pagination.total / pageSize) || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(Math.ceil(pagination.total / pageSize), prev + 1)
                  )
                }
                disabled={currentPage >= Math.ceil(pagination.total / pageSize)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next ›
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.ceil(pagination.total / pageSize))
                }
                disabled={currentPage >= Math.ceil(pagination.total / pageSize)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                »»
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Dialog */}
      <Dialog
        open={verifyModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setVerifyModalVisible(false);
            setReason("");
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              Verify{" "}
              {documentType === "driving_license"
                ? "Driver License"
                : "Airmen Certificate"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this document? Please provide a
              reason for verification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mb-4">
            <Input.TextArea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for verification..."
              maxLength={200}
              showCount
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setVerifyModalVisible(false);
                setReason("");
              }}
              disabled={updatingDocument}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={confirmVerify}
              loading={updatingDocument}
              className="text-sm"
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setRejectModalVisible(false);
            setReason("");
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              Reject{" "}
              {documentType === "driving_license"
                ? "Driver License"
                : "Airmen Certificate"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this document? Please provide a
              reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mb-4">
            <Input.TextArea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              maxLength={200}
              showCount
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setRejectModalVisible(false);
                setReason("");
              }}
              disabled={updatingDocument}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={confirmReject}
              loading={updatingDocument}
              className="text-sm"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Dialog */}
      <Dialog
        open={toggleStatusModalVisible}
        onOpenChange={(open) => {
          // Prevent closing modal while API call is in progress
          if (!open && !isTogglingStatus) {
            setToggleStatusModalVisible(false);
            setUserToToggle(null);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              {userToToggle?.status ? "Deactivate" : "Activate"} User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {userToToggle?.status ? "deactivate" : "activate"}{" "}
              {userToToggle?.first_name} {userToToggle?.last_name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setToggleStatusModalVisible(false);
                setUserToToggle(null);
              }}
              disabled={isTogglingStatus}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger={userToToggle?.status}
              loading={isTogglingStatus}
              onClick={() => {
                if (userToToggle) {
                  toggleUserStatus({
                    userId: userToToggle.id,
                    newStatus: !userToToggle.status,
                  });
                }
              }}
              className="text-sm"
            >
              {userToToggle?.status ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteModalVisible}
        onOpenChange={(open) => {
          if (!open && !isDeletingUser) {
            setDeleteModalVisible(false);
            setUserToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {userToDelete?.first_name} {userToDelete?.last_name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDeleteModalVisible(false);
                setUserToDelete(null);
              }}
              disabled={isDeletingUser}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              loading={isDeletingUser}
              onClick={() => {
                if (userToDelete) {
                  deleteUser(userToDelete.id);
                }
              }}
              className="text-sm"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagementPage;
