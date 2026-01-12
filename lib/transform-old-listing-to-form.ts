/**
 * Transforms old listing data format (from listing-static-data-complete.js) to form format
 * This matches the structure expected by the stays form component
 */

import { addListingDefaultValues } from "@/constants/stays";

export interface OldListingData {
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
  no_of_bathrooms: string;
  no_of_rooms: number;
  size: number;
  unit_of_measure: string;
  description: string;
  instant_booking: number;
  nightly_price: string;
  apply_weekend_price?: string | null;
  weekend_nightly_price?: string | null;
  nightly_price_seven_plus?: string | null;
  nightly_price_thirty_plus?: string | null;
  additional_guest?: number;
  no_of_additional_guest?: number | null;
  additional_guest_price?: string | null;
  pet_allowed?: number;
  no_of_pets?: number | null;
  price_per_pet?: string | null;
  cleaning_fee?: string | null;
  cleaning_freq?: string | null;
  city_fee?: string | null;
  city_fee_freq?: string | null;
  tax_percentage: string;
  cancellation_policy_short?: any;
  cancellation_policy_long?: any;
  min_day_booking?: number | null;
  max_day_booking?: number | null;
  check_in_after?: string | null;
  check_out_before?: string | null;
  smoking_allowed?: number;
  smoking_rules?: string | null;
  party_allowed?: number;
  party_rules?: string | null;
  children_allowed?: number;
  children_rules?: string | null;
  rules_pet_allowed?: number;
  pet_rules?: string | null;
  rules?: string | null;
  welcome_message?: string | null;
  timezone?: string | null;
  helicopter_allowed?: number;
  is_disable?: number;
  is_featured?: number;
  features?: Array<{
    id?: number;
    feature_id: number;
    name?: string;
    sub_features?: Array<{
      id: number;
      feature_id?: number;
      sub_heading?: string;
      name?: string;
    }>;
  }>;
  airports?: any[];
  bedrooms?: any[];
  custom_periods?: any[];
  extra_services?: any[];
  images?: Array<{
    id: number;
    image: string;
    sort_order: number;
    description: string;
  }>;
  [key: string]: any;
}

/**
 * Converts string number to number, handling null/undefined/empty strings
 */
