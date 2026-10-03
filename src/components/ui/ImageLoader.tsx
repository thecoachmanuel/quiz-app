/** @format */

"use client";
import placeholderImage from "@/../public/placeholder-image.png";
import { cn } from "@/utils/cn";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

interface Props {
  src?: string | StaticImageData | null;
  alt?: string | null;
  width?: number;
  height?: number;
  user?: any;
  className?: string;
  priority?: boolean;
  withSkeleton?: boolean;
}

export default function ImageLoader({
  src,
  alt,
  width,
  height,
  user,
  className,
  priority = false,
  withSkeleton = false,
}: Readonly<Props>) {
  const [hasError, setHasError] = useState(false);

  const userName = user?.full_name || user?.name || null;
  const avatarUrl = userName
    ? `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`
    : placeholderImage;

  // Determine if provided src is a valid non-empty string or StaticImageData object
  const isValidSrc =
    (typeof src === "string" && src.trim() !== "") ||
    (typeof src === "object" && src !== null);

  const displayImage = hasError || !isValidSrc ? avatarUrl : (src || placeholderImage);

  const isSvg =
    typeof displayImage === "string" &&
    (displayImage.endsWith(".svg") || displayImage.includes(".svg"));

  return (
    <Image
      alt={alt ?? "image"}
      src={displayImage}
      width={width}
      height={height}
      className={cn("object-contain", className)}
      onError={() => setHasError(true)}
      quality={100}
      priority={priority}
      unoptimized={isSvg}
    />
  );
}
