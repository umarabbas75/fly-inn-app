"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { MdAirplanemodeActive } from "react-icons/md";

const BecomeAHostSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2]">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#AF2322]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative app-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          {/* Text Section */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-medium mb-6 border border-[#AF2322]/20">
              <MdAirplanemodeActive />
              Aviation Hosting Platform
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
              Host with
              <br />
              <span className="text-[#AF2322]">Fly-Inn</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed mb-8">
              Turn your property into a pilot's destination. List with ease,
              welcome aviators, and watch your runway bring the world to your
              doorstep.
            </p>

            <Link href="/public/become-a-host/get-started">
              <button className="group border-0 inline-flex items-center gap-3 px-8 py-4 bg-[#AF2322] hover:bg-[#9a1f1e] text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-[#AF2322]/25 hover:shadow-xl hover:shadow-[#AF2322]/30">
                List Your Space
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Image Section */}
          <div className="flex justify-center md:justify-end">
            <div className="w-64 sm:w-80 md:w-96 lg:w-[420px] xl:w-[500px] relative aspect-[4/3]">
              <Image
                src="/assets/images/become-a-host/become-a-host-banner.png"
                alt="Host Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeAHostSection;
