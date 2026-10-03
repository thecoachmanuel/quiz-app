"use client";

import useAdsQuery from "@/hooks/useAdsQuery";
import { stringToJson } from "@/utils/helper";
import Link from "next/link";
import { JSX, useMemo } from "react";
import ImageLoader from "../ui/ImageLoader";
import Loader from "../ui/Loader";
import Adstrerra from "./Adstrerra";
import GoogleAds from "./GoogleAds";

type Props = {
  position: string;
  className?: string;
};

type GoogleAdConfig = {
  client?: string;
  slot?: string;
};

const DEFAULT_AD_HEIGHT = 90; // safe fallback (Adsense banner size)

const AdSense = ({ position, className = "" }: Props) => {
  const { getAds, isLoading } = useAdsQuery();

  const adsData = useMemo(() => getAds(position), [getAds, position]);

  if (isLoading) return <Loader />;
  if (!adsData || !adsData.type) return null;

  const style =
    adsData.height || adsData.width
      ? {
          height: adsData.height,
          width: adsData.width,
        }
      : undefined;

  let ad: JSX.Element | null = null;
  switch (adsData.type) {
    case "custom":
      ad = (
        <div
          style={style}
          dangerouslySetInnerHTML={{ __html: adsData?.code }}
        />
      );
      break;
    case "adsterra":
      ad = <Adstrerra style={style} adKey={adsData?.code} />;
      break;

    case "adsense": {
      const parsed = stringToJson(adsData.code || "{}");

      const googleAds: GoogleAdConfig = Array.isArray(parsed)
        ? (parsed[0] ?? {})
        : (parsed ?? {});

      if (!googleAds.client || !googleAds.slot) return null;

      ad = (
        <GoogleAds
          client={googleAds.client}
          slot={googleAds.slot}
          style={style}
        />
      );
      break;
    }

    case "image":
      ad = (
        <Link href={adsData.link || "#"} target="_blank" style={style}>
          <ImageLoader
            src={adsData.image}
            alt={adsData.title || "Advertisement"}
            className="h-full w-full object-cover"
            height={adsData.height || DEFAULT_AD_HEIGHT}
            width={adsData.width || 300}
          />
        </Link>
      );
      break;

    default:
      return null;
  }

  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        minHeight: adsData.height || DEFAULT_AD_HEIGHT,
      }}
    >
      {ad}
    </div>
  );
};

export default AdSense;
