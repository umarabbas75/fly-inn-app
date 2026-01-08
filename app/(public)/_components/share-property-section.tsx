import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";

const SharePropertySection = () => (
  <section className="relative bg-white my-20 overflow-hidden">
    <div className="app-container">
      <div className="relative w-full mx-auto h-72 md:h-[28rem] xl:h-[32rem] rounded-2xl overflow-hidden flex items-center justify-center md:justify-start">
        {/* Background Image */}
        <Image
          src="/assets/images/shareproperty-bg.png"
          alt="Share your property"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
          }}
        ></div>

        {/* Overlay Card */}
        <div
          className="relative z-10 flex flex-col items-center w-full max-w-xs p-6 mx-4 mt-4 bg-white shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg sm:p-8 md:p-10 md:mt-8 md:ml-10 rounded-xl md:items-start"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly more opaque white
            backdropFilter: "blur(8px)", // Frosted glass effect
            WebkitBackdropFilter: "blur(8px)", // For Safari
          }}
        >
          <h2
            className="mb-3 text-2xl font-extrabold leading-tight text-center sm:text-3xl md:text-4xl md:text-left"
            style={{ color: "#666666" }} // Using colorText for general heading
          >
            {" "}
            <span style={{ color: "#AF2322" }}></span>
          </h2>
          <h2 className="mb-2 text-2xl font-bold text-center md:text-left sm:text-3xl md:text-4xl">
            Share Your Property on <span className="text-primary">FLY-INN</span>
          </h2>
          <p className="mb-8 text-base text-center sm:text-lg md:text-left">
            Turn your property into income by welcoming aviation travelers. We
            handle bookings while you earn. List today!
          </p>

          <Link href="/public/become-a-host/list-space">
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <Button
              type="primary"
              size="large" // Make the button slightly larger
              className="flex items-center  justify-center px-8 py-3 text-base font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              style={{
                // backgroundColor: "#AF2322", // Use colorPrimary
                borderColor: "#AF2322", // Match border to primary color
                color: "#fff", // White text for primary button
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#c8102e")
              } // colorLink on hover
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#AF2322")
              } // colorPrimary on leave
            >
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2 10.75V19a1 1 0 0 0 1 1h1v-2a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2h1a1 1 0 0 0 1-1v-8.25a.75.75 0 0 0-.75-.75H2.75a.75.75 0 0 0-.75.75Zm16 9v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2h12ZM6.25 9.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm11.5 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
              </svg>
              Become a Host
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default SharePropertySection;
