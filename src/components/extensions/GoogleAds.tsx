"use client";
import { useEffect, useRef } from "react";

interface AdProps {
  client: string;
  slot: string;
  style?: React.CSSProperties;
}

export default function GoogleAd({ client, slot, style }: AdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ad = adRef.current;
    if (!ad) return;

    if (ad.getAttribute("data-loaded") === "true") return;

    const interval = setInterval(() => {
      if (ad.offsetWidth > 0) {
        clearInterval(interval);
        ad.setAttribute("data-loaded", "true");
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Ads error:", e);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <ins
      ref={adRef as React.Ref<HTMLModElement>}
      className="adsbygoogle"
      style={{ display: "block", width: "100%", ...style }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
