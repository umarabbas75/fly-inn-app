import type React from "react";
import LayoutPublic from "@/components/app-layouts/public-layout";

export default function LayoutPublicWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutPublic>{children}</LayoutPublic>;
}
