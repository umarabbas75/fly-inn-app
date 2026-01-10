# Refund Calculation Discrepancy Analysis

## Executive Summary

There is a discrepancy between the manual calculation (43.75% refund) and the code's actual calculation (37.5% refund) for the same booking cancellation scenario. This document explains why these calculations differ.

---

## Booking Details

- **Booking ID**: 10
- **Property**: Karachi Zoo (Miami, FL)
- **Guest**: Umar Abbas
- **Total Paid**: $258.46
- **Nights Booked**: 8 nights (Jan 9 - Jan 17, 2026)
- **Cancellation Policy**: Strong Short Term
- **Cancellation Time**: Jan 9, 4:51 PM (after check-in time of 8:30 AM)
- **Status**: After check-in, 0 nights stayed

---

## Policy Statement

> "If the Guest cancels after the check-in time, the Host will be paid for each night the Guest does stay, **plus 1 additional night**, **plus 50% for all additional nights** the Guest did not stay."

---

## Manual Calculation (43.75% Refund)

### Interpretation:
The policy should be read as a **three-step formula**:
1. Count nights guest stayed
2. Add 1 mandatory night as penalty
3. Calculate 50% of the **remaining** nights after step 2

### Step-by-Step:

```
Total nights booked:                    8 nights
Nights guest stayed:                    0 nights
Plus 1 additional (penalty):           +1 night
────────────────────────────────────────────────
Subtotal (host definitely gets):        1 night

Remaining nights after penalty:         8 - 1 = 7 nights
50% of remaining:                       7 × 0.50 = 3.5 nights
────────────────────────────────────────────────
Total nights host gets paid:            1 + 3.5 = 4.5 nights (56.25%)

Guest refund (remaining nights):        8 - 4.5 = 3.5 nights
Guest refund percentage:                3.5 / 8 = 43.75%
Guest refund amount:                    $258.46 × 43.75% = $113.08
```

### Formula:
```
Host Nights = nights_stayed + 1 + ((total_nights - nights_stayed - 1) × 0.50)
            = 0 + 1 + ((8 - 0 - 1) × 0.50)
            = 0 + 1 + (7 × 0.50)
            = 0 + 1 + 3.5
            = 4.5 nights

Refund % = ((total_nights - host_nights) / total_nights) × 100
         = ((8 - 4.5) / 8) × 100
         = 43.75%
```

---

## Code's Actual Calculation (37.5% Refund)

### Code Implementation (lines 232-246):

```typescript
const nightsStayed = Math.max(0, now.diff(checkInDate, "day"));  // 0
const nightsRemaining = nights - nightsStayed;                     // 8 - 0 = 8
const nightlyRate = totalAmount / nights;                          // $32.31

const nightsPaidToHost = 
    nightsStayed + 1 + Math.floor(nightsRemaining * 0.5);
//  0 + 1 + Math.floor(8 × 0.5)
//  0 + 1 + Math.floor(4.0)
//  0 + 1 + 4
//  = 5 nights

const hostPayment = Math.min(nightsPaidToHost * nightlyRate, totalAmount);
//  Math.min(5 × $32.31, $258.46)
//  Math.min($161.54, $258.46)
//  = $161.54

refundPercentage = ((totalAmount - hostPayment) / totalAmount) × 100;
//  (($258.46 - $161.54) / $258.46) × 100
//  ($96.92 / $258.46) × 100
//  = 37.5%

refundAmount = $258.46 × 0.375 = $96.92
```

### Step-by-Step:

```
Total nights booked:                    8 nights
Nights guest stayed:                    0 nights
────────────────────────────────────────────────
Nights remaining:                       8 - 0 = 8 nights

Calculate 50% first:                    8 × 0.50 = 4.0 nights
Apply Math.floor:                       floor(4.0) = 4 nights
Add 1 additional:                      +1 night
Add nights stayed:                     +0 nights
────────────────────────────────────────────────
Total nights host gets paid:            5 nights (62.5%)

Guest refund (remaining nights):        8 - 5 = 3 nights
Guest refund percentage:                3 / 8 = 37.5%
Guest refund amount:                    $258.46 × 37.5% = $96.92
```

