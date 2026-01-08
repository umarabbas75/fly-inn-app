"use client";

import React, { useState } from "react";
import { Modal } from "antd";
import { PlayCircleFilled, CloseOutlined } from "@ant-design/icons";
import { MdPhotoLibrary } from "react-icons/md";
import NewsletterSection from "../../_components/newsletter-section";

const galleryItems = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&h=600&fit=crop",
    video: true,
    videoId: "53pgGTi_9vE",
    alt: "30 Fly-Inn BnBs Challenge",
    title: "30 Fly-Inn BnBs in 30 Days",
    description: "Tour a charming ranch-style home on beautiful Kelleys Island",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop",
    video: false,
    alt: "Cockpit View",
    title: "Pilot's Perspective",
    description: "Experience aviation from the cockpit",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop",
    video: false,
    alt: "Classic Aircraft",
    title: "Aviation Heritage",
    description: "Celebrating classic aircraft design",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&h=600&fit=crop",
    video: true,
    videoId: "_dTY5DbOCWM",
    alt: "Welcome to Fly-Inn",
    title: "Welcome to Fly-Inn",
    description: "This is a pilots only website. Please, enjoy!",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    video: false,
    alt: "Wing in Clouds",
    title: "Above the Clouds",
    description: "Soaring through endless skies",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=600&fit=crop",
    video: false,
    alt: "Hangar Home",
    title: "Hangar Living",
    description: "Where aviation meets lifestyle",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&h=600&fit=crop",
    video: true,
    videoId: "URLF1dfq9qA",
    alt: "Flight Schools and CFIs",
    title: "Calling All Flight Schools & CFIs",
    description: "Big opportunity for aviation educators!",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=600&fit=crop",
    video: true,
    videoId: "BT1Q1n59gLM",
    alt: "Spring Break 2025",
    title: "Top Adventure Spots Spring Break 2025",
    description: "Discover stunning destinations for pilots & travelers",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1570710891195-803583715485?w=800&h=600&fit=crop",
    video: true,
    videoId: "nGOXPeqBR-o",
    alt: "The Fly-Inn Frequency",
    title: "The Fly-Inn Frequency with Ned Parks",
    description: "Insights into aviation, pilot training & leadership",
  },
];

function VideoOverlay({
  onClick,
  title,
  description,
}: {
  onClick: () => void;
  title: string;
  description?: string;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-all duration-300 cursor-pointer group rounded-2xl"
      onClick={onClick}
    >
      <span className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
        <PlayCircleFilled className="text-5xl text-[#AF2322]" />
      </span>
      <h3 className="text-white text-lg font-bold mt-4 opacity-90 group-hover:opacity-100 text-center px-4">
        {title}
      </h3>
      {description && (
        <p className="text-white/80 text-sm mt-2 text-center px-6 max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const openVideoModal = (videoId: string) => {
    setCurrentVideoId(videoId);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setCurrentVideoId("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2]">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#AF2322]/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative app-container py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-medium mb-6 border border-[#AF2322]/20">
              <MdPhotoLibrary />
              Photo & Video Gallery
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
              Explore the <span className="text-[#AF2322]">Fly-Inn</span>{" "}
              Experience
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Browse our gallery to discover unique aviation stays – from hangar
              homes with runway views to cozy airport condos. Each property is
              pilot-approved, offering convenience and character for your next
              fly-in adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`
                relative overflow-hidden rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-500
                ${index === 0 ? "md:col-span-2" : ""}
                ${index === 3 ? "lg:col-span-2" : ""}
                ${index === 6 ? "md:col-span-2 lg:col-span-1" : ""}
              `}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={`relative ${
                  index === 0 ? "h-[350px]" : "h-[280px]"
                }`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
                {/* Image overlay on hover */}
                {!item.video && hoveredItem === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-white/80 text-sm mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
                {/* Video play button */}
                {item.video && (
                  <VideoOverlay
                    onClick={() => openVideoModal(item.videoId!)}
                    title={item.title}
                    description={item.description}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Video Modal */}
      <Modal
        open={videoModalOpen}
        onCancel={closeVideoModal}
        footer={null}
        width={900}
        centered
        destroyOnClose
        closeIcon={<CloseOutlined className="text-white text-xl" />}
        className="video-modal"
        styles={{
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          content: {
            padding: 0,
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        {videoModalOpen && currentVideoId && (
          <div className="relative pt-[56.25%]">
            <iframe
              key={currentVideoId}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
