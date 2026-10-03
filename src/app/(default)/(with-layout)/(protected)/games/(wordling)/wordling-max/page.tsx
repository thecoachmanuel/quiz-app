"use client";
import Wordling from "@/components/games/wordling/Wordling";
import { useSearchParams } from "next/navigation";

const WordlinkMaxPage = () => {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game_id") || "";
  const gameDate = searchParams.get("game_date") || "";
  const gameType = searchParams.get("game_type") || "wordling_max";
  return (
    <Wordling
      gameId={gameId}
      gameDate={gameDate}
      gameType={gameType}
      path={"wordling-max"}
      title="Wordling Max"
    />
  );
};

export default WordlinkMaxPage;
