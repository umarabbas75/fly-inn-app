"use client";

import React from "react";
import { Card, Button, Tag, Space, Tooltip } from "antd";
import {
  CreditCardOutlined,
  CheckCircleOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  is_default?: boolean;
  created_at?: string;
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: () => void;
  onDelete: () => void;
  isSettingDefault?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onSetDefault,
  onDelete,
  isSettingDefault,
}) => {
  const { card, is_default } = paymentMethod;

  if (!card) return null;

  const getCardBrandIcon = (brand: string) => {
    const normalizedBrand = brand.toLowerCase();
    if (normalizedBrand.includes("visa")) return "💳";
    if (normalizedBrand.includes("mastercard")) return "💳";
    if (normalizedBrand.includes("amex")) return "💳";
    if (normalizedBrand.includes("discover")) return "💳";
    return "💳";
  };

  const formatExpiry = (month: number, year: number) => {
    const formattedMonth = String(month).padStart(2, "0");
    const shortYear = String(year).slice(-2);
    return `${formattedMonth}/${shortYear}`;
  };

  const isExpired = () => {
    if (!card.exp_month || !card.exp_year) return false;
    const now = new Date();
    const expiryDate = new Date(card.exp_year, card.exp_month - 1);
    return expiryDate < now;
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        is_default ? "border-primary border-2" : "border-gray-200"
      }`}
      bodyStyle={{ padding: "16px" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Card Icon */}
          <div className="text-4xl">{getCardBrandIcon(card.brand)}</div>

          {/* Card Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-lg capitalize">
                {card.brand}
              </span>
              {is_default && (
                <Tag
                  color="#AF2322"
                  icon={<CheckCircleOutlined />}
                  className="m-0"
                >
                  Default
                </Tag>
              )}
              {isExpired() && (
                <Tag color="red" className="m-0">
                  Expired
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="font-mono text-base">
                •••• •••• •••• {card.last4}
              </span>
              <span className="text-sm">
                Expires {formatExpiry(card.exp_month, card.exp_year)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <Space>
          {!is_default && (
            <Tooltip title="Set as default payment method">
              <Button
                type="text"
                icon={<StarOutlined />}
                onClick={onSetDefault}
                loading={isSettingDefault}
                className="text-gray-600 hover:text-primary"
              >
                Set Default
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Delete payment method">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={onDelete}
              className="hover:bg-red-50"
            />
          </Tooltip>
        </Space>
      </div>
    </Card>
  );
};

export default PaymentMethodCard;
