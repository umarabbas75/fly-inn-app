"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Spin,
  Card,
  Divider,
  Tag,
  Button,
  Radio,
  Modal,
  message,
  Space,
  Tooltip,
  Form,
  Input,
} from "antd";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaInfoCircle,
  FaCreditCard,
  FaPlus,
  FaLock,
  FaShieldAlt,
  FaQuestionCircle,
  FaUser,
} from "react-icons/fa";

// Dummy data for development
const dummyStayData = {
  id: 163,
  title: "(5B6) Falmouth Airpark - Cape Cod Home On The Runway",
  stay_type: "Hangar Home",
  no_of_bedrooms: 3,
  no_of_bathrooms: "2.50",
  city: "Falmouth",
  state: "MA",
  cleaning_fee: "225.00",
  tax_percentage: "7.00",
  images: [
    {
      id: 2348,
      image:
        "https://s3.amazonaws.com/flyinn-app-bucket/listing/1743786206_IMG_3082.jpg",
      sort_order: 0,
      description: "",
    },
  ],
  rules: {
    children_allowed: 1,
    pets_allowed: 0,
    additional_guest: 1,
  },
  max_children: 2,
  max_infants: 1,
  max_pets: 0,
  additional_guests: 2,
};
const dummyPricingData = {
  nightly_price: 395.0,
  weekend_price: 450.0,
  weekly_discount: 0.1,
  monthly_discount: 0.15,
};
const initialPaymentMethods = {
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

const ReservePage = () => {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);

  // Extract query parameters
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const noOfAdults = searchParams.get("no_of_adults");
  const noOfChildren = searchParams.get("no_of_children");
  const noOfInfants = searchParams.get("no_of_infants");
  const noOfPets = searchParams.get("no_of_pets");
  const nightlyPrice = searchParams.get("nightly_price");

  // Initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockBookingData = {
        stay: dummyStayData,
        pricing: dummyPricingData,
        booking: {
          checkIn: checkIn || "2025-09-24T00:00:00.000Z",
          checkOut: checkOut || "2025-09-27T00:00:00.000Z",
          noOfAdults: parseInt(noOfAdults || "2"),
          noOfChildren: parseInt(noOfChildren || "1"),
          noOfInfants: parseInt(noOfInfants || "0"),
          noOfPets: parseInt(noOfPets || "0"),
          nightlyPrice: parseFloat(nightlyPrice || "395.00"),
        },
      };
      setBookingData(mockBookingData);
      // Pre-select the first payment method if it exists
      if (initialPaymentMethods.data.length > 0) {
        setPaymentMethod(initialPaymentMethods.data[0].id);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    checkIn,
    checkOut,
    noOfAdults,
    noOfChildren,
    noOfInfants,
    noOfPets,
    nightlyPrice,
  ]);

  const calculateNights = () => {
    if (!bookingData) return 0;
    try {
      const checkInDate = new Date(bookingData.booking.checkIn);
      const checkOutDate = new Date(bookingData.booking.checkOut);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 3;
    }
  };

  const nights = bookingData ? calculateNights() : 0;
  const subtotal = bookingData
    ? nights * (bookingData.booking.nightlyPrice || 0)
    : 0;
  const cleaningFee = bookingData?.stay?.cleaning_fee
    ? parseFloat(bookingData.stay.cleaning_fee)
    : 0;
  const taxRate = bookingData?.stay?.tax_percentage
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
    setPaymentMethods((prev) => ({
      data: [...prev.data, newPaymentMethod],
    }));
    setPaymentMethod(newPaymentMethod.id); // Automatically select the new card
    message.success("Payment method added successfully!");
  };

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
      message.error("Please select a payment method");
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success("Booking confirmed successfully!");
    } catch (error) {
      message.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const hasPaymentMethods =
    paymentMethods?.data && paymentMethods.data.length > 0;
  const stay = bookingData.stay;
  const booking = bookingData.booking;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Custom Card Form (for Modal)
  const StripeCardForm = ({ onSuccess, onCancel }: any) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: any) => {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const mockPaymentMethod = {
          id: `pm_${Math.random().toString(36).substr(2, 9)}`,
          brand: values.cardNumber.startsWith("4") ? "Visa" : "Mastercard",
          last4: values.cardNumber.slice(-4),
          exp_month: values.expiryDate.split("/")[0],
          exp_year: `20${values.expiryDate.split("/")[1]}`,
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
      <Card className="shadow-lg border-gray-200 rounded-xl">
        <div className="text-center mb-6">
          <FaCreditCard className="text-4xl text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">
            Add a credit or debit card
          </h3>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="cardholderName"
            label="Cardholder Name"
            rules={[
              { required: true, message: "Please enter cardholder name" },
            ]}
          >
            <Input
              placeholder="John Doe"
              className="h-12"
              prefix={<FaUser className="text-gray-400" />}
            />
          </Form.Item>
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
              placeholder="•••• •••• •••• ••••"
              maxLength={16}
              className="h-12 text-lg"
              prefix={<FaCreditCard className="text-gray-400" />}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[
                { required: true, message: "Required" },
                {
                  pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: "Invalid format (MM/YY)",
                },
              ]}
            >
              <Input
                placeholder="MM/YY"
                maxLength={5}
                className="h-12"
                prefix={<FaCalendarAlt className="text-gray-400" />}
              />
            </Form.Item>
            <Form.Item
              name="cvv"
              label="CVV"
              rules={[
                { required: true, message: "Please enter CVV" },
                { pattern: /^\d{3,4}$/, message: "Invalid CVV" },
              ]}
            >
              <Input
                placeholder="123"
                maxLength={4}
                className="h-12"
                prefix={<FaLock className="text-gray-400" />}
              />
            </Form.Item>
          </div>
          <div className="flex space-x-4 pt-4">
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
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Header Section */}
      <div className="relative h-[400px] bg-gray-900 overflow-hidden">
        <Image
          src={stay.images[0]?.image || "/placeholder.jpg"}
          alt={stay.title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="relative z-10 container flex flex-col justify-end h-full pb-16">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">
            Confirm and pay
          </h1>
          <p className="text-gray-200 text-lg">
            Your reservation is protected by our secure payment system.
          </p>
        </div>
      </div>

      <div className="relative -mt-20 z-20 container grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Booking Summary Card */}
        <Card className="rounded-3xl shadow-2xl p-6 lg:p-10 mb-8 border-none bg-white/90 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Booking Details
          </h2>
          <div className="space-y-6 text-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-blue-500 text-lg" />
                <span className="font-semibold">Dates</span>
              </div>
              <span className="text-right">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaUsers className="text-green-500 text-lg" />
                <span className="font-semibold">Guests</span>
              </div>
              <span className="text-right">
                {booking.noOfAdults} adult{booking.noOfAdults !== 1 ? "s" : ""}
                {booking.noOfChildren > 0 &&
                  `, ${booking.noOfChildren} child${
                    booking.noOfChildren !== 1 ? "ren" : ""
                  }`}
                {booking.noOfInfants > 0 &&
                  `, ${booking.noOfInfants} infant${
                    booking.noOfInfants !== 1 ? "s" : ""
                  }`}
                {booking.noOfPets > 0 &&
                  `, ${booking.noOfPets} pet${
                    booking.noOfPets !== 1 ? "s" : ""
                  }`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaInfoCircle className="text-purple-500 text-lg" />
                <span className="font-semibold">Nights</span>
              </div>
              <span>
                {nights} night{nights !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <Divider className="my-6" />
          <h3 className="text-xl font-bold mb-4">Price Details</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>
                ${booking.nightlyPrice || 0} × {nights} night
                {nights !== 1 ? "s" : ""}
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {cleaningFee > 0 && (
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>${cleaningFee.toFixed(2)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total (USD)</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Section */}
        <div className="space-y-8 mt-12 lg:mt-0">
          <Card className="rounded-3xl shadow-2xl p-6 lg:p-10 mb-8 border-none bg-white/90 backdrop-blur-sm">
            {/* Payment Method Selection */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
            <div className="space-y-4">
              {hasPaymentMethods ? (
                <>
                  <p className="text-gray-600 mb-4">
                    Choose a saved payment method
                  </p>
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="w-full space-y-3"
                  >
                    <Space direction="vertical" className="w-full">
                      {paymentMethods.data.map((method: any) => (
                        <Radio.Button
                          key={method.id}
                          value={method.id}
                          className="w-full h-auto py-4 px-4 rounded-lg border-2"
                          style={{
                            borderColor:
                              paymentMethod === method.id
                                ? "#3B82F6"
                                : "transparent",
                            backgroundColor:
                              paymentMethod === method.id
                                ? "#EBF5FF"
                                : "#F9FAFB",
                          }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <FaCreditCard className="text-blue-500 text-lg" />
                              <span>
                                {method.brand} •••• {method.last4}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              Exp: {method.exp_month}/{method.exp_year}
                            </span>
                          </div>
                        </Radio.Button>
                      ))}
                    </Space>
                  </Radio.Group>
                  <Button
                    type="dashed"
                    icon={<FaPlus />}
                    onClick={handleAddCard}
                    className="w-full mt-4 h-12 font-medium"
                  >
                    Add another payment method
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    You don't have any saved payment methods.
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    icon={<FaPlus />}
                    onClick={handleAddCard}
                    className="w-full h-12 font-medium"
                  >
                    Add a Payment Method
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Confirm and Pay */}
          <div className="text-center py-4 text-sm text-gray-600 space-y-2">
            <p>
              By clicking "Confirm and Pay", you agree to our{" "}
              <Button type="link" className="p-0 h-auto text-sm underline">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button type="link" className="p-0 h-auto text-sm underline">
                Privacy Policy
              </Button>
              .
            </p>
            <div className="flex items-center justify-center space-x-2">
              <FaLock className="text-green-500 text-lg" />
              <span>Secure payment powered by Stripe.</span>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            className="w-full h-14 text-xl font-bold rounded-lg"
            onClick={handleConfirmBooking}
            loading={isProcessing}
            disabled={isProcessing || !paymentMethod}
          >
            {isProcessing
              ? "Processing..."
              : `Confirm and pay $${total.toFixed(2)}`}
          </Button>
        </div>
      </div>

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

export default ReservePage;
