"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Button, Spin } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import * as yup from "yup";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import BusinessDetailsForm from "./BusinessDetailsForm";
import { BUSINESS_SUBTYPES } from "@/constants/business";
import LocationForm from "./LocationForm";
import DiscountsForm from "./DiscountsForm";
import SuccessModal from "./SuccessModal";
import PaymentModal from "./PaymentModal";
import UpdatePlanModal from "./UpdatePlanModal";

// Create schema function that accepts businessId for conditional validation
const createBusinessFormSchema = (businessId?: string) =>
  yup.object().shape({
    menu_images: yup
      .mixed()
      .test(
        "maxLength",
        "You can upload up to 20 menu images",
        (value) => !value || !Array.isArray(value) || value.length <= 20
      ),
    tag_line: yup
      .string()
      .required("Tagline is required")
      .max(100, "Tagline must be at most 100 characters"),
    business_details: yup
      .string()
      .required("Description is required")
      .min(5, "Description must be at least 5 characters")
      .max(1000, "Description must be at most 1000 characters"),
    address: yup
      .string()
      .required("Address is required")
      .max(300, "Address must be at most 300 characters"),
    city: yup
      .string()
      .required("City is required")
      .max(50, "City must be at most 50 characters"),
    state: yup
      .string()
      .required("State is required")
      .max(50, "State must be at most 50 characters"),
    zipcode: yup.string().required("ZIP/Postal Code is required"),
    country: yup
      .string()
      .required("Country is required")
      .max(50, "Country must be at most 50 characters"),
    latitude: yup
      .number()
      .typeError("Latitude must be a number")
      .required("Latitude is required")
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: yup
      .number()
      .typeError("Longitude must be a number")
      .required("Longitude is required")
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    name: yup.string().required("Name is required"),
    distance_from_runway: yup
      .string()
      .required("Distance from runway is required"),
    type: businessId
      ? yup.string().required("Business type is required")
      : yup
          .array()
          .of(yup.string())
          .min(1, "Please select at least one business type")
          .required("Business types are required"),
    airport: yup
      .string()
      .required("Airport Identifier is required")
      .max(4, "Airport Identifier cannot exceed 4 characters"),
    url: yup.string().url("Invalid URL").required("Website URL is required"),
    operational_hrs: yup
      .string()
      .required("Hours of operation is required")
      .max(100, "Hours of operation must be at most 100 characters"),
    phone: yup
      .string()
      .required("Cell phone number is required")
      .test(
        "is-valid-phone",
        "Please enter all required digits and make it valid",
        (value) =>
          Boolean(
            value &&
              isPossiblePhoneNumber(value) &&
              isValidPhoneNumber(value || "")
          )
      ),
    discounts: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required("Discount title is required"),
          description: yup
            .string()
            .required("Discount description is required"),
        })
      )
      .test(
        "unique-phone",
        "Primary phone and Other phone cannot be the same",
        function (value) {
          const { other_phone } = this.parent;
          return !value || !other_phone || value !== other_phone;
        }
      ),
  });

const defaultValues = {
  distance_from_runway: "",
  airport: "",
  url: "https://",
  phone: "",
  operational_hrs: "",
  type: [],
  address: "",
  city: "",
  name: "",
  tag_line: "",
  state: "",
  country: "",
  zipcode: "",
  latitude: "",
  longitude: "",
  logo_image: null,
  business_details: "",
  featured: false,
  photo_images: [],
  photo_image_descriptions: [],
  deleted_photo_images: [],
  menu_images: [],
  deleted_menu_images: [],
  url_protocol_selection: "https://",
  discounts: [],
};

