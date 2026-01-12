"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Input, Tag } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { listingsStaticDataComplete } from "@/listing-static-data-complete";

const MigrateListingsPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  // Filter listings based on search
  const filteredListings = listingsStaticDataComplete.filter((listing: any) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      listing.title?.toLowerCase().includes(searchLower) ||
      listing.city?.toLowerCase().includes(searchLower) ||
      listing.state?.toLowerCase().includes(searchLower) ||
      listing.id?.toString().includes(searchText)
    );
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: 150,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: 100,
    },
    {
      title: "Type",
      dataIndex: "lodging_type",
      key: "lodging_type",
      width: 120,
    },
    {
      title: "Guests",
      dataIndex: "no_of_guest",
      key: "no_of_guest",
      width: 80,
      align: "center" as const,
    },
    {
      title: "Price",
      dataIndex: "nightly_price",
      key: "nightly_price",
      width: 100,
      render: (price: string) => (price ? `$${price}` : "-"),
    },
    {
      title: "Images",
      key: "images",
      width: 100,
      align: "center" as const,
      render: (_: any, record: any) => <Tag>{record.images?.length || 0}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() =>
            router.push(`/dashboard/listings/stays/migrate/${record.id}`)
          }
        >
          Migrate
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Migrate Old Listings</h1>
          <p className="text-gray-600">
            Select a listing to migrate. The form will be pre-populated with the
            old data for you to review and save.
          </p>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search by title, city, state, or ID..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>

        <div className="mb-4">
          <Tag color="blue">
            Total Listings: {listingsStaticDataComplete.length} | Showing:{" "}
            {filteredListings.length}
          </Tag>
        </div>

        <Table
          columns={columns}
          dataSource={filteredListings}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} listings`,
          }}
        />
      </div>
    </div>
  );
};

export default MigrateListingsPage;
