"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Paddle } from "@paddle/paddle-js";

interface PaddleContextValue {
  paddle: Paddle | null;
  ready: boolean;
}

const PaddleContext = createContext<PaddleContextValue>({ paddle: null, ready: false });

export function usePaddle() {
  return useContext(PaddleContext);
}

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      console.warn("[Paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set — checkout will not work.");
      return;
    }

    import("@paddle/paddle-js").then(({ initializePaddle }) => {
      initializePaddle({
        token,
        environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ?? "sandbox",
        checkout: {
          settings: {
            displayMode: "overlay",
            theme: "light",
            locale: "en",
            successUrl: `${window.location.origin}/order-confirmed`,
          },
        },
      }).then((instance) => {
        if (instance) {
          setPaddle(instance);
          setReady(true);
        }
      });
    });
  }, []);

  return (
    <PaddleContext.Provider value={{ paddle, ready }}>
      {children}
    </PaddleContext.Provider>
  );
}