interface BusinessFormProps {
  businessId?: string;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ businessId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { message: appMessage } = useApp();
  const isAdmin = pathname?.includes("/admin-dashboard/");
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = !!businessId;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatePlanModalOpen, setIsUpdatePlanModalOpen] = useState(false);
  const [updatePlanStep, setUpdatePlanStep] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<
    Record<string, number | null>
  >({});
  const [selectedPlansAndBilling, setSelectedPlansAndBilling] = useState<
    Record<string, { freq: string; value: any; tiers: string }>
  >({});
  const [updatePlanSelectedIndex, setUpdatePlanSelectedIndex] = useState<
    Record<string, number | null>
  >({});
  const [updatePlanSelectedBilling, setUpdatePlanSelectedBilling] = useState<
    Record<string, { freq: string; value: any; tiers: string }>
  >({});

  const methods = useForm({
    resolver: yupResolver(createBusinessFormSchema(businessId)) as any,
    defaultValues,
  });

  const { handleSubmit, reset, watch } = methods;
  const businessType = watch("type") || [];

  // Fetch Stripe plans
  // Backend returns: { success: true, products: [...] }
  const { data: plansData, isLoading: loadingPlans } = useApiGet({
    endpoint: "/api/payments/products",
    queryKey: ["stripe-products"],
  });

  console.log("plansData", plansData);

  // Extract products array from response
  // Response structure: { success: true, products: [...] } or direct array
  const plans = useMemo(() => {
    if (!plansData) {
      console.log("No plansData received");
      return [];
    }

    console.log("plansData structure:", plansData);

    // If it's already an array, return it
    if (Array.isArray(plansData)) {
      console.log("plansData is array, length:", plansData.length);
      return plansData;
    }

    // Check for products property
    if (plansData?.products && Array.isArray(plansData.products)) {
      console.log(
        "Found plansData.products, length:",
        plansData.products.length
      );
      return plansData.products;
    }

    // Check for data property
    if (plansData?.data && Array.isArray(plansData.data)) {
      console.log("Found plansData.data, length:", plansData.data.length);
      return plansData.data;
    }

    console.warn("Could not extract plans from response:", plansData);
    return [];
  }, [plansData]);

  // Initialize selectedPlanIndex and selectedPlansAndBilling based on businessTypes
  useEffect(() => {
    if (Array.isArray(businessType) && businessType.length > 0) {
      const initialSelectedPlanIndex: Record<string, number | null> = {};
      const initialSelectedPlansAndBilling: Record<
        string,
        { freq: string; value: any; tiers: string }
      > = {};

      businessType.forEach((type: string) => {
        if (!selectedPlanIndex[type]) {
          initialSelectedPlanIndex[type] = null;
        }
        if (!selectedPlansAndBilling[type]) {
          initialSelectedPlansAndBilling[type] = {
            freq: "",
            value: null,
            tiers: "",
          };
        }
      });

      setSelectedPlanIndex((prev) => ({
        ...prev,
        ...initialSelectedPlanIndex,
      }));
      setSelectedPlansAndBilling((prev) => ({
        ...prev,
        ...initialSelectedPlansAndBilling,
      }));
    }
  }, [businessType]);

  // Fetch business data for edit mode
  const {
    data: businessDetail,
    isLoading: loadingData,
    isFetching: isFetchingBusinessDetail,
  } = useApiGet({
    endpoint: `/api/business/${businessId}`,
    queryKey: ["business", businessId],
    config: {
      enabled: !!businessId,
    },
  });

  // Check for update-plan query param
  useEffect(() => {
    const updatePlan = searchParams?.get("update-plan");
    if (updatePlan === "true" && businessId && businessDetail) {
      setIsUpdatePlanModalOpen(true);
      setUpdatePlanStep(1);
      // Initialize plan selection state for the business type
      const businessType = businessDetail?.data?.type || businessDetail?.type;
      if (businessType) {
        setUpdatePlanSelectedIndex({ [businessType]: null });
        setUpdatePlanSelectedBilling({
          [businessType]: { freq: "", value: null, tiers: "" },
        });
      }
    }
  }, [searchParams, businessId, businessDetail]);

  // Handle update plan success
  const handleUpdatePlanSuccess = () => {
    setIsUpdatePlanModalOpen(false);
    setUpdatePlanStep(1);
    setShowSuccessModal(true);
    // Remove query param from URL
    router.replace(`/dashboard/listings/business/edit/${businessId}`);
  };

  useEffect(() => {
    if (businessDetail && isEditMode) {
      const { images, business_logo, url, discounts, ...values } =
        businessDetail.data || businessDetail;

      // Backend returns images with full URLs or relative paths
      // Map backend 'order' field to 'sort_order' for ImagesForm component
      const photo_images = (
        images?.filter((photo: any) => photo.type === "photo") || []
      ).map((img: any) => ({
        ...img,
        sort_order: img.order ?? img.sort_order ?? 0, // Map 'order' to 'sort_order'
        url:
          img.url || `https://s3.amazonaws.com/flyinn-app-bucket/${img.image}`,
      }));
      const menu_images = (
        images?.filter((photo: any) => photo.type === "menu") || []
      ).map((img: any) => ({
        ...img,
        sort_order: img.order ?? img.sort_order ?? 0, // Map 'order' to 'sort_order'
        url:
          img.url || `https://s3.amazonaws.com/flyinn-app-bucket/${img.image}`,
      }));

      let updatedDiscount: Array<{ title: string; description: string }> = [];
      // Check if discounts is already an array (from backend) or a string that needs parsing
      if (discounts) {
        if (typeof discounts === "string") {
          try {
            updatedDiscount = JSON.parse(discounts);
          } catch (error) {
            updatedDiscount = [];
          }
        } else if (Array.isArray(discounts)) {
          updatedDiscount = discounts;
        }
      }

      // Extract protocol from URL if it exists
      let protocol = "https://"; // Default to https://
      if (url) {
        if (url.startsWith("https://")) {
          protocol = "https://";
        } else if (url.startsWith("http://")) {
          protocol = "http://";
        }
        // If URL doesn't have protocol, keep default https://
      }

      reset({
        ...values,
        ...(photo_images?.length > 0 && { photo_images }),
        ...(menu_images?.length > 0 && { menu_images }),
        url: url || "",
        discounts: updatedDiscount,
        url_protocol_selection: protocol, // Always set protocol from URL
        ...(business_logo && {
          logo_image: business_logo.startsWith("http")
            ? business_logo
            : `https://s3.amazonaws.com/flyinn-app-bucket/${business_logo}`,
        }),
      });
    }
  }, [businessDetail, isEditMode, reset]);
  console.log("form values", methods.getValues());
  const { mutate: createBusiness } = useApiMutation({
    endpoint: "/api/business",
    method: "post",
    config: {
      onSuccess: async (response: any) => {
        // Backend returns: { data: [{ business_id, type, subscription_id }, ...] }
        const createdBusinesses = response?.data || [];

        // Upload images for each created business
        if (businessData && createdBusinesses.length > 0) {
          try {
            for (const business of createdBusinesses) {
              const businessId =
                business.business_id?.toString() || business.business_id;
              if (businessId) {
                await uploadImagesForBusiness(businessId, businessData);
              }
            }
          } catch (error) {
            console.error("Error uploading images:", error);
            // Continue even if some image uploads fail
          }
        }

        setIsSaving(false);
        setShowSuccessModal(true);
        setIsModalOpen(false);
        setCurrentStep(1);
      },
      onError: (err: any) => {
        setIsSaving(false);
        appMessage.error(
          err?.response?.data?.message || "Failed to create business"
        );
      },
    },
  });

  const { mutate: updateBusiness } = useApiMutation({
    endpoint: `/api/business/${businessId}`,
    method: "put",
    config: {
      onSuccess: async () => {
        // Update images after business update (handles reordering, new images, updates, deletions)
        // Handles all three types: photo_images, menu_images, and logo_image
        const currentData = businessData || methods.getValues();
        if (currentData && businessId) {
          const initialImages =
            businessDetail?.data?.images || businessDetail?.images || [];
          const photoImages = currentData.photo_images || [];
          const menuImages = currentData.menu_images || [];
          const logoImage = currentData.logo_image || null;

          try {
            // Update images (handles reordering, updates, deletions, and new images for all three types)
            // PATCH handles everything, just like stays form
            const imageUpdateResult = await updateImagesForBusiness(
              businessId,
              photoImages,
              menuImages,
              logoImage,
              initialImages
            );

            if (imageUpdateResult.success) {
              appMessage.success("Business  updated successfully!");
            } else {
              appMessage.warning(
                "Business updated but some image updates may have failed."
              );
            }
          } catch (error) {
            console.error("Error updating images:", error);
            appMessage.warning(
              "Business updated but some image updates may have failed."
            );
          }
        }
        setIsSaving(false);
        setShowSuccessModal(true);
      },
      onError: (err: any) => {
        setIsSaving(false);
        appMessage.error(
          err?.response?.data?.message || "Failed to update business"
        );
      },
    },
  });

  const onSubmit = async (data: any) => {
    if (isEditMode) {
      // For edit mode, submit directly
      setIsSaving(true);
      const {
        photo_images,
        menu_images,
        logo_image,
        url_protocol_selection,
        deleted_photo_images,
        deleted_menu_images,
        ...rest
      } = data;

      // Convert discounts to JSON string
      const payload = {
        ...rest,
        discounts:
          typeof rest.discounts === "string"
            ? rest.discounts
            : JSON.stringify(rest.discounts || []),
        remove_images: [
          ...(deleted_photo_images || []),
          ...(deleted_menu_images || []),
        ]
          .map((img: any) => img.id || img)
          .filter(Boolean),
      };

      // Store data for image upload after update
      setBusinessData(data);
      updateBusiness(payload);
    } else {
      // For create mode, open payment modal
      setBusinessData(data);
      setIsModalOpen(true);
      setCurrentStep(1);
    }
  };

  const transformToPriceIdArray = (
    selectedPlans: Record<string, { freq: string; value: any; tiers: string }>
  ) => {
    return Object.entries(selectedPlans)
      .filter(([_, data]) => data?.value?.price_id) // Filter out entries with null/undefined value or price_id
      .map(([type, data]) => ({
        price_id: data.value.price_id,
        type,
      }));
  };

  // Function to update images in edit mode (handles reordering, new images, updates, deletions)
  // Handles three types: photo_images (array), menu_images (array), and logo_image (single file)
  const updateImagesForBusiness = useCallback(
    async (
      businessId: string,
      photoImages: any[],
      menuImages: any[],
      logoImage: any,
      initialImages: any[]
    ) => {
      try {
        const formData = new FormData();

        // Process photo images
        const initialPhotoImages = (initialImages || []).filter(
          (img: any) => img.type === "photo"
        );
        const initialPhotoIds = new Set(
          initialPhotoImages.map((img: any) => img.id)
        );
        const currentPhotoIds = new Set(
          photoImages
            .filter((img: any) => img.id && !img.file)
            .map((img: any) => img.id)
        );

        // Process menu images
        const initialMenuImages = (initialImages || []).filter(
          (img: any) => img.type === "menu"
        );
        const initialMenuIds = new Set(
          initialMenuImages.map((img: any) => img.id)
        );
        const currentMenuIds = new Set(
          menuImages
            .filter((img: any) => img.id && !img.file)
            .map((img: any) => img.id)
        );

        // Find new images (have file but no id)
        const newPhotoImages = photoImages.filter(
          (img: any) => img.file instanceof File && !img.id
        );
        const newMenuImages = menuImages.filter(
          (img: any) => img.file instanceof File && !img.id
        );

        // Find deleted images (in initial but not in current)
        const deletedPhotoIds = Array.from(initialPhotoIds).filter(
          (id) => !currentPhotoIds.has(id)
        );
        const deletedMenuIds = Array.from(initialMenuIds).filter(
          (id) => !currentMenuIds.has(id)
        );
        const deletedImageIds = [...deletedPhotoIds, ...deletedMenuIds];

        // Always send ALL existing images with their current sort_order and description
        // This simplifies the logic - no need to detect changes, just send current state
        const updatedImages: any[] = [];

        // Add all existing photo images
        photoImages
          .filter((img: any) => img.id && !img.file)
          .forEach((img: any) => {
            updatedImages.push({
              id: img.id,
              description: img.description || "",
              sort_order: img.sort_order ?? 0,
            });
          });

        // Add all existing menu images
        menuImages
          .filter((img: any) => img.id && !img.file)
          .forEach((img: any) => {
            updatedImages.push({
              id: img.id,
              description: img.description || "",
              sort_order: img.sort_order ?? 0,
            });
          });

        // Add new photo images
        // Use 'new_photo_images' field name for PATCH (matching stays pattern with 'new_images')
        if (newPhotoImages.length > 0) {
          newPhotoImages.forEach((img: any, index: number) => {
            if (img.file instanceof File) {
              formData.append("new_photo_images", img.file);
              formData.append(
                `new_photo_image_descriptions[${index}]`,
                img.description || ""
              );
              // Use the sort_order from the image object - it's already set correctly by moveImage
              // when images are reordered, added, or deleted
              formData.append(
                `new_photo_image_sort_orders[${index}]`,
                String(img.sort_order ?? 0)
              );
            }
          });
        }

        // Add new menu images
        // Use 'new_menu_images' field name for PATCH (matching stays pattern with 'new_images')
        if (newMenuImages.length > 0) {
          newMenuImages.forEach((img: any, index: number) => {
            if (img.file instanceof File) {
              formData.append("new_menu_images", img.file);
              formData.append(
                `new_menu_image_descriptions[${index}]`,
                img.description || ""
              );
              // Use the sort_order from the image object - it's already set correctly by moveImage
              // when images are reordered, added, or deleted
              formData.append(
                `new_menu_image_sort_orders[${index}]`,
                String(img.sort_order ?? 0)
              );
            }
          });
        }

        // Add image updates as individual form fields
        // Backend expects 'sort_order' in form data (it maps to 'order' in database internally)
        // Always send all existing images - backend will handle what changed
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

        // Handle logo image if it's a new file
        const logoFile =
          logoImage?.originFileObj instanceof File
            ? logoImage.originFileObj
            : logoImage instanceof File
            ? logoImage
            : null;

        if (logoFile) {
          formData.append("logo_image", logoFile);
        }

        // Add deleted image IDs as individual form fields
        if (deletedImageIds.length > 0) {
          deletedImageIds.forEach((id: any, index: number) => {
            formData.append(`deleted_image_ids[${index}]`, String(id));
          });
        }

        // If no images at all, return early
        if (
          updatedImages.length === 0 &&
          newPhotoImages.length === 0 &&
          newMenuImages.length === 0 &&
          deletedImageIds.length === 0 &&
          !logoFile
        ) {
          return { success: true, message: "No image changes to update" };
        }

        // Update images
        const response = await fetch(`/api/business/${businessId}/images`, {
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

  const uploadImagesForBusiness = async (businessId: string, data: any) => {
    const { photo_images, menu_images, logo_image } = data;

    // Filter images that have files to upload
    const photoImagesWithFiles = (photo_images || []).filter(
      (item: any) => item?.file instanceof File
    );
    const menuImagesWithFiles = (menu_images || []).filter(
      (item: any) => item?.file instanceof File
    );

    // Logo comes from Ant Design Upload, which stores File in originFileObj
    const logoFile =
      logo_image?.originFileObj instanceof File
        ? logo_image.originFileObj
        : logo_image instanceof File
        ? logo_image
        : null;

    // Check if there are any images to upload
    const hasImagesToUpload =
      photoImagesWithFiles.length > 0 ||
      menuImagesWithFiles.length > 0 ||
      logoFile !== null;

    if (!hasImagesToUpload) {
      return { success: true, message: "No images to upload" };
    }

    try {
      const formData = new FormData();

      // Add photo images with descriptions and sort orders
      photoImagesWithFiles.forEach((img: any, index: number) => {
        if (img.file instanceof File) {
          formData.append("photo_images", img.file);
          formData.append(
            `photo_image_descriptions[${index}]`,
            img.description || ""
          );
          formData.append(
            `photo_image_sort_orders[${index}]`,
            String(img.sort_order ?? index)
          );
        }
      });

      // Add menu images with descriptions and sort orders
      menuImagesWithFiles.forEach((img: any, index: number) => {
        if (img.file instanceof File) {
          formData.append("menu_images", img.file);
          formData.append(
            `menu_image_descriptions[${index}]`,
            img.description || ""
          );
          formData.append(
            `menu_image_sort_orders[${index}]`,
            String(img.sort_order ?? index)
          );
        }
      });

      // Handle logo if it's a File
      if (logoFile) {
        formData.append("logo_image", logoFile);
      }

      // Upload all images in one request
      const response = await fetch(`/api/business/${businessId}/images`, {
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

      const responseData = await response.json();
      return {
        success: true,
        message: responseData.message || "Images uploaded successfully",
        data: responseData.data,
      };
    } catch (error: any) {
      console.error("Error uploading images:", error);
      appMessage.error("Business created but failed to upload some images");
      return {
        success: false,
        message: error.message || "Failed to upload images",
      };
    }
  };

  const handleBusinessAdd = async (paymentMethodId: string) => {
    if (!businessData) return;

    setIsSaving(true);

    const {
      photo_images,
      menu_images,
      logo_image,
      url_protocol_selection,
      deleted_photo_images,
      deleted_menu_images,
      ...rest
    } = businessData;

    const priceIds = transformToPriceIdArray(selectedPlansAndBilling);

    // Convert discounts to JSON string
    const payload = {
      ...rest,
      payment_method_id: paymentMethodId,
      price_ids: priceIds,
      discounts:
        typeof rest.discounts === "string"
          ? rest.discounts
          : JSON.stringify(rest.discounts || []),
    };

    createBusiness(payload);
  };

  if (loadingData || isFetchingBusinessDetail) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 md:p-6 relative">
      {/* {isSaving && (
        <div className="absolute h-screen inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-700 font-medium">
              {isEditMode
                ? "Updating business and images..."
                : "Creating businesses and uploading images..."}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please wait, this may take a moment...
            </p>
          </div>
        </div>
      )} */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <div className="">
              <div className="mb-8">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
                  {isEditMode ? "Edit Business" : "Add New Business"}
                </h1>
                <p className="text-gray-600">
                  {isEditMode
                    ? "Update your business listing details"
                    : "Create a new business listing"}
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <LocationForm />
                <BusinessDetailsForm isEditMode={isEditMode} />
                <DiscountsForm />

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading || isSaving}
                    disabled={isSaving}
                    className="bg-[#AF2322] hover:bg-[#9e1f1a] disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300"
                  >
                    {isEditMode ? "Update Business" : "Continue to Checkout"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      {isModalOpen && !isEditMode && (
        <PaymentModal
          isOpen={isModalOpen}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setIsModalOpen={setIsModalOpen}
          businessData={businessData}
          businessTypes={businessType}
          onSuccess={handleBusinessAdd}
          selectedPlanIndex={selectedPlanIndex}
          setSelectedPlanIndex={setSelectedPlanIndex}
          selectedPlansAndBilling={selectedPlansAndBilling}
          setSelectedPlansAndBilling={setSelectedPlansAndBilling}
          plans={plans}
          loadingPlans={loadingPlans}
        />
      )}

      {isUpdatePlanModalOpen && businessId && businessDetail && (
        <UpdatePlanModal
          isOpen={isUpdatePlanModalOpen}
          currentStep={updatePlanStep}
          setCurrentStep={setUpdatePlanStep}
          setIsModalOpen={setIsUpdatePlanModalOpen}
          businessId={businessId}
          businessType={
            businessDetail?.data?.type || businessDetail?.type || ""
          }
          onSuccess={handleUpdatePlanSuccess}
          selectedPlanIndex={updatePlanSelectedIndex}
          setSelectedPlanIndex={setUpdatePlanSelectedIndex}
          selectedPlansAndBilling={updatePlanSelectedBilling}
          setSelectedPlansAndBilling={setUpdatePlanSelectedBilling}
          plans={plans}
          loadingPlans={loadingPlans}
        />
      )}

      <SuccessModal
        open={showSuccessModal}
        message={
          isEditMode
            ? "Your business was updated successfully!"
            : "Your business was added successfully!"
        }
        onCTA={() =>
          router.push(
            isAdmin
              ? "/admin-dashboard/business"
              : "/dashboard/listings/business"
          )
        }
      />
    </div>
  );
};

export default BusinessForm;
