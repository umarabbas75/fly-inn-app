"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";

interface HostCardProps {
  host?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    image?: string;
    profile_picture?: string;
    avatar?: string;
    bio?: string | null;
    status?: boolean;
    email_verified_at?: string | null;
    created_at?: string;
    facebook_url?: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    linkedin_url?: string | null;
  };
  listingCount?: number;
}

const HostCard = ({ host, listingCount }: HostCardProps) => {
  // Use host image from profile
  const hostImage =
    host?.image || host?.profile_picture || host?.avatar || null;

  const hostName = host?.display_name;

  // Calculate years hosting from created_at
  const yearsHosting = useMemo(() => {
    if (!host?.created_at) return 0;
    const createdDate = new Date(host.created_at);
    const now = new Date();
    const years = now.getFullYear() - createdDate.getFullYear();
    const monthDiff = now.getMonth() - createdDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < createdDate.getDate())
    ) {
      return Math.max(0, years - 1);
    }
    return years;
  }, [host?.created_at]);

  // Check if host is verified
  const isVerified = host?.status === true || host?.email_verified_at !== null;

  // Profile link
  const profileLink =
    host?.id && hostName
      ? `/public/fly-inn-family-member/${encodeURIComponent(hostName)}?id=${
          host.id
        }`
      : "#";

  if (!host) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-xl font-semibold text-primary mt-6 mb-4">
        Property Hosted by
      </h2>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-md flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-10 items-center md:items-start">
        {/* Host Avatar + Info */}
        <div className="flex flex-col items-center md:items-center text-center md:text-left">
          {hostImage ? (
            <Image
              src={hostImage}
              alt={hostName || "Host"}
              width={100}
              height={100}
              className="rounded-full object-cover w-[100px] h-[100px]"
            />
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-gray-300 flex items-center justify-center">
              <FaUserCircle className="text-white text-5xl" />
            </div>
          )}
          {isVerified && (
            <p className="text-sm text-primary mt-3 font-medium flex items-center gap-1">
              Verified Host
              <span className="text-primary text-base">✔</span>
            </p>
          )}
          <h3 className="text-xl font-semibold text-gray-900 mt-1">
            {hostName}
          </h3>
          <p className="text-gray-600 mt-1">
            {yearsHosting > 0
              ? `${yearsHosting} ${
                  yearsHosting === 1 ? "Year" : "Years"
                } hosting`
              : "New host"}
            {listingCount !== undefined && (
              <>
                {" "}
                &middot; {listingCount}{" "}
                {listingCount === 1 ? "Listing" : "Listings"}
              </>
            )}
          </p>
        </div>

        {/* Divider (only on desktop) */}
        <div className="hidden md:block w-px bg-gray-200"></div>

        {/* Host Details */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Host Details
          </h4>
          {host?.bio ? (
            <p className="text-gray-700 leading-relaxed">{host.bio}</p>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {hostName} is a host on Fly Inn. Connect with them to learn more
              about their hosting experience.
            </p>
          )}

          {/* Button */}
          {/* <div className="mt-4">
            <Link
              href={profileLink}
              className="inline-block bg-primary hover:bg-primary-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition"
            >
              View Profile
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HostCard;
