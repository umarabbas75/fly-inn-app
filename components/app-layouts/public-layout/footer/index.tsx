import React from "react";
import Link from "next/link";
import BrandColumn from "./_components/brand-column";
import NavigationColumn from "./_components/navigation-column";
import ContactColumn from "./_components/contact-us-column";

const Footer = () => {
  return (
    <div className="font-sans">
      <footer className="py-12 bg-white text-gray-800">
        <div className="app-container">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <BrandColumn />

            {/* Column 1: About FLY-INN */}
            <NavigationColumn
              title="About FLY-INN"
              links={[
                { label: "About Us", href: "/public/about-us" },
                { label: "Philanthropy", href: "/public/philanthropy" },
                { label: "Squawks (Blog)", href: "/public/squawks" },
                { label: "Gallery", href: "/public/gallery" },
              ]}
            />

            {/* Column 2: Resources & Legal */}
            <NavigationColumn
              title="Resources & Legal"
              links={[
                { label: "Terms of Service", href: "/public/terms-of-service" },
                { label: "Privacy Policy", href: "/public/privacy-policy" },
                { label: "FAQ", href: "/public/faq" },
                { label: "Testimonials", href: "/public/testimonials" },
              ]}
            />

            {/* Column 3: Contact Us */}
            <ContactColumn />
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="py-5 bg-gray-900 text-white print-hidden">
        <div className="app-container">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© All Rights Reserved by FLY-INN © 2023-2025</p>
            <div className="mt-2 md:mt-0 flex space-x-4">
              <Link
                href="/public/terms-of-service"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Terms
              </Link>
              <Link
                href="/public/privacy-policy"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                href="/public/contact-us"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
