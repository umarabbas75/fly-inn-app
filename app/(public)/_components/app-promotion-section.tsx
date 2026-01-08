import React from "react";
import Image from "next/image";
import { IoLogoGooglePlaystore, IoLogoApple } from "react-icons/io5";
import { Button } from "antd";

const AppPromotionSection = () => (
  <section className=" bg-gradient-to-b from-[#0d0c0c] to-[#1a0a0a]">
    <div className="app-container py-10">
      {/* Decorative grid background */}
      <div className="fixed inset-0 z-0 grid grid-cols-12 gap-0.5 opacity-5 pointer-events-none">
        {Array.from({ length: 144 }).map((_, i) => (
          <div
            key={i}
            className="h-full w-full bg-white"
            style={{
              animation: `pulse 3s infinite ${i * 30}ms`,
              opacity: 0.1,
            }}
          ></div>
        ))}
      </div>

      {/* Runway line animation */}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-block rounded-full bg-red-900/20 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-red-400">
              Coming Soon
            </div>
            <h2 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              <span className="text-[#AF2322]">FLY-INN</span> Mobile App
            </h2>
            <p className="mt-6 text-xl text-gray-300 md:text-2xl font-montserrat">
              Your aviation adventures, now in the palm of your hand
            </p>

            {/* Feature List */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "Instant property bookings",
                "Runway availability checker",
                "Pilot community access",
                "Exclusive mobile deals",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-lg bg-black/30 p-4 backdrop-blur-sm border border-white/5 hover:border-[#AF2322]/50 transition-all duration-300"
                >
                  <div className="mr-3 text-[#AF2322]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>

            {/* App Buttons */}
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="large"
                className="flex items-center justify-center space-x-3 bg-black/70 border border-white/10 hover:border-[#AF2322]/50 hover:bg-black/90 h-14 rounded-xl"
                icon={<IoLogoApple className="text-2xl text-[#AF2322]" />}
              >
                <div className="text-left">
                  <p className="text-xs text-gray-400">Download on the</p>
                  <p className="font-medium text-white">App Store</p>
                </div>
              </Button>

              <Button
                size="large"
                className="flex items-center justify-center space-x-3 bg-black/70 border border-white/10 hover:border-[#AF2322]/50 hover:bg-black/90 h-14 rounded-xl"
                icon={
                  <IoLogoGooglePlaystore className="text-2xl text-[#AF2322]" />
                }
              >
                <div className="text-left">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="font-medium text-white">Google Play</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Phone Mockup with Animation */}
          <div className="relative flex justify-center">
            <div className="relative w-64 h-auto md:w-80 lg:w-96">
              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 w-full h-full scale-90 bg-[#AF2322]/20 blur-xl rounded-[3rem] animate-[pulseGlow_4s_infinite]"></div>

              {/* Phone mockup */}
              <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/10 shadow-2xl">
                <Image
                  src="/assets/images/mobileapp.png"
                  alt="FLY-INN Mobile App"
                  width={400}
                  height={800}
                  className="object-contain"
                  priority
                />

                {/* Screen reflection animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/0 to-transparent opacity-10 pointer-events-none animate-[screenReflect_8s_infinite]"></div>
              </div>

              {/* Flying plane indicator */}
              <div className="absolute -right-10 top-1/4 animate-[flyAcross_6s_linear_infinite]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#AF2322"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style jsx global>{`
      @keyframes pulse {
        0%,
        100% {
          opacity: 0.1;
        }
        50% {
          opacity: 0.15;
        }
      }

      @keyframes pulseGlow {
        0%,
        100% {
          opacity: 0.3;
          transform: scale(0.9);
        }
        50% {
          opacity: 0.5;
          transform: scale(1);
        }
      }

      @keyframes screenReflect {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(100%);
        }
      }

      @keyframes flyAcross {
        0% {
          transform: translateX(-100px) rotate(0deg);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          transform: translateX(100px) rotate(45deg);
          opacity: 0;
        }
      }

      @keyframes runwayLights {
        0% {
          left: 0;
          opacity: 0;
        }
        2% {
          opacity: 1;
        }
        98% {
          opacity: 1;
        }
        100% {
          left: 100%;
          opacity: 0;
        }
      }
    `}</style>
  </section>
);

export default AppPromotionSection;
