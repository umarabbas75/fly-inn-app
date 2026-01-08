"use client";
import React, { useState } from "react";
import {
  Modal,
  Button,
  Slider,
  Input,
  Row,
  Col,
  Typography,
  Collapse,
  InputNumber,
} from "antd";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";
import {
  FilterOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  BranchesOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  MinusOutlined,
  DollarOutlined,
  HomeOutlined,
  UserOutlined,
  FieldTimeOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import {
  FaPlane,
  FaWifi,
  FaUtensils,
  FaBed,
  FaShuttleVan,
  FaGasPump,
  FaTools,
  FaBuilding,
  FaBookOpen,
  FaDollarSign,
  FaConciergeBell,
  FaCloud,
  FaCar,
  FaBriefcaseMedical,
  FaCouch,
  FaUsers,
  FaClipboardList,
  FaCoffee,
  FaSprayCan,
  FaPlug,
  FaWater,
  FaTrash,
  FaRecycle,
  FaToilet, // For bathrooms
  FaTv, // For TV
  FaHotTub, // For Hot Tub
  FaSwimmingPool, // For Pool
  FaFire, // For BBQ Grill
  FaThermometerHalf, // For Heating
  FaChargingStation, // For Washer/Dryer (generic, consider more specific if available)
  FaPaw, // For Pets
  FaChild, // For Children
  FaAccessibleIcon,
  FaGlobeAmericas, // For Wheelchair Accessible
} from "react-icons/fa";
import { Bed } from "lucide-react";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// --- Mock Data ---

const mockStates = [
  "California",
  "Texas",
  "Florida",
  "New York",
  "Washington",
  "Arizona",
  "Colorado",
  "Illinois",
  "Massachusetts",
  "Nevada",
];

const mockLodgingTypes = [
  "Hotel",
  "Motel",
  "Guesthouse",
  "Apartment",
  "Cabin",
  "Boutique Hotel",
  "Resort",
];

const mockSpaceTypes = ["Entire Place", "Private Room", "Shared Room"];

const mockCancellationPolicies = ["Flexible", "Moderate", "Strict"];

const mockOperationHours = ["24/7", "Daylight Hours", "Specific Hours"];

const mockLightingOptions = ["Available", "Partial", "None"];

const mockSurfaceTypes = [
  "Asphalt",
  "Concrete",
  "Grass",
  "Gravel",
  "Dirt",
  "Water",
];

const mockYesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

// Unified Amenities List
const mockAmenities = [
  { label: "Kitchen", value: "kitchen", icon: <FaUtensils /> },
  { label: "Washer", value: "washer", icon: <FaChargingStation /> },
  { label: "Dryer", value: "dryer", icon: <FaPlug /> },
  { label: "TV", value: "tv", icon: <FaTv /> },
  { label: "Internet", value: "internet", icon: <FaWifi /> },
  { label: "Air Conditioning", value: "air_conditioning", icon: <FaCloud /> },
  { label: "Heating", value: "heating", icon: <FaThermometerHalf /> },
  { label: "Hot Tub", value: "hot_tub", icon: <FaHotTub /> },
  { label: "Pool", value: "pool", icon: <FaSwimmingPool /> },
  { label: "BBQ Grill", value: "bbq_grill", icon: <FaFire /> },
  {
    label: "Wheelchair Accessible",
    value: "wheelchair_accessible",
    icon: <FaAccessibleIcon />,
  },
];

// --- End Mock Data ---

// Convert mock data to SearchableSelectOption format
const lodgingTypeOptions: SearchableSelectOption[] = mockLodgingTypes.map(
  (type) => ({
    value: type,
    label: type,
  })
);

const spaceTypeOptions: SearchableSelectOption[] = mockSpaceTypes.map(
  (type) => ({
    value: type,
    label: type,
  })
);

const cancellationPolicyOptions: SearchableSelectOption[] =
  mockCancellationPolicies.map((policy) => ({
    value: policy,
    label: policy,
  }));

const stateOptions: SearchableSelectOption[] = mockStates.map((state) => ({
  value: state,
  label: state,
}));

const operationHoursOptions: SearchableSelectOption[] = mockOperationHours.map(
  (hours) => ({
    value: hours,
    label: hours,
  })
);

const lightingOptions: SearchableSelectOption[] = mockLightingOptions.map(
  (option) => ({
    value: option,
    label: option,
  })
);

const surfaceTypeOptions: SearchableSelectOption[] = mockSurfaceTypes.map(
  (type) => ({
    value: type,
    label: type,
  })
);

const yesNoOptions: SearchableSelectOption[] = mockYesNoOptions.map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

interface FiltersModalProps {
  trigger?: React.ReactNode;
}

export const FiltersModal: React.FC<FiltersModalProps> = () => {
  const [open, setOpen] = useState(false);

  // --- State for all filter fields ---
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [airportIdentifiers, setAirportIdentifiers] = useState<string>("");
  const [numGuests, setNumGuests] = useState<number>(1);
  const [lodgingType, setLodgingType] = useState<string | null>(null);
  const [spaceType, setSpaceType] = useState<string | null>(null);
  const [numBedrooms, setNumBedrooms] = useState<number>(1);
  const [numBeds, setNumBeds] = useState<number>(1);
  const [numBathrooms, setNumBathrooms] = useState<number>(1);
  const [helicopterLandingAllowed, setHelicopterLandingAllowed] = useState<
    string | null
  >(null);
  const [operationHours, setOperationHours] = useState<string | null>(null);
  const [lighting, setLighting] = useState<string | null>(null);
  const [dimensionsLengthMax, setDimensionsLengthMax] = useState<number>(5000); // Max in feet
  const [dimensionsWidthMax, setDimensionsWidthMax] = useState<number>(150); // Max in feet
  const [surfaceType, setSurfaceType] = useState<string | null>(null);
  const [elevationMax, setElevationMax] = useState<number>(15000); // Max in feet
  // Distance from Runway: 0 to 8+ miles
  const [distanceFromRunway, setDistanceFromRunway] = useState<number>(8); // Max 8, min 0
  const [instantBooking, setInstantBooking] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [petsAllowed, setPetsAllowed] = useState<string | null>(null);
  const [childrenAllowed, setChildrenAllowed] = useState<string | null>(null);
  const [cancellationPolicy, setCancellationPolicy] = useState<string | null>(
    null
  );

  // New state for selected Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // State for other features (previously sub-features)
  const [selectedOtherFeatures, setSelectedOtherFeatures] = useState<string[]>(
    []
  );

  // Helper function to toggle amenity selection
  const toggleAmenity = (value: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((val) => val !== value)
        : [...prev, value]
    );
  };

  // Helper function to toggle other feature selection
  const toggleOtherFeature = (value: string) => {
    setSelectedOtherFeatures((prev) =>
      prev.includes(value)
        ? prev.filter((val) => val !== value)
        : [...prev, value]
    );
  };

  const clearAll = () => {
    setSelectedStates([]);
    setAirportIdentifiers("");
    setNumGuests(1);
    setLodgingType(null);
    setSpaceType(null);
    setNumBedrooms(1);
    setNumBeds(1);
    setNumBathrooms(1);
    setHelicopterLandingAllowed(null);
    setOperationHours(null);
    setLighting(null);
    setDimensionsLengthMax(5000);
    setDimensionsWidthMax(150);
    setSurfaceType(null);
    setElevationMax(15000);
    setDistanceFromRunway(8); // Reset to 8 for "8+"
    setInstantBooking(null);
    setPriceRange([0, 1000]);
    setPetsAllowed(null);
    setChildrenAllowed(null);
    setCancellationPolicy(null);
    setSelectedAmenities([]); // Clear amenities
    setSelectedOtherFeatures([]); // Clear other features
  };

  const handleApplyFilters = () => {
    const filters = {
      selectedStates,
      airportIdentifiers: airportIdentifiers
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
      numGuests,
      lodgingType,
      spaceType,
      numBedrooms,
      numBeds,
      numBathrooms,
      helicopterLandingAllowed,
      operationHours,
      lighting,
      dimensionsLengthMax,
      dimensionsWidthMax,
      surfaceType,
      elevationMax,
      distanceFromRunway: distanceFromRunway === 8 ? "8+" : distanceFromRunway,
      instantBooking,
      priceRange,
      petsAllowed,
      childrenAllowed,
      cancellationPolicy,
      selectedAmenities, // Include selected amenities
      selectedOtherFeatures, // Include other features
    };
    console.log("Applied Filters:", filters);
    setOpen(false);
  };

  // Helper for Sliders that have a minimum and an "X+" at the maximum
  const renderRangeWithPlusSlider = (
    label: string,
    value: number,
    onChange: (val: number) => void,
    min: number,
    max: number, // This is the boundary for the slider, e.g., 8 for 8+
    step: number,
    unit: string,
    icon: React.ReactNode
  ) => (
    <div>
      <div className="flex items-center mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
      <div className="flex justify-between mt-1">
        <Text strong className="text-primary">
          {min} {unit}
        </Text>
        <Text strong className="text-primary">
          {value === max ? `${max}+` : value} {unit}
        </Text>
      </div>
    </div>
  );

  // Helper for Sliders that have a minimum of 1 and only a maximum adjustable
  const renderMaxSliderWithLabels = (
    label: string,
    value: number,
    onChange: (val: number) => void,
    min: number,
    max: number,
    step: number,
    unit: string,
    icon: React.ReactNode
  ) => (
    <div>
      <div className="flex items-center mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
      <div className="flex justify-end mt-1">
        <Text strong className="text-primary">
          Up to {value} {unit}
        </Text>
      </div>
    </div>
  );

  // Helper for Price Range Slider (two handles)
  const renderRangeSliderWithLabels = (
    label: string,
    value: [number, number],
    onChange: (val: [number, number]) => void,
    min: number,
    max: number,
    step: number,
    unit: string,
    icon: React.ReactNode
  ) => (
    <div>
      <div className="flex items-center mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      </div>
      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(val) => onChange(val as [number, number])}
      />
      <div className="flex justify-between mt-1">
        <Text strong className="text-primary">
          {value[0]} {unit}
        </Text>
        <Text strong className="text-primary">
          {value[1]} {unit}
        </Text>
      </div>
    </div>
  );

  // Helper for simple Yes/No selects
  const renderYesNoSelect = (
    label: string,
    value: string | null,
    onChange: (val: string | null) => void,
    icon: React.ReactNode
  ) => (
    <div>
      <div className="flex items-center mb-2">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      </div>
      <SearchableSelect
        value={value || undefined}
        onValueChange={(val) => {
          onChange(
            typeof val === "string" ? val : Array.isArray(val) ? val[0] : null
          );
        }}
        options={yesNoOptions}
        placeholder="Select"
        showSearch={true}
      />
    </div>
  );

  // Helper for number inputs (for guests, beds, bedrooms, bathrooms)
  const renderNumberInputWithLabel = (
    label: string,
    value: number,
    onChange: (val: number | null) => void,
    min: number,
    icon: React.ReactNode
  ) => (
    <div>
      <div className="flex items-center mb-2">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      </div>
      <InputNumber
        min={min}
        value={value}
        onChange={onChange}
        className="w-full rounded-md"
        size="large"
        placeholder={`${min}+`}
      />
    </div>
  );

  return (
    <>
      <Button
        type="dashed"
        icon={<FilterOutlined />}
        className="flex items-center justify-center px-4 py-2 text-base font-semibold text-gray-700 bg-white border-gray-300 rounded-md shadow-sm hover:border-red-500 hover:text-red-500 transition-all duration-200"
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={null}
        width={750}
        centered
        closable={true}
        // closeIcon={
        //   <Button
        //     type="text"
        //     icon={<span className="text-xl font-light">×</span>}
        //     onClick={() => setOpen(false)}
        //     className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        //   />
        // }
        className="rounded-2xl overflow-hidden shadow-2xl p-0"
        classNames={{
          content: "p-0",
          body: "mt-2.5",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Title level={4} className="!mb-0 !font-bold text-gray-800">
              <FilterOutlined className="mr-2 text-primary" /> Filters
            </Title>
          </div>

          {/* Modal Body - Scrollable Content */}
          <div className="flex-grow overflow-y-auto px-10 py-8 space-y-8 bg-gray-50">
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) =>
                isActive ? <MinusOutlined /> : <PlusOutlined />
              }
              className="bg-gray-50 -mx-2"
              defaultActiveKey={[
                "capacity_accommodation", // Prioritize this
                "price_range", // This would be a new panel
                "amenities", // Also a high priority
              ]}
            >
              {/* 5. Location & Identification */}
              <Panel
                header={
                  <span className="font-semibold text-gray-700 flex items-center">
                    <EnvironmentOutlined className="mr-2 text-red-500" />
                    Location & Identification
                  </span>
                }
                key="location_identification"
                className="!bg-white !rounded-xl !mb-4 !overflow-hidden !border !border-gray-200 shadow-sm"
              >
                <Row gutter={[24, 24]} className="px-2 py-2">
                  <Col span={24}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        States/Provinces
                      </label>
                      <SearchableSelect
                        multiple={true}
                        value={selectedStates}
                        onValueChange={(val) => {
                          setSelectedStates(
                            Array.isArray(val) ? val : val ? [val] : []
                          );
                        }}
                        options={stateOptions}
                        placeholder="Select states or provinces"
                        showSearch={true}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        Airport Identifier (comma separated)
                      </label>
                      <Input
                        value={airportIdentifiers}
                        onChange={(e) => setAirportIdentifiers(e.target.value)}
                        placeholder="e.g., LAX, JFK, ORD"
                        className="w-full rounded-md"
                        size="large"
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    {renderRangeWithPlusSlider(
                      "Distance from Runway",
                      distanceFromRunway,
                      setDistanceFromRunway,
                      0,
                      8,
                      1,
                      "Miles",
                      <BranchesOutlined />
                    )}
                  </Col>
                </Row>
              </Panel>
              {/* 1. Capacity & Accommodation (Moved to Top) */}
              <Panel
                header={
                  <span className="font-semibold text-gray-700 flex items-center">
                    <Bed className="mr-2 text-red-500" />
                    Capacity & Accommodations
                  </span>
                }
                key="capacity_accommodation"
                className="!bg-white !rounded-xl !mb-4 !overflow-hidden !border !border-gray-200 shadow-sm"
              >
                <Row gutter={[24, 24]} className="px-2 py-2">
                  <Col span={12}>
                    {renderNumberInputWithLabel(
                      "# Guests",
                      numGuests,
                      (val) => setNumGuests(val || 1),
                      1,
                      <UserOutlined />
                    )}
                  </Col>
                  <Col span={12}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        Lodging Type
                      </label>
                      <SearchableSelect
                        value={lodgingType || undefined}
                        onValueChange={(val) => {
                          setLodgingType(
                            typeof val === "string"
                              ? val
                              : Array.isArray(val)
                              ? val[0]
                              : null
                          );
                        }}
                        options={lodgingTypeOptions}
                        placeholder="Select type"
                        showSearch={true}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        Type of Space
                      </label>
                      <SearchableSelect
                        value={spaceType || undefined}
                        onValueChange={(val) => {
                          setSpaceType(
                            typeof val === "string"
                              ? val
                              : Array.isArray(val)
                              ? val[0]
                              : null
                          );
                        }}
                        options={spaceTypeOptions}
                        placeholder="Select type"
                        showSearch={true}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    {renderNumberInputWithLabel(
                      "# Bedrooms",
                      numBedrooms,
                      (val) => setNumBedrooms(val || 1),
                      1,
                      <FaBed />
                    )}
                  </Col>
                  <Col span={12}>
                    {renderNumberInputWithLabel(
                      "# Beds",
                      numBeds,
                      (val) => setNumBeds(val || 1),
                      1,
                      <FaBed />
                    )}
                  </Col>
                  <Col span={12}>
                    {renderNumberInputWithLabel(
                      "# Bathrooms",
                      numBathrooms,
                      (val) => setNumBathrooms(val || 1),
                      1,
                      <FaToilet />
                    )}
                  </Col>
                </Row>
              </Panel>

              {/* 6. Property Characteristics (Moved to Bottom) */}
              <Panel
                header={
                  <span className="font-semibold text-gray-700 flex items-center">
                    <HomeOutlined className="mr-2 text-red-500" />
                    Airport Information
                  </span>
                }
                key="property_characteristics"
                className="!bg-white !rounded-xl !mb-4 !overflow-hidden !border !border-gray-200 shadow-sm"
              >
                <Row gutter={[24, 24]} className="px-2 py-2">
                  <Col span={12}>
                    {renderYesNoSelect(
                      "Helicopter Landing Allowed",
                      helicopterLandingAllowed,
                      setHelicopterLandingAllowed,
                      <FaPlane />
                    )}
                  </Col>
                  <Col span={12}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        Operation Hours
                      </label>
                      <SearchableSelect
                        value={operationHours || undefined}
                        onValueChange={(val) => {
                          setOperationHours(
                            typeof val === "string"
                              ? val
                              : Array.isArray(val)
                              ? val[0]
                              : null
                          );
                        }}
                        options={operationHoursOptions}
                        placeholder="Select hours"
                        showSearch={true}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        Lighting
                      </label>
                      <SearchableSelect
                        value={lighting || undefined}
                        onValueChange={(val) => {
                          setLighting(
                            typeof val === "string"
                              ? val
                              : Array.isArray(val)
                              ? val[0]
                              : null
                          );
                        }}
                        options={lightingOptions}
                        placeholder="Select availability"
                        showSearch={true}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        Surface Type
                      </label>
                      <SearchableSelect
                        value={surfaceType || undefined}
                        onValueChange={(val) => {
                          setSurfaceType(
                            typeof val === "string"
                              ? val
                              : Array.isArray(val)
                              ? val[0]
                              : null
                          );
                        }}
                        options={surfaceTypeOptions}
                        placeholder="Select type"
                        showSearch={true}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    {renderMaxSliderWithLabels(
                      "Dimensions Length",
                      dimensionsLengthMax,
                      setDimensionsLengthMax,
                      1,
                      10000,
                      100,
                      "ft",
                      <ExpandOutlined />
                    )}
                  </Col>
                  <Col span={24}>
                    {renderMaxSliderWithLabels(
                      "Dimensions Width",
                      dimensionsWidthMax,
                      setDimensionsWidthMax,
                      1,
                      300,
                      10,
                      "ft",
                      <ExpandOutlined />
                    )}
                  </Col>
                  <Col span={24}>
                    {renderMaxSliderWithLabels(
                      "Elevation Maximum",
                      elevationMax,
                      setElevationMax,
                      0,
                      20000,
                      100,
                      "ft",
                      <ArrowUpOutlined />
                    )}
                  </Col>
                </Row>
              </Panel>

              {/* 2. New Panel: Price Range */}
              <Panel
                header={
                  <span className="font-semibold text-gray-700 flex items-center">
                    <DollarOutlined className="mr-2 text-red-500" />
                    Price
                  </span>
                }
                key="price_range"
                className="!bg-white !rounded-xl !mb-4 !overflow-hidden !border !border-gray-200 shadow-sm"
              >
                <Row gutter={[24, 24]} className="px-2 py-2">
                  <Col span={24}>
                    {renderRangeSliderWithLabels(
                      "Price Range",
                      priceRange,
                      setPriceRange,
                      0,
                      5000,
                      50,
                      "$",
                      <DollarOutlined />
                    )}
                  </Col>
                </Row>
              </Panel>

              {/* 3. Amenities */}
              <Panel
                header={
                  <span className="font-semibold text-gray-700 flex items-center">
                    <img
                      src="https://assets-global.website-files.com/6573c735d496464875329803/65793e2b95b8d22d109f257a_Component%204.svg"
                      alt="Amenities Icon"
                      className="mr-2 h-5 w-5"
                    />
                    Amenities
                  </span>
                }
                key="amenities"
                className="!bg-white !rounded-xl !mb-4 !overflow-hidden !border !border-gray-200 shadow-sm"
              >
                <div className="px-2 py-2">
                  <Row gutter={[12, 12]}>
                    {mockAmenities.map((amenity) => (
                      <Col span={12} key={amenity.value}>
                        <Button
                          type={
                            selectedAmenities.includes(amenity.value)
                              ? "primary"
                              : "default"
                          }
                          onClick={() => toggleAmenity(amenity.value)}
                          className={`w-full text-left flex items-center justify-start px-4 py-3 rounded-lg transition-all duration-200 text-sm h-auto
                        ${
                          selectedAmenities.includes(amenity.value)
                            ? "bg-primary text-white border-primary hover:bg-red-700 hover:border-red-700"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-gray-200"
                        }`}
                          icon={amenity.icon}
                          size="large"
                        >
                          <span>{amenity.label}</span>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Panel>

              {/* 4. Policies & Booking */}
              <Panel
                header={
                  <span className="font-semibold text-gray-700 flex items-center">
                    <InfoCircleOutlined className="mr-2 text-red-500" />
                    Policies & Booking
                  </span>
                }
                key="policies_booking"
                className="!bg-white !rounded-xl !mb-4 !overflow-hidden !border !border-gray-200 shadow-sm"
              >
                <Row gutter={[24, 24]} className="px-2 py-2">
                  <Col span={12}>
                    {renderYesNoSelect(
                      "Instant Booking Allowed",
                      instantBooking,
                      setInstantBooking,
                      <CheckCircleOutlined />
                    )}
                  </Col>
                  <Col span={12}>
                    {renderYesNoSelect(
                      "Pets Allowed",
                      petsAllowed,
                      setPetsAllowed,
                      <FaPaw />
                    )}
                  </Col>
                  <Col span={12}>
                    {renderYesNoSelect(
                      "Children Allowed",
                      childrenAllowed,
                      setChildrenAllowed,
                      <FaChild />
                    )}
                  </Col>
                  <Col span={12}>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-800">
                        Cancellation Policy
                      </label>
                      <SearchableSelect
                        value={cancellationPolicy || undefined}
                        onValueChange={(val) => {
                          setCancellationPolicy(
                            typeof val === "string"
                              ? val
                              : Array.isArray(val)
                              ? val[0]
                              : null
                          );
                        }}
                        options={cancellationPolicyOptions}
                        placeholder="Select policy"
                        showSearch={true}
                      />
                    </div>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white">
            <Button
              type="link"
              onClick={clearAll}
              className="text-gray-600 hover:text-primary transition-colors duration-200 font-semibold text-base"
            >
              Clear All
            </Button>
            <Button
              type="primary"
              onClick={handleApplyFilters}
              size="large"
              className=" text-base font-semibold bg-primary border-primary shadow-md hover:bg-red-700 hover:border-red-700 transition-all duration-200 flex items-center"
            >
              <FilterOutlined className="mr-2" /> Show Results
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FiltersModal;
