"use client";

import React, { Fragment } from "react";
import Footer from "./footer";
import Header from "./header";
import SocialLinks from "./social-links";
import FilterLinks, { FilterProvider } from "./filter-links";
import CompareBar from "@/components/shared/CompareBar";
import { usePathname } from "next/navigation";

const LayoutPublic = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isCreateListing = pathname === "/public/become-a-host/create-listing";

  return (
    <FilterProvider>
      <Fragment>
        <Header />

        {/* Conditionally render these components only on homepage */}
        {isHomepage && (
          <>
            <SocialLinks />
            <FilterLinks />
          </>
        )}

        {children}
        {!isCreateListing && <Footer />}
        
        {/* Compare Bar - Shows globally when items are selected */}
        <CompareBar />
      </Fragment>
    </FilterProvider>
  );
};

export default LayoutPublic;
