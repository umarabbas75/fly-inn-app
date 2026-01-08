/**
 * Stay Form Progress Tracking Utility
 * Tracks completion of required fields based on conditional logic
 */

export interface FormProgress {
  totalFields: number;
  completedFields: number;
  percentage: number;
  incompleteFields: string[];
  completedFieldsList: string[];
}

/**
 * Check if a value is filled/completed
 */
const isValueFilled = (value: any): boolean => {
  if (value === null || value === undefined || value === "") return false;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return false;
    // Check for empty HTML
    if (trimmed === "<p><br></p>" || trimmed === "<p></p>") return false;
    const stripped = trimmed.replace(/<[^>]*>/g, "").trim();
    return stripped.length > 0;
  }

  if (typeof value === "number") return true;

  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    // Check if array has meaningful data
    if (typeof value[0] === "object") {
      return value.some((item) => {
        if (!item) return false;
        const values = Object.values(item);
        return values.some((v) => isValueFilled(v));
      });
    }
    return true;
  }

  if (typeof value === "object") {
    const values = Object.values(value);
    return values.some((v) => isValueFilled(v));
  }

  return false;
};

/**
 * Check if operation hours are complete
 */
const areOperationHoursComplete = (hours: any): boolean => {
  if (!hours || typeof hours !== "object") return false;

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return days.every((day) => {
    const dayHours = hours[day];
    return (
      dayHours && isValueFilled(dayHours.open) && isValueFilled(dayHours.close)
    );
  });
};

/**
 * Check if at least one airport is complete
 */
const isAirportComplete = (airport: any): boolean => {
  if (!airport) return false;

  const requiredFields = [
    "identifier",
    "name",
    "use",
    "ctaf_unicom",
    "parking",
    "pattern",
    "distance_from_runway",
    "ground_transportation",
    "dimension_length",
    "dimension_width",
    "elevation_start",
    "elevation_end",
  ];

  // Check required fields
  const allFieldsFilled = requiredFields.every((field) =>
    isValueFilled(airport[field])
  );

  // Check operation hours
  const operationHoursComplete = areOperationHoursComplete(
    airport.operation_hours
  );

  // Check arrays (fuel and surface must have at least one item)
  const fuelComplete = Array.isArray(airport.fuel) && airport.fuel.length > 0;
  const surfaceComplete =
    Array.isArray(airport.surface) && airport.surface.length > 0;

  // Check if "other" fuel is selected, then other_fuel_name is required
  const hasOtherFuel =
    Array.isArray(airport.fuel) && airport.fuel.includes("other");
  const otherFuelNameComplete = hasOtherFuel
    ? isValueFilled(airport.other_fuel_name)
    : true;

  // Check if "Other" surface is selected, then other_runway_type is required
  const hasOtherSurface =
    Array.isArray(airport.surface) && airport.surface.includes("Other");
  const otherRunwayTypeComplete = hasOtherSurface
    ? isValueFilled(airport.other_runway_type)
    : true;

  return (
    allFieldsFilled &&
    operationHoursComplete &&
    fuelComplete &&
    surfaceComplete &&
    otherFuelNameComplete &&
    otherRunwayTypeComplete
  );
};

/**
 * Check if custom period is complete
 */
const isCustomPeriodComplete = (period: any): boolean => {
  if (!period) return false;

  // Check all required fields are filled
  const allFieldsFilled =
    isValueFilled(period.start_date) &&
    isValueFilled(period.end_date) &&
    isValueFilled(period.nightly_price) &&
    isValueFilled(period.price_add_guest);

  // Check that end_date is after start_date
  const datesValid =
    period.start_date &&
    period.end_date &&
    new Date(period.end_date) > new Date(period.start_date);

  return allFieldsFilled && datesValid;
};

/**
 * Check if extra service is complete
 */
const isExtraServiceComplete = (service: any): boolean => {
  if (!service) return false;
  return (
    isValueFilled(service.name) &&
    isValueFilled(service.price) &&
    isValueFilled(service.type) &&
    isValueFilled(service.quantity)
  );
};

/**
 * Check if feature is complete
 */
const isFeatureComplete = (feature: any): boolean => {
  if (!feature) return false;
  return (
    isValueFilled(feature.feature_id) &&
    Array.isArray(feature.sub_features) &&
    feature.sub_features.length > 0
  );
};

/**
 * Calculate form progress
 */
