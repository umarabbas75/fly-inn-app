# Timezone Fix Guide - Frontend & Backend

## Executive Summary

The booking system has critical timezone bugs where cancellation policies are calculated using the **user's local timezone** instead of the **property's timezone**. This causes inconsistent refund calculations based on where the user is located.

---

## Problem Statement

### Current Bug

**Code (line 93-94):**
```typescript
const now = dayjs();                           // ❌ User's timezone!
const checkInDate = dayjs(booking.arrival_date); // ❌ Parsed in user's timezone!
```

### Impact Example

**Scenario:**
- Property: Miami, FL (Eastern Time)
- Check-in: Jan 9, 2026 at 8:30 AM EST
- Guest cancels at: Jan 9, 2026 at 9:00 AM

| User Location | User's Local Time | Property Time (EST) | Code Decision | Correct Decision |
|--------------|-------------------|---------------------|---------------|------------------|
| **New York (EST)** | 9:00 AM EST | 9:00 AM EST | After check-in ✓ | After check-in ✓ |
| **California (PST)** | 6:00 AM PST | 9:00 AM EST | Before check-in ❌ | After check-in ✓ |
| **London (GMT)** | 2:00 PM GMT | 9:00 AM EST | After check-in ✓ | After check-in ✓ |
| **Tokyo (JST)** | 11:00 PM JST | 9:00 AM EST | Next day ❌ | After check-in ✓ |

**Result:** Same cancellation at same moment → Different refunds based on user location! 🚨

---

## Root Causes

### Issue 1: Frontend Uses User's Timezone

```typescript
// Current code (WRONG)
const now = dayjs();  // Gets user's browser timezone
```

### Issue 2: Backend Returns Dates Without Timezone

```json
{
  "arrival_date": "2026-01-09",        // ❌ No timezone info
  "check_in_after": "08:30:00"         // ❌ No timezone info
}
```

### Issue 3: No Combination of Date + Time + Timezone

The system stores:
- Date: `2026-01-09`
- Time: `08:30:00`
- Timezone: `America/New_York`

But never combines them into: `2026-01-09T08:30:00-05:00`

---

## Solution Overview

### Three-Level Fix:

1. **Backend** - Return timezone-aware timestamps
2. **Frontend** - Always use property timezone for calculations
3. **Display** - Show both property time and user's local time

---

## Backend Changes Required

### Priority 1: CRITICAL - Add Timezone-Aware Timestamps

#### API Endpoint Changes:

**Current Response:**
```json
{
  "arrival_date": "2026-01-09",
  "departure_date": "2026-01-17",
  "stay": {
    "check_in_after": "08:30:00",
    "check_out_before": "09:00:00",
    "timezone": "America/New_York"
  }
}
```

**New Response (Option A - Best):**
```json
{
  "arrival_date": "2026-01-09",
  "departure_date": "2026-01-17",
  "arrival_datetime": "2026-01-09T08:30:00-05:00",      // ✅ NEW: Full timestamp with timezone
  "departure_datetime": "2026-01-17T09:00:00-05:00",    // ✅ NEW: Full timestamp with timezone
  "stay": {
    "check_in_after": "08:30:00",
    "check_out_before": "09:00:00",
    "timezone": "America/New_York"
  }
}
```

**Implementation:**
```javascript
// Backend (Node.js example)
const moment = require('moment-timezone');

function buildBookingResponse(booking) {
  const propertyTimezone = booking.stay.timezone || 'America/New_York';
  
  // Combine date + time + timezone
  const arrivalDateTime = moment.tz(
    `${booking.arrival_date} ${booking.stay.check_in_after}`,
    propertyTimezone
  ).format(); // ISO 8601 with timezone
  
  const departureDateTime = moment.tz(
    `${booking.departure_date} ${booking.stay.check_out_before}`,
    propertyTimezone
  ).format();
  
  return {
    ...booking,
    arrival_datetime: arrivalDateTime,
    departure_datetime: departureDateTime,
    // Keep old fields for backward compatibility
    arrival_date: booking.arrival_date,
    departure_date: booking.departure_date
  };
}
```

---

### Priority 2: CRITICAL - Cancellation Calculation Endpoint

Create a dedicated endpoint for refund calculation that runs **server-side** using property timezone:

**New Endpoint:**
```
POST /api/bookings/:id/calculate-refund
```

