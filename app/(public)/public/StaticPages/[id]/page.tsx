"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getArticleById } from "../../squawks/data";

// Dynamically import static page components based on the ID
const componentMap: Record<string, any> = {
  "most-fun-fly-ins": dynamic(() => import("../MostFun"), { ssr: false }),
  "air-shows": dynamic(() => import("../Mostpopular"), { ssr: false }),
  "airpark-communities": dynamic(() => import("../AirparkCommunities"), { ssr: false }),
  "hangar-home-ideas": dynamic(() => import("../InovatedIdea"), { ssr: false }),
  "packing-list-ladies": dynamic(() => import("../PackingListladies"), { ssr: false }),
  "short-term-rental": dynamic(() => import("../ShortTermRental"), { ssr: false }),
  "copy-policy": dynamic(() => import("../CopyPolicy"), { ssr: false }),
};

export default function StaticPageDetail() {
  const params = useParams();
  const id = params?.id as string;
  
  // Get article data
  const article = getArticleById(id);
  
  // Get the component for this static page
  const PageComponent = componentMap[id];
  
  if (!article || !PageComponent) {
    // For articles without static pages, redirect to squawks detail page
    if (article && !article.staticPage) {
      if (typeof window !== 'undefined') {
        window.location.href = `/public/squawks/${id}`;
      }
      return null;
    }
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Render the static page component */}
      <PageComponent />
    </div>
  );
}
