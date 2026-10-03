/** @format */
import { AppInfoType, PageType } from "@/types";
import { MenuGroup } from "@/types/menu";

export const DEFAULT_PAGES: PageType[] = [
  {
    id: 1,
    title: "Home",
    slug: "/",
    sections: [
      {
        id: 1,
        title: "Home Hero",
        slug: "home-hero",
        content: {
          image: "/hero-img.png",
          title: "Test Your Knowledge",
          "text-slider": [
            "Math Quiz",
            "Science Quiz",
            "History Quiz",
            "Tech Quiz",
            "Trivia Challenge",
          ],
          button: {
            text: "Get Started",
            link: "/quizzes",
          },
        } as any,
      },
      {
        id: 2,
        title: "How It Works",
        slug: "how-it-works",
        content: {
          title: "How It Works",
          description:
            "Create an account, explore quizzes, test your knowledge, and track your progress effortlessly.",
          steps: [
            {
              image: "/how-it-woks-illus-1.png",
              title: "Sign Up",
              description:
                "Sign up easily and securely to start your quiz journey.",
            },
            {
              image: "/how-it-woks-illus-2.png",
              title: "Choose A Quiz",
              description:
                "Explore and choose from a wide range of exciting and diverse categories available for you.",
            },
            {
              image: "/how-it-woks-illus-3.png",
              title: "Check Your Score",
              description:
                "Test your knowledge and see how you rank. Check your score now and improve!",
            },
          ],
        } as any,
      },
      {
        id: 3,
        title: "Three Quizzes",
        slug: "three-quizzes",
        content: {
          title: "Top Quizzes",
          description: "Showing some top quizzes with title and description.",
        } as any,
      },
      {
        id: 4,
        title: "Unique Quiz Features",
        slug: "unique-quiz-features",
        content: {
          title: "Unique Quiz Features",
          description:
            "Packed with modern features for an incredible learning experience.",
          features: [
            {
              title: "Interactive Quizzes",
              description:
                "Engaging quiz formats with timers, leaderboards, and instant feedback.",
            },
            {
              title: "Exciting Contests",
              description:
                "Compete in live timed contests with cash prizes and global rankings.",
            },
          ],
        } as any,
      },
      {
        id: 5,
        title: "Upcoming Contests",
        slug: "upcoming-contests",
        content: {
          title: "Upcoming Contests",
          description:
            "Showing some upcoming contests with title and description.",
        } as any,
      },
      {
        id: 6,
        title: "The Journey",
        slug: "the-journey",
        content: {
          title: "Our Journey",
          description:
            "From a simple trivia platform to an AI-powered global community.",
          "tab-data": [
            {
              title: "Mission",
              description:
                "Empowering learners of all ages through interactive quizzes.",
            },
            {
              title: "Vision",
              description:
                "Building the world's most engaging gamified knowledge platform.",
            },
          ],
          features: [
            "Global Competitions",
            "Adaptive Difficulty",
            "Instant Rewards",
            "Real-Time Tracking",
          ],
        } as any,
      },
      {
        id: 7,
        title: "Testimonials",
        slug: "testimonials",
        content: {
          title: "What Our Users Say",
          sub_title: "Testimonials",
          description: "Discover why users love our quizzes.",
          limit: 6,
        } as any,
      },
      {
        id: 8,
        title: "Counter Section",
        slug: "counter-section",
        content: {
          list: [
            { value: "50000", unit: "+", title: "Active Players" },
            { value: "120000", unit: "+", title: "Quizzes Completed" },
            { value: "3500", unit: "+", title: "Daily Contests" },
            { value: "99", unit: "%", title: "Satisfaction Rate" },
          ],
        } as any,
      },
      {
        id: 9,
        title: "Subscribe Section",
        slug: "subscribe-section",
        content: {
          title: "Stay Updated",
          description:
            "Subscribe to our newsletter for new quiz releases and contest alerts.",
        } as any,
      },
      { id: 10, title: "Footer", slug: "footer", content: {} as any },
    ],
  },
  {
    id: 2,
    title: "Quizzes",
    slug: "quizzes",
    sections: [
      { id: 20, title: "Footer", slug: "footer", content: {} as any },
    ],
  },
  {
    id: 3,
    title: "Contests",
    slug: "contests",
    sections: [
      { id: 30, title: "Footer", slug: "footer", content: {} as any },
    ],
  },
  {
    id: 4,
    title: "Top Players",
    slug: "top-players",
    sections: [
      { id: 40, title: "Footer", slug: "footer", content: {} as any },
    ],
  },
  {
    id: 5,
    title: "About Us",
    slug: "about-us",
    sections: [
      {
        id: 50,
        title: "The Journey",
        slug: "the-journey",
        content: {
          title: "Our Journey",
          description:
            "From a simple trivia platform to an AI-powered global community.",
          "tab-data": [
            {
              title: "Mission",
              description:
                "Empowering learners of all ages through interactive quizzes.",
            },
            {
              title: "Vision",
              description:
                "Building the world's most engaging gamified knowledge platform.",
            },
          ],
          features: [
            "Global Competitions",
            "Adaptive Difficulty",
            "Instant Rewards",
            "Real-Time Tracking",
          ],
        } as any,
      },
      { id: 51, title: "FAQ", slug: "faq-section", content: {} as any },
      {
        id: 52,
        title: "Testimonials",
        slug: "testimonials",
        content: {} as any,
      },
      { id: 53, title: "Top Players", slug: "top-players", content: {} as any },
      { id: 54, title: "Footer", slug: "footer", content: {} as any },
    ],
  },
  {
    id: 6,
    title: "Contact Us",
    slug: "contact-us",
    sections: [
      { id: 60, title: "Contact Us", slug: "contact-us", content: {} as any },
      { id: 61, title: "Contact Form", slug: "contact-form", content: {} as any },
      { id: 62, title: "Footer", slug: "footer", content: {} as any },
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
      {
        id: 1,
        title: "Home",
        url: "/",
        order: 1,
        parent_id: null,
        menu_id: "1",
        page_id: "1",
        children: [],
        page: { id: 1, slug: "/" },
      },
      {
        id: 2,
        title: "Quizzes",
        url: "/quizzes",
        order: 2,
        parent_id: null,
        menu_id: "1",
        page_id: "2",
        children: [],
        page: { id: 2, slug: "quizzes" },
      },
      {
        id: 3,
        title: "Contests",
        url: "/contests",
        order: 3,
        parent_id: null,
        menu_id: "1",
        page_id: "3",
        children: [],
        page: { id: 3, slug: "contests" },
      },
      {
        id: 4,
        title: "Leaderboard",
        url: "/top-players",
        order: 4,
        parent_id: null,
        menu_id: "1",
        page_id: "4",
        children: [],
        page: { id: 4, slug: "top-players" },
      },
      {
        id: 5,
        title: "About Us",
        url: "/about-us",
        order: 5,
        parent_id: null,
        menu_id: "1",
        page_id: "5",
        children: [],
        page: { id: 5, slug: "about-us" },
      },
      {
        id: 6,
        title: "Contact",
        url: "/contact-us",
        order: 6,
        parent_id: null,
        menu_id: "1",
        page_id: "6",
        children: [],
        page: { id: 6, slug: "contact-us" },
      },
    ],
  },
  {
    id: 2,
    name: "Quick Links",
    slug: "quick-links",
    items: [
      {
        id: 10,
        title: "Home",
        url: "/",
        order: 1,
        parent_id: null,
        menu_id: "2",
        page_id: "1",
        children: [],
        page: { id: 1, slug: "/" },
      },
      {
        id: 11,
        title: "Quizzes",
        url: "/quizzes",
        order: 2,
        parent_id: null,
        menu_id: "2",
        page_id: "2",
        children: [],
        page: { id: 2, slug: "quizzes" },
      },
      {
        id: 12,
        title: "Contests",
        url: "/contests",
        order: 3,
        parent_id: null,
        menu_id: "2",
        page_id: "3",
        children: [],
        page: { id: 3, slug: "contests" },
      },
      {
        id: 13,
        title: "Top Players",
        url: "/top-players",
        order: 4,
        parent_id: null,
        menu_id: "2",
        page_id: "4",
        children: [],
        page: { id: 4, slug: "top-players" },
      },
    ],
  },
  {
    id: 3,
    name: "Resources Menu",
    slug: "resources-menu",
    items: [
      {
        id: 20,
        title: "About Us",
        url: "/about-us",
        order: 1,
        parent_id: null,
        menu_id: "3",
        page_id: "5",
        children: [],
        page: { id: 5, slug: "about-us" },
      },
      {
        id: 21,
        title: "Contact Us",
        url: "/contact-us",
        order: 2,
        parent_id: null,
        menu_id: "3",
        page_id: "6",
        children: [],
        page: { id: 6, slug: "contact-us" },
      },
      {
        id: 22,
        title: "Privacy Policy",
        url: "/privacy-policy",
        order: 3,
        parent_id: null,
        menu_id: "3",
        page_id: "7",
        children: [],
        page: { id: 7, slug: "privacy-policy" },
      },
      {
        id: 23,
        title: "Terms & Conditions",
        url: "/terms-conditions",
        order: 4,
        parent_id: null,
        menu_id: "3",
        page_id: "8",
        children: [],
        page: { id: 8, slug: "terms-conditions" },
      },
    ],
  },
];