**Request:**
```json
{
  "cancellation_time": "2026-01-09T16:51:00Z"  // Optional, defaults to now
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "booking_id": 10,
    "cancellation_datetime": "2026-01-09T16:51:00-05:00",
    "check_in_datetime": "2026-01-09T08:30:00-05:00",
    "property_timezone": "America/New_York",
    "is_before_check_in": false,
    "hours_until_check_in": -8.35,
    "applicable_policy": {
      "id": 8,
      "type": "short",
      "group_name": "Strong Short Term",
      "rule_applied": "after_check_in"
    },
    "calculation": {
      "total_amount": 258.46,
      "nights_booked": 8,
      "nights_stayed": 0,
      "nights_to_host": 4.5,
      "nights_to_guest": 3.5,
      "refund_percentage": 43.75,
      "refund_amount": 113.08,
      "host_payout": 145.38
    }
  }
}
```

**Backend Implementation:**
```javascript
// Example: Node.js with moment-timezone
async function calculateRefund(req, res) {
  const bookingId = req.params.id;
  const booking = await getBooking(bookingId);
  
  // Get property timezone
  const propertyTimezone = booking.stay.timezone || 'America/New_York';
  
  // Current time in property's timezone
  const nowInPropertyTz = moment().tz(propertyTimezone);
  
  // Check-in time in property's timezone
  const checkInDateTime = moment.tz(
    `${booking.arrival_date} ${booking.stay.check_in_after}`,
    propertyTimezone
  );
  
  // Is cancellation before or after check-in?
  const isBeforeCheckIn = nowInPropertyTz.isBefore(checkInDateTime);
  const hoursUntilCheckIn = checkInDateTime.diff(nowInPropertyTz, 'hours', true);
  
  // Get applicable policy
  const isLongTerm = booking.nights >= 28;
  const policy = isLongTerm 
    ? booking.stay.cancellation_policy_long 
    : booking.stay.cancellation_policy_short;
  
  // Calculate refund based on policy
  let refundData;
  if (isBeforeCheckIn) {
    refundData = calculateBeforeCheckInRefund(booking, policy, hoursUntilCheckIn);
  } else {
    refundData = calculateAfterCheckInRefund(booking, policy, nowInPropertyTz, checkInDateTime);
  }
  
  return res.json({
    status: true,
    data: {
      booking_id: booking.id,
      cancellation_datetime: nowInPropertyTz.format(),
      check_in_datetime: checkInDateTime.format(),
      property_timezone: propertyTimezone,
      is_before_check_in: isBeforeCheckIn,
      hours_until_check_in: hoursUntilCheckIn,
      applicable_policy: {
        id: policy.id,
        type: policy.type,
        group_name: policy.group_name,
        rule_applied: isBeforeCheckIn ? 'before_check_in' : 'after_check_in'
      },
      calculation: refundData
    }
  });
}
```

---

### Affected Backend Endpoints:

| Endpoint | Change Required | Breaking Change? | Priority |
|----------|----------------|------------------|----------|
| `GET /bookings/:id` | Add `arrival_datetime`, `departure_datetime` fields | ❌ No (additive) | 🔴 Critical |
| `GET /bookings` | Add datetime fields to list | ❌ No (additive) | 🟡 Medium |
| `POST /bookings/:id/calculate-refund` | New endpoint | ❌ No (new) | 🔴 Critical |
| `POST /bookings/:id/cancel` | Use property timezone for calculations | ❌ No (internal) | 🔴 Critical |
| `POST /bookings/:id/check-in` | Already uses server time | ✅ No change needed | ✅ OK |
| `GET /stays/:id` | Ensure `timezone` field exists | ❌ No (already exists) | ✅ OK |

---

## Frontend Changes Required

### Step 1: Install Timezone Plugin

```bash
npm install dayjs
# Plugins are built-in, just need to import them
```

### Step 2: Update Refund Calculation Function

**File:** `app/(dashboard)/dashboard/bookings/[id]/page.tsx`

**Current Code (Lines 88-269):**
```typescript
const calculateRefund = (
  booking: any,
  policy: CancellationPolicy | null,
  nights: number
): RefundCalculation => {
  const now = dayjs();  // ❌ WRONG
  const checkInDate = dayjs(booking.arrival_date);  // ❌ WRONG
  // ...
};
```

