"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { lodgingType } from "@/constants/stays";

// Map lodging types to local images
const getLodgingImage = (value: string): string => {
  const imageMap: Record<string, string> = {
    apt_condo_loft: "/images/lodging-types/homedwelling11.webp",
    bed_breakfast: "/images/lodging-types/homedwelling2.webp",
    beachfront: "/images/lodging-types/homedwelling2b.webp",
    cabin: "/images/lodging-types/homedwelling3.webp",
    campsite: "/images/lodging-types/homedwelling4.webp",
    farm: "/images/lodging-types/homedwelling6.webp",
    hangar: "/images/lodging-types/homedwelling7.webp",
    hangar_home: "/images/lodging-types/homedwelling8.webp",
    house: "/images/lodging-types/homedwelling9.webp",
    hotel_room: "/images/lodging-types/homedwelling14.webp",
    mansion: "/images/lodging-types/homedwelling12.webp",
    novelty: "/images/lodging-types/homedwelling14.webp",
    rv: "/images/lodging-types/rv.png",
    rv_pad: "/images/lodging-types/rvpad.png",
    tiny_home: "/images/lodging-types/homedwelling14.webp",
    // Villa doesn't have a local image, using online fallback
    villa:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop",
  };

  // Return mapped image or use a fallback
  return imageMap[value] || "/images/lodging-types/homedwelling14.webp";
};

const FindSpacesSection = () => {
  return (
    <section className="bg-[#f6f8fa] py-16 md:py-24">
      <div className="app-container">
        {/* Header - Consistent with other sections */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">
            Find Your Perfect Space
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Browse by <span className="text-[#AF2322]">Lodging Type</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            From cozy cabins to hangar homes, find the perfect accommodation
            that suits your flying adventure and personal style.
          </p>
        </div>
        <div className="grid gap-4  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {lodgingType.map((item) => (
            <Link
              key={item.value}
              href={`/public/stays/stay-lodging?lodging_type=${item.value}`}
            >
              <div className="relative card overflow-hidden rounded-md max-h-[175px] cursor-pointer group">
                <Image
                  src={getLodgingImage(item.value)}
                  alt={item.label}
                  width={400}
                  height={175}
                  className="w-full h-[175px] object-cover transition-transform duration-300 ease-in-out transform rounded-md group-hover:scale-105"
                  unoptimized
                />
                <div
                  className="absolute bottom-0 left-0 right-0 z-20 text-center bg-gradient-to-t from-black to-transparent"
                  style={{ height: "30%" }}
                >
                  <div className="p-4">
                    <h3 className="text-white font-semibold">{item.label}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FindSpacesSection;
