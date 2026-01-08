"use client";

import React from "react";
import Image from "next/image";
import {
  FaCheckCircle,
  FaUserTie,
  FaMapMarkerAlt,
  FaLanguage,
  FaIdBadge,
  FaStar,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import NewsletterSection from "../../_components/newsletter-section";

const user = {
  name: "John Baker Doe",
  avatar: "/lakeview-resort.png", // Replace with actual image if available
  badge: "Verified Host",
  stats: "2 Years hosting - 3 Listings",
  work: "Self Employed",
  location: "Huntington, West Virginia",
  languages: ["English", "French"],
  identity: "Verified",
  about: `With over 7 years of flying experience and 2 years of hosting pilots like you, I'm passionate about making your journey as seamless as possible. Whether you need a well-maintained aircraft, local flight recommendations, or just a fellow aviator to swap stories with, I'm here to help. My goal is to provide not just a rental, but a trusted partnership—so you can focus on enjoying the skies with confidence and ease.\n\nBeyond just aircraft, I love sharing my knowledge of the best routes, hidden-gem destinations, and practical tips for smooth flying. Having hosted dozens of pilots, I understand what makes a trip truly great—attention to detail, clear communication, and a little extra hospitality. Let's make your next flight an exceptional one. Welcome aboard!\n\nWhen you book with me, you're not just renting an aircraft—you're gaining a reliable aviation partner. I take pride in maintaining my planes to the highest standards, ensuring safety, performance, and comfort on every flight. Whether you're a seasoned pilot or building hours, I'm happy to provide pre-flight walkthroughs, weather and route advice, or even local dining and layover tips.`,
};

const reviews = [
  {
    name: "Hannah Baker",
    location: "New Orleans, Los Angeles",
    avatar: "/lakeview-resort.png",
    rating: 5,
    text: "Nice apartment, fantastic view and location in the center for everything, high value for money, beautiful view and very clean from in and out, will definitely visit again.",
  },
  {
    name: "Steve Parker",
    location: "New Orleans, Los Angeles",
    avatar: "/lakeview-resort.png",
    rating: 5,
    text: "This is a comfortable apartment with a large bed, closet, air conditioning and all the essentials. The host is very helpful and communicative. Downsides are that the shared kitchen is small.",
  },
  {
    name: "John Smith",
    location: "New Orleans, Los Angeles",
    avatar: "/lakeview-resort.png",
    rating: 5,
    text: "The place is a residential complex and has rooms. There is a shared kitchen that has everything you need. The rooms are clean and include a coffee maker. There is a shared washing area for laundry.",
  },
];

const listings = [
  {
    title: "Dalton Airport (3DA)",
    location: "Dalton, Georgia, United States",
    image: "/lakeview-resort.png",
    beds: 3,
    baths: 4,
    guests: 6,
    price: 120,
  },
  {
    title: "Dalton Airport (3DA)",
    location: "Dalton, Georgia, United States",
    image: "/lakeview-resort.png",
    beds: 3,
    baths: 4,
    guests: 6,
    price: 120,
  },
  {
    title: "Dalton Airport (3DA)",
    location: "Dalton, Georgia, United States",
    image: "/lakeview-resort.png",
    beds: 3,
    baths: 4,
    guests: 6,
    price: 120,
  },
];

const UserProfilePage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 w-full max-w-[80%] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 rounded-2xl shadow-md">
          {/* Profile Card */}
          <div className="col-span-1 bg-white p-6 flex flex-col items-center text-center">
            <div className="flex flex-col items-center text-center rounded-xl shadow-md w-[80%] mx-auto">
              <div className="relative w-28 h-28 mb-3">
                <Image
                  src={user.avatar}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-4 border-[#b71c1c]"
                />
                <span className="absolute top-0 right-0 bg-[#b71c1c] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {user.badge}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <div className="text-gray-500 text-sm mb-2">{user.stats}</div>
            </div>
            <div>
              <div className="flex flex-col gap-2 text-left w-full mt-4">
                <div className="flex items-center gap-2">
                  <FaUserTie className="text-[#b71c1c]" />{" "}
                  <span>
                    Work:{" "}
                    <span className="text-[#b71c1c] font-medium">
                      {user.work}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#b71c1c]" />{" "}
                  <span>
                    Lives in:{" "}
                    <span className="text-[#b71c1c] font-medium">
                      {user.location}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLanguage className="text-[#b71c1c]" />{" "}
                  <span>
                    Languages:{" "}
                    <span className="text-[#b71c1c] font-medium">
                      {user.languages.join(", ")}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaIdBadge className="text-[#b71c1c]" />{" "}
                  <span>
                    Identity:{" "}
                    <span className="text-[#b71c1c] font-medium">
                      {user.identity}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="col-span-2 bg-white p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-2 text-[#b71c1c]">
              About John
            </h3>
            <div className="text-gray-700 whitespace-pre-line text-base">
              {user.about}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4 text-[#b71c1c]">
            John's Reviews
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="flex-1 bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center min-w-[250px]"
              >
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="rounded-full mb-2"
                />
                <div className="font-semibold">{review.name}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {review.location}
                </div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <div className="text-gray-700 text-sm">{review.text}</div>
              </div>
            ))}
            {/* Carousel arrow placeholder */}
            <div className="hidden md:flex items-center justify-center">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#b71c1c] text-white text-xl ml-2">
                <IoMdMail />
              </button>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4 text-[#b71c1c]">
            John's Listings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {listings.map((listing, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-44">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-2 right-2 bg-white/80 rounded-full p-2 text-[#b71c1c] border border-[#b71c1c]">
                    ❤
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-base mb-1">
                      {listing.title}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {listing.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <span>🛏 {listing.beds}</span>
                    <span>🛁 {listing.baths}</span>
                    <span>👥 {listing.guests}</span>
                  </div>
                  <div className="font-bold text-[#b71c1c] text-lg">
                    ${listing.price}{" "}
                    <span className="font-normal text-gray-500 text-base">
                      / Night
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default UserProfilePage;
