import React from "react";
import Loading from "@/src/components/Loading";

const OnLoadAnimation = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      {/* <Loading size="large" /> */}
      <img
        src="/assets/loader.gif"
        alt="Loading..."
        className=" object-contain"
      />
    </div>
  );
};

export default OnLoadAnimation;
