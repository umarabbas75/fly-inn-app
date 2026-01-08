"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Modal, Tag, Skeleton, Empty } from "antd";
import type { TableColumnsType } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
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
import {
  useGetCancellationPolicies,
  useDeleteCancellationPolicy,
} from "./_hooks/useCancellationPolicy";

interface CancellationPolicy {
  id: number;
  group_name: string;
  type: string;
  before_check_in: string;
  after_check_in: string;
}

export default function CancellationPolicyPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [policyToDelete, setPolicyToDelete] =
    useState<CancellationPolicy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: policies = [], isPending } = useGetCancellationPolicies();

  console.log({ policies });
  const deleteMutation = useDeleteCancellationPolicy();
  const handleDelete = () => {
    if (policyToDelete) {
      deleteMutation.mutate(policyToDelete.id, {
        onSuccess: () => {
          setDeleteModalVisible(false);
          setPolicyToDelete(null);
          setDeleteId(null);
        },
      });
    }
  };

  const columns: TableColumnsType<CancellationPolicy> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "group_name",
      key: "group_name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 200,
      render: (type: string) => (
        <Tag color={type === "short" ? "blue" : "green"} className="capitalize">
          {type === "short" ? "Short term" : "Long term"}
        </Tag>
      ),
      filters: [
        { text: "Short term", value: "short" },
        { text: "Long term", value: "long" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Before Check In",
      dataIndex: "before_check_in",
      key: "before_check_in",
      render: (text: string) => (
        <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </span>
      ),
    },
    {
      title: "After Check In",
      dataIndex: "after_check_in",
      key: "after_check_in",
      render: (text: string) => (
        <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => {
        const menuItemClassName =
          "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[rgba(175,35,34,0.08)] hover:text-[#AF2322] focus:bg-[rgba(175,35,34,0.08)] focus:text-[#AF2322] cursor-pointer";

        const menuItems = [
          {
            key: "edit",
            icon: <EditOutlined />,
            label: "Edit",
            onClick: () => {
              router.push(
                `/admin-dashboard/cancellation-policy/edit/${record.id}`
              );
            },
            color: "",
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            onClick: () => {
              setPolicyToDelete(record);
              setDeleteModalVisible(true);
            },
            color: "text-red-500",
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
                  {index === 1 && <DropdownMenuSeparator className="my-1" />}
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

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton.Input active size="large" style={{ width: 300 }} />
          <Skeleton.Button active size="large" />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Cancellation Policies
            </h1>
            <p className="text-sm text-gray-600">
              Manage cancellation policies for your properties
            </p>
          </div>
          <div>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push("/admin-dashboard/cancellation-policy/add")
              }
              className="bg-[#AF2322] hover:bg-[#9e1f1a] shadow-sm"
            >
              New Policy
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table
            columns={columns}
            dataSource={policies.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  description="No cancellation policies found"
                  className="py-8"
                />
              ),
            }}
            scroll={{ x: 1200 }}
          />

          {/* Custom Pagination with Native Select */}
          {policies.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Total {policies.length} policies</span>
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
                    {Math.ceil(policies.length / pageSize) || 1}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(policies.length / pageSize),
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentPage >= Math.ceil(policies.length / pageSize)
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next ›
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.ceil(policies.length / pageSize))
                    }
                    disabled={
                      currentPage >= Math.ceil(policies.length / pageSize)
                    }
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    »»
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteModalVisible(false);
            setPolicyToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExclamationCircleOutlined className="text-red-500" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this cancellation policy? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDeleteModalVisible(false);
                setPolicyToDelete(null);
              }}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              className="text-sm"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
