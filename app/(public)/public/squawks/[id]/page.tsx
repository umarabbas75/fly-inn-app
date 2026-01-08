"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import NewsletterSection from "../../../_components/newsletter-section";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { getArticleById } from "../data";

// Default content for articles without static pages
const defaultContent: Record<string, any> = {
  "packing-list-gentlemen": {
    title: "Ultimate Travel Packing List for Gentlemen",
    content: `
      <p>As a male pilot or aviation enthusiast, having the right gear can make all the difference in your travel experience. This comprehensive packing list ensures you're prepared for any aviation adventure.</p>
      
      <h3>Essential Flight Gear</h3>
      <p>Start with the basics: headset, charts, flight computer, and backup batteries. Your flight bag should include current sectionals, approach plates, and a tablet with aviation apps like ForeFlight or Garmin Pilot.</p>
      
      <h3>Professional Attire</h3>
      <p>Pack appropriate clothing for different occasions. Include professional attire for FBO meetings, casual wear for hangar time, and weather-appropriate layers. Don't forget comfortable shoes for pre-flight inspections.</p>
      
      <h3>Personal Care Items</h3>
      <p>Travel-sized toiletries, sunscreen, sunglasses, and any prescription medications are essential. Consider noise-canceling earbuds for passenger flights and a good quality watch for backup timekeeping.</p>
      
      <p>When staying at Fly-Inn properties, many hosts provide aviation-specific amenities, but having your personal kit ensures you're always prepared for your next adventure.</p>
    `,
  },
  "packing-list-pilots": {
    title: "Ultimate Travel Packing List for Pilots",
    content: `
      <p>Professional pilots know that preparation is key to safe and efficient flying. This comprehensive checklist covers everything you need in your flight bag and beyond.</p>
      
      <h3>Required Documents</h3>
      <p>Always carry your pilot certificate, medical certificate, government-issued ID, and aircraft registration and insurance documents. Keep digital backups on your tablet or phone.</p>
      
      <h3>Flight Planning Tools</h3>
      <p>Include current charts, E6B flight computer (as backup), plotter, and weather briefing tools. A tablet with ForeFlight or similar app is essential, but always have paper backups.</p>
      
      <h3>Emergency Equipment</h3>
      <p>Pack a flashlight with red filter, backup batteries, first aid kit, multi-tool, and emergency contact information. Consider a portable ADS-B receiver and backup radio if flying to remote areas.</p>
      
      <h3>Comfort Items</h3>
      <p>Don't forget snacks, water bottle, sunglasses, and comfortable clothing layers. A good headset bag protects your investment, and extra earplugs can be lifesavers for passengers.</p>
      
      <p>Fly-Inn hosts understand pilot needs and often provide amenities like current charts and weather briefing stations, making your stay even more convenient.</p>
    `,
  },
  "packing-list-parents": {
    title: "Ultimate Travel Pack List for Parents of Young Children",
    content: `
      <p>Flying with young children requires extra planning and preparation. This guide helps parents ensure safe, comfortable aviation travel with kids.</p>
      
      <h3>Safety Essentials</h3>
      <p>Child-appropriate ear protection is crucial. Consider youth aviation headsets or quality earplugs. Pack motion sickness remedies and any prescription medications with extra supplies.</p>
      
      <h3>Entertainment and Comfort</h3>
      <p>Tablets loaded with offline content, coloring books, favorite toys, and snacks are essential. Bring familiar comfort items like blankets or stuffed animals to help children feel secure.</p>
      
      <h3>Practical Necessities</h3>
      <p>Pack extra clothes, wipes, plastic bags for dirty items, and plenty of snacks and drinks. Don't forget car seats if needed at your destination - many Fly-Inn hosts can arrange child-friendly transportation.</p>
      
      <p>Many Fly-Inn properties offer family-friendly amenities, making them perfect for aviation families exploring together.</p>
    `,
  },
  "packing-list-pet-parents": {
    title: "Ultimate Travel Pack List for Pet Parents",
    content: `
      <p>Flying with pets requires careful preparation to ensure their safety and comfort. This comprehensive guide covers everything you need for aviation travel with your furry co-pilots.</p>
      
      <h3>Safety and Documentation</h3>
      <p>Carry health certificates, vaccination records, and registration tags. Ensure your pet's carrier is aviation-approved and properly secured. Include contact information on the carrier and your pet's collar.</p>
      
      <h3>Comfort Essentials</h3>
      <p>Pack familiar bedding, favorite toys, and comfort items. Bring pet-safe ear protection or calming aids if recommended by your vet. Include cleanup supplies, waste bags, and paper towels.</p>
      
      <h3>Food and Hydration</h3>
      <p>Bring enough food for the entire trip plus extra, collapsible water bowls, and treats for positive reinforcement. Avoid feeding right before flight to prevent motion sickness.</p>
      
      <p>Many Fly-Inn hosts are pet-friendly and understand the needs of flying with animals, offering secure areas and pet amenities at their properties.</p>
    `,
  },
  "airplane-camping-list": {
    title: "Ultimate Airplane Camping List",
    content: `
      <p>Fly-in camping combines the freedom of aviation with the adventure of outdoor living. This guide ensures you're prepared for the ultimate backcountry aviation experience.</p>
      
      <h3>Aircraft Considerations</h3>
      <p>Pack tie-down kit with stakes, ropes, and chocks. Include gust locks, pitot cover, and engine plugs. Consider portable GPS beacon for emergency situations and extra oil for extended trips.</p>
      
      <h3>Camping Essentials</h3>
      <p>Lightweight tent designed for fly-in camping, sleeping bags rated for expected temperatures, and compact camping stove with fuel. Don't forget camp chairs - many pilots swear by lightweight backpacking chairs.</p>
      
      <h3>Survival and Safety</h3>
      <p>Include first aid kit, water purification tablets, emergency shelter, and signaling devices. Pack weather radio and consider satellite communicator for remote locations.</p>
      
      <p>Fly-Inn hosts near popular camping destinations often provide secure aircraft parking and can share local knowledge about the best fly-in camping spots.</p>
    `,
  },
  "pilot-flight-bag-list": {
    title: "Ultimate Pilot Flight Bag List",
    content: `
      <p>A well-organized flight bag is essential for safe and efficient flying. This comprehensive checklist ensures you have everything needed for any flight situation.</p>
      
      <h3>Navigation Tools</h3>
      <p>Current sectional charts, approach plates, airport facility directory, and chart supplement. Include plotter, E6B computer, and pencils with erasers. Tablet with aviation apps provides electronic backup.</p>
      
      <h3>Communication Equipment</h3>
      <p>Quality aviation headset with spare batteries, handheld radio as backup, and charging cables for all devices. Include headset adapters for different aircraft types.</p>
      
      <h3>Documentation</h3>
      <p>Pilot certificate, medical certificate, photo ID, and aircraft documents. Keep logbook updated and include insurance information. Consider digital copies stored securely in the cloud.</p>
      
      <h3>Emergency Supplies</h3>
      <p>Flashlight with red lens, spare batteries, first aid supplies, and multi-tool. Include survival kit appropriate for your flying area and personal medications.</p>
      
      <p>When staying at Fly-Inn properties, you'll find hosts who understand these needs and often provide pilot amenities like flight planning stations and hangar access.</p>
    `,
  },
  "promises-hosts-make": {
    title: "FLY-INN's 5 Promises: Because Pilots Deserve to Be Pampered Too",
    content: `
      <p>At Fly-Inn, we understand that pilots have unique needs when it comes to accommodations. That's why we make five essential promises to ensure every aviation enthusiast feels right at home.</p>
      
      <h3>1. Accommodations Sorted</h3>
      <p>No matter where you're headed, Fly-Inn has 120+ properties listed across the country. From luxury hangar homes to cozy airpark cottages, we've got the perfect place for your aviation adventure. Each property is carefully vetted to meet our high standards for pilot comfort and convenience.</p>
      
      <h3>2. Landings Arranged</h3>
      <p>Each property has an accessible runway for your safe landing. Whether it's a private strip, residential airpark, or nearby airport with easy access, we ensure you have a clear approach and safe landing options. Runway conditions, lighting, and approach details are always provided upfront.</p>
      
      <h3>3. Fly Inn Family</h3>
      <p>The bond of aviation and community of pilots strengthens with FlyInn. Join a network of +15 passionate aviators who share your love for flying. Our hosts are fellow pilots and aviation enthusiasts who understand the lifestyle and create lasting connections beyond just a place to stay.</p>
      
      <h3>4. Ground Transportation</h3>
      <p>After landing you're not on your own - Fly-Inn got you covered. Our hosts provide or arrange ground transportation, from courtesy cars to local rentals. Many properties include a vehicle with your stay, ensuring you can explore local attractions and handle any errands with ease.</p>
      
      <h3>5. Hangars & Tie-downs</h3>
      <p>Each property has a hangar or tie-down for your plane's safety. Your aircraft is protected from weather and secure throughout your stay. Many locations offer full-service hangars with power, tools, and even maintenance support if needed. Your plane is as important to us as your comfort.</p>
      
      <p>These promises aren't just words – they're commitments backed by our growing community of aviation-loving hosts who go above and beyond to make your stay memorable. It's what sets Fly-Inn apart from traditional accommodations and makes us the premier choice for pilots worldwide.</p>
    `,
  },
};

