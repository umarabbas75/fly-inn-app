"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Input, Upload, Button, Radio, Checkbox } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  BUSINESS_SUBTYPES,
  getBusinessSubTypeLabel,
} from "@/constants/business";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

interface BusinessDetailsFormProps {
  isEditMode?: boolean;
}
import ImagesForm from "@/components/shared/ImagesForm";
import type { UploadFile } from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const { TextArea } = Input;

// Distance from runway options
const distanceFromRunwayOptions: SearchableSelectOption[] = [
  { value: "0", label: "0 miles (on airport)" },
  { value: "1", label: "0.1 to 1 miles" },
  { value: "3", label: "1.1 to 3 miles" },
  { value: "7", label: "3.1 to 7 miles" },
  { value: "8", label: "7+ miles" },
];

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  isEditMode = false,
}) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [showBusinessTypeModal, setShowBusinessTypeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const businessTypeValue = watch("type");
  const logoImageValue = watch("logo_image");
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  // In edit mode, type is a string; in create mode, it's an array
  const businessType = useMemo(() => {
    if (isEditMode) {
      // Edit mode: single string value
      return businessTypeValue ? [businessTypeValue] : [];
    } else {
      // Create mode: array of strings
      return Array.isArray(businessTypeValue) ? businessTypeValue : [];
    }
  }, [isEditMode, businessTypeValue]);

  // Format business types display: show at least 2 names, then +N for additional
  const businessTypesDisplay = useMemo(() => {
    if (isEditMode && businessTypeValue) {
      return getBusinessSubTypeLabel(businessTypeValue) || businessTypeValue;
    }

    if (businessType.length === 0) {
      return "Select Business Types";
    }

    if (businessType.length === 1) {
      return getBusinessSubTypeLabel(businessType[0]) || businessType[0];
    }

    // Show at least 2 type names, then +N for additional
    const firstTwoTypes = businessType
      .slice(0, 2)
      .map((type) => getBusinessSubTypeLabel(type) || type);
    const remainingCount = businessType.length - 2;

    if (remainingCount > 0) {
      return `${firstTwoTypes.join(", ")} +${remainingCount}`;
    }

    return firstTwoTypes.join(", ");
  }, [isEditMode, businessTypeValue, businessType]);
  const selectedProtocol = useWatch({
    control,
    name: "url_protocol_selection",
    defaultValue: "https://",
  });
  const currentUrlValue = useWatch({
    control,
    name: "url",
    defaultValue: "",
  });

  // Store original URL string to preserve it when user doesn't change the logo
  const originalLogoUrlRef = useRef<string | null>(null);

  // Convert logo_image value to fileList format for Upload component
  useEffect(() => {
    if (logoImageValue) {
      if (typeof logoImageValue === "string") {
        // URL string from backend
        originalLogoUrlRef.current = logoImageValue;
        const fileName = logoImageValue.split("/").pop() || "logo";
        setLogoFileList([
          {
            uid: "-1",
            name: fileName,
            status: "done",
            url: logoImageValue,
            thumbUrl: logoImageValue,
          },
        ]);
      } else if (logoImageValue instanceof File) {
        // File object - user uploaded a new file
        originalLogoUrlRef.current = null;
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoFileList([
            {
              uid: "-1",
              name: logoImageValue.name,
              status: "done",
              url: reader.result as string,
              thumbUrl: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(logoImageValue);
      } else if (
        logoImageValue &&
        typeof logoImageValue === "object" &&
        "url" in logoImageValue
      ) {
        // Already in UploadFile format
        setLogoFileList([logoImageValue as UploadFile]);
      }
    } else {
      originalLogoUrlRef.current = null;
      setLogoFileList([]);
    }
  }, [logoImageValue]);

  // Track previous protocol to only update when user changes it
  const prevProtocolRef = useRef(selectedProtocol);
  const urlValueRef = useRef(currentUrlValue);

  useEffect(() => {
    urlValueRef.current = currentUrlValue;
  }, [currentUrlValue]);

  useEffect(() => {
    // Only update URL if protocol was manually changed by user (not on initial mount or form reset)
    if (prevProtocolRef.current !== selectedProtocol && urlValueRef.current) {
      const domainPart = urlValueRef.current.replace(/^https?:\/\//, "");
      if (domainPart) {
        setValue("url", `${selectedProtocol}${domainPart}`, {
          shouldDirty: false,
        });
      }
    }
    prevProtocolRef.current = selectedProtocol;
  }, [selectedProtocol, setValue]);

  // Filter business types based on search query
  const filteredBusinessTypes = useMemo(() => {
    if (!searchQuery.trim()) {
      return BUSINESS_SUBTYPES;
    }

    const query = searchQuery.toLowerCase();
    return BUSINESS_SUBTYPES.map((group) => {
      const filteredSubcategories = group.subcategories.filter(
        (sub) =>
          sub.label.toLowerCase().includes(query) ||
          sub.type.toLowerCase().includes(query) ||
          sub.description?.toLowerCase().includes(query) ||
          group.category.toLowerCase().includes(query)
      );

      if (filteredSubcategories.length === 0) {
        return null;
      }

      return {
        ...group,
        subcategories: filteredSubcategories,
      };
    }).filter(Boolean) as typeof BUSINESS_SUBTYPES;
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Business Photos Section */}
      <div className=" pb-6">
        <ImagesForm
          maxNumber={20}
          fieldName="photo_images"
          descriptionFieldName="photo_image_descriptions"
          deletedImagesFieldName="deleted_photo_images"
          label="Business Photos"
          required={false}
          showDescription={false}
          minResolution={{ width: 800, height: 600 }}
          guidelines={[
            "Recommended: 5-20 photos (JPEG, PNG, WEBP, JPG)",
            "Images over 0.5MB will be automatically optimized",
            "Maximum initial file size: 15MB",
            "Use photos with a minimum resolution of 800×600 pixels",
            "First image will be featured automatically",
          ]}
        />
      </div>

      {/* Business Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Logo
          </label>
          <Controller
            name="logo_image"
            control={control}
            render={({ field: { onChange } }) => (
              <Upload
                listType="picture-card"
                fileList={logoFileList}
                onChange={({ fileList }) => {
                  setLogoFileList(fileList);
                  if (fileList.length === 0) {
                    onChange(null);
                  } else {
                    const file = fileList[0];
                    // If user uploaded a new file, store the File object
                    // Otherwise, preserve the original URL string
                    if (file.originFileObj) {
                      onChange(file.originFileObj);
                    } else if (originalLogoUrlRef.current) {
                      // Keep the original URL string from backend
                      onChange(originalLogoUrlRef.current);
                    } else if (file.url) {
                      // Fallback: use the URL from file object
                      onChange(file.url);
                    }
                  }
                }}
                onRemove={() => {
                  setLogoFileList([]);
                  originalLogoUrlRef.current = null;
                  onChange(null);
                }}
                beforeUpload={() => false}
                maxCount={1}
              >
                {logoFileList.length === 0 && (
                  <div className="flex flex-col justify-center items-center">
                    <UploadOutlined /> Upload Logo
                  </div>
                )}
              </Upload>
            )}
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name <span className="text-red-500">*</span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="e.g. Skyline Restaurant"
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Tagline <span className="text-red-500">*</span>
          </label>
          <Controller
            name="tag_line"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                maxLength={100}
                size="large"
                placeholder="e.g. The best views in town!"
              />
            )}
          />
          {errors.tag_line && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tag_line.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type <span className="text-red-500">*</span>
          </label>
          <Button
            type="default"
            onClick={() => setShowBusinessTypeModal(true)}
            className="w-full h-10 text-left"
          >
            {businessTypesDisplay}
          </Button>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.type.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Description <span className="text-red-500">*</span>
          </label>
          <Controller
            name="business_details"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                rows={5}
                maxLength={1000}
                placeholder="Describe your business..."
              />
            )}
          />
          {errors.business_details && (
            <p className="text-red-500 text-sm mt-1">
              {errors.business_details.message as string}
            </p>
          )}
        </div>

        {/* Menu Images Section - Only show for airport restaurants & cafes */}
        {businessType.some((type) => type === "airport_restaurants_cafes") && (
          <div className="md:col-span-2 pb-6">
            <ImagesForm
              maxNumber={20}
              fieldName="menu_images"
              descriptionFieldName="menu_image_descriptions"
              deletedImagesFieldName="deleted_menu_images"
              label="Menu Images"
              required={false}
              showDescription={false}
              minResolution={{ width: 800, height: 600 }}
              guidelines={[
                "Upload images of your menu (max 20 images)",
                "Images over 0.5MB will be automatically optimized",
                "Maximum initial file size: 15MB",
                "Use photos with a minimum resolution of 800×600 pixels",
                "This helps customers see your offerings",
              ]}
            />
          </div>
        )}

        {/* Contact Information */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours of Operation <span className="text-red-500">*</span>
              </label>
              <Controller
                name="operational_hrs"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="e.g. Mon-Fri: 9AM-5PM"
                  />
                )}
              />
              {errors.operational_hrs && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.operational_hrs.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              {/* <p className="text-xs text-gray-500 mb-2">
                First, click the flag icon to select your country. This will
                automatically insert your country code. Then enter your phone
                number, starting with the appropriate regional or local code for
                your number.
              </p> */}
              <Controller
                name="phone"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <PhoneInput
                    {...field}
                    placeholder="Enter phone number"
                    defaultCountry="US"
                    value={value || undefined}
                    international={true}
                    countryCallingCodeEditable={false}
                    withCountryCallingCode={true}
                    onChange={(newValue) => {
                      onChange(newValue || null);
                    }}
                    className="border h-10 pl-2.5 rounded-[8px] border-[#d9d9d9] text-base border-solid w-full"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL <span className="text-red-500">*</span>
              </label>
              <Controller
                name="url_protocol_selection"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field} className="mb-3">
                    <Radio value="https://">HTTPS</Radio>
                    <Radio value="http://">HTTP</Radio>
                  </Radio.Group>
                )}
              />
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={currentUrlValue.replace(/^https?:\/\//, "")}
                    onChange={(e) => {
                      const domainOnly = e.target.value.replace(
                        /^https?:\/\//,
                        ""
                      );
                      field.onChange(`${selectedProtocol}${domainOnly}`);
                    }}
                    size="large"
                    placeholder="yourbusiness.com"
                  />
                )}
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.url.message as string}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Airport Information */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Airport Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance from Runway <span className="text-red-500">*</span>
              </label>
              <Controller
                name="distance_from_runway"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <SearchableSelect
                    {...field}
                    value={value || undefined}
                    onValueChange={(val) => {
                      onChange(
                        typeof val === "string"
                          ? val
                          : Array.isArray(val)
                          ? val[0]
                          : undefined
                      );
                    }}
                    options={distanceFromRunwayOptions}
                    placeholder="Select distance"
                    error={!!errors.distance_from_runway}
                    showSearch={false}
                  />
                )}
              />
              {errors.distance_from_runway && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.distance_from_runway.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Airport Identifier <span className="text-red-500">*</span>
              </label>
              <Controller
                name="airport"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. KJFK"
                    className="uppercase"
                    size="large"
                  />
                )}
              />
              {errors.airport && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.airport.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Type Selection Dialog */}
      <Dialog
        open={showBusinessTypeModal}
        onOpenChange={setShowBusinessTypeModal}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Select Business Type
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              <p className="text-sm text-gray-600 flex items-center">
                <i className="fa fa-info-circle text-gray-400 mr-2"></i>
                Please select the {isEditMode ? "option" : "options"} that best
                describe your business type from the categories below.
              </p>
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search business types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                size="large"
                allowClear
              />
            </div>
          </div>

          {/* Business Types Grid */}
          <div className="flex-1 overflow-y-auto pr-2">
            {filteredBusinessTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No business types found matching "{searchQuery}"</p>
              </div>
            ) : isEditMode ? (
              // Single Radio.Group for all categories in edit mode
              <Radio.Group
                value={businessTypeValue || undefined}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setValue("type", newValue, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredBusinessTypes.map((group) => (
                    <div
                      key={`${group.category}-${businessTypeValue}`}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h3 className="text-base font-semibold text-black mb-3">
                        {group.category}
                      </h3>
                      <div className="space-y-2">
                        {group.subcategories.map((sub) => (
                          <Radio
                            key={sub.type}
                            value={sub.type}
                            className="w-full py-1"
                          >
                            <span className="text-sm">{sub.label}</span>
                          </Radio>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Radio.Group>
            ) : (
              // Checkbox.Group per category in create mode
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBusinessTypes.map((group) => {
                  // Get all subcategory types for this group
                  const groupSubcategoryTypes = group.subcategories.map(
                    (sub) => sub.type
                  );
                  // Filter businessType to only include values from this group
                  const groupSelectedValues = businessType.filter((type) =>
                    groupSubcategoryTypes.includes(type)
                  );
                  // Get all selected values from other groups
                  const otherGroupsSelectedValues = businessType.filter(
                    (type) => !groupSubcategoryTypes.includes(type)
                  );

                  return (
                    <div
                      key={group.category}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h3 className="text-base font-semibold text-black mb-3">
                        {group.category}
                      </h3>
                      <Checkbox.Group
                        value={groupSelectedValues}
                        onChange={(checkedValues) => {
                          // Merge checked values from this group with values from other groups
                          const allSelectedValues = [
                            ...otherGroupsSelectedValues,
                            ...(checkedValues as string[]),
                          ];
                          setValue("type", allSelectedValues, {
                            shouldValidate: true,
                          });
                        }}
                        className="w-full"
                      >
                        <div className="space-y-2">
                          {group.subcategories.map((sub) => (
                            <Checkbox
                              key={sub.type}
                              value={sub.type}
                              className="w-full py-1"
                            >
                              <span className="text-sm">{sub.label}</span>
                            </Checkbox>
                          ))}
                        </div>
                      </Checkbox.Group>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
            <Button onClick={() => setShowBusinessTypeModal(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDetailsForm;
