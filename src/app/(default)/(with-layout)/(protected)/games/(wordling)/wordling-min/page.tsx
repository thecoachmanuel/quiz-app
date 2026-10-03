"use client";
import Wordling from "@/components/games/wordling/Wordling";
import { useSearchParams } from "next/navigation";

const WordlinkMinPage = () => {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game_id") || "";
  const gameDate = searchParams.get("game_date") || "";
  const gameType = searchParams.get("game_type") || "wordling_min";
  return (
    <Wordling
      gameId={gameId}
      gameDate={gameDate}
      gameType={gameType}
      path={"wordling-min"}
      title="Wordling Min"
    />
  );
};

export default WordlinkMinPage;
