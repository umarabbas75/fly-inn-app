"use client";

import { Select, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Option } = Select;

const rulesOptions = [
  "No smoking",
  "No pets",
  "No parties",
  "No loud noise after 10pm",
  "No outside visitors",
];

const guestInstructionOptions = [
  "Lock the door when leaving",
  "Take out trash before checkout",
  "No shoes inside",
  "Turn off lights when not in use",
];

const Step8RulesInstructions = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        Let’s Set the <span className="text-red-600">Rules</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smoking Allowed? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Smoking Allowed?</label>
          <Controller
            name="smokingAllowed"
            control={control}
            defaultValue={"No"}
            render={({ field }) => (
              <Select {...field}>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
              </Select>
            )}
          />
          {errors?.smokingAllowed && (
            <span className="text-red-500 text-sm">
              {errors.smokingAllowed.message?.toString()}
            </span>
          )}
        </div>
        {/* Pets Allowed? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Pets Allowed?</label>
          <Controller
            name="petsAllowed"
            control={control}
            defaultValue={"No"}
            render={({ field }) => (
              <Select {...field}>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
              </Select>
            )}
          />
          {errors?.petsAllowed && (
            <span className="text-red-500 text-sm">
              {errors.petsAllowed.message?.toString()}
            </span>
          )}
        </div>
        {/* Parties Allowed? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Parties Allowed?</label>
          <Controller
            name="partiesAllowed"
            control={control}
            defaultValue={"No"}
            render={({ field }) => (
              <Select {...field}>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
              </Select>
            )}
          />
          {errors?.partiesAllowed && (
            <span className="text-red-500 text-sm">
              {errors.partiesAllowed.message?.toString()}
            </span>
          )}
        </div>
        {/* Children Allowed? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Children Allowed?</label>
          <Controller
            name="childrenAllowed"
            control={control}
            defaultValue={"No"}
            render={({ field }) => (
              <Select {...field}>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
              </Select>
            )}
          />
          {errors?.childrenAllowed && (
            <span className="text-red-500 text-sm">
              {errors.childrenAllowed.message?.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Select Rules */}
      <div className="flex flex-col gap-0 mt-6">
        <label className="text-sm text-gray-500 mb-1">Select Rules</label>
        <Controller
          name="selectedRules"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Select {...field} mode="multiple" placeholder="Select">
              {rulesOptions.map((rule) => (
                <Option key={rule} value={rule}>
                  {rule}
                </Option>
              ))}
            </Select>
          )}
        />
        <div className="text-xs text-gray-400 mt-1">Choose all rules that apply to your property.</div>
        {errors?.selectedRules && (
          <span className="text-red-500 text-sm">
            {errors.selectedRules.message?.toString()}
          </span>
        )}
      </div>

      {/* Edit Rules */}
      <div className="flex flex-col gap-0 mt-6">
        <label className="text-sm text-gray-500 mb-1">Edit Rules</label>
        <Controller
          name="editRules"
          control={control}
          defaultValue={""}
          render={({ field }) => (
            <Input.TextArea {...field} rows={3} placeholder="Edit Rules" />
          )}
        />
        <div className="text-xs text-gray-400 mt-1">Add any custom rules or clarifications for your guests.</div>
        {errors?.editRules && (
          <span className="text-red-500 text-sm">
            {errors.editRules.message?.toString()}
          </span>
        )}
      </div>

      {/* Instructions to the Guest */}
      <div className="flex flex-col gap-0 mt-6">
        <label className="text-sm text-gray-500 mb-1">
          Instructions to the Guest
          <span className="text-xs text-gray-400 ml-2">
            (These will be sent to the Guest once booking is confirmed)
          </span>
        </label>
        <Controller
          name="guestInstructions"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Select {...field} mode="multiple" placeholder="Select">
              {guestInstructionOptions.map((inst) => (
                <Option key={inst} value={inst}>
                  {inst}
                </Option>
              ))}
            </Select>
          )}
        />
        {errors?.guestInstructions && (
          <span className="text-red-500 text-sm">
            {errors.guestInstructions.message?.toString()}
          </span>
        )}
      </div>

      {/* Edit Instructions */}
      <div className="flex flex-col gap-0 mt-6">
        <label className="text-sm text-gray-500 mb-1">Edit Instructions</label>
        <Controller
          name="editInstructions"
          control={control}
          defaultValue={""}
          render={({ field }) => (
            <Input.TextArea {...field} rows={3} placeholder="Edit Instructions" />
          )}
        />
        <div className="text-xs text-gray-400 mt-1">Add any additional instructions for your guests here.</div>
        {errors?.editInstructions && (
          <span className="text-red-500 text-sm">
            {errors.editInstructions.message?.toString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default Step8RulesInstructions;
