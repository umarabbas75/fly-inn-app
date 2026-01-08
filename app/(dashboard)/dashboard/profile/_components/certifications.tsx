import React from "react";
import AirmenCertifications from "./airmen-certifications";
import DriverLicense from "./driver-license";

const Certifications = () => {
  return (
    <div className="space-y-6">
      <AirmenCertifications />
      <DriverLicense />
    </div>
  );
};

export default Certifications;
