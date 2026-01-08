"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Image from "next/image";
import {
  FaPalette,
  FaLink,
  FaBlog,
  FaBullseye,
  FaAward,
  FaTicketAlt,
  FaInstagram,
  FaVideo,
  FaStar,
  FaMicrophoneAlt,
  FaGift,
  FaArrowRight,
} from "react-icons/fa";
import { MdWeb, MdAirplanemodeActive } from "react-icons/md";
import { FiMic } from "react-icons/fi";

const benefits = [
  {
    icon: FaPalette,
    title: "Full-Color, Full-Page Listing",
    highlight: "Stand out at first glance.",
    description:
      "Your business will be featured in vibrant, eye-catching color — not a plain text link. This helps you grab attention instantly and makes your listing look more premium and trustworthy.",
  },
  {
    icon: FaLink,
    title: " Link to Your Website",
    highlight: "Send traffic straight to your door.",
    description:
      "We connect your listing to your website so pilots can explore your offerings, buy products and services, or learn more with just one click.",
  },
  {
    icon: FaBlog,
    title: "Custom Blog",
    highlight: "Tell your story, boost your SEO.",
    description:
      "We write a full blog post all about your business and publish it on our site — with links back to you. Great for SEO, credibility, and giving people a reason to visit.",
  },
  {
    icon: FaBullseye,
    title: "Fly-Inn Find Game Participation",
    highlight: "Turn traffic into treasure.",
    description: `We feature your business in our exclusive "Fly-Inn Find" pilot challenge — a fun scavenger hunt that encourages pilots to visit listed locations. It's a powerful way to drive foot traffic and keep you top of mind.`,
  },
  {
    icon: FaAward,
    title: "Fly-Inn Plaque with QR code",
    highlight: "Earn Reviews!",
    description:
      "You'll receive a high-quality plaque that shows visitors you're an official Fly-Inn location. It features a QR code that visitors can scan to leave a review directly on Fly-Inn. It builds trust with new guests and helps you climb the ranks in our community.",
  },
  {
    icon: FaTicketAlt,
    title: "First-Class Perks Pass",
    highlight: "Offer deals pilots can't resist.",
    description:
      "Feature your discount or promotion for pilots to redeem with our exclusive pilot First-Class Perks Pass. Change your offer at any time, directly from your dashboard. It's a simple way to boost visits and bookings.",
  },
  {
    icon: FaInstagram,
    title: "Instagram Frame",
    highlight: "Make your business Insta-famous.",
    description:
      "We email you a stylish, Instagram-themed photo frame so guests can snap pics at your location and tag Fly-Inn. It turns your visitors into your promoters, creating shareable content that builds your visibility on all our platforms.",
  },
  {
    icon: FaVideo,
    title: "Social Media Video Feature (Gold = 15 sec, Platinum = 30 sec)",
    highlight: "Put your business in the spotlight.",
    description:
      "We create a fun, polished video showcasing your business and publish it across our social channels. Perfect for reaching new audiences and standing out online.",
  },
  {
    icon: FaStar,
    title: " Featured Business Spotlight (Platinum)",
    highlight: "Enjoy premium front-row exposure.",
    description:
      "You'll be listed as a featured business on our site for seven days, providing you with extra visibility and a boost in bookings.",
  },
  {
    icon: FaMicrophoneAlt,
    title: "Podcast Interview (Platinum)",
    highlight: "Share your story on air.",
    description:
      "Get interviewed on the Fly-Inn Frequency podcast — a unique opportunity to tell your business story to a whole world of aviation lovers and future customers.",
  },
  {
    icon: FaGift,
    title: "$50 to $100 in Fly-Inn Service Fee Credits (Gold / Platinum)",
    highlight: "Platform perks that pay for themselves.",
    description:
      "As a Gold or Platinum advertiser, you'll receive $50 in Fly-Inn credit to use toward service fees on short-term rental bookings. Use it for your own getaways — or gift it to friends, clients, or team members. Either way, it's real value back in your pocket. And when you use it, if you film your stay and share the video with us to post on social media, we will give you another $50 service fee credit!",
  },
];

