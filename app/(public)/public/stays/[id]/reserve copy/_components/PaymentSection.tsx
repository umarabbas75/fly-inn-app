import React, { useState, useEffect } from "react";
import { Card, Button, Radio, Modal, message, Divider, Space } from "antd";
import { FaCreditCard, FaPlus, FaLock, FaShieldAlt } from "react-icons/fa";
import StripeCardForm from "./StripeCardForm";

// Dummy payment methods for development
const dummyPaymentMethods = {
  data: [
    {
      id: "pm_visa_1234",
      brand: "Visa",
      last4: "1234",
      exp_month: "12",
      exp_year: "2026",
    },
    {
      id: "pm_mastercard_5678",
      brand: "Mastercard",
      last4: "5678",
      exp_month: "08",
      exp_year: "2027",
    },
  ],
};

// Dummy session data for development
const dummySession = {
  user: {
    id: "user_123",
    name: "John Doe",
    email: "john@example.com",
  },
};

interface PaymentSectionProps {
  bookingData: any;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ bookingData }) => {
  const session = dummySession; // Use dummy session for development
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(dummyPaymentMethods);

  // For development, use dummy data instead of API calls
  const loadingPaymentMethods = false;

  const calculateNights = () => {
    const checkIn = new Date(bookingData.booking.checkIn);
    const checkOut = new Date(bookingData.booking.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const subtotal = nights * bookingData.booking.nightlyPrice;
  const cleaningFee = bookingData.stay.cleaning_fee
    ? parseFloat(bookingData.stay.cleaning_fee)
    : 0;
  const taxRate = bookingData.stay.tax_percentage
    ? parseFloat(bookingData.stay.tax_percentage) / 100
    : 0;
  const taxAmount = (subtotal + cleaningFee) * taxRate;
  const total = subtotal + cleaningFee + taxAmount;

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleAddCard = () => {
    setShowAddCardModal(true);
  };

  const handleCardAdded = (newPaymentMethod: any) => {
    setShowAddCardModal(false);
    // Add the new payment method to the list
    setPaymentMethods((prev) => ({
      data: [...prev.data, newPaymentMethod],
    }));
    message.success("Payment method added successfully!");
  };

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
      message.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    try {
      // Here you would integrate with Stripe to process the payment
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success("Booking confirmed successfully!");
      // Redirect to confirmation page or dashboard
    } catch (error) {
      message.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const hasPaymentMethods =
    paymentMethods?.data && paymentMethods.data.length > 0;

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card title="Payment Method" className="shadow-sm">
        {loadingPaymentMethods ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading payment methods...</p>
          </div>
        ) : hasPaymentMethods ? (
          <div className="space-y-3">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
            >
              <Space direction="vertical" className="w-full">
                {paymentMethods.data.map((method: any) => (
                  <Radio key={method.id} value={method.id} className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <FaCreditCard className="text-blue-500" />
                        <span>
                          {method.brand} •••• {method.last4}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Expires {method.exp_month}/{method.exp_year}
                      </span>
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <Button
              type="dashed"
              icon={<FaPlus />}
              onClick={handleAddCard}
              className="w-full mt-3"
            >
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <FaCreditCard className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No payment methods found</p>
            <Button type="primary" icon={<FaPlus />} onClick={handleAddCard}>
              Add Payment Method
            </Button>
          </div>
        )}
      </Card>

      {/* Payment Options */}
      {/* <Card title="Payment Options" className="shadow-sm">
        <Radio.Group defaultValue="pay_now" className="w-full">
          <Space direction="vertical" className="w-full">
            <Radio value="pay_now" className="w-full">
              <div className="flex justify-between items-center w-full">
                <span>Pay ${total.toFixed(2)} now</span>
                <span className="text-sm text-gray-500">Full amount</span>
              </div>
            </Radio>
            <Radio value="pay_later" className="w-full">
              <div className="flex justify-between items-center w-full">
                <span>Pay $0 now</span>
                <span className="text-sm text-gray-500">
                  ${total.toFixed(2)} charged on{" "}
                  {new Date(bookingData.booking.checkIn).toLocaleDateString()}
                </span>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </Card> */}

      {/* Security & Trust */}
      <Card className="shadow-sm bg-gray-50">
        <div className="flex items-center space-x-3 mb-3">
          <FaLock className="text-green-500" />
          <span className="font-medium text-gray-900">Secure Payment</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Your payment information is encrypted and secure. We never store your
          full card details.
        </p>
        <div className="flex items-center space-x-3">
          <FaShieldAlt className="text-blue-500" />
          <span className="text-sm text-gray-600">Protected by Stripe</span>
        </div>
      </Card>

      {/* Terms & Conditions */}
      <div className="text-xs text-gray-500 text-center">
        By clicking "Confirm and Pay", you agree to our{" "}
        <Button type="link" className="p-0 h-auto text-xs underline">
          Terms of Service
        </Button>{" "}
        and{" "}
        <Button type="link" className="p-0 h-auto text-xs underline">
          Privacy Policy
        </Button>
      </div>

      {/* Confirm Button */}
      <Button
        type="primary"
        size="large"
        className="w-full h-12 text-lg font-medium"
        onClick={handleConfirmBooking}
        loading={isProcessing}
        disabled={!paymentMethod}
      >
        {isProcessing
          ? "Processing..."
          : `Confirm and Pay $${total.toFixed(2)}`}
      </Button>

      {/* Add Card Modal */}
      <Modal
        title="Add Payment Method"
        open={showAddCardModal}
        onCancel={() => setShowAddCardModal(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <StripeCardForm
          onSuccess={handleCardAdded}
          onCancel={() => setShowAddCardModal(false)}
        />
      </Modal>
    </div>
  );
};

export default PaymentSection;
