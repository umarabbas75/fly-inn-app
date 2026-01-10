"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const logos = [
  {
    src: "/flying-logo.png",
    alt: "Flying Magazine",
    width: 120,
    height: 32,
    href: "https://www.flyingmag.com/destinations/ga-flight-planning-website-takes-the-guesswork-out-of-finding-next-destination/",
  },
  {
    src: "/barnstormers-logo.png",
    alt: "Barnstormers",
    width: 180,
    height: 40,
    href: "https://www.barnstormers.com/",
  },
  {
    src: "/robb-report-logo-white.png",
    alt: "Robb Report",
    width: 140,
    height: 32,
    href: "https://robbreport.com/motors/aviation/gallery/best-fly-ins-north-america-1235603388/rr-mv-requests-050724-3/",
  },
  {
    src: "/general-aviation-news-logo.png",
    alt: "General Aviation News",
    width: 100,
    height: 40,
    href: "https://generalaviationnews.com/2024/04/08/a-different-kind-of-fly-in-2/",
  },
  {
    src: "/piper-logo.png",
    alt: "Piper Flyer",
    width: 100,
    height: 40,
    href: "https://www.piperflyer.com/component/fileman/file/0624_PiperFlyer.pdf.html?routed=1&container=fileman-attachments",
  },
];

const MagazineEndorsementsSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="bg-white">
      <div className="mx-auto px-0">
        <p
          className="font-semibold text-center py-2 sm:py-3"
          style={{
            fontSize: "clamp(16px, 4vw, 24px)",
            fontWeight: 500,
            lineHeight: "1.2",
          }}
        >
          On Everyone's Radar
        </p>
        <div
          className="overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #C1272D 0%, #7B1F24 100%)",
            height: "clamp(50px, 8vw, 67px)",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex items-center whitespace-nowrap ${
              isHovered ? "animate-none" : "animate-marquee"
            }`}
            style={{ animationDuration: "30s" }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <Link
                key={index}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-2 sm:px-3 md:px-6 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-auto w-auto max-h-[20px] sm:max-h-[28px] md:max-h-[40px] object-contain hover:scale-105 transition-transform duration-200"
                  style={{
                    maxWidth: "clamp(60px, 15vw, " + logo.width + "px)",
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          animation: marquee linear infinite;
        }
        .animate-none {
          animation: none;
        }
      `}</style>
    </section>
  );
};

export default MagazineEndorsementsSection;