export const calculateFormProgress = (formValues: any): FormProgress => {
  const completed: string[] = [];
  const incomplete: string[] = [];

  // Helper to track field
  const trackField = (fieldName: string, isComplete: boolean) => {
    if (isComplete) {
      completed.push(fieldName);
    } else {
      incomplete.push(fieldName);
    }
  };

  // 1. Always Required Fields
  trackField("Listing Type", isValueFilled(formValues.listing_type));
  trackField("Address", isValueFilled(formValues.address));
  trackField("City", isValueFilled(formValues.city));
  trackField("State", isValueFilled(formValues.state));
  trackField("ZIP Code", isValueFilled(formValues.zipcode));
  trackField("Country", isValueFilled(formValues.country));
  trackField("Longitude", isValueFilled(formValues.longitude));
  trackField("Latitude", isValueFilled(formValues.latitude));

  // 2. Images - at least one
  const hasImages =
    Array.isArray(formValues.images) && formValues.images.length > 0;
  trackField("Property Images (at least 1)", hasImages);

  // 3. Property Details
  trackField("Space Type", isValueFilled(formValues.type_of_space));
  trackField("Lodging Type", isValueFilled(formValues.lodging_type));
  trackField("Property Title", isValueFilled(formValues.title));
  trackField("Number of Guests", isValueFilled(formValues.no_of_guest));
  trackField("Number of Bedrooms", isValueFilled(formValues.no_of_bedrooms));
  trackField("Number of Beds", isValueFilled(formValues.no_of_beds));
  trackField("Number of Bathrooms", isValueFilled(formValues.no_of_bathrooms));
  trackField("Number of Rooms", isValueFilled(formValues.no_of_rooms));
  trackField("Property Size", isValueFilled(formValues.size));
  trackField("Description", isValueFilled(formValues.description));

  // Floor number - required for hotel rooms
  if (
    formValues.lodging_type === "hotel_room" ||
    formValues.lodging_type === "apt_condo_loft" ||
    formValues.lodging_type === "bed_breakfast"
  ) {
    trackField("Floor Number", isValueFilled(formValues.floor_number));
  }

  // 4. Airports - at least one complete airport
  const hasCompleteAirport =
    Array.isArray(formValues.airports) &&
    formValues.airports.some((airport: any) => isAirportComplete(airport));
  trackField("Airport Information (at least 1 complete)", hasCompleteAirport);

  // 5. Pricing - Always Required
  trackField("Nightly Price", isValueFilled(formValues.nightly_price));
  trackField("Cleaning Fee", isValueFilled(formValues.cleaning_fee));
  trackField("Tax Percentage", isValueFilled(formValues.tax_percentage));

  // 6. Weekend Pricing - Conditional
  const weekendPricingEnabled = isValueFilled(formValues.apply_weekend_price);
  if (weekendPricingEnabled) {
    trackField(
      "Weekend Nightly Price",
      isValueFilled(formValues.weekend_nightly_price)
    );
  }

  // 7. Additional Guests - Conditional
  if (formValues.additional_guest === true) {
    trackField(
      "Number of Additional Guests",
      isValueFilled(formValues.no_of_additional_guest)
    );
    trackField(
      "Additional Guest Price",
      isValueFilled(formValues.additional_guest_price)
    );
  }

  // 8. Pets - Conditional
  if (formValues.pet_allowed === true) {
    trackField("Number of Pets", isValueFilled(formValues.no_of_pets));
    trackField("Price Per Pet", isValueFilled(formValues.price_per_pet));
  }

  // 9. Custom Period Pricing - Conditional
  if (formValues.custom_period_pricing === true) {
    const hasCompleteCustomPeriod =
      Array.isArray(formValues.custom_periods) &&
      formValues.custom_periods.length > 0 &&
      formValues.custom_periods.every((period: any) =>
        isCustomPeriodComplete(period)
      );
    trackField(
      "Custom Pricing Periods (at least 1 complete)",
      hasCompleteCustomPeriod
    );
  }

  // 10. Extra Services - Conditional
  if (formValues.extra_service === true) {
    const hasCompleteExtraService =
      Array.isArray(formValues.extra_services) &&
      formValues.extra_services.length > 0 &&
      formValues.extra_services.every((service: any) =>
        isExtraServiceComplete(service)
      );
    trackField("Extra Services (at least 1 complete)", hasCompleteExtraService);
  }

  // 11. Features - at least one with sub-features
  const hasCompleteFeatures =
    Array.isArray(formValues.features) &&
    formValues.features.length > 0 &&
    formValues.features.some((feature: any) => isFeatureComplete(feature));
  trackField("Features & Amenities (at least 1)", hasCompleteFeatures);

  // 12. Cancellation Policies
  trackField(
    "Short-term Cancellation Policy",
    isValueFilled(formValues.cancellation_policy_short)
  );
  trackField(
    "Long-term Cancellation Policy",
    isValueFilled(formValues.cancellation_policy_long)
  );

  // 13. Booking Rules
  trackField("Minimum Days", isValueFilled(formValues.min_day_booking));
  trackField("Maximum Days", isValueFilled(formValues.max_day_booking));
  trackField("Check-in Time", isValueFilled(formValues.check_in_after));
  trackField("Check-out Time", isValueFilled(formValues.check_out_before));

  // 14. House Rules - Conditional
  if (formValues.smoking_allowed === true) {
    trackField("Smoking Rules", isValueFilled(formValues.smoking_rules));
  }

  if (formValues.rules_pet_allowed === true) {
    trackField("Pet Rules", isValueFilled(formValues.pet_rules));
  }

  if (formValues.party_allowed === true) {
    trackField("Party Rules", isValueFilled(formValues.party_rules));
  }

  if (formValues.children_allowed === true) {
    trackField("Children Rules", isValueFilled(formValues.children_rules));
  }

  // 15. Children & Infant Ages
  //   trackField("Children Age Range", isValueFilled(formValues.children_ages));
  //   trackField("Infant Age Range", isValueFilled(formValues.infant_ages));

  // 16. Instructions & Messages

  trackField("House Rules", isValueFilled(formValues.rules));

  trackField("Welcome Message", isValueFilled(formValues.welcome_message));

  // Calculate percentage
  const totalFields = completed.length + incomplete.length;
  const percentage =
    totalFields > 0 ? Math.round((completed.length / totalFields) * 100) : 0;

  return {
    totalFields,
    completedFields: completed.length,
    percentage,
    incompleteFields: incomplete,
    completedFieldsList: completed,
  };
};

/**
 * Get progress badge color
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage === 100) return "green";
  if (percentage >= 75) return "blue";
  if (percentage >= 50) return "orange";
  if (percentage >= 25) return "gold";
  return "red";
};

/**
 * Get progress status text
 */
export const getProgressStatus = (percentage: number): string => {
  if (percentage === 100) return "Complete";
  if (percentage >= 75) return "Almost there";
  if (percentage >= 50) return "Halfway done";
  if (percentage >= 25) return "Getting started";
  return "Just started";
};
