"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Select } from "antd";

const { Option } = Select;

/* ─────────────────────────
   Static option sets
   ───────────────────────── */
const airportUseOptions = [
  { label: "Public", value: "Public", key: 1 },
  { label: "Private", value: "Private", key: 2 },
  {
    label: "Private – permission required to land",
    value: "Private – permission required to land",
    key: 3,
  },
];

const patternOptions = [
  { label: "Left, Left", value: "left, left", key: 1 },
  { label: "Left, Right", value: "left, right", key: 2 },
  { label: "Right, Left", value: "right, left", key: 3 },
  { label: "Right, Right", value: "right, right", key: 4 },
];

const runwaySurfaceOptions = [
  { value: "Asphalt", label: "Asphalt", key: 1 },
  { value: "Concrete", label: "Concrete", key: 2 },
  { value: "Grass", label: "Grass", key: 3 },
  { value: "Gravel", label: "Gravel", key: 4 },
  { value: "Ice", label: "Ice", key: 5 },
  { value: "Sand", label: "Sand", key: 6 },
  { value: "Snow", label: "Snow", key: 7 },
  { value: "Water", label: "Water", key: 8 },
  { value: "Turf", label: "Turf", key: 9 },
  { value: "Other", label: "Other", key: 10 },
];

const fuelOptions = [
  { value: "100LL", label: "100LL" },
  { value: "Jet-A", label: "Jet-A" },
  { value: "Jet-A1", label: "Jet-A1" },
  { value: "Jet-A+", label: "Jet-A+" },
  { value: "Jet-B", label: "Jet-B" },
  { value: "MoGas", label: "MoGas" },
  { value: "UL94", label: "UL94" },
  { value: "other", label: "Other" },
];

const parkingOptions = [
  { label: "Hangar", value: "Hangar", key: 1 },
  { label: "Hangar and Tie-downs", value: "Hangar and Tie-downs", key: 2 },
  { label: "Tie-downs", value: "Tie-downs", key: 3 },
  {
    label: "Bring your own tie-downs",
    value: "Bring your own tie-downs",
    key: 4,
  },
  { label: "Mooring at the house", value: "Mooring at the house", key: 5 },
];

const groundTransportOptions = [
  {
    label: "We have a courtesy vehicle waiting for you!",
    value: "We have a courtesy vehicle waiting for you!",
    key: 2,
  },
  {
    label: "We have a vehicle you can rent from us!",
    value: "We have a vehicle you can rent from us!",
    key: 3,
  },
  {
    label: "Rent a vehicle right in the airport! Their phone number is:",
    value: "Rent a vehicle right in the airport! Their phone number is:",
    key: 4,
  },
  {
    label: "We will give you a ride to the nearest rental vehicle agency!",
    value: "We will give you a ride to the nearest rental vehicle agency!",
    key: 5,
  },
  {
    label:
      "We have a deal with the FBO so you can keep the vehicle your whole stay!",
    value:
      "We have a deal with the FBO so you can keep the vehicle your whole stay!",
    key: 6,
  },
  {
    label: "You don’t need a vehicle here!",
    value: "You don't need a vehicle here!",
    key: 7,
  },
];

/* Helper to cut down repetitive <Option /> markup */
const renderOptions = <
  T extends { value: string; label: string; key?: number }
>(
  opts: T[]
) =>
  opts.map((o) => (
    <Option key={o.key ?? o.value} value={o.value}>
      {o.label}
    </Option>
  ));

/* ─────────────────────────
   Component
   ───────────────────────── */
