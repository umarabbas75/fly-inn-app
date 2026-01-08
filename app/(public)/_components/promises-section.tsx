import { Button } from "antd";
import React, { useState, useEffect } from "react";

function Card({ icon, title, text, delay, className = "" }: any) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/70 to-[#1a0a0a]/80 backdrop-blur-sm transition-all duration-500 hover:border-white/30 hover:shadow-2xl hover:shadow-red-900/30 ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: "translateY(20px)",
        opacity: 0,
        animation: `fadeInUp 500ms forwards ${delay}ms`,
      }}
    >
      <div className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-4 text-4xl text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-red-400">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="mt-auto text-gray-300 transition-all duration-300 group-hover:text-white">
          {text}
        </p>
      </div>
    </div>
  );
}

const PromisesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("promises-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="promises-section"
      className="relative overflow-hidden bg-gradient-to-b from-[#0d0c0c] to-[#1a0a0a] py-20 px-4 sm:px-6 md:px-8"
    >
      {/* Decorative elements - simplified */}
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

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-red-900/20 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-red-400">
            Our Commitment
          </div>
          <h2 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            <span className="text-primary">FLY-INN's</span> 5 Promises
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-10 md:grid-rows-[auto_auto]">
          {/* Card 1 - Top left */}
          <div className="md:col-span-4 md:row-start-1">
            <Card
              delay={100}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7.79.093a.5.5 0 0 0-.58 0l-7 5A.5.5 0 0 0 0 5.5v9a.5.5 0 0 0 .5.5H2V8h5v7h7.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.21-.407L14 4.528V2h-1v1.814zM11 12V8h1v4z"
                    clipRule="evenodd"
                  ></path>
                  <path fill="currentColor" d="M6 15v-3H5v-1h1V9H3v6z"></path>
                </svg>
              }
              title="Accommodations Sorted"
              text="No matter where you're headed, Fly-Inn has 120+ properties listed"
            />
          </div>

          {/* Card 2 - Top right */}
          <div className="md:col-span-3 md:col-start-1 md:row-start-1">
            <Card
              delay={200}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M624 448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h608c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16M44.81 205.66l88.74 80a62.6 62.6 0 0 0 25.47 13.93l287.6 78.35c26.48 7.21 54.56 8.72 81 1.36c29.67-8.27 43.44-21.21 47.25-35.71c3.83-14.5-1.73-32.71-23.37-54.96c-19.28-19.82-44.35-32.79-70.83-40l-97.51-26.56L282.8 30.22c-1.51-5.81-5.95-10.35-11.66-11.91L206.05.58c-10.56-2.88-20.9 5.32-20.71 16.44l47.92 164.21l-102.2-27.84l-27.59-67.88c-1.93-4.89-6.01-8.57-11.02-9.93L52.72 64.75c-10.34-2.82-20.53 5-20.72 15.88l.23 101.78c.19 8.91 6.03 17.34 12.58 23.25"
                  ></path>
                </svg>
              }
              title="Landings Arranged"
              text="Each property has an accessible runway for your safe landing"
            />
          </div>

          {/* Center Card - Emphasized */}
          <div className="md:col-span-4 md:col-start-4 md:row-span-2 md:row-start-1">
            <div className="group relative h-full overflow-hidden rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-black/80 to-[#1a0a0a] shadow-2xl shadow-red-900/30 transition-all duration-500 hover:border-red-500/70 hover:shadow-red-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-black/80"></div>
              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <div className="mb-6 rounded-full bg-primary/10 p-5 text-5xl text-red-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 12 12"
                  >
                    <path
                      fill="currentColor"
                      d="M4.25 3.25a1.75 1.75 0 1 1 3.5 0a1.75 1.75 0 0 1-3.5 0m-2 2.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5M11 4.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M5.25 6C4.56 6 4 6.56 4 7.25V8.5a2 2 0 1 0 4 0V7.25C8 6.56 7.44 6 6.75 6zM3 7.25c0-.289.054-.565.154-.818l-1.231.33a1.25 1.25 0 0 0-.884 1.53l.194.725a2 2 0 0 0 2.45 1.414l.017-.005A3 3 0 0 1 3 8.5zM9 8.5c0 .733-.263 1.405-.7 1.927l.016.004a2 2 0 0 0 2.449-1.414l.194-.725a1.25 1.25 0 0 0-.884-1.53l-1.228-.33c.099.254.153.53.153.818z"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Fly Inn Family
                </h3>
                <p className="max-w-md text-lg text-gray-300">
                  The bond of aviation and community of pilots strengthens with
                  FlyInn
                </p>
                <div className="mt-8 flex space-x-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-gray-700 to-gray-900"
                    >
                      <div className="h-full w-full opacity-70"></div>
                    </div>
                  ))}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/30 text-white/60">
                    +15
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Bottom left */}
          <div className="md:col-span-3 md:col-start-1 md:row-start-2">
            <Card
              delay={300}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10 22v-6.35L11.625 11h8.75L22 15.65V22h-2v-1.5h-8V22zm2-7.5h8l-.7-2h-6.6zm1 4q.425 0 .713-.288T14 17.5t-.288-.712T13 16.5t-.712.288T12 17.5t.288.713t.712.287m6 0q.425 0 .713-.288T20 17.5t-.288-.712T19 16.5t-.712.288T18 17.5t.288.713t.712.287M6 14v-2h2v2zm5-6V6h2v2zM6 18v-2h2v2zm0 4v-2h2v2zm-4 0V8h5V2h10v7h-2V4H9v6H4v12z"
                  ></path>
                </svg>
              }
              title="Ground Transportation"
              text="After landing you're not on your own, Fly-Inn got you covered"
            />
          </div>

          {/* Card 5 - Bottom right */}
          <div className="md:col-span-3 md:col-start-8 md:row-start-2">
            <Card
              delay={400}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M20 8h-3V4H1v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm13.5-8.5l1.96 2.5H17V9.5h2.5zM18 18c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1z"
                  ></path>
                </svg>
              }
              title="Hangars & Tie-downs"
              text="Each property has a hangar or tie-down for your plane's safety"
            />
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            size="large"
            className="flex items-center rounded-full bg-gradient-to-r from-red-600 to-red-800 px-8 py-4 font-medium text-white transition-all duration-300 hover:from-red-700 hover:to-red-900 hover:shadow-xl hover:shadow-red-900/30"
          >
            <span>Explore Properties</span>
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.15;
          }
        }
      `}</style>
    </section>
  );
};

export default PromisesSection;
