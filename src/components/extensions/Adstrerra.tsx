"use client";

import { useEffect, useRef } from "react";

export default function Adstrerra({
  style,
  adKey,
}: {
  style?: React.CSSProperties;
  adKey?: string;
}) {
  const adRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adRef.current) return;

    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        key: "${adKey}",
        format: "iframe",
        height: 90,
        width: 728,
        params: {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src =
      "https://www.highperformanceformat.com/" + adKey + "/invoke.js";
    invokeScript.async = true;

    adRef.current.appendChild(configScript);
    adRef.current.appendChild(invokeScript);
  }, [adKey]);

  return (
    <div
      ref={adRef}
      style={style}
      className="mx-auto my-4 flex justify-center"
    />
  );
}
