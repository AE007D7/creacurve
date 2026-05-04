"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    zE?: (...args: unknown[]) => void;
  }
}

const ZENDESK_KEY = process.env.NEXT_PUBLIC_ZENDESK_KEY ?? "";

export default function ChatWidget() {
  useEffect(() => {
    if (!ZENDESK_KEY || document.getElementById("ze-snippet")) return;

    const script = document.createElement("script");
    script.id = "ze-snippet";
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
