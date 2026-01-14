# Bookings Table Structure Documentation

## Overview

This document describes the bookings table implementation across Admin, Guest (Trips), and Host (Bookings) views. All three views now use a **detailed pricing breakdown** format with consistent columns.

**Last Updated**: January 14, 2026

---

## Table Structure by View

### 1. Admin View (`/admin-dashboard/bookings`)

**API Endpoint**: `GET /api/bookings/admin/all`

**Purpose**: View all bookings across the platform with full visibility of both guests and hosts.

**Columns** (18 total):

1. **ID** - Booking ID (80px, sortable)
2. **Guest** - Guest avatar, name, and email (250px)
3. **Host** - Host name and email (180px)
4. **Date Created** - When booking was created (120px, sortable)
5. **Title** - Property title with image and location (250px)
6. **Check In** - Arrival date (120px, sortable)
7. **Check Out** - Departure date (120px, sortable)
8. **Rent $** - Base total price (100px, sortable)
9. **Add. Guests $** - Extra guest fees (110px, sortable)
10. **Pet Fee $** - Pet fees (100px, sortable)
11. **Extra Services $** - City fees (150px, sortable)
12. **Cleaning Fee $** - Cleaning fees (140px, sortable)
13. **Platform Fee $** - Platform fees (140px, sortable)
14. **Total Before Tax** - _Calculated field_ (160px, sortable)
15. **Taxes $** - Lodging tax (100px, sortable)
16. **Total** - Grand total (120px, sortable)
17. **Status** - Booking status badge (140px, sortable)
18. **Payment** - Payment status badge (130px, sortable)
19. **Actions** - Dropdown menu (80px, fixed right)

**Horizontal Scroll**: 2400px

---

### 2. Guest View (`/dashboard/trips` - My Trips)

**API Endpoint**: `GET /api/bookings/me/guest`

**Purpose**: View bookings where the current user is the guest (traveler).

**Columns** (17 total):

1. **ID** - Booking ID (80px, sortable)
2. **Host** - Host name only, no email (180px)
3. **Date Created** - When booking was created (120px, sortable)
4. **Title** - Property title with image and location (250px)
5. **Check In** - Arrival date (120px, sortable)
6. **Check Out** - Departure date (120px, sortable)
7. **Rent $** - Base total price (100px, sortable)
8. **Add. Guests $** - Extra guest fees (110px, sortable)
9. **Pet Fee $** - Pet fees (100px, sortable)
10. **Extra Services $** - City fees (150px, sortable)
11. **Cleaning Fee $** - Cleaning fees (140px, sortable)
12. **Platform Fee $** - Platform fees (140px, sortable)
13. **Total Before Tax** - _Calculated field_ (160px, sortable)
14. **Taxes $** - Lodging tax (100px, sortable)
15. **Total** - Grand total (120px, sortable)
16. **Status** - Booking status badge (140px, sortable)
17. **Actions** - Dropdown menu (80px, fixed right)

**Differences from Admin**:

