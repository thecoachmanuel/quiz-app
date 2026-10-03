"use client";

import { cn } from "@/utils/cn";
import { useMemo } from "react";
import { LetterStatusType, useKeyStatus } from "./useKeyStatus";
import { UserSubmissions } from "./Wordling";
import { Button } from "@/components/ui/Button";

const KEYBOARD_LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["#0", "a", "s", "d", "f", "g", "h", "j", "k", "l", "#1"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
] as const;

export default function Keyboard({
  onKeyClick,
  disabled,
  data,
}: {
  onKeyClick: (obj: { key: string }) => void;
  disabled?: boolean;
  data: UserSubmissions;
}) {
  const uniqueLetters = useKeyStatus(data);

  // Create a map for quick status lookup
  const keyStatusMap = useMemo(() => {
    const map = new Map<string, LetterStatusType>();
    uniqueLetters.forEach(({ letter, status }) => {
      map.set(letter, status);
    });
    return map;
  }, [uniqueLetters]);

  const getKeyStatus = (key: string): string => {
    if (key === "Enter" || key === "Backspace") return "";
    return keyStatusMap.get(key.toLowerCase()) || "";
  };

  const getKeyClassName = (key: string): string => {
    const status = getKeyStatus(key);
    switch (status) {
      case "correct":
        return "bg-green-500 text-white hover:bg-green-600";
      case "present":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "absent":
        return "bg-gray-500 text-white hover:bg-gray-600";
      default:
        return "bg-gray-200 text-black hover:bg-gray-300";
    }
  };

  return (
    <div className="sticky bottom-0 flex w-full items-center justify-center px-1.5 py-2 backdrop-blur-md md:py-4">
      <div className="flex w-full max-w-[500px] flex-col gap-2">
        {KEYBOARD_LAYOUT.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map((key, j) =>
              key.startsWith("#") ? (
                <div key={key} className="grow" />
              ) : (
                <Button
                  key={j}
                  variant="cell"
                  className={cn(
                    "text-light4/90 h-[58px] flex-1 flex-grow-2 p-0 font-black select-none max-sm:px-1 sm:max-w-[43px] sm:text-xl",
                    getKeyClassName(key),
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onKeyClick?.({ key });
                  }}
                  disabled={disabled}
                >
                  {key === "Enter"
                    ? "↵"
                    : key === "Backspace"
                      ? "⌫"
                      : key.toUpperCase()}
                </Button>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
