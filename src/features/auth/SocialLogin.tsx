/** @format */

"use client";
import fbLogo from "@/../public/fb-logo.png";
import githubIcon from "@/../public/github-logo.png";
import google from "@/../public/google.svg";
import linkedinIcon from "@/../public/linkedin.png";
import xLogo from "@/../public/x-logo.png";
import { publicInstance } from "@/configs/axiosConfig";
import { getFetchInstance } from "@/configs/getFetchInstance";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useOAuthPopup } from "@/hooks/useAuthPopup";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { UserType } from "@/types/user";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import ImageLoader from "../../components/ui/ImageLoader";

const providers = [
  { icon: google, name: "Google", provider: "google" },
  { icon: fbLogo, name: "Facebook", provider: "facebook" },
  { icon: xLogo, name: "Twitter", provider: "twitter" },
  { icon: linkedinIcon, name: "LinkedIn", provider: "linkedin" },
  { icon: githubIcon, name: "GitHub", provider: "github" },
];

const SocialLogin: React.FC = () => {
  const { openGlobalPopup, authCode, provider } = useOAuthPopup();
  const { tran } = useTranslations();
  const { redirect, authProviders } = useAuthHandler();
  const { login }: { login: (token: string, user: UserType) => void } =
    useAuthStore((state: any) => state);

  const { push } = useRouter();
  const searchParams = useSearchParams();
  const referer = searchParams.get("referer");

  useEffect(() => {
    const getLoginFromCode = async () => {
      if (!authCode || !provider) return;

      let url = `/auth/login/${provider}/callback?code=${authCode}`;
      if (referer) url += `&referer=${referer}`;

      const response = (await getFetchInstance({ url })) as any;

      if (response?.data) {
        const data = response?.data;
        login(data.token, data.user);
        push(redirect(data.user));
      }
    };

    getLoginFromCode();
  }, [authCode, provider, login, push, referer, redirect]);

  const handleSocialiteLogin = (provider: string) => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      "",
      "openGlobalPopup",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (!popup) {
      alert("Safari blocked the popup. Please allow pop-ups for this site.");
      return;
    }
    publicInstance
      .get(`/auth/login/${provider}`)
      .then((response) => {
        if (response?.status === 200) {
          const redirectUrl = response?.data?.data?.redirect_url;
          popup.location.href = redirectUrl;
          openGlobalPopup(redirectUrl);
        } else {
          popup.close();
        }
      })
      .catch(() => popup.close());
  };

  if (!authProviders(providers).length) return null;

  return (
    <>
      <div className="relative flex items-center justify-start gap-2 pt-8">
        <p className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
          {tran("or")}
        </p>
        <div className="bg-dark5 h-px w-full flex-1"></div>
      </div>

      <div className="flex w-full items-center justify-center gap-2">
        <ul className="mt-5 flex w-full flex-wrap items-center justify-center gap-2">
          {authProviders(providers).map((provider) => (
            <li key={provider.provider} className="rounded-full">
              <button
                type="button"
                className="border-dark5 flex size-12 cursor-pointer items-center justify-center rounded-full border text-sm"
                onClick={() => handleSocialiteLogin(provider.provider)}
              >
                <ImageLoader
                  src={provider.icon}
                  alt={provider.name}
                  height={24}
                  width={24}
                  className="size-6"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SocialLogin;
