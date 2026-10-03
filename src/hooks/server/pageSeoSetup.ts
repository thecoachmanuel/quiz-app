/** @format */

import { SERVER_URL } from "@/configs";
import { getFetchInstance } from "@/configs/getFetchInstance";
import {
  Favicon,
  MetaTag,
  metaVerificationType,
  SEOData,
  SeoPageSetupResponse,
} from "@/types/seoTypes";

const APPLICATION_BASE_URL: string =
  (process.env.NEXT_PUBLIC_BASE_URL as string) || "http://localhost:3000";

/**
 * Fetches and processes SEO data for a given page.
 */
export const setPageMetaData = async ({
  slug = "/",
  type = "",
}: {
  slug?: string;
  type?: string;
}) => {
  let url = `/page-seo/?slug=${slug}`;
  if (type) {
    url += `&type=${type}`;
  }
  let seoData: SEOData | null = null;
  try {
    const response: SeoPageSetupResponse = await getFetchInstance({
      url,
    });
    seoData = response?.data;
  } catch (error) {
    console.error(error);
  }

  // Remove structuredData from seoData object, as it's not needed
  if (!seoData) return {} as SEOData;

  delete seoData?.structuredData;
  return {
    metadataBase: seoData?.app_url
      ? new URL(seoData?.app_url)
      : new URL(APPLICATION_BASE_URL),

    ...seoData,
    images: seoData?.image ? SERVER_URL + seoData.image : "",
    openGraph: {
      ...seoData.openGraph,
      image: seoData?.openGraph?.image
        ? SERVER_URL + seoData.openGraph.image
        : "",
      url: !seoData?.openGraph?.url
        ? seoData?.app_url
        : seoData?.openGraph?.url,
    },
    twitter: {
      ...seoData.twitter,
      image: seoData?.twitter?.image ? SERVER_URL + seoData.twitter.image : "",
    },
    favicon: faviconFormat(seoData?.favicon as Favicon[]),
    ...extractMetaData(seoData?.meta as MetaTag[]),
  };
};

/**
 * Extracts meta data for Google verification and other meta tags.
 */

const extractMetaData = (meta: MetaTag[]): metaVerificationType => {
  const data: metaVerificationType = {
    verification: { google: "", yandex: "", yahoo: "", other: {} },
  };
  if (!meta?.length && typeof meta == "object") {
    Object.keys(meta).forEach((key: any) => {
      if (!meta[key].content) return;
      switch (meta[key].name) {
        case "google-site-verification":
          data.verification.google = meta[key].content;
          break;
        case "yandex-verification":
          data.verification.yandex = meta[key].content;
          break;
        case "yahoo-verification":
          data.verification.yahoo = meta[key].content;
          break;
        default:
          if (meta[key].name) {
            data.verification.other[meta[key].name] ??= meta[key].content;
          }
          break;
      }
    });

    return data;
  }

  meta?.forEach((item) => {
    if (!item.content) return;

    switch (item.name) {
      case "google-site-verification":
        data.verification.google = item.content;
        break;
      case "yandex-verification":
        data.verification.yandex = item.content;
        break;
      case "yahoo-verification":
        data.verification.yahoo = item.content;
        break;
      default:
        if (item.name) {
          data.verification.other[item.name] ??= item.content;
        }
        break;
    }
  });

  return data;
};

const faviconFormat = (favicon: Favicon[]): Favicon[] => {
  if (!favicon?.length) return [];
  return favicon?.map((item) => ({
    ...item,
    href: SERVER_URL + item.href,
  }));
};
