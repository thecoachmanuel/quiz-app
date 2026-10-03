/** @format */
import { AppInfoType, PageType } from "@/types";
import { MenuGroup } from "@/types/menu";

export const DEFAULT_PAGES: PageType[] = [
  {
    id: 1,
    title: "Home",
    slug: "/",
    sections: [
      { id: 1, title: "Home Hero", slug: "home-hero", content: [] as any },
      { id: 2, title: "How It Works", slug: "how-it-works", content: [] as any },
      { id: 3, title: "Three Quizzes", slug: "three-quizzes", content: [] as any },
      { id: 4, title: "Unique Quiz Features", slug: "unique-quiz-features", content: [] as any },
      { id: 5, title: "Upcoming Contests", slug: "upcoming-contests", content: [] as any },
      { id: 6, title: "The Journey", slug: "the-journey", content: [] as any },
      { id: 7, title: "Testimonials", slug: "testimonials", content: [] as any },
      { id: 8, title: "Counter Section", slug: "counter-section", content: [] as any },
      { id: 9, title: "Subscribe Section", slug: "subscribe-section", content: [] as any },
      { id: 10, title: "Footer", slug: "footer", content: [] as any },
    ],
  },
  {
    id: 2,
    title: "Quizzes",
    slug: "quizzes",
    sections: [
      { id: 20, title: "Footer", slug: "footer", content: [] as any },
    ],
  },
  {
    id: 3,
    title: "Contests",
    slug: "contests",
    sections: [
      { id: 30, title: "Footer", slug: "footer", content: [] as any },
    ],
  },
  {
    id: 4,
    title: "Top Players",
    slug: "top-players",
    sections: [
      { id: 40, title: "Footer", slug: "footer", content: [] as any },
    ],
  },
  {
    id: 5,
    title: "About Us",
    slug: "about-us",
    sections: [
      { id: 50, title: "The Journey", slug: "the-journey", content: [] as any },
      { id: 51, title: "FAQ", slug: "faq-section", content: [] as any },
      { id: 52, title: "Testimonials", slug: "testimonials", content: [] as any },
      { id: 53, title: "Top Players", slug: "top-players", content: [] as any },
      { id: 54, title: "Footer", slug: "footer", content: [] as any },
    ],
  },
  {
    id: 6,
    title: "Contact Us",
    slug: "contact-us",
    sections: [
      { id: 60, title: "Contact Us", slug: "contact-us", content: [] as any },
      { id: 61, title: "Contact Form", slug: "contact-form", content: [] as any },
      { id: 62, title: "Footer", slug: "footer", content: [] as any },
    ],
  },
];

export const DEFAULT_APP_INFO: AppInfoType = {
  application_info: {
    site_name: "Quizix",
    description: "AI Quiz & Trivia Gaming Platform",
    email: "support@quizapp.com",
    contact_no: "+1 (800) 555-QUIZ",
    theme: {
      primary_color: "#7C3AED",
      secondary_color: "#F59E0B",
    },
    logo_favicon: {
      logo_light: "/logo.svg",
      logo_dark: "/logo.svg",
      favicon: "/favicon.ico",
    },
    social_medias: [],
    locale: "en",
    coins: {
      initial_balance: 100,
      score_ratio: { coin: "1", score: 1 },
      usd_ratio: { coin: 10, usd: 1 },
    },
    auth_left_sidebar_image: "",
    footer_text: "© 2026 Quizix. All rights reserved.",
    referral: { joining: 50 },
  } as any,
  extensions: {
    recaptcha: { is_enabled: false, site_key: "", secret_key: "" },
    google_analytics: { is_enabled: false, measurement_id: "" },
    tawk_to: { is_enabled: false, property_id: "", widget_id: "" },
  },
  service_switch: {} as any,
  firebase: {} as any,
};

export const DEFAULT_MENUS: MenuGroup[] = [
  {
    id: 1,
    name: "Header Menu",
    slug: "header-menu",
    items: [
      { id: 1, title: "Home", url: "/", order: 1, parent_id: null, menu_id: "1", page_id: "1", children: [], page: { id: 1, slug: "/" } },
      { id: 2, title: "Quizzes", url: "/quizzes", order: 2, parent_id: null, menu_id: "1", page_id: "2", children: [], page: { id: 2, slug: "quizzes" } },
      { id: 3, title: "Contests", url: "/contests", order: 3, parent_id: null, menu_id: "1", page_id: "3", children: [], page: { id: 3, slug: "contests" } },
      { id: 4, title: "Leaderboard", url: "/top-players", order: 4, parent_id: null, menu_id: "1", page_id: "4", children: [], page: { id: 4, slug: "top-players" } },
      { id: 5, title: "About Us", url: "/about-us", order: 5, parent_id: null, menu_id: "1", page_id: "5", children: [], page: { id: 5, slug: "about-us" } },
      { id: 6, title: "Contact", url: "/contact-us", order: 6, parent_id: null, menu_id: "1", page_id: "6", children: [], page: { id: 6, slug: "contact-us" } },
    ],
  },
  {
    id: 2,
    name: "Quick Links",
    slug: "quick-links",
    items: [
      { id: 10, title: "Home", url: "/", order: 1, parent_id: null, menu_id: "2", page_id: "1", children: [], page: { id: 1, slug: "/" } },
      { id: 11, title: "Quizzes", url: "/quizzes", order: 2, parent_id: null, menu_id: "2", page_id: "2", children: [], page: { id: 2, slug: "quizzes" } },
      { id: 12, title: "Contests", url: "/contests", order: 3, parent_id: null, menu_id: "2", page_id: "3", children: [], page: { id: 3, slug: "contests" } },
      { id: 13, title: "Top Players", url: "/top-players", order: 4, parent_id: null, menu_id: "2", page_id: "4", children: [], page: { id: 4, slug: "top-players" } },
    ],
  },
  {
    id: 3,
    name: "Resources Menu",
    slug: "resources-menu",
    items: [
      { id: 20, title: "About Us", url: "/about-us", order: 1, parent_id: null, menu_id: "3", page_id: "5", children: [], page: { id: 5, slug: "about-us" } },
      { id: 21, title: "Contact Us", url: "/contact-us", order: 2, parent_id: null, menu_id: "3", page_id: "6", children: [], page: { id: 6, slug: "contact-us" } },
      { id: 22, title: "Privacy Policy", url: "/privacy-policy", order: 3, parent_id: null, menu_id: "3", page_id: "7", children: [], page: { id: 7, slug: "privacy-policy" } },
      { id: 23, title: "Terms & Conditions", url: "/terms-conditions", order: 4, parent_id: null, menu_id: "3", page_id: "8", children: [], page: { id: 8, slug: "terms-conditions" } },
    ],
  },
];
