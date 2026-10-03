"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { LightbulbIcon } from "@phosphor-icons/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useEffectEvent, useState } from "react";
export default function HintTooltip({ hint }: { hint: string }) {
  const { tran } = useTranslations();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSetMobile = useEffectEvent((v: boolean) => {
    setIsMobile(v);
  });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      handleSetMobile(true);
    }
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setOpen((prev) => !prev);
    }
  };
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root
        open={isMobile ? open : undefined}
        onOpenChange={(v) => {
          if (!isMobile) setOpen(v);
        }}
      >
        <Tooltip.Trigger asChild>
          <button
            onClick={handleClick}
            className="flex items-center gap-1 rounded-sm py-2.5 font-medium text-yellow-600 sm:px-8"
          >
            <LightbulbIcon />
            {tran("Hint")}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="shadow-lg" sideOffset={5}>
            <div className="border-primary/20 max-h-[250px] w-[250px] overflow-y-auto rounded-md border bg-white p-3 text-center">
              <p className="pb-3">{hint}</p>
            </div>
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
