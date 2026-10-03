"use client";
import AdSense from "@/components/extensions/AdSense";

const HeaderAd = () => {
  const adContainerClass =
    "h-16 flex overflow-hidden items-center justify-center pt-2";

  return <AdSense position="header" className={adContainerClass} />;
};

export default HeaderAd;
