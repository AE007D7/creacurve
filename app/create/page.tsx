import type { Metadata } from "next";
import { UploadPage } from "@/components/UploadPage";

export const metadata: Metadata = {
  title: "Upload Your Logo — Generate Your Brand Kit",
  description:
    "Upload your logo file and get 60+ professional brand assets generated in 90 seconds. Business cards, social media templates, mockups and more. One-time $29.",
  alternates: {
    canonical: "https://creacurve.com/create",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Create() {
  return <UploadPage />;
}
