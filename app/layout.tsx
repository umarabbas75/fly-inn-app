import type React from "react";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import AppProviders from "../providers";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlyInn - Aviation Accommodations",
  description: "One stop solution to all your aviation needs",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <NextTopLoader />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
