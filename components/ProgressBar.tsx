import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ width: "100%", margin: "16px 0" }}>
      <div
        style={{
          background: "#e5e7eb",
          borderRadius: 8,
          height: 10,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,

            height: "100%",
            borderRadius: 8,
            transition: "width 0.3s",
          }}
          className="bg-gray-600"
        />
      </div>
      <div
        style={{
          textAlign: "right",
          fontSize: 12,
          color: "#374151",
          marginTop: 4,
        }}
      >
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default ProgressBar;
