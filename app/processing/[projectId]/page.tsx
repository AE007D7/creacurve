import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Generating Your Brand Kit…",
  description: "Your brand assets are being generated. This takes about 90 seconds.",
  robots: { index: false, follow: false },
};
import { ProcessingPage } from "@/components/ProcessingPage";

export default async function Processing({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
      </div>
    }>
      <ProcessingPage projectId={projectId} />
    </Suspense>
  );
}
