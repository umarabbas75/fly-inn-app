# Batch Import Listings - How to Run

## Option 1: Test via Browser Console (Recommended - Easiest with Authentication)

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Log in** to ensure you have an active session
3. **Open the browser console** (F12 or Cmd+Option+I on Mac)
4. **Run this code** in the console to test with 5 listings first:

```javascript
fetch('/api/stays/batch-import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: includes cookies for authentication
  body: JSON.stringify({
    host_id: 25,
    status: 'draft',
    limit: 5  // Start with 5 listings to test
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Import Results:', data);
  console.log('Summary:', data.summary);
  if (data.errors && data.errors.length > 0) {
    console.error('Errors:', data.errors);
  }
})
.catch(error => {
  console.error('❌ Error:', error);
});
```

5. **If successful**, run without limit to import all 98 listings:

```javascript
fetch('/api/stays/batch-import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    host_id: 25,
    status: 'draft'
    // No limit = import all
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Import Complete!', data);
  console.log(`Successfully imported: ${data.summary.successful}/${data.summary.total}`);
})
.catch(error => {
  console.error('❌ Error:', error);
});
```

## Option 2: Using Standalone Node.js Script (Requires Auth Token)

The script is located at: `scripts/batch-import-listings.js`

**Requirements:**
- Node.js 18+ (you have v22.7.0 ✅)
- Auth token from your session
- API URI environment variable

**To get your auth token:**
1. Open browser console while logged in
2. Run: `document.cookie.split(';').find(c => c.includes('next-auth'))`
3. Or check your NextAuth session in the browser

**To run the script:**

```bash
# Set environment variables
export NEXT_PUBLIC_API_URI="http://localhost:8000/api"  # Your backend API URL
export AUTH_TOKEN="your_auth_token_here"

# Run with limit (test with 5 listings first)
node scripts/batch-import-listings.js 5

# Or run with all listings
node scripts/batch-import-listings.js
```

**Or pass token as argument:**
```bash
NEXT_PUBLIC_API_URI="http://localhost:8000/api" node scripts/batch-import-listings.js 5 your_token_here
```

## Option 3: Using cURL (Requires Session Cookie)

If you want to use cURL, you need to get your session cookie first:

1. Open browser DevTools → Application → Cookies
2. Copy the `next-auth.session-token` cookie value
3. Run:

```bash
curl -X POST http://localhost:3000/api/stays/batch-import \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"host_id": 25, "status": "draft", "limit": 5}'
```

## Important Notes

- ⚠️ **Always test with a small limit first** (e.g., 5 listings) before importing all 98 listings
- ✅ All listings will be created with `host_id: 25`
- ✅ All listings will be created as "draft" status for review
- ⚠️ Images are skipped (empty array) - they'll need to be added manually later
- ✅ Missing fields (bedrooms, airports, features, etc.) are set to defaults

## Response Format

The API returns a summary like:

```json
{
  "success": true,
  "summary": {
    "total": 98,
    "successful": 95,
    "failed": 3
  },
  "results": [...],  // First 100 successful results
  "errors": [...],    // First 100 errors
  "message": "Processed 98 listings. 95 successful, 3 failed."
}
```

## Troubleshooting

**If you get "Unauthorized":**
- Make sure you're logged in to the application
- Check that your session cookie is valid
- Try logging out and logging back in

**If you get import errors:**
- Check the console logs for detailed error messages
- Verify the backend API is accessible
- Check that `NEXT_PUBLIC_API_URI` is set correctly

**If the script can't parse listingsStaticData:**
- Make sure `listing-static-data.js` exists in the root directory
- Verify the file has valid ES module syntax: `export const listingsStaticData = [...]`




