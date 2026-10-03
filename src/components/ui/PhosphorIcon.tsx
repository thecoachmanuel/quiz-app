// components/PhosphorIcon.tsx
import * as PhosphorIcons from "@phosphor-icons/react";
import { IconProps } from "@phosphor-icons/react";
import React from "react";

// Define weight mapping once
const weightMap = {
  fill: "fill",
  bold: "bold",
  light: "light",
  thin: "thin",
  duotone: "duotone",
  regular: "regular",
} as const;

type WeightType = keyof typeof weightMap;

interface PhosphorIconProps extends Omit<IconProps, "weight"> {
  iconName: string;
  size?: number;
  color?: string;
  className?: string;
  weight?: WeightType;
}

// Map common icon nicknames / brands directly to Phosphor icon names
const ICON_ALIASES: Record<string, string> = {
  facebook: "FacebookLogo",
  facebooklogo: "FacebookLogo",
  fb: "FacebookLogo",
  twitter: "TwitterLogo",
  twitterlogo: "TwitterLogo",
  x: "XLogo",
  xlogo: "XLogo",
  instagram: "InstagramLogo",
  instagramlogo: "InstagramLogo",
  linkedin: "LinkedinLogo",
  linkedinlogo: "LinkedinLogo",
  youtube: "YoutubeLogo",
  youtubelogo: "YoutubeLogo",
  github: "GithubLogo",
  githublogo: "GithubLogo",
  discord: "DiscordLogo",
  tiktok: "TiktokLogo",
  telegram: "TelegramLogo",
  whatsapp: "WhatsappLogo",
  phone: "PhoneCall",
  phonecall: "PhoneCall",
  email: "Envelope",
  mail: "Envelope",
  chat: "Chats",
  chats: "Chats",
  location: "MapPin",
  map: "MapPin",
  mappin: "MapPin",
};

const PhosphorIcon: React.FC<PhosphorIconProps> = ({
  iconName,
  size = 24,
  color,
  className,
  weight: propWeight,
  ...props
}) => {
  if (!iconName || typeof iconName !== "string") {
    iconName = "Globe";
  }

  // 1. Direct match on PhosphorIcons
  let IconComponent = (PhosphorIcons as any)[iconName];

  // 2. Strip "ph-" or "ph:" prefix
  if (!IconComponent) {
    const stripped = iconName.replace(/^ph[-:]/, "");
    IconComponent = (PhosphorIcons as any)[stripped];
  }

  // 3. Check alias mapping (e.g. "FacebookLogo", "facebook", "twitter")
  if (!IconComponent) {
    const key = iconName
      .toLowerCase()
      .replace(/^ph[-:]/, "")
      .replace(/[-_\s]/g, "");
    const alias = ICON_ALIASES[key];
    if (alias && (PhosphorIcons as any)[alias]) {
      IconComponent = (PhosphorIcons as any)[alias];
    }
  }

  // 4. Kebab/snake case to PascalCase (e.g. "facebook-logo" -> "FacebookLogo")
  if (!IconComponent) {
    const pascal = iconName
      .replace(/^ph[-:]/, "")
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");
    IconComponent = (PhosphorIcons as any)[pascal];
  }

  // 5. Fallback to case-insensitive key search on PhosphorIcons
  if (!IconComponent) {
    const rawClean = iconName
      .toLowerCase()
      .replace(/^ph[-:]/, "")
      .replace(/[-_\s]/g, "");
    const foundKey = Object.keys(PhosphorIcons).find(
      (k) =>
        k.toLowerCase() === rawClean ||
        k.toLowerCase() === rawClean + "logo" ||
        k.toLowerCase() === rawClean + "icon",
    );
    if (foundKey) {
      IconComponent = (PhosphorIcons as any)[foundKey];
    }
  }

  // 6. Safe fallback icon
  if (!IconComponent) {
    IconComponent =
      (PhosphorIcons as any)["Globe"] ||
      (PhosphorIcons as any)["Question"] ||
      (() => null);
  }

  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      weight={propWeight || "regular"}
      {...props}
    />
  );
};

export default PhosphorIcon;
