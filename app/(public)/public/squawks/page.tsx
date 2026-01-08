"use client";

import React, { useState } from "react";
import { Card, Tabs, ConfigProvider } from "antd";
import Link from "next/link";
import { MdArticle } from "react-icons/md";
import NewsletterSection from "../../_components/newsletter-section";
import {
  articlesData,
  getFeaturedArticle,
  getArticlesByCategory,
} from "./data";

const { TabPane } = Tabs;

export default function SquawksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const featuredArticle = getFeaturedArticle();

  const filterArticles = (category: string) => {
    return getArticlesByCategory(category);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-[#fef2f2]">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#AF2322]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#AF2322]/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative app-container py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#AF2322]/10 text-[#AF2322] text-sm font-medium mb-6 border border-[#AF2322]/20">
              <MdArticle />
              News & Updates
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
              Squawks
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Stay informed with the latest news, travel inspiration, and
              updates from Fly-Inn.
            </p>
          </div>
        </div>
      </section>

      <div className="app-container py-8">
        {/* Featured Article */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <p className="text-sm text-gray-600 mb-2">
                {featuredArticle.created_on}
              </p>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {featuredArticle.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {featuredArticle.description}
              </p>
              <Link
                href={
                  featuredArticle.staticPage
                    ? `/public/StaticPages/${featuredArticle.id}`
                    : `/public/squawks/${featuredArticle.id}`
                }
                className="inline-flex items-center px-4 py-2 bg-[#AF2322] text-white rounded-lg hover:bg-[#8f1d1c] transition-colors text-sm"
              >
                Read more
                <span className="ml-2">→</span>
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.jpg";
                }}
              />
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Latest News Section with Ant Design Tabs */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Latest News</h2>

          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  inkBarColor: "#AF2322",
                  itemActiveColor: "#AF2322",
                  itemHoverColor: "#AF2322",
                  itemSelectedColor: "#AF2322",
                  fontSize: 14,
                },
              },
            }}
          >
            <Tabs
              defaultActiveKey="all"
              onChange={setActiveTab}
              className="squawks-tabs"
            >
              <TabPane tab="All" key="all" />
              <TabPane tab="Company" key="company" />
              <TabPane tab="Stays" key="stays" />
              <TabPane tab="Product" key="product" />
              <TabPane tab="Policy" key="policy" />
              <TabPane tab="Community" key="community" />
            </Tabs>
          </ConfigProvider>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {filterArticles(activeTab)
              .slice(0, 8)
              .map((article) => (
                <Link
                  href={
                    article.staticPage
                      ? `/public/StaticPages/${article.id}`
                      : `/public/squawks/${article.id}`
                  }
                  key={article.id}
                  className="group"
                >
                  <Card
                    className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    bodyStyle={{ padding: 0 }}
                    bordered={false}
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={article.image}
                        alt={article.name}
                        className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold mb-2 text-gray-800 line-clamp-2 group-hover:text-[#AF2322] transition-colors">
                        {article.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {article.created_on}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* All Articles Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800">All Articles</h2>

          <div className="space-y-6">
            {articlesData.map((article) => (
              <div
                key={article.id}
                className="flex flex-col md:flex-row gap-6 pb-6 border-b border-gray-200 last:border-b-0"
              >
                {/* Image */}
                <Link
                  href={
                    article.staticPage
                      ? `/public/StaticPages/${article.id}`
                      : `/public/squawks/${article.id}`
                  }
                  className="flex-shrink-0"
                >
                  <img
                    src={article.image}
                    alt={article.name}
                    className="w-full md:w-80 h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                </Link>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <Link
                    href={
                      article.staticPage
                        ? `/public/StaticPages/${article.id}`
                        : `/public/squawks/${article.id}`
                    }
                  >
                    <h3 className="text-lg font-bold mb-2 text-gray-800 hover:text-[#AF2322] transition-colors">
                      {article.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">
                    Created by {article.created_by} on {article.created_on}
                  </p>
                  {article.description && (
                    <p className="text-sm text-gray-500 mb-3">
                      {article.description}
                    </p>
                  )}
                  <Link
                    href={
                      article.staticPage
                        ? `/public/StaticPages/${article.id}`
                        : `/public/squawks/${article.id}`
                    }
                    className="inline-flex items-center text-sm text-[#AF2322] hover:underline font-medium"
                  >
                    Read more
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom styles for tabs */}
      <style jsx global>{`
        .squawks-tabs .ant-tabs-tab {
          padding: 8px 16px;
          margin-right: 24px;
        }
        .squawks-tabs .ant-tabs-nav {
          margin-bottom: 0;
        }
        .squawks-tabs .ant-tabs-nav::before {
          border-bottom-color: #e5e7eb;
        }
      `}</style>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
