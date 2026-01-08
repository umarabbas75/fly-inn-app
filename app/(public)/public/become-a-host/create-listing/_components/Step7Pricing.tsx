"use client";

import { Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Option } = Select;

const timeOptions = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

const Step7Pricing = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        Let’s Talk about the <span className="text-red-600">Pricing</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Per Night */}
        <div>
          <label className="text-sm text-gray-500 mb-1">Price Per Night</label>
          <Controller
            name="pricePerNight"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="100"
                type="number"
                min={0}
                addonBefore="$"
              />
            )}
          />
          <div className="text-xs text-gray-400 mt-1">
            Set your nightly base price. This is the amount guests will pay per
            night.
          </div>
          {errors?.pricePerNight && (
            <span className="text-red-500 text-sm">
              {errors.pricePerNight.message?.toString()}
            </span>
          )}
        </div>
        {/* Apply Weekend Price? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">
            Apply Weekend Price?
          </label>
          <Controller
            name="applyWeekendPrice"
            control={control}
            defaultValue={"No"}
            render={({ field }) => (
              <Select {...field}>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
              </Select>
            )}
          />
          {errors?.applyWeekendPrice && (
            <span className="text-red-500 text-sm">
              {errors.applyWeekendPrice.message?.toString()}
            </span>
          )}
        </div>
        {/* Price Per Night (7+ Nights) */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">
            Price Per Night (If Booked for 7+ Nights)
          </label>
          <Controller
            name="pricePerWeek"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="100"
                type="number"
                min={0}
                addonBefore="$"
              />
            )}
          />
          <div className="text-xs text-gray-400 mt-1">
            Discounted nightly price for bookings of 7 nights or more.
          </div>
          {errors?.pricePerWeek && (
            <span className="text-red-500 text-sm">
              {errors.pricePerWeek.message?.toString()}
            </span>
          )}
        </div>
        {/* Price Per Night (30+ Nights) */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">
            Price Per Night (If Booked for 30+ Nights)
          </label>
          <Controller
            name="pricePerMonth"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="80"
                type="number"
                min={0}
                addonBefore="$"
              />
            )}
          />
          <div className="text-xs text-gray-400 mt-1">
            Special nightly rate for stays of 30 nights or more.
          </div>
          {errors?.pricePerMonth && (
            <span className="text-red-500 text-sm">
              {errors.pricePerMonth.message?.toString()}
            </span>
          )}
        </div>
        {/* Additional Guests? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">
            Additional Guests?
          </label>
          <Controller
            name="additionalGuests"
            control={control}
            defaultValue={"No"}
            render={({ field }) => (
              <Select {...field}>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
              </Select>
            )}
          />
          {errors?.additionalGuests && (
            <span className="text-red-500 text-sm">
              {errors.additionalGuests.message?.toString()}
            </span>
          )}
        </div>
        {/* City Fee (Per Night) */}
        <div>
          <label className="text-sm text-gray-500 mb-1">City Fee</label>
          <Controller
            name="cityFee"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="10"
                addonBefore="$"
                type="number"
                min={0}
              />
            )}
          />
          {errors?.cityFee && (
            <span className="text-red-500 text-sm">
              {errors.cityFee.message?.toString()}
            </span>
          )}
        </div>
        {/* Tax % */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Tax %</label>
          <Controller
            name="tax"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="10"
                type="number"
                min={0}
                max={100}
                addonAfter="%"
              />
            )}
          />
          {errors?.tax && (
            <span className="text-red-500 text-sm">
              {errors.tax.message?.toString()}
            </span>
          )}
        </div>
        {/* Cleaning Fee (Per Stay) */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Cleaning Fee</label>
          <Controller
            name="cleaningFee"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="20"
                type="number"
                min={0}
                addonBefore="$"
              />
            )}
          />
          <div className="text-xs text-gray-400 mt-1">
            Optional one-time cleaning fee charged per booking.
          </div>
          {errors?.cleaningFee && (
            <span className="text-red-500 text-sm">
              {errors.cleaningFee.message?.toString()}
            </span>
          )}
        </div>
        {/* Extra Services? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Extra Services?</label>
          <Controller
            name="extraServices"
            control={control}
            defaultValue={"No"}
            render={({ field }) => (
              <Select {...field}>
                <Option value="No">No</Option>
                <Option value="Yes">Yes</Option>
              </Select>
            )}
          />
          {errors?.extraServices && (
            <span className="text-red-500 text-sm">
              {errors.extraServices.message?.toString()}
            </span>
          )}
        </div>
        {/* Minimum Days of Booking? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">
            Minimum Days of Booking?
          </label>
          <Controller
            name="minDays"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <Select {...field}>
                {[...Array(30)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            )}
          />
          <div className="text-xs text-gray-400 mt-1">
            Guests must book at least this many days.
          </div>

          {errors?.minDays && (
            <span className="text-red-500 text-sm">
              {errors.minDays.message?.toString()}
            </span>
          )}
        </div>
        {/* Maximum Days of Booking? */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">
            Maximum Days of Booking?
          </label>

          <Controller
            name="maxDays"
            control={control}
            defaultValue={30}
            render={({ field }) => (
              <Select {...field}>
                {[...Array(365)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            )}
          />
          <div className="text-xs text-gray-400 mt-1">
            Guests cannot book for more than this many days in a single
            reservation.
          </div>
          {errors?.maxDays && (
            <span className="text-red-500 text-sm">
              {errors.maxDays.message?.toString()}
            </span>
          )}
        </div>
        {/* Check-In Time */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Check-In Time</label>
          <Controller
            name="checkInTime"
            control={control}
            defaultValue={"10:00 AM"}
            render={({ field }) => (
              <Select {...field}>
                {timeOptions.map((time) => (
                  <Option key={time} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors?.checkInTime && (
            <span className="text-red-500 text-sm">
              {errors.checkInTime.message?.toString()}
            </span>
          )}
        </div>
        {/* Check-Out Time */}
        <div className="flex flex-col gap-0">
          <label className="text-sm text-gray-500 mb-1">Check-Out Time</label>
          <Controller
            name="checkOutTime"
            control={control}
            defaultValue={"11:00 AM"}
            render={({ field }) => (
              <Select {...field}>
                {timeOptions.map((time) => (
                  <Option key={time} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors?.checkOutTime && (
            <span className="text-red-500 text-sm">
              {errors.checkOutTime.message?.toString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step7Pricing;
