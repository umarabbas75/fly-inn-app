/**
 * Transformation utility to convert old listing data format to new schema
 */

interface OldListingData {
  id: number;
  host_id: number;
  listing_type: string;
  address: string | null;
  unit_no: string | null;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  area: string | null;
  latitude: string;
  longitude: string;
  type_of_space: string;
  lodging_type: string;
  title: string;
  no_of_guest: number;
  no_of_bedrooms: number;
  no_of_beds: number;
  no_of_bathrooms: string; // e.g., "1.00"
  no_of_rooms: number;
  size: number;
  unit_of_measure: string;
  description: string;
  instant_booking: number; // 0 or 1
  nightly_price: string; // e.g., "150.00"
  tax_percentage: string; // e.g., "0.00"
  is_featured?: number; // 0 or 1
  is_disable?: number; // 0 or 1
  status?: string;
  [key: string]: any; // For other fields we might not use
}

interface NewListingData {
  listing_type: string;
  address: string | null;
  unit_no: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zipcode: string | null;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  type_of_space: string | null;
  lodging_type: string | null;
  title: string | null;
  floor_number?: number | null;
  no_of_guest: number | null;
  no_of_bedrooms: number | null;
  no_of_beds: number | null;
  no_of_bathrooms: number | null;
  no_of_rooms: number | null;
  size: number | null;
  unit_of_measure: string;
  description: string | null;
  instant_booking: boolean;
  nightly_price: number | null;
  apply_weekend_price?: string | null;
  weekend_nightly_price?: number | null;
  nightly_price_seven_plus?: number | null;
  nightly_price_thirty_plus?: number | null;
  additional_guest: boolean;
  no_of_additional_guest?: number | null;
  additional_guest_price?: number | null;
  pet_allowed: boolean;
  no_of_pets?: number | null;
  price_per_pet?: number | null;
  cleaning_fee?: number | null;
  cleaning_freq?: string;
  city_fee?: number | null;
  city_fee_freq?: string;
  tax_percentage: number | null;
  custom_period_pricing: boolean;
  custom_periods: any[];
  extra_service: boolean;
  extra_services: any[];
  features: any[];
  cancellation_policy_short?: string | null;
  cancellation_policy_long?: string | null;
  min_day_booking?: number | null;
  max_day_booking?: number | null;
  check_in_after?: string | null;
  check_out_before?: string | null;
  smoking_allowed: boolean;
  smoking_rules?: string | null;
  party_allowed: boolean;
  party_rules?: string | null;
  children_allowed: boolean;
  children_rules?: string | null;
  rules_pet_allowed: boolean;
  pet_rules?: string | null;
  rules?: string | null;
  rules_instructions?: string | null;
  children_ages?: number[];
  infant_ages?: number[];
  welcome_message?: string | null;
  welcome_message_instructions?: string | null;
  is_disable: boolean;
  status: string;
  is_featured: boolean;
  helicopter_allowed?: boolean;
  host_id: number;
  bedrooms: any[];
  airports: any[];
}

/**
 * Converts a string number to a number, handling null/undefined/empty strings
 */
function stringToNumber(
  value: string | number | null | undefined
): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Converts 0/1 to boolean
 */
function numberToBoolean(value: number | boolean | null | undefined): boolean {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined) return false;
  return value === 1 || value === true;
}

/**
 * Transforms old listing data format to new schema format
 */
export function transformListingData(
  oldListing: OldListingData,
  options: { hostId?: number; status?: string } = {}
): NewListingData {
  const hostId = options.hostId ?? 25;
  const status = options.status ?? "draft";

  // Transform the data
  const newListing: NewListingData = {
    // Basic Information - direct mappings with type conversions
    listing_type: oldListing.listing_type ?? "short-term rental",
    address: oldListing.address ?? null,
    unit_no: oldListing.unit_no ?? null,
    country: oldListing.country ?? null,
    state: oldListing.state ?? null,
    city: oldListing.city ?? null,
    zipcode: oldListing.zipcode ?? null,
    area: oldListing.area ?? null,
    latitude: stringToNumber(oldListing.latitude),
    longitude: stringToNumber(oldListing.longitude),
    timezone: null, // Not in old data, can be inferred later if needed

    // Space & Lodging
    type_of_space: oldListing.type_of_space ?? null,
    lodging_type: oldListing.lodging_type ?? null,
    title: oldListing.title ?? null,
    floor_number: null, // Not in old data

    // Capacity
    no_of_guest: oldListing.no_of_guest ?? null,
    no_of_bedrooms: oldListing.no_of_bedrooms ?? null,
    no_of_beds: oldListing.no_of_beds ?? null,
    no_of_bathrooms: stringToNumber(oldListing.no_of_bathrooms),
    no_of_rooms: oldListing.no_of_rooms ?? null,
    size: oldListing.size ?? null,
    unit_of_measure: oldListing.unit_of_measure ?? "ft",

    // Description
    description: oldListing.description ?? null,

    // Pricing
    instant_booking: numberToBoolean(oldListing.instant_booking),
    nightly_price: stringToNumber(oldListing.nightly_price),
    apply_weekend_price: null, // Not in old data
    weekend_nightly_price: null, // Not in old data
    nightly_price_seven_plus: null, // Not in old data
    nightly_price_thirty_plus: null, // Not in old data

    // Additional Guests - defaults
    additional_guest: false,
    no_of_additional_guest: null,
    additional_guest_price: null,

    // Pets - defaults
    pet_allowed: false,
    no_of_pets: null,
    price_per_pet: null,

    // Fees
    cleaning_fee: null, // Not in old data
    cleaning_freq: "Per stay", // Default
    city_fee: null, // Not in old data
    city_fee_freq: "Per stay", // Default
    tax_percentage: stringToNumber(oldListing.tax_percentage),

    // Custom Periods - defaults
    custom_period_pricing: false,
    custom_periods: [],

    // Extra Services - defaults
    extra_service: false,
    extra_services: [],

    // Features - defaults
    features: [],

    // Cancellation Policies - not in old data
    cancellation_policy_short: null,
    cancellation_policy_long: null,

    // Booking Rules - not in old data
    min_day_booking: null,
    max_day_booking: null,
    check_in_after: null,
    check_out_before: null,

    // Rules & Restrictions - defaults
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

    // Age Restrictions - defaults
    children_ages: [5, 15],
    infant_ages: [5, 15],

    // Welcome Messages - not in old data
    welcome_message: null,
    welcome_message_instructions: null,

    // Status
    is_disable: numberToBoolean(oldListing.is_disable),
    status: status,
    is_featured: numberToBoolean(oldListing.is_featured),
    helicopter_allowed: false, // Not in old data

    // Host
    host_id: hostId,

    // Complex fields - empty arrays
    bedrooms: [],
    airports: [],
  };

  // Remove null/undefined values (but preserve false, 0, and empty strings)
  // Note: We'll keep null values as the backend might need them
  // Instead, we'll clean up undefined values only
  Object.keys(newListing).forEach((key) => {
    if (newListing[key as keyof NewListingData] === undefined) {
      delete newListing[key as keyof NewListingData];
    }
  });

  return newListing;
}
