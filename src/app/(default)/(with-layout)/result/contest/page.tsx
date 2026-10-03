/** @format */

"use client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { ContestResultResponseType } from "@/types/contest";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const ResultPreview = dynamic(() => import("../ResultPreview"), {
  ssr: false,
});

const PageNotFound = dynamic(() => import("@/components/ui/PageNotFound"), {
  ssr: false,
});

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

export default function ContestResultPage() {
  const searchParams = useSearchParams();
  const contest = searchParams.get("contest");
  const username = searchParams.get("username");

  const { data, isLoading } = useGetQuery<ContestResultResponseType>({
    isPublic: false,
    url: `/${contest}/contest/${username}/result`,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!data || data?.answers?.length === 0) {
    return (
      <PageNotFound
        title="Result not found!"
        message="The result you are looking for does not exist."
      />
    );
  }
  return (
    <ResultPreview
      answers={data?.answers}
      user={data?.user}
      previewUrl={`/result/contest/preview?contest=${contest}&username=${username}`}
    />
  );
}
