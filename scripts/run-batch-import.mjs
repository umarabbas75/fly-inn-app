/**
 * Direct batch import script - runs the import via Next.js API endpoint
 * Usage: node scripts/run-batch-import.mjs [limit]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load listings data
const listingsPath = path.join(__dirname, '../listing-static-data.js');
const content = fs.readFileSync(listingsPath, 'utf8');
const match = content.match(/export const listingsStaticData = (\[[\s\S]*\]);/);

if (!match) {
  console.error('❌ Could not parse listingsStaticData from file');
  process.exit(1);
}

let listingsStaticData;
try {
  listingsStaticData = eval(`(${match[1]})`);
} catch (e) {
  console.error('❌ Error parsing listings data:', e.message);
  process.exit(1);
}

const limit = process.argv[2] ? parseInt(process.argv[2], 10) : 5;
const apiToken = process.argv[3] || process.env.BACKEND_API_TOKEN || null;
const listingsToProcess = listingsStaticData.slice(0, limit);

console.log(`\n🚀 Starting batch import...`);
console.log(`📊 Total listings available: ${listingsStaticData.length}`);
console.log(`📝 Processing: ${limit} listings\n`);

// Make request to Next.js API endpoint
const apiUrl = 'http://localhost:3000/api/stays/batch-import';
const requestBody = {
  host_id: 25,
  status: 'draft',
  limit: limit
};

// Add API token if provided
if (apiToken) {
  requestBody.api_token = apiToken;
  console.log(`🔑 Using provided API token\n`);
} else {
  console.log(`⚠️  No API token provided - will try session auth\n`);
}

console.log(`📡 Making request to: ${apiUrl}`);
console.log(`📦 Request body:`, JSON.stringify(requestBody, null, 2));
console.log(`\n⏳ Processing...\n`);

try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    credentials: 'include', // Include cookies if available
  });

  const responseData = await response.json();

  if (response.ok) {
    console.log('✅ Batch import completed!\n');
    console.log('📊 Summary:');
    console.log(`   Total: ${responseData.summary?.total || 'N/A'}`);
    console.log(`   Successful: ${responseData.summary?.successful || 0}`);
    console.log(`   Failed: ${responseData.summary?.failed || 0}\n`);

    if (responseData.results && responseData.results.length > 0) {
      console.log('✅ Successful imports (first 10):');
      responseData.results.slice(0, 10).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.title} (Old ID: ${r.original_id}, New ID: ${r.new_id || 'N/A'})`);
      });
    }

    if (responseData.errors && responseData.errors.length > 0) {
      console.log('\n❌ Errors encountered (first 10):');
      responseData.errors.slice(0, 10).forEach((e, i) => {
        console.log(`   ${i + 1}. ${e.title} (ID: ${e.original_id}): ${e.error}`);
      });
    }
  } else {
    console.error('❌ Request failed:', responseData);
    if (response.status === 401) {
      console.error('\n⚠️  Authentication required!');
      console.error('   Please log in to the application first, then run this script.');
      console.error('   Or use the browser console method (see BATCH_IMPORT_INSTRUCTIONS.md)');
    }
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error making request:', error.message);
  console.error('\n💡 Tip: Make sure:');
  console.error('   1. Next.js dev server is running (npm run dev)');
  console.error('   2. You are logged in to the application');
  console.error('   3. Or use the browser console method instead');
  process.exit(1);
}

