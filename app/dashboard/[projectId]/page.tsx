import type { Metadata } from "next";
import { DashboardPage } from "@/components/DashboardPage";

export const metadata: Metadata = {
  title: "Your Brand Kit — Dashboard",
  description: "View and download your generated brand assets.",
  robots: { index: false, follow: false },
};

export default async function Dashboard({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <DashboardPage projectId={projectId} />;
}
