/** @format */
"use server";
import { SERVER_SIDE_API_URLS } from "@/configs";
import { getFetchInstance } from "@/configs/getFetchInstance";
import { AppInfoType } from "@/types";
export const getAppInfo = async () => {
  const value = SERVER_SIDE_API_URLS.INFO;
  try {
    const response = (await getFetchInstance({
      url: value.url,
      cacheKey: value.cacheKey,
    })) as any;
    return response?.data as AppInfoType;
  } catch (error: any) {
    console.warn(error);
  }
};

export const getAppRobots = async () => {
  const value = SERVER_SIDE_API_URLS.ROBOTS;
  try {
    const response = (await getFetchInstance({
      url: value.url,
      cacheKey: value.cacheKey,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
    };
  }
};

export const getAppSitemap = async () => {
  const value = SERVER_SIDE_API_URLS.SITEMAP;
  try {
    const response = (await getFetchInstance({
      url: value.url,
      cacheKey: value.cacheKey,
    })) as any;

    return response?.data;
  } catch (error: any) {
    console.warn(error);
    return [];
  }
};

export const getPages = async () => {
  const value = SERVER_SIDE_API_URLS.PAGES;
  try {
    const response = (await getFetchInstance({
      url: value.url,
      cacheKey: value.cacheKey,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
  }
};

export const getMenus = async () => {
  const value = SERVER_SIDE_API_URLS.MENUS;
  try {
    const response = (await getFetchInstance({
      url: value.url,
      cacheKey: value.cacheKey,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
  }
};
export const getLanguages = async (locale: string) => {
  const value = SERVER_SIDE_API_URLS.TRANSLATION;
  try {
    const response = (await getFetchInstance({
      url: value.url + `/${locale}`,
      cacheKey: value.cacheKey,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
  }
};
export const getTranslations = async (locale: string) => {
  const value = SERVER_SIDE_API_URLS.TRANSLATION;
  try {
    const response = (await getFetchInstance({
      url: value.url + `/${locale}`,
      cacheKey: value.cacheKey,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
  }
};
