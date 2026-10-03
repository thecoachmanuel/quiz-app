"use client";
import ImageLoader from "@/components/ui/ImageLoader";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AuthStore } from "@/stores/auth";
import { AppInfoType } from "@/types";

const RightBar = () => {
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore(
    (state: AuthStore) => state,
  );

  const authImage =
    appInfo?.application_info?.auth_left_sidebar_image || "/auth-illus.png";

  const description =
    appInfo?.application_info?.company_info?.description ||
    "AI Quiz & Trivia Gaming Platform";

  return (
    <div className="relative flex items-center justify-center overflow-hidden px-8 max-lg:hidden bg-gradient-to-br from-violet-900/10 via-amber-500/5 to-purple-900/10">
      <div className="bg-secondary/30 absolute -top-10 left-0 size-[345px] rounded-full blur-[200px] xl:-left-20 pointer-events-none"></div>
      <div className="bg-secondary/30 absolute -bottom-10 -left-20 size-[345px] rounded-full blur-[200px] pointer-events-none"></div>
      <div className="bg-secondary/30 absolute -top-10 right-0 size-[375px] rounded-full blur-[200px] xl:-right-20 pointer-events-none"></div>
      <ImageLoader
        src={authImage}
        alt={description}
        width={532}
        height={550}
        className="object-contain max-h-[550px] w-auto relative z-10 drop-shadow-2xl"
        priority
      />
    </div>
  );
};

export default RightBar;
