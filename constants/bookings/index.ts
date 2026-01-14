/**
 * Booking Status Enum
 * Matches backend: src/booking/booking.entity.ts
 */
export enum BookingStatus {
  PENDING_PAYMENT = "pending_payment",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  REFUNDED = "refunded",
}

/**
 * Payment Status Enum
 * Matches backend: src/booking/booking.entity.ts
 */
export enum PaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  REQUIRES_ACTION = "requires_action",
  REFUNDED = "refunded",
}

/**
 * Booking Status Labels for display
 */
export const bookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING_PAYMENT]: "Pending Payment",
  [BookingStatus.CONFIRMED]: "Confirmed",
  [BookingStatus.CANCELLED]: "Cancelled",
  [BookingStatus.COMPLETED]: "Completed",
  [BookingStatus.REFUNDED]: "Refunded",
};

/**
 * Payment Status Labels for display
 */
export const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Pending",
  [PaymentStatus.SUCCEEDED]: "Succeeded",
  [PaymentStatus.FAILED]: "Failed",
  [PaymentStatus.REQUIRES_ACTION]: "Requires Action",
  [PaymentStatus.REFUNDED]: "Refunded",
};

/**
 * Booking Status Colors for UI
 */
export const bookingStatusColors: Record<
  BookingStatus,
  { bg: string; text: string; border?: string }
> = {
  [BookingStatus.PENDING_PAYMENT]: {
    bg: "bg-yellow-500",
    text: "text-white",
  },
  [BookingStatus.CONFIRMED]: {
    bg: "bg-green-500",
    text: "text-white",
  },
  [BookingStatus.CANCELLED]: {
    bg: "bg-red-500",
    text: "text-white",
  },
  [BookingStatus.COMPLETED]: {
    bg: "bg-blue-500",
    text: "text-white",
  },
  [BookingStatus.REFUNDED]: {
    bg: "bg-purple-500",
    text: "text-white",
  },
};

/**
 * Payment Status Colors for UI
 */
export const paymentStatusColors: Record<
  PaymentStatus,
  { bg: string; text: string; border?: string }
> = {
  [PaymentStatus.PENDING]: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  [PaymentStatus.SUCCEEDED]: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  [PaymentStatus.FAILED]: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
  [PaymentStatus.REQUIRES_ACTION]: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-300",
  },
  [PaymentStatus.REFUNDED]: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-300",
  },
};

/**
 * Status filter options for dropdowns
 */
export const bookingStatusFilterOptions = [
  { value: BookingStatus.PENDING_PAYMENT, label: "Pending Payment" },
  { value: BookingStatus.CONFIRMED, label: "Confirmed" },
  { value: BookingStatus.COMPLETED, label: "Completed" },
  { value: BookingStatus.CANCELLED, label: "Cancelled" },
  { value: BookingStatus.REFUNDED, label: "Refunded" },
];

/**
 * Payment status filter options for dropdowns (admin use)
 */
export const paymentStatusFilterOptions = [
  { value: PaymentStatus.PENDING, label: "Pending" },
  { value: PaymentStatus.SUCCEEDED, label: "Succeeded" },
  { value: PaymentStatus.FAILED, label: "Failed" },
  { value: PaymentStatus.REQUIRES_ACTION, label: "Requires Action" },
  { value: PaymentStatus.REFUNDED, label: "Refunded" },
];

/**
 * Status transition reference (for documentation/validation)
 * 
 * | Action            | status          | payment_status    |
 * |-------------------|-----------------|-------------------|
 * | Booking created   | pending_payment | pending           |
 * | Payment succeeds  | confirmed       | succeeded         |
 * | Payment fails     | pending_payment | failed            |
 * | 3D Secure needed  | pending_payment | requires_action   |
 * | Guest cancels     | cancelled       | (unchanged)       |
 * | Stay completed    | completed       | succeeded         |
 * | Refund issued     | refunded        | refunded          |
 */

/**
 * Helper function to get booking status config
 */
export const getBookingStatusConfig = (status: string) => {
  const normalizedStatus = status?.toLowerCase().trim() as BookingStatus;
  
  if (bookingStatusColors[normalizedStatus]) {
    return {
      text: bookingStatusLabels[normalizedStatus],
      bgColor: bookingStatusColors[normalizedStatus].bg,
      textColor: bookingStatusColors[normalizedStatus].text,
    };
  }

  return {
    text: status || "Unknown",
    bgColor: "bg-gray-400",
    textColor: "text-white",
  };
};

/**
 * Helper function to get payment status config
 */
export const getPaymentStatusConfig = (status: string) => {
  const normalizedStatus = status?.toLowerCase().trim() as PaymentStatus;

  if (paymentStatusColors[normalizedStatus]) {
    return {
      text: paymentStatusLabels[normalizedStatus],
      bgColor: paymentStatusColors[normalizedStatus].bg,
      textColor: paymentStatusColors[normalizedStatus].text,
      borderColor: paymentStatusColors[normalizedStatus].border,
    };
  }

  return {
    text: status || "Unknown",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-300",
  };
};

/**
 * Check if booking can be cancelled
 */
export const canCancelBooking = (status: BookingStatus): boolean => {
  return (
    status === BookingStatus.PENDING_PAYMENT ||
    status === BookingStatus.CONFIRMED
  );
};

/**
 * Check if booking is active (not cancelled/refunded/completed)
 */
export const isBookingActive = (status: BookingStatus): boolean => {
  return (
    status === BookingStatus.PENDING_PAYMENT ||
    status === BookingStatus.CONFIRMED
  );
};

/**
 * Check if payment was successful
 */
export const isPaymentSuccessful = (paymentStatus: PaymentStatus): boolean => {
  return paymentStatus === PaymentStatus.SUCCEEDED;
};

/**
 * Check if payment requires user action (3D Secure)
 */
export const paymentRequiresAction = (paymentStatus: PaymentStatus): boolean => {
  return paymentStatus === PaymentStatus.REQUIRES_ACTION;
};

/**
 * Check if booking is in progress (checked in but not completed)
 */
export const isBookingInProgress = (
  booking: {
    status: BookingStatus | string;
    checked_in_at?: string | null;
  }
): boolean => {
  return (
    booking.status === BookingStatus.CONFIRMED &&
    Boolean(booking.checked_in_at)
  );
};


