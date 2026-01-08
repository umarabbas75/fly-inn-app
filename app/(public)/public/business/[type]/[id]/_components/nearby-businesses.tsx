"use client";

import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Button, Card } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { EnvironmentOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getBusinessSubTypeLabel } from "@/constants/business";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface NearbyBusiness {
  id?: number;
  business_id: number;
  name: string;
  address?: string;
  distance_from_runway?: string;
  airport?: string;
  images?: Array<{
    type: string;
    image: string;
    url?: string;
  }>;
}

interface NearbyBusinessesProps {
  nearbyBusinesses: NearbyBusiness[];
  currentType: string;
}

const NearbyBusinesses: React.FC<NearbyBusinessesProps> = ({
  nearbyBusinesses,
  currentType,
}) => {
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);

  if (!nearbyBusinesses || nearbyBusinesses.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        Other {getBusinessSubTypeLabel(currentType)} nearby
      </h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setTimeout(() => {
            if (
              swiper &&
              swiper.params.navigation &&
              typeof swiper.params.navigation === "object" &&
              prevButtonRef.current &&
              nextButtonRef.current
            ) {
              swiper.params.navigation.prevEl = prevButtonRef.current;
              swiper.params.navigation.nextEl = nextButtonRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }, 100);
        }}
        className="my-swipe-1"
      >
        {nearbyBusinesses.map((business, idx) => {
          const mainImage = business?.images?.find(
            (item) => item?.type === "photo"
          );
          const imageUrl =
            mainImage?.url ||
            (mainImage?.image
              ? `https://s3.amazonaws.com/flyinn-app-bucket/${mainImage.image}`
              : null);

          return (
            <SwiperSlide key={business.business_id || idx}>
              <Link
                href={`/public/business/${currentType}/${business.business_id}`}
                className="block"
              >
                <Card
                  hoverable
                  className="overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                  cover={
                    <div className="relative h-48">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                          <span className="text-5xl">🍴</span>
                        </div>
                      )}
                    </div>
                  }
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {business.name}
                    </h3>
                    {business.address && (
                      <p className="text-gray-600 text-sm mt-1 truncate">
                        {business.address}
                      </p>
                    )}
                    {business.distance_from_runway && business.airport && (
                      <div className="mt-3 flex items-center">
                        <EnvironmentOutlined
                          className="text-gray-500 mr-1"
                          style={{ fontSize: "14px" }}
                        />
                        <span className="text-gray-700 text-sm">
                          {business.distance_from_runway} miles from{" "}
                          {business.airport}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Arrows */}
      {nearbyBusinesses.length > 4 && (
        <>
          <Button
            ref={prevButtonRef}
            type="text"
            icon={<LeftOutlined />}
            className="absolute top-[60%] -translate-y-1/2 left-0 md:left-0 z-10 p-2 md:p-3 bg-gray-900/50 hover:bg-[#AF2322] text-white rounded-full transition-colors duration-300 shadow-lg"
            aria-label="Previous business"
          />
          <Button
            ref={nextButtonRef}
            type="text"
            icon={<RightOutlined />}
            className="absolute top-[60%] -translate-y-1/2 right-0 md:right-0 z-10 p-2 md:p-3 bg-gray-900/50 hover:bg-[#AF2322] text-white rounded-full transition-colors duration-300 shadow-lg"
            aria-label="Next business"
          />
        </>
      )}
    </div>
  );
};

export default NearbyBusinesses;
