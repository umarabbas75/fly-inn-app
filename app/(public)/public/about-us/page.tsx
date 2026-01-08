"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

// Swiper imports for carousel functionality
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { Pagination, FreeMode } from "swiper/modules";

// Publication logos with links
const publications = [
  {
    href: "https://www.flyingmag.com/destinations/ga-flight-planning-website-takes-the-guesswork-out-of-finding-next-destination/",
    src: "/flying-logo.png",
    alt: "Flying Magazine",
    invert: false,
  },
  {
    href: "https://www.barnstormers.com/",
    src: "/barnstormers-logo.png",
    alt: "Barnstormers",
    invert: false,
  },
  {
    href: "https://generalaviationnews.com/2024/04/08/a-different-kind-of-fly-in-2/",
    src: "/general-aviation-news-logo.png",
    alt: "General Aviation News",
    invert: false,
  },
  {
    href: "https://www.piperflyer.com/component/fileman/file/0624_PiperFlyer.pdf.html?routed=1&container=fileman-attachments",
    src: "/piper-logo.png",
    alt: "Piper Flyer",
    invert: false,
  },
  {
    href: "https://robbreport.com/motors/aviation/gallery/best-fly-ins-north-america-1235603388/rr-mv-requests-050724-3/",
    src: "/robb-report-logo-white.png",
    alt: "Robb Report",
    invert: true,
  },
];

