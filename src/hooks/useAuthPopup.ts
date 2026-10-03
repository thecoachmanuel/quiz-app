"use client";

import { useCallback, useState } from "react";

export function useOAuthPopup() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [provider, setProvider] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openGlobalPopup = useCallback((url: string) => {
    // Reset
    setError(null);
    setProvider(null);
    setAuthCode(null);

    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "",
      "openGlobalPopup",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (!popup) {
      setError(
        "Popup was blocked. Please allow pop-ups for this site in Safari Settings.",
      );
      return;
    }

    try {
      // 👉 Now inject your URL AFTER popup is created
      popup.location.href = url;
    } catch (e: any) {
      setError(e);
      popup.close();
      return;
    }

    // Message listener
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { code, error, provider } = event.data;

      if (code && provider) {
        setAuthCode(code);
        setProvider(provider);
        popup.close();
      } else if (error) {
        setError(error);
        setProvider(false);
        popup.close();
      }
    };

    window.addEventListener("message", receiveMessage);

    // Timeout (2 min)
    const timeoutId = setTimeout(() => {
      setError("Authentication timed out");
      popup.close();
    }, 120000);

    // Cleanup function (for React)
    return () => {
      window.removeEventListener("message", receiveMessage);
      clearTimeout(timeoutId);
    };
  }, []);

  return { openGlobalPopup, authCode, error, provider };
}
