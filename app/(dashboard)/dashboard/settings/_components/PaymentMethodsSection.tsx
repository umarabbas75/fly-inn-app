"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Empty, Spin, message, Tag, Space } from "antd";
import Modal from "react-modal";
import {
  CreditCardOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useApiGet, useApiMutation } from "@/http-service";
import PaymentMethodCard from "./PaymentMethodCard";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

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

const PaymentMethodsSection: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  // Set app element for react-modal (required for accessibility)
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  // Fetch payment methods
  const {
    data: paymentMethodsData,
    isLoading,
    refetch,
  } = useApiGet({
    endpoint: "/api/payments/methods",
    queryKey: ["payment-methods"],
    config: {
      select: (res) => res?.data || res?.payment_methods || [],
    },
  });

  const paymentMethods: PaymentMethod[] = paymentMethodsData || [];

  // Delete mutation
  const { mutate: deletePaymentMethod, isPending: isDeleting } = useApiMutation(
    {
      endpoint: `/api/payments/methods/${selectedPaymentMethod?.id}`,
      method: "delete",
      config: {
        onSuccess: () => {
          message.success("Payment method deleted successfully");
          setIsDeleteModalOpen(false);
          setSelectedPaymentMethod(null);
          refetch();
        },
        onError: (err) => {
          message.error(
            err?.response?.data?.message || "Failed to delete payment method"
          );
        },
      },
    }
  );

  // Set default mutation
  const { mutate: setDefaultPaymentMethod, isPending: isSettingDefault } =
    useApiMutation({
      endpoint: `/api/payments/methods/${selectedPaymentMethod?.id}`,
      method: "patch",
      config: {
        onSuccess: () => {
          message.success("Default payment method updated");
          setSelectedPaymentMethod(null);
          refetch();
        },
        onError: (err) => {
          message.error(
            err?.response?.data?.message ||
              "Failed to update default payment method"
          );
        },
      },
    });

  const handleDelete = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPaymentMethod) {
      deletePaymentMethod({});
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedPaymentMethod(null);
  };

  const handleSetDefault = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.is_default) return;
    setSelectedPaymentMethod(paymentMethod);
    setDefaultPaymentMethod({ is_default: true });
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refetch();
  };

  return (
    <Card
      className="shadow-sm"
      title={
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCardOutlined className="text-lg text-[#AF2322]" />
            <span className="text-lg font-semibold text-gray-900">
              Payment Methods
            </span>
          </div>
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#AF2322] hover:bg-[#9e1f1a] shadow-sm"
            >
              Add Payment Method
            </Button>
          </div>
        </div>
      }
    >
      {/* Security Notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <LockOutlined className="text-blue-600 text-lg mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Secure Payment Storage
            </p>
            <p className="text-xs text-blue-700">
              Your payment information is securely stored and encrypted. We
              never store your full card number or CVV.
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : paymentMethods.length === 0 ? (
        <Empty
          description="No payment methods added yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Your First Payment Method
          </Button>
        </Empty>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((paymentMethod) => (
            <PaymentMethodCard
              key={paymentMethod.id}
              paymentMethod={paymentMethod}
              onSetDefault={() => handleSetDefault(paymentMethod)}
              onDelete={() => handleDelete(paymentMethod)}
              isSettingDefault={
                isSettingDefault &&
                selectedPaymentMethod?.id === paymentMethod.id
              }
            />
          ))}
        </div>
      )}

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen && !!selectedPaymentMethod}
        onRequestClose={handleCancelDelete}
        contentLabel="Delete Payment Method"
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        shouldCloseOnOverlayClick={!isDeleting}
        shouldCloseOnEsc={!isDeleting}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Delete Payment Method
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this payment method? This action
            cannot be undone.
          </p>
          {selectedPaymentMethod?.card && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Card to be deleted:</p>
              <p className="text-base font-medium text-gray-900">
                {selectedPaymentMethod.card.brand.toUpperCase()} ••••
                {selectedPaymentMethod.card.last4}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={confirmDelete}
              loading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default PaymentMethodsSection;
