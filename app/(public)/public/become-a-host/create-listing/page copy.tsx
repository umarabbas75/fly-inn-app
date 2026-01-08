"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Step1PlaceType from "./_components/Step1PlaceType";
import Step2LocationForm from "./_components/Step2LocationForm";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import ProgressBar from "@/components/ProgressBar";
import Step3AirportDetails from "./_components/Step3AirportDetails";
import Step4AirportMoreDetails from "./_components/Step4AirportMoreDetails";
import Step5Media from "./_components/step-5-media";
import Step5Accommodation from "./_components/Step6Accommodation";
import Step7Pricing from "./_components/Step7Pricing";
import Step8RulesInstructions from "./_components/Step8RulesInstructions";
import BlockedDatesCalendar from "./_components/step-9-blocked-dates";

interface FormData {
  // Step 8 Rules & Instructions fields
  smokingAllowed: "Yes" | "No";
  petsAllowed: "Yes" | "No";
  partiesAllowed: "Yes" | "No";
  childrenAllowed: "Yes" | "No";
  selectedRules: string[];
  editRules: string;
  guestInstructions: string[];
  editInstructions: string;
  // Step 7 Pricing fields
  pricePerNight: number | "";
  applyWeekendPrice: "Yes" | "No";
  pricePerWeek: number | "";
  pricePerMonth: number | "";
  additionalGuests: "Yes" | "No";
  cityFee: number | "";
  tax: number | "";
  cleaningFee: number | "";
  extraServices: "Yes" | "No";
  minDays: number;
  maxDays: number;
  checkInTime: string;
  checkOutTime: string;
  placeType: string;
  address: string;
  unit_no?: string | null;
  city: string;
  state: string;
  zipcode: string;
  area?: string | null;
  country: string;
  latitude: number;
  longitude: number;
  airportName?: string | null;
  terminal?: string | null;
  // Step 3 fields
  distance: number;
  elevationMin: number | "";
  elevationMax: number | "";
  elevationUnitA: "ft" | "m" | "";
  length: number | "";
  width: number | "";
  dimensionUnit: "ft" | "m" | "";
  runwaySurfaces: string[];
  // Step 4 fields
  airportIdentifier: string;
  airportType: string;
  operationHours: string;
  lighting: string;
  ctafUnicom: string;
  fuelAvailability: string;
  otherFuel: string;
  parkingAvailability: string;
  runwayPattern: string;
  airnavLink: string;
  groundTransportation: string;
  helicopterLanding: string;
  runwayCondition: string;
  // Step 5 fields
  images: File[];
  placeTitle: string;
  guests: number;
  bedrooms: number;
  beds: number;
  totalRooms: number;
  bathrooms: number;
  size: number;
  unit: string;
  description: string;
}

