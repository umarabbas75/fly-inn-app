import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    text: "Fly-Inn.com provides the best service. It's like a curated list of places to stay that includes only the properties that would be considered 5-star on the fun and all-around awesome scale...",
    name: "Kendra M",
    role: "Fly-Inn Guest",
    imageMain:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    imageBack:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    text: "I loved how easy it was to find a property with a runway! The booking process was seamless and the host was amazing.",
    name: "Alex P.",
    role: "Pilot & Traveler",
    imageMain:
      "https://images.unsplash.com/photo-1552058549-f4f6819d463f?w=400",
    imageBack:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
  },
];

const TestimonialsSection = () => {
  const [index, setIndex] = React.useState(0);
  const t = testimonials[index];
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="mt-20 bg-gray-100">
      <div className="app-container py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl mb-1">
            See what Our <span className="text-[#AF2322]"> Hosts & Guests</span>{" "}
            are Saying
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Real stories from those who've experienced the FLY-INN difference in
            aviation hospitality
          </p>
        </div>

        <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col justify-around h-full"
            >
              <div>+
                {/* Large number */}
                {/* <h3 className="mb-4 text-5xl font-bold text-gray-900">93</h3> */}

                {/* Double quotes - exactly as in screenshot */}
                <div className="relative">
                  <Image
                    src="/assets/icons/quotes.png"
                    alt="Quote Left"
                    width={32}
                    height={32}
                  />
                  <p className="relative z-10 mb-8 text-base text-gray-800">
                    {t.text}
                  </p>
                </div>

                <div className="">
                  <p className="mb-1 text-base font-bold text-gray-900">
                    {t.name}
                  </p>
                  <p className="text-sm text-gray-700">{t.role}</p>
                </div>
              </div>

              {/* Navigation buttons with exact rounded corners */}
              <div className="flex">
                <button
                  aria-label="Previous testimonial"
                  onClick={prev}
                  className="flex items-center justify-center w-12 h-12 px-2 text-2xl font-bold text-white transition-all bg-gray-900 border-0 rounded-l-xl hover:bg-gray-700"
                >
                  <Image
                    src="/assets/icons/testimonial-previous-icon.png"
                    alt="Previous"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </button>
                <button
                  aria-label="Next testimonial"
                  onClick={next}
                  className="flex items-center justify-center w-12 h-12 px-2 text-2xl font-bold text-white transition-all bg-red-600 border border-none rounded-e-xl hover:bg-red-700"
                  style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
                >
                  <Image
                    src="/assets/icons/testimonial-next-icon.png"
                    alt="Next"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={index + "-img"}
              className="relative flex items-center justify-start h-96"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div
                className="absolute z-0 w-96 h-96 overflow-hidden rounded-xl shadow-lg right-10 top-8"
                style={{ background: "#fff" }}
              >
                <Image
                  src={t.imageBack}
                  alt="Guest"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="relative z-10 overflow-hidden shadow-2xl w-96 h-96 rounded-xl"
                style={{ background: "#fff" }}
              >
                <Image
                  src={t.imageMain}
                  alt="Happy travelers"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
