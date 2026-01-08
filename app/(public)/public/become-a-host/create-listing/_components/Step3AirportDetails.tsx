"use client";

import {
  Slider,
  Input,
  Select,
  Button,
  Checkbox,
  Divider,
  SliderSingleProps,
} from "antd";
import { EnvironmentOutlined, ArrowsAltOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";

const runwaySurfaces = [
  "Asphalt",
  "Concrete",
  "Grass",
  "Gravel",
  "Ice",
  "Sand",
  "Snow",
  "Water",
  "Turf",
  "Other",
];

const Step3AirportDetails = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Watch distance for live slider label
  const distance = watch("distance") ?? 1;
  const elevationUnitA = watch("elevationUnitA");
  const elevationMin = watch("elevationMin");
  const elevationMax = watch("elevationMax");
  const length = watch("length");
  const width = watch("width");

  console.log({ elevationUnitA, elevationMin, elevationMax });

  const marks: SliderSingleProps["marks"] = {
    1: "0 mile",
    2: "1 mile",
    3: "2 mile",
    4: "3 mile",
    5: "4 mile",
    6: "5 mile",
    7: "6 mile",
    8: "7 mile",
    9: "8+ mile",
    // 100: {
    //   style: {
    //     color: "#f50",
    //   },
    //   label: <strong>100°C</strong>,
    // },
  };
  const { Option } = Select;

  // Utility to round to two decimal places
  const round2 = (val: number) => Math.round(val * 100) / 100;

  const handleUnitChange = (newUnit: "ft" | "m") => {
    if (newUnit === "m") {
      // Convert feet to meters
      setValue("elevationMin", elevationMin !== "" && !isNaN(Number(elevationMin)) ? round2(Number(elevationMin) * 0.3048) : "");
      setValue("elevationMax", elevationMax !== "" && !isNaN(Number(elevationMax)) ? round2(Number(elevationMax) * 0.3048) : "");
    } else if (newUnit === "ft") {
      // Convert meters to feet
      setValue("elevationMin", elevationMin !== "" && !isNaN(Number(elevationMin)) ? round2(Number(elevationMin) / 0.3048) : "");
      setValue("elevationMax", elevationMax !== "" && !isNaN(Number(elevationMax)) ? round2(Number(elevationMax) / 0.3048) : "");
    }
  };

  const handleDimensionUnitChange = (newUnit: "ft" | "m") => {
    if (newUnit === "m") {
      // Convert feet to meters
      setValue("length", length !== "" && !isNaN(Number(length)) ? round2(Number(length) * 0.3048) : "");
      setValue("width", width !== "" && !isNaN(Number(width)) ? round2(Number(width) * 0.3048) : "");
    } else if (newUnit === "ft") {
      // Convert meters to feet
      setValue("length", length !== "" && !isNaN(Number(length)) ? round2(Number(length) / 0.3048) : "");
      setValue("width", width !== "" && !isNaN(Number(width)) ? round2(Number(width) / 0.3048) : "");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      <div className="flex items-center mb-4">
        <EnvironmentOutlined className="text-xl " />
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Tell us about the <span className="text-red-600">Landing</span>
        </h1>
      </div>

      {/* Distance Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          <ArrowsAltOutlined className="mr-2" />
          Distance from your place to the Airstrip
        </h2>
        <div className="flex flex-col items-start justify-center">
          <Controller
            name="distance"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <>
                <Slider
                  min={1}
                  max={8}
                  step={1}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full max-w-[500px]"
                  marks={marks}
                  tooltip={{ open: false }}
                />
                {errors.distance && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.distance.message?.toString()}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Elevation Range */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Elevation Range
        </h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Point A</p>
            <Controller
              name="elevationMin"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    placeholder="Point A"
                    className="w-28"
                    type="number"
                    addonAfter={
                      <Controller
                        name="elevationUnitA"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            onChange={(value) => {
                              console.log("value", value);
                              handleUnitChange(value);
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <Option value="ft">ft</Option>
                            <Option value="m">m</Option>
                          </Select>
                        )}
                      />
                    }
                  />
                  {errors.elevationMin && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.elevationMin.message?.toString()}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Point B</p>
            <Controller
              name="elevationMax"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    placeholder="Point B"
                    className="w-28"
                    type="number"
                    addonAfter={
                      <Controller
                        name="elevationUnitA"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            onChange={(value) => {
                              console.log("value", value);
                              handleUnitChange(value);
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <Option value="ft">ft</Option>
                            <Option value="m">m</Option>
                          </Select>
                        )}
                      />
                    }
                  />
                  {errors.elevationMax && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.elevationMax.message?.toString()}
                    </span>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Dimensions</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Length</p>
            <Controller
              name="length"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    placeholder=""
                    className="w-28"
                    type="number"
                    addonAfter={
                      <Controller
                        name="dimensionUnit"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            {...field}
                            onChange={(value) => {
                              console.log("value", value);
                              handleDimensionUnitChange(value);
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <Option value="ft">ft</Option>
                            <Option value="m">m</Option>
                          </Select>
                        )}
                      />
                    }
                  />
                  {errors.length && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.length.message?.toString()}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">Width</p>
            <Controller
              name="width"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    placeholder=""
                    className="w-28"
                    type="number"
                    addonAfter={
                      <Controller
                        name="dimensionUnit"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select {...field}>
                            <Option value="ft">ft</Option>
                            <Option value="m">m</Option>
                          </Select>
                        )}
                      />
                    }
                  />
                  {errors.width && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.width.message?.toString()}
                    </span>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Surface of the Runway */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Surface of the Runway
        </h2>
        <Controller
          name="runwaySurfaces"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {runwaySurfaces.map((surface) => {
                  const selected = field.value.includes(surface);
                  return (
                    <Button
                      key={surface}
                      type={selected ? "primary" : "default"}
                      shape="default"
                      className={`w-full h-16 flex items-center justify-center text-base font-medium border border-gray-400 rounded-xl transition-all duration-150
                        ${
                          selected
                            ? "bg-blue-50 border-blue-600 text-blue-700"
                            : "bg-white hover:border-blue-400 hover:text-blue-600"
                        }`}
                      onClick={() => {
                        if (selected) {
                          field.onChange(
                            field.value.filter((v: string) => v !== surface)
                          );
                        } else {
                          field.onChange([...field.value, surface]);
                        }
                      }}
                    >
                      {surface}
                    </Button>
                  );
                })}
              </div>
              {errors.runwaySurfaces && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.runwaySurfaces.message?.toString()}
                </span>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default Step3AirportDetails;
