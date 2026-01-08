"use client";

import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface MenuImage {
  id?: number;
  url?: string;
  image?: string;
  description?: string;
}

interface MenuCarouselProps {
  menuImages: MenuImage[];
  onImageClick?: (imageUrl: string) => void;
}

const MenuCarousel: React.FC<MenuCarouselProps> = ({
  menuImages,
  onImageClick,
}) => {
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);

  const handleImageClick = (image: MenuImage) => {
    const imageUrl =
      image.url ||
      (image.image
        ? `https://s3.amazonaws.com/flyinn-app-bucket/${image.image}`
        : "");
    if (onImageClick) {
      onImageClick(imageUrl);
    }
  };

  if (!menuImages || menuImages.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        Our Menu
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
        className="my-swipe"
      >
        {menuImages.map((img, idx) => {
          const imageUrl =
            img.url ||
            (img.image
              ? `https://s3.amazonaws.com/flyinn-app-bucket/${img.image}`
              : "/placeholder.jpg");
          return (
            <SwiperSlide key={img.id || idx}>
              <div
                className="relative group overflow-hidden rounded-xl cursor-pointer"
                onClick={() => handleImageClick(img)}
              >
                <img
                  src={imageUrl}
                  alt={img.description || `Menu ${idx + 1}`}
                  className="w-full h-64 max-h-64 min-h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white font-medium">
                    Menu Item {idx + 1}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Arrows */}
      {menuImages.length > 4 && (
        <>
          <Button
            ref={prevButtonRef}
            type="text"
            icon={<LeftOutlined />}
            className="absolute top-[60%] -translate-y-1/2 left-0 md:left-0 z-10 p-2 md:p-3 bg-gray-900/50 hover:bg-[#AF2322] text-white rounded-full transition-colors duration-300 shadow-lg"
            aria-label="Previous menu item"
          />
          <Button
            ref={nextButtonRef}
            type="text"
            icon={<RightOutlined />}
            className="absolute top-[60%] -translate-y-1/2 right-0 md:right-0 z-10 p-2 md:p-3 bg-gray-900/50 hover:bg-[#AF2322] text-white rounded-full transition-colors duration-300 shadow-lg"
            aria-label="Next menu item"
          />
        </>
      )}
    </div>
  );
};

export default MenuCarousel;
