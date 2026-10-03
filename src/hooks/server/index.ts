/** @format */
"use server";
import { SERVER_SIDE_API_URLS } from "@/configs";
import { getFetchInstance } from "@/configs/getFetchInstance";
import { AppInfoType } from "@/types";
import {
  DEFAULT_APP_INFO,
  DEFAULT_MENUS,
  DEFAULT_PAGES,
} from "@/constants/defaultData";

export const getAppInfo = async () => {
  const value = SERVER_SIDE_API_URLS.INFO;
  try {
    const response = (await getFetchInstance({
      url: value.url,
      cacheKey: value.cacheKey,
    })) as any;
    if (response?.data) return response.data as AppInfoType;
  } catch (error: any) {
    console.warn("[getAppInfo] Backend unavailable, using default app info.");
  }
  return DEFAULT_APP_INFO;
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
    if (
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      return response.data;
    }
  } catch (error: any) {
    console.warn("[getPages] Backend unavailable, using default pages.");
  }
  return DEFAULT_PAGES;
};

export const getMenus = async () => {
  const value = SERVER_SIDE_API_URLS.MENUS;
  try {
    const response = (await getFetchInstance({
      url: value.url,
      cacheKey: value.cacheKey,
    })) as any;
    if (
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      return response.data;
    }
  } catch (error: any) {
    console.warn("[getMenus] Backend unavailable, using default menus.");
  }
  return DEFAULT_MENUS;
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
    if (response?.data) return response.data;
  } catch (error: any) {
    console.warn(error);
  }
  return {};
};
