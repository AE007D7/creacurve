declare global {
  interface Window {
    tidioChatApi?: {
      open: () => void;
      on: (event: string, cb: () => void) => void;
    };
  }
}

export function openChat() {
  if (window.tidioChatApi) {
    window.tidioChatApi.open();
  } else {
    // Tidio not ready yet — open as soon as it loads
    document.addEventListener(
      "tidioChat-ready",
      () => window.tidioChatApi?.open(),
      { once: true }
    );
  }
}
