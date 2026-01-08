# Featured Stay Payment API Documentation

## Overview

This API allows users to subscribe to featured status for their stays. Featured stays are displayed prominently in listings. The cost is **$49 USD/week** subscription.

**Base URL:** `/api/stays`

---

## Purchase Featured Status

Purchase featured status for a stay. Users can only feature their own stays. Admins can feature any stay on behalf of users.

### Endpoint

```
POST /api/stays/:id/purchase-featured
```

### Authentication

**Required:** Yes (Bearer Token)

The user must be authenticated. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### URL Parameters

| Parameter | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| `id`      | number | Yes      | The ID of the stay to feature |

### Request Body

```json
{
  "stay_id": 123,
  "payment_method_id": "pm_1234567890",
  "admin_payment": false
}
```

#### Request Body Fields

| Field               | Type    | Required | Description                                                                                |
| ------------------- | ------- | -------- | ------------------------------------------------------------------------------------------ |
| `stay_id`           | number  | Yes      | The ID of the stay to feature. Must match the `id` in the URL parameter                    |
| `payment_method_id` | string  | Yes      | Stripe payment method ID (e.g., `pm_1234567890`). Must be a valid Stripe payment method ID |
| `admin_payment`     | boolean | No       | Set to `true` if admin is paying on behalf of a user. Defaults to `false`                  |

### Authorization Rules

1. **Regular Users:**

   - Can only feature their own stays
   - Must own the stay (be the host/creator)
   - Payment is charged to their account

2. **Admins:**
   - Can feature any stay
   - If `admin_payment: true`, payment is charged to the stay owner's account
   - If `admin_payment: false` or omitted, payment is charged to admin's account

### Success Response

**Status Code:** `200 OK`

```json
{
  "status": true,
  "message": "Stay featured successfully - $49/week subscription active",
  "data": {
    "stay_id": 123,
    "payment_id": 1,
    "subscription_id": "sub_xxx",
    "amount": 49,
    "currency": "usd",
    "billing_cycle": "weekly",
    "is_featured": true
  }
}
```

#### Response Fields

| Field                    | Type    | Description                                     |
| ------------------------ | ------- | ----------------------------------------------- |
| `status`                 | boolean | `true` if subscription was successful           |
| `message`                | string  | Success message                                 |
| `data.stay_id`           | number  | The ID of the stay that was featured            |
| `data.payment_id`        | number  | Internal payment record ID                      |
| `data.subscription_id`   | string  | Stripe Subscription ID                          |
| `data.amount`            | number  | Amount charged per billing cycle (always 49.00) |
| `data.currency`          | string  | Currency code (always "usd")                    |
| `data.billing_cycle`     | string  | Billing cycle (always "weekly")                 |
| `data.is_featured`       | boolean | `true` indicating the stay is now featured      |

### Error Responses

#### 400 Bad Request

**Invalid stay ID mismatch:**

```json
{
  "status": false,
  "message": "Stay ID in body must match URL parameter",
  "data": null
}
```

**Payment failed:**

```json
{
  "status": false,
  "message": "Payment failed: requires_payment_method",
  "data": null
}
```

**Stripe not configured:**

```json
{
  "status": false,
  "message": "Stripe not configured",
  "data": null
}
```

#### 401 Unauthorized

**Missing or invalid token:**

```json
{
  "status": false,
  "message": "Unauthorized - User must be logged in",
  "data": null
}
```

#### 403 Forbidden

**User trying to feature someone else's stay:**

```json
{
  "status": false,
  "message": "You can only feature your own stays",
  "data": null
}
```

#### 404 Not Found

**Stay not found:**

```json
{
  "status": false,
  "message": "Stay not found",
  "data": null
}
```

**User not found:**

```json
{
  "status": false,
  "message": "User not found",
  "data": null
}
```

#### 500 Internal Server Error

**Generic server error:**

```json
{
  "status": false,
  "message": "Failed to process payment: <error_details>",
  "data": null
}
```

---

## Frontend Integration Examples

### Example 1: Regular User Featuring Their Own Stay

```javascript
// User wants to feature their stay with ID 123
const purchaseFeatured = async (stayId, paymentMethodId) => {
  try {
    const response = await fetch(`/api/stays/${stayId}/purchase-featured`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        stay_id: stayId,
        payment_method_id: paymentMethodId,
        admin_payment: false,
      }),
    });

    const data = await response.json();

    if (response.ok && data.status) {
      console.log('Stay featured successfully!', data.data);
      // Update UI to show featured badge
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to feature stay');
    }
  } catch (error) {
    console.error('Error featuring stay:', error);
    throw error;
  }
};

// Usage
await purchaseFeatured(123, 'pm_1234567890');
```

