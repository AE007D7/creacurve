"use client";

import { useEffect } from "react";

export default function ChatWidget() {
  useEffect(() => {
    if (document.getElementById("tidio-script")) return;
    const script = document.createElement("script");
    script.id = "tidio-script";
    script.src = "//code.tidio.co/08la8wvnfrvhn1fsqjzgpz0pbsmmim6n.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
