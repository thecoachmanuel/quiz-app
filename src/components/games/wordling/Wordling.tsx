"use client";
import Keyboard from "@/components/games/wordling/keyboard";
import { getQueryClient } from "@/configs/query-client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";
import { useModalStore } from "../providers/modal/modal-provider";
import { ResultsButton } from "./results-button";
import WordlingGrid from "./wordling-grid";

export type ResponseType = {
  word: string;
  result: { letter: string; status: string }[];
  isCorrect: boolean;
  user_submissions: [{ letter: string; status: string }][];
};

export type UserSubmissions = {
  letter: string;
  status: string;
}[][];

const Wordling = ({
  gameId,
  gameDate,
  gameType,
  path,
  title,
}: {
  gameId?: string | undefined;
  gameDate?: string;
  gameType: string;
  path: string;
  title: string;
}) => {
  const { onOpenChange } = useModalStore((state) => state);

  const [inputWord, setInputWord] = useState<string>("");

  const { mutate } = useQueryMutation({
    isPublic: false,
    url: "games/wordling/check",
  });

  const { data: userSubmissionData, isLoading: isLoading } = useGetQuery({
    url: `/games/wordling/user-submissions?${gameType ? `game_type=${gameType}` : ""}${gameId ? `&game_id=${gameId}` : ""}${gameDate ? `&game_date=${gameDate}` : ""}`,
  });

  const data = userSubmissionData?.wordling_play?.user_submissions;

  const maxAttempts = userSubmissionData?.wordling_word?.max_attempts;
  const wordLen = userSubmissionData?.wordling_word?.secret_word_length;

  const [gridData, setGridData] = useState<string>("");

  const currTurn = useMemo(
    () => (wordLen && wordLen > 0 ? gridData.length / wordLen : 0),
    [gridData, wordLen],
  );

  const disabled =
    !wordLen || // Add check for wordLen
    currTurn >= maxAttempts ||
    isLoading ||
    userSubmissionData?.wordling_play?.is_correct ||
    userSubmissionData?.wordling_play?.try_count >=
      userSubmissionData?.wordling_word?.max_attempts;

  const handleSetGridData = useEffectEvent(() => {
    setGridData("");
  });

  useEffect(() => {
    handleSetGridData();
    data?.forEach((items: any) => {
      items.forEach((item: any) => {
        setGridData((prev) => prev + item.letter);
      });
    });
  }, [data]);

  const currentTurnData = inputWord && inputWord.split("");

  const handleSubmit = () => {
    mutate(
      {
        user_input_word: inputWord,
        game_id: gameId,
        game_date: gameDate,
        game_type: gameType,
      },
      {
        onSuccess: (response: any) => {
          getQueryClient().invalidateQueries({
            queryKey: [
              `/games/wordling/user-submissions?${gameType ? `game_type=${gameType}` : ""}${gameId ? `&game_id=${gameId}` : ""}${gameDate ? `&game_date=${gameDate}` : ""}`,
            ],
            exact: false,
          });

          getQueryClient().invalidateQueries({
            queryKey: [
              `/games/wordling?${gameType ? `game_type=${gameType}` : ""}${gameId ? `&game_id=${gameId}` : ""}${gameDate ? `&game_date=${gameDate}` : ""}`,
            ],
            exact: false,
          });
          setInputWord("");

          toast.success(response?.data?.data?.message);
        },
      },
    );
  };

  function onKeyDown(e: KeyboardEvent | { key: string }) {
    if (disabled) {
      return;
    }

    if (e.key === "Enter") {
      if (!wordLen || inputWord.length !== wordLen) {
        toast.error("Not enough letters!", {
          position: "top-center",
          duration: 2000,
        });
        return;
      }

      if (
        userSubmissionData?.wordling_play?.is_correct ||
        currTurn >= maxAttempts
      ) {
        setTimeout(() => {
          onOpenChange(true);
        }, 500);
      }

      setInputWord("");
      handleSubmit();
      return;
    }

    if (e.key === "Backspace") {
      setInputWord((prev) => prev.slice(0, -1));
      return;
    }

    if (
      e.key.length === 1 &&
      e.key.match(/[a-z]/i) &&
      wordLen &&
      inputWord.length < wordLen
    ) {
      setInputWord((prev) => prev + e.key.toLowerCase());
    }

    if (e.key === "Escape") {
      setInputWord("");
    }
  }

  useEventListener("keydown", onKeyDown);

  return (
    <div className="relative flex-col gap-4 max-lg:flex">
      <div className="top-0 right-0 flex gap-1.5 max-lg:mx-auto lg:absolute">
        <ResultsButton
          path={path}
          gameType={gameType}
          gameDate={gameDate}
          userSubmissionData={userSubmissionData}
        />
      </div>

      {userSubmissionData || isLoading ? (
        <div className="flex flex-col justify-between gap-8">
          <p className="text-center text-3xl font-bold">{title}</p>
          <main className="flex h-full grow flex-col items-center justify-center gap-8">
            <WordlingGrid
              maxAttempts={maxAttempts}
              wordLen={wordLen}
              disabled={disabled}
              data={data}
              currTurn={currTurn}
              currentTurnData={currentTurnData}
              isLoadingWordling={isLoading}
            />
          </main>
          <Keyboard onKeyClick={onKeyDown} disabled={disabled} data={data} />
        </div>
      ) : (
        <div>
          <p className="text-center text-3xl font-bold">{title}</p>
          <div className="flex h-[40vh] items-center justify-center text-center">
            <p className="text-2xl font-bold">No Game Found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wordling;
