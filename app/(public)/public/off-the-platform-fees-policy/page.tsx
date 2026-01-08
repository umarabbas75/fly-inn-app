"use client";

import React from "react";
import Link from "next/link";
import { HomeOutlined } from "@ant-design/icons";
import { ChevronLeft } from "lucide-react";

export default function OffThePlatformFeesPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#AF2322] to-[#8B1B1B]">
        <div className="app-container py-12">
          <div className="flex items-center justify-between mb-4">
            <nav className="flex items-center space-x-2 text-white/80 text-xs">
              <Link
                href="/"
                className="text-white hover:text-white transition-colors"
              >
                <HomeOutlined className="text-lg" />
              </Link>
              <span>/</span>
              <Link
                href="/public/terms-of-service"
                className="text-white hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <span>/</span>
              <span className="text-white">Off-the-Platform Fees Policy</span>
            </nav>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Off-the-Platform Fees Policy
          </h1>
          <p className="text-white/90 text-lg">
            Understanding permitted fees and charges
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="app-container">
        <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          {/* Back Link */}
          <Link
            href="/public/terms-of-service"
            className="inline-flex items-center text-[#AF2322] hover:text-[#8B1B1B] mb-8 transition-colors"
          >
            <ChevronLeft className="mr-2" />
            Back to Terms of Service
          </Link>

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-10">
              <p className="text-gray-700 leading-relaxed text-base">
                You may not collect any other fees or charges off the Platform
                without express written permission from Fly-Inn, except in the
                case of hotels, motels, inns, resorts, etc. in charging and
                processing certain payments on their payment systems. Hotels use
                these terms interchangeably, so, for example, what one hotel may
                call an incidental hold another may call a security deposit.
              </p>
            </div>

            {/* Permitted Fees Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Permitted Off-the-Platform Fees for Hotels
              </h2>
              <p className="text-gray-700 mb-6 text-base">
                Following is a list of off-the-platform fees for which hotel
                hosts do not need to obtain our written permission:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="border-l-4 border-[#AF2322] pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    1. Security Deposit
                  </h3>
                  <p className="text-gray-600 text-sm">
                    An amount held by the hotel temporarily to cover potential
                    incidental costs during a guest's stay or to secure a room
                    booking
                  </p>
                </div>

                <div className="border-l-4 border-[#AF2322] pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    2. Incidental Hold
                  </h3>
                  <p className="text-gray-600 text-sm">
                    An amount that represents the cost of amenities and services
                    that are not included in the hotel's room rates. It can
                    include costs such as repairs for any damage caused to the
                    room by the guest, valet parking, self-parking, shuttle
                    fees, room service, minibar items, spa treatments, internet
                    access, etc.
                  </p>
                </div>

                <div className="border-l-4 border-[#AF2322] pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    3. Cleaning Fee
                  </h3>
                  <p className="text-gray-600 text-sm">
                    An amount that is usually included in the room rate. If you
                    see a cleaning fee, it might be due to excessive cleaning
                    necessary when a room is left in an excessively dirty or
                    messy condition that requires the cleaning crew to go well
                    beyond the amount of time it normally takes to clean that
                    room
                  </p>
                </div>

                <div className="border-l-4 border-[#AF2322] pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    4. Resort Fees
                  </h3>
                  <p className="text-gray-600 text-sm">
                    An amount charged for conveniences and amenities such as
                    gym, spa, or pool access; pool towels; your in-room safe;
                    wireless internet access; local calls; newspapers; and more.
                  </p>
                </div>
              </div>
            </section>

            {/* Requirements Section */}
            <section className="mb-10">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    !
                  </span>
                  Requirements for All Off-the-Platform Fees
                </h3>
                <p className="text-gray-700 mb-4 text-base">
                  All off-the-platform fees must be:
                </p>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-[#AF2322] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm mt-0.5">
                      1
                    </span>
                    <span className="text-gray-700 text-base">
                      Conspicuously outlined in the listing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#AF2322] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm mt-0.5">
                      2
                    </span>
                    <span className="text-gray-700 text-base">
                      Contain a disclosure that the guest will be charged those
                      fees separately from what they are paying Fly-Inn and on a
                      separate platform
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#AF2322] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm mt-0.5">
                      3
                    </span>
                    <span className="text-gray-700 text-base">
                      Contain an additional disclosure of when the guest will be
                      required to pay those fees
                    </span>
                  </li>
                </ol>
              </div>
            </section>

            {/* Contact Section */}
            <section className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Questions?
              </h3>
              <p className="text-gray-700 text-base">
                If you need clarification about off-the-platform fees or require
                written permission for additional fees, please contact us at{" "}
                <a
                  href="mailto:help@fly-inn.com?subject=Off-the-Platform Fees"
                  className="text-[#AF2322] hover:text-[#8B1B1B] underline font-medium"
                >
                  help@fly-inn.com
                </a>
              </p>
            </section>
          </div>
        </div>

        {/* Related Policies */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Related Policies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/public/service-fees-policy"
              className="text-[#AF2322] hover:text-[#8B1B1B] underline text-base"
            >
              Service Fees Policy →
            </Link>
            <Link
              href="/public/terms-of-service"
              className="text-[#AF2322] hover:text-[#8B1B1B] underline text-base"
            >
              Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
