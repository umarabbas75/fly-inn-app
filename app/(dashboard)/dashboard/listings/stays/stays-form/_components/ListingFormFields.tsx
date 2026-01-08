import React, { memo, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { useApiGet } from "@/http-service";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface ListingFormFieldsProps {
  showHostSelector?: boolean;
}

/**
 * A form field component for selecting the listing type using react-hook-form
 * and styled with Ant Design components and Tailwind CSS.
 * This component is memoized for performance.
 */
const ListingFormFields = ({
  showHostSelector = false,
}: ListingFormFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Access form context for form state

  // Fetch users for host selector (only when showHostSelector is true)
  const { data: usersData } = useApiGet({
    endpoint: "/api/admin/users/all",
    queryKey: ["admin-users"],
    config: {
      enabled: showHostSelector,
    },
  });

  const users = usersData?.users || [];

  // Transform users into SearchableSelect options
  const userOptions = useMemo(() => {
    return users.map((user: any) => {
      const displayName =
        user.display_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.email ||
        "N/A";

      return {
        value: user.id,
        label: `${displayName} (${user.email})`,
      };
    });
  }, [users]);

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 md:p-6"
      id="listing-form-fields"
    >
      <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Listing Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Title Field */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Property Title" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Format: (Airport Identifier) Airport Name - Title
          </p>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="(KJFK) John F. Kennedy Airport - Luxury Villa"
                status={errors?.title ? "error" : ""}
                className="w-full"
                suffix={
                  <InfoCircleOutlined
                    className="text-blue-500 cursor-help"
                    title="Please enter the airport identifier in parentheses, then a space, then the name of the airport, then space hyphen space, and then the title of your choice."
                  />
                }
              />
            )}
          />
        </div>

        {/* Host Selector (only shown when showHostSelector is true) */}
        {showHostSelector && (
          <div className="flex flex-col justify-between">
            <FieldLabel label="Assign Host" required={true} />
            <p className="text-sm text-gray-500 mb-3">
              Select the user who will host this property
            </p>
            <Controller
              name="host_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={userOptions}
                  placeholder="Select a host"
                  searchPlaceholder="Search hosts..."
                  error={!!errors?.host_id}
                  showSearch={false}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ListingFormFields);
