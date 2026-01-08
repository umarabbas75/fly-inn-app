import React, { useState } from "react";
import { Modal, Button, Slider, Collapse, Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

const runwaySurfaceOptions: SearchableSelectOption[] = [
  { label: "Asphalt", value: "asphalt" },
  { label: "Grass", value: "grass" },
  { label: "Gravel", value: "gravel" },
];

const transportOptions: SearchableSelectOption[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const stateOptions: SearchableSelectOption[] = [
  { label: "California", value: "CA" },
  { label: "Texas", value: "TX" },
  { label: "New York", value: "NY" },
];

interface FiltersModalProps {
  mode?: "simple" | "advanced";
  trigger?: React.ReactNode;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({
  mode = "simple",
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  // State for all filter fields
  const [maxElevation, setMaxElevation] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [runwaySurface, setRunwaySurface] = useState<string>("");
  const [transport, setTransport] = useState<string>("");
  const [state, setState] = useState<string>("");

  // Advanced mode states
  const [distance, setDistance] = useState<[number, number]>([1, 8]);
  const [elevationRange, setElevationRange] = useState<[number, number]>([
    1000, 6000,
  ]);
  const [lengthRange, setLengthRange] = useState<[number, number]>([60, 210]);
  const [widthRange, setWidthRange] = useState<[number, number]>([30, 150]);

  const clearAll = () => {
    setMaxElevation("");
    setHeight("");
    setWidth("");
    setRunwaySurface("");
    setTransport("");
    setState("");
    setDistance([1, 8]);
    setElevationRange([1000, 6000]);
    setLengthRange([60, 210]);
    setWidthRange([30, 150]);
  };

  const marks = {
    1000: "1000",
    2000: "2000",
    3000: "3000",
    4000: "4000",
    5000: "5000",
    6000: "6000",
  };

  const distanceMarks = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
  };

  return (
    <>
      <Button
        icon={<FilterOutlined />}
        className="flex items-center space-x-2 border border-gray-300"
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={<span className="text-lg font-semibold">Filters</span>}
        className="rounded-2xl h-[250px] p-0"
        width={500}
        closeIcon={<span className="text-xl">×</span>}
      >
        <div style={{ maxHeight: 540, overflowY: "auto", overflowX: "hidden" }}>
          {mode === "simple" ? (
            <form className="space-y-4 bg-white">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Max Elevation{" "}
                  <span className="text-xs text-gray-400">(ft)</span>
                </label>
                <input
                  type="text"
                  value={maxElevation}
                  onChange={(e) => setMaxElevation(e.target.value)}
                  placeholder=""
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Height{" "}
                  <span className="text-xs text-gray-400">(e.g 122x12)</span>
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g 122x12"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Width{" "}
                  <span className="text-xs text-gray-400">(e.g 123x456)</span>
                </label>
                <input
                  type="text"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g 123x456"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Runway Surface Type
                </label>
                <SearchableSelect
                  value={runwaySurface || undefined}
                  onValueChange={(val) => {
                    setRunwaySurface(
                      typeof val === "string"
                        ? val
                        : Array.isArray(val)
                        ? val[0] || ""
                        : ""
                    );
                  }}
                  options={runwaySurfaceOptions}
                  placeholder="Select type"
                  showSearch={true}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Transportation Availability
                </label>
                <SearchableSelect
                  value={transport || undefined}
                  onValueChange={(val) => {
                    setTransport(
                      typeof val === "string"
                        ? val
                        : Array.isArray(val)
                        ? val[0] || ""
                        : ""
                    );
                  }}
                  options={transportOptions}
                  placeholder="Select availability"
                  showSearch={true}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Search by State
                </label>
                <SearchableSelect
                  value={state || undefined}
                  onValueChange={(val) => {
                    setState(
                      typeof val === "string"
                        ? val
                        : Array.isArray(val)
                        ? val[0] || ""
                        : ""
                    );
                  }}
                  options={stateOptions}
                  placeholder="Select state"
                  showSearch={true}
                />
              </div>
              <div className="flex justify-between mt-6">
                <Button type="default" onClick={clearAll}>
                  Clear All
                </Button>
                <Button
                  type="primary"
                  className="bg-red-600 border-none hover:bg-red-700"
                >
                  Apply Filter
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-4 bg-white">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Max Elevation{" "}
                  <span className="text-xs text-gray-400">(ft)</span>
                </label>
                <Input
                  value={maxElevation}
                  onChange={(e) => setMaxElevation(e.target.value)}
                  placeholder=""
                  className="mb-3"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Height{" "}
                  <span className="text-xs text-gray-400">(e.g 122x12)</span>
                </label>
                <Input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g 122x12"
                  className="mb-3"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Width{" "}
                  <span className="text-xs text-gray-400">(e.g 123x456)</span>
                </label>
                <Input
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g 123x456"
                  className="mb-3"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Distance to Airstrip
                </label>
                <Slider
                  range
                  min={1}
                  max={8}
                  step={1}
                  marks={distanceMarks}
                  value={distance}
                  onChange={(val) => setDistance(val as [number, number])}
                  styles={{
                    track: { backgroundColor: "#dc2626" },
                    handle: { borderColor: "#dc2626", backgroundColor: "#fff" },
                  }}
                />
                <div className="flex justify-between text-xs font-semibold text-red-600">
                  <span>1 Mile</span>
                  <span>8 Mile</span>
                </div>
              </div>
              <div className="bg-white border shadow-sm rounded-2xl">
                <Collapse
                  defaultActiveKey={["1"]}
                  bordered={false}
                  className="bg-white rounded-2xl"
                  expandIconPosition="end"
                >
                  <Collapse.Panel
                    header={
                      <span className="text-sm font-semibold text-black">
                        Airport Features
                      </span>
                    }
                    key="1"
                  >
                    <div className="p-0 space-y-5">
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Runway Surface Type
                        </label>
                        <SearchableSelect
                          value={runwaySurface || undefined}
                          onValueChange={(val) => {
                            setRunwaySurface(
                              typeof val === "string"
                                ? val
                                : Array.isArray(val)
                                ? val[0] || ""
                                : ""
                            );
                          }}
                          options={runwaySurfaceOptions}
                          placeholder="Select type"
                          showSearch={true}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Transportation Availability
                        </label>
                        <SearchableSelect
                          value={transport || undefined}
                          onValueChange={(val) => {
                            setTransport(
                              typeof val === "string"
                                ? val
                                : Array.isArray(val)
                                ? val[0] || ""
                                : ""
                            );
                          }}
                          options={transportOptions}
                          placeholder="Select availability"
                          showSearch={true}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Elevation Range{" "}
                          <span className="text-xs text-gray-400">(ft)</span>
                        </label>
                        <Slider
                          range
                          min={1000}
                          max={6000}
                          step={1000}
                          marks={marks}
                          value={elevationRange}
                          onChange={(val) =>
                            setElevationRange(val as [number, number])
                          }
                          trackStyle={[{ backgroundColor: "#dc2626" }]}
                          handleStyle={[
                            { borderColor: "#dc2626", backgroundColor: "#fff" },
                            { borderColor: "#dc2626", backgroundColor: "#fff" },
                          ]}
                        />
                        <div className="flex justify-between text-xs font-semibold text-red-600">
                          <span>{elevationRange[0]}</span>
                          <span>{elevationRange[1]}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Length Range{" "}
                          <span className="text-xs text-gray-400">(ft)</span>
                        </label>
                        <Slider
                          range
                          min={60}
                          max={210}
                          step={10}
                          value={lengthRange}
                          onChange={(val) =>
                            setLengthRange(val as [number, number])
                          }
                          trackStyle={[{ backgroundColor: "#dc2626" }]}
                          handleStyle={[
                            { borderColor: "#dc2626", backgroundColor: "#fff" },
                            { borderColor: "#dc2626", backgroundColor: "#fff" },
                          ]}
                        />
                        <div className="flex justify-between text-xs font-semibold text-red-600">
                          <span>{lengthRange[0]}</span>
                          <span>{lengthRange[1]}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">
                          Width Range{" "}
                          <span className="text-xs text-gray-400">(ft)</span>
                        </label>
                        <Slider
                          range
                          min={30}
                          max={150}
                          step={5}
                          value={widthRange}
                          onChange={(val) =>
                            setWidthRange(val as [number, number])
                          }
                          trackStyle={[{ backgroundColor: "#dc2626" }]}
                          handleStyle={[
                            { borderColor: "#dc2626", backgroundColor: "#fff" },
                            { borderColor: "#dc2626", backgroundColor: "#fff" },
                          ]}
                        />
                        <div className="flex justify-between text-xs font-semibold text-red-600">
                          <span>{widthRange[0]}</span>
                          <span>{widthRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
              <div className="flex justify-between mt-8">
                <Button type="default" onClick={clearAll}>
                  Clear All
                </Button>
                <Button
                  type="primary"
                  className="bg-red-600 border-none hover:bg-red-700"
                >
                  Apply Filter
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default FiltersModal;
