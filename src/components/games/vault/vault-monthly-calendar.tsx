"use client";

import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { cn } from "@/utils/cn";
import { format, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Calendar } from "./calendar";
import HoverPrefetchLink from "./hover-prefetch-link";
import { DATE_FORMAT } from "./time";

export default function VaultMonthlyCalendar({
  gameType,
  path,
  title,
}: {
  gameType: string;
  path: string;
  title: string;
}) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [firstGameDate, setFirstGameDate] = useState<Date | null>(null);

  const monthParam = format(currentMonth, "yyyy-MM");

  const { data: gameData } = useGetQuery({
    url: `/games/wordling?game_type=${gameType}&month=${monthParam}`,
  });

  const handleSetFirstGameData = useEffectEvent((data: any) => {
    setFirstGameDate(new Date(data.first_game_date));
  });

  // Set the first game date from the API data
  useEffect(() => {
    if (gameData && gameData.first_game_date) {
      handleSetFirstGameData(gameData);
    }
  }, [gameData]);

  // Process game data from API
  const {
    solvedDates,
    failedDates,
    unfinishedDates,
    notPlayedDates,
    gameDates,
    gameNumbers,
  } = useMemo(() => {
    if (!gameData || !gameData.games) {
      return {
        solvedDates: [],
        failedDates: [],
        unfinishedDates: [],
        notPlayedDates: [],
        gameDates: [],
        gameNumbers: {},
      };
    }

    const solved: Date[] = [];
    const failed: Date[] = [];
    const unfinished: Date[] = [];
    const notPlayed: Date[] = [];
    const allGameDates: Date[] = [];
    const gameNumbersMap: Record<string, number> = {};

    // Convert games object to array and process
    Object.entries(gameData.games).forEach(([date, gamesForDate]: any) => {
      const gameDate = new Date(date);
      const game = gamesForDate[0]; // Get the first (and only) game for this date

      allGameDates.push(gameDate);
      gameNumbersMap[date] = game.game_number;

      switch (game.user_play_status) {
        case "SOLVED":
          solved.push(gameDate);
          break;
        case "FAILED":
          failed.push(gameDate);
          break;
        case "UNFINISHED":
          unfinished.push(gameDate);
          break;
        case "NOT_PLAYED":
        default:
          notPlayed.push(gameDate);
          break;
      }
    });

    return {
      solvedDates: solved,
      failedDates: failed,
      unfinishedDates: unfinished,
      notPlayedDates: notPlayed,
      gameDates: allGameDates,
      gameNumbers: gameNumbersMap,
    };
  }, [gameData]);

  // Handle month change from dropdown
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(startOfMonth(date));
  };

  // Check if a date has game data
  const hasGameData = (date: Date) => {
    return gameDates.some(
      (gameDate) =>
        gameDate.getDate() === date.getDate() &&
        gameDate.getMonth() === date.getMonth() &&
        gameDate.getFullYear() === date.getFullYear(),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <Calendar
        mode="single"
        captionLayout="dropdown"
        startMonth={firstGameDate || new Date()}
        endMonth={new Date()}
        disabled={{
          before: firstGameDate || new Date(),
          after: new Date(),
        }}
        onSelect={(date) => {
          if (!date) return;

          const dateStr = format(date, DATE_FORMAT);
          router.push(`/play?d=${dateStr}`);
        }}
        month={currentMonth}
        onMonthChange={handleMonthChange}
        modifiersClassNames={{
          solved:
            "bg-green-400 dark:bg-green-600 text-green-900 dark:text-green-100 hover:bg-green-500 dark:hover:bg-green-700",
          failed:
            "bg-rose-400 dark:bg-rose-600 text-rose-900 dark:text-rose-100 hover:bg-rose-500 dark:hover:bg-rose-700",
          unfinished:
            "bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-500 dark:hover:bg-yellow-700",
        }}
        modifiers={{
          solved: solvedDates,
          failed: failedDates,
          unfinished: unfinishedDates,
          not_played: notPlayedDates,
        }}
        classNames={{
          day_today: "border border-2 border-primary/80 dark:border-white",
          months: "flex-col space-y-4",
          cell: "w-full text-center rounded-full text-md px-0 py-1 relative focus-within:relative focus-within:z-20 rounded-full",
          head_cell:
            "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
          day: cn(
            "size-[45px] sm:size-14 p-0 font-semibold text-md aria-selected:opacity-100 rounded-full",
          ),
        }}
        className="w-full"
        showOutsideDays={false}
        components={{
          DayButton: ({ day }) => {
            // Only show game count if this date has game data
            const hasGame = hasGameData(day.date);
            const dateStr = format(day.date, "yyyy-MM-dd");
            const gameNumber = hasGame ? gameNumbers[dateStr] : null;

            if (hasGame) {
              return (
                <HoverPrefetchLink
                  className="h-full w-full"
                  href={`/games/${path}?game_date=${format(gameData?.games[dateStr][0].game_date, DATE_FORMAT)}&game_type=${gameType}`}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <span>{day.date.getDate()}</span>
                    <span className="-mt-1 text-xs font-medium opacity-50">
                      {gameNumber || "."}
                    </span>
                  </div>
                </HoverPrefetchLink>
              );
            } else {
              // For dates without game data, just show the date without game count
              return (
                <div className="flex h-full w-full flex-col items-center justify-center opacity-30">
                  <span>{day.date.getDate()}</span>
                </div>
              );
            }
          },
        }}
      />

      <div className="bg-primary-foreground text-primary/80 mx-auto mt-8! flex max-w-[400px] justify-center gap-8 rounded-lg py-2 text-sm font-bold">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-400 dark:bg-green-600" />
          <span>SOLVED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-400 dark:bg-rose-600" />
          <span>FAILED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-600" />
          <span>UNFINISHED</span>
        </div>
      </div>
    </div>
  );
}
