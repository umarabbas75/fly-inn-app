import React from "react";
import Link from "next/link";

const FairHousingPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-container py-12">
        <div className="">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Fair Housing Policy
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                FlyInn is committed to building a community where everyone is
                welcome and can feel a sense of belonging. We prohibit
                discrimination and are dedicated to providing equal treatment to
                all members of our community.
              </p>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                Our Commitment
              </h2>

              <p className="text-gray-700 mb-4">
                FlyInn prohibits discrimination based on race, color, ethnicity,
                national origin, religion, sexual orientation, gender identity,
                marital status, age, disability, or any other characteristic
                protected under applicable federal, state, or local law.
              </p>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                For Hosts
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>
                  Hosts must not decline guests based on protected
                  characteristics
                </li>
                <li>
                  Hosts must not impose different terms or conditions based on
                  protected characteristics
                </li>
                <li>
                  Hosts must not post listings that discourage or indicate a
                  preference for or against guests based on protected
                  characteristics
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                For Guests
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>
                  Guests must respect hosts and their property regardless of
                  protected characteristics
                </li>
                <li>
                  Guests must not engage in discriminatory behavior or
                  harassment
                </li>
                <li>
                  Guests must treat all community members with respect and
                  dignity
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#AF2322] mb-4">
                Enforcement
              </h2>

              <p className="text-gray-700 mb-4">
                Violations of this policy may result in suspension or removal
                from the FlyInn platform. We investigate all reports of
                discrimination and take appropriate action.
              </p>

              <div className="mt-8 p-6 bg-[#AF2322] bg-opacity-5 rounded-lg border-l-4 border-[#AF2322]">
                <h3 className="text-xl font-bold text-white mb-2">
                  Report Discrimination
                </h3>
                <p className="text-white/90 mb-4">
                  If you experience or witness discrimination on our platform,
                  please report it immediately.
                </p>
                <Link
                  href="mailto:violations@fly-inn.com"
                  className="text-[#AF2322] hover:underline font-semibold"
                >
                  violations@fly-inn.com
                </Link>
              </div>

              <div className="mt-8">
                <p className="text-gray-600 text-sm">
                  This policy is in compliance with the Fair Housing Act and all
                  applicable state and local laws. FlyInn is committed to
                  continuing to build an inclusive community for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FairHousingPolicyPage;
