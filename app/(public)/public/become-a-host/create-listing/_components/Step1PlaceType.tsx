"use client";

import React, { JSX } from "react";
import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";

// Icons
import { HiOutlinePuzzle } from "react-icons/hi";
import {
  MdOutlineBeachAccess,
  MdOutlineLocalParking,
  MdOutlineApartment,
  MdOutlineCabin,
  MdOutlineBed,
  MdOutlineHomeWork,
  MdOutlineHome,
} from "react-icons/md";
import { GiCampingTent, GiFarmTractor, GiCaravan } from "react-icons/gi";
import { FiBox } from "react-icons/fi";

// Place type configuration
const placeTypes = [
  "Apartment",
  "Bed & Breakfast",
  "Beachfront",
  "Cabin",
  "Campsite",
  "Farm",
  "Hangar",
  "Hangar Home",
  "House",
  "Mansion",
  "Novelty",
  "RV",
  "RV Pad",
  "Tiny Home",
];

const placeTypeIcons: Record<string, JSX.Element> = {
  Apartment: (
    <MdOutlineApartment size={28} className="mx-auto text-primary mb-2" />
  ),
  "Bed & Breakfast": (
    <MdOutlineBed size={28} className="mx-auto text-primary mb-2" />
  ),
  Beachfront: (
    <MdOutlineBeachAccess size={28} className="mx-auto text-primary mb-2" />
  ),
  Cabin: <MdOutlineCabin size={28} className="mx-auto text-primary mb-2" />,
  Campsite: <GiCampingTent size={28} className="mx-auto text-primary mb-2" />,
  Farm: <GiFarmTractor size={28} className="mx-auto text-primary mb-2" />,
  Hangar: <GiFarmTractor size={28} className="mx-auto text-primary mb-2" />,
  "Hangar Home": (
    <MdOutlineHomeWork size={28} className="mx-auto text-primary mb-2" />
  ),
  House: <MdOutlineHome size={28} className="mx-auto text-primary mb-2" />,
  Mansion: <GiFarmTractor size={28} className="mx-auto text-primary mb-2" />,
  Novelty: <HiOutlinePuzzle size={28} className="mx-auto text-primary mb-2" />,
  RV: <GiCaravan size={28} className="mx-auto text-primary mb-2" />,
  "RV Pad": (
    <MdOutlineLocalParking size={28} className="mx-auto text-primary mb-2" />
  ),
  "Tiny Home": <FiBox size={28} className="mx-auto text-primary mb-2" />,
};

interface Step1Props {
  onNext?: (data: { placeType: string }) => void; // Marked as optional since not used
}

const Step1PlaceType: React.FC<Step1Props> = () => {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const selectedType = watch("placeType");

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
        Which one best describes your{" "}
        <span className="text-red-600">Place</span>?
      </h2>
      <Controller
        name="placeType"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {placeTypes.map((type) => (
              <div
                key={type}
                className={clsx(
                  "cursor-pointer border rounded-lg py-4 px-2 text-center text-sm md:text-base transition-all duration-200",
                  "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-600",
                  selectedType === type
                    ? "border-red-900 bg-red-50"
                    : "border-gray-300 hover:border-red-600"
                )}
                onClick={() => field.onChange(type)}
                onKeyDown={(e) =>
                  ["Enter", " "].includes(e.key) && field.onChange(type)
                }
                tabIndex={0}
                role="button"
                aria-pressed={selectedType === type}
              >
                {placeTypeIcons[type] || (
                  <div className="h-7 w-7 mx-auto mb-2 bg-gray-200 rounded" />
                )}
                <span className="font-normal text-gray-900">{type}</span>
              </div>
            ))}
          </div>
        )}
      />
      {errors.placeType && (
        <p className="mt-2 text-red-500 text-sm text-center">
          {errors.placeType.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default Step1PlaceType;