const Step4AirportMoreDetails: React.FC = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const fuelAvailability = watch("fuelAvailability");
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        <span>A bit more about the </span>
        <span className="text-red-600">Airport</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Airport Identifier */}
        <div className="col-span-2 flex flex-col">
          <label className="text-sm text-gray-500 mb-2">
            Airport Identifier
          </label>
          <Controller
            name="airportIdentifier"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Identifier" />
            )}
          />
          {errors.airportIdentifier && (
            <p className="text-red-500 text-xs">
              {errors.airportIdentifier.message?.toString()}
            </p>
          )}
        </div>

        {/* Airport Name */}
        <div className="col-span-2 flex flex-col">
          <label className="text-sm text-gray-500 mb-2">Airport Name</label>
          <Controller
            name="airportName"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Name" />}
          />
          {errors.airportName && (
            <p className="text-red-500 text-xs">
              {errors.airportName.message?.toString()}
            </p>
          )}
        </div>

        {/* Airport Type */}
        <div className="flex flex-col col-span-2">
          <label className="text-sm text-gray-500 mb-2">Airport Type</label>
          <Controller
            name="airportType"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select" allowClear>
                {renderOptions(airportUseOptions)}
              </Select>
            )}
          />
          {errors.airportType && (
            <p className="text-red-500 text-xs">
              {errors.airportType.message?.toString()}
            </p>
          )}
        </div>

        {/* Operation Hours */}
        <div className="col-span-2 flex flex-col">
          <label className="text-sm text-gray-500 mb-2">Operation Hours</label>
          <Controller
            name="operationHours"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="e.g. 0600-1900 LT" />
            )}
          />
          {errors.operationHours && (
            <p className="text-red-500 text-xs">
              {errors.operationHours.message?.toString()}
            </p>
          )}
        </div>

        {/* Lighting */}
        <div className="flex flex-col col-span-2">
          <label className="text-sm text-gray-500 mb-2">Lighting</label>
          <Controller
            name="lighting"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select">
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            )}
          />
          {errors.lighting && (
            <p className="text-red-500 text-xs">
              {errors.lighting.message?.toString()}
            </p>
          )}
        </div>

        {/* CTAF / UNICOM */}
        <div className="col-span-2 flex flex-col">
          <label className="text-sm text-gray-500 mb-2">CTAF / UNICOM</label>
          <Controller
            name="ctafUnicom"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Frequency" />}
          />
          {errors.ctafUnicom && (
            <p className="text-red-500 text-xs">
              {errors.ctafUnicom.message?.toString()}
            </p>
          )}
        </div>

        {/* Fuel Availability */}
        <div className="flex flex-col col-span-3">
          <label className="text-sm text-gray-500 mb-2">
            Fuel Availability
          </label>
          <Controller
            name="fuelAvailability"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select">
                {renderOptions(fuelOptions)}
              </Select>
            )}
          />
          {errors.fuelAvailability && (
            <p className="text-red-500 text-xs">
              {errors.fuelAvailability.message?.toString()}
            </p>
          )}
        </div>
        <div className="col-span-3">
          {fuelAvailability === "other" && (
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">
                Other Fuel Type
              </label>
              <Controller
                name="otherFuel"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Type" />}
              />
              {errors.otherFuel && (
                <p className="text-red-500 text-xs">
                  {errors.otherFuel.message?.toString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Parking Availability */}
        <div className="flex flex-col col-span-3">
          <label className="text-sm text-gray-500 mb-2">
            Parking Availability
          </label>
          <Controller
            name="parkingAvailability"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select">
                {renderOptions(parkingOptions)}
              </Select>
            )}
          />
          {errors.parkingAvailability && (
            <p className="text-red-500 text-xs">
              {errors.parkingAvailability.message?.toString()}
            </p>
          )}
        </div>

        {/* Runway Pattern */}
        <div className="flex flex-col col-span-3">
          <label className="text-sm text-gray-500 mb-2">Runway Pattern</label>
          <Controller
            name="runwayPattern"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select">
                {renderOptions(patternOptions)}
              </Select>
            )}
          />
          {errors.runwayPattern && (
            <p className="text-red-500 text-xs">
              {errors.runwayPattern.message?.toString()}
            </p>
          )}
        </div>

        {/* AirNav Link */}
        <div className="flex flex-col col-span-3">
          <label className="text-sm text-gray-500 mb-2">AirNav Link</label>
          <Controller
            name="airnavLink"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="https://airnav.com/airport/" />
            )}
          />
          {errors.airnavLink && (
            <p className="text-red-500 text-xs">
              {errors.airnavLink.message?.toString()}
            </p>
          )}
        </div>

        {/* Ground Transport */}
        <div className="flex flex-col col-span-6">
          <label className="text-sm text-gray-500 mb-2">
            Ground Transportation Availability
          </label>
          <Controller
            name="groundTransportation"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select">
                {renderOptions(groundTransportOptions)}
              </Select>
            )}
          />
          {errors.groundTransportation && (
            <p className="text-red-500 text-xs">
              {errors.groundTransportation.message?.toString()}
            </p>
          )}
        </div>

        {/* Helicopter Landing */}
        <div className="flex flex-col col-span-3">
          <label className="text-sm text-gray-500 mb-2">
            Helicopter Landing Availability
          </label>
          <Controller
            name="helicopterLanding"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select">
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            )}
          />
          {errors.helicopterLanding && (
            <p className="text-red-500 text-xs">
              {errors.helicopterLanding.message?.toString()}
            </p>
          )}
        </div>

        {/* Runway Surface */}
        <div className="flex flex-col col-span-3">
          <label className="text-sm text-gray-500 mb-2">Runway Surface</label>
          <Controller
            name="runwayCondition"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select">
                {renderOptions(runwaySurfaceOptions)}
              </Select>
            )}
          />
          {errors.runwayCondition && (
            <p className="text-red-500 text-xs">
              {errors.runwayCondition.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step4AirportMoreDetails;