const keyBenefits = [
  {
    icon: MdWeb,
    title: "High-Visibility Marketing Across Multiple Channels",
    intro: "All packages include:",
    items: [
      "A full-color listing",
      "A link to your website",
      "Instagram promotion",
      "A blog post just about your business",
    ],
    summary:
      "This multiplatform exposure boosts SEO and visibility in the aviation community.",
  },
  {
    icon: MdAirplanemodeActive,
    title: "Direct Engagement with the Pilot Community",
    intro: "Features like:",
    items: [
      "Participation in the Fly-Inn Find game",
      "First-Class Perks Pass (attracts pilot customers with deals)",
      "Plaque + Instagram frame for photo-sharing at the business",
    ],
    summary:
      "These turn your location into a destination for pilot visitors, creating real engagement.",
  },
  {
    icon: FiMic,
    title: "Media Spotlight Opportunities (Gold & Platinum)",
    intro: "Video promotion (15–30 seconds) on Fly-Inn's social accounts",
    items: [
      "Podcast/interview",
      "Free 30-day featured business spotlight (Platinum only)",
    ],
    summary:
      "These showcase your brand and story to a passionate flying audience.",
  },
];

export default function AdvertisePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleListBusiness = () => {
    if (session) {
      router.push("/dashboard/listings/business/add");
    } else {
      message.warning("You must log in before you can add a business.");
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2]">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#AF2322]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative app-container py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-medium mb-8 border border-[#AF2322]/20">
              <MdAirplanemodeActive />
              Aviation Marketing Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Reach Every Pilot
              <br />
              <span className="text-[#AF2322]">In The Sky</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              Help your target audience find exactly what they need, when they
              need it. Join the aviation community's premier marketing platform.
            </p>

            <button
              onClick={handleListBusiness}
              className="group border-0 inline-flex items-center gap-3 px-8 py-4 bg-[#AF2322] hover:bg-[#9a1f1e] text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-[#AF2322]/25 hover:shadow-xl hover:shadow-[#AF2322]/30"
            >
              List Your Business
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="relative py-20 md:py-28 bg-white">
        <div className="app-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything Your Aviation Business Needs
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Take off with our comprehensive marketing packages
            </p>
          </div>

          {/* Flyer Image */}
          <div className="mb-14 flex justify-center">
            <div className="max-w-4xl w-full">
              <Image
                src="/images/advertise_flyer.png"
                alt="Advertise with Fly-Inn"
                width={1200}
                height={800}
                className="w-full rounded-2xl shadow-2xl border border-gray-100"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-20">
            <button
              onClick={handleListBusiness}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#AF2322] hover:bg-[#9a1f1e] text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              List Your Business
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {keyBenefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#AF2322]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-[#AF2322]/10 flex items-center justify-center mb-6">
                  <benefit.icon className="text-2xl text-[#AF2322]" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
                  {benefit.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">{benefit.intro}</p>

                <ul className="space-y-2 mb-6">
                  {benefit.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#AF2322] mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-200 pt-4">
                  {benefit.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Benefits Section */}
      <section className="relative py-20 md:py-28 bg-gray-50">
        <div className="app-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-semibold mb-6">
              Full Package Breakdown
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              More Than Just a Listing
            </h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
              When you advertise with Fly-Inn, you're not just buying a listing
              — you're joining a movement. We're connecting passionate pilots
              with aviation-friendly businesses like yours across the country.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-white border border-gray-100 hover:border-[#AF2322]/20 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-[#AF2322]/10 text-[#AF2322] flex-shrink-0">
                    <benefit.icon className="text-lg" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 leading-snug pt-1">
                    {benefit.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="text-[#AF2322] font-semibold">
                    {benefit.highlight}
                  </span>{" "}
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#AF2322] via-[#c93a39] to-[#AF2322]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative app-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to Take Off?
            </h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Get listed. Get noticed. Get more pilots through your door. Start
              advertising with Fly-Inn today.
            </p>

            <button
              onClick={handleListBusiness}
              className="group inline-flex border-0 items-center gap-3 px-10 py-5 bg-white hover:bg-gray-50 text-[#AF2322] font-bold text-xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              List Your Business
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
