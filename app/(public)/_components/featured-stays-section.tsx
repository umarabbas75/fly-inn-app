"use client";
import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Spin } from "antd";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StayCard from "@/components/shared/stay-card";
import { useApiGet } from "@/http-service";

interface Stay {
  id: number;
  title: string;
  city: string;
  state: string;
  address: string;
  nightly_price: string;
  no_of_bedrooms: number;
  no_of_bathrooms: string;
  no_of_guest: number;
  images?: Array<{
    id: number;
    url?: string;
    image?: string;
  }>;
  airport?: string;
  rating?: number;
}

interface MappedStay {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  beds: number;
  baths: number;
  guests: number;
}

const FeaturedStaysSection = () => {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [comparedItems, setComparedItems] = useState<number[]>([]);

  // Fetch featured stays from API
  const { data: featuredStaysData, isLoading } = useApiGet({
    endpoint: "/api/stays/featured",
    queryKey: ["featured-stays"],
  });

  const toggleLike = (stayId: number) => {
    setLikedItems((prev) =>
      prev.includes(stayId)
        ? prev.filter((id) => id !== stayId)
        : [...prev, stayId]
    );
  };

  const toggleCompare = (stayId: number) => {
    setComparedItems((prev) =>
      prev.includes(stayId)
        ? prev.filter((id) => id !== stayId)
        : [...prev, stayId]
    );
  };
  console.log({ featuredStaysData });
  // Map API response to StayCard format
  const stays: MappedStay[] = useMemo(() => {
    if (!featuredStaysData || !Array.isArray(featuredStaysData?.stays)) {
      return [];
    }

    return featuredStaysData?.stays?.map((stay: Stay) => {
      // Get location from city/state or airport
      const location = stay.airport
        ? stay.airport
        : stay.city && stay.state
        ? `${stay.city}, ${stay.state}`
        : stay.address || "";

      // Get first image URL
      const primaryImage =
        stay.images?.find((img: any) => img.sort_order === 0) ||
        stay.images?.[0];
      const imageUrl =
        primaryImage?.url || primaryImage?.image || "/placeholder.jpg";

      // Construct full image URL if it's a relative path
      const image =
        imageUrl.startsWith("http") || imageUrl.startsWith("/")
          ? imageUrl
          : `${process.env.NEXT_PUBLIC_API_URI}/uploads/${imageUrl}`;

      return {
        id: stay.id,
        name: stay.title || "",
        location: location,
        price: Number(stay.nightly_price) || 0,
        rating: stay.rating || 0,
        image: image,
        beds: stay.no_of_bedrooms || 0,
        baths: Number(stay.no_of_bathrooms) || 0,
        guests: stay.no_of_guest || 0,
        additional_guests: stay.no_of_additional_guest || stay.additional_guests || 0,
        no_of_pets: stay.no_of_pets || stay.max_pets || 0,
      };
    });
  }, [featuredStaysData]);

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="app-container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl mb-1">
              Our <span className="text-[#AF2322]">Featured</span> Stays
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Discover premium properties near major airports, perfect for
              aviation travelers
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        </div>
      </section>
    );
  }

  if (!stays || stays.length === 0) {
    return null; // Don't render section if no featured stays
  }

  return (
    <section className="bg-white py-16">
      <div className="app-container">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl mb-1">
            Our <span className="text-[#AF2322]">Featured</span> Stays
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Discover premium properties near major airports, perfect for
            aviation travelers
          </p>
        </div>

        {/* Desktop Grid (5 columns) */}
        <div className="hidden xl:grid grid-cols-5 gap-5">
          {stays.map((item) => (
            <StayCard
              key={item.id}
              stay={item}
              index={item.id}
              isLiked={likedItems.includes(item.id)}
              isCompared={comparedItems.includes(item.id)}
              onToggleLike={toggleLike}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="xl:hidden relative">
          <Swiper
            loop={false}
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            navigation={{
              prevEl: ".featured-prev",
              nextEl: ".featured-next",
            }}
            pagination={{ clickable: true }}
          >
            {stays.map((item) => (
              <SwiperSlide key={item.id}>
                <StayCard
                  stay={item}
                  index={item.id}
                  isLiked={likedItems.includes(item.id)}
                  isCompared={comparedItems.includes(item.id)}
                  onToggleLike={toggleLike}
                  onToggleCompare={toggleCompare}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center gap-3 mt-10">
            <div className="featured-prev flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full shadow-sm cursor-pointer transition-all duration-300 hover:border-[#AF2322] hover:text-[#AF2322]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.41z"
                />
              </svg>
            </div>
            <div className="featured-next flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full shadow-sm cursor-pointer transition-all duration-300 hover:border-[#AF2322] hover:text-[#AF2322]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStaysSection;
