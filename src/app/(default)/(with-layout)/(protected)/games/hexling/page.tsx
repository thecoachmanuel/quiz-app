"use client";
import { HexStoreProvider } from "@/components/games/hexling/hex-store-provider";
import Hexling from "@/components/games/hexling/Hexling";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useSearchParams } from "next/navigation";

const HexlingPage = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("game_date") || "";

  const { data: userSubmissionData, isLoading: isLoadingHexlingSubmissions } =
    useGetQuery({
      url: `/games/hexling/user-submissions${date ? `?game_date=${date}` : ""}`,
    });

  if (isLoadingHexlingSubmissions) {
    return null;
  }

  const rootWord = userSubmissionData?.hexling_word?.root_word;
  const centerLetter = userSubmissionData?.hexling_word?.center_letter;

  const letters = rootWord
    ? Array.from(new Set(rootWord.split(""))).filter(
        (letter) => letter !== centerLetter,
      )
    : [];

  return (
    <HexStoreProvider
      initialState={{
        letters: letters as string[],
      }}
    >
      <div className="relative">
        <div className="flex flex-col justify-between gap-8">
          <Hexling
            centerLetter={centerLetter}
            userSubmissionData={userSubmissionData}
            isLoadingHexlingSubmissions={isLoadingHexlingSubmissions}
            date={date}
          />
        </div>
      </div>
    </HexStoreProvider>
  );
};

export default HexlingPage;
