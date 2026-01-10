import Image from "next/image";
import React from "react";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import Link from "next/link";
const BrandColumn = () => {
  const socialMediaLinks = [
    {
      Icon: FacebookOutlined,
      url: "https://www.facebook.com/FlyInnLLC/",
      name: "Facebook",
    },
    {
      Icon: TwitterOutlined,
      url: "https://twitter.com/FlyInnLLC",
      name: "Twitter",
    },
    {
      Icon: InstagramOutlined,
      url: "https://www.instagram.com/flyinnllc/",
      name: "Instagram",
    },
    {
      Icon: YoutubeOutlined,
      url: "https://www.youtube.com/@FLY-INN",
      name: "YouTube",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/assets/logo/fly-inn-logo.png" // Replace with your own logo if needed
              alt="Logo"
              width={100}
              height={32}
              className="object-contain"
            />
          </Link>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">
        {" "}
        {/* Adjusted text color for readability */}
        We empower aviation enthusiasts to book and host lodging, transportation
        and more!
      </p>
      <div>
        <p className="mb-3 text-sm font-bold text-gray-800">
          {" "}
          {/* Adjusted text color */}
          Connect with us:
        </p>
        <div className="flex space-x-4">
          {socialMediaLinks.map((item, index) => (
            <Link
              href={item.url}
              key={index}
              target="_blank"
              aria-label={`Visit our ${item.name}`}
            >
              <div className="p-2 bg-[#AF2322] text-white w-10 h-10 flex justify-center items-center rounded-full hover:bg-[#8A1C1C] transition-all duration-300 cursor-pointer">
                {/* Render the icon component from the array */}
                <item.Icon className="!text-white text-lg" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandColumn;
