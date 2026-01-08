import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Input, Button, Card } from "antd";
import { PlusOutlined, DeleteOutlined, TagOutlined } from "@ant-design/icons";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";

const DiscountsForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "discounts",
  });

  const discountErrors = (errors.discounts as any) || [];

  const addDiscount = () => {
    append({ title: "", description: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-6" id="discounts">
      <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
        <TagOutlined className="mr-2" />
        Available Discounts
      </h2>

      <div className="text-gray-600 mb-6">
        Add any special discounts or offers you provide to customers (Optional)
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <TagOutlined className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No discounts added yet</p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addDiscount}
            className="bg-[#AF2322] hover:bg-[#9e1f1a]"
          >
            Add Discount
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card
                key={field.id}
                className="shadow-sm"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Discount {index + 1}
                  </h3>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(index)}
                    className="hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Title <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name={`discounts.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <FormFieldWrapper
                          error={discountErrors?.[index]?.title}
                        >
                          <Input
                            {...field}
                            size="large"
                            placeholder="e.g., 10% Off, Early Bird Special"
                            status={discountErrors?.[index]?.title ? "error" : ""}
                            className="w-full"
                          />
                        </FormFieldWrapper>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name={`discounts.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <FormFieldWrapper
                          error={discountErrors?.[index]?.description}
                        >
                          <Input.TextArea
                            {...field}
                            size="large"
                            placeholder="e.g., First time customers, 5% off on 100+ gallons"
                            status={discountErrors?.[index]?.description ? "error" : ""}
                            className="w-full"
                            rows={3}
                          />
                        </FormFieldWrapper>
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addDiscount}
            className="w-full mt-4"
            size="large"
          >
            Add Another Discount
          </Button>
        </>
      )}
    </div>
  );
};

export default DiscountsForm;






