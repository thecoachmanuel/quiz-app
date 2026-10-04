/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SiteSettings {
  site_name: string;
  company_email: string;
  company_phone: string;
  website: string;
  timezone: string;
  currency: string;
  currency_symbol: string;
  address_country: string;
  address_city: string;
  address_line: string;
  logo_light: string;
  logo_dark: string;
  favicon: string;
}

interface SiteSettingsState {
  settings: SiteSettings;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: "Quizix",
  company_email: "support@quizix.com",
  company_phone: "+1 800-555-QUIZ",
  website: "https://quiz.softivus.com",
  timezone: "UTC",
  currency: "USD",
  currency_symbol: "$",
  address_country: "United States",
  address_city: "San Francisco",
  address_line: "100 Market Street, Suite 400",
  logo_light: "/assets/admin/images/logo-light.png",
  logo_dark: "/assets/admin/images/logo-dark.png",
  favicon: "/favicon.ico",
};

export const useSiteSettingsStore = create<SiteSettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SITE_SETTINGS,

      updateSettings: (partial: Partial<SiteSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      resetSettings: () => set({ settings: DEFAULT_SITE_SETTINGS }),
    }),
    {
      name: "quizix-site-settings",
    }
  )
);
