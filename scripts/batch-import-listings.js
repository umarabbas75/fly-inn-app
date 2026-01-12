/**
 * Standalone script to batch import listings
 * Usage: node scripts/batch-import-listings.js [limit]
 * 
 * Requires NEXT_PUBLIC_API_URI and AUTH_TOKEN environment variables
 * Or pass AUTH_TOKEN as second argument: node scripts/batch-import-listings.js 5 YOUR_TOKEN
 */

const fs = require('fs');
const path = require('path');

// Load the listings data using dynamic import (Node.js 22 supports ES modules)
let listingsStaticData;
try {
  // Use dynamic import for ES module
  const modulePath = path.resolve(__dirname, '../listing-static-data.js');
  // Since it's an ES module, we need to use import()
  // For Node.js, we can use eval with the module content, or use import()
  // Let's use a safer approach: read and evaluate just the array
  const listingsDataContent = fs.readFileSync(modulePath, 'utf8');
  
  // Extract the array content (everything after "export const listingsStaticData = ")
  const arrayStart = listingsDataContent.indexOf('export const listingsStaticData = ') + 'export const listingsStaticData = '.length;
  // Find the matching closing bracket (handles nested arrays)
  let bracketCount = 0;
  let arrayEnd = arrayStart;
  for (let i = arrayStart; i < listingsDataContent.length; i++) {
    if (listingsDataContent[i] === '[') bracketCount++;
    if (listingsDataContent[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        arrayEnd = i + 1;
        break;
      }
    }
  }
  
  const arrayContent = listingsDataContent.substring(arrayStart, arrayEnd);
  // Safely evaluate (since we trust the data source)
  listingsStaticData = eval(`(${arrayContent})`);
} catch (e) {
  console.error('❌ Error loading listings data:', e.message);
  console.error('   Make sure listing-static-data.js exists and has valid export syntax');
  process.exit(1);
}

if (!Array.isArray(listingsStaticData)) {
  console.error('❌ listingsStaticData is not an array');
  process.exit(1);
}

// Get command line arguments
const limit = process.argv[2] ? parseInt(process.argv[2], 10) : null;
const authToken = process.argv[3] || process.env.AUTH_TOKEN;
const apiUri = process.env.NEXT_PUBLIC_API_URI || process.env.API_URI;

if (!apiUri) {
  console.error('❌ NEXT_PUBLIC_API_URI or API_URI environment variable is required');
  console.error('   Example: NEXT_PUBLIC_API_URI=http://localhost:8000/api node scripts/batch-import-listings.js 5');
  process.exit(1);
}

if (!authToken) {
  console.error('❌ AUTH_TOKEN is required');
  console.error('   Set as environment variable: AUTH_TOKEN=your_token node scripts/batch-import-listings.js 5');
  console.error('   Or pass as argument: node scripts/batch-import-listings.js 5 your_token');
  process.exit(1);
}

// Transformation functions (same as in transform-listing-data.ts)
function stringToNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

function numberToBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;
  return value === 1 || value === '1' || value === true;
}