### Formula:
```
Host Nights = nights_stayed + 1 + floor((total_nights - nights_stayed) × 0.50)
            = 0 + 1 + floor((8 - 0) × 0.50)
            = 0 + 1 + floor(4.0)
            = 0 + 1 + 4
            = 5 nights

Refund % = ((total_nights - host_nights) / total_nights) × 100
         = ((8 - 5) / 8) × 100
         = 37.5%
```

---

## Key Differences

| Aspect | Manual Calculation | Code Calculation |
|--------|-------------------|------------------|
| **Order of Operations** | Subtract penalty first, then calculate 50% | Calculate 50% of all remaining, then add penalty |
| **"Remaining Nights"** | 7 nights (after penalty) | 8 nights (all remaining) |
| **50% Applied To** | 7 nights | 8 nights |
| **Rounding** | No rounding (keeps decimals) | `Math.floor()` rounds down |
| **Host Gets** | 4.5 nights (56.25%) | 5 nights (62.5%) |
| **Guest Gets** | 3.5 nights (43.75%) | 3 nights (37.5%) |
| **Refund Amount** | $113.08 | $96.92 |
| **Difference** | — | **-$16.16 less for guest** |

---

## Root Cause Analysis

### 1. **Mathematical Interpretation Ambiguity**

The policy wording creates ambiguity:

**Policy says:**
> "plus 1 additional night, plus 50% for all additional nights the Guest did not stay"

**Question:** What are "all additional nights"?

- **Interpretation A (Manual)**: Additional nights AFTER the mandatory +1 penalty
  - Formula: `stayed + 1 + (remaining_after_penalty × 0.50)`
  - Logic: The +1 is a fixed penalty, then 50% of what's left
  
- **Interpretation B (Code)**: All nights beyond what guest stayed
  - Formula: `stayed + 1 + floor((total - stayed) × 0.50)`
  - Logic: Calculate 50% of all remaining nights, then add +1 penalty

### 2. **Math.floor() Impact**

The code uses `Math.floor()` which always rounds DOWN:

```typescript
Math.floor(nightsRemaining * 0.5)
```

**Examples:**
- 8 nights → 8 × 0.5 = 4.0 → floor(4.0) = **4** ✓ (no change)
- 7 nights → 7 × 0.5 = 3.5 → floor(3.5) = **3** ✗ (loses 0.5)
- 9 nights → 9 × 0.5 = 4.5 → floor(4.5) = **4** ✗ (loses 0.5)

**Impact:** Systematically reduces guest refunds for odd-number bookings.

### 3. **Order of Operations**

**Mathematical proof that order matters:**

Given: 8 nights, 0 stayed

**Method A (Manual):**
```
= 0 + 1 + ((8 - 0 - 1) × 0.50)
= 1 + (7 × 0.50)
= 1 + 3.5
= 4.5 nights to host
```

**Method B (Code):**
```
= 0 + 1 + floor((8 - 0) × 0.50)
= 1 + floor(8 × 0.50)
= 1 + floor(4.0)
= 1 + 4
= 5 nights to host
```

**Difference:** 0.5 nights = $16.16

---

## Which Interpretation is Correct?

### Legal/Fair Interpretation:

Looking at similar platforms (Airbnb, VRBO), the industry standard is:

**"Nights guest stayed + 1 night penalty + 50% of remaining nights"**

The "+1" is typically a **fixed penalty**, not part of the 50% calculation.

**Example from Airbnb's policy:**
> "Host receives payment for the nights stayed plus one additional night..."

This suggests the +1 should be treated separately, supporting **Manual Calculation**.

### Grammar Analysis:

> "Host will be paid for each night the Guest does stay, **plus 1 additional night**, **plus 50% for all additional nights** the Guest did not stay."

