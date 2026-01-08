"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Tag, Skeleton, Empty } from "antd";
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
import { toast } from "sonner";
import { useApiGet } from "@/http-service";

interface SubFeature {
  id: number;
  name: string;
  feature_id: number;
}

interface Feature {
  id: number;
  heading: string;
  sub_heading: SubFeature[];
}

export default function FeaturesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get all features
  const { data: features = [], isPending } = useApiGet({
    endpoint: "/api/admin/features",
    queryKey: ["features"],
  });

  // Delete feature mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { default: axiosAuth } = await import("@/utils/axiosAuth");
      const response = await axiosAuth.delete(`/api/admin/features/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Feature deleted successfully!");
      setDeleteModalVisible(false);
      setFeatureToDelete(null);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete feature");
    },
  });

  const columns: TableColumnsType<Feature> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Category",
      dataIndex: "heading",
      key: "heading",
      sorter: (a, b) => a.heading.localeCompare(b.heading),
    },
    {
      title: "Subcategories",
      dataIndex: "sub_heading",
      key: "sub_heading",
      render: (subHeading: SubFeature[]) => (
        <div className="flex flex-wrap gap-2">
          {subHeading && subHeading.length > 0 ? (
            subHeading.map((item) => (
              <Tag key={item.id} color="blue">
                {item.name}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">No subcategories</span>
          )}
        </div>
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
              router.push(`/admin-dashboard/features/edit/${record.id}`);
            },
            color: "",
          },
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Delete",
            onClick: () => {
              setFeatureToDelete(record);
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
              Features
            </h1>
            <p className="text-sm text-gray-600">
              Manage features and subcategories for properties
            </p>
          </div>
          <div>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => router.push("/admin-dashboard/features/add")}
              className="bg-[#AF2322] hover:bg-[#9e1f1a] shadow-sm"
            >
              New Feature
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table
            columns={columns}
            dataSource={features.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <Empty description="No features found" className="py-8" />
              ),
            }}
          />

          {/* Custom Pagination with Native Select */}
          {features.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Total {features.length} features</span>
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
                    {Math.ceil(features.length / pageSize) || 1}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(features.length / pageSize),
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentPage >= Math.ceil(features.length / pageSize)
                    }
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next ›
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.ceil(features.length / pageSize))
                    }
                    disabled={
                      currentPage >= Math.ceil(features.length / pageSize)
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
            setFeatureToDelete(null);
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
              Are you sure you want to delete this feature? All subcategories
              will also be deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDeleteModalVisible(false);
                setFeatureToDelete(null);
              }}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                if (featureToDelete) {
                  deleteMutation.mutate(featureToDelete.id);
                }
              }}
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