function stringToNumber(value: string | number | null | undefined): number | null {
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
 * Transforms old listing data to form format
 */
export function transformOldListingToFormData(
  oldListing: OldListingData,
  options: { hostId?: number } = {}
): any {
  const hostId = options.hostId ?? 25;

  // Transform images to form format (keep URLs - they'll be displayed in form)
  const transformedImages =
    oldListing.images?.map((img: any, index: number) => ({
      uid: img.id?.toString() || `-${index}`,
      name: img.image?.split("/").pop() || `image-${index}`,
      status: "done" as const,
      url: img.image, // Full URL - form will display this
      image: img.image, // Keep same for compatibility
      description: img.description || "",
      sort_order: img.sort_order ?? index,
      file_name: img.image?.split("/").pop(),
    })) || [];

  // Transform features
  const transformedFeatures =
    oldListing.features?.map((feature: any) => {
      const subFeatureIds =
        feature.sub_features?.map((sf: any) => sf.id || sf.sub_heading) || [];
      return {
        feature_id: feature.feature_id || feature.id,
        feature_name: feature.name || feature.heading,
        sub_features: subFeatureIds,
        available_sub_features: feature.sub_features || [],
      };
    }) || [];

  // Transform airports
  const transformedAirports =
    oldListing.airports?.map((airport: any) => {
      // Parse JSON strings for fuel and surface
      let fuel = [];
      let surface = [];
      try {
        fuel =
          typeof airport.fuel === "string"
            ? JSON.parse(airport.fuel)
            : airport.fuel || [];
        surface =
          typeof airport.surface === "string"
            ? JSON.parse(airport.surface)
            : airport.surface || [];
      } catch {
        fuel = airport.fuel || [];
        surface = airport.surface || [];
      }

      return {
        identifier: airport.airport_identifier || airport.identifier || null,
        name: airport.airport_name || airport.name || null,
        use: airport.airport_use || airport.use || null,
        operation_hours: airport.operation_hours || {
          monday: { open: null, close: null },
          tuesday: { open: null, close: null },
          wednesday: { open: null, close: null },
          thursday: { open: null, close: null },
          friday: { open: null, close: null },
          saturday: { open: null, close: null },
          sunday: { open: null, close: null },
        },
        lighting: numberToBoolean(airport.lighting),
        ctaf_unicom: airport.ctaf_unicom || null,
        fuel: fuel,
        surface: surface,
        parking: airport.parking || null,
        orientation: airport.orientation || null,
        runway_condition: airport.runway_condition || null,
        pattern: airport.pattern || null,
        distance_from_runway: airport.distance_from_runway || null,
        air_nav: airport.air_nav || null,
        ground_transportation: airport.ground_transportation || null,
        additional_info: airport.additional_info || null,
        helicopter_allowed: numberToBoolean(airport.helicopter_allowed),
        dimension_length: stringToNumber(
          airport.dimension_feets?.split("X")[0] || airport.dimension_length
        ),
        dimension_width: stringToNumber(
          airport.dimension_feets?.split("X")[1] || airport.dimension_width
        ),
        elevation_start: stringToNumber(
          airport.elevation_feets?.split("-")[0] || airport.elevation_start
        ),
        elevation_end: stringToNumber(
          airport.elevation_feets?.split("-")[1] || airport.elevation_end
        ),
      };
    }) || [];

  // Transform cancellation policies - extract ID if object
  const cancellationPolicyShortId =
    typeof oldListing.cancellation_policy_short === "object"
      ? oldListing.cancellation_policy_short?.id
      : oldListing.cancellation_policy_short || null;

  const cancellationPolicyLongId =
    typeof oldListing.cancellation_policy_long === "object"
      ? oldListing.cancellation_policy_long?.id
      : oldListing.cancellation_policy_long || null;

  // Handle apply_weekend_price - convert "None" to null, "Yes" to "yes", etc.
  const applyWeekendPrice =
    oldListing.apply_weekend_price === "None" ||
    !oldListing.apply_weekend_price
      ? null
      : oldListing.apply_weekend_price;

  // Handle age restrictions - convert individual ages to arrays
  const childStartAge = (oldListing as any).child_start_age ?? 5;
  const childEndAge = (oldListing as any).child_end_age ?? 15;
  const infantStartAge = (oldListing as any).infant_start_age ?? 0;
  const infantEndAge = (oldListing as any).infant_end_age ?? 24;

  // Build form data
  const formData: any = {
    ...addListingDefaultValues,
    // Basic Information
    listing_type: oldListing.listing_type || "short-term rental",
    address: oldListing.address ?? null,
    unit_no: oldListing.unit_no ?? null,
    country: oldListing.country ?? null,
    state: oldListing.state ?? null,
    city: oldListing.city ?? null,
    zipcode: oldListing.zipcode ?? null,
    area: oldListing.area ?? null,
    latitude: stringToNumber(oldListing.latitude),
    longitude: stringToNumber(oldListing.longitude),
    timezone: oldListing.timezone ?? null,

    // Space & Lodging
    type_of_space: oldListing.type_of_space ?? null,
    lodging_type: oldListing.lodging_type ?? null,
    title: oldListing.title ?? null,
    floor_number: null,

    // Capacity
    no_of_guest: oldListing.no_of_guest ?? null,
    no_of_bedrooms: oldListing.no_of_bedrooms ?? null,
    no_of_beds: oldListing.no_of_beds ?? null,
    no_of_bathrooms: stringToNumber(oldListing.no_of_bathrooms),
    no_of_rooms: oldListing.no_of_rooms ?? null,
    size: oldListing.size ?? null,
    unit_of_measure: oldListing.unit_of_measure || "ft",

    // Description
    description: oldListing.description ?? null,

    // Pricing
    instant_booking: numberToBoolean(oldListing.instant_booking),
    nightly_price: stringToNumber(oldListing.nightly_price),
    apply_weekend_price: applyWeekendPrice,
    weekend_nightly_price: stringToNumber(oldListing.weekend_nightly_price),
    nightly_price_seven_plus: stringToNumber(oldListing.nightly_price_seven_plus),
    nightly_price_thirty_plus: stringToNumber(
      oldListing.nightly_price_thirty_plus
    ),

    // Additional Guests
    additional_guest: numberToBoolean(oldListing.additional_guest),
    no_of_additional_guest: oldListing.no_of_additional_guest ?? null,
    additional_guest_price: stringToNumber(oldListing.additional_guest_price),

    // Pets
    pet_allowed: numberToBoolean(oldListing.pet_allowed),
    no_of_pets: oldListing.no_of_pets ?? null,
    price_per_pet: stringToNumber(oldListing.price_per_pet),

    // Fees
    cleaning_fee: stringToNumber(oldListing.cleaning_fee),
    cleaning_freq: oldListing.cleaning_freq || "Per stay",
    city_fee: stringToNumber(oldListing.city_fee),
    city_fee_freq: oldListing.city_fee_freq || "Per stay",
    tax_percentage: stringToNumber(oldListing.tax_percentage),

    // Custom Periods
    custom_period_pricing: (oldListing.custom_periods?.length || 0) > 0,
    custom_periods: oldListing.custom_periods || [],

    // Extra Services
    extra_service: (oldListing.extra_services?.length || 0) > 0,
    extra_services: oldListing.extra_services || [],

    // Features - transformed
    features: transformedFeatures,

    // Cancellation Policies
    cancellation_policy_short: cancellationPolicyShortId,
    cancellation_policy_long: cancellationPolicyLongId,

    // Booking Rules
    min_day_booking: oldListing.min_day_booking ?? null,
    max_day_booking: oldListing.max_day_booking ?? null,
    check_in_after: oldListing.check_in_after ?? null,
    check_out_before: oldListing.check_out_before ?? null,

    // Rules & Restrictions
    smoking_allowed: numberToBoolean(oldListing.smoking_allowed),
    smoking_rules: oldListing.smoking_rules ?? null,
    party_allowed: numberToBoolean(oldListing.party_allowed),
    party_rules: oldListing.party_rules ?? null,
    children_allowed: numberToBoolean(oldListing.children_allowed),
    children_rules: oldListing.children_rules ?? null,
    rules_pet_allowed: numberToBoolean(oldListing.rules_pet_allowed),
    pet_rules: oldListing.pet_rules ?? null,
    rules: oldListing.rules ?? null,
    rules_instructions: null,

    // Age Restrictions - convert individual ages to arrays
    children_ages: [childStartAge, childEndAge],
    infant_ages: [infantStartAge, infantEndAge],

    // Welcome Messages
    welcome_message: oldListing.welcome_message ?? null,
    welcome_message_instructions: null,

    // Status
    is_disable: numberToBoolean(oldListing.is_disable),
    is_featured: numberToBoolean(oldListing.is_featured),
    helicopter_allowed: numberToBoolean(oldListing.helicopter_allowed),

    // Host
    host_id: hostId,

    // Complex fields
    bedrooms: oldListing.bedrooms || [],
    airports: transformedAirports.length > 0 ? transformedAirports : [],

    // Images - transformed (keep URLs for display)
    images: transformedImages,
  };

  return formData;
}
