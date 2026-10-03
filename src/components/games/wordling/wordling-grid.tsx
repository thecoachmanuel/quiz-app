"use client";

import { cn } from "@/utils/cn";
import { Skeleton } from "./skeleton";
import { UserSubmissions } from "./Wordling";

export default function WordlingGrid({
  maxAttempts = 6,
  wordLen = 5,
  currTurn,
  currentTurnData,
  status = "",
  disabled,
  data,
  isLoadingWordling,
}: {
  maxAttempts: number;
  wordLen: number;
  data: UserSubmissions;
  currentTurnData: "" | string[];
  currTurn: number;
  status?: string;
  disabled?: boolean;
  isLoadingWordling?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: maxAttempts }, (_, i) => (
          <div className="flex gap-2" key={i}>
            {Array.from({ length: wordLen }, (_, j) =>
              isLoadingWordling ? (
                <Skeleton
                  key={`${i}-${j}`}
                  className="size-[35px] rounded-lg md:size-[45px]"
                />
              ) : (
                <div
                  key={`${i}-${j}`}
                  className="bg-dark5 relative size-[35px] overflow-hidden rounded-lg md:size-[45px]"
                >
                  <div
                    className={cn(
                      "bg-destructive ease-in-out-expo absolute inset-0 flex size-[35px] translate-y-[-35px] items-center justify-center transition-transform duration-200 md:size-[45px] md:translate-y-[-45px]",
                      {
                        "translate-y-0 md:translate-y-0":
                          !!status?.[i * wordLen + j],
                        "bg-cell-incorrect inverted-colors:bg-slate-800":
                          data?.[i]?.[j]?.status === "absent",
                        "bg-cell-partial inverted-colors:bg-yellow-500":
                          data?.[i]?.[j]?.status === "present",
                        "bg-cell-correct inverted-colors:bg-blue-500":
                          data?.[i]?.[j]?.status === "correct",
                      },
                    )}
                  />

                  {!disabled && (
                    <div
                      className={cn(
                        "ease-in-out-expo bg-primary/10 absolute inset-0 flex size-[35px] translate-y-[-35px] items-center justify-center text-2xl font-bold uppercase transition-transform duration-200 select-none md:size-[45px] md:translate-y-[-45px] md:text-3xl",
                        {
                          "translate-y-0 delay-[20ms] md:translate-y-0":
                            currTurn === i,
                          "translate-y-[35px] md:translate-y-[45px]":
                            i < currTurn,
                        },
                      )}
                    >
                      {currentTurnData?.[j]}
                    </div>
                  )}

                  <div
                    className={cn(
                      "text-light4/90 absolute flex size-[35px] items-center justify-center md:size-[45px]",
                      {
                        "bg-cell-incorrect text-white inverted-colors:bg-slate-800":
                          data?.[i]?.[j]?.status === "absent",
                        "bg-cell-partial inverted-colors:bg-yellow-500":
                          data?.[i]?.[j]?.status === "present",
                        "bg-cell-correct inverted-colors:bg-blue-500":
                          data?.[i]?.[j]?.status === "correct",
                      },
                    )}
                  >
                    <p
                      className={cn(
                        "text-2xl font-bold uppercase select-none md:text-3xl",
                      )}
                    >
                      {data?.[i]?.[j]?.letter}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
