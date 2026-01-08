import React from "react";
import { Button, Input, Select, Card, Avatar } from "antd";
import { HeartOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Option } = Select;

const listings = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  title: "Crawford Airpark (99V)",
  location: "Crawford, Colorado, United States",
  price: 235,
  img: "/lakeview-resort.png",
}));

export default function FeaturedStaysPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">

      {/* Featured Stays */}
      <div className="px-8 py-8 mx-auto max-w-7xl">
        <h2 className="mb-4 text-2xl font-semibold">Our <span className="text-red-600">Featured</span> Stays</h2>
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {listings.slice(0, 6).map((listing, idx) => (
            <Link href={`/listing/${listing.id}`} key={idx}>
            <Card
              key={idx}
              className="flex flex-col p-0 overflow-hidden border border-gray-200 shadow-sm rounded-xl"
              bodyStyle={{ padding: 0 }}
            >
              <img
                src={listing.img}
                alt={listing.title}
                className="object-cover w-full h-32"
              />
              <div className="flex flex-col justify-between px-3 py-2">
                <div className="mb-1 text-sm font-semibold">{listing.title}</div>
                <div className="mb-1 text-xs text-gray-500">{listing.location}</div>
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">                                                                                                     
                  <span>🛏️ 5</span>
                  <span>🛁 5</span>
                  <span>🛫 1</span>
                </div>
                <span className="text-base font-bold text-red-600">${listing.price} <span className="text-xs font-normal">/ Night</span></span>
              </div>
              </Card>
              </Link>
          ))}
        </div>

        {/* Nearby Locations */}
        <h2 className="mb-4 text-xl font-semibold">Nearby locations you can Explore</h2>
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {listings.slice(6, 12).map((listing, idx) => (
            <Link href={`/listing/${listing.id}`} key={idx}>
            <Card
              key={idx}
              className="flex flex-col p-0 overflow-hidden border border-gray-200 shadow-sm rounded-xl"
              bodyStyle={{ padding: 0 }}
            >
              <img
                src={listing.img}
                alt={listing.title}
                className="object-cover w-full h-32"
              />
              <div className="flex flex-col justify-between px-3 py-2">
                <div className="mb-1 text-sm font-semibold">{listing.title}</div>
                <div className="mb-1 text-xs text-gray-500">{listing.location}</div>
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                  <span>🛏️ 5</span>
                  <span>🛁 5</span>
                  <span>🛫 1</span>
                </div>
                <span className="text-base font-bold text-red-600">${listing.price} <span className="text-xs font-normal">/ Night</span></span>
              </div>
            </Card>
            </Link>
          ))}
        </div>
        {/* <div className="flex justify-center mb-8">
          <Button className="flex items-center gap-2 px-8 py-2 text-white bg-gray-800 rounded-lg">
            Show Map
          </Button>
        </div> */}

        {/* More from the Catalogue */}
        <h2 className="mb-4 text-xl font-semibold">More from the Catalogue</h2>
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {listings.slice(12, 36).map((listing, idx) => (
            <Link href={`/listing/${listing.id}`} key={idx}>
            <Card
              key={idx} 
              className="flex flex-col p-0 overflow-hidden border border-gray-200 shadow-sm rounded-xl"
              bodyStyle={{ padding: 0 }}
            >
              <img
                src={listing.img}
                alt={listing.title}
                className="object-cover w-full h-32"
              />
              <div className="flex flex-col justify-between px-3 py-2">
                <div className="mb-1 text-sm font-semibold">{listing.title}</div>
                <div className="mb-1 text-xs text-gray-500">{listing.location}</div>
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                  <span>🛏️ 5</span>
                  <span>🛁 5</span>
                  <span>🛫 1</span>
                </div>
                <span className="text-base font-bold text-red-600">${listing.price} <span className="text-xs font-normal">/ Night</span></span>
              </div>
            </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 