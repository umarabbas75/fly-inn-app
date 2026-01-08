"use client";

import React from "react";
import { Collapse, ConfigProvider } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import NewsletterSection from "../../_components/newsletter-section";

const { Panel } = Collapse;

const faqData = [
  {
    key: "1",
    title: "How to add a new listing on Fly-Inn.com",
    videoUrl: "https://www.youtube.com/embed/BlXa5iIUCWA?si=-5sYTjQ5Y1o9SFHz",
  },
  {
    key: "2",
    title: "April 11, 2024",
    videoUrl: "https://www.youtube.com/embed/_dTY5DbOCWM?si=dcXusRnE6-dVpH7v",
  },
  {
    key: "3",
    title: "How to sync Fly Inn com's iCal to other platforms",
    videoUrl: "https://www.youtube.com/embed/tClgM28kTsU?si=BlfrFPQrQ1sGMraa",
  },
  {
    key: "4",
    title: "How to Register on the Fly-Inn.com Platform",
    videoUrl: "https://www.youtube.com/embed/QfT_wgBOh3g?si=ACWbzXvwsMu3_YjV",
  },
];

const FaqPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[120px] flex flex-col items-center justify-center mb-12 overflow-hidden rounded-b-2xl shadow-md bg-[#AF2322]">
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center gap-2 py-8">
          <h1 className="text-lg font-bold text-white mb-2">FAQ</h1>
          <p className="text-white text-sm max-w-6xl mx-auto">
            The FAQ is where we answer your questions in depth so the entire
            Fly-Inn Family can benefit! If your question isn't answered here, we
            would love to add it to our FAQ library of videos. Please ask us
            your questions by using our contact page, calling us, or sending us
            an email to PIC@fly-inn.com with "Suggestions" in the subject line.
            You SQUAWK, We WILCO.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="app-container py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-base font-semibold mb-6 text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            The FAQ is where we answer your questions in depth so the entire
            Fly-Inn Family can benefit! If your question isn't answered here, we
            would love to add it to our FAQ library of videos. Please ask us
            your questions by using our contact page, calling us, or sending us
            an email to PIC@fly-inn.com with "Suggestions" in the subject line.
            You SQUAWK, We WILCO.
          </p>

          {/* Ant Design Collapse */}
          <ConfigProvider
            theme={{
              components: {
                Collapse: {
                  headerBg: "#f9fafb",
                  contentBg: "#ffffff",
                  headerPadding: "16px",
                  contentPadding: "16px",
                  fontSize: 14,
                },
              },
              token: {
                colorPrimary: "#AF2322",
                borderRadius: 8,
              },
            }}
          >
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined
                  rotate={isActive ? 90 : 0}
                  style={{ color: "#AF2322", fontSize: "14px" }}
                />
              )}
              className="bg-transparent"
              style={{
                background: "transparent",
              }}
            >
              {faqData.map((item) => (
                <Panel
                  header={
                    <span className="text-sm font-medium text-gray-800">
                      {item.title}
                    </span>
                  }
                  key={item.key}
                  className="mb-3 !rounded-lg !border !border-gray-200 overflow-hidden"
                  style={{
                    marginBottom: "12px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                  }}
                >
                  <div className="w-full">
                    <iframe
                      width="100%"
                      height="400"
                      src={item.videoUrl}
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="rounded-lg"
                      style={{ maxWidth: "100%" }}
                    ></iframe>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </ConfigProvider>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default FaqPage;
