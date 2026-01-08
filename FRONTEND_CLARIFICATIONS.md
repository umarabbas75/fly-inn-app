# Frontend Team - Booking Timezone Issues

## 📋 Overview

The backend has been updated to fix critical timezone bugs in the booking cancellation system. This document outlines the backend changes and clarifications needed from the frontend team.

---

## ✅ Backend Changes Completed

### 1. New Package Added
- **Package**: `moment-timezone` and `@types/moment-timezone`
- **Purpose**: Timezone-aware date/time calculations

### 2. New API Endpoints Created

#### A. Calculate Refund (Timezone-Aware)
```
POST /api/bookings/:id/calculate-refund
```

**Request Body** (optional):
```json
{
  "cancellation_time": "2026-01-09T16:51:00Z"  // Optional ISO 8601 timestamp
}
```

**Response**:
```json
{
  "status": true,
  "message": "Refund calculated successfully",
  "data": {
    "booking_id": 10,
    "booking_reference": "BK-ABC123XYZ",
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

**Authorization**: User must be guest, host, or admin for the booking.

---

#### B. Cancel Booking (Timezone-Aware)
```
POST /api/bookings/:id/cancel
```

**Request Body** (optional):
```json
{
  "reason": "Optional cancellation reason",
  "cancellation_time": "2026-01-09T16:51:00Z"  // Optional ISO 8601 timestamp
}
```

**Response**:
```json
{
  "status": true,
  "message": "Booking cancelled successfully",
  "data": {
    "booking_id": 10,
    "booking_reference": "BK-ABC123XYZ",
    "booking_status": "cancelled",
    "payment_status": "refunded",
    "cancelled_at": "2026-01-09T21:51:00.000Z"
  }
}
```

**Authorization**: User must be guest, host, or admin for the booking.

**What It Does**:
1. Calculates refund using property timezone (not user's browser timezone)
2. Processes refund via Stripe (if payment was captured)
3. Cancels payment authorization (if payment was only authorized)
4. Updates booking status to `cancelled`
5. Removes blocked dates

---

### 3. Updated API Endpoints

#### Updated: Get Booking by ID
```
GET /api/bookings/:id
```

**New Fields in Response**:
```json
{
  "status": true,
  "message": "Booking retrieved successfully",
  "data": {
    "id": 10,
    "arrival_date": "2026-01-09",
    "departure_date": "2026-01-17",
    "arrival_datetime": "2026-01-09T08:30:00-05:00",      // ✨ NEW
    "departure_datetime": "2026-01-17T09:00:00-05:00",    // ✨ NEW
    "stay": {
      "timezone": "America/New_York",
      "check_in_after": "08:30:00",
      "check_out_before": "09:00:00"
    }
    // ... other fields
  }
}
```

**What Changed**:
- Added `arrival_datetime`: Full ISO 8601 timestamp with property timezone
- Added `departure_datetime`: Full ISO 8601 timestamp with property timezone
- These combine `arrival_date` + `check_in_after` + `timezone`
- Old fields (`arrival_date`, `departure_date`) are still present for backward compatibility

---

## 🔧 Refund Calculation Fix

### Issue Fixed: Order of Operations

**Before (Bug)**:
```javascript
Host gets = nights_stayed + 1 + floor((total_nights - nights_stayed) × 0.50)
          = 0 + 1 + floor((8 - 0) × 0.50)
          = 0 + 1 + floor(4.0)
          = 5 nights
Guest gets = 3 nights (37.5% refund)
```

**After (Fixed)**:
```javascript
// Step 1: Mandatory nights (stayed + 1 penalty)
mandatory = nights_stayed + 1
          = 0 + 1 = 1

// Step 2: Remaining nights after mandatory
remaining = total_nights - mandatory
          = 8 - 1 = 7

// Step 3: Host gets 50% of remaining (keep decimals)
host_gets = mandatory + (remaining × 0.50)
          = 1 + (7 × 0.50)
          = 1 + 3.5
          = 4.5 nights

