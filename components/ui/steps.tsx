"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepsProps {
  current: number;
  items: Array<{ title: string; description?: string }>;
  className?: string;
  size?: "small" | "default";
}

const Steps: React.FC<StepsProps> = ({
  current,
  items,
  className,
  size = "default",
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {items.map((item, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isPending = index > current;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-colors",
                    size === "small" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm",
                    isCompleted
                      ? "bg-[#AF2322] border-[#AF2322] text-white"
                      : isCurrent
                      ? "bg-[#AF2322] border-[#AF2322] text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check
                      className={size === "small" ? "w-4 h-4" : "w-5 h-5"}
                    />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "font-medium",
                      size === "small" ? "text-xs" : "text-sm",
                      isCurrent || isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    )}
                  >
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
              {index < items.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    index < current ? "bg-[#AF2322]" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export { Steps };
