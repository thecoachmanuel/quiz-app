"use client";
import VaultMonthlyCalendar from "@/components/games/vault/vault-monthly-calendar";
import { useSearchParams } from "next/navigation";

export default function WordlingMainVaultPage() {
  const searchParams = useSearchParams();
  const gameType = searchParams.get("game_type") || "wordling_min";
  return (
    <div className="mx-auto w-full max-w-prose">
      <VaultMonthlyCalendar
        gameType={gameType}
        path={"wordling-min"}
        title="Wordling Mini Vault"
      />
    </div>
  );
}
