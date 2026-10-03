/** @format */

"use client";
import placeholderImage from "@/../public/placeholder-image.png";
import { cn } from "@/utils/cn";
import Image, { StaticImageData } from "next/image";
import { useEffect, useEffectEvent, useState } from "react";

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
  withSkeleton = true,
}: Readonly<Props>) {
  const [mounted, setMounted] = useState(false);
  const [fallbackImage, setFallbackImage] = useState<
    string | StaticImageData | null
  >(null);

  const handleSetMounted = useEffectEvent(() => {
    setMounted(true);
  });

  useEffect(() => {
    handleSetMounted();
  }, []);

  const userName = user?.full_name || user?.name || null;
  const avatarUrl = userName
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`
    : placeholderImage;

  const displayImage = fallbackImage || src || avatarUrl;

  return (
    <>
      {mounted ? (
        <Image
          alt={alt ?? "image"}
          src={displayImage}
          width={width}
          height={height}
          className={cn(className, "object-cover")}
          onError={() => setFallbackImage(avatarUrl)}
          quality={100}
          priority={priority}
        />
      ) : (
        <Skeleton withSkeleton={withSkeleton} width={width} height={height} />
      )}
    </>
  );
}

const Skeleton = ({
  withSkeleton,
  width,
  height,
}: {
  withSkeleton: boolean;
  width?: number;
  height?: number;
}) => {
  if (!withSkeleton) return null;

  return (
    <div
      className="image-skeleton animate-pulse rounded-md bg-gray-200"
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
      }}
    />
  );
};
