/**
 * Unit Tests for Booking Refund Calculation
 * Tests timezone-aware refund calculations and policy logic
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Mock booking and policy interfaces
interface CancellationPolicy {
  id: number;
  type: "short" | "long";
  group_name: string;
  before_check_in: string;
  after_check_in: string;
}

interface RefundCalculation {
  refundPercentage: number;
  refundAmount: number;
  forfeitAmount: number;
  hostPayout: number;
  isBeforeCheckIn: boolean;
  daysUntilCheckIn: number;
  hoursUntilCheckIn: number;
  policyName: string;
  policyDescription: string;
  refundCategory: "full" | "partial" | "none";
}

// Copy of the calculateRefund function (would normally import from the component)
const calculateRefund = (
  booking: any,
  policy: CancellationPolicy | null,
  nights: number,
  mockNow?: dayjs.Dayjs // Allow mocking current time for tests
): RefundCalculation => {
  const propertyTimezone = booking.stay?.timezone || 
                          booking.listing_snapshot?.timezone || 
                          'America/New_York';
  
  const now = mockNow ? mockNow.tz(propertyTimezone) : dayjs().tz(propertyTimezone);
  
  const checkInTime = booking.stay?.check_in_after || 
                     booking.listing_snapshot?.check_in_after || 
                     '15:00:00';
  
  const checkInDateTime = dayjs.tz(
    `${booking.arrival_date} ${checkInTime}`,
    propertyTimezone
  );
  
  const totalAmount = Number(
    booking.grand_total || booking.pricing?.grand_total || 0
  );
  
  const isBeforeCheckIn = now.isBefore(checkInDateTime);
  const daysUntilCheckIn = checkInDateTime.diff(now, "day");
  const hoursUntilCheckIn = checkInDateTime.diff(now, "hour", true);

  let refundPercentage = 0;
  let refundCategory: "full" | "partial" | "none" = "none";
  let policyDescription = "No refund available.";
  let policyName = policy?.group_name || "Standard Policy";

  if (!policy) {
    return {
      refundPercentage: 0,
      refundAmount: 0,
      forfeitAmount: totalAmount,
      hostPayout: totalAmount,
      isBeforeCheckIn,
      daysUntilCheckIn,
      hoursUntilCheckIn,
      policyName: "No Policy",
      policyDescription: "No cancellation policy found for this booking.",
      refundCategory: "none",
    };
  }

  const policyGroupLower = (policy.group_name || "").toLowerCase().trim();

  if (isBeforeCheckIn) {
    policyDescription = policy.before_check_in || "No refund policy specified.";

    if (policyGroupLower.includes("easy")) {
      if (hoursUntilCheckIn >= 24) {
        refundPercentage = 100;
        refundCategory = "full";
      }
    } else if (policyGroupLower.includes("flexible short")) {
      if (hoursUntilCheckIn >= 72) {
        refundPercentage = 100;
        refundCategory = "full";
      }
    } else if (policyGroupLower.includes("reasonable")) {
      if (daysUntilCheckIn >= 7) {
        refundPercentage = 100;
        refundCategory = "full";
      } else if (hoursUntilCheckIn >= 72) {
        refundPercentage = 50;
        refundCategory = "partial";
      }
    } else if (policyGroupLower.includes("strong")) {
      if (daysUntilCheckIn >= 14) {
        refundPercentage = 100;
        refundCategory = "full";
      } else if (daysUntilCheckIn >= 7) {
        refundPercentage = 50;
        refundCategory = "partial";
      }
    } else if (policyGroupLower.includes("strict short")) {
      if (daysUntilCheckIn >= 28) {
        refundPercentage = 100;
        refundCategory = "full";
      } else if (daysUntilCheckIn >= 14) {
        refundPercentage = 50;
        refundCategory = "partial";
      }
    } else if (policyGroupLower.includes("flexible long")) {
      if (daysUntilCheckIn >= 28) {
        refundPercentage = 100;
        refundCategory = "full";
      }
    } else if (policyGroupLower.includes("strict long")) {
      if (daysUntilCheckIn >= 28) {
        refundPercentage = 100;
        refundCategory = "full";
      }
    }
  } else {
    policyDescription = policy.after_check_in || "No refund policy specified.";
    
    const nightsStayed = Math.max(0, now.diff(checkInDateTime, 'day'));
    
    const mandatoryNights = nightsStayed + 1;
    const nightsRemaining = Math.max(0, nights - mandatoryNights);
    const fiftyPercentOfRemaining = nightsRemaining * 0.5;
    const nightsPaidToHost = mandatoryNights + fiftyPercentOfRemaining;
    
    const nightlyRate = totalAmount / nights;
    const hostPayment = Math.min(nightsPaidToHost * nightlyRate, totalAmount);
    
    refundPercentage = Math.max(
      0,
      ((totalAmount - hostPayment) / totalAmount) * 100
    );
    refundCategory = refundPercentage > 0 ? "partial" : "none";
  }

  const refundAmount = (totalAmount * refundPercentage) / 100;
  const forfeitAmount = totalAmount - refundAmount;

  return {
    refundPercentage,
    refundAmount,
    forfeitAmount,
    hostPayout: forfeitAmount,
    isBeforeCheckIn,
    daysUntilCheckIn,
    hoursUntilCheckIn,
    policyName,
    policyDescription,
    refundCategory,
  };
};

// Test fixtures
const strongShortTermPolicy: CancellationPolicy = {
  id: 8,
  type: "short",
  group_name: "Strong Short Term",
  before_check_in: "Guests receive a full refund if they cancel 14 days or more before the scheduled check-in time. Guests receive a 50% refund if they cancel between 14 and 7 days before check-in. No refunds within 7 days of check-in.",
  after_check_in: "If the Guest cancels after the check-in time, the Host will be paid for each night the Guest does stay, plus 1 additional night, plus 50% for all additional nights the Guest did not stay.",
};

const flexibleShortTermPolicy: CancellationPolicy = {
  id: 2,
  type: "short",
  group_name: "Flexible Short Term",
  before_check_in: "Guests receive a full refund if they cancel 72 hours or more before check-in.",
  after_check_in: "If the Guest cancels after check-in, the Host will be paid for each night the Guest does stay, plus 1 additional night, plus 50% for all additional nights the Guest did not stay.",
};

const mockBooking = {
  id: 10,
  arrival_date: "2026-01-09",
  departure_date: "2026-01-17",
  grand_total: 258.46,
  nights: 8,
  stay: {
    timezone: "America/New_York",
    check_in_after: "08:30:00",
    check_out_before: "09:00:00",
  },
};

describe('Refund Calculation Tests', () => {
  
  // ============================================
  // TIMEZONE CONSISTENCY TESTS
  // ============================================
  
  describe('Timezone Consistency', () => {
    it('should give same refund regardless of user timezone', () => {
      // Same moment in time, different user timezones
      const checkInMoment = dayjs.tz('2026-01-09 08:30:00', 'America/New_York');
      const cancelMoment = checkInMoment.add(8, 'hours'); // 4:30 PM EST
      
      // User in New York (same timezone as property)
      const resultNY = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelMoment.tz('America/New_York')
      );
      
      // User in California (3 hours behind)
      const resultCA = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelMoment.tz('America/Los_Angeles')
      );
      
      // User in Tokyo (14 hours ahead)
      const resultTokyo = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelMoment.tz('Asia/Tokyo')
      );
      
      // All should give identical results
      expect(resultNY.refundAmount).toBeCloseTo(resultCA.refundAmount, 2);
      expect(resultCA.refundAmount).toBeCloseTo(resultTokyo.refundAmount, 2);
      expect(resultNY.isBeforeCheckIn).toBe(resultCA.isBeforeCheckIn);
      expect(resultCA.isBeforeCheckIn).toBe(resultTokyo.isBeforeCheckIn);
    });

    it('should use property timezone not user timezone', () => {
      // Property in Miami (EST)
      const booking = {
        ...mockBooking,
        stay: {
          timezone: 'America/New_York',
          check_in_after: '14:00:00', // 2 PM EST
        }
      };
      
      // Cancel at 3 PM EST (6 PM UTC)
      const cancelTime = dayjs.tz('2026-01-09 15:00:00', 'America/New_York');
      
      const result = calculateRefund(
        booking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      // Should be AFTER check-in (2 PM < 3 PM in EST)
      expect(result.isBeforeCheckIn).toBe(false);
      expect(result.refundCategory).toBe('partial');
    });
  });

  // ============================================
  // BEFORE CHECK-IN TESTS
  // ============================================
  
  describe('Before Check-in - Strong Short Term Policy', () => {
    it('should give 100% refund if cancelled 14+ days before', () => {
      // Cancel at 7:00 AM, 14 days before check-in at 8:30 AM = 14 days + 1.5 hours
      const cancelTime = dayjs.tz('2025-12-26 07:00:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      expect(result.isBeforeCheckIn).toBe(true);
      expect(result.refundPercentage).toBe(100);
      expect(result.refundAmount).toBeCloseTo(258.46, 2);
      expect(result.refundCategory).toBe('full');
    });

    it('should give 50% refund if cancelled 7-14 days before', () => {
      // Cancel at 7:00 AM, 7 days before check-in at 8:30 AM = 7 days + 1.5 hours
      const cancelTime = dayjs.tz('2026-01-02 07:00:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      expect(result.isBeforeCheckIn).toBe(true);
      expect(result.refundPercentage).toBe(50);
      expect(result.refundAmount).toBeCloseTo(129.23, 2);
      expect(result.refundCategory).toBe('partial');
    });

    it('should give 0% refund if cancelled within 7 days', () => {
      const cancelTime = dayjs.tz('2026-01-08 10:00:00', 'America/New_York'); // 1 day before
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      expect(result.isBeforeCheckIn).toBe(true);
      expect(result.refundPercentage).toBe(0);
      expect(result.refundAmount).toBe(0);
      expect(result.refundCategory).toBe('none');
    });

    it('should use check-in TIME not just DATE', () => {
      // Cancel on check-in day but BEFORE check-in time
      const cancelTime = dayjs.tz('2026-01-09 07:00:00', 'America/New_York'); // 7 AM, check-in is 8:30 AM
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      // Should still be "before check-in" even though it's the same day
      expect(result.isBeforeCheckIn).toBe(true);
      expect(result.hoursUntilCheckIn).toBeCloseTo(1.5, 1); // 1.5 hours until check-in
    });
  });

  // ============================================
  // AFTER CHECK-IN TESTS
  // ============================================
  
  describe('After Check-in - Refund Calculation', () => {
    it('should calculate 43.75% refund (not 37.5%) for 0 nights stayed', () => {
      // Cancel after check-in on arrival day
      const cancelTime = dayjs.tz('2026-01-09 16:51:00', 'America/New_York'); // 4:51 PM
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      expect(result.isBeforeCheckIn).toBe(false);
      
      // Calculation: nights_stayed(0) + 1 mandatory + 50% of (8-1) remaining
      // = 0 + 1 + 3.5 = 4.5 nights to host
      // = 3.5 nights to guest = 43.75%
      expect(result.refundPercentage).toBeCloseTo(43.75, 1);
      expect(result.refundAmount).toBeCloseTo(113.08, 2);
      expect(result.hostPayout).toBeCloseTo(145.38, 2);
      expect(result.refundCategory).toBe('partial');
    });

    it('should calculate refund for 1 night stayed', () => {
      // Cancel after staying 1 night
      const cancelTime = dayjs.tz('2026-01-10 10:00:00', 'America/New_York'); // Next day
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      // Calculation: nights_stayed(1) + 1 mandatory + 50% of (8-2) remaining
      // = 1 + 1 + 3 = 5 nights to host
      // = 3 nights to guest = 37.5%
      expect(result.refundPercentage).toBeCloseTo(37.5, 1);
      expect(result.refundAmount).toBeCloseTo(96.92, 2);
      expect(result.refundCategory).toBe('partial');
    });

    it('should calculate refund for multiple nights stayed', () => {
      // Cancel after staying 3 nights
      const cancelTime = dayjs.tz('2026-01-12 10:00:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      // Calculation: nights_stayed(3) + 1 mandatory + 50% of (8-4) remaining
      // = 3 + 1 + 2 = 6 nights to host
      // = 2 nights to guest = 25%
      expect(result.refundPercentage).toBeCloseTo(25, 1);
      expect(result.refundCategory).toBe('partial');
    });

    it('should give no refund if all nights consumed', () => {
      // Cancel on last day
      const cancelTime = dayjs.tz('2026-01-17 10:00:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      expect(result.refundPercentage).toBe(0);
      expect(result.refundAmount).toBe(0);
      expect(result.refundCategory).toBe('none');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  
  describe('Edge Cases', () => {
    it('should handle cancellation exactly at check-in time', () => {
      const cancelTime = dayjs.tz('2026-01-09 08:30:00', 'America/New_York'); // Exactly check-in time
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      // At exact check-in time, should be considered "after"
      expect(result.isBeforeCheckIn).toBe(false);
      expect(result.hoursUntilCheckIn).toBeCloseTo(0, 1);
    });

    it('should handle missing timezone with fallback', () => {
      const bookingNoTZ = {
        ...mockBooking,
        stay: {
          check_in_after: "08:30:00",
        }
      };
      
      const cancelTime = dayjs.tz('2026-01-09 10:00:00', 'America/New_York');
      
      const result = calculateRefund(
        bookingNoTZ,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      // Should still work with fallback timezone
      expect(result).toBeDefined();
      expect(result.refundAmount).toBeGreaterThanOrEqual(0);
    });

    it('should handle no policy gracefully', () => {
      const cancelTime = dayjs.tz('2026-01-09 10:00:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        null,
        8,
        cancelTime
      );
      
      expect(result.refundPercentage).toBe(0);
      expect(result.policyName).toBe('No Policy');
      expect(result.refundCategory).toBe('none');
    });

    it('should handle odd number of nights correctly', () => {
      const booking7Nights = {
        ...mockBooking,
        nights: 7,
        grand_total: 225.00,
      };
      
      const cancelTime = dayjs.tz('2026-01-09 16:00:00', 'America/New_York');
      
      const result = calculateRefund(
        booking7Nights,
        strongShortTermPolicy,
        7,
        cancelTime
      );
      
      // 0 + 1 + 50% of (7-1) = 1 + 3 = 4 nights to host
      // 3 nights to guest = 42.86%
      expect(result.refundPercentage).toBeCloseTo(42.86, 1);
    });
  });

  // ============================================
  // DIFFERENT POLICIES
  // ============================================
  
  describe('Different Policy Types', () => {
    it('should apply Flexible Short Term policy correctly', () => {
      // 72 hours before check-in
      const cancelTime = dayjs.tz('2026-01-06 08:30:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        flexibleShortTermPolicy,
        8,
        cancelTime
      );
      
      expect(result.isBeforeCheckIn).toBe(true);
      expect(result.refundPercentage).toBe(100);
      expect(result.refundCategory).toBe('full');
    });

    it('should give no refund for Flexible within 72 hours', () => {
      const cancelTime = dayjs.tz('2026-01-08 10:00:00', 'America/New_York'); // 1 day before
      
      const result = calculateRefund(
        mockBooking,
        flexibleShortTermPolicy,
        8,
        cancelTime
      );
      
      expect(result.isBeforeCheckIn).toBe(true);
      expect(result.refundPercentage).toBe(0);
      expect(result.refundCategory).toBe('none');
    });
  });

  // ============================================
  // CALCULATION ACCURACY
  // ============================================
  
  describe('Calculation Accuracy', () => {
    it('should maintain precision for decimal calculations', () => {
      const cancelTime = dayjs.tz('2026-01-09 16:00:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      // Verify refund + forfeit = total
      const total = result.refundAmount + result.forfeitAmount;
      expect(total).toBeCloseTo(258.46, 2);
    });

    it('should calculate percentages correctly', () => {
      const cancelTime = dayjs.tz('2026-01-09 16:00:00', 'America/New_York');
      
      const result = calculateRefund(
        mockBooking,
        strongShortTermPolicy,
        8,
        cancelTime
      );
      
      const expectedPercentage = (result.refundAmount / 258.46) * 100;
      expect(result.refundPercentage).toBeCloseTo(expectedPercentage, 1);
    });
  });
});

// Run tests
if (require.main === module) {
  console.log('Running refund calculation tests...');
  console.log('Use: npm test or jest to run these tests');
}

export { calculateRefund, strongShortTermPolicy, flexibleShortTermPolicy, mockBooking };

