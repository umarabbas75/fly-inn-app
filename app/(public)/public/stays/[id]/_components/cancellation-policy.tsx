import React from "react";

const CancellationPolicy = ({ mockListing }: { mockListing: any }) => {
  const cancellation_policy_short =
    mockListing?.cancellation_policy_short || {};
  const cancellation_policy_long = mockListing?.cancellation_policy_long || {};

  return (
    <div className="mt-10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-1">
          Cancellation Policy
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Short Term Policy */}
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h3 className="font-bold text-gray-800">
                {cancellation_policy_short?.group_name || "Short-term Policy"}
              </h3>
              <p className="text-gray-500 text-sm">Short-term stays</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <i className="fa fa-calendar-check text-gray-500 mt-1 print-hidden" />
              <div>
                <h4 className="font-medium text-gray-800 mb-1">
                  Before check-in
                </h4>
                <p className="text-gray-700 text-sm">
                  {cancellation_policy_short?.before_check_in ||
                    "No information available"}
                </p>
              </div>
            </div>

            <div className="flex">
              <i className="fa fa-door-open text-gray-500 mt-1 print-hidden" />
              <div>
                <h4 className="font-medium text-gray-800 mb-1">
                  After check-in
                </h4>
                <p className="text-gray-700 text-sm">
                  {cancellation_policy_short?.after_check_in ||
                    "No information available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Long Term Policy */}
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h3 className="font-bold text-gray-800">
                {cancellation_policy_long?.group_name || "Long-term Policy"}
              </h3>
              <p className="text-gray-500 text-sm">
                Long-term stays (28+ nights)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <i className="fa fa-calendar-check text-gray-500 mt-1 print-hidden" />
              <div>
                <h4 className="font-medium text-gray-800 mb-1">
                  Before check-in
                </h4>
                <p className="text-gray-700 text-sm">
                  {cancellation_policy_long?.before_check_in ||
                    "No information available"}
                </p>
              </div>
            </div>

            <div className="flex">
              <i className="fa fa-door-open text-gray-500 mt-1 print-hidden" />
              <div>
                <h4 className="font-medium text-gray-800 mb-1">
                  After check-in
                </h4>
                <p className="text-gray-700 text-sm">
                  {cancellation_policy_long?.after_check_in ||
                    "No information available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-start gap-3">
        <i className="fa fa-info-circle text-blue-500 mt-1 print-hidden" />
        <p className="text-gray-700 text-sm">
          Cancellation policies vary by booking duration. Please review
          carefully before confirming your reservation.
        </p>
      </div>
    </div>
  );
};

export default CancellationPolicy;
