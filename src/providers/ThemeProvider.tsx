/** @format */

"use client";
import { ThemeColorType } from "@/types";
import NextTopLoader from "nextjs-toploader";
import { createContext, useContext, useEffect, useMemo } from "react";

const ThemeContext = createContext<{ theme: ThemeColorType | undefined }>({
  theme: {
    primary_color: "",
    secondary_color: "",
  },
});

type ThemeProviderTypes = {
  children: React.ReactNode;
  themeColor: ThemeColorType | undefined;
  firebaseConfig: any;
};

export const ThemeColorProvider = ({
  children,
  themeColor,
  firebaseConfig,
}: ThemeProviderTypes) => {
  const value = useMemo(() => ({ theme: themeColor }), [themeColor]);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js", {
            scope: "/firebase",
            updateViaCache: "none",
          })
          .then((reg) => {
            reg.active?.postMessage({
              type: "SET_CONFIG",
              config: firebaseConfig,
            });
          })
          .catch((err) => console.error("SW registration failed:", err));
        navigator.serviceWorker
          .register("/service-worker.js", {
            scope: "/main",
            updateViaCache: "none",
          })
          .then((reg) => {
            reg.active?.postMessage({
              type: "SET_CACHE_KEY",
              cacheName: process.env.NEXT_PUBLIC_API_BASE_URL, // dynamic key
            });
          })
          .catch((err) => console.error("SW registration failed:", err));
      });
    }
  }, [firebaseConfig]);
  useEffect(() => {
    const { primary_color, secondary_color } = value.theme || {};
    if (primary_color && secondary_color) {
      document.documentElement.style.setProperty(
        "--primary",
        primary_color || "#008744",
      );
      document.documentElement.style.setProperty(
        "--secondary",
        secondary_color,
      );
    }
  }, [value]);

  return (
    <ThemeContext.Provider value={value}>
      <NextTopLoader color={value?.theme?.primary_color} showSpinner />
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeColor = () => {
  return useContext(ThemeContext);
};
