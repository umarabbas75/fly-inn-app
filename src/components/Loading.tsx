import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-full h-full",
  };

  if (size === "large") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <img
          src="/assets/loader.gif"
          alt="Loading..."
          className={`${sizeClasses[size]} object-contain`}
        />
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <img
        src="/assets/loader.gif"
        alt="Loading..."
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};

export default Loading;
