"use client";

import React, { useState } from "react";
import { Progress, Tag, Button, Badge } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FormProgress,
  getProgressColor,
  getProgressStatus,
} from "@/utils/stay-form-progress";

interface FormProgressIndicatorProps {
  progress: FormProgress;
}

export const FormProgressIndicator: React.FC<FormProgressIndicatorProps> = ({
  progress,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const progressColor = getProgressColor(progress.percentage);
  const progressStatus = getProgressStatus(progress.percentage);

  return (
    <>
      <div className="flex flex-row items-center gap-2 sm:gap-4">
        {/* Progress Bar */}
        <div className="flex-1 min-w-0">
          {/* Form Completion Label and Tag - Hidden on mobile */}
          <div className="hidden sm:flex sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Form Completion
            </span>
            <Tag color={progressColor} className="text-[10px] sm:text-xs">
              {progressStatus}
            </Tag>
          </div>
          <Progress
            percent={progress.percentage}
            strokeColor={{
              "0%": progress.percentage === 100 ? "#52c41a" : "#1890ff",
              "100%": progress.percentage === 100 ? "#52c41a" : "#13c2c2",
            }}
            size="small"
            className="[&_.ant-progress-text]:text-[10px] sm:[&_.ant-progress-text]:text-xs"
          />
        </div>

        {/* Stats and Details Button */}
        <div className="flex flex-row items-center gap-1 sm:gap-4 text-xs sm:text-sm flex-shrink-0">
          {/* Stats - Hidden on mobile */}
          <span className="hidden sm:inline text-gray-600 whitespace-nowrap">
            <strong>{progress.completedFields}</strong> of{" "}
            <strong>{progress.totalFields}</strong> fields
          </span>
          {/* Details Button - Always visible */}
          <Button
            type="link"
            size="small"
            icon={<InfoCircleOutlined className="text-xs sm:text-sm" />}
            onClick={() => {
              console.log("button clicked");
              setShowDetails(true);
            }}
            className="!p-0 !h-auto text-[10px] sm:text-xs"
          >
            Details
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-[600px] w-[90%] p-4 [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium text-gray-900">
              Form Completion Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {/* Overall Progress */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-700">Overall Progress</span>
                <span className="text-xs font-medium text-[#AF2322]">
                  {progress.percentage}%
                </span>
              </div>
              <Progress
                percent={progress.percentage}
                strokeColor="#AF2322"
                size="small"
              />
              <p className="text-xs text-gray-600 mt-2">
                {progress.completedFields} of {progress.totalFields} required
                fields completed
              </p>
            </div>

            {/* Completed Fields */}
            {progress.completedFieldsList.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h3 className="text-xs text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircleOutlined className="text-gray-600 text-xs" />
                  Completed Fields ({progress.completedFieldsList.length})
                </h3>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {progress.completedFieldsList.map((field, index) => (
                      <li key={index} className="text-xs text-gray-600">
                        • {field}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Incomplete Fields */}
            {progress.incompleteFields.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h3 className="text-xs text-gray-900 mb-2 flex items-center gap-2">
                  <CloseCircleOutlined className="text-gray-600 text-xs" />
                  Incomplete Fields ({progress.incompleteFields.length})
                </h3>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {progress.incompleteFields.map((field, index) => (
                      <li key={index} className="text-xs text-gray-600">
                        • {field}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="primary"
              onClick={() => {
                setShowDetails(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