Guest gets = 3.5 nights (43.75% refund)
```

**Financial Impact**: $16.16 more refund per booking (in this example)

---

## 🌐 Timezone Behavior

### How It Works Now (Backend)

1. **Property Timezone is Source of Truth**
   - All calculations use the property's timezone (from `stay.timezone`)
   - Default fallback: `America/New_York` if timezone not set

2. **Check-In Time Calculation**
   - Combines: `arrival_date` + `check_in_after` + `property_timezone`
   - Example: `"2026-01-09" + "08:30:00" + "America/New_York"` → `"2026-01-09T08:30:00-05:00"`

3. **Cancellation Time**
   - Uses server time in property's timezone (not user's browser time)
   - Frontend can optionally pass `cancellation_time` for testing/preview

---

## ❓ Questions for Frontend Team

### 1. Frontend Calculation Logic

**Current Issue**: The frontend currently calculates refunds client-side using the user's browser timezone.

**File**: `app/(dashboard)/dashboard/bookings/[id]/page.tsx` (lines 88-269)

**Question**: Should we:
- **Option A (Recommended)**: Remove frontend calculation entirely and use `POST /bookings/:id/calculate-refund` endpoint?
- **Option B**: Update frontend to use dayjs with timezone plugin and match backend logic?
- **Option C**: Keep frontend calculation for preview, but use backend calculation for actual cancellation?

**Recommendation**: Option A or C. Backend is always correct source of truth.

---

### 2. UI/UX for Timezone Display

**Question**: How should we display times to users in different timezones?

**Recommended Approach**:
```
Check-in: Jan 9, 2026 at 8:30 AM EST (Property Time)
Your Local Time: Jan 9, 2026 at 5:30 AM PST

Note: Cancellation refunds are calculated based on the property's local time.
```

**Implementation Example**:
```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Backend returns: arrival_datetime = "2026-01-09T08:30:00-05:00"
const propertyTime = dayjs(booking.arrival_datetime);
const userTimezone = dayjs.tz.guess(); // Detect user's timezone
const userLocalTime = propertyTime.tz(userTimezone);

// Display both
<div>
  <p>Check-in: {propertyTime.format('MMM D, YYYY [at] h:mm A z')} (Property Time)</p>
  {userTimezone !== booking.stay.timezone && (
    <p>Your Time: {userLocalTime.format('MMM D, YYYY [at] h:mm A z')}</p>
  )}
</div>
```

**Question**: Is this display format acceptable? Any design preferences?

---

### 3. Cancellation Flow

**Current Flow** (assumed):
```
User clicks "Cancel Booking"
  ↓
Frontend calculates refund (using browser time)
  ↓
Shows confirmation modal with refund amount
  ↓
User confirms
  ↓
Frontend calls cancel API
```

**Proposed Flow**:
```
User clicks "Cancel Booking"
  ↓
Frontend calls POST /bookings/:id/calculate-refund (preview)
  ↓
Shows confirmation modal with accurate refund from backend
  ↓
User confirms
  ↓
