"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdEdit, MdCameraAlt, MdPublish } from "react-icons/md";

const steps = [
  {
    number: "01",
    icon: MdEdit,
    title: "Write Details",
    subtitle: "about your property",
    description:
      "Add basic details like location, landing strip information, aircraft storage options, and how many guests can stay. This helps pilots find exactly what they need.",
    image: "/assets/images/become-a-host/get-started-bed.png",
  },
  {
    number: "02",
    icon: MdCameraAlt,
    title: "Make it Unique",
    subtitle: "stand out from the crowd",
    description:
      "Upload high-quality photos from good angles, write a compelling description that highlights your property's best features, and set your house rules and permissions.",
    image: "/assets/images/become-a-host/get-started-camera.png",
  },
  {
    number: "03",
    icon: MdPublish,
    title: "Finalize & Publish",
    subtitle: "go live in minutes",
    description:
      "Set your pricing, choose your availability, verify the final details, and publish your listing. You'll be welcoming pilots in no time!",
    image: "/assets/images/become-a-host/get-started-publish.png",
  },
];

export default function GetStartedIntro() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2]">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#AF2322]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#AF2322]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative app-container py-12 md:py-16">
          {/* Back Button */}
          <Link
            href="/public/become-a-host/list-space"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#AF2322] transition-colors mb-8 group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Overview</span>
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-medium mb-6 border border-[#AF2322]/20">
              3 Simple Steps
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
              Hosting with <span className="text-[#AF2322]">Fly-Inn</span>
              <br />
              is Super Easy!
            </h1>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Follow our simple 3-step process and your listing will be live on
              the Fly-Inn website, ready to welcome pilots from around the
              world.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="app-container py-16 md:py-20">
        <div className="grid gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-[#AF2322]/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#AF2322] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#AF2322]/20">
                    {step.number}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center md:hidden">
                    <step.icon className="text-2xl text-[#AF2322]" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[#AF2322] font-medium text-sm mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>

                {/* Image */}
                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Decorative line connecting steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-[2.5rem] top-full w-0.5 h-6 bg-gradient-to-b from-[#AF2322]/30 to-transparent -translate-y-0" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to get started?
            </h3>
            <p className="text-gray-600">
              It only takes a few minutes to create your listing.
            </p>
          </div>

          <Link href="/public/become-a-host/create-listing">
            <button className="group border-0 inline-flex items-center gap-3 px-8 py-4 bg-[#AF2322] hover:bg-[#9a1f1e] text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-[#AF2322]/25 hover:shadow-xl hover:shadow-[#AF2322]/30">
              Get Started
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
