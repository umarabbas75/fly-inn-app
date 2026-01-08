# Stripe Payment Methods Integration Guide

## Overview

This guide explains how the Stripe payment methods feature is integrated into the FlyInn dashboard settings page. Users can add, view, edit, and delete payment methods similar to Airbnb's payment management system.

## Features

- ✅ Add new payment methods using Stripe Elements (secure card input)
- ✅ View all saved payment methods
- ✅ Set default payment method
- ✅ Delete payment methods
- ✅ Expired card detection
- ✅ Secure PCI-compliant card handling (no card data stored on our servers)

## Frontend Implementation

### Components Structure

```
app/(dashboard)/dashboard/settings/
├── page.tsx                          # Main settings page with tabs
└── _components/
    ├── PaymentMethodsSection.tsx     # Main payment methods list component
    ├── PaymentMethodCard.tsx         # Individual payment method card
    └── AddPaymentMethodModal.tsx     # Modal for adding new payment methods
```

### API Routes

```
app/api/payments/
├── setup-intent/route.ts            # Create Stripe Setup Intent
├── methods/route.ts                 # GET all, POST new payment method
└── methods/[id]/route.ts            # PATCH update, DELETE payment method
```

## Backend API Requirements

Your backend needs to implement the following endpoints:

### 1. Create Setup Intent

**Endpoint**: `POST /payments/setup-intent`

**Request**:

```json
{}
```

**Response**:

```json
{
  "status": true,
  "data": {
    "client_secret": "seti_xxxxx_secret_xxxxx"
  }
}
```

**Backend Implementation**:

- Create a Stripe Setup Intent
- Return the `client_secret` to the frontend
- The Setup Intent allows collecting payment method details without charging

### 2. Get Payment Methods

**Endpoint**: `GET /payments/methods`

**Response**:

```json
{
  "status": true,
  "data": [
    {
      "id": "pm_xxxxx",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "exp_month": 12,
        "exp_year": 2025
      },
      "is_default": true,
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

**Backend Implementation**:

- Retrieve all payment methods for the authenticated user
- Return payment methods ordered by creation date (or your preference)
- Include card details (brand, last4, expiry)

### 3. Attach Payment Method

**Endpoint**: `POST /payments/methods`

**Request**:

```json
{
  "payment_method_id": "pm_xxxxx"
}
```

**Response**:

```json
{
  "status": true,
  "message": "Payment method added successfully",
  "data": {
    "id": "pm_xxxxx",
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025
    },
    "is_default": false,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

**Backend Implementation**:

- Attach the payment method to the customer
- If this is the first payment method, set it as default
- Return the created payment method object

### 4. Update Payment Method

**Endpoint**: `PATCH /payments/methods/:id`

**Request**:

```json
{
  "is_default": true
}
```

**Response**:

```json
{
  "status": true,
  "message": "Payment method updated successfully",
  "data": {
    "id": "pm_xxxxx",
    "is_default": true
  }
}
```

**Backend Implementation**:

- Update payment method attributes (mainly `is_default`)
- If setting as default, unset other payment methods as default
- Return updated payment method

### 5. Delete Payment Method

**Endpoint**: `DELETE /payments/methods/:id`

**Response**:

```json
{
  "status": true,
  "message": "Payment method deleted successfully"
}
```

**Backend Implementation**:

- Detach payment method from customer
- Delete payment method from Stripe
- Remove from database
- If deleted payment method was default, set another as default (if available)

## Environment Variables

Add to your `.env.local`:

```bash
# Stripe Publishable Key (public, safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Backend API URL
NEXT_PUBLIC_API_URI=https://your-api.com
```

## Stripe Dashboard Setup

1. **Create a Stripe Account**: https://dashboard.stripe.com/register
2. **Get API Keys**:
   - Test Mode: Use test keys (`pk_test_...` and `sk_test_...`)
   - Live Mode: Use live keys (`pk_live_...` and `sk_live_...`)
3. **Configure Webhooks** (optional but recommended):
   - Endpoint: `https://your-backend.com/webhooks/stripe`
   - Events to listen: `payment_method.attached`, `payment_method.detached`

## Testing

### Test Card Numbers

Use these Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

**Expiry**: Any future date (e.g., 12/25)
**CVC**: Any 3 digits (e.g., 123)
**ZIP**: Any 5 digits (e.g., 12345)

### Testing Flow

1. Navigate to `/dashboard/settings`
2. Click "Add Payment Method"
3. Enter test card: `4242 4242 4242 4242`
4. Enter any future expiry date and CVC
5. Click "Add Payment Method"
6. Verify payment method appears in the list
7. Test setting as default
8. Test deletion

## Security Considerations

1. **Never store card data**: All card data is handled by Stripe Elements
2. **PCI Compliance**: Using Stripe Elements means you're PCI compliant
3. **Client Secret**: Setup Intent client secrets are single-use and expire
4. **Authentication**: All API endpoints require authentication
5. **HTTPS**: Always use HTTPS in production

## Error Handling

The frontend handles common errors:

- **Card declined**: Shows error message from Stripe
- **Network errors**: Shows generic error message
- **Invalid card**: Stripe Elements validates in real-time
- **Expired cards**: Detected and marked in the UI

## Future Enhancements

Potential improvements:

- [ ] Support for multiple card types (Amex, Discover, etc.)
- [ ] Billing address collection
- [ ] Payment method nickname/label
- [ ] Payment history per method
- [ ] Automatic card updates via Stripe
- [ ] Support for bank accounts (ACH)
- [ ] Support for digital wallets (Apple Pay, Google Pay)

## Support

For Stripe-related issues:

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com

For implementation questions, contact the development team.
