import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import React from "react";
import { FaBuilding, FaBullhorn } from "react-icons/fa";

const SocialLinks = () => {
  // Social media data with links and colors
  const socialMedia = [
    {
      icon: <YoutubeOutlined className="text-2xl" />,
      name: "YouTube",
      url: "https://youtube.com",
      color: "hover:text-[#FF0000]",
    },
    {
      icon: <TwitterOutlined className="text-2xl" />,
      name: "Twitter",
      url: "https://twitter.com/FlyInnLLC",
      color: "hover:text-[#1DA1F2]",
    },
    {
      icon: <InstagramOutlined className="text-2xl" />,
      name: "Instagram",
      url: "https://www.instagram.com/flyinnllc/",
      color: "hover:text-[#E1306C]",
    },
    {
      icon: <FacebookOutlined className="text-2xl" />,
      name: "Facebook",
      url: "https://www.facebook.com/FlyInnLLC/",
      color: "hover:text-[#1877F2]",
    },
  ];

  return (
    <div className="bg-gray-900 py-2 md:py-3">
      <div className="app-container">
        {/* Mobile: Only Directory and Advertise buttons */}
        <div className="flex md:hidden items-center justify-center gap-3">
          <Link href="/public/business-directory">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-all duration-200 border border-white/20">
              <FaBuilding className="text-[10px]" />
              Directory
            </button>
          </Link>
          <Link href="/public/advertise">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#AF2322] hover:bg-[#8A1C1C] text-white text-xs font-medium rounded-full transition-all duration-200 border-0">
              <FaBullhorn className="text-[10px]" />
              Advertise
            </button>
          </Link>
        </div>

        {/* Desktop: Full layout with socials + buttons */}
        <div className="hidden md:flex flex-row items-center justify-center gap-4">
          {/* Social text */}
          <div className="text-gray-300 text-sm flex items-center">
            <div className="hidden sm:inline-block bg-brand h-2 w-2 rounded-full mr-2 animate-pulse"></div>
            Follow us on socials
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 transition-all duration-300 ${social.color} hover:scale-110`}
                aria-label={`Visit our ${social.name} page`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-700" />

          {/* Directory and Advertise buttons */}
          <div className="flex items-center gap-2">
            <Link href="/public/business-directory">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-all duration-200 border border-white/20">
                <FaBuilding className="text-xs" />
                Directory
              </button>
            </Link>
            <Link href="/public/advertise">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#AF2322] hover:bg-[#8A1C1C] text-white text-xs font-medium rounded-full transition-all duration-200 shadow-sm border-none">
                <FaBullhorn className="text-xs" />
                Advertise
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
