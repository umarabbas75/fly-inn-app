/* eslint-disable react/jsx-props-no-spreading */
import { useApiGet } from "@/http-service";
import React, { memo, useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Checkbox, Button, Row, Col, message, Collapse } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { GetProp } from "antd";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { FieldLabel } from "@/components/shared/FieldLabel";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

// Types for the admin features API structure
interface SubFeature {
  id: number;
  name: string;
  feature_id: number;
}

interface Feature {
  id: number;
  heading: string;
  sub_heading: SubFeature[];
  created_at: string;
  updated_at: string;
}

/**
 * A form field component for handling features and sub-features with the new backend structure.
 * It uses react-hook-form's useFieldArray for dynamic field management.
 */
const Features = () => {
  const { data: featuresData, isLoading } = useApiGet({
    endpoint: `/api/admin/features`,
    queryKey: ["features"],
    config: {
      select: (data: any) => {
        // The admin API returns the array directly or wrapped in data
        return (data?.data || data || []) as Feature[];
      },
    },
  });

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchFieldArray = watch("features");
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "features",
  });

  // Type assertion for features errors
  const featuresErrors = (errors.features as any) || [];

  // Combine field metadata and watched values for each feature
  const featuresList = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray?.[index],
    };
  });

  const handleFeatureChange = (index: number, featureId: number) => {
    // Find the selected feature and its sub-features
    const selectedFeature = featuresData?.find(
      (item: Feature) => item.id === featureId
    );

    if (!selectedFeature) {
      message.error("Selected feature not found");
      return;
    }

    // Update the feature in the field array
    update(index, {
      ...featuresList[index],
      feature_id: featureId,
      feature_name: selectedFeature.heading,
      sub_features: [], // Reset sub-features selection
      available_sub_features: selectedFeature.sub_heading,
    });
  };

  const handleSubFeaturesChange = (index: number, checkedValues: string[]) => {
    // Update the sub_features in the field array
    update(index, {
      ...featuresList[index],
      sub_features: checkedValues,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-3 md:p-6" id="features">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-6" id="features">
      <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Features
      </h2>

      <div className="text-gray-600 mb-6">
        Select features and sub-features that your property offers to guests
      </div>

      {featuresList?.map((feature, index) => {
        const availableSubFeatures = feature.available_sub_features || [];
        const selectedSubFeatures = feature.sub_features || [];

        // Get the selected feature name for the accordion header
        const selectedFeature = featuresData?.find(
          (f: Feature) => f.id === feature.feature_id
        );
        const accordionTitle =
          selectedFeature?.heading || `Feature ${index + 1}`;

        return (
          <Collapse
            key={feature.id}
            className="mb-4"
            defaultActiveKey={[`panel-${index}`]}
            expandIconPosition="end"
          >
            <Collapse.Panel
              header={
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base">
                    {accordionTitle}
                  </span>
                  {!feature.feature_id && (
                    <span className="text-sm text-gray-500 mx-2">
                      (Select a feature)
                    </span>
                  )}
                </div>
              }
              key={`panel-${index}`}
              extra={
                featuresList?.length > 1 ? (
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(index);
                    }}
                    className="!bg-red-600 hover:!bg-red-700 !text-white"
                  >
                    Remove
                  </Button>
                ) : null
              }
            >
              <div className="p-4">
                <div className="grid grid-cols-1 gap-x-6 gap-y-3">
                  {/* Feature Dropdown */}
                  <div className="flex flex-col justify-between">
                    <FieldLabel label="Select Feature" required={true} />
                    <p className="text-sm text-gray-500 mb-3">
                      Choose a main feature category
                    </p>
                    <Controller
                      name={`features[${index}].feature_id`}
                      control={control}
                      rules={{ required: "Please select a feature" }}
                      render={({ field }) => {
                        const availableFeaturesOptions = useMemo<
                          SearchableSelectOption[]
                        >(() => {
                          return (
                            featuresData
                              ?.filter(
                                (option: Feature) =>
                                  !featuresList?.some(
                                    (feature, featureIndex) =>
                                      feature.feature_id === option.id &&
                                      featureIndex !== index
                                  )
                              )
                              ?.map((option: Feature) => ({
                                value: String(option.id),
                                label: option.heading,
                              })) || []
                          );
                        }, [featuresData, featuresList, index]);

                        return (
                          <FormFieldWrapper
                            error={featuresErrors?.[index]?.feature_id}
                          >
                            <SearchableSelect
                              value={
                                field.value ? String(field.value) : undefined
                              }
                              onValueChange={(val) => {
                                const newValue =
                                  typeof val === "string"
                                    ? Number(val)
                                    : Array.isArray(val)
                                    ? Number(val[0])
                                    : undefined;
                                field.onChange(newValue);
                                if (newValue) {
                                  handleFeatureChange(index, newValue);
                                }
                              }}
                              options={availableFeaturesOptions}
                              placeholder="Select a feature"
                              error={!!featuresErrors?.[index]?.feature_id}
                              showSearch={false}
                            />
                          </FormFieldWrapper>
                        );
                      }}
                    />
                  </div>

                  {/* Sub Features Checkboxes */}
                  {availableSubFeatures.length > 0 && (
                    <div className="flex flex-col justify-between">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Features
                      </label>
                      <p className="text-sm text-gray-500 mb-3">
                        Select specific sub-features within this category
                      </p>
                      <Controller
                        name={`features[${index}].sub_features`}
                        control={control}
                        render={({ field }) => (
                          <FormFieldWrapper
                            error={featuresErrors?.[index]?.sub_features}
                          >
                            <CheckboxGroup
                              options={availableSubFeatures}
                              value={selectedSubFeatures}
                              onChange={(checkedValues) =>
                                handleSubFeaturesChange(index, checkedValues)
                              }
                            />
                          </FormFieldWrapper>
                        )}
                      />
                    </div>
                  )}

                  {/* Show message if no sub-features available */}
                  {feature.feature_id && availableSubFeatures.length === 0 && (
                    <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <i className="fa fa-info-circle mr-2"></i>
                      No sub-features available for this feature category.
                    </div>
                  )}
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
        );
      })}

      {/* Add More Feature Button */}
      <Button
        type="dashed"
        size="large"
        onClick={() => {
          append({
            feature_id: "",
            feature_name: "",
            sub_features: [],
            available_sub_features: [],
          });
        }}
        className="w-full border-2 border-dashed border-gray-300 py-4"
      >
        + Add More Feature
      </Button>
    </div>
  );
};

export default memo(Features);

// Ant Design Checkbox.Group component for sub-features
const CheckboxGroup: React.FC<{
  options: SubFeature[];
  value: string[];
  onChange: (checkedValues: string[]) => void;
}> = ({ options, value = [], onChange }) => {
  const handleChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    onChange(checkedValues as string[]);
  };

  return (
    <Checkbox.Group
      style={{ width: "100%" }}
      onChange={handleChange}
      value={value}
    >
      <Row gutter={[16, 16]}>
        {options.map((option) => (
          <Col span={8} key={option.id}>
            <Checkbox value={option.id}>{option.name}</Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
};
