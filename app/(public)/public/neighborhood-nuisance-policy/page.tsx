"use client";

import React from "react";
import Link from "next/link";
import { HomeOutlined, PhoneOutlined } from "@ant-design/icons";
import { ChevronLeft } from "lucide-react";

export default function NeighborhoodNuisancePolicy() {
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
              <span className="text-white">Neighborhood Nuisance Policy</span>
            </nav>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Neighborhood Nuisance and Disruptive Behavior Policy
          </h1>
          <p className="text-white/90 text-lg">
            Maintaining respect and harmony in our aviation community
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
              <p className="text-gray-700 leading-relaxed text-base mb-4">
                This Policy applies to Hosts as well as Guests and it
                encompasses our prohibition on Disruptive Behavior during a
                Guest's stay anywhere in or on the Rental Property, or in the
                neighborhood or area where the Rental Property is located.
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                It is difficult even to imagine Members of our Community causing
                annoyances in the neighborhoods where we are guests, or anywhere
                else. Needless to say, we all need to behave with decorum and
                treat everyone with respect and kindness, and this especially
                applies when we are guests.
              </p>
            </div>

            {/* Definition Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                DEFINITION
              </h2>
              <p className="text-gray-700 leading-relaxed text-base mb-4">
                <span className="font-semibold text-gray-900">
                  "Disruptive Behavior"
                </span>{" "}
                is herein defined as any party, gathering, get-together, or
                event, collectively{" "}
                <span className="font-semibold text-gray-900">"Event,"</span>{" "}
                that causes any kind of annoyance including, but not limited to:
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <ol className="space-y-3">
                  {[
                    "Unreasonable amounts of pollution including air, noise, lights, trash, waste",
                    "Unreasonable numbers of people",
                    "Smoking, vaping, alcohol consumption, drug use",
                    "Creating parking issues",
                    "Disregard for and disrespect of the Rental Property itself, the surrounding properties, or the neighborhood in which they are situated, including causing any kind of damage",
                    "Breaking the law with regards to the Rental Property itself, the surrounding properties, or the neighborhood in which they are situated",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-[#AF2322] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-base">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Guest and Host Commitment Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                GUEST AND HOST COMMITMENT
              </h2>

              {/* Guest Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-500 text-white rounded px-2 py-1 mr-3 text-sm">
                    GUESTS
                  </span>
                </h3>
                <p className="text-gray-700 text-base">
                  Guests are not allowed to participate in such Disruptive
                  Behaviors or actions. Fly-Inn reserves the right to intervene
                  and cancel a reservation that we, in our sole discretion,
                  determine to be a risk for Disruptive Behavior. We also
                  reserve the right to terminate a Guest's membership if these
                  rules are not followed.
                </p>
              </div>

              {/* Host Guidelines */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-amber-500 text-white rounded px-2 py-1 mr-3 text-sm">
                    HOSTS
                  </span>
                </h3>
                <p className="text-gray-700 text-base mb-3">
                  Hosts are not allowed to list their Rental Property in any way
                  that would lead a Guest to believe that Events are permitted.
                  We especially take note of Listings that invite Guests,
                  inadvertently or otherwise, to use the property as a venue
                  which could lead to Disruptive Behavior. This includes, but is
                  not limited to:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-600 text-sm">
                  <li>
                    Advertising the Rental Property as being a venue that is
                    conducive to such events
                  </li>
                  <li>
                    Posting photography of the Rental Property decorated for an
                    Event
                  </li>
                  <li>Posting photography in which an Event is taking place</li>
                  <li>
                    Using words such as "party," "event," "gathering,"
                    "hangout," "graduation," "bachelor," "bachelorette"
                  </li>
                  <li>
                    Setting the number of guests allowed in the listing
                    inordinately high for the amount of space
                  </li>
                </ul>
              </div>

              {/* Enforcement Notice */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <p className="text-gray-700 text-base">
                  Fly-Inn reserves the right to intervene and cancel a
                  reservation that we, in our sole discretion, determine to be a
                  risk for Disruptive Behavior. We also reserve the right to
                  terminate a Host's membership and permanently delete a Listing
                  if these rules are not followed. Not canceling a reservation,
                  terminating a membership, deleting a Listing, or taking any
                  other corrective action does not mean we give up that right.
                </p>
              </div>
            </section>

            {/* Intervention Section */}
            <section className="mb-10">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  INTERVENTION
                </h2>
                <p className="text-gray-700 text-base mb-4">
                  As Members of this wonderful tight-knit Community of aviation
                  enthusiasts, we ask you to help us keep our Community thriving
                  by ensuring the rules above are followed. The best way to do
                  this is to call us to report any of the above Disruptive
                  Behaviors immediately, especially if it is still happening
                  when you call. This is the time we can intervene most
                  effectively.
                </p>
                <p className="text-gray-700 text-base mb-6">
                  If you are not a Member of our Community, we still urge you to
                  call us should you see any Disruptive Behavior and we thank
                  you in advance for doing so.
                </p>

                {/* Contact Information */}
                <div className="bg-white rounded-lg p-6 text-center border border-green-300">
                  <PhoneOutlined className="text-3xl text-[#AF2322] mb-3" />
                  <p className="text-gray-700 font-semibold mb-2">
                    Report Disruptive Behavior:
                  </p>
                  <div className="space-y-2">
                    <p className="text-[#AF2322] text-xl font-bold">
                      833-I-Fly-Inn
                    </p>
                    <p className="text-gray-500">or</p>
                    <p className="text-[#AF2322] text-xl font-bold">
                      321-I-Fly-Inn
                    </p>
                  </div>
                </div>
              </div>
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
              href="/public/cirt-policy"
              className="text-[#AF2322] hover:text-[#8B1B1B] underline text-base"
            >
              CIRT Policy →
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