// 2. Create a combined/master schema for the main useForm resolver
// This schema MUST align perfectly with the FormData interface,
// explicitly defining all fields and their optionality/requiredness
// for the entire form's data structure.
const masterFormSchema: yup.ObjectSchema<FormData> = yup.object().shape({
  // Step 8 Rules & Instructions fields
  smokingAllowed: yup.string().oneOf(["Yes", "No"]).required("Required"),
  petsAllowed: yup.string().oneOf(["Yes", "No"]).required("Required"),
  partiesAllowed: yup.string().oneOf(["Yes", "No"]).required("Required"),
  childrenAllowed: yup.string().oneOf(["Yes", "No"]).required("Required"),
  selectedRules: yup
    .array()
    .of(yup.string().required())
    .required("Select at least one rule"),
  editRules: yup.string().required("Edit rules are required"),
  guestInstructions: yup
    .array()
    .of(yup.string().required())
    .required("Guest instructions are required"),
  editInstructions: yup.string().required("Edit instructions are required"),
  // Step 7 Pricing fields
  pricePerNight: yup.number().typeError("Required").min(0).required("Required"),
  applyWeekendPrice: yup.string().oneOf(["Yes", "No"]).required("Required"),
  pricePerWeek: yup.number().typeError("Required").min(0).required("Required"),
  pricePerMonth: yup.number().typeError("Required").min(0).required("Required"),
  additionalGuests: yup.string().oneOf(["Yes", "No"]).required("Required"),
  cityFee: yup.number().typeError("Required").min(0).required("Required"),
  tax: yup.number().typeError("Required").min(0).max(100).required("Required"),
  cleaningFee: yup.number().typeError("Required").min(0).required("Required"),
  extraServices: yup.string().oneOf(["Yes", "No"]).required("Required"),
  minDays: yup
    .number()
    .typeError("Required")
    .min(1)
    .max(30)
    .required("Required"),
  maxDays: yup
    .number()
    .typeError("Required")
    .min(1)
    .max(365)
    .required("Required"),
  checkInTime: yup.string().required("Required"),
  checkOutTime: yup.string().required("Required"),
  // Step 5 fields
  images: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test(
          "file-type",
          "Each item must be a File",
          (value) => value instanceof File
        )
        .required("Image is required")
    )
    .min(1, "At least one image is required")
    .required("Images are required"),
  placeTitle: yup.string().required("Title is required"),
  guests: yup.number().min(1, "At least 1 guest").required("Guests required"),
  bedrooms: yup.number().min(0).required("Bedrooms required"),
  beds: yup.number().min(0).required("Beds required"),
  totalRooms: yup.number().min(0).required("Total rooms required"),
  bathrooms: yup.number().min(0).required("Bathrooms required"),
  size: yup.number().min(0).required("Size required"),
  unit: yup.string().required("Unit required"),
  description: yup.string().required("Description required"),
  placeType: yup.string().required(),
  address: yup.string().required(),
  unit_no: yup.string().notRequired().nullable(),
  city: yup.string().required(),
  state: yup.string().required(),
  zipcode: yup.string().required(),
  area: yup.string().notRequired().nullable(),
  country: yup.string().required(),
  latitude: yup.number().required().typeError("Latitude must be a number"),
  longitude: yup.number().required().typeError("Longitude must be a number"),
  airportName: yup.string().required("Airport name is required"),
  terminal: yup.string().notRequired().nullable(),
  // Step 3 fields
  distance: yup.number().min(1).max(9).required(),
  elevationMin: yup
    .number()
    .typeError("Elevation (Min) is required")
    .required("Elevation (Min) is required"),
  elevationMax: yup
    .number()
    .typeError("Elevation (Max) is required")
    .required("Elevation (Max) is required"),
  elevationUnitA: yup.string().oneOf(["ft", "m"]).required(),
  length: yup
    .number()
    .typeError("Length is required")
    .required("Length is required"),
  width: yup
    .number()
    .typeError("Width is required")
    .required("Width is required"),
  dimensionUnit: yup.string().oneOf(["ft", "m"]).required(),
  runwaySurfaces: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one surface")
    .required(),
  // Step 4 fields
  airportIdentifier: yup
    .string()
    .required("Airport identifier is required")
    .default(""),
  airportType: yup.string().required("Airport type is required").default(""),
  operationHours: yup
    .string()
    .required("Operation hours is required")
    .default(""),
  lighting: yup.string().required("Lighting is required").default(""),
  ctafUnicom: yup.string().required("CTAF/UNICOM is required").default(""),
  fuelAvailability: yup
    .string()
    .required("Fuel availability is required")
    .default(""),
  otherFuel: yup
    .string()
    .default("")
    .when("fuelAvailability", {
      is: (val: string) => val === "other",
      then: (schema) =>
        schema.required("Please specify other fuel type").default(""),
      otherwise: (schema) => schema.notRequired().default(""),
    }),
  parkingAvailability: yup
    .string()
    .required("Parking availability is required")
    .default(""),
  runwayPattern: yup
    .string()
    .required("Runway pattern is required")
    .default(""),
  airnavLink: yup.string().required("Airnav link is required").default(""),
  groundTransportation: yup
    .string()
    .required("Ground transportation is required")
    .default(""),
  helicopterLanding: yup
    .string()
    .required("Helicopter landing is required")
    .default(""),
  runwayCondition: yup
    .string()
    .required("Runway condition is required")
    .default(""),
});

