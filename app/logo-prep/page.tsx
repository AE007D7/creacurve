import LogoPrepPage from "@/components/logo-prep/LogoPrepPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Logo Prep Tool — Remove Background & Get All Versions | CreaCurve",
  description:
    "Upload your AI-generated logo and instantly get a transparent PNG, black version, and white version — all in one ZIP. Free tool by CreaCurve.",
  openGraph: {
    title: "Free Logo Prep Tool | CreaCurve",
    description: "Upload your logo. Get transparent, black, and white versions instantly.",
    url: "https://creacurve.com/logo-prep",
  },
};

export default function Page() {
  return <LogoPrepPage />;
}