**Fixed Code:**
```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const calculateRefund = (
  booking: any,
  policy: CancellationPolicy | null,
  nights: number
): RefundCalculation => {
  // Get property timezone (fallback to Eastern if not provided)
  const propertyTimezone = booking.stay?.timezone || 
                          booking.listing_snapshot?.timezone || 
                          'America/New_York';
  
  // Current time in PROPERTY'S timezone
  const now = dayjs().tz(propertyTimezone);
  
  // Combine arrival date + check-in time in property's timezone
  const checkInTime = booking.stay?.check_in_after || 
                     booking.listing_snapshot?.check_in_after || 
                     '15:00:00';
  
  const checkInDateTime = dayjs.tz(
    `${booking.arrival_date} ${checkInTime}`,
    propertyTimezone
  );
  
  // Calculate time differences
  const isBeforeCheckIn = now.isBefore(checkInDateTime);
  const daysUntilCheckIn = checkInDateTime.diff(now, 'day');
  const hoursUntilCheckIn = checkInDateTime.diff(now, 'hour', true); // true = decimal
  
  const totalAmount = Number(
    booking.grand_total || booking.pricing?.grand_total || 0
  );

  // Default values
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
    // BEFORE CHECK-IN policies
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
    // AFTER CHECK-IN
    policyDescription = policy.after_check_in || "No refund policy specified.";
    
    // Calculate nights stayed since check-in time (not midnight!)
    const nightsStayed = Math.max(0, now.diff(checkInDateTime, 'day'));
    
    // Fixed calculation per policy
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
```

---

### Step 3: Display Timezone Information to User

Add timezone context in the UI:

```typescript
// In the cancellation modal or booking details
const propertyTimezone = booking.stay?.timezone || 'America/New_York';
const userTimezone = dayjs.tz.guess(); // User's timezone

const checkInPropertyTime = dayjs.tz(
  `${booking.arrival_date} ${booking.stay?.check_in_after}`,
  propertyTimezone
);

const checkInUserTime = checkInPropertyTime.clone().tz(userTimezone);

// Display both times
<div className="timezone-info">
  <p>
    <strong>Check-in (Property Time):</strong> {checkInPropertyTime.format('MMM D, YYYY [at] h:mm A z')}
  </p>
  {userTimezone !== propertyTimezone && (
    <p className="text-gray-600">
      <strong>Your Local Time:</strong> {checkInUserTime.format('MMM D, YYYY [at] h:mm A z')}
    </p>
  )}
</div>
```

**Example Output:**
```
Check-in (Property Time): Jan 9, 2026 at 8:30 AM EST
Your Local Time: Jan 9, 2026 at 5:30 AM PST
```

---

## Alternative: Use Backend Calculation (Recommended)

Instead of calculating refunds in frontend, call backend endpoint:

```typescript
// Fetch refund calculation from backend
const { data: refundData } = useApiGet({
  endpoint: `/api/bookings/${bookingId}/calculate-refund`,
  queryKey: ['refund-calculation', bookingId],
});

// Use backend's calculation directly (it's already timezone-aware)
const refundInfo = refundData?.data?.calculation;
```

**Pros:**
- Single source of truth
- No timezone bugs in frontend
- Can update calculation logic without frontend changes
- Consistent across all platforms (web, mobile, admin)

**Cons:**
- Extra API call
- Requires backend implementation first

---

## Migration Strategy

### Phase 1: Backend Changes (Week 1)

1. ✅ Add `arrival_datetime` and `departure_datetime` to booking responses
2. ✅ Create `/bookings/:id/calculate-refund` endpoint
3. ✅ Update `/bookings/:id/cancel` to use property timezone
4. ✅ Test with various timezones

### Phase 2: Frontend Changes (Week 2)

1. ✅ Update dayjs to use timezone plugin
2. ✅ Fix `calculateRefund` function
3. ✅ Add timezone display to UI
4. ✅ Test cancellation flows

### Phase 3: Validation (Week 3)

1. ✅ QA testing from different timezones
2. ✅ Compare frontend vs backend calculations
3. ✅ User acceptance testing
4. ✅ Monitor for issues

### Phase 4: Deprecation (Future)

1. ✅ Move all calculations to backend
2. ✅ Remove frontend calculation logic
3. ✅ Frontend only displays backend results

---

## Testing Checklist

### Manual Testing:

