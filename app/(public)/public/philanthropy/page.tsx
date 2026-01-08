"use client";

import React from "react";
import Image from "next/image";
import NewsletterSection from "../../_components/newsletter-section";
import {
  FaHeart,
  FaHandHoldingHeart,
  FaUsers,
  FaGraduationCap,
  FaLightbulb,
  FaGlobe,
  FaArrowRight,
  FaCheckCircle,
  FaRocket,
  FaSeedling,
  FaHandsHelping,
  FaChartLine,
  FaEye,
} from "react-icons/fa";
import { MdAirplanemodeActive, MdVolunteerActivism } from "react-icons/md";

const coreValues = [
  {
    icon: FaUsers,
    title: "Who We Are",
    description:
      "ADH is a group of committed people who believe in the power of community to change lives. We work to create sustainable solutions for poverty and hunger.",
  },
  {
    icon: FaLightbulb,
    title: "Our Philosophy",
    description:
      "Give a man a fish, you help him for a day. Teach a man to fish, you help him for a lifetime. We believe in empowering communities to become self-sufficient and thrive.",
  },
  {
    icon: FaGlobe,
    title: "Our History",
    description:
      "Dewey Egalitarian Village Education, started in 2010, has helped thousands of children and families escape poverty through education and opportunity.",
  },
];

const solutionSteps = [
  {
    number: "01",
    title: "Find Communities",
    description:
      "Find the community utilizing a simple and completely random method (draw from a deck, weekly by a group of friends, using a dartboard, etc.), and send enough resources to lift every member above the poverty line.",
  },
  {
    number: "02",
    title: "Track & Measure",
    description:
      "Track the results, measure improvements, and repeat the process in a new community. Each new community increases the probability of being contributed to.",
  },
  {
    number: "03",
    title: "Empower Teachers",
    description:
      "We empower teachers to change village and city from the ground, through the experience of others who have gone before them. Real easy steps, real results, real change.",
  },
  {
    number: "04",
    title: "Connect Communities",
    description:
      "We help communities connect with others who have similar goals, so they can share resources, ideas, and support. The income they get is reinvested in more communities.",
  },
];

const impactAreas = [
  {
    icon: FaGraduationCap,
    title: "Education",
    description: "Direct donations to local schools and educational programs",
  },
  {
    icon: FaHandsHelping,
    title: "Community Support",
    description: "Supporting teachers and leaders in creating lasting change",
  },
  {
    icon: FaHeart,
    title: "Humanitarian Causes",
    description: "Sharing what we contribute to local humanitarian initiatives",
  },
  {
    icon: FaSeedling,
    title: "Sustainable Growth",
    description: "Helping communities become self-sustaining and independent",
  },
];

const PhilanthropyPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2]">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#AF2322]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative app-container py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-medium mb-8 border border-[#AF2322]/20">
              <MdVolunteerActivism />
              Making a Difference Together
        </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Philanthropy at
              <br />
              <span className="text-[#AF2322]">Fly-Inn</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            At FlyInn, we believe in the spirit of collaboration, reaching out
            to those in need. Through our philanthropy initiatives, we support
            education, healthcare, and sustainable development, powered
              sustainably by flying.
            </p>

            <a
              href="#transform"
              className="group border-0 inline-flex items-center gap-3 px-8 py-4 bg-[#AF2322] hover:bg-[#9a1f1e] text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-[#AF2322]/25 hover:shadow-xl hover:shadow-[#AF2322]/30"
            >
              Transform a Life Now
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* What If Section */}
      <section id="transform" className="relative py-20 md:py-28 bg-white">
        <div className="app-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-semibold mb-6">
                The Possibility
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                What If It Were Possible...
          </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            To eradicate poverty in eight weeks. To create communities of
                dignity. To reduce the poor to such a degree that they cease to
                be poor. Forget how to be poor, and stay free.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Eradicate poverty in communities",
                  "Create sustainable change",
                  "Empower through education",
                  "Build self-sufficient families",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-[#AF2322] flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
        </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/assets/images/philanthropy/section1.jpg"
                  alt="Transform Lives"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
          />
        </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#AF2322]/10 rounded-full blur-2xl" />
      </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative py-20 md:py-28 bg-gray-50">
        <div className="app-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Our Foundation
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Built on principles that drive meaningful change
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#AF2322]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-[#AF2322]/10 flex items-center justify-center mb-6">
                  <value.icon className="text-2xl text-[#AF2322]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
            </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* P.E.T.E Section */}
      <section className="relative py-20 md:py-28 bg-white">
        <div className="app-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-semibold mb-6">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              The P.E.T.E. Solution
        </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Because we care. Because we see 25,000 fellow human beings go
              hungry every day. That's 15,000,000 people per year.
            </p>
      </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {solutionSteps.map((step, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#AF2322]/20 transition-all duration-300 hover:shadow-md"
              >
                <span className="text-4xl font-black text-[#AF2322]/20 group-hover:text-[#AF2322]/40 transition-colors">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-3 mt-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
          </p>
        </div>
            ))}
      </div>
        </div>
      </section>

      {/* Model Section */}
      <section className="relative py-20 md:py-28 bg-gray-50">
        <div className="app-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <Image
                  src="/assets/images/philanthropy/section6.jpg"
                  alt="Our Model"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
          />
        </div>
      </div>
            <div className="order-1 md:order-2">
              <span className="inline-block px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-semibold mb-6">
                How We Work
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Our Model
        </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our model is to take entire villages, educate them, equip them,
                and help them escape poverty. From struggle of illness and
                hunger to thriving, self-sustaining communities.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We work with local leaders, teachers, and organizations to
                identify the most pressing needs and develop sustainable
                solutions that address the root causes of poverty.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Change is within the abilities of every person, no matter where
                we are living or our origins. Education improves quality of life
                and makes possible a better future for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="relative py-20 md:py-28 bg-white">
        <div className="app-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-semibold mb-6">
              Making a Difference
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Our Impact
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Your donations and your own FBO events assist with education,
              training, and providing vital support to our fellow human beings.
        </p>
      </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {impactAreas.map((area, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#AF2322]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-[#AF2322]/10 flex items-center justify-center mb-6 mx-auto">
                  <area.icon className="text-2xl text-[#AF2322]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {area.title}
                </h3>
                <p className="text-sm text-gray-600">{area.description}</p>
              </div>
            ))}
      </div>

          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#AF2322]/5 to-[#AF2322]/10 border border-[#AF2322]/20">
            <p className="text-center text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
              <span className="font-semibold text-[#AF2322]">
                Our guiding principle:
              </span>{" "}
              Eradication through education—the bedrock of teaching people to
              fish.
        </p>
      </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-20 md:py-28 bg-gray-50">
        <div className="app-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-semibold mb-6">
                Looking Forward
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Vision & Mission
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                See and serve the often yet not-been-yet introduced and to raise
                human beings thriving, healthy, knowledgeable, well-nourished,
                well educated, and able to give back to their communities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our vision is global, and is in many circles: homes,
                communities, ministries, and hearts that have been touched or
                changed for the better. We are committed to being a catalyst for
                change, bringing lasting blessings and happiness to other fellow
                human beings.
        </p>
      </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/images/philanthropy/section8.jpg"
                  alt="Vision & Mission"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#AF2322]/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#AF2322] via-[#c93a39] to-[#AF2322]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative app-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Join our mission to uplift lives by partnering with
              aviation-focused causes. Every mile we travel can help make a
              meaningful impact.
            </p>

            <a
              href="#transform"
              className="group inline-flex border-0 items-center gap-3 px-10 py-5 bg-white hover:bg-gray-50 text-[#AF2322] font-bold text-xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Transform a Life Now
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default PhilanthropyPage;