Frontend calls POST /bookings/:id/cancel (actual cancellation)
```

**Question**: Does this flow work for your UI? Any concerns about making two API calls?

---

### 4. Error Handling

**New Error Cases**:

1. **Booking Already Cancelled**
   ```json
   {
     "status": false,
     "message": "Booking is already cancelled"
   }
   ```

2. **Completed Booking**
   ```json
   {
     "status": false,
     "message": "Completed bookings cannot be cancelled"
   }
   ```

3. **Stripe Refund Failed**
   ```json
   {
     "status": false,
     "message": "Failed to process refund: [Stripe error]"
   }
   ```

**Question**: How should these errors be displayed to users? Any specific error handling requirements?

---

### 5. Backward Compatibility

**Breaking Changes**: ❌ **NONE**

- New fields (`arrival_datetime`, `departure_datetime`) are **additive**
- Old fields (`arrival_date`, `departure_date`) are still present
- Existing frontend code should continue working

**Question**: Do you have any mobile apps or other clients consuming these APIs? Should we coordinate rollout?

---

### 6. Testing Requirements

**Test Scenarios Needed**:

1. **Same Moment, Different User Timezones**
   - User in California cancels at 12:00 PM PST
   - User in New York cancels at 3:00 PM EST (same moment)
   - Both should get identical refunds ✅

2. **Before vs After Check-In (Property Time)**
   - Property in Miami (EST)
   - User in Tokyo cancels at 4:00 AM JST
   - Backend should use Miami time (3:00 PM EST previous day)

3. **Daylight Saving Time**
   - Cancel during DST transition
   - Verify calculations are correct

**Question**: Can you add these test cases to your E2E tests? Need any help with test data setup?

---

## 📦 Required Frontend Updates

### Minimum Changes (Keep Current Behavior)

1. **Install dayjs timezone plugin**:
   ```bash
   npm install dayjs
   ```

2. **No other changes required** - Backend is now timezone-aware, frontend can continue using existing logic

### Recommended Changes (Best Practice)

1. **Use Backend Calculation**:
   - Replace frontend `calculateRefund` with API call to `POST /bookings/:id/calculate-refund`

2. **Display Timezone Info**:
   - Show property timezone and user's local time
   - Add note about timezone-based refund calculations

3. **Update Cancellation Flow**:
   - Call `/calculate-refund` for preview
   - Call `/cancel` for actual cancellation

---

## 🐛 Known Issues from Documentation

### Issue 1: Timezone Bug (✅ FIXED in Backend)

**What Was Wrong**:
- Frontend used user's browser timezone
- Backend now uses property timezone
- Different users got different refunds for same cancellation

**What Changed**:
- Backend calculates everything in property timezone
- Frontend can optionally use backend calculation

---

### Issue 2: Refund Calculation (✅ FIXED in Backend)

**What Was Wrong**:
- Math.floor() and order of operations caused 6.25% less refund
- Guest got 37.5% instead of 43.75%

**What Changed**:
- Backend now subtracts penalty first, then calculates 50%
- No Math.floor() - keeps decimal precision
- More accurate and fair refunds

---

## 📞 Contact & Next Steps

### Immediate Actions

1. **Review this document** and provide feedback
2. **Answer the questions** above (especially #1, #3, #6)
3. **Test the new endpoints** in development environment
4. **Plan frontend updates** based on recommendations

### Timeline

- **Backend**: ✅ Complete and deployed
- **Frontend**: Awaiting team response
- **Testing**: Coordinate with QA team
- **Deployment**: After frontend updates

### Support

- **Backend API docs**: See `booking-docs/TIMEZONE_FIX_GUIDE.md`
- **Simple explanation**: See `booking-docs/TIMEZONE_EXPLAINED_SIMPLE.md`
- **Technical details**: See `booking-docs/REFUND_CALCULATION_DISCREPANCY.md`

---

## 🧪 Quick Test

To verify the backend changes work:

```bash
# 1. Calculate refund (should use property timezone)
curl -X POST http://localhost:3000/api/bookings/10/calculate-refund \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# 2. Get booking (should include new datetime fields)
curl http://localhost:3000/api/bookings/10 \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Cancel booking (processes refund with property timezone)
curl -X POST http://localhost:3000/api/bookings/10/cancel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Testing timezone fix"}'
```

---

## 🎯 Success Criteria

The fix is complete when:

- [ ] Same cancellation moment → Same refund for all users worldwide
- [ ] UI displays property timezone and user's local time clearly
- [ ] Frontend uses backend calculation (or matches it exactly)
- [ ] All tests pass from multiple timezones
- [ ] Zero timezone-related support tickets

---

**Last Updated**: January 9, 2026  
**Backend Version**: Latest  
**Needs Review**: Frontend Team

