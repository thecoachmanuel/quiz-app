"use client";

import { useEffect, useRef } from "react";

interface DynamicFaviconProps {
  children: React.ReactNode;
  favicon?: string;
}

const DynamicFavicon = ({ children, favicon }: DynamicFaviconProps) => {
  const faviconRef = useRef<HTMLLinkElement | null>(null);
  const defaultFavicon = "/favicon.ico";

  useEffect(() => {
    const faviconUrl = favicon || defaultFavicon;

    // If already set to this favicon, skip
    if (faviconRef.current?.href.includes(faviconUrl)) return;

    // Remove previous favicon safely
    if (faviconRef.current?.parentNode) {
      faviconRef.current.parentNode.removeChild(faviconRef.current);
    }

    // Create new favicon link
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = faviconUrl;
    document.head.appendChild(link);

    faviconRef.current = link;

    // Cleanup on unmount
    return () => {
      if (faviconRef.current?.parentNode) {
        faviconRef.current.parentNode.removeChild(faviconRef.current);
      }
      faviconRef.current = null;
    };
  }, [favicon]);

  return children;
};

export default DynamicFavicon;