- No Guest column (user is the guest)
- No Payment status column (guests don't need backend payment details)
- Host email hidden for privacy

**Horizontal Scroll**: 2400px

---

### 3. Host View (`/dashboard/bookings` - My Bookings)

**API Endpoint**: `GET /api/bookings/me/host`

**Purpose**: View bookings where the current user is the host (property owner).

**Columns** (17 total):

1. **ID** - Booking ID (80px, sortable)
2. **Guest** - Guest avatar, name, and email (250px)
3. **Date Created** - When booking was created (120px, sortable)
4. **Property** - Property title with image and location (250px)
5. **Check In** - Arrival date (120px, sortable)
6. **Check Out** - Departure date (120px, sortable)
7. **Rent $** - Base total price (100px, sortable)
8. **Add. Guests $** - Extra guest fees (110px, sortable)
9. **Pet Fee $** - Pet fees (100px, sortable)
10. **Extra Services $** - City fees (150px, sortable)
11. **Cleaning Fee $** - Cleaning fees (140px, sortable)
12. **Platform Fee $** - Platform fees (140px, sortable)
13. **Total Before Tax** - _Calculated field_ (160px, sortable)
14. **Taxes $** - Lodging tax (100px, sortable)
15. **Earnings** - Grand total (120px, sortable)
16. **Status** - Booking status badge (140px, sortable)
17. **Actions** - Dropdown menu (80px, fixed right)

**Differences from Admin**:

- No Host column (user is the host)
- No Payment status column
- Column labeled "Earnings" instead of "Total"
- Column labeled "Property" instead of "Title"

**Horizontal Scroll**: 2400px

---

## Critical Pricing Calculation

### The Problem

The backend's `pricing.total_price` field does **NOT** represent "Total Before Tax". It only includes:

- `base_total_price` (rent)
- `extra_guest_fee`
- `pet_fee`

### The Solution

The frontend **calculates** "Total Before Tax" as:

```typescript
Total Before Tax = total_price + cleaning_fee + city_fee + platform_fee
```

### Example Calculation

```
Rent:               $130.00  (base_total_price)
Add. Guests:        $ 20.00  (extra_guest_fee)
Pet Fee:            $  0.00  (pet_fee)
------------------------
Backend total_price: $150.00

THEN ADD:
Cleaning Fee:       $ 10.00  (cleaning_fee)
Extra Services:     $ 11.00  (city_fee)
Platform Fee:       $ 16.50  (platform_fee)
------------------------
Total Before Tax:   $187.50  ← Frontend calculation

Taxes:              $ 15.48  (lodging_tax)
------------------------
Grand Total:        $202.98  ✓
```

### Verification Formula

```
Total Before Tax + Taxes = Grand Total
$187.50 + $15.48 = $202.98 ✓
```

---

## Backend Data Structure Expected

### Pricing Object

```json
{
  "pricing": {
    "base_total_price": 130, // Base nightly rate × nights
    "extra_guest_fee": 20, // Additional guests beyond base
    "pet_fee": 0, // Pet fees
    "total_price": 150, // Sum of above 3 fields
    "cleaning_fee": 10, // One-time cleaning
    "city_fee": 11, // City/occupancy fees
    "platform_fee": 16.5, // Service fee
    "lodging_tax": 15.48, // Tax amount
    "grand_total": 202.98 // Final total
  }
}
```

### Booking Object

```json
{
  "id": 1,
  "booking_reference": "BK-ABC123",
  "status": "confirmed",
  "payment_status": "succeeded",
  "arrival_date": "2026-01-15",
  "departure_date": "2026-01-20",
  "guests": 6,
  "children": 0,
  "infants": 0,
  "pets": 0,
  "nights": 5,
  "created_at": "2026-01-14T17:22:08.188Z",
  "pricing": {
    /* see above */
  },
  "guest": {
    "id": 31,
    "display_name": "John Doe",
    "email": "john@example.com",
    "image": "https://..."
  },
  "host": {
    "id": 30,
    "display_name": "Jane Smith",
    "email": "jane@example.com"
  },
  "stay": {
    "id": 2,
    "title": "Beautiful Beach House",
    "city": "Miami",
    "state": "Florida",
    "images": [
      {
        "id": 1,
        "url": "https://...",
        "image": "listing/..."
      }
    ]
  }
}
```

---

## API Endpoints

### Admin Endpoint

```
GET /api/bookings/admin/all
```

**Query Parameters**:

- `page` - Page number (default: 1)
- `per_page` - Results per page (default: 50, max: 100)
- `status` - Filter by booking status
- `payment_status` - Filter by payment status
- `guest_id` - Filter by guest ID
- `host_id` - Filter by host ID
- `stay_id` - Filter by property ID
- `search` - General search term

**Response**:

```json
{
  "data": {
    "bookings": [
      /* array of booking objects */
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 50,
      "total": 100,
      "last_page": 2,
      "next_page_url": 2
    }
  }
}
```

### Guest Endpoint

```
GET /api/bookings/me/guest?page=1&per_page=50
```

### Host Endpoint

```
GET /api/bookings/me/host?page=1&per_page=50
```

---

## Column Width Reference

| Column Name      | Width | Notes                                     |
| ---------------- | ----- | ----------------------------------------- |
| ID               | 80px  | Small, just numbers                       |
| Guest            | 250px | Avatar + name + email                     |
| Host             | 180px | Name + email (admin) or name only (guest) |
| Date Created     | 120px | Date format: MMM D, YYYY                  |
| Title/Property   | 250px | Image + title + location                  |
| Check In         | 120px | Date format: MMM D, YYYY                  |
| Check Out        | 120px | Date format: MMM D, YYYY                  |
| Rent $           | 100px | Currency format                           |
| Add. Guests $    | 110px | Currency format                           |
| Pet Fee $        | 100px | Currency format                           |
| Extra Services $ | 150px | Wider for longer label                    |
| Cleaning Fee $   | 140px | Currency format                           |
| Platform Fee $   | 140px | Currency format                           |
| Total Before Tax | 160px | **Calculated**, currency format           |
| Taxes $          | 100px | Currency format                           |
| Total/Earnings   | 120px | Bold green, currency format               |
| Status           | 140px | Badge with color coding                   |
| Payment          | 130px | Badge with color coding (admin only)      |
| Actions          | 80px  | Dropdown menu, fixed right                |

**Total horizontal scroll**: 2400px for all views with detailed pricing

---

## Files Modified

1. **`/app/api/bookings/admin/all/route.ts`** (NEW)

   - Proxy endpoint for admin bookings

2. **`/constants/bookings/index.ts`**

   - Added `paymentStatusFilterOptions`

3. **`/app/(dashboard)/dashboard/bookings/_components/BookingsListView.tsx`**

   - Created three separate column definitions: `adminColumns`, `guestColumns`, `hostColumns`
   - Implemented "Total Before Tax" calculation
   - Updated column widths for better readability
   - Unified pricing breakdown across all views

4. **`/app/(adminDashboard)/admin-dashboard/bookings/page.tsx`**
   - Updated documentation comments

---

## Action Menus

### Admin Actions

- View Details
- View Stay

### Guest Actions (Trips)

- View Details
- View Stay
- Cancel Trip (if cancellable and before arrival)

### Host Actions (Bookings)

- View Details
- View Stay
- Accept Booking (if pending payment)
- Decline Booking (if pending payment)

---

## Future Considerations

### Admin Filters (Currently Hidden)

The following admin-specific filters are implemented but hidden in the UI:

- Payment Status dropdown
- Guest ID input
- Host ID input
- Stay ID input

**To enable**: Remove `&& false` from line 858 in `BookingsListView.tsx`

### Potential Changes

1. **Column Reordering**: Columns can be reordered by changing the array order
2. **Column Visibility Toggle**: Could add user preferences to show/hide columns
3. **Export Functionality**: Add CSV/Excel export for filtered results
4. **Bulk Actions**: Add checkboxes for bulk operations
5. **Column Resizing**: Could make columns user-resizable
6. **Host Earnings**: May need to show net earnings (after platform fees) instead of gross total

---

## Testing Checklist

- [ ] Verify all three views display correctly
- [ ] Confirm pricing calculations match backend
- [ ] Test sorting on all sortable columns
- [ ] Verify pagination works correctly
- [ ] Test search functionality
- [ ] Confirm status filters work
- [ ] Verify guest/host email display rules
- [ ] Test action menu items
- [ ] Verify horizontal scrolling works
- [ ] Confirm responsive behavior on mobile

---

## Backend Verification Needed

Please confirm with backend team:

1. **Pricing Calculation**:

   ```
   grand_total = total_price + cleaning_fee + city_fee + platform_fee + lodging_tax
   ```

2. **Admin Detail Access**:

   - Need `/bookings/admin/:id` endpoint (currently returns 403 for admins)

3. **Data Structure**:
   - All pricing fields present in response
   - Guest and Host relations populated with email/image
   - Pagination structure matches expected format

---

## Contact

For questions or changes to this implementation, contact the frontend development team.
