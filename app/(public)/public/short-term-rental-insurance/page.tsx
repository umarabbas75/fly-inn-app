"use client";

import React from "react";
import Link from "next/link";
import { HomeOutlined, SafetyOutlined } from "@ant-design/icons";
import { ChevronLeft } from "lucide-react";

export default function ShortTermRentalInsurance() {
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
              <span className="text-white">Short-Term Rental Insurance</span>
            </nav>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Short-Term Rental Insurance
          </h1>
          <p className="text-white/90 text-lg">
            Protecting your aviation property and peace of mind
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
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <SafetyOutlined className="text-3xl text-blue-600 mb-4" />
                <p className="text-gray-700 leading-relaxed text-base">
                  Fly-Inn understands that hosting aviation enthusiasts requires
                  specialized insurance coverage. Traditional homeowners
                  insurance typically doesn't cover short-term rental
                  activities, especially those involving aircraft and
                  aviation-related facilities.
                </p>
              </div>
            </div>

            {/* Coverage Types */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Types of Coverage You Need
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1. Property Damage Protection
                  </h3>
                  <p className="text-gray-700 text-base mb-3">
                    Covers damage to your property caused by guests, including:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-600 text-sm">
                    <li>Damage to the residence and its contents</li>
                    <li>Damage to hangar facilities</li>
                    <li>Damage to tie-down areas</li>
                    <li>Accidental damage caused by aircraft operations</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2. Liability Coverage
                  </h3>
                  <p className="text-gray-700 text-base mb-3">
                    Protects you from claims if a guest is injured on your
                    property:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-600 text-sm">
                    <li>Bodily injury on the premises</li>
                    <li>Aviation-related accidents on your property</li>
                    <li>Legal defense costs</li>
                    <li>Medical payments to injured parties</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3. Loss of Income Protection
                  </h3>
                  <p className="text-gray-700 text-base mb-3">
                    Compensates for lost rental income due to:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-600 text-sm">
                    <li>Property damage requiring repairs</li>
                    <li>Guest cancellations due to covered events</li>
                    <li>Temporary uninhabitability of the property</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    4. Aviation-Specific Coverage
                  </h3>
                  <p className="text-gray-700 text-base mb-3">
                    Special considerations for aviation properties:
                  </p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-600 text-sm">
                    <li>Hangar keeper's liability</li>
                    <li>Aircraft damage while in your care</li>
                    <li>Runway and taxiway liability</li>
                    <li>Fuel storage and dispensing coverage</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Requirements */}
            <section className="mb-10">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Fly-Inn Insurance Requirements
                </h2>
                <p className="text-gray-700 text-base mb-4">
                  All hosts on the Fly-Inn platform must maintain adequate
                  insurance coverage:
                </p>
                <ol className="list-decimal ml-6 space-y-3 text-gray-700 text-base">
                  <li>
                    <strong>Minimum Coverage:</strong> Maintain at least
                    $1,000,000 in liability coverage
                  </li>
                  <li>
                    <strong>Property Coverage:</strong> Adequate coverage for
                    your property's replacement value
                  </li>
                  <li>
                    <strong>Disclosure:</strong> Inform your insurance provider
                    about short-term rental activities
                  </li>
                  <li>
                    <strong>Aviation Activities:</strong> Ensure coverage
                    includes aviation-related activities on your property
                  </li>
                  <li>
                    <strong>Proof of Insurance:</strong> Provide proof of
                    coverage upon request
                  </li>
                </ol>
              </div>
            </section>

            {/* Recommended Providers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Recommended Insurance Providers
              </h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <p className="text-gray-700 text-base mb-4">
                  We recommend working with insurance providers who understand
                  aviation and short-term rentals:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700 text-base">
                  <li>Providers specializing in aviation property insurance</li>
                  <li>Companies offering short-term rental endorsements</li>
                  <li>
                    Insurers familiar with airpark and hangar home properties
                  </li>
                  <li>
                    Agents who understand pilot and aviation enthusiast needs
                  </li>
                </ul>
                <p className="text-gray-600 text-sm mt-4 italic">
                  Note: Fly-Inn does not endorse specific insurance companies.
                  Please conduct your own research and consult with insurance
                  professionals to find coverage that meets your needs.
                </p>
              </div>
            </section>

            {/* Important Disclaimers */}
            <section className="mb-10">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Important Disclaimers
                </h3>
                <ul className="list-disc ml-6 space-y-3 text-gray-700 text-base">
                  <li>
                    Fly-Inn does not provide insurance coverage for hosts or
                    guests
                  </li>
                  <li>
                    Hosts are solely responsible for obtaining and maintaining
                    adequate insurance
                  </li>
                  <li>
                    Traditional homeowners insurance may not cover short-term
                    rental activities
                  </li>
                  <li>
                    Failure to maintain adequate insurance may result in
                    personal liability for damages
                  </li>
                  <li>
                    Insurance requirements may vary by state and local
                    jurisdiction
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Section */}
            <section className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Questions About Insurance?
              </h3>
              <p className="text-gray-700 text-base">
                If you have questions about insurance requirements for hosting
                on Fly-Inn, please contact us at{" "}
                <a
                  href="mailto:help@fly-inn.com?subject=Insurance Questions"
                  className="text-[#AF2322] hover:text-[#8B1B1B] underline font-medium"
                >
                  help@fly-inn.com
                </a>{" "}
                with the subject line "Insurance Questions".
              </p>
              <p className="text-gray-600 text-sm mt-4">
                We strongly recommend consulting with a licensed insurance
                professional to ensure you have appropriate coverage for your
                specific situation.
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
              href="/public/terms-of-service"
              className="text-[#AF2322] hover:text-[#8B1B1B] underline text-base"
            >
              Terms of Service →
            </Link>
            <Link
              href="/public/service-fees-policy"
              className="text-[#AF2322] hover:text-[#8B1B1B] underline text-base"
            >
              Service Fees Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
