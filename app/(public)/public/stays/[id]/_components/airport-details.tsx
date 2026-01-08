"use client";

import { useState } from "react";
import { hangarOptions, patternOptions } from "@/constants/stays";
import {
  EnvironmentOutlined,
  CarOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  SafetyOutlined,
  RadarChartOutlined,
  ApartmentOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Card, Divider, Tag, Button, Row, Col } from "antd";
import { GiFuelTank } from "react-icons/gi";

const AirportDetailsSection = ({ airports }: { airports: any }) => {
  const [showAllAirports, setShowAllAirports] = useState(false);
  const hasAirports =
    airports && Array.isArray(airports) && airports.length > 0;

  const renderParking = (parking: any) => {
    const final = hangarOptions?.find((item) => item?.value === parking);
    return final ? (
      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
        {final.label}
      </span>
    ) : (
      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
        {parking || "N/A"}
      </span>
    );
  };

  const renderPattern = (pattern: any) => {
    const final = patternOptions?.find((item) => item?.value === pattern);
    return final ? (
      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
        {final.label}
      </span>
    ) : (
      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
        {pattern || "N/A"}
      </span>
    );
  };

  const convertFeetToMeters = (feet: number) => {
    return (feet * 0.3048).toFixed(1);
  };

  const renderDimension = (feet: number) => {
    if (!feet) return "N/A";
    const meters = convertFeetToMeters(feet);
    return `${feet} ft (${meters} m)`;
  };

  // Determine which airports to show based on state
  // In print mode, we want to show all airports
  const airportsToShow = showAllAirports ? airports : airports?.slice(0, 1);
  // For print, we'll render all airports separately

  // Helper to get parking label
  const getParkingLabel = (parking: any) => {
    const final = hangarOptions?.find((item) => item?.value === parking);
    return final?.label || parking || "N/A";
  };

  // Helper to get pattern label
  const getPatternLabel = (pattern: any) => {
    const final = patternOptions?.find((item) => item?.value === pattern);
    return final?.label || pattern || "N/A";
  };

  return (
    <div className="mt-4">
      {!hasAirports ? (
        <>
          <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
            Airport information
          </h2>
          <p className="text-sm text-gray-500 italic">
            No airport information available for this location.
          </p>
        </>
      ) : (
        <>
          {/* Screen version - with cards and styling */}
          <div className="screen-only">
            {airportsToShow?.map((airport: any, index: number) => (
              <div key={airport.id}>
                <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
                  Airport information for {airport.identifier}
                </h2>
                <Card
                  className="mb-10 bg-white border-0 shadow"
                  classNames={{ body: "p-0" }}
                >
                  {/* Header with Airport Name */}
                  <div className="p-4 md:p-8 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {airport.name}
                          <span className="ml-2 font-mono text-gray-600 text-lg">
                            ({airport.identifier})
                          </span>
                        </h3>
                        <div className="flex items-center mt-3 text-gray-700">
                          <span className="font-medium text-sm px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                            {airport.use}
                          </span>
                          <span className="ml-4">
                            <EnvironmentOutlined className="mr-2 text-gray-500" />
                            Elevation:{" "}
                            <span className="font-medium">
                              {airport.elevation_feets} ft
                            </span>
                          </span>
                        </div>
                      </div>
                      {airport.air_nav && (
                        <Button
                          type="link"
                          icon={<LinkOutlined className="text-gray-600" />}
                          href={airport.air_nav}
                          target="_blank"
                          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          View on AirNav
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4 md:p-8">
                    <Row gutter={[48, 48]}>
                      {/* Runway Information */}
                      <Col xs={24} md={12}>
                        <div className="h-full">
                          <h4 className="font-semibold text-xl mb-4 flex items-center text-gray-800">
                            <SafetyOutlined className="text-gray-500 mr-3" />
                            Runway Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                              <p className="text-sm text-gray-500">
                                Orientation
                              </p>
                              <p className="font-medium text-base text-gray-900 mt-1">
                                {airport.orientation}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Dimensions
                              </p>
                              <div className="font-medium text-base text-gray-900 mt-1 space-y-1">
                                <div>
                                  Length:{" "}
                                  {renderDimension(airport.dimension_length)}
                                </div>
                                <div>
                                  Width:{" "}
                                  {renderDimension(airport.dimension_width)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Surface</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {airport.surface?.map((surf: any) => (
                                  <span
                                    key={surf}
                                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                                  >
                                    {surf === "Other" &&
                                    airport.other_runway_type
                                      ? `Other (${airport.other_runway_type})`
                                      : surf}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Condition</p>
                              <p className="font-medium text-gray-900 mt-1">
                                {airport.runway_condition || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>

                      {/* Facilities */}
                      <Col xs={24} md={12}>
                        <div className="h-full">
                          <h4 className="font-semibold text-xl mb-4 flex items-center text-gray-800">
                            <ApartmentOutlined className="text-gray-500 mr-3" />
                            Facilities
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Lighting
                              </p>
                              <p className="font-medium mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                  {airport.lighting ? "Available" : "None"}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Fuel</p>
                              <div className="flex items-center gap-2 mt-1">
                                {airport.fuel?.length > 0 ? (
                                  airport.fuel.map((f: any) => (
                                    <span
                                      key={f}
                                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                                    >
                                      {f}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                    None
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Parking</p>
                              <p className="font-medium text-gray-900 mt-1">
                                {renderParking(airport.parking)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Pattern</p>
                              <p className="font-medium text-gray-900 mt-1">
                                {renderPattern(airport.pattern)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>

                      {/* Communication & Hours */}
                      <Col span={24}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                          <div>
                            <h4 className="font-semibold text-xl mb-4 flex items-center text-gray-800">
                              <RadarChartOutlined className="text-gray-500 mr-3" />
                              Communication
                            </h4>
                            <div>
                              <p className="text-sm text-gray-500">
                                CTAF/UNICOM
                              </p>
                              <p className="font-medium text-base text-gray-900 mt-1">
                                {airport.ctaf_unicom || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-xl mb-4 flex items-center text-gray-800">
                              <ClockCircleOutlined className="text-gray-500 mr-3" />
                              Operation Hours
                            </h4>
                            <div>
                              <p className="text-sm text-gray-500">Hours</p>
                              <div className="font-medium text-base text-gray-900 mt-1">
                                {airport.operation_hours ? (
                                  typeof airport.operation_hours ===
                                  "object" ? (
                                    <div className="space-y-1">
                                      {Object.entries(
                                        airport.operation_hours
                                      ).map(([day, hours]: [string, any]) => {
                                        let hoursDisplay = "Closed";
                                        if (hours) {
                                          if (
                                            typeof hours === "object" &&
                                            hours.open &&
                                            hours.close
                                          ) {
                                            hoursDisplay = `${hours.open} - ${hours.close}`;
                                          } else if (
                                            typeof hours === "string"
                                          ) {
                                            hoursDisplay = hours;
                                          }
                                        }
                                        return (
                                          <div
                                            key={day}
                                            className="flex justify-between text-sm"
                                          >
                                            <span className="capitalize text-gray-600">
                                              {day}:
                                            </span>
                                            <span className="text-gray-900">
                                              {hoursDisplay}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span>{airport.operation_hours}</span>
                                  )
                                ) : (
                                  "24/7"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>

                      {/* Ground Transportation */}
                      {airport.ground_transportation && (
                        <Col span={24}>
                          <div className="bg-gray-50 p-3 md:p-6 rounded-lg">
                            <div className="flex items-start">
                              <CarOutlined className="text-gray-500 text-2xl mr-4 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-xl text-gray-800 mb-2">
                                  Ground Transportation
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {airport.ground_transportation}
                                </p>
                                {airport.additional_info && (
                                  <p className="text-sm text-gray-600 mt-3">
                                    <span className="font-semibold">Note:</span>{" "}
                                    {airport.additional_info}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                </Card>
              </div>
            ))}

            {/* Show "SEE MORE" button */}
            {airports.length > 1 && !showAllAirports && (
              <div className="flex justify-center mt-6">
                <Button
                  type="primary"
                  size="large"
                  icon={<DownOutlined />}
                  onClick={() => setShowAllAirports(true)}
                  className="bg-[#AF2322] hover:bg-[#9e1f1a] border-[#AF2322] hover:border-[#9e1f1a]"
                >
                  SEE MORE AIRPORTS ({airports.length - 1} more)
                </Button>
              </div>
            )}

            {/* Show "SHOW LESS" button */}
            {airports.length > 1 && showAllAirports && (
              <div className="flex justify-center mt-6">
                <Button
                  type="default"
                  size="large"
                  icon={<UpOutlined />}
                  onClick={() => setShowAllAirports(false)}
                >
                  SHOW LESS
                </Button>
              </div>
            )}
          </div>

          {/* Print version - plain text, no styling, page break before */}
          <div className="print-only">
            <h2 className="text-lg font-bold mb-4 text-primary">
              Airport Information
            </h2>
            {airports?.map((airport: any, index: number) => (
              <div key={`print-${airport.id}`} className="mb-6">
                <h3 className="text-base font-bold mb-2">
                  {airport.name} ({airport.identifier})
                </h3>
                <div className="text-sm leading-relaxed">
                  <p>
                    <strong>Use:</strong> {airport.use} |{" "}
                    <strong>Elevation:</strong> {airport.elevation_feets} ft
                  </p>
                  <p>
                    <strong>Orientation:</strong> {airport.orientation} |{" "}
                    <strong>Surface:</strong>{" "}
                    {airport.surface
                      ?.map((surf: string) =>
                        surf === "Other" && airport.other_runway_type
                          ? `Other (${airport.other_runway_type})`
                          : surf
                      )
                      .join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Dimensions:</strong> {airport.dimension_length} ft ×{" "}
                    {airport.dimension_width} ft | <strong>Condition:</strong>{" "}
                    {airport.runway_condition || "N/A"}
                  </p>
                  <p>
                    <strong>Lighting:</strong>{" "}
                    {airport.lighting ? "Available" : "None"} |{" "}
                    <strong>Fuel:</strong> {airport.fuel?.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Parking:</strong> {getParkingLabel(airport.parking)}{" "}
                    | <strong>Pattern:</strong>{" "}
                    {getPatternLabel(airport.pattern)}
                  </p>
                  <p>
                    <strong>CTAF/UNICOM:</strong> {airport.ctaf_unicom || "N/A"}{" "}
                    | <strong>Hours:</strong>{" "}
                    {airport.operation_hours
                      ? typeof airport.operation_hours === "string"
                        ? airport.operation_hours
                        : "See details"
                      : "24/7"}
                  </p>
                  {airport.ground_transportation && (
                    <p>
                      <strong>Ground Transportation:</strong>{" "}
                      {airport.ground_transportation}
                    </p>
                  )}
                </div>
                {index < airports.length - 1 && (
                  <hr className="my-4 border-gray-300" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AirportDetailsSection;
