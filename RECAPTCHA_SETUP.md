# reCAPTCHA v2 Setup Guide

This project uses Google reCAPTCHA v2 for form protection (Signup and Contact Us pages).

## Setup Steps

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "+" to create a new site
3. Fill in the form:
   - **Label**: Fly-Inn Forms
   - **reCAPTCHA type**: Select "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - **Domains**: Add your domains (e.g., `localhost`, `fly-inn-2-0.vercel.app`)
4. Accept the terms and click "Submit"
5. Copy both keys:
   - **Site Key** (public, used in frontend)
   - **Secret Key** (private, used in backend)

### 2. Add Environment Variables

Add these to your `.env.local` file:

```bash
# reCAPTCHA v2 Keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 3. Restart Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
# or
pnpm dev
```

## How It Works

### Frontend
**Signup Page** (`app/(auth)/auth/signup/page.tsx`):
- Uses `react-google-recaptcha` library
- Shows "I'm not a robot" checkbox
- User must complete checkbox before submitting
- Token sent with registration request

**Contact Us Page** (`app/(public)/public/contact-us/page.tsx`):
- Same pattern as signup
- reCAPTCHA checkbox appears above submit button
- Submit button disabled until checkbox completed

### Backend (`app/api/contact-us/route.ts`)
- Receives reCAPTCHA token in request body
- Verifies token with Google's API
- Validates success response
- Sends token to backend `/email/contact-us` for additional verification

## Testing

1. Fill out the contact form
2. Check the "I'm not a robot" checkbox
3. Submit the form
4. Verify:
   - Form submits successfully
   - Success message appears
   - Email is sent to backend

## Troubleshooting

**reCAPTCHA not loading:**
- Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
- Verify the site key is correct
- Check browser console for errors

**Verification failing:**
- Check that `RECAPTCHA_SECRET_KEY` is set on server
- Verify domains are added in reCAPTCHA admin console
- Ensure localhost is included for development

**Checkbox not appearing:**
- Check network tab for blocked requests
- Verify reCAPTCHA script is loading
- Check for ad blockers

## Security Notes

- ✅ reCAPTCHA v2 requires user interaction (checkbox)
- ✅ More explicit bot protection than v3
- ✅ Backend validates token server-side
- ✅ Token verified on both BFF and backend
- ✅ Protects against automated spam

## Where It's Used

Currently implemented on:
- Signup page (`/auth/signup`)
- Contact Us page (`/public/contact-us`)

Can be added to other forms as needed (login, forgot password, etc.)