Breaking down the commas:
1. "nights the Guest does stay" = 0
2. "plus 1 additional night" = +1 (fixed)
3. "plus 50% for all additional nights the Guest did not stay" = 50% of remaining

The phrase "**all additional nights**" appearing AFTER "plus 1 additional night" suggests it refers to nights additional to that +1.

**Verdict:** Manual calculation appears more aligned with policy intent.

---

## Impact Analysis

### Financial Impact Per Cancellation:

| Nights Booked | Total Cost | Manual Refund (43.75%) | Code Refund (37.5%) | Difference |
|---------------|-----------|------------------------|---------------------|------------|
| 8 nights | $258.46 | $113.08 | $96.92 | **-$16.16** |
| 10 nights | $323.00 | $141.31 | $121.12 | **-$20.19** |
| 14 nights | $452.00 | $197.63 | $169.50 | **-$28.13** |
| 30 nights | $968.00 | $423.50 | $363.00 | **-$60.50** |

### Systematic Bias:

The code's approach **consistently favors the host** by:
- 6.25 percentage points (43.75% vs 37.5%)
- Roughly **$2 per night** in the booking

Over 1,000 cancellations: **$16,160 difference**

---

## Recommendations

### Option 1: Keep Current Code (Conservative)

**Pros:**
- Simpler calculation (fewer steps)
- More conservative (favors business)
- Easier to explain to hosts

**Cons:**
- Less favorable to guests
- May not match policy intent
- Could create disputes

### Option 2: Fix to Match Manual Calculation

**Pros:**
- Matches policy wording more closely
- Industry standard approach
- More fair to guests

**Cons:**
- Reduces host compensation slightly
- Requires code changes
- May affect existing expectations

### Option 3: Clarify Policy First

Before changing code:
1. Get legal review of policy wording
2. Decide on intended interpretation
3. Update policy to be explicit
4. Then align code to match

**Recommended new policy wording:**
> "Host will be paid for: (a) each night the Guest stays, (b) plus 1 additional night as a penalty, (c) plus 50% of all nights remaining after subtracting (a) and (b) from the total booking."

---

## Proposed Code Fix

If adopting Manual Calculation approach:

```typescript
// AFTER CHECK-IN - Policy-aligned calculation
policyDescription = policy.after_check_in || "No refund policy specified.";
const nightsStayed = Math.max(0, now.diff(checkInDate, "day"));

// Step 1: Nights guest actually stayed
// Step 2: +1 mandatory penalty night
const mandatoryNights = nightsStayed + 1;

// Step 3: Calculate remaining nights after mandatory
const nightsRemaining = Math.max(0, nights - mandatoryNights);

// Step 4: Host gets 50% of remaining (keep decimals for fairness)
const fiftyPercentOfRemaining = nightsRemaining * 0.5;

// Step 5: Total nights host is paid for
const nightsPaidToHost = mandatoryNights + fiftyPercentOfRemaining;

// Step 6: Calculate refund
const nightlyRate = totalAmount / nights;
const hostPayment = Math.min(nightsPaidToHost * nightlyRate, totalAmount);

refundPercentage = Math.max(
  0,
  ((totalAmount - hostPayment) / totalAmount) * 100
);
refundCategory = refundPercentage > 0 ? "partial" : "none";
```

**Result with this fix:**
- Host gets: 4.5 nights ($145.38)
- Guest gets: 3.5 nights ($113.08)
- Refund: 43.75%

---

## Conclusion

The discrepancy exists because:

1. **Different order of operations** - when to subtract the +1 penalty
2. **Math.floor() rounding** - loses fractional nights
3. **Ambiguous policy wording** - "additional nights" can be interpreted two ways

**Current code gives guest 37.5% refund ($96.92)**
**Manual calculation gives guest 43.75% refund ($113.08)**
**Difference: $16.16 per this booking**

The **manual calculation appears more aligned** with typical industry practices and policy intent, but the business should decide which interpretation to use and update both code and policy documentation accordingly.












