import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

interface FieldLabelProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  conditionalText?: string; // e.g., "Required if pets allowed"
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  required = false,
  optional = false,
  tooltip,
  conditionalText,
}) => {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && !required && (
        <span className="text-gray-400 text-xs ml-1 font-normal">
          (optional)
        </span>
      )}
      {conditionalText && (
        <span className="text-blue-800 text-xs ml-1 font-normal">
          ({conditionalText})
        </span>
      )}
      {tooltip && (
        <Tooltip title={tooltip}>
          <InfoCircleOutlined className="ml-1 text-blue-400 cursor-help" />
        </Tooltip>
      )}
    </label>
  );
};
