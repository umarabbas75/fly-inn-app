# Backend Check-In System Requirements

## Overview

This document outlines the backend requirements for implementing the check-in system that allows both guests and hosts to mark bookings as checked in.

## Database Schema Updates

### Booking Entity - Add New Fields

Add the following fields to the `bookings` table:

```sql
ALTER TABLE bookings
ADD COLUMN checked_in_at TIMESTAMP NULL,
ADD COLUMN checked_in_by VARCHAR(10) NULL CHECK (checked_in_by IN ('guest', 'host')),
ADD COLUMN check_in_method VARCHAR(50) NULL;

CREATE INDEX idx_bookings_checked_in_at ON bookings(checked_in_at);
CREATE INDEX idx_bookings_checked_in_by ON bookings(checked_in_by);
```

**Field Descriptions:**

- `checked_in_at`: Timestamp when check-in occurred (NULL if not checked in)
- `checked_in_by`: Who initiated the check-in ('guest' or 'host', NULL if not checked in)
- `check_in_method`: Optional field for tracking how check-in was done ('mobile', 'web', 'host_confirmed', etc.)

## API Endpoint: Check-In

### Endpoint

```
POST /bookings/:id/check-in
```

### Authentication

- **Required**: Yes
- **Method**: Bearer Token (JWT)

### Authorization

