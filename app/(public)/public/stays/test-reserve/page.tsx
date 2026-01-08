"use client";

import React from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";

const TestReservePage = () => {
  const router = useRouter();

  const goToReservePage = () => {
    // Navigate to reserve page with test parameters
    const testParams = new URLSearchParams({
      stay_id: "163",
      check_in: "2025-09-24T00:00:00.000Z",
      check_out: "2025-09-27T00:00:00.000Z",
      no_of_adults: "2",
      no_of_children: "1",
      no_of_infants: "0",
      no_of_pets: "0",
      nightly_price: "395.00",
    });

    router.push(`/public/stays/163/reserve?${testParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          🎯 Reserve Page Test
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Click the button below to view the beautiful reserve page UI
        </p>
        <Button
          type="primary"
          size="large"
          onClick={goToReservePage}
          className="h-12 px-8 text-lg"
        >
          🚀 View Reserve Page
        </Button>
        <div className="mt-8 text-sm text-gray-500">
          <p>This will navigate to: /public/stays/163/reserve</p>
          <p>With test booking parameters</p>
        </div>
      </div>
    </div>
  );
};

export default TestReservePage;
