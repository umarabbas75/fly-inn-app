"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { color?: "primary" | "red" }
>(({ className, color = "primary", value, ...props }, ref) => {
  // If value is a range (array of two numbers), show indicators above thumbs
  const isRange = Array.isArray(value) && value.length === 2;
  return (
    <div className="relative w-full">
      {isRange && (
        <div className="absolute w-full flex justify-between -top-6 z-10 pointer-events-none select-none">
          <span className="text-xs font-semibold text-red-600 bg-white px-2 py-0.5 rounded shadow border border-red-100">{value[0]}</span>
          <span className="text-xs font-semibold text-red-600 bg-white px-2 py-0.5 rounded shadow border border-red-100">{value[1]}</span>
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full",
          color === "red" || color === "primary"
            ? "bg-red-100"
            : "bg-secondary"
        )}>
          <SliderPrimitive.Range className={cn(
            "absolute h-full",
            color === "red" || color === "primary"
              ? "bg-red-600"
              : "bg-primary"
          )} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(
          "block h-5 w-5 rounded-full border-2 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          color === "red" || color === "primary"
            ? "border-red-600 hover:border-red-700"
            : "border-primary"
        )} />
        {isRange && (
          <SliderPrimitive.Thumb className={cn(
            "block h-5 w-5 rounded-full border-2 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            color === "red" || color === "primary"
              ? "border-red-600 hover:border-red-700"
              : "border-primary"
          )} />
        )}
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider }
