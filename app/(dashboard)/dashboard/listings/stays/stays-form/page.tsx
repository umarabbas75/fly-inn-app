"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Button, Tabs } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, usePathname } from "next/navigation";
import { useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import * as yup from "yup";
import ListingFormFields from "./_components/ListingFormFields";
import LocationFormFields from "./_components/LocationFormFields";
import ImagesForm from "./_components/ImagesForm";
import InformationFields from "./_components/InformationFields";
import BedroomFields from "./_components/BedroomFields";
import AirportInformationFields from "./_components/AirportInformationFields";
import PricingInformationFields from "./_components/PricingInformationFields";
import ExtraServices from "./_components/ExtraServices";
import Features from "./_components/Features";
import TermsAndRules from "./_components/TermsAndRules";
import BlockedDateCalender, {
  BlockedDateCalenderRef,
} from "./_components/BlockedDateCalender";
import { BlockedDateRange } from "@/components/shared/calendar";
import { FormProgressIndicator } from "./_components/FormProgressIndicator";
import {
  addListingDefaultValues,
  addListingValidationSchema,
} from "@/constants/stays";
import { calculateFormProgress } from "@/utils/stay-form-progress";
import { expandBlockedDateRangesWithSource } from "@/utils/timezone";

interface StaysFormProps {
  stayId?: string;
  initialData?: any;
  showHostSelector?: boolean;
}

const StaysForm: React.FC<StaysFormProps> = ({
  stayId,
  initialData,
  showHostSelector = false,
}) => {
  const isEditMode = !!stayId;
  const [activeTab, setActiveTab] = useState("property-details");
  const router = useRouter();
  const pathname = usePathname();
  const { message: appMessage } = useApp();

  // Determine if we're in admin mode based on showHostSelector prop or current path
  const isAdminMode =
    showHostSelector || pathname?.includes("/admin-dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const calendarRef = useRef<BlockedDateCalenderRef>(null);
  const [blockedDateRanges, setBlockedDateRanges] = useState<
    BlockedDateRange[]
  >([]);
  const [initialBlockedDates, setInitialBlockedDates] = useState<
    string[] | Map<string, string>
  >([]);
  const [titleRequiredModalVisible, setTitleRequiredModalVisible] =
    useState(false);

  // Create form with validation
  const methods = useForm({
    mode: "onChange",
    defaultValues: addListingDefaultValues,
    resolver: yupResolver(addListingValidationSchema) as any,
  });

  const {
    handleSubmit,
    getValues,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;

  // Transform backend data to form format
  const transformBackendDataToForm = useCallback((data: any) => {
    if (!data) return null;

    // Transform features from backend format to form format
    const transformedFeatures =
      data.features?.map((feature: any) => {
        // Backend sends sub_features with {id, name}
        // Form needs: feature_id, feature_name, sub_features (array of IDs), available_sub_features (full objects)
        const subFeatureObjects = feature.sub_features || [];
        const selectedSubFeatureIds = subFeatureObjects.map((sf: any) => sf.id);

        return {
          feature_id: feature.id || feature.feature_id,
          feature_name: feature.heading,
          sub_features: selectedSubFeatureIds, // Array of selected sub-feature IDs
          available_sub_features: subFeatureObjects, // Full sub-feature objects for display
        };
      }) || [];

    // Transform images from backend format
    // Backend format: { id, url, image, description, file_name, sort_order, created_at, updated_at }
    const transformedImages =
      data.images?.map((img: any, index: number) => ({
        id: img.id, // Keep backend ID
        uid: img.id || `-${index}`,
        name: img.file_name || img.url?.split("/").pop() || `image-${index}`,
        status: "done",
        url: img.url || img.image, // Use url (full URL) or fallback to image path
        image: img.image, // Keep relative path
        description: img.description || "",
        sort_order: img.sort_order ?? index, // Use sort_order from backend
        file_name: img.file_name, // Keep file_name
      })) || [];

    // Transform custom periods - convert ISO dates to YYYY-MM-DD format
    const transformedCustomPeriods =
      data.custom_periods?.map((period: any) => ({
        ...period,
        start_date: period.start_date
          ? new Date(period.start_date).toISOString().split("T")[0]
          : null,
        end_date: period.end_date
          ? new Date(period.end_date).toISOString().split("T")[0]
          : null,
      })) || [];

    // Transform blocked dates from range format to Map with source preserved
    // Backend sends: [{ start_date, end_date, source }]
    // Calendar needs: Map { "2025-11-05" => "airbnb", ... }
    const transformedBlockedDates =
      data.blocked_dates && data.blocked_dates.length > 0
        ? expandBlockedDateRangesWithSource(data.blocked_dates)
        : new Map<string, string>();

    return {
      ...addListingDefaultValues,
      ...data,
      // Map backend fields to form fields
      listing_type: data.listing_type || "short-term rental",
      lodging_type: data.lodging_type,
      title: data.title,
      type_of_space: data.type_of_space,
      floor_number: data.floor_number,
      latitude: data.latitude || data.lat,
      longitude: data.longitude || data.lng,
      additional_guest: data.additional_guest || data.additional_guest,
      features: transformedFeatures,
      images: transformedImages,
      custom_period_pricing: data?.custom_periods?.length > 0 ? true : false,
      // Ensure arrays are properly set
      bedrooms: data.bedrooms || [],
      airports: data.airports || [],
      blocked_dates: transformedBlockedDates,
      extra_service: data.extra_services?.length > 0 ? true : false,
      extra_services: data.extra_services || [],
      custom_periods: transformedCustomPeriods,
      // Transform cancellation policies - extract IDs from objects
      cancellation_policy_short:
        typeof data.cancellation_policy_short === "object"
          ? data.cancellation_policy_short?.id
          : data.cancellation_policy_short,
      cancellation_policy_long:
        typeof data.cancellation_policy_long === "object"
          ? data.cancellation_policy_long?.id
          : data.cancellation_policy_long,
      // Map host_id - could be host_id or host.id
      host_id: data.host_id || data.host?.id || data.created_by_id || null,
    };
  }, []);

  // Load initial data when in edit mode or duplicate mode
  useEffect(() => {
    if (initialData) {
      const formData = transformBackendDataToForm(initialData);
      if (formData) {
        reset(formData);
        // Set the transformed blocked dates for the calendar (Map with sources)
        if (formData.blocked_dates && formData.blocked_dates.size > 0) {
          setInitialBlockedDates(formData.blocked_dates);
        }
        console.log("Form populated with data:", formData);
      }
    }
  }, [initialData, reset, transformBackendDataToForm]);

  // Watch all form values for progress calculation
  const formValues = useWatch({ control });

  // Calculate form progress
  const formProgress = useMemo(() => {
    return calculateFormProgress(formValues || {});
  }, [formValues]);

  // Function to upload images with descriptions and sort orders (for create mode)
  const uploadImagesWithMetadata = useCallback(
    async (stayId: string, images: any[]) => {
      try {
        const imagesWithFiles = images?.filter(
          (item: any) => item?.file instanceof File
        );

        if (!imagesWithFiles || imagesWithFiles.length === 0) {
          return { success: true, message: "No images to upload" };
        }

        const formData = new FormData();

        // Add images with descriptions and sort orders
        imagesWithFiles.forEach((img: any, index: number) => {
          if (img.file instanceof File) {
            formData.append("images", img.file);
            formData.append(
              `image_descriptions[${index}]`,
              img.description || ""
            );
            formData.append(
              `image_sort_orders[${index}]`,
              String(img.sort_order ?? index)
            );
          }
        });

        // Upload images to the stay
        const response = await fetch(`/api/stays/${stayId}/images`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: "Failed to upload images",
          }));
          throw new Error(errorData.message || "Failed to upload images");
        }

        const data = await response.json();
        return {
          success: true,
          message: data.message || "Images uploaded successfully",
          data: data.data,
        };
      } catch (error: any) {
        console.error("Image upload error:", error);
        return {
          success: false,
          message: error.message || "Failed to upload images",
        };
      }
    },
    []
  );

  // Function to update images in edit mode
  const updateImages = useCallback(
    async (stayId: string, images: any[], initialImages: any[]) => {
      try {
        const formData = new FormData();

        // Separate images into: new, existing (updated), and deleted
        const existingImageIds = new Set(
          (initialImages || []).map((img: any) => img.id)
        );
        const currentImageIds = new Set(
          images
            .filter((img: any) => img.id && !img.file)
            .map((img: any) => img.id)
        );

        // Find new images (have file but no id)
        const newImages = images.filter(
          (img: any) => img.file instanceof File && !img.id
        );

        // Find deleted images (in initial but not in current)
        const deletedImageIds = Array.from(existingImageIds).filter(
          (id) => !currentImageIds.has(id)
        );

        // Always send ALL existing images with their current sort_order and description
        // This simplifies the logic - no need to detect changes, just send current state
        const updatedImages = images
          .filter((img: any) => img.id && !img.file)
          .map((img: any) => ({
            id: img.id,
            description: img.description || "",
            sort_order: img.sort_order ?? 0,
          }));

        // Add new images
        if (newImages.length > 0) {
          newImages.forEach((img: any, index: number) => {
            if (img.file instanceof File) {
              formData.append("new_images", img.file);
              formData.append(
                `new_image_descriptions[${index}]`,
                img.description || ""
              );
              // Use the sort_order from the image object - it's already set correctly by moveImage
              // when images are reordered, added, or deleted
              formData.append(
                `new_image_sort_orders[${index}]`,
                String(img.sort_order ?? 0)
              );
            }
          });
        }

        // Add image updates as individual form fields
        // Always send all existing images - backend will handle what changed
        console.log("Sending image_updates as form fields:", updatedImages);
        updatedImages.forEach((update: any, index: number) => {
          formData.append(`image_updates[${index}][id]`, String(update.id));
          formData.append(
            `image_updates[${index}][description]`,
            update.description || ""
          );
          formData.append(
            `image_updates[${index}][sort_order]`,
            String(update.sort_order)
          );
        });

        // Debug: Log what's actually in FormData
        console.log("FormData entries for image_updates:");
        Array.from(formData.entries()).forEach(([key, value]) => {
          if (key.startsWith("image_updates")) {
            console.log(`  ${key}:`, value);
          }
        });

        // Add deleted image IDs as individual form fields
        if (deletedImageIds.length > 0) {
          deletedImageIds.forEach((id: any, index: number) => {
            formData.append(`deleted_image_ids[${index}]`, String(id));
          });
        }

        // If no changes, return early
        if (
          newImages.length === 0 &&
          updatedImages.length === 0 &&
          deletedImageIds.length === 0
        ) {
          return { success: true, message: "No image changes to update" };
        }

        // Verify FormData is correct before sending
        console.log("FormData verification before PATCH request:");
        const formDataEntries: string[] = [];
        Array.from(formData.entries()).forEach(([key, value]) => {
          formDataEntries.push(
            `${key}: ${value instanceof File ? `[File: ${value.name}]` : value}`
          );
        });
        console.log("All FormData entries:", formDataEntries);

        // Ensure we're NOT sending JSON string for image_updates
        const imageUpdatesKeys = formDataEntries.filter((e) =>
          e.startsWith("image_updates")
        );
        if (imageUpdatesKeys.length === 0 && updatedImages.length > 0) {
          console.error("ERROR: image_updates not found in FormData!");
        }
        if (imageUpdatesKeys.some((k) => k.includes("[{"))) {
          console.error(
            "ERROR: image_updates appears to be JSON string instead of form fields!"
          );
        }

        // Update images
        const response = await fetch(`/api/stays/${stayId}/images`, {
          method: "PATCH",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: "Failed to update images",
          }));
          throw new Error(errorData.message || "Failed to update images");
        }

        const data = await response.json();
        return {
          success: true,
          message: data.message || "Images updated successfully",
          data: data.data,
        };
      } catch (error: any) {
        console.error("Image update error:", error);
        return {
          success: false,
          message: error.message || "Failed to update images",
        };
      }
    },
    []
  );

  // API mutation for updating blocked dates (edit mode only)
  const { mutate: updateBlockedDates, isPending: updatingBlockedDates } =
    useApiMutation({
      endpoint: `/api/stays/${stayId}/blocked-dates`,
      method: "patch",
      config: {
        onSuccess: () => {
          appMessage.success("Blocked dates updated successfully!");
          setIsSubmitting(false);
        },
        onError: (err) => {
          console.log({ err });
          setIsSubmitting(false);
          appMessage.error(
            err?.response?.data?.message || "Failed to update blocked dates"
          );
        },
      },
    });

  // API mutation for updating images in edit mode
  const { mutate: updateImagesMutation } = useApiMutation({
    endpoint: `/api/stays/${stayId}/images`,
    method: "patch",
    config: {
      onSuccess: () => {
        appMessage.success("Images updated successfully!");
      },
      onError: (err) => {
        appMessage.error(
          err?.response?.data?.message || "Failed to update images"
        );
      },
    },
  });

  // API mutation for creating/updating stays via BFF
  const { mutate: saveStay, isPending: savingStay } = useApiMutation({
    endpoint: isEditMode ? `/api/stays/${stayId}` : "/api/stays",
    method: isEditMode ? "put" : "post",
    config: {
      onSuccess: async (response) => {
        try {
          // Extract stay ID from response
          const savedStayId =
            response?.data?.id ||
            response?.data?.stay?.id ||
            response?.id ||
            (isEditMode ? stayId : null);

          if (!savedStayId) {
            appMessage.error("Failed to get stay ID from response");
            setIsSubmitting(false);
            return;
          }

          // In edit mode, update images separately
          if (isEditMode) {
            const formValues = getValues();
            const images = formValues.images || [];
            const imageUpdateResult = await updateImages(
              savedStayId,
              images,
              initialData?.images || []
            );

            // Check if status is pending to show appropriate message
            const status =
              response?.data?.status || response?.data?.stay?.status;
            const isPendingStatus = status === "pending";

            if (imageUpdateResult.success) {
              if (isPendingStatus) {
                appMessage.success(
                  "Your changes have been submitted to Admin. Please stand by for approval."
                );
              } else {
                appMessage.success("Stay updated successfully!");
              }
            } else {
              appMessage.warning(
                "Stay updated but image update failed. Please update images manually."
              );
            }
          } else {
            // For create mode, check if status is pending
            const status =
              response?.data?.status || response?.data?.stay?.status;
            const isPendingStatus = status === "pending";

            if (isPendingStatus) {
              appMessage.success(
                "Your changes have been submitted to Admin. Please stand by for approval."
              );
            } else {
              appMessage.success("Stay created successfully!");
            }
          }

          setIsSubmitting(false);
          setSuccessResponse(response);

          if (isAdminMode) {
            router.push(`/admin-dashboard/stays`);
          } else {
            router.push(`/dashboard/listings/stays`);
          }
        } catch (error) {
          console.error("Error in onSuccess:", error);
          setIsSubmitting(false);
        }
      },
      onError: (err) => {
        console.log({ err });
        setIsSubmitting(false);
        appMessage.error(
          err?.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} stay`
        );
      },
    },
  });

  const appendFormData = useCallback(
    (finalData: any, data: any, parentKey = "") => {
      // Skip null, undefined, or empty string
      if (
        data === null ||
        data === undefined ||
        (typeof data === "string" && data.trim() === "")
      ) {
        return;
      }

      if (Array.isArray(data)) {
        // Handle arrays recursively
        data.forEach((item, index) => {
          appendFormData(finalData, item, `${parentKey}[${index}]`);
        });
      } else if (data instanceof Date) {
        // Handle Date objects correctly
        finalData.append(parentKey, data.toISOString());
      } else if (data instanceof File || data instanceof Blob) {
        // Handle File or Blob objects correctly
        finalData.append(parentKey, data);
      } else if (typeof data === "object" && data !== null) {
        // Handle objects recursively
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (
              value !== null &&
              value !== undefined &&
              !(typeof value === "string" && value.trim() === "")
            ) {
              const newKey = parentKey ? `${parentKey}[${key}]` : key;
              appendFormData(finalData, value, newKey);
            }
          }
        }
      } else {
        // Handle primitives (string, number, boolean)
        finalData.append(parentKey, data);
      }
    },
    []
  );
  console.log({ formProgress });

  // Helper function to build transformed data
  const buildTransformedData = useCallback(
    (
      formValues: any,
      statusOverride?: string,
      blockedDatesRangesArray?: BlockedDateRange[]
    ) => {
      const transformedData: any = {
        // Basic Information
        listing_type: formValues.listing_type,
        address: formValues.address,
        unit_no: formValues.unit_no,
        country: formValues.country,
        state: formValues.state,
        city: formValues.city,
        zipcode: formValues.zipcode,
        area: formValues.area,
        latitude: formValues.latitude || formValues.lat,
        longitude: formValues.longitude || formValues.lng,
        timezone: formValues.timezone,

        // Space & Lodging
        type_of_space: formValues.type_of_space || formValues.type_of_space,
        lodging_type: formValues.lodging_type,
        title: formValues.title || formValues.title,
        floor_number: formValues.floor_number,

        // Capacity
        no_of_guest: formValues.no_of_guest,
        no_of_bedrooms: formValues.no_of_bedrooms,
        no_of_beds: formValues.no_of_beds,
        no_of_bathrooms: formValues.no_of_bathrooms,
        no_of_rooms: formValues.no_of_rooms,
        size: formValues.size,
        unit_of_measure: formValues.unit_of_measure,

        // Description
        description: formValues.description,

        // Pricing
        instant_booking: formValues.instant_booking ?? false,
        nightly_price: formValues.nightly_price,
        apply_weekend_price: formValues.apply_weekend_price,
        weekend_nightly_price: formValues.weekend_nightly_price,
        nightly_price_seven_plus: formValues.nightly_price_seven_plus,
        nightly_price_thirty_plus: formValues.nightly_price_thirty_plus,

        // Additional Guests
        additional_guest:
          formValues.additional_guest ?? formValues.additional_guest ?? false,
        no_of_additional_guest: formValues.no_of_additional_guest,
        additional_guest_price: formValues.additional_guest_price,

        // Pets
        pet_allowed: formValues.pet_allowed ?? false,
        no_of_pets: formValues.no_of_pets,
        price_per_pet: formValues.price_per_pet,

        // Fees
        cleaning_fee: formValues.cleaning_fee,
        city_fee: formValues.city_fee,
        tax_percentage: formValues.tax_percentage,
        cleaning_freq: formValues.cleaning_freq,
        city_fee_freq: formValues.city_fee_freq,

        // Cancellation Policies
        cancellation_policy_short: formValues.cancellation_policy_short,
        cancellation_policy_long: formValues.cancellation_policy_long,

        // Booking Rules
        min_day_booking: formValues.min_day_booking,
        max_day_booking: formValues.max_day_booking,
        check_in_after: formValues.check_in_after,
        check_out_before: formValues.check_out_before,

        // Rules & Restrictions
        smoking_allowed: formValues.smoking_allowed ?? false,
        smoking_rules: formValues.smoking_rules,
        party_allowed: formValues.party_allowed ?? false,
        party_rules: formValues.party_rules,
        children_allowed: formValues.children_allowed ?? false,
        children_rules: formValues.children_rules,
        rules_pet_allowed: formValues.rules_pet_allowed ?? false,
        pet_rules: formValues.pet_rules,
        rules: formValues.rules,
        rules_instructions: formValues.rules_instructions,

        // Age Restrictions
        children_ages: formValues.children_ages,
        infant_ages: formValues.infant_ages,

        // Welcome Messages
        welcome_message: formValues.welcome_message,
        welcome_message_instructions: formValues.welcome_message_instructions,

        // Status
        is_disable: formValues.is_disable ?? false,
        status: formValues.status,
        is_featured: formValues.is_featured ?? false,
        helicopter_allowed: formValues.helicopter_allowed ?? false,

        // Host
        host_id: formValues.host_id,
      };

      // Transform Features - NEW FORMAT
      if (formValues.features && formValues.features.length > 0) {
        transformedData.features = formValues.features
          .filter((f: any) => f.feature_id) // Only include features with ID
          .map((feature: any) => ({
            id: feature.feature_id,
            sub_features: feature.sub_features || [],
          }));
      }

      // Transform Blocked Dates - only include in create mode
      // In edit mode, blocked dates are updated via separate API
      const rangesToInclude = blockedDatesRangesArray || blockedDateRanges;
      if (!isEditMode && rangesToInclude && rangesToInclude.length > 0) {
        transformedData.blocked_dates = rangesToInclude;
      }

      // Transform Bedrooms
      if (formValues.bedrooms && formValues.bedrooms.length > 0) {
        transformedData.bedrooms = formValues.bedrooms;
      }

      // Transform Extra Services
      // Always send extra_services array: empty array if "No" is selected, otherwise send the services
      if (
        formValues.extra_service === true &&
        formValues.extra_services &&
        formValues.extra_services.length > 0
      ) {
        transformedData.extra_services = formValues.extra_services;
      } else {
        // Send empty array when extra_service is false or no services provided
        transformedData.extra_services = [];
      }

      // Transform Airports
      if (formValues.airports && formValues.airports.length > 0) {
        transformedData.airports = formValues.airports;
      }

      // Transform Custom Periods
      // Always send custom_periods array: empty array if "No" is selected, otherwise send the periods
      if (
        formValues.custom_period_pricing === true &&
        formValues.custom_periods &&
        formValues.custom_periods.length > 0
      ) {
        transformedData.custom_periods = formValues.custom_periods;
      } else {
        // Send empty array when custom_period_pricing is false or no periods provided
        transformedData.custom_periods = [];
      }

      // Images are now uploaded separately via POST /stays/:id/images
      // Do not include images in the stay creation/update payload

      // Add completion percentage from form progress
      transformedData.completion_percentage = formProgress.percentage;

      // Add status based on override or default
      if (statusOverride) {
        transformedData.status = statusOverride;
      }

      // Remove null/undefined values (but preserve false, 0, and empty strings)
      Object.keys(transformedData).forEach((key) => {
        if (
          transformedData[key] === null ||
          transformedData[key] === undefined
        ) {
          delete transformedData[key];
        }
      });

      return transformedData;
    },
    [formProgress.percentage, isEditMode, blockedDateRanges]
  );

  // Handle save as draft
  const handleSaveAsDraft = useCallback(async () => {
    try {
      const formValues = getValues();

      // Validate title field is required for draft
      const titleValue = formValues.title as string | null | undefined;
      if (
        !titleValue ||
        (typeof titleValue === "string" && titleValue.trim() === "")
      ) {
        setTitleRequiredModalVisible(true);
        return;
      }

      setIsSubmitting(true);

      // Get blocked date ranges from calendar if on calendar tab
      let rangesToSave: BlockedDateRange[] = [];
      if (
        calendarRef.current &&
        calendarRef.current.getBlockedDateRanges() &&
        calendarRef.current.getBlockedDateRanges()?.length > 0
      ) {
        rangesToSave = calendarRef.current.getBlockedDateRanges();
        setBlockedDateRanges(rangesToSave);
      } else {
        rangesToSave = blockedDateRanges;
      }
      const transformedData = buildTransformedData(
        formValues,
        "draft",
        rangesToSave
      );

      const images = formValues.images || [];

      console.log("Saving as draft:", transformedData);

      // Handle create vs edit mode differently
      if (isEditMode) {
        // Edit mode: Update stay first, then update images separately
        saveStay(transformedData);
      } else {
        // Create mode: Create stay first (JSON), then upload images separately
        try {
          // Step 1: Create stay (JSON)
          const createResponse = await fetch("/api/stays", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(transformedData),
          });

          if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({
              message: "Failed to save draft",
            }));
            throw new Error(errorData.message || "Failed to save draft");
          }

          const createData = await createResponse.json();
          const savedStayId =
            createData?.data?.id ||
            createData?.data?.stay?.id ||
            createData?.id ||
            null;

          if (!savedStayId) {
            throw new Error("Failed to get stay ID from response");
          }

          // Step 2: Upload images separately (if any)
          const imagesWithFiles = images.filter(
            (item: any) => item?.file instanceof File
          );

          if (imagesWithFiles.length > 0) {
            const imageUploadResult = await uploadImagesWithMetadata(
              savedStayId,
              images
            );

            if (imageUploadResult.success) {
              appMessage.success("Draft saved with images successfully!");
            } else {
              appMessage.warning(
                "Draft saved but image upload failed. Please upload images manually."
              );
            }
          } else {
            appMessage.success("Draft saved successfully!");
          }

          setIsSubmitting(false);
          setSuccessResponse(createData);

          // Redirect to stays listing page after successful draft creation
          if (isAdminMode) {
            router.push(`/admin-dashboard/stays`);
          } else {
            router.push(`/dashboard/listings/stays`);
          }
        } catch (error: any) {
          console.error("Save draft error:", error);
          setIsSubmitting(false);
          appMessage.error(error.message || "Failed to save draft");
        }
      }
    } catch (err) {
      console.error("Save as draft error:", err);
      appMessage.error("Failed to save draft. Please try again.");
      setIsSubmitting(false);
    }
  }, [
    getValues,
    buildTransformedData,
    uploadImagesWithMetadata,
    saveStay,
    appMessage,
    activeTab,
    blockedDateRanges,
    isEditMode,
    router,
    showHostSelector,
    isAdminMode,
  ]);
  console.log("debug logs", getValues(), errors);
  // Handle form submission (Save as Listing button)
  const onSubmit = useCallback(
    async (formValues: any, event: any) => {
      try {
        event?.preventDefault();
        setIsSubmitting(true);

        // Get blocked date ranges from calendar if on calendar tab
        let rangesToSave: BlockedDateRange[] = [];
        if (
          calendarRef.current &&
          calendarRef.current.getBlockedDateRanges() &&
          calendarRef.current.getBlockedDateRanges()?.length > 0
        ) {
          rangesToSave = calendarRef.current.getBlockedDateRanges();
          setBlockedDateRanges(rangesToSave);
        } else {
          rangesToSave = blockedDateRanges;
        }

        // This is only called when "Save as Listing" button is clicked (100% complete)
        let statusToSend: string | undefined;

        if (isEditMode) {
          // In edit mode, only send status if it's not already "pending"
          const currentStatus = initialData?.status;
          if (currentStatus !== "pending") {
            statusToSend = "pending";
          }
          // If already pending, don't send status (undefined means don't update)
        } else {
          // In create mode, set to pending
          statusToSend = "pending";
        }

        const transformedData = buildTransformedData(
          formValues,
          statusToSend,
          rangesToSave
        );

        const images = formValues.images || [];

        console.log("Saving as listing:", transformedData);
        console.log("Form completion:", formProgress.percentage + "%");
        console.log("Status:", statusToSend || "(not updating status)");
        console.log("Images:", images);

        // Handle create vs edit mode differently
        if (isEditMode) {
          // Edit mode: Update stay first, then update images separately
          saveStay(transformedData);
        } else {
          // Create mode: Create stay first (JSON), then upload images separately
          setIsSubmitting(true);
          try {
            // Step 1: Create stay (JSON)
            const createResponse = await fetch("/api/stays", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(transformedData),
            });

            if (!createResponse.ok) {
              const errorData = await createResponse.json().catch(() => ({
                message: "Failed to create stay",
              }));
              throw new Error(errorData.message || "Failed to create stay");
            }

            const createData = await createResponse.json();
            const savedStayId =
              createData?.data?.id ||
              createData?.data?.stay?.id ||
              createData?.id ||
              null;

            if (!savedStayId) {
              throw new Error("Failed to get stay ID from response");
            }

            // Step 2: Upload images separately (if any)
            const imagesWithFiles = images.filter(
              (item: any) => item?.file instanceof File
            );

            if (imagesWithFiles.length > 0) {
              const imageUploadResult = await uploadImagesWithMetadata(
                savedStayId,
                images
              );

              if (imageUploadResult.success) {
                appMessage.success(
                  "Your changes have been submitted to Admin. Please stand by for approval."
                );
              } else {
                appMessage.warning(
                  "Stay created but image upload failed. Please upload images manually."
                );
                console.error("Image upload error:", imageUploadResult.message);
              }
            } else {
              appMessage.success(
                "Your changes have been submitted to Admin. Please stand by for approval."
              );
            }

            setIsSubmitting(false);
            setSuccessResponse(createData);

            // Redirect to stays listing page after successful creation
            if (isAdminMode) {
              router.push(`/admin-dashboard/stays`);
            } else {
              router.push(`/dashboard/listings/stays`);
            }
          } catch (error: any) {
            console.error("Create stay error:", error);
            setIsSubmitting(false);
            appMessage.error(error.message || "Failed to create stay");
          }
        }
      } catch (err) {
        console.error("Form submission error:", err);
        appMessage.error("Failed to submit form. Please check your inputs.");
        setIsSubmitting(false);
      }
    },
    [
      isEditMode,
      initialData,
      buildTransformedData,
      uploadImagesWithMetadata,
      saveStay,
      appMessage,
      formProgress.percentage,
      activeTab,
      blockedDateRanges,
      router,
      showHostSelector,
      isAdminMode,
    ]
  );

  // Handle update calendar dates (edit mode, calendar tab)
  const handleUpdateCalendarDates = useCallback(async () => {
    try {
      setIsSubmitting(true);

      if (!calendarRef.current) {
        appMessage.error("Calendar reference not available");
        setIsSubmitting(false);
        return;
      }

      const ranges = calendarRef.current.getBlockedDateRanges();

      updateBlockedDates({ blocked_dates: ranges });
    } catch (err) {
      console.error("Update calendar dates error:", err);
      appMessage.error("Failed to update calendar dates. Please try again.");
      setIsSubmitting(false);
    }
  }, [updateBlockedDates, appMessage]);
  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  // Memoize the callback to prevent infinite re-renders
  // Note: This is just for backward compatibility - we primarily use getBlockedDateRanges() via ref
  const handleDatesChange = useCallback((dates: string[]) => {
    // Convert simple date array to range format for consistency
    // Each date becomes its own range with "custom" source
    const ranges: BlockedDateRange[] = dates.map((date) => ({
      start_date: date,
      end_date: date,
      source: "custom",
    }));
    setBlockedDateRanges(ranges);
  }, []);

  const tabItems = [
    {
      key: "property-details",
      label: (
        <span>
          <span className="md:hidden">STEP 1</span>
          <span className="hidden md:inline">STEP 1: Property Details</span>
        </span>
      ),
      children: (
        <div className="space-y-8">
          <ListingFormFields showHostSelector={showHostSelector} />
          <LocationFormFields />
          <ImagesForm />
          <InformationFields />
          <BedroomFields />
          <AirportInformationFields />
          <PricingInformationFields />
          <ExtraServices />
          <Features />
          <TermsAndRules />
        </div>
      ),
    },
    {
      key: "availability-calendar",
      label: (
        <span>
          <span className="md:hidden">STEP 2</span>
          <span className="hidden md:inline">
            STEP 2: Availability Calendar
          </span>
        </span>
      ),
      children: (
        <BlockedDateCalender
          ref={calendarRef}
          successResponse={successResponse}
          setSuccessResponse={setSuccessResponse}
          initialBlockedDates={initialBlockedDates}
          onDatesChange={handleDatesChange}
        />
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="  py-4">
            <div className="">
              <div className="mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
                  {isEditMode ? "Edit Stay" : "Add New Stay"}
                </h1>
                <p className="text-gray-600">
                  {isEditMode
                    ? "Update your stay listing details"
                    : "Create a new stay listing for your property"}
                </p>
              </div>

              {/* Instructions Banner */}
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-primary rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <InfoCircleOutlined className="h-6 w-6 text-primary mt-0.5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                      Instructions:
                    </h3>
                    <div className="text-sm md:text-base text-gray-700 space-y-2">
                      <p>
                        <span className="font-semibold">STEP 1:</span> Complete
                        all property details, location, images, pricing, and
                        rules information.
                      </p>
                      <p>
                        <span className="font-semibold">STEP 2:</span> Set your
                        availability calendar by blocking dates when your
                        property is not available.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" ">
                <div className="mb-8">
                  <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    size="large"
                  />
                </div>

                <div
                  style={{ marginTop: 24 }}
                  className="sticky bottom-0 left-0 right-0 flex flex-col sm:flex-row sm:justify-between bg-white border-t border-gray-200 py-2 sm:py-3 md:py-4 px-3 sm:px-4 z-[50] gap-2 sm:gap-4 shadow-lg sm:shadow-none"
                >
                  {/* Progress Indicator - Smaller on mobile, full size on desktop */}
                  <div className="flex-shrink-0 min-w-0">
                    <FormProgressIndicator progress={formProgress} />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    {/* Calendar Tab - Edit Mode: Show Update Calendar Dates button */}
                    {activeTab === "availability-calendar" && isEditMode && (
                      <Button
                        type="primary"
                        onClick={handleUpdateCalendarDates}
                        loading={updatingBlockedDates || isSubmitting}
                        size="large"
                        className="w-full sm:w-auto"
                      >
                        <span className="text-xs sm:text-sm">
                          Update Calendar Dates
                        </span>
                      </Button>
                    )}

                    {/* Property Details Tab or Create Mode */}
                    {activeTab === "property-details" && (
                      <>
                        {/* Show Save as Draft only if NOT in edit mode with pending status */}

                        <Button
                          type="default"
                          onClick={handleSaveAsDraft}
                          loading={savingStay || isSubmitting}
                          size="large"
                          className="w-full sm:w-auto"
                        >
                          <span className="text-xs sm:text-sm">
                            Save as Draft
                          </span>
                        </Button>

                        {/* Always show "Save as Listing" button, disable if form is not 100% complete */}
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={savingStay || isSubmitting}
                          disabled={formProgress.percentage !== 100}
                          size="large"
                          className="w-full sm:w-auto"
                          title={
                            formProgress.percentage !== 100
                              ? "Complete all required fields to enable this button"
                              : ""
                          }
                        >
                          <span className="text-xs sm:text-sm">
                            {isEditMode ? "Update Listing" : "Save as Listing"}
                          </span>
                        </Button>
                      </>
                    )}

                    {/* Calendar Tab - Create Mode: Show Save buttons */}
                    {activeTab === "availability-calendar" && !isEditMode && (
                      <>
                        {/* Show Save as Draft */}
                        <Button
                          type="default"
                          onClick={handleSaveAsDraft}
                          loading={savingStay || isSubmitting}
                          size="large"
                          className="w-full sm:w-auto"
                        >
                          <span className="text-xs sm:text-sm">
                            Save as Draft
                          </span>
                        </Button>

                        {/* Always show Save as Listing button, disable if form is not 100% complete */}
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={savingStay || isSubmitting}
                          disabled={formProgress.percentage !== 100}
                          size="large"
                          className="w-full sm:w-auto"
                          title={
                            formProgress.percentage !== 100
                              ? "Complete all required fields to enable this button"
                              : ""
                          }
                        >
                          <span className="text-xs sm:text-sm">
                            Save as Listing
                          </span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Title Required Modal */}
      <Dialog
        open={titleRequiredModalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setTitleRequiredModalVisible(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Title Required</DialogTitle>
            <DialogDescription>
              <div className="space-y-3 mt-2">
                <p>
                  To save your listing as a draft, you must provide a title for
                  your property.
                </p>
                <p className="text-sm text-gray-600">
                  The title helps identify your listing and is required even for
                  draft listings. Please go back to the "Property Details" tab
                  and fill in the title field before saving as draft.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setTitleRequiredModalVisible(false);
                // Optionally navigate to property details tab
                setActiveTab("property-details");
              }}
              type="primary"
              size="middle"
              className="bg-[#AF2322] hover:bg-[#9e1f1a]"
            >
              Go to Property Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaysForm;