export default function BlogArticlePage() {
  const params = useParams();
  const articleId = params?.id as string;

  // Get article data
  const article = getArticleById(articleId);

  // If article has a static page, redirect to it
  if (article?.staticPage) {
    if (typeof window !== "undefined") {
      window.location.href = `/public/StaticPages/${articleId}`;
    }
    return null;
  }

  // If no article found, show 404
  if (!article) {
    notFound();
  }

  // Get content for this article
  const content = defaultContent[articleId] || {
    title: article.name,
    content: `<p>${article.description || "Content coming soon..."}</p>`,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-[120px] flex flex-col items-center justify-center mb-8 overflow-hidden rounded-b-2xl shadow-md bg-[#AF2322]">
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center gap-2 py-8">
          <h1 className="text-lg font-bold text-white mb-2">Squawks</h1>
          <p className="text-white text-sm max-w-6xl mx-auto">
            Aviation News & Travel Inspiration
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
          {content.title}
        </h1>

        {/* Subtitle */}
        {article.description && (
          <h2 className="text-base text-center mb-6 text-gray-600">
            {article.description}
          </h2>
        )}

        {/* Meta Information */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            By <span className="text-[#AF2322] font-medium">FlyInn</span> ·{" "}
            {article.created_on} · {article.category}
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Link
            href="https://www.facebook.com/FlyInnLLC/"
            target="_blank"
            className="text-gray-600 hover:text-[#AF2322] transition-colors"
          >
            <FaFacebookF size={18} />
          </Link>
          <Link
            href="https://twitter.com/FlyInnLLC"
            target="_blank"
            className="text-gray-600 hover:text-[#AF2322] transition-colors"
          >
            <FaTwitter size={18} />
          </Link>
          <Link
            href="https://www.instagram.com/flyinnllc/"
            target="_blank"
            className="text-gray-600 hover:text-[#AF2322] transition-colors"
          >
            <FaInstagram size={18} />
          </Link>
          <Link
            href="https://www.youtube.com/@FLY-INN"
            target="_blank"
            className="text-gray-600 hover:text-[#AF2322] transition-colors"
          >
            <FaYoutube size={18} />
          </Link>
        </div>

        {/* Featured Image */}
        <div className="w-full rounded-lg overflow-hidden mb-8">
          <img
            src={article.image}
            alt={article.name}
            className="w-full h-[400px] object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.jpg";
            }}
          />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content.content }}
          style={{
            fontSize: "14px",
            lineHeight: "1.8",
          }}
        />

        <style jsx>{`
          .prose h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          .prose p {
            margin-bottom: 16px;
            color: #4b5563;
          }
          .prose ul {
            list-style-type: disc;
            padding-left: 24px;
            margin-bottom: 16px;
          }
          .prose li {
            margin-bottom: 8px;
            color: #4b5563;
          }
        `}</style>

        {/* Back to Squawks */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/public/squawks"
            className="inline-flex items-center text-sm text-[#AF2322] hover:underline font-medium"
          >
            ← Back to all Squawks
          </Link>
        </div>
      </main>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
