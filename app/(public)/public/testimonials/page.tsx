"use client";

import React, { useState } from "react";
import Image from "next/image";
import NewsletterSection from "../../_components/newsletter-section";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const testimonials = [
  {
    name: "Kendra M",
    role: "Fly-Inn Guest",
    img: "/images/testimonails/testimonial.jpg",
    text: `"Fly-Inn.com provides the best service. It's is like a curated list of places to stay that includes only the properties that would be considered 5-star on the fun and all-around awesome scale..."`,
  },
  {
    name: "David M",
    role: "Fly-Inn Guest",
    img: "/images/testimonails/testimonial1.jpg",
    text: `"I travel for work often and I like to commute in my own plane. It's great that Fly-Inn specializes in unique spots, like hangar homes and places near small airports. I love that I can fly my plane to the destination closest to where I will be working, park in the hangar and have a car there waiting for me! Ingenious!"`,
  },
  {
    name: "Jeannie B",
    role: "Fly-Inn Host",
    img: "/images/testimonails/testimonial2.jpg",
    text: `"I love meeting fun-loving people, so hosting is a blast for me. My husband and I are pilots and we have been guests at various Fly-Inn listings. I've never had a bad stay and all our guests have been great. Great community, it feels like family!"`,
  },
  {
    name: "Mike N",
    role: "Fly-Inn Guest",
    img: "/images/testimonails/testimonial3.jpg",
    text: `"I have been staying at places on Fly-Inn for a few years now. I enjoy seeing the inventory grow more and more. At first I stayed at whatever was available, just for fun. Now there are so many listings it's making me want to host, too!"`,
  },
  {
    name: "Gary S",
    role: "Fly-Inn Host",
    img: "/images/testimonails/testimonial4.jpg",
    text: `"I'm not a pilot, but I do live across the street from a municipal airport. When I heard about Fly-Inn, I saw a great opportunity for me to make some extra cash from the pilot community since my house is not in a desirable location for other rental websites. It has worked out great for me. Very clean people."`,
  },
  {
    name: "Alexis H",
    role: "Fly-Inn Guest",
    img: "/images/testimonails/testimonial5.jpg",
    text: `"Fly-Inn.com lets me stay at the most fun places and there is always something for my family to do. I have stayed at places that even offer ATVs and boats! Our host even gave us transportation to and from the airport!"`,
  },
];

const getVisibleTestimonials = (current: number) => {
  // Always show 3, center is current
  const total = testimonials.length;
  const left = (current + total - 1) % total;
  const right = (current + 1) % total;
  return [left, current, right];
};

const TestimonialsPage = () => {
  const [current, setCurrent] = useState(1);
  const visible = getVisibleTestimonials(current);

  const handlePrev = () =>
    setCurrent(
      (prev) => (prev + testimonials.length - 1) % testimonials.length
    );
  const handleNext = () =>
    setCurrent((prev) => (prev + 1) % testimonials.length);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center mb-8 md:mb-12 py-8 md:py-12">
        <div className="app-container">
          <h1 className="text-xl md:text-2xl font-bold text-gray-700 pb-6">
            Testimonials
          </h1>
          <div className="text-center">
            <h2 className="text-base md:text-lg font-semibold text-gray-600 mb-3">
              Hear From Our Hosts and Guests
            </h2>
            <p className="text-gray-500 text-xs md:text-sm max-w-2xl mx-auto">
              Our greatest reward is your satisfaction. Share your experience
              with us!
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <div className="w-full flex justify-center items-center mb-16 px-4">
        <button
          aria-label="Previous"
          onClick={handlePrev}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 hover:border-gray-500 transition-colors mr-2"
        >
          <IoChevronBack size={20} />
        </button>
        <div className="flex gap-4 md:gap-6 w-full max-w-6xl justify-center">
          {visible.map((idx, i) => (
            <div
              key={idx}
              className={`
                flex-1 bg-white rounded-lg border transition-all duration-300 flex flex-col items-center px-4 md:px-6 py-6 md:py-8 shadow-sm relative
                ${
                  i === 1
                    ? "!bg-gray-50 border-gray-300 z-10 scale-105 shadow-lg"
                    : "border-gray-200 opacity-90"
                }
                ${i !== 1 ? "hidden md:flex" : "flex"}
              `}
              style={{ minWidth: 200, maxWidth: 360 }}
            >
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-200 mb-3">
                  <Image
                    src={testimonials[idx].img}
                    alt={testimonials[idx].name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="font-semibold text-sm md:text-base text-gray-700 mb-1">
                  {testimonials[idx].name}
                </div>
                <div className="text-xs text-gray-500 italic">
                  {testimonials[idx].role}
                </div>
              </div>
              <div className="text-xs md:text-sm text-center text-gray-600 leading-relaxed">
                {testimonials[idx].text}
              </div>
            </div>
          ))}
        </div>
        <button
          aria-label="Next"
          onClick={handleNext}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-400 text-gray-500 hover:bg-gray-100 hover:border-gray-500 transition-colors ml-2"
        >
          <IoChevronForward size={20} />
        </button>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default TestimonialsPage;
