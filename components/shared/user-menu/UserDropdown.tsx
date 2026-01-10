"use client";

import React, { useState, cloneElement, isValidElement } from "react";
import { Avatar } from "antd";
import {
  MdMenu,
  MdPerson,
  MdDashboard,
  MdSettings,
  MdLogout,
  MdLogin,
  MdPersonAdd,
  MdHome,
  MdHelp,
  MdCalendarToday,
  MdFlight,
  MdStar,
  MdFavorite,
  MdMail,
  MdPeople,
  MdDescription,
  MdApps,
  MdBusiness,
  MdApartment,
} from "react-icons/md";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppMessageProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BRAND_PRIMARY = "#AF2322";

type Variant = "public" | "dashboard";

interface UserDropdownProps {
  variant?: Variant;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ variant = "public" }) => {
  const router = useRouter();
  const { message } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading: isUserLoading } = useAuth();
  const { data: session } = useSession();
  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes("admin");

  const handleLogout = async () => {
    try {
      message.loading("Signing out...");
      const redirectUrl = variant === "dashboard" ? "/auth/login" : "/";

      // Sign out with NextAuth
      await signOut({
        redirect: false, // Don't let NextAuth handle redirect
      });

      message.success("Signed out successfully!");
      setIsOpen(false);

      // Force redirect using window.location
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Logout failed. Please try again.");

      // Force redirect even on error
      const redirectUrl = variant === "dashboard" ? "/auth/login" : "/";
      window.location.href = redirectUrl;
    }
  };

  const menuItemClassName =
    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[rgba(175,35,34,0.08)] hover:text-[#AF2322] focus:bg-[rgba(175,35,34,0.08)] focus:text-[#AF2322] cursor-pointer";

  const renderMenuItems = () => {
    if (!session?.user?.id) {
      return (
        <>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/auth/login">
              <MdLogin className="text-lg" />
              <span>Sign In</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/auth/signup">
              <MdPersonAdd className="text-lg" />
              <span>Create Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 mx-2" />
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/public/become-a-host/list-space">
              <MdHome className="text-lg" />
              <span>Become a Host</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/public/advertise">
              <MdHelp className="text-lg" />
              <span>Advertise</span>
            </Link>
          </DropdownMenuItem>
        </>
      );
    }

    if (isAdmin) {
      return (
        <>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/admin-dashboard">
              <MdDashboard className="text-lg" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/admin-dashboard/profile">
              <MdPerson className="text-lg" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/admin-dashboard/users">
              <MdPeople className="text-lg" />
              <span>Users</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/admin-dashboard/cancellation-policy">
              <MdDescription className="text-lg" />
              <span>Cancellation Policy</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/admin-dashboard/features">
              <MdApps className="text-lg" />
              <span>Features</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/admin-dashboard/stays">
              <MdHome className="text-lg" />
              <span>Stays</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={menuItemClassName}>
            <Link href="/admin-dashboard/business">
              <MdBusiness className="text-lg" />
              <span>Business</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 mx-2" />
          <DropdownMenuItem
            onClick={handleLogout}
            className={menuItemClassName}
          >
            <MdLogout className="text-lg" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </>
      );
    }

    return (
      <>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard">
            <MdDashboard className="text-lg" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/profile">
            <MdPerson className="text-lg" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/listings/stays">
            <MdHome className="text-lg" />
            <span>Stays Listings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/listings/business">
            <MdApartment className="text-lg" />
            <span>Business Listings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/bookings">
            <MdCalendarToday className="text-lg" />
            <span>Bookings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/trips">
            <MdFlight className="text-lg" />
            <span>Trips</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/reviews">
            <MdStar className="text-lg" />
            <span>Reviews</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/favorites">
            <MdFavorite className="text-lg" />
            <span>Favorite Stays</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/airmail">
            <MdMail className="text-lg" />
            <span>Airmail</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 mx-2" />
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href="/dashboard/settings">
            <MdSettings className="text-lg" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 mx-2" />
        <DropdownMenuItem
          onClick={handleLogout}
          className={`${menuItemClassName} text-[#AF2322]`}
        >
          <MdLogout className="text-lg" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </>
    );
  };

  console.log({ variant, isUserLoading });

  const triggerContent =
    variant === "dashboard" ? (
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm transition hover:shadow-md hover:border-[#AF2322]/40 focus:outline-none">
        {isUserLoading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        ) : user?.profile_picture ? (
          <Avatar
            src={user.profile_picture}
            size={32}
            className="border border-gray-200"
          />
        ) : (
          <Avatar
            size={32}
            className="bg-gradient-to-br from-[#AF2322] to-[#8A1C1C] font-semibold text-white"
          >
            {(user?.display_name || user?.first_name || user?.email)
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </Avatar>
        )}
        <span className="hidden text-sm font-medium text-gray-700 md:block">
          {user?.display_name || user?.first_name || "Account"}
        </span>
      </div>
    ) : (
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-[#AF2322]/40 hover:text-[#AF2322] hover:shadow-md focus:outline-none">
        <MdMenu size={18} />
        {session?.user?.id ? (
          <>
            {isUserLoading ? (
              <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
            ) : user?.profile_picture ? (
              <Avatar
                src={user.profile_picture}
                size={24}
                className="border border-gray-200"
              />
            ) : (
              <Avatar
                size={24}
                className="bg-gradient-to-br from-[#AF2322] to-[#8A1C1C] text-xs font-semibold text-white"
              >
                {(user?.display_name || user?.first_name || user?.email)
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </Avatar>
            )}
            <span className="hidden sm:block">
              {(user?.display_name || user?.first_name || user?.email)?.split(
                " "
              )[0] || "Account"}
            </span>
          </>
        ) : (
          <>
            <MdPerson size={18} />
            {/* <span className="hidden sm:block">Account</span> */}
          </>
        )}
      </div>
    );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {isValidElement(triggerContent)
          ? cloneElement(triggerContent as React.ReactElement<any>, {
              className: `${
                (triggerContent as React.ReactElement<any>).props?.className ||
                ""
              } cursor-pointer focus:outline-none`,
              role: "button",
              tabIndex: 0,
            })
          : triggerContent}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[220px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)]"
        sideOffset={8}
      >
        {renderMenuItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