- Guest can check in their own bookings (where `guest_id` matches authenticated user)
- Host can check in bookings for their properties (where `host_id` matches authenticated user)
- Admin can check in any booking

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "checked_by": "guest" | "host",  // Optional, can be inferred from auth context
  "check_in_method": "mobile" | "web" | "host_confirmed"  // Optional
}
```

**Note**: If `checked_by` is not provided, infer from user role:

- If user is the guest → `checked_by = "guest"`
- If user is the host → `checked_by = "host"`

### Response (Success - 200)

```json
{
  "status": true,
  "message": "Check-in recorded successfully",
  "data": {
    "booking_id": 123,
    "checked_in_at": "2026-01-15T14:30:00Z",
    "checked_in_by": "guest",
    "check_in_method": "web",
    "booking_status": "confirmed",
    "is_in_progress": true
  }
}
```

### Response (Error - 400/403/404)

```json
{
  "status": false,
  "message": "Error message here",
  "error": "Error code"
}
```

## Business Logic Requirements

### Validation Rules

1. **Booking Exists**: Booking with given ID must exist
2. **User Authorization**:
   - User must be either the guest (`guest_id`) OR the host (`host_id`) of the booking
   - OR user must be an admin
3. **Booking Status**: Booking status must be `CONFIRMED`
4. **Check-In Timing**:
   - Allow check-in up to 2 hours before `arrival_date` (configurable)
   - Allow check-in anytime after `arrival_date` (no expiration)
   - Do NOT allow check-in if `departure_date` has passed
5. **Duplicate Check-In**:
   - Prevent duplicate check-ins (if `checked_in_at` is already set, return error)
   - OR allow re-check-in (update timestamp) - **Recommendation: Prevent duplicate**

### Implementation Logic

```typescript
async function checkInBooking(
  bookingId: number,
  userId: number,
  body: CheckInRequest
) {
  // 1. Fetch booking
  const booking = await getBookingById(bookingId);
  if (!booking) throw new NotFoundError("Booking not found");

  // 2. Verify authorization
  const isGuest = booking.guest_id === userId;
  const isHost = booking.host_id === userId;
  const isAdmin = await isUserAdmin(userId);

  if (!isGuest && !isHost && !isAdmin) {
    throw new ForbiddenError(
      "You don't have permission to check in this booking"
    );
  }

  // 3. Validate booking status
  if (booking.status !== "confirmed") {
    throw new BadRequestError("Booking must be confirmed before check-in");
  }

  // 4. Validate timing
  const arrivalDate = new Date(booking.arrival_date);
  const departureDate = new Date(booking.departure_date);
  const now = new Date();
  const twoHoursBefore = new Date(arrivalDate.getTime() - 2 * 60 * 60 * 1000);

  if (now < twoHoursBefore) {
    throw new BadRequestError(
      `Check-in is available starting ${twoHoursBefore.toISOString()}`
    );
  }

  if (now > departureDate) {
    throw new BadRequestError("Check-in is not available after departure date");
  }

  // 5. Check if already checked in
  if (booking.checked_in_at) {
    throw new BadRequestError("This booking has already been checked in");
  }

  // 6. Determine checked_by
  const checkedBy = body.checked_by || (isGuest ? "guest" : "host");

  // 7. Update booking
  booking.checked_in_at = now;
  booking.checked_in_by = checkedBy;
  booking.check_in_method = body.check_in_method || "web";
  await saveBooking(booking);

  // 8. Send notifications
  if (checkedBy === "guest") {
    await notifyHost(booking.host_id, {
      type: "guest_checked_in",
      booking_id: booking.id,
      guest_name: booking.guest.display_name,
      property_name: booking.stay.title,
      checked_in_at: now,
    });
  } else {
    await notifyGuest(booking.guest_id, {
      type: "host_confirmed_checkin",
      booking_id: booking.id,
      property_name: booking.stay.title,
      checked_in_at: now,
    });
  }

  // 9. Return response
  return {
    booking_id: booking.id,
    checked_in_at: booking.checked_in_at,
    checked_in_by: booking.checked_in_by,
    booking_status: booking.status,
    is_in_progress: true,
  };
}
```

## Update Existing Endpoints

### GET /bookings/:id

Include new fields in response:

```json
{
  "id": 123,
  "booking_reference": "BK-ABC123",
  "status": "confirmed",
  "checked_in_at": "2026-01-15T14:30:00Z",
  "checked_in_by": "guest",
  "check_in_method": "web",
  ...
}
```

### GET /bookings/me/guest

Include `checked_in_at` and `checked_in_by` in booking objects.

### GET /bookings/me/host

Include `checked_in_at` and `checked_in_by` in booking objects.

## Notification Requirements

### When Guest Checks In

Send notification to host:

- **Type**: `guest_checked_in`
- **Message**: "Guest [Guest Name] has checked in at [Property Name]"
- **Channels**: Email, In-app notification (if available)
- **Data**: Booking reference, check-in timestamp, guest details

### When Host Checks In

Send notification to guest:

- **Type**: `host_confirmed_checkin`
- **Message**: "Your host has confirmed your check-in at [Property Name]"
- **Channels**: Email, In-app notification (if available)
- **Data**: Booking reference, check-in timestamp, property details

## Error Messages

| Error Code           | HTTP Status | Message                                              |
| -------------------- | ----------- | ---------------------------------------------------- |
| `BOOKING_NOT_FOUND`  | 404         | "Booking not found"                                  |
| `UNAUTHORIZED`       | 403         | "You don't have permission to check in this booking" |
| `INVALID_STATUS`     | 400         | "Booking must be confirmed before check-in"          |
| `TOO_EARLY`          | 400         | "Check-in is available starting [date/time]"         |
| `TOO_LATE`           | 400         | "Check-in is not available after departure date"     |
| `ALREADY_CHECKED_IN` | 400         | "This booking has already been checked in"           |

## Testing Checklist

- [ ] Guest can check in their own booking
- [ ] Host can check in bookings for their properties
- [ ] Admin can check in any booking
- [ ] Unauthorized users cannot check in
- [ ] Check-in fails if booking status is not CONFIRMED
- [ ] Check-in fails if attempted too early (before 2 hours window)
- [ ] Check-in fails if attempted after departure date
- [ ] Duplicate check-in is prevented
- [ ] Notifications sent correctly
- [ ] Database fields updated correctly
- [ ] GET endpoints return new fields
- [ ] Concurrent check-in attempts handled (race condition)

## Migration Notes

- Existing bookings will have `checked_in_at = NULL`
- No data migration needed
- New bookings support check-in immediately after deployment
- Consider feature flag for gradual rollout

## Optional Enhancements

1. **Check-Out Tracking**: Add `checked_out_at` field for symmetry
2. **Check-In History**: Track multiple check-ins if re-check-in is allowed
3. **Location Verification**: Optional GPS/location verification for mobile check-ins
4. **Photo Verification**: Optional photo upload requirement for check-in
5. **Auto Check-In**: Automatically check in when arrival_date passes (not recommended)
