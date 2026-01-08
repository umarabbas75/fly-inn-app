"use client";
import {
  FacebookOutlined,
  LinkOutlined,
  ShareAltOutlined,
  MailOutlined,
  MessageOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useApp } from "@/providers/AppMessageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { bffMutation } from "@/lib/bff-client";
import { FaHeart, FaXTwitter } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TitleLocationProps {
  mockListing?: {
    id?: number | string;
    title?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

const TitleLocation = ({ mockListing }: TitleLocationProps) => {
  const { message } = useApp();
  const { user, isAuthenticated, refetch } = useAuth();
  const queryClient = useQueryClient();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(event.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current page URL dynamically
  const currentUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  }, []);

  // Extract favorite stay IDs from user data
  const favoriteIds = useMemo(() => {
    if (!user) return [];
    const favorites =
      user.favorite_stays ||
      user.favorite_stay_ids ||
      user.favorites?.stays ||
      user.favorites ||
      [];
    return Array.isArray(favorites)
      ? favorites.map((fav: any) =>
          typeof fav === "number" ? fav : fav?.stay_id || fav?.id
        )
      : [];
  }, [user]);

  // Check if this stay is favorited
  const stayId = mockListing?.id ? Number(mockListing.id) : undefined;
  const isFavorited =
    stayId !== undefined ? favoriteIds.includes(stayId) : false;

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !stayId || isTogglingFavorite) {
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (isFavorited) {
        await bffMutation(`/api/favorites/stays/${stayId}`, {
          method: "DELETE",
        });
        message.success("Removed from favorites!");
      } else {
        await bffMutation(`/api/favorites/stays/${stayId}`, {
          method: "POST",
        });
        message.success("Added to favorites!");
      }

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      refetch();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      message.error("Failed to update favorites");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      message.success("Link copied to clipboard!");
    }
  };

  const handleShareFacebook = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (shareUrl) {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank",
        "width=600,height=400"
      );
    }
  };

  const handleShareTwitter = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText =
      mockListing?.title || "Check out this amazing stay on Fly-Inn!";
    if (shareUrl) {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`,
        "_blank",
        "width=600,height=400"
      );
    }
  };

  const handleShareEmail = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const subject = `${mockListing?.title || "Amazing Stay"} - Fly-Inn`;
    const body = `Hey!\n\nI found this amazing stay on Fly-Inn and thought you might be interested:\n\n${
      mockListing?.title || "Stay"
    }\n📍 ${locationString}\n\nCheck it out here: ${shareUrl}\n\n---\nFly-Inn and Stay Awhile\nhttps://fly-inn.com`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleShareSMS = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const message = `Check out this stay on Fly-Inn! 🏠\n\n${
      mockListing?.title || "Amazing Stay"
    }\n${locationString}\n\n${shareUrl}\n\nFly-Inn and Stay Awhile ✈️`;
    // Use sms: protocol - works on mobile devices
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Build location string (city, state, country only - no street address for privacy)
  const locationString = useMemo(() => {
    const parts = [];
    if (mockListing?.city) parts.push(mockListing.city);
    if (mockListing?.state) parts.push(mockListing.state);
    if (mockListing?.country) parts.push(mockListing.country);
    return parts.length > 0 ? parts.join(", ") : "Location not available";
  }, [mockListing]);

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-0 text-foreground">
            {mockListing?.title || "Stay Title"}
          </h1>
          <p className="text-sm text-gray-500">{locationString}</p>
        </div>
        <div className="flex items-center gap-2 print-hidden">
          {/* Save/Favorite Button - Only show if user is logged in */}
          {isAuthenticated && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                    className={`w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-gray-200/50 hover:scale-110 active:scale-95 ${
                      isFavorited
                        ? "bg-[#AF2322]/10 border-[#AF2322]/30"
                        : "hover:bg-gray-50"
                    } ${
                      isTogglingFavorite ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label={
                      isFavorited ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <FaHeart
                      className={`text-sm transition-colors ${
                        isFavorited
                          ? "text-[#AF2322] fill-[#AF2322]"
                          : "text-gray-700"
                      }`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                  <p className="text-white font-medium">
                    {isFavorited ? "Remove from favorites" : "Add to favorites"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Share Button with Custom Dropdown */}
          <div className="relative" ref={shareDropdownRef}>
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-gray-200/50 hover:scale-110 active:scale-95 hover:bg-gray-50"
              aria-label="Share this stay"
            >
              <ShareAltOutlined className="text-gray-700 text-base" />
            </button>

            {isShareOpen && (
              <div className="absolute right-0 top-12 z-50 w-44 bg-white rounded-xl shadow-lg py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden ring-1 ring-gray-200">
                <button
                  onClick={() => {
                    handleCopyLink();
                    setIsShareOpen(false);
                  }}
                  className="w-full flex border-0 items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LinkOutlined className="text-gray-500 text-base" />
                  Copy link
                </button>
                <button
                  onClick={() => {
                    handleShareSMS();
                    setIsShareOpen(false);
                  }}
                  className="w-full flex border-0 items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MessageOutlined className="text-gray-500 text-base" />
                  Text message
                </button>
                <button
                  onClick={() => {
                    handleShareEmail();
                    setIsShareOpen(false);
                  }}
                  className="w-full flex border-0 items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MailOutlined className="text-gray-500 text-base" />
                  Email
                </button>
                <button
                  onClick={() => {
                    handleShareFacebook();
                    setIsShareOpen(false);
                  }}
                  className="w-full flex border-0 items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FacebookOutlined className="text-gray-500 text-base" />
                  Facebook
                </button>
                <button
                  onClick={() => {
                    handleShareTwitter();
                    setIsShareOpen(false);
                  }}
                  className="w-full flex border-0 items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaXTwitter className="text-gray-500 text-base" /> Twitter
                </button>
              </div>
            )}
          </div>

          {/* Print Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handlePrint}
                  className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-gray-200/50 hover:scale-110 active:scale-95 hover:bg-gray-50"
                  aria-label="Print this page"
                >
                  <PrinterOutlined className="text-gray-700 text-base" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                <p className="text-white font-medium">Print</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default TitleLocation;
