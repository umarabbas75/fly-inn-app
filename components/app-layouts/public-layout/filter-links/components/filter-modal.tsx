"use client";

import React, { useState } from "react";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Collapse } from "antd";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

import {
  Filter,
  Maximize2,
  GitBranch,
  ArrowUp,
  DollarSign,
  User,
  CheckCircle2,
  Bed,
} from "lucide-react";

import {
  PlusOutlined,
  MinusOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import {
  FaPlane,
  FaWifi,
  FaUtensils,
  FaBed,
  FaPlug,
  FaCloud,
  FaAccessibleIcon,
  FaThermometerHalf,
  FaHotTub,
  FaSwimmingPool,
  FaFire,
  FaTv,
  FaChargingStation,
  FaPaw,
  FaChild,
  FaToilet,
} from "react-icons/fa";

const { Panel } = Collapse;

/* -------------------------------------------------------------------------- */
/*                                   MOCK DATA                                */
/* -------------------------------------------------------------------------- */

const mockStates = ["California", "Texas", "Florida", "New York", "Washington"];

const mockLodgingTypes = ["Hotel", "Motel", "Apartment", "Resort"];
const mockSpaceTypes = ["Entire Place", "Private Room"];
const mockCancellationPolicies = ["Flexible", "Moderate", "Strict"];
const mockOperationHours = ["24/7", "Specific Hours"];
const mockLightingOptions = ["Available", "None"];
const mockSurfaceTypes = ["Asphalt", "Concrete", "Grass"];

const yesNoOptions: SearchableSelectOption[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const mockAmenities = [
  { label: "Kitchen", value: "kitchen", icon: <FaUtensils /> },
  { label: "Washer", value: "washer", icon: <FaChargingStation /> },
  { label: "Dryer", value: "dryer", icon: <FaPlug /> },
  { label: "TV", value: "tv", icon: <FaTv /> },
  { label: "Internet", value: "internet", icon: <FaWifi /> },
  { label: "Air Conditioning", value: "ac", icon: <FaCloud /> },
  { label: "Heating", value: "heating", icon: <FaThermometerHalf /> },
  { label: "Hot Tub", value: "hot_tub", icon: <FaHotTub /> },
  { label: "Pool", value: "pool", icon: <FaSwimmingPool /> },
  { label: "BBQ Grill", value: "bbq", icon: <FaFire /> },
  {
    label: "Wheelchair Accessible",
    value: "wheelchair",
    icon: <FaAccessibleIcon />,
  },
];

/* -------------------------------------------------------------------------- */
/*                                OPTIONS MAPPING                             */
/* -------------------------------------------------------------------------- */

const toOptions = (arr: string[]): SearchableSelectOption[] =>
  arr.map((v) => ({ label: v, value: v }));

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

const FiltersModal = () => {
  const [open, setOpen] = useState(false);

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [airportIdentifiers, setAirportIdentifiers] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [numBedrooms, setNumBedrooms] = useState(1);
  const [numBeds, setNumBeds] = useState(1);
  const [numBathrooms, setNumBathrooms] = useState(1);

  const [lodgingType, setLodgingType] = useState<string | null>(null);
  const [spaceType, setSpaceType] = useState<string | null>(null);

  const [distanceFromRunway, setDistanceFromRunway] = useState(8);
  const [dimensionsLengthMax, setDimensionsLengthMax] = useState(5000);
  const [dimensionsWidthMax, setDimensionsWidthMax] = useState(150);
  const [elevationMax, setElevationMax] = useState(15000);

  const [operationHours, setOperationHours] = useState<string | null>(null);
  const [lighting, setLighting] = useState<string | null>(null);
  const [surfaceType, setSurfaceType] = useState<string | null>(null);

  const [instantBooking, setInstantBooking] = useState<string | null>(null);
  const [petsAllowed, setPetsAllowed] = useState<string | null>(null);
  const [childrenAllowed, setChildrenAllowed] = useState<string | null>(null);
  const [cancellationPolicy, setCancellationPolicy] = useState<string | null>(
    null
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (val: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const clearAll = () => {
    setSelectedStates([]);
    setAirportIdentifiers("");
    setNumGuests(1);
    setNumBedrooms(1);
    setNumBeds(1);
    setNumBathrooms(1);
    setLodgingType(null);
    setSpaceType(null);
    setDistanceFromRunway(8);
    setDimensionsLengthMax(5000);
    setDimensionsWidthMax(150);
    setElevationMax(15000);
    setOperationHours(null);
    setLighting(null);
    setSurfaceType(null);
    setInstantBooking(null);
    setPetsAllowed(null);
    setChildrenAllowed(null);
    setCancellationPolicy(null);
    setPriceRange([0, 1000]);
    setSelectedAmenities([]);
  };

  const applyFilters = () => {
    console.log({
      selectedStates,
      airportIdentifiers,
      numGuests,
      numBedrooms,
      numBeds,
      numBathrooms,
      lodgingType,
      spaceType,
      distanceFromRunway,
      dimensionsLengthMax,
      dimensionsWidthMax,
      elevationMax,
      operationHours,
      lighting,
      surfaceType,
      instantBooking,
      petsAllowed,
      childrenAllowed,
      cancellationPolicy,
      priceRange,
      selectedAmenities,
    });
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[750px] p-0 rounded-2xl overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5 text-red-600" />
              Filters
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto bg-gray-50">
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              defaultActiveKey={["capacity", "price", "amenities"]}
            >
              {/* LOCATION */}
              <Panel
                key="location"
                header={
                  <span className="flex items-center font-semibold">
                    <EnvironmentOutlined className="mr-2 text-red-500" />
                    Location
                  </span>
                }
              >
                <SearchableSelect
                  multiple
                  value={selectedStates}
                  onValueChange={(v) =>
                    setSelectedStates(Array.isArray(v) ? v : [])
                  }
                  options={toOptions(mockStates)}
                  placeholder="Select states"
                />

                <Input
                  className="mt-4"
                  value={airportIdentifiers}
                  onChange={(e) => setAirportIdentifiers(e.target.value)}
                  placeholder="Airport identifiers"
                />

                <Slider
                  className="mt-6"
                  min={0}
                  max={8}
                  step={1}
                  value={[distanceFromRunway]}
                  onValueChange={(v) => setDistanceFromRunway(v[0])}
                />
              </Panel>

              {/* CAPACITY */}
              <Panel
                key="capacity"
                header={
                  <span className="flex items-center font-semibold">
                    <Bed className="mr-2 text-red-500" />
                    Capacity
                  </span>
                }
              >
                <Input
                  type="number"
                  value={numGuests}
                  onChange={(e) => setNumGuests(+e.target.value)}
                />
              </Panel>

              {/* PRICE */}
              <Panel
                key="price"
                header={
                  <span className="flex items-center font-semibold">
                    <DollarSign className="mr-2 text-red-500" />
                    Price
                  </span>
                }
              >
                <Slider
                  min={0}
                  max={5000}
                  step={50}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange([v[0], v[1]])}
                />
              </Panel>

              {/* AMENITIES */}
              <Panel
                key="amenities"
                header={
                  <span className="flex items-center font-semibold">
                    Amenities
                  </span>
                }
              >
                <div className="grid grid-cols-2 gap-3">
                  {mockAmenities.map((a) => (
                    <Button
                      key={a.value}
                      variant={
                        selectedAmenities.includes(a.value)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleAmenity(a.value)}
                    >
                      {a.icon}
                      <span className="ml-2">{a.label}</span>
                    </Button>
                  ))}
                </div>
              </Panel>

              {/* POLICIES */}
              <Panel
                key="policies"
                header={
                  <span className="flex items-center font-semibold">
                    <InfoCircleOutlined className="mr-2 text-red-500" />
                    Policies
                  </span>
                }
              >
                <SearchableSelect
                  value={cancellationPolicy || undefined}
                  onValueChange={(v) =>
                    setCancellationPolicy(typeof v === "string" ? v : null)
                  }
                  options={toOptions(mockCancellationPolicies)}
                  placeholder="Cancellation Policy"
                />
              </Panel>
            </Collapse>
          </div>

          <div className="flex justify-between p-6 border-t">
            <Button variant="ghost" onClick={clearAll}>
              Clear All
            </Button>
            <Button onClick={applyFilters}>Show Results</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FiltersModal;