function transformListingData(oldListing, options = {}) {
  const hostId = options.hostId ?? 25;
  const status = options.status ?? 'draft';

  return {
    listing_type: oldListing.listing_type ?? 'short-term rental',
    address: oldListing.address ?? null,
    unit_no: oldListing.unit_no ?? null,
    country: oldListing.country ?? null,
    state: oldListing.state ?? null,
    city: oldListing.city ?? null,
    zipcode: oldListing.zipcode ?? null,
    area: oldListing.area ?? null,
    latitude: stringToNumber(oldListing.latitude),
    longitude: stringToNumber(oldListing.longitude),
    timezone: null,
    type_of_space: oldListing.type_of_space ?? null,
    lodging_type: oldListing.lodging_type ?? null,
    title: oldListing.title ?? null,
    floor_number: null,
    no_of_guest: oldListing.no_of_guest ?? null,
    no_of_bedrooms: oldListing.no_of_bedrooms ?? null,
    no_of_beds: oldListing.no_of_beds ?? null,
    no_of_bathrooms: stringToNumber(oldListing.no_of_bathrooms),
    no_of_rooms: oldListing.no_of_rooms ?? null,
    size: oldListing.size ?? null,
    unit_of_measure: oldListing.unit_of_measure ?? 'ft',
    description: oldListing.description ?? null,
    instant_booking: numberToBoolean(oldListing.instant_booking),
    nightly_price: stringToNumber(oldListing.nightly_price),
    apply_weekend_price: null,
    weekend_nightly_price: null,
    nightly_price_seven_plus: null,
    nightly_price_thirty_plus: null,
    additional_guest: false,
    no_of_additional_guest: null,
    additional_guest_price: null,
    pet_allowed: false,
    no_of_pets: null,
    price_per_pet: null,
    cleaning_fee: null,
    cleaning_freq: 'Per stay',
    city_fee: null,
    city_fee_freq: 'Per stay',
    tax_percentage: stringToNumber(oldListing.tax_percentage),
    custom_period_pricing: false,
    custom_periods: [],
    extra_service: false,
    extra_services: [],
    features: [],
    cancellation_policy_short: null,
    cancellation_policy_long: null,
    min_day_booking: null,
    max_day_booking: null,
    check_in_after: null,
    check_out_before: null,
    smoking_allowed: false,
    smoking_rules: null,
    party_allowed: false,
    party_rules: null,
    children_allowed: false,
    children_rules: null,
    rules_pet_allowed: false,
    pet_rules: null,
    rules: null,
    rules_instructions: null,
    children_ages: [5, 15],
    infant_ages: [5, 15],
    welcome_message: null,
    welcome_message_instructions: null,
    is_disable: numberToBoolean(oldListing.is_disable),
    status: status,
    is_featured: numberToBoolean(oldListing.is_featured),
    helicopter_allowed: false,
    host_id: hostId,
    bedrooms: [],
    airports: [],
  };
}

// Main execution
async function main() {
  console.log(`\n🚀 Starting batch import of listings...\n`);
  console.log(`📊 Total listings in file: ${listingsStaticData.length}`);
  
  const listingsToProcess = limit ? listingsStaticData.slice(0, limit) : listingsStaticData;
  console.log(`📝 Processing: ${listingsToProcess.length} listings\n`);

  const results = [];
  const errors = [];
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < listingsToProcess.length; i++) {
    const oldListing = listingsToProcess[i];
    const listingNumber = i + 1;

    try {
      console.log(`[${listingNumber}/${listingsToProcess.length}] Processing: ${oldListing.title} (ID: ${oldListing.id})`);

      const transformedListing = transformListingData(oldListing, {
        hostId: 25,
        status: 'draft',
      });

      if (!transformedListing.title || transformedListing.title.trim() === '') {
        throw new Error('Title is required but was empty or missing');
      }

      const fullUrl = `${apiUri}/stays`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(transformedListing),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
      }

      if (response.ok && responseData) {
        const newId = responseData?.data?.id || responseData?.data?.stay?.id || responseData?.id || null;
        results.push({
          original_id: oldListing.id,
          title: oldListing.title,
          new_id: newId,
          status: 'created',
        });
        successful++;
        console.log(`  ✅ Successfully created (New ID: ${newId ?? 'unknown'})\n`);
      } else {
        const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      failed++;
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      results.push({
        original_id: oldListing.id,
        title: oldListing.title || 'Unknown Title',
        status: 'failed',
        error: errorMessage,
      });
      errors.push({
        original_id: oldListing.id,
        title: oldListing.title || 'Unknown Title',
        error: errorMessage,
      });
      console.error(`  ❌ Failed: ${errorMessage}\n`);
    }

    // Small delay between requests
    if (i < listingsToProcess.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`\n✅ Batch import completed!\n`);
  console.log(`📊 Summary:`);
  console.log(`   Total: ${listingsToProcess.length}`);
  console.log(`   Successful: ${successful}`);
  console.log(`   Failed: ${failed}\n`);

  if (errors.length > 0) {
    console.log(`❌ Errors encountered:\n`);
    errors.slice(0, 10).forEach(err => {
      console.log(`   - ${err.title} (ID: ${err.original_id}): ${err.error}`);
    });
    if (errors.length > 10) {
      console.log(`   ... and ${errors.length - 10} more errors\n`);
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

