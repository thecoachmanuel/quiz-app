/** @format */
"use client";
import logo from "@/../public/logo.svg";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import { AppInfoType } from "@/types";
import Link from "next/link";
import ImageLoader from "./ImageLoader";

export default function Logo({ link = "/" }: { link?: string }) {
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);
  const { settings } = useSiteSettingsStore();

  const companyName =
    appInfo?.application_info?.company_info?.name ||
    appInfo?.application_info?.site_name ||
    settings.site_name ||
    "Quizix";

  const logoSrc =
    appInfo?.application_info?.logo_favicon?.logo_dark ||
    appInfo?.application_info?.logo_favicon?.logo_light ||
    settings.logo_light ||
    logo ||
    "/logo.svg";

  return (
    <Link
      href={link}
      className="flex items-center justify-start gap-2 hover:opacity-95 transition-opacity"
    >
      <ImageLoader
        src={logoSrc}
        alt={companyName}
        className="max-sm:size-8 size-10 object-contain shrink-0"
        width={40}
        height={40}
        priority
      />
      <span className="heading-3 font-bold tracking-tight">
        {companyName}
      </span>
    </Link>
  );
}