// Initial form values - must match the full FormData interface
const initialValues: FormData = {
  // Step 8 Rules & Instructions fields
  smokingAllowed: "No",
  petsAllowed: "No",
  partiesAllowed: "No",
  childrenAllowed: "No",
  selectedRules: [],
  editRules: "",
  guestInstructions: [],
  editInstructions: "",
  // Step 7 Pricing fields
  pricePerNight: "",
  applyWeekendPrice: "No",
  pricePerWeek: "",
  pricePerMonth: "",
  additionalGuests: "No",
  cityFee: "",
  tax: "",
  cleaningFee: "",
  extraServices: "No",
  minDays: 1,
  maxDays: 30,
  checkInTime: "10:00 AM",
  checkOutTime: "11:00 AM",
  placeType: "",
  address: "",
  unit_no: null,
  city: "",
  state: "",
  zipcode: "",
  area: null,
  country: "",
  latitude: 40.7128,
  longitude: -74.006,
  airportName: null,
  terminal: null,
  // Step 3 fields
  distance: 1,
  elevationMin: "",
  elevationMax: "",
  elevationUnitA: "ft",
  length: "",
  width: "",
  dimensionUnit: "ft",
  runwaySurfaces: [],
  // Step 4 fields
  airportIdentifier: "",
  airportType: "",
  operationHours: "",
  lighting: "",
  ctafUnicom: "",
  fuelAvailability: "",
  otherFuel: "",
  parkingAvailability: "",
  runwayPattern: "",
  airnavLink: "",
  groundTransportation: "",
  helicopterLanding: "",
  runwayCondition: "",
  // Step 5 fields
  images: [],
  placeTitle: "",
  guests: 1,
  bedrooms: 0,
  beds: 0,
  totalRooms: 0,
  bathrooms: 1,
  size: 0,
  unit: "",
  description: "",
};

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<FormData>({
    resolver: yupResolver(masterFormSchema),
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const { handleSubmit, trigger, getValues, formState } = methods;

  const isLastStep = currentStep === 12;
  const isFirstStep = currentStep === 0;

  const stepFields: Array<Array<keyof FormData>> = [
    ["placeType"],
    [
      "address",
      "unit_no",
      "city",
      "state",
      "zipcode",
      "area",
      "country",
      "latitude",
      "longitude",
    ],
    [
      "airportName",
      "terminal",
      "distance",
      "elevationMin",
      "elevationMax",
      "elevationUnitA",
      "length",
      "width",
      "dimensionUnit",
      "runwaySurfaces",
    ],
    [
      "airportIdentifier",
      "airportName",
      "airportType",
      "operationHours",
      "lighting",
      "ctafUnicom",
      "fuelAvailability",
      "otherFuel",
      "parkingAvailability",
      "runwayPattern",
      "airnavLink",
      "groundTransportation",
      "helicopterLanding",
      "runwayCondition",
    ],
    ["images"],
    [
      "placeType",
      "placeTitle",
      "guests",
      "bedrooms",
      "beds",
      "totalRooms",
      "bathrooms",
      "size",
      "unit",
      "description",
    ],
    [
      "pricePerNight",
      "applyWeekendPrice",
      "pricePerWeek",
      "pricePerMonth",
      "additionalGuests",
      "cityFee",
      "tax",
      "cleaningFee",
      "extraServices",
      "minDays",
      "maxDays",
      "checkInTime",
      "checkOutTime",
    ],
    [
      "smokingAllowed",
      "petsAllowed",
      "partiesAllowed",
      "childrenAllowed",
      "selectedRules",
      "editRules",
      "guestInstructions",
      "editInstructions",
    ],
  ];

  const onNext = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const onBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Final submitted data:", data);
    alert("Form submitted successfully!");
    // methods.reset(initialValues);
    // setCurrentStep(0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1PlaceType />;
      case 1:
        return <Step2LocationForm />;
      case 2:
        return <Step3AirportDetails />;
      case 3:
        return <Step4AirportMoreDetails />;
      case 4:
        return <Step5Media />;
      case 5:
        return <Step5Accommodation />;
      case 6:
        return <Step7Pricing />;
      case 7:
        return <Step8RulesInstructions />;
      case 8:
        return <BlockedDatesCalendar />;

      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-green-600">
              All steps completed!
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl w-full">
          <div className="w-[70%] mx-auto">{renderStep()}</div>

          <div className="w-[100%] mx-auto my-6">
            <ProgressBar currentStep={currentStep + 1} totalSteps={12} />
          </div>

          <div className="flex justify-between pt-6 px-12">
            {!isFirstStep ? (
              <button
                type="button"
                className="px-6 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium"
                onClick={onBack}
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              {!isLastStep ? (
                <button
                  type="button"
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-red-800 font-medium"
                  onClick={onNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium"
                >
                  Submit Listing
                </button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default MultiStepForm;
