"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { Card, Tabs, Skeleton } from "antd";
import {
  CreditCardOutlined,
  SafetyOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentMethodsSection from "./_components/PaymentMethodsSection";
import UpdatePasswordSection from "./_components/UpdatePasswordSection";
import PayoutSetupCard from "../payouts/_components/PayoutSetupCard";
import { useApiGet } from "@/http-service";

/**
 * Settings Page Content - separated for Suspense boundary
 */
const SettingsPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");

  // Fetch user's stays to determine if they're a host
  const { data: staysData, isLoading: staysLoading } = useApiGet({
    endpoint: "/api/stays?per_page=1",
    queryKey: ["user-stays-check"],
  });

  // User is a host if they have at least one stay
  const isHost = useMemo(() => {
    const stays = staysData?.stays || staysData?.data || [];
    const total =
      staysData?.pagination?.total || staysData?.total || stays.length;
    return total > 0;
  }, [staysData]);

  // Map query parameter to tab key
  const getTabKeyFromType = (type: string | null) => {
    switch (type) {
      case "payment_method":
        return "payment-methods";
      case "update_password":
        return "password";
      case "payouts":
        return "payouts";
      default:
        return "payment-methods";
    }
  };

  const [activeKey, setActiveKey] = useState(getTabKeyFromType(type));

  // Update active tab when URL changes
  useEffect(() => {
    setActiveKey(getTabKeyFromType(type));
  }, [type]);

  // Build tab items - conditionally include Payouts tab for hosts
  const tabItems = useMemo(() => {
    const items = [
      {
        key: "payment-methods",
        label: (
          <span>
            <CreditCardOutlined className="mr-2" />
            Payment Methods
          </span>
        ),
        children: <PaymentMethodsSection />,
      },
      {
        key: "password",
        label: (
          <span>
            <SafetyOutlined className="mr-2" />
            Update Password
          </span>
        ),
        children: <UpdatePasswordSection />,
      },
    ];

    // Add Payouts tab only for hosts
    if (isHost) {
      items.push({
        key: "payouts",
        label: (
          <span>
            <BankOutlined className="mr-2" />
            Payouts
          </span>
        ),
        children: (
          <div className="py-4">
            <PayoutSetupCard />
          </div>
        ),
      });
    }

    return items;
  }, [isHost]);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    // Update URL when tab changes
    const typeMap: Record<string, string> = {
      "payment-methods": "payment_method",
      password: "update_password",
      payouts: "payouts",
    };
    router.push(`/dashboard/settings?type=${typeMap[key]}`);
  };

  // If still loading stays data, show loading state
  if (staysLoading) {
    return (
      <div className="">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <Card className="shadow-sm">
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
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
  );
};

/**
 * Settings Page
 * Contains tabs for:
 * - Payment Methods (for making payments as a guest)
 * - Update Password
 * - Payouts (only for hosts - Stripe Connect setup)
 */
const SettingsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          <Card className="shadow-sm">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
};

export default SettingsPage;
