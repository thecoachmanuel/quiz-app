"use client";

import { Button } from "@/components/ui/Button";
import { CrownIcon, VaultIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useModalStore } from "../providers/modal/modal-provider";
import ResultsDialog from "./results-dialog";

export function ResultsButton({ gameDate }: { gameDate: string }) {
  const { isOpen, onOpenChange } = useModalStore((state) => state);

  return (
    <div className="flex items-center gap-1.5">
      <ResultsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        gameDate={gameDate}
      />
      <Button
        variant="outline"
        onClick={() => {
          onOpenChange(true);
        }}
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
      >
        <CrownIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="inline-block">Stats</span>
        <span className="sr-only">Stats</span>
      </Button>
      <Button
        variant="outline"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        title="Play previous games"
      >
        <Link
          href="/games/hexling/vault"
          prefetch={false}
          className="flex items-center gap-1.5"
        >
          <VaultIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="inline-block">Vault</span>
          <span className="sr-only">Vault</span>
        </Link>
      </Button>
    </div>
  );
}
