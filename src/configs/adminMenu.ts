/** @format */

export interface AdminMenuItem {
  title: string;
  icon?: string;
  href?: string;
  parent?: string;
  parentMenu?: boolean;
  submenus?: AdminMenuItem[];
}

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "ph ph-house",
  },
  {
    title: "Manage Users",
    icon: "ph ph-users-three",
    parent: "admin/users",
    parentMenu: true,
    submenus: [
      { title: "Users", href: "/admin/users" },
      { title: "Send Notification", href: "/admin/users/notifications" },
    ],
  },
  {
    title: "Manage Quizzes",
    icon: "ph ph-question-mark",
    parent: "admin/quizzes",
    parentMenu: true,
    submenus: [
      { title: "Category", href: "/admin/quizzes/categories" },
      { title: "Level", href: "/admin/quizzes/levels" },
      { title: "Quizzes", href: "/admin/quizzes" },
    ],
  },
  {
    title: "Manage Contests",
    icon: "ph ph-seal-question",
    parent: "admin/contests",
    parentMenu: true,
    submenus: [
      { title: "Category", href: "/admin/contests/categories" },
      { title: "Contests", href: "/admin/contests" },
      { title: "Winners", href: "/admin/contests/winners" },
    ],
  },
  {
    title: "Manage Games",
    icon: "ph ph-game-controller",
    parent: "admin/games",
    parentMenu: true,
    submenus: [
      { title: "Wordling Game List", href: "/admin/games/wordling" },
      { title: "Hexling Game List", href: "/admin/games/hexling" },
      { title: "Badges", href: "/admin/games/badges" },
    ],
  },
  {
    title: "Badges",
    href: "/admin/badges",
    icon: "ph ph-shield-check",
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: "ph ph-currency-circle-dollar",
  },
  {
    title: "Deposits",
    href: "/admin/deposits",
    icon: "ph ph-bank",
  },
  {
    title: "Withdrawals",
    href: "/admin/withdrawals",
    icon: "ph ph-wallet",
  },
  {
    title: "Contact",
    href: "/admin/contacts",
    icon: "ph ph-address-book",
  },
  {
    title: "Subscription",
    href: "/admin/subscriptions",
    icon: "ph ph-unite-square",
  },
  {
    title: "Support Tickets",
    href: "/admin/support-tickets",
    icon: "ph ph-ticket",
  },
  {
    title: "Admin Users",
    icon: "ph ph-users",
    parent: "admin/admins",
    parentMenu: true,
    submenus: [
      { title: "Roles", href: "/admin/admins/roles" },
      { title: "Admin Users", href: "/admin/admins" },
    ],
  },
  {
    title: "Reports",
    icon: "ph ph-microsoft-excel-logo",
    parent: "admin/reports",
    parentMenu: true,
    submenus: [
      { title: "Quiz", href: "/admin/reports/quizzes" },
      { title: "Contests", href: "/admin/reports/contests" },
      { title: "Contest Participants", href: "/admin/reports/contest-participants" },
      { title: "Transactions", href: "/admin/reports/transactions" },
      { title: "Buy Coins", href: "/admin/reports/buy-coins" },
      { title: "Withdrawals", href: "/admin/reports/withdrawals" },
      { title: "Login Log", href: "/admin/reports/login-log" },
    ],
  },
  {
    title: "Settings",
    icon: "ph ph-gear",
    parent: "admin/settings",
    parentMenu: true,
    submenus: [
      {
        title: "System Settings",
        parent: "system",
        submenus: [
          { title: "General Settings", href: "/admin/settings/general" },
          { title: "System Configuration", href: "/admin/settings/system-configuration" },
          { title: "Cron Job Settings", href: "/admin/settings/cron-jobs" },
          { title: "Maintenance Mode", href: "/admin/settings/maintenance" },
          { title: "GDPR Cookie", href: "/admin/settings/gdpr-cookie" },
        ],
      },
      {
        title: "Finance Settings",
        parent: "finance",
        submenus: [
          { title: "Currency", href: "/admin/settings/currency" },
          { title: "Payment Gateways", href: "/admin/settings/payment-gateways" },
          { title: "Withdrawal Methods", href: "/admin/settings/withdrawal-methods" },
        ],
      },
      {
        title: "User Settings",
        parent: "user-settings",
        submenus: [
          { title: "Notification Settings", href: "/admin/settings/notifications" },
          { title: "KYC Setting", href: "/admin/settings/kyc" },
          { title: "Social Login Settings", href: "/admin/settings/social-login" },
        ],
      },
      {
        title: "Quiz Settings",
        parent: "quiz-settings",
        submenus: [
          { title: "Coin Settings", href: "/admin/settings/coin-settings" },
          { title: "Ranking Settings", href: "/admin/settings/ranking-settings" },
        ],
      },
      {
        title: "SEO & Meta",
        parent: "seo",
        submenus: [
          { title: "SEO Configuration", href: "/admin/settings/seo" },
          { title: "Sitemap XML", href: "/admin/settings/sitemap" },
          { title: "Robots TXT", href: "/admin/settings/robots" },
        ],
      },
      {
        title: "Theme Settings",
        parent: "theme",
        submenus: [
          { title: "Manage Frontend", href: "/admin/settings/frontend" },
          { title: "Manage Pages", href: "/admin/settings/pages" },
          { title: "Logo and Favicon", href: "/admin/settings/logo-favicon" },
          { title: "PWA", href: "/admin/settings/pwa" },
          { title: "Custom CSS", href: "/admin/settings/custom-css" },
        ],
      },
      {
        title: "Integration Settings",
        parent: "integration",
        submenus: [
          { title: "Services Settings", href: "/admin/settings/services" },
          { title: "AI Integration Settings", href: "/admin/settings/ai-settings" },
          { title: "Extensions", href: "/admin/settings/extensions" },
          { title: "Ads", href: "/admin/settings/ads" },
        ],
      },
      {
        title: "Localization",
        parent: "localization",
        submenus: [
          { title: "Language", href: "/admin/settings/languages" },
          { title: "Social Medias", href: "/admin/settings/social-medias" },
        ],
      },
      {
        title: "Navigation",
        parent: "navigation",
        submenus: [
          { title: "Menu", href: "/admin/settings/menu" },
        ],
      },
    ],
  },
  {
    title: "Extras",
    icon: "ph ph-aperture",
    parent: "admin/extras",
    parentMenu: true,
    submenus: [
      { title: "App Info", href: "/admin/extras/app-info" },
      { title: "Update", href: "/admin/extras/update" },
    ],
  },
];
