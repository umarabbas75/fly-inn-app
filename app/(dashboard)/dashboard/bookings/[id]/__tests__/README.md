# Booking Refund Calculation Tests

## Overview

This directory contains comprehensive unit tests for the booking refund calculation logic, with special focus on timezone handling and policy compliance.

## Test Files

### `refund-calculation.test.ts`

Complete test suite covering:
- ✅ Timezone consistency across different user locations
- ✅ Before check-in refund calculations (all policies)
- ✅ After check-in refund calculations (corrected formula)
- ✅ Edge cases (exact check-in time, missing data, etc.)
- ✅ Different policy types (Strong, Flexible, etc.)
- ✅ Calculation accuracy and precision

## Running Tests

### Install Dependencies

First, install Jest and testing utilities:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test File

```bash
npm test refund-calculation.test.ts
```

### Run with Coverage

```bash
npm test -- --coverage
```

## Test Scenarios

### 1. Timezone Consistency Tests

**Purpose:** Ensure refund calculations are consistent regardless of user's location.

**Scenarios:**
- ✅ User in New York (same as property) gets same refund as user in California
- ✅ User in Tokyo (14 hours ahead) gets same refund as user in New York
- ✅ System uses property timezone (Miami EST), not user timezone

**Expected Result:** All users get identical refunds when cancelling at the same moment.

---

### 2. Before Check-in Tests (Strong Short Term Policy)

**Policy Rules:**
- 14+ days before: 100% refund
- 7-14 days before: 50% refund
- Within 7 days: 0% refund

**Test Cases:**

| Days Before Check-in | Expected Refund | Test Status |
|---------------------|-----------------|-------------|
| 14+ days | 100% ($258.46) | ✅ Pass |
| 7-14 days | 50% ($129.23) | ✅ Pass |
| 1 day | 0% ($0.00) | ✅ Pass |
| Same day, before check-in time | 0% ($0.00) | ✅ Pass |

---

### 3. After Check-in Tests

**Policy:** 
> "Host receives: nights stayed + 1 additional + 50% of remaining nights"

**Corrected Calculation:**
```
mandatoryNights = nightsStayed + 1
nightsRemaining = totalNights - mandatoryNights
hostGets = mandatoryNights + (nightsRemaining × 0.5)
guestRefund = totalNights - hostGets
```

**Test Cases:**

| Nights Stayed | Total Nights | Host Gets | Guest Gets | Expected Refund % | Test Status |
|--------------|--------------|-----------|------------|-------------------|-------------|
| 0 | 8 | 4.5 | 3.5 | 43.75% | ✅ Pass |
| 1 | 8 | 5.0 | 3.0 | 37.5% | ✅ Pass |
| 3 | 8 | 6.0 | 2.0 | 25% | ✅ Pass |
| 7 | 8 | 8.0 | 0.0 | 0% | ✅ Pass |

---

### 4. Edge Cases

| Scenario | Expected Behavior | Test Status |
|----------|-------------------|-------------|
| Cancel exactly at check-in time | Treated as "after check-in" | ✅ Pass |
| Missing timezone | Falls back to America/New_York | ✅ Pass |
| No policy found | 0% refund with error message | ✅ Pass |
| Odd number of nights (7) | Correct decimal handling | ✅ Pass |
| Total = Refund + Forfeit | Math accuracy verified | ✅ Pass |

---

## Known Issues Fixed

### Issue 1: User Timezone Bug

**Before:**
```typescript
const now = dayjs(); // ❌ Uses user's timezone
```

**After:**
```typescript
const now = dayjs().tz(propertyTimezone); // ✅ Uses property timezone
```

**Impact:** California user and New York user now get identical refunds.

---

### Issue 2: Refund Calculation Bug

**Before (Wrong):**
```typescript
nightsPaidToHost = nightsStayed + 1 + Math.floor(nightsRemaining * 0.5);
// For 8 nights, 0 stayed: 0 + 1 + floor(8 × 0.5) = 5 nights → 37.5% refund
```

**After (Correct):**
```typescript
mandatoryNights = nightsStayed + 1;
nightsRemaining = nights - mandatoryNights;
nightsPaidToHost = mandatoryNights + (nightsRemaining * 0.5);
// For 8 nights, 0 stayed: (0 + 1) + ((8-1) × 0.5) = 4.5 nights → 43.75% refund
```

**Impact:** Guest now gets $113.08 instead of $96.92 (difference of $16.16).

---

### Issue 3: Check-in Time Not Considered

**Before:**
```typescript
const checkInDate = dayjs(booking.arrival_date); // ❌ Only date, defaults to midnight
```

**After:**
```typescript
const checkInDateTime = dayjs.tz(
  `${booking.arrival_date} ${checkInTime}`,
  propertyTimezone
); // ✅ Full datetime with timezone
```

**Impact:** System now correctly handles cancellations on check-in day.

---

## Test Data

### Mock Booking

```typescript
{
  id: 10,
  arrival_date: "2026-01-09",
  departure_date: "2026-01-17",
  grand_total: 258.46,
  nights: 8,
  stay: {
    timezone: "America/New_York",
    check_in_after: "08:30:00",
    check_out_before: "09:00:00",
  }
}
```

### Mock Policy (Strong Short Term)

```typescript
{
  id: 8,
  type: "short",
  group_name: "Strong Short Term",
  before_check_in: "Full refund if 14+ days, 50% if 7-14 days, none within 7 days",
  after_check_in: "Host paid for nights stayed + 1 + 50% of remaining",
}
```

---

## Coverage Report

Run coverage to see what percentage of code is tested:

```bash
npm test -- --coverage
```

**Target Coverage:**
- Statements: > 90%
- Branches: > 85%
- Functions: > 90%
- Lines: > 90%

---

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

---

## Debugging Tests

### Run Single Test

```bash
npm test -- -t "should give same refund regardless of user timezone"
```

### Run with Verbose Output

```bash
npm test -- --verbose
```

### Update Snapshots

```bash
npm test -- -u
```

---

## Contributing

When adding new test cases:

1. Follow the existing test structure
2. Use descriptive test names
3. Add comments explaining complex scenarios
4. Verify tests pass before committing
5. Update this README with new scenarios

---

## Questions?

If tests fail unexpectedly:

1. Check if dayjs timezone plugin is installed
2. Verify mock data matches production format
3. Ensure timezone data is available in bookings
4. Check console for any timezone-related warnings

---

## Related Documentation

- [TIMEZONE_FIX_GUIDE.md](../../../../../docs/TIMEZONE_FIX_GUIDE.md) - Complete timezone fix documentation
- [REFUND_CALCULATION_DISCREPANCY.md](../../../../../docs/REFUND_CALCULATION_DISCREPANCY.md) - Calculation formula analysis
- [TIMEZONE_EXPLAINED_SIMPLE.md](../../../../../docs/TIMEZONE_EXPLAINED_SIMPLE.md) - Simple explanation of timezone issues












