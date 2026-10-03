import { useCallback } from "react";
import { useGetQuery } from "./mutate/useGetQuery";

export default function useAdsQuery() {
  const { data: ADDS, isLoading } = useGetQuery({
    isPublic: true,
    url: `get-ads`,
  });

  const getAds = useCallback(
    (type: string) => {
      return ADDS?.length
        ? ADDS?.find((ad: any) => ad.position === type)
        : null;
    },
    [ADDS],
  );

  return { ADDS, isLoading, getAds };
}
