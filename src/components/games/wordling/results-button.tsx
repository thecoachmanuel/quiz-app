"use client";

import { Button } from "@/components/ui/Button";
import { MedalIcon, VaultIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useModalStore } from "../providers/modal/modal-provider";
import ResultsDialog from "./results-dialog";

export function ResultsButton({
  userSubmissionData,
  path,
  gameType,
  gameDate,
}: {
  userSubmissionData: any;
  path: string;
  gameType: string;
  gameDate?: string;
}) {
  const { isOpen, onOpenChange } = useModalStore((state) => state);

  return (
    <>
      <ResultsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        userSubmissionData={userSubmissionData}
        gameType={gameType}
        gameDate={gameDate}
      />
      <Button
        variant="outline"
        onClick={() => {
          onOpenChange(true);
        }}
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
      >
        <MedalIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="inline-block">Results</span>
        <span className="sr-only">Open Results Button</span>
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        title="Play previous games"
      >
        <Link
          href={`/games/${path}/vault`}
          className="flex items-center justify-center gap-1.5"
        >
          <VaultIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="inline-block">Vault</span>
          <span className="sr-only">Vault</span>
        </Link>
      </Button>
    </>
  );
}
