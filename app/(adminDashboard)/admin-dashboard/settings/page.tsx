"use client";

import React, { useState, useEffect } from "react";
import { Card, Tabs } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import UpdatePasswordSection from "@/app/(dashboard)/dashboard/settings/_components/UpdatePasswordSection";

const AdminSettingsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");

  // Map query parameter to tab key
  const getTabKeyFromType = (type: string | null) => {
    switch (type) {
      case "change_password":
        return "password";
      default:
        return "password";
    }
  };

  const [activeKey, setActiveKey] = useState(getTabKeyFromType(type));

  // Update active tab when URL changes
  useEffect(() => {
    setActiveKey(getTabKeyFromType(type));
  }, [type]);

  const tabItems = [
    {
      key: "password",
      label: (
        <span>
          <SafetyOutlined className="mr-2" />
          Change Password
        </span>
      ),
      children: <UpdatePasswordSection />,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    // Update URL when tab changes
    const typeMap: Record<string, string> = {
      password: "change_password",
    };
    router.push(`/admin-dashboard/settings?type=${typeMap[key]}`);
  };

  return (
    <div className="  ">
      <div className="">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your admin account settings and preferences
          </p>
        </div>

        <Card className="shadow-sm">
          <Tabs
            items={tabItems}
            activeKey={activeKey}
            onChange={handleTabChange}
            size="large"
            className="settings-tabs"
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
