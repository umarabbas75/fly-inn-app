import React from "react";

const BusinessDisclaimer = () => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 mt-20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Disclaimer
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Listings in the Fly-Inn Directory are provided for informational
            purposes only. Fly-Inn is not affiliated with, does not endorse,
            does not verify, recommend, or warrant, and is not responsible for
            or liable for any third-party business, products, or services listed
            in this directory. All services are provided by independent
            operators. Please conduct your own due diligence before engaging.
            Any interaction, transaction, agreement, or engagement is strictly
            between you and the listed business and is undertaken at your own
            risk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessDisclaimer;
