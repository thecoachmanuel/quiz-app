"use client";
import Wordling from "@/components/games/wordling/Wordling";
import { useSearchParams } from "next/navigation";

const WordlinkPage = () => {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game_id") || "";
  const gameDate = searchParams.get("game_date") || "";
  const gameType = searchParams.get("game_type") || "wordling_main";
  return (
    <Wordling
      gameId={gameId}
      gameDate={gameDate}
      gameType={gameType}
      path={"wordling"}
      title="Wordling"
    />
  );
};

export default WordlinkPage;
