import React from "react";
import { Button, Input, Select, Card, Avatar } from "antd";
import { HeartOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Option } = Select;

const listings = Array.from({ length: 24 }).map((_, i) => ({
  title: "Crawford Airpark (99V)",
  location: "Crawford, Colorado, United States",
  price: 235,
  img: `/public/assets/images/room${(i % 8) + 1}.jpg`,
}));

export default function FeaturedStaysPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-8">
          <img
            src="/public/assets/images/logo.png"
            alt="Logo"
            className="h-12"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2 px-6 py-2 font-semibold text-white bg-red-600 rounded-lg">
            <span className="hidden md:inline">Become a Host</span>
          </Button>
          <Avatar size={40} icon={<UserOutlined />} src="/user.jpg" />
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex items-center gap-4 px-8 py-4 bg-white border-b border-gray-200">
        <Select defaultValue="Destination" className="max-w-xs rounded-lg">
          <Option value="Destination">Destination</Option>
        </Select>
        <Input placeholder="Travel Dates" className="max-w-xs rounded-lg" />
        <Select defaultValue="Lodging Type" className="max-w-xs rounded-lg">
          <Option value="Lodging Type">Lodging Type</Option>
        </Select>
        <Input placeholder="Add Guests" className="max-w-xs rounded-lg" />
        <Button
          type="primary"
          className="flex items-center gap-2 px-8 py-2 bg-red-600 border-none rounded-lg"
        >
          <SearchOutlined />
        </Button>
      </div>

      {/* Socials Bar */}
      <div className="flex items-center justify-center gap-2 py-2 mt-1 text-white bg-gray-800">
        Follow us on Socials to see what we're up to
        {/* Facebook Link */}
        <Link
          href="https://www.facebook.com/FlyInnLLC/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-blue-400 transition-colors duration-200"
        >
          &#x25B6;{" "}
          {/* You can replace this with a Facebook icon if you prefer */}
        </Link>
        {/* Twitter/X Link */}
        <Link
          href="https://twitter.com/FlyInnLLC"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-blue-300 transition-colors duration-200"
        >
          &#x1F426; {/* You can replace this with a Twitter/X icon */}
        </Link>
        {/* Instagram Link */}
        <Link
          href="https://www.instagram.com/flyinnllc/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-pink-400 transition-colors duration-200"
        >
          &#x1F4F7; {/* You can replace this with an Instagram icon */}
        </Link>
        {/* YouTube Link (Assuming 1F4F1 is meant to be YouTube/media, adjust as needed) */}
        <Link
          href="https://www.youtube.com/@FLY-INN"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-red-500 transition-colors duration-200"
        >
          &#x1F4F1; {/* You can replace this with a YouTube icon */}
        </Link>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex items-center justify-center gap-4 px-4 py-2 min-w-max">
            <div className="flex space-x-8">
              {[
                "Stays",
                "Restaurants",
                "Events",
                "Shopping",
                "Adventures",
                "Hotels",
                "Flight Schools",
                "CFIs",
                "Aircraft Sales",
                "Aircraft Service",
                "Examiners",
                "Insurance",
              ].map((label, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="p-2 transition rounded-full hover:bg-gray-100">
                    🏨
                  </div>
                  <span className="text-xs text-gray-700">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Button type="default" className="flex items-center space-x-2">
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Stays */}
      <div className="px-8 py-8 mx-auto max-w-7xl">
        <h2 className="mb-4 text-2xl font-semibold">
          Our <span className="text-red-600">Featured</span> Stays
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {listings.slice(0, 6).map((listing, idx) => (
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
                <div className="mb-1 text-sm font-semibold">
                  {listing.title}
                </div>
                <div className="mb-1 text-xs text-gray-500">
                  {listing.location}
                </div>
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                  <span>🛏️ 5</span>
                  <span>🛁 5</span>
                  <span>🛫 1</span>
                </div>
                <span className="text-base font-bold text-red-600">
                  ${listing.price}{" "}
                  <span className="text-xs font-normal">/ Night</span>
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Nearby Locations */}
        <h2 className="mb-4 text-xl font-semibold">
          Nearby locations you can Explore
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {listings.slice(6, 12).map((listing, idx) => (
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
                <div className="mb-1 text-sm font-semibold">
                  {listing.title}
                </div>
                <div className="mb-1 text-xs text-gray-500">
                  {listing.location}
                </div>
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                  <span>🛏️ 5</span>
                  <span>🛁 5</span>
                  <span>🛫 1</span>
                </div>
                <span className="text-base font-bold text-red-600">
                  ${listing.price}{" "}
                  <span className="text-xs font-normal">/ Night</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mb-8">
          <Button className="flex items-center gap-2 px-8 py-2 text-white bg-gray-800 rounded-lg">
            Show Map
          </Button>
        </div>

        {/* More from the Catalogue */}
        <h2 className="mb-4 text-xl font-semibold">More from the Catalogue</h2>
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {listings.slice(12, 36).map((listing, idx) => (
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
                <div className="mb-1 text-sm font-semibold">
                  {listing.title}
                </div>
                <div className="mb-1 text-xs text-gray-500">
                  {listing.location}
                </div>
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-600">
                  <span>🛏️ 5</span>
                  <span>🛁 5</span>
                  <span>🛫 1</span>
                </div>
                <span className="text-base font-bold text-red-600">
                  ${listing.price}{" "}
                  <span className="text-xs font-normal">/ Night</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="flex flex-col items-center justify-center py-8 bg-red-600">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Subscribe to Our Newsletter Now!
        </h2>
        <div className="flex w-full max-w-xl gap-2">
          <Input placeholder="Enter your Email here" className="rounded-lg" />
          <Button
            type="primary"
            className="px-8 text-white bg-black rounded-lg"
          >
            SUBSCRIBE
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-8 py-8 mt-8 bg-white border-t border-gray-200">
        <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl md:grid-cols-4">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/public/assets/images/logo.png"
              alt="Logo"
              className="h-12 mb-2"
            />
            <p className="mb-2 text-sm text-gray-600">
              Enabling aviation enthusiasts to reserve and offer lodging,
              transportation, and essential amenities.
            </p>
            <div className="flex gap-2 text-xl text-gray-700">
              <span>🌐</span>
              <span>🐦</span>
              <span>📸</span>
              <span>💼</span>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">About Us</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>About the Company</li>
              <li>Our Team</li>
              <li>Philanthropy</li>
              <li>FAQ's</li>
              <li>Squawks</li>
              <li>Gallery</li>
              <li>Testimonials</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Agreements</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Contact Us</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>P.O Box 270-439, Fruitland, UTAH</li>
              <li>833-111-222-333</li>
              <li>PIC@Fly-Inn.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-xs text-center text-gray-500">
          All rights Reserved by Flyinn LLC © 2020-2025
        </div>
      </footer>
    </div>
  );
}