### Example 2: Admin Featuring Stay on Behalf of User

```javascript
// Admin wants to feature stay ID 456 on behalf of the stay owner
const adminPurchaseFeatured = async (stayId, paymentMethodId) => {
  try {
    const response = await fetch(`/api/stays/${stayId}/purchase-featured`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        stay_id: stayId,
        payment_method_id: paymentMethodId,
        admin_payment: true, // Admin paying on behalf of user
      }),
    });

    const data = await response.json();

    if (response.ok && data.status) {
      console.log('Stay featured by admin!', data.data);
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to feature stay');
    }
  } catch (error) {
    console.error('Error featuring stay:', error);
    throw error;
  }
};

// Usage
await adminPurchaseFeatured(456, 'pm_9876543210');
```

### Example 3: React Component Example

```jsx
import React, { useState } from 'react';

const FeatureStayButton = ({ stayId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFeatureStay = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get payment method ID from Stripe (using Stripe.js)
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      const response = await fetch(`/api/stays/${stayId}/purchase-featured`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          stay_id: stayId,
          payment_method_id: paymentMethod.id,
          admin_payment: false,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        onSuccess(data.data);
        alert('Stay featured successfully!');
      } else {
        setError(data.message || 'Failed to feature stay');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFeatureStay}
        disabled={loading}
        className="feature-button"
      >
        {loading ? 'Processing...' : 'Subscribe to Featured ($49/week)'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};
```

---

## Payment Flow

### Step-by-Step Process

1. **User selects a stay to feature**

   - Frontend displays the stay details
   - Shows the cost ($49 USD/week subscription)

2. **User provides payment method**

   - Use Stripe.js to collect payment method
   - Create a Payment Method via Stripe API
   - Get the `payment_method_id` (e.g., `pm_1234567890`)

3. **Call the API**

   - Send POST request to `/api/stays/:id/purchase-featured`
   - Include `stay_id`, `payment_method_id`, and optional `admin_payment` flag

4. **Backend processes subscription**

   - Validates ownership (unless admin)
   - Creates/retrieves Stripe customer
   - Attaches payment method to customer
   - Creates Stripe Subscription for $49/week
   - Updates stay to `is_featured = true`
   - Saves payment record with subscription ID

5. **Handle response**
   - Success: Update UI to show featured badge
   - Error: Display error message to user

---

## Important Notes

### Payment Method Requirements

- Payment method must be created via Stripe.js before calling this API
- Payment method ID must start with `pm_`
- Payment method must be valid and chargeable

### Stay Ownership

- Regular users can only feature stays they own
- Ownership is determined by `stay.host.id` or `stay.created_by_id`
- Admins bypass ownership checks

### Featured Status

- Once featured, the stay's `is_featured` field is set to `true`
- Featured status remains active while subscription is active
- Subscription is billed weekly at $49 USD
- Users can cancel subscription from their dashboard
- To remove featured status, cancel subscription or update the stay directly (admin only)

### Subscription Details

- Fixed at **$49.00 USD per week**
- Uses Stripe Subscription (not one-time Payment Intent)
- Stripe Price ID: `price_1SfIDbA4ox7ufUXKL2FjGUgc` (configurable via `STRIPE_FEATURED_STAY_PRICE_ID` env var)
- Currency is always USD
- Billed weekly automatically

### Error Handling

- Always check `response.ok` before processing data
- Check `data.status` field in response
- Display user-friendly error messages
- Log errors for debugging

### Admin Payments

- When `admin_payment: true`, the payment is charged to the stay owner's account
- Admin must have a valid payment method for the stay owner
- Useful for promotional features or customer service scenarios

---

## Related Endpoints

### Get Stay Details

```
GET /api/stays/:id
```

Check if a stay is already featured by checking the `is_featured` field in the response.

### Update Stay

```
PUT /api/stays/:id
```

Admins can manually set `is_featured: true` without payment (for testing or promotions).

---

## Testing

### Test Payment Method IDs (Stripe Test Mode)

Use Stripe's test card numbers:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`

Create a test payment method:

```javascript
const { paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2025,
    cvc: '123',
  },
});
```

---

## Support

For issues or questions:

1. Check error messages in API responses
2. Verify authentication token is valid
3. Ensure payment method is created correctly
4. Contact backend team for payment processing issues
