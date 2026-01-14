#!/usr/bin/env node

/**
 * Delete All Bookings Script
 * 
 * This script deletes all bookings and their associated blocked dates from the backend.
 * 
 * Usage:
 *   node scripts/delete-all-bookings.js
 * 
 * Environment Variables Required:
 *   - NEXT_PUBLIC_API_URI: Backend API URL
 *   - ADMIN_ACCESS_TOKEN: Admin JWT token for authentication
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_ACCESS_TOKEN;

if (!ADMIN_TOKEN) {
  console.error('❌ Error: ADMIN_ACCESS_TOKEN environment variable is required');
  console.log('\nUsage:');
  console.log('  ADMIN_ACCESS_TOKEN=your_token node scripts/delete-all-bookings.js');
  process.exit(1);
}

// Helper function to make API requests
function makeRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE_URL);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = lib.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || data}`));
          }
        } catch (err) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Main function
async function deleteAllBookings() {
  console.log('🚀 Starting deletion of all bookings and blocked dates...\n');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log('─'.repeat(60));

  try {
    // Step 1: Fetch all bookings
    console.log('\n📋 Fetching all bookings...');
    const bookingsResponse = await makeRequest('/bookings?limit=1000');
    const bookings = bookingsResponse.data || [];
    
    console.log(`   Found ${bookings.length} bookings`);

    if (bookings.length === 0) {
      console.log('\n✅ No bookings found. Nothing to delete.');
      return;
    }

    // Step 2: Delete each booking
    console.log('\n🗑️  Deleting bookings...');
    let successCount = 0;
    let errorCount = 0;

    for (const booking of bookings) {
      try {
        await makeRequest(`/bookings/${booking.id}`, 'DELETE');
        successCount++;
        console.log(`   ✓ Deleted booking #${booking.id} (${booking.booking_reference})`);
      } catch (error) {
        errorCount++;
        console.error(`   ✗ Failed to delete booking #${booking.id}: ${error.message}`);
      }
    }

    console.log('\n─'.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   Total bookings: ${bookings.length}`);
    console.log(`   Successfully deleted: ${successCount}`);
    console.log(`   Failed: ${errorCount}`);

    // Step 3: Fetch all stays and clear their blocked dates
    console.log('\n📋 Fetching all stays to clear blocked dates...');
    const staysResponse = await makeRequest('/stays?limit=1000');
    const stays = staysResponse.data || [];
    
    console.log(`   Found ${stays.length} stays`);

    if (stays.length === 0) {
      console.log('\n✅ No stays found. Skipping blocked dates cleanup.');
      return;
    }

    // Step 4: Clear blocked dates for each stay
    console.log('\n🗑️  Clearing blocked dates...');
    let staysSuccessCount = 0;
    let staysErrorCount = 0;

    for (const stay of stays) {
      try {
        // Send empty array to clear all blocked dates
        await makeRequest(`/stays/${stay.id}/blocked-dates`, 'PATCH', {
          blocked_dates: []
        });
        staysSuccessCount++;
        console.log(`   ✓ Cleared blocked dates for stay #${stay.id} (${stay.title})`);
      } catch (error) {
        staysErrorCount++;
        console.error(`   ✗ Failed to clear blocked dates for stay #${stay.id}: ${error.message}`);
      }
    }

    console.log('\n─'.repeat(60));
    console.log('\n📊 Blocked Dates Summary:');
    console.log(`   Total stays: ${stays.length}`);
    console.log(`   Successfully cleared: ${staysSuccessCount}`);
    console.log(`   Failed: ${staysErrorCount}`);

    console.log('\n✅ Deletion process completed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
deleteAllBookings();















