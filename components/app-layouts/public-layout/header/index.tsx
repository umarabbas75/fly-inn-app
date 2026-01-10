import Image from "next/image";

import { Button } from "antd";
import Link from "next/link";
import DestinationDropdown from "./components/destination-dropdown";
import TravelDatesDropdown from "./components/travel-dates-dropdown";
import LodgingTypeDropdown from "./components/lodging-type-dropdown";
import PriceDropdown from "./components/price-dropdown";
import AddGuestsDropdown from "./components/guest-dropdown";
import UserInfo from "./components/user-info";
import GoogleTranslate from "@/components/shared/google-translate";
import FilterInitializer from "./components/filter-initializer";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <FilterInitializer />
      <div className="app-container flex items-center justify-between  py-3">
        {/* Logo */}
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
        {/* Center Search Bar */}
        <div className="hidden md:flex items-center justify-between border border-gray-200 rounded-full shadow-md hover:shadow-md transition cursor-pointer relative">
          <div className="flex items-center group">
            <DestinationDropdown />
            <div className="border-l border-gray-300 h-5 group-hover:border-white" />
          </div>
          <TravelDatesDropdown />
          <div className="border-l border-gray-300 h-5" />
          {/* <LodgingTypeDropdown /> */}
          {/* <div className="border-l border-gray-300 h-5" /> */}
          {/* <PriceDropdown /> */}
          {/* <div className="border-l border-gray-300 h-5" /> */}

          <AddGuestsDropdown />
        </div>
        {/* <FilterModal/> */}

        {/* Right Icons */}
        <div className="flex items-center space-x-2">
          {/* Google Translate */}
          {/* <div className="hidden md:block">
            <GoogleTranslate />
          </div> */}

          <Link href="/auth/signup">
            <Button
              type="link"
              className="text-sm font-semibold hidden md:block text-black"
            >
              Join Free
            </Button>
          </Link>

          {/* Profile Menu */}
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
