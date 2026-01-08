import React, { useState } from "react";
import { Button, Form, Input, message, Card } from "antd";
import { FaCreditCard, FaLock } from "react-icons/fa";

interface StripeCardFormProps {
  onSuccess: (paymentMethod: any) => void;
  onCancel: () => void;
}

const StripeCardForm: React.FC<StripeCardFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Here you would integrate with Stripe to create a payment method
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockPaymentMethod = {
        id: `pm_${Math.random().toString(36).substr(2, 9)}`,
        brand: values.cardNumber.startsWith("4") ? "Visa" : "Mastercard",
        last4: values.cardNumber.slice(-4),
        exp_month: values.expiryMonth,
        exp_year: values.expiryYear,
      };

      message.success("Payment method added successfully!");
      onSuccess(mockPaymentMethod);
    } catch (error) {
      message.error("Failed to add payment method. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="text-center mb-6">
        <FaCreditCard className="text-3xl text-blue-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">
          Add Payment Method
        </h3>
        <p className="text-sm text-gray-600">
          Enter your card details securely
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Form.Item
          name="cardNumber"
          label="Card Number"
          rules={[
            { required: true, message: "Please enter card number" },
            {
              pattern: /^\d{16}$/,
              message: "Please enter a valid 16-digit card number",
            },
          ]}
        >
          <Input
            placeholder="1234 5678 9012 3456"
            maxLength={16}
            className="h-12 text-lg"
            prefix={<FaCreditCard className="text-gray-400" />}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="expiryMonth"
            label="Expiry Month"
            rules={[
              { required: true, message: "Required" },
              { pattern: /^(0[1-9]|1[0-2])$/, message: "Invalid month" },
            ]}
          >
            <Input
              placeholder="MM"
              maxLength={2}
              className="h-12 text-center text-lg"
            />
          </Form.Item>

          <Form.Item
            name="expiryYear"
            label="Expiry Year"
            rules={[
              { required: true, message: "Required" },
              {
                pattern: /^(20[2-9][0-9]|20[3-9][0-9])$/,
                message: "Invalid year",
              },
            ]}
          >
            <Input
              placeholder="YYYY"
              maxLength={4}
              className="h-12 text-center text-lg"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="cvv"
          label="CVV"
          rules={[
            { required: true, message: "Please enter CVV" },
            { pattern: /^\d{3,4}$/, message: "Please enter a valid CVV" },
          ]}
        >
          <Input
            placeholder="123"
            maxLength={4}
            className="h-12 text-lg"
            prefix={<FaLock className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item
          name="cardholderName"
          label="Cardholder Name"
          rules={[{ required: true, message: "Please enter cardholder name" }]}
        >
          <Input placeholder="John Doe" className="h-12 text-lg" />
        </Form.Item>

        <div className="flex space-x-3 pt-4">
          <Button
            onClick={onCancel}
            className="flex-1 h-12"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="flex-1 h-12"
            loading={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Card"}
          </Button>
        </div>
      </Form>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>Secure payment powered by</span>
          <div className="flex space-x-2">
            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
              S
            </div>
            <span className="text-blue-600 font-semibold">Stripe</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StripeCardForm;
