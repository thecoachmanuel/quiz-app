/** @format */

"use client";
import Loader from "@/components/ui/Loader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import BadgesList from "./BadgeList";

import { useBadgeStore } from "@/stores/badgeStore";

export default function BadgesPage() {
  const { tran } = useTranslations();
  const { data: apiBadges, isLoading } = useGetQuery({
    url: `/profile/badges`,
  });

  const getFrontendBadges = useBadgeStore((state) => state.getFrontendBadges);
  const storeBadges = getFrontendBadges();
  const badges = apiBadges && apiBadges.length > 0 ? apiBadges : storeBadges;

  if (isLoading && !badges?.length) return <Loader />;

  return (
    <div className="bg-primary/5 rounded-xl p-2 sm:p-6">
      <h3 className="heading-3 !font-medium">{tran("Badges")}</h3>
      <div className="flex flex-col gap-6 pt-6">
        <div className="border-primary/10 rounded-xl border bg-white p-2 sm:p-6">
          <BadgesList badges={badges} tran={tran} />
        </div>
      </div>
    </div>
  );
}
