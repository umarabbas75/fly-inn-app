"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FEATURES = [
  {
    title: "Exceptional Accommodations",
    description:
      "Every Fly-Inn stay is carefully selected for comfort, quality, and character—so wherever you fly, you arrive to a place you'll truly enjoy.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    title: "Pilot-Ready Landings",
    description:
      "Each Fly-Inn property offers direct runway access or is located just minutes from a pilot-accessible airport, making your arrival smooth and stress-free.",
    image:
      "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80",
  },
  {
    title: "The Fly-Inn Family",
    description:
      "Every Fly-Inn is built on the shared bond of aviation—connecting aviation-minded hosts and fellow pilots through a welcoming, tight-knit community that feels like home.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  },
  {
    title: "Ground Transportation",
    description:
      "Every Fly-Inn stay includes access to reliable ground transportation, so you're mobile the moment you touch down.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
  },
  {
    title: "Hangars & Tie-Downs",
    description:
      "Every Fly-Inn stay includes secure hangar or tie-down access for safe aircraft parking during your stay.",
    image:
      "https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&q=80",
  },
];

const FlyInnDifferenceSection = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-12 md:py-24 bg-white overflow-hidden">
      <div className="app-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-4">
          <p className="text-xs md:text-sm font-semibold tracking-[0.15em] md:tracking-[0.2em] uppercase text-gray-500 mb-3 md:mb-4">
            Better than a Fly-In, it's a Fly-Inn
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
            Travel Like A Pilot
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            Fly yourself in and step into comfort. Hand-picked accommodations,
            runways, aircraft storage, ground transportation, and a built-in
            pilot community—everything you need for the perfect trip, just a few
            clicks away.
          </p>
        </div>

        {/* Navigation Arrows - Desktop */}
        <div className="hidden md:flex justify-end gap-2 mb-6">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="text-gray-600 text-sm" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            aria-label="Next slide"
          >
            <FaChevronRight className="text-gray-600 text-sm" />
          </button>
        </div>
      </div>

      {/* Features Carousel - Full width container to prevent overflow issues */}
      <div className="w-full">
        <div className="app-container">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.15}
            centeredSlides={false}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 28 },
              1536: { slidesPerView: 5, spaceBetween: 32 },
            }}
            className="!overflow-hidden"
          >
            {FEATURES.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className="group cursor-pointer pb-2">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-5 bg-gray-100">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 480px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="pr-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2 group-hover:text-[#AF2322] transition-colors duration-200 line-clamp-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed ">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex md:hidden justify-center gap-2 mt-6 px-4">
        {FEATURES.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.slideTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              activeIndex === index
                ? "bg-[#AF2322] w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default FlyInnDifferenceSection;
