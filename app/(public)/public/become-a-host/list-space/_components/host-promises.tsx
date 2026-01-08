"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import { FaArrowRight } from "react-icons/fa";
import { MdFlight, MdWarehouse, MdDirectionsCar } from "react-icons/md";

const hostPromises = [
  {
    icon: MdFlight,
    title: "Runways!",
    description:
      "Every Fly-Inn listing includes access to a landing strip or helipad on the property — or is located within 10 minutes of an airport you can pilot into yourself. Many homes are hangar homes, airpark properties, or feature private runways. Some even offer water landings for seaplanes.",
  },
  {
    icon: MdWarehouse,
    title: "Aircraft Storage!",
    description:
      "Whether it's a hangar, tie-downs on site, or storage services at a nearby airport, you can count on having a secure place for your aircraft at every Fly-Inn stay.",
  },
  {
    icon: MdDirectionsCar,
    title: "Cars!",
    description:
      "What good is landing if you can't get around once you arrive? That's why our hosts ensure ground transportation is always available. Whether it's a complimentary loaner, a quality rental car, or at the very least a ride to a nearby car rental facility—you're covered so you're mobile the moment you touch down.",
  },
];

const beforeListingSteps = [
  {
    number: "01",
    title: "Know the Rules",
    description:
      "It's essential to understand which local laws and ordinances apply to you and how they may impact your business. You'll also want to consult your accounting firm to ensure you're fully covered when it comes to tax filing, and check with your insurance providers to confirm you have the proper coverage in place. While this step may sound daunting, it can usually be completed in under an hour with just a few simple phone calls.",
  },
  {
    number: "02",
    title: "Research What Other Hosts Charge",
    description:
      "Look online at listings in your area to understand what other hosts are charging for similar spaces—and what they're offering in return. Remember, guests are always looking for the greatest value when they book. Follow the Golden Rule: treat them like royalty, just as you would want to be treated yourself, and watch your earnings soar.",
  },
  {
    number: "03",
    title: "Calculate Your Desired Profit",
    description:
      "Setting your price is a balancing act between maximizing profits and remaining at a low enough price to attract customers. Start by adding up all operating costs: Startup costs (linens, furniture, etc.), Variable costs (shampoo, cleaning supplies, etc.), Fixed costs (insurance, mortgage, maintenance, repairs, property taxes, income taxes, etc.). Convert these into a per-night cost — that's your break-even point. Now add your desired profit margin. Compare this to what other hosts are charging in your area for similar listings.",
  },
  {
    number: "04",
    title: "List Your Space",
    description:
      "All you need now is strong photography and a clear, informative description. Investing in professional real estate photography ($150–$300, depending on the number of photos) can quickly boost bookings—most hosts earn that back within their first few reservations through increased revenue. With great visuals in place, your listing is truly ready for takeoff.",
  },
];

const tools = [
  {
    icon: "/assets/images/become-a-host/management.png",
    title: "Listing Management",
    description:
      "Easily manage all of your listings with Fly-Inn's simple, straightforward platform.",
  },
  {
    icon: "/assets/images/become-a-host/booking-system.png",
    title: "Booking System",
    description:
      "Your guests will love how easy it is to choose your listing and proceed to book.",
  },
  {
    icon: "/assets/images/become-a-host/messages-system.png",
    title: "Messaging System",
    description:
      "Fly-Inn's built-in messaging system makes it easy for guests and hosts to communicate with each other.",
  },
];

const HostPromises = () => {
  return (
    <div className="bg-[#fafafa]">
      {/* What Hosts Promise Section */}
      <section className="app-container py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            What Hosts Promise in Addition to Accommodations
        </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Every Fly-Inn host commits to these essential amenities for pilots
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {hostPromises.map((promise, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#AF2322]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-[#AF2322]/10 flex items-center justify-center mb-6">
                <promise.icon className="text-2xl text-[#AF2322]" />
            </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {promise.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What To Do Before Listing Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="app-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-semibold mb-6">
              Getting Started
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              What To Do Before Listing
        </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Follow these steps to prepare your property for success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {beforeListingSteps.map((step, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#AF2322]/20 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#AF2322] text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
            </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
              </p>
            </div>
          </div>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* All the Tools Section */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="app-container">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              All the tools you need, right at your fingertips.
          </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Fly-Inn gives you everything you need to manage your
              aviation-friendly accommodations with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#AF2322]/30 transition-all duration-300 hover:shadow-lg text-center"
              >
                <div className="flex justify-center mb-6">
              <Image
                    src={tool.icon}
                    alt={tool.title}
                width={60}
                height={60}
              />
            </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {tool.title}
              </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tool.description}
              </p>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Sections - Side by Side */}
      <section className="app-container py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ready to List - Primary CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#AF2322] via-[#c93a39] to-[#AF2322] p-8 md:p-10 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to List?
              </h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Click the button below to join the Fly-Inn Family and start
                welcoming pilots from around the world.
              </p>
              <Link href="/public/become-a-host/get-started">
                <button className="group border-0 inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 text-[#AF2322] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                  List Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Still Got Doubts - Secondary CTA */}
          <div className="rounded-2xl bg-white border border-gray-200 p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still got doubts?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              If you have any questions, please visit our FAQ (Frequently Asked
              Questions) page, or give us a call and we will be happy to assist
              you.
            </p>
            <Link href="/public/faq">
              <button className="group border border-gray-300 inline-flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all duration-300">
                Visit FAQ
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HostPromises;
