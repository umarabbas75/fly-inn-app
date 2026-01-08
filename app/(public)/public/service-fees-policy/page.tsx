"use client";

import React from "react";
import Link from "next/link";
import { HomeOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { ChevronLeft } from "lucide-react";

export default function ServiceFeesPolicy() {
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
              <span className="text-white">Service Fees Policy</span>
            </nav>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Service Fees Policy
          </h1>
          <p className="text-white/90 text-lg">
            Transparent pricing for our aviation community
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
            {/* General Section */}
            <section className="mb-10">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <DollarCircleOutlined className="text-[#AF2322] mr-3" />
                  General
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  Service fees are indispensable to keep the Platform running,
                  for your service. The fees cover the costs of wages for our
                  employees, ongoing maintenance of the Platform, keeping
                  transactions secure, and all the rest of our overhead.
                </p>
              </div>
            </section>

            {/* Fee Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Hosts Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 text-white rounded-full p-3 mr-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">For Hosts</h2>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-600">
                      Platform Fee
                    </p>
                    <p className="text-2xl font-bold text-green-600">0%</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-600">
                      Credit Card Processing
                    </p>
                    <p className="text-2xl font-bold text-gray-900">3%</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mt-4">
                  Hosts don't pay a service fee for use of the Fly-Inn Platform.
                  Hosts simply pay the service fee that the credit card
                  companies charge—3%. There is no other fee for Hosts.
                </p>

                <div className="bg-green-100 rounded p-3 mt-4">
                  <p className="text-green-800 text-sm italic">
                    This is our way of thanking you for trusting your Rental
                    Property to your fellow Members of the Community— your
                    Fly-Inn Family. Thank you for providing your fellow Members
                    a way to have the most fun possible with their aircraft.
                  </p>
                </div>
              </div>

              {/* Guests Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 text-white rounded-full p-3 mr-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    For Guests
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-600">
                      Service Fee
                    </p>
                    <p className="text-2xl font-bold text-blue-600">11%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      of reservation subtotal
                    </p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-600">
                      International Currency
                    </p>
                    <p className="text-2xl font-bold text-gray-900">+2%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      for non-USD transactions
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mt-4">
                  Guests pay a service fee that is calculated as a percentage
                  (11%) of the subtotal of the reservation amount which equals
                  all fees for Goods and Services offered in the Listing and any
                  other fees the Host may charge.
                </p>

                <div className="bg-blue-100 rounded p-3 mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> This subtotal excludes taxes,
                    transient fees, and approved off-the-platform fees as per
                    our Off-the-Platform Fees Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Fee Calculation Example */}
            <section className="mb-10">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fee Calculation Example
                </h3>
                <div className="bg-white rounded p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">
                          Nightly Rate × 3 nights
                        </td>
                        <td className="py-2 text-right font-medium">$600.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Cleaning Fee</td>
                        <td className="py-2 text-right font-medium">$100.00</td>
                      </tr>
                      <tr className="border-b font-semibold">
                        <td className="py-2">Subtotal</td>
                        <td className="py-2 text-right">$700.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">
                          Service Fee (11%)
                        </td>
                        <td className="py-2 text-right font-medium">$77.00</td>
                      </tr>
                      <tr className="text-lg font-bold">
                        <td className="py-2">Total for Guest</td>
                        <td className="py-2 text-right text-[#AF2322]">
                          $777.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    *Taxes and other fees may apply but are not included in
                    service fee calculation
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Questions About Fees?
              </h3>
              <p className="text-gray-700 text-base">
                If you have any questions about our service fees or need
                clarification on any charges, please don't hesitate to contact
                us at{" "}
                <a
                  href="mailto:help@fly-inn.com?subject=Service Fees Question"
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
              href="/public/off-the-platform-fees-policy"
              className="text-[#AF2322] hover:text-[#8B1B1B] underline text-base"
            >
              Off-the-Platform Fees Policy →
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
