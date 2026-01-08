"use client";

import { Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Option } = Select;

const Step6Accommodation = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        Let’s Talk about the <span className="text-red-600">Accommodation</span>
      </h1>

      {/* Type of Place */}
      <div>
        <label className="block font-medium mb-1">Type of Place</label>
        <Controller
          name="typeOfPlace"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select {...field} placeholder="Select" className="w-full">
              <Option value="apartment">Apartment</Option>
              <Option value="house">House</Option>
              <Option value="villa">Villa</Option>
              <Option value="guesthouse">Guesthouse</Option>
              <Option value="other">Other</Option>
            </Select>
          )}
        />
        {errors?.typeOfPlace && (
          <span className="text-red-500 text-sm">
            {errors.typeOfPlace.message?.toString()}
          </span>
        )}
      </div>

      {/* Title of Place */}
      <div>
        <label className="block font-medium mb-1">Title of Place</label>
        <Controller
          name="placeTitle"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} placeholder="Airport Name - Title" />
          )}
        />
        {errors?.placeTitle && (
          <span className="text-red-500 text-sm">
            {errors.placeTitle.message?.toString()}
          </span>
        )}
      </div>

      {/* Guests, Bedrooms, Beds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">Number of guests</label>
          <Controller
            name="guests"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <Select {...field}>
                {[...Array(16)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors?.guests && (
            <span className="text-red-500 text-sm">
              {errors.guests.message?.toString()}
            </span>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Number of Bedrooms</label>
          <Controller
            name="bedrooms"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <Select {...field}>
                {[...Array(10)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors?.bedrooms && (
            <span className="text-red-500 text-sm">
              {errors.bedrooms.message?.toString()}
            </span>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Number of beds</label>
          <Controller
            name="beds"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <Select {...field}>
                {[...Array(10)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors?.beds && (
            <span className="text-red-500 text-sm">
              {errors.beds.message?.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Total Rooms, Bathrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            Number of Total Rooms
          </label>
          <Controller
            name="totalRooms"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <Select {...field}>
                {[...Array(20)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors?.totalRooms && (
            <span className="text-red-500 text-sm">
              {errors.totalRooms.message?.toString()}
            </span>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Number of bathrooms</label>
          <Controller
            name="bathrooms"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <Select {...field}>
                {[...Array(10)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors?.bathrooms && (
            <span className="text-red-500 text-sm">
              {errors.bathrooms.message?.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Size and Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            Size of the Accommodation
          </label>
          <Controller
            name="size"
            control={control}
            defaultValue={0}
            render={({ field }) => <Input {...field} type="number" min={0} />}
          />
          {errors?.size && (
            <span className="text-red-500 text-sm">
              {errors.size.message?.toString()}
            </span>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Unit of Measurement</label>
          <Controller
            name="unit"
            control={control}
            defaultValue="sq/ft"
            render={({ field }) => (
              <Select {...field}>
                <Option value="sq/ft">sq/ft</Option>
                <Option value="sq/m">sq/m</Option>
              </Select>
            )}
          />
          {errors?.unit && (
            <span className="text-red-500 text-sm">
              {errors.unit.message?.toString()}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">
          Describe your place to the Guests
        </label>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input.TextArea {...field} rows={5} placeholder="Description" />
          )}
        />
        {errors?.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message?.toString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default Step6Accommodation;