// FindUsImage Component
const FindUsImage = () => {
  return (
    <div className="bg-white">
      <div className="app-container">
        {/* Header - Modern style */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">
            Featured In
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            On Everyone's Radar
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            You'll find us in these leading aviation publications
          </p>
        </div>

        {/* Publication logos - Modern grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {publications.map((pub, index) => (
            <Link
              key={index}
              href={pub.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="relative bg-white border border-gray-100 rounded-2xl p-6 md:p-8 h-[100px] md:h-[120px] flex items-center justify-center transition-all duration-300 hover:border-[#AF2322]/30 hover:shadow-xl hover:shadow-[#AF2322]/10 hover:-translate-y-1">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#AF2322]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <img
                  src={pub.src}
                  alt={pub.alt}
                  className={`max-w-[120px] md:max-w-[140px] max-h-[40px] md:max-h-[50px] object-contain transition-all duration-300 group-hover:scale-110 ${
                    pub.invert ? "filter invert" : ""
                  }`}
                />

                {/* External link indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-4 h-4 text-[#AF2322]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>

              {/* Publication name on hover */}
              <p className="text-center text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                {pub.alt}
              </p>
            </Link>
          ))}
        </div>

        {/* Bottom decoration line */}
        <div className="flex items-center justify-center mt-12">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#AF2322]/30" />
          <div className="w-2 h-2 rounded-full bg-[#AF2322]/30 mx-3" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#AF2322]/30" />
        </div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const whatsInStore = [
    {
      path: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
      title: "Food!",
      des: "Some homes are in extremely remote, secluded and private locations and being able to get food might be a challenge. When this is the case, many hosts offer catering or a fully stocked kitchen with your favorite staples and treats!",
    },
    {
      path: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop",
      title: "Optional transportation!",
      des: "Some hosts are commercial pilots who offer rides for a fee. Others simply offer free rides. They love it because not only do they get to meet their guests, they also get to give them a bird's-eye view of what fun awaits them when they land!",
    },
    {
      path: "/images/about-us/whats-in-store/run-way.jpg",
      title: "Runway!",
      des: "Every listing on Fly-Inn either has a landing strip or helipad conveniently located on the property or is situated within 10 minutes of an airport you are likely to pilot into yourself. Most homes are either hangar homes, airpark homes or have their own private runway. Some homes even offer a water landing!",
    },
    {
      path: "/images/about-us/whats-in-store/aircarft-storage.jpg",
      title: "Aircraft Storage!",
      des: "Whether it be access to a hangar, tie-downs, etc. on the property itself, or whether it be storage services the nearby airport offers, you are sure to have a place where you can securely store your aircraft.",
    },
    {
      path: "/images/about-us/whats-in-store/cars.jpg",
      title: "Cars!",
      des: "What good is it to land if you can't get around once you arrive? All our hosts know this and provide either a free loaner or a nice car to rent or at least transportation to a nearby car rental. If the airport is a few minutes from the property, transportation will be made available to you at the airport upon your arrival.",
    },
    {
      path: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      title: "Toys!",
      des: "Optional goodies are up to your host and the area. Some hosts even offer other aircraft, ATVs, watercraft, scooters, bikes, dirt bikes and more! Be sure to check the listing to see what is included in your rental.",
    },
  ];

  const values = [
    {
      image: "/images/about-us/our-values/team-work.jpg",
      title: "Teamwork",
      desc: "It takes all three of us to provide a great experience. Pilot-Inn is committed to timely and effective communication and making sure you are completely satisfied with your experience. Hosts are committed to your satisfaction, by contract. Guests are also committed by contract to taking care of the space entrusted to them and to being safe.",
    },
    {
      image: "/images/about-us/our-values/integrity.jpg",
      title: "Integrity and respect",
      desc: "The very reason Pilot-Inn is so successful is that as a community we know we can trust each other's level of respect and integrity. We are a family of like-minded, respectful individuals and we understand each other. We take pride in treating each other according to the Golden Rule.",
    },
    {
      image: "/images/about-us/our-values/quality.jpg",
      title: "Quality and innovation",
      desc: "As a team, we are all committed to the highest quality rentals and service. We love coming up with new ways to make your stays better and better over time.",
    },
  ];

  useEffect(() => {
    // Auto-play video on component mount
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = src + "&autoplay=1&mute=1";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Hero Section */}
      <section className="relative h-[70vh] md:h-screen">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative w-full h-full">
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            src="https://www.youtube.com/embed/B0s4Qn6POKs?si=L9dWJ9HR_crBaTIH"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* All-inclusive Section */}
      <section className="py-16 bg-white">
        <div className="app-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              All-inclusive, aviation-centric lodging.
            </h2>
            <p className="text-xl font-semibold text-gray-700">
              Why waste a good hangar home or airpark home?
            </p>
          </div>

          {/* Guests and Hosts */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#AF2322] uppercase tracking-wider">
                GUESTS
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Are you looking for a fun place to fly where you can safely
                hangar or tie down your aircraft? Maybe you are looking for a
                fun getaway or maybe you are on a business trip and a Fly-Inn
                would be much more convenient than a hotel. Do you need to rent
                a car or a different airplane when you land? Are you craving
                adventure?
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#AF2322] uppercase tracking-wider">
                HOSTS
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Are you looking into renting out your home that has access to a
                runway or landing strip? Maybe you have a spacious hangar home
                with a spare room. Maybe your home is conveniently by an
                airport. Are you wishing you could rent it and share it with
                your fellow pilots who have the same sense of respect and
                responsibility you do?
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">
              Look no further—Fly-Inn has you covered.
            </p>
          </div>
        </div>
      </section>

      {/* What's in store Section */}
      <section className="py-16 bg-gray-50">
        <div className="app-container">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            What's in store.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whatsInStore.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={item.path}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-[#AF2322]">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.des}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="app-container">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Our Values.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-[#AF2322]">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16 bg-gray-50">
        <FindUsImage />
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2] py-16">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#AF2322]/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative app-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Got Questions?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Here's where we tackle your questions in depth so the entire
              Fly-Inn Family can benefit. If you don't see your question
              answered, help us expand our FAQ video library by reaching out.
              Use the{" "}
              <Link
                href="/public/contact"
                className="text-[#AF2322] font-medium hover:underline"
              >
                contact page
              </Link>
              , give us a call, or email{" "}
              <a
                href="mailto:PIC@fly-inn.com?subject=Suggestions"
                className="text-[#AF2322] font-medium hover:underline"
              >
                PIC@fly-inn.com
              </a>{" "}
              with "Suggestions" in the subject line.
            </p>
            <Link
              href="/public/faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#AF2322] hover:bg-[#9a1f1e] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#AF2322]/25 hover:shadow-xl"
            >
              Visit FAQ
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