- [ ] Book a property in Eastern timezone from California
- [ ] Book a property in Pacific timezone from New York
- [ ] Cancel before check-in time from different timezones
- [ ] Cancel after check-in time from different timezones
- [ ] Cancel on check-in day before check-in time
- [ ] Cancel on check-in day after check-in time
- [ ] Check calculation matches between frontend and backend

### Automated Testing:

```javascript
describe('Timezone-aware cancellation', () => {
  it('should calculate refund using property timezone', () => {
    const booking = {
      arrival_date: '2026-01-09',
      stay: {
        check_in_after: '08:30:00',
        timezone: 'America/New_York'
      },
      nights: 8,
      grand_total: 258.46
    };
    
    // Mock current time to Jan 9, 4:51 PM EST
    const mockTime = dayjs.tz('2026-01-09 16:51:00', 'America/New_York');
    
    const result = calculateRefund(booking, policy, 8, mockTime);
    
    expect(result.isBeforeCheckIn).toBe(false);
    expect(result.refundPercentage).toBe(43.75);
    expect(result.refundAmount).toBeCloseTo(113.08, 2);
  });
  
  it('should give same result regardless of user timezone', () => {
    // Test from New York
    dayjs.tz.setDefault('America/New_York');
    const resultNY = calculateRefund(booking, policy, 8);
    
    // Test from California
    dayjs.tz.setDefault('America/Los_Angeles');
    const resultCA = calculateRefund(booking, policy, 8);
    
    // Test from Tokyo
    dayjs.tz.setDefault('Asia/Tokyo');
    const resultTokyo = calculateRefund(booking, policy, 8);
    
    expect(resultNY.refundAmount).toBe(resultCA.refundAmount);
    expect(resultCA.refundAmount).toBe(resultTokyo.refundAmount);
  });
});
```

---

## Question for Backend Team

Please send this to your backend team:

---

### **Subject: Critical Timezone Issues in Booking Cancellation System**

Hi Backend Team,

We've identified critical timezone bugs in the booking cancellation system that cause inconsistent refund calculations based on the user's location. The frontend currently uses the user's browser timezone instead of the property's timezone for determining "before check-in" vs "after check-in" status.

**Questions:**

1. **Booking Response:**
   - Can you add `arrival_datetime` and `departure_datetime` fields to the booking response? These should combine `arrival_date + check_in_after` and `departure_date + check_out_before` with the property's timezone in ISO 8601 format.
   - Example: `"arrival_datetime": "2026-01-09T08:30:00-05:00"`
   - Is this a breaking change for other consumers of this API?

2. **Refund Calculation Endpoint:**
   - Can you create a new endpoint `POST /bookings/:id/calculate-refund` that calculates refunds server-side using the property's timezone?
   - This endpoint should return the complete refund breakdown without actually cancelling the booking.
   - Timeline: When can this be ready?

3. **Cancel Endpoint:**
   - Does `POST /bookings/:id/cancel` currently use property timezone for determining before/after check-in?
   - If not, can it be updated to use property timezone instead of server time or request time?

4. **Timezone Field:**
   - Is the `timezone` field already populated for all listings/stays?
   - What's the fallback if a property doesn't have a timezone set?
   - Should we validate timezone values against IANA timezone database?

5. **Database Queries:**
   - Are there any database queries that rely on date comparisons without timezone awareness?
   - Should we audit the codebase for `new Date()` usage that might cause timezone bugs?

6. **Backward Compatibility:**
   - Are there mobile apps or other frontends that consume the booking API?
   - How do we ensure backward compatibility while adding new timezone-aware fields?

**Impact:** This affects refund amounts and could lead to guest disputes. A guest in California cancelling at the same moment as a guest in New York might get different refunds for identical bookings.

**Priority:** High - affects money and customer experience.

Please advise on the best approach and timeline for implementing these changes.

Thanks!

---

## Conclusion

**Current State:**
- ❌ Uses user's timezone (inconsistent)
- ❌ No combination of date + time + timezone
- ❌ Frontend does all calculations
- ❌ Can't verify calculations

**Future State:**
- ✅ Uses property's timezone (consistent)
- ✅ Backend returns full timestamps with timezone
- ✅ Backend calculates refunds
- ✅ Frontend only displays results
- ✅ Testable and verifiable

**Priority:** 🔴 **CRITICAL** - This affects money and could cause legal issues.

**Estimated Effort:**
- Backend: 2-3 days
- Frontend: 1-2 days
- Testing: 1 week
- Total: ~2 weeks









