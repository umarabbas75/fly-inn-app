"use client";

import React from "react";
import { Button } from "antd";
import { CloseOutlined, SwapOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCompare } from "@/providers/CompareProvider";

const CompareBar = () => {
  const router = useRouter();
  const { compareStays, removeFromCompare, clearCompare } = useCompare();

  if (compareStays.length === 0) return null;
  console.log({ compareStays });
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#AF2322] shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="app-container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Selected stays */}
          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <SwapOutlined className="text-[#AF2322] text-xl" />
              <span className="text-sm font-semibold text-gray-900">
                Compare ({compareStays.length}/3)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {compareStays.map((stay) => (
                <div
                  key={stay.id}
                  className="relative flex items-center gap-2 bg-gray-50 rounded-lg p-2 pr-8 border border-gray-200 flex-shrink-0"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={stay.image}
                      alt={stay.title || stay.name || "Stay"}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="max-w-[150px]">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {stay.title || stay.name}
                    </p>
                    <p className="text-xs text-gray-500">${stay.price}/night</p>
                  </div>
                  <button
                    onClick={() => removeFromCompare(stay.id)}
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors border border-gray-200"
                  >
                    <CloseOutlined className="text-[10px] text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={clearCompare} size="small" className="text-xs">
              Clear All
            </Button>
            <Button
              type="primary"
              size="middle"
              disabled={compareStays.length < 2}
              onClick={() => {
                const ids = compareStays.map((s) => s.id).join(",");
                router.push(`/public/stays/compare?ids=${ids}`);
              }}
              className="bg-[#AF2322] hover:!bg-[#8A1C1C] border-none font-semibold"
              style={{ backgroundColor: "#AF2322" }}
            >
              Compare Now ({compareStays.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
