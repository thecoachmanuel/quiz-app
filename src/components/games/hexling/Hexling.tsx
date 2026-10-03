"use client";

import { getQueryClient } from "@/configs/query-client";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { cn } from "@/utils/cn";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";
import HexKeyboard from "./hex-keyboard";
import useHexStore from "./hooks/useHexStore";
import { ResultsButton } from "./results-button";
import ScoreTracker from "./score-tracker";
import WordListBar from "./word-list-bar";
import WordListCard from "./word-list-card";

export default function Hexling({
  centerLetter,
  userSubmissionData,
  isLoadingHexlingSubmissions,
  date,
}: {
  centerLetter: string;
  userSubmissionData: any;
  isLoadingHexlingSubmissions: boolean;
  date: string;
}) {
  const { inputWord, setInputWord, letters } = useHexStore((store) => store);
  const [animate, setAnimate] = useState("");
  const [lastScore, setLastScore] = useState(0);
  const [scorePosition, setScorePosition] = useState(45);

  function animateError() {
    setAnimate("error");
    setTimeout(() => {
      setAnimate("");
      setInputWord("");
    }, 400);
  }

  const { mutate } = useQueryMutation({
    isPublic: false,
    url: "games/hexling/check",
  });

  const handleSubmit = () => {
    mutate(
      {
        user_input_word: inputWord,
        game_date: date,
      },
      {
        onSuccess: (response: any) => {
          if (response?.data?.data?.word_points > 0) {
            setLastScore(response?.data?.data?.word_points);
            setScorePosition(Math.floor(Math.random() * 30) + 30);

            setAnimate("success");
            setTimeout(() => {
              setAnimate("");
              setInputWord("");
            }, 700);
          }

          getQueryClient().invalidateQueries({
            queryKey: [
              `/games/hexling/user-submissions${date ? `?game_date=${date}` : ""}`,
            ],
            exact: false,
          });

          setInputWord("");

          toast.success(response?.data?.data?.message);
        },
      },
    );
  };

  function submitAnswer() {
    setAnimate("");

    if (inputWord.length < 4) {
      toast.error("Word must be at least 4 letters long.", {
        position: "top-center",
        duration: 1000,
      });
      animateError();
      return;
    }

    if (!inputWord.includes(centerLetter!)) {
      toast.error("Word must include the center letter.", {
        position: "top-center",
        duration: 1000,
      });
      animateError();
      return;
    }

    handleSubmit();
  }

  function onKeyDown(event: KeyboardEvent | { key: string }) {
    if (animate) {
      return;
    }

    setAnimate("");

    if (event.key === "Backspace") {
      setInputWord((inputWord) => inputWord.slice(0, -1));
      return;
    }

    if (event.key === "Enter") {
      submitAnswer();
      return;
    }

    if (
      letters.includes(event.key.toLowerCase()) ||
      event.key.toLowerCase() === centerLetter
    ) {
      setInputWord((inputWord) => inputWord + event.key.toLowerCase());
      return;
    }

    if (event.key.length === 1) {
      setAnimate("error");
      setTimeout(() => {
        setAnimate("");
      }, 1500);
    }
  }

  useEventListener("keydown", onKeyDown);

  return (
    <div className="h-full w-full flex-1 lg:flex">
      <div className="h-full w-full py-6">
        <h3 className="mb-10 text-center text-2xl font-bold">Hexling</h3>
        <ScoreTracker userSubmissionData={userSubmissionData} />

        <WordListBar
          isLoading={isLoadingHexlingSubmissions}
          userSubmissionData={userSubmissionData}
        />

        <div className="relative mt-10 mb-8 flex min-h-[60px] flex-col items-center justify-center gap-1 md:gap-16">
          {animate === "success" && (
            <div
              style={{
                left: `${scorePosition}%`,
              }}
              className="animate-slide-out bg-secondary absolute top-0 z-10 flex size-8 min-w-8 items-center justify-center rounded-full"
            >
              <span className="text-lg font-bold text-white">+{lastScore}</span>
            </div>
          )}
          {inputWord?.length >= 9 ? (
            <span
              className={cn(
                "bg-primary dark:bg-primary/30 mx-auto flex w-fit items-center justify-center gap-0.5 rounded-md px-4 py-3 text-3xl font-bold",
                {
                  "text-2xl md:text-3xl": inputWord.length > 12,
                  "animate-wobble bg-red-400 transition-colors dark:bg-red-500":
                    animate === "error",
                  "animate-wiggle bg-green-400": animate === "success",
                },
              )}
            >
              {inputWord.split("").map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className={cn("opacity-80", {
                    "text-white": letter === centerLetter,
                  })}
                >
                  {letter.toUpperCase()}
                </span>
              ))}
            </span>
          ) : inputWord?.length ? (
            <div className="flex items-center justify-center gap-0.5">
              {inputWord?.split("").map((letter, index) => (
                <div
                  className={cn(
                    "bg-dark3 flex size-[40px] items-center justify-center rounded-lg md:size-[45px]",
                    {
                      "bg-secondary dark:bg-secondary": letter === centerLetter,
                      "animate-wobble bg-cell-incorrect transition-colors":
                        animate === "error",
                      "animate-wiggle bg-cell-correct transition-colors":
                        animate === "success",
                    },
                  )}
                  key={`${letter}-${index}`}
                >
                  <span className="text-2xl font-bold select-none md:text-3xl">
                    {letter.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : userSubmissionData?.hexling_play?.completed_at ? null : (
            <span className="text-light4/70 animate-pulse text-center text-4xl font-bold tracking-tight select-none">
              Type or Click
            </span>
          )}
        </div>

        <div className="flex w-full items-center justify-center">
          <HexKeyboard
            centerLetter={centerLetter}
            onSubmit={submitAnswer}
            onChange={onKeyDown}
            isDisabled={userSubmissionData?.hexling_play?.completed_at}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-end max-lg:justify-center">
          <ResultsButton gameDate={date} />
        </div>
        <WordListCard
          isLoading={isLoadingHexlingSubmissions}
          userSubmissionData={userSubmissionData}
        />
      </div>
    </div>
  );
}
