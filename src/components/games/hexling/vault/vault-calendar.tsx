"use client";

import { Button } from "@/components/ui/Button";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { cn } from "@/utils/cn";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import {
  add,
  addMonths,
  format,
  formatDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  startOfMonth,
  subMonths,
} from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../vault/select";
import { DATE_FORMAT } from "../../vault/time";

interface MonthYear {
  year: number;
  month: number;
}

interface HexlingGame {
  id: number;
  game_id: string;
  root_word: string;
  center_letter: string;
  total_levels: number;
  total_points: number;
  game_date: string;
  formatted_date: string;
  badges: any[];
  user_play_status: "NOT_PLAYED" | "IN_PROGRESS" | "COMPLETED";
  game_number: number;
  user_stats: {
    earned_points: number;
    current_level: number;
    found_words_count: number;
    earned_badges_count: number;
    earned_badges: any[];
    progress_percentage: number;
  } | null;
}

const getMonthsBetweenDates = (startDate: Date, endDate: Date): MonthYear[] => {
  if (
    !startDate ||
    !endDate ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    return [];
  }

  const months: MonthYear[] = [];
  let currentDate = startOfMonth(startDate);

  while (currentDate <= endDate) {
    months.push({
      year: getYear(currentDate),
      month: getMonth(currentDate),
    });
    currentDate = add(currentDate, { months: 1 });
  }

  return months;
};

export default function VaultCalendar() {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("d")
    ? new Date(parseInt(searchParams.get("d")!) * 100000)
    : new Date();

  const [selectedRange, setSelectedRange] = useState<MonthYear>(() => ({
    year: getYear(initialDate),
    month: getMonth(initialDate),
  }));

  const [firstGameDate, setFirstGameDate] = useState<Date | null>(null);

  // Format current month as YYYY-MM for API
  const monthParam = format(
    new Date(selectedRange.year, selectedRange.month),
    "yyyy-MM",
  );

  const { data: gameData, isLoading } = useGetQuery({
    url: `/games/hexling?month=${monthParam}`,
  });

  const handleSetFirstGameData = useEffectEvent((gameDate: any) => {
    setFirstGameDate(new Date(gameDate));
  });

  // Set the first game date from the API data (only once)
  useEffect(() => {
    if (gameData && gameData.first_game_date && !firstGameDate) {
      handleSetFirstGameData(gameData.first_game_date);
    }
  }, [gameData, firstGameDate]);

  // Calculate the overall date range for the calendar navigation
  const { startDate, endDate, months } = useMemo(() => {
    // Use first game date as start, or current month if not available yet
    const start = firstGameDate || new Date();
    // Use current date as end
    const end = new Date();

    const monthsBetween = getMonthsBetweenDates(start, end);

    return {
      startDate: start,
      endDate: end,
      months: monthsBetween,
    };
  }, [firstGameDate]);

  const handleMonthChange = (month: number) => {
    setSelectedRange((prev) => ({ ...prev, month }));
  };

  const handleYearChange = (year: number) => {
    setSelectedRange((prev) => ({ ...prev, year }));
  };

  const handlePreviousMonth = () => {
    setSelectedRange((prev) => {
      const newDate = subMonths(new Date(prev.year, prev.month), 1);
      return { year: getYear(newDate), month: getMonth(newDate) };
    });
  };

  const handleNextMonth = () => {
    setSelectedRange((prev) => {
      const newDate = addMonths(new Date(prev.year, prev.month), 1);
      return { year: getYear(newDate), month: getMonth(newDate) };
    });
  };

  const availableYears = Array.from(new Set(months.map(({ year }) => year)));
  const availableMonths = months
    .filter(({ year }) => year === selectedRange.year)
    .map(({ month }) => month);

  useEffect(() => {
    if (
      availableMonths.length > 0 &&
      !availableMonths.includes(selectedRange.month)
    ) {
      const currentDate = new Date(
        selectedRange.year,
        selectedRange.month - 1, // if months are 1–12
      );

      const validMonths = months.filter((m) =>
        availableMonths.includes(m.month),
      );

      let closestMonth = validMonths[0];

      for (const m of validMonths) {
        const monthDate = new Date(m.year, m.month - 1);
        if (monthDate <= currentDate) {
          closestMonth = m;
        } else {
          break;
        }
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRange({
        year: closestMonth.year,
        month: closestMonth.month,
      });
    }
  }, [availableMonths, months, selectedRange.month, selectedRange.year]);

  const isPreviousDisabled = useMemo(() => {
    if (!startDate) return true;
    const currentDate = new Date(selectedRange.year, selectedRange.month);
    const previousDate = subMonths(currentDate, 1);
    return isBefore(previousDate, startOfMonth(startDate));
  }, [selectedRange, startDate]);

  const isNextDisabled = useMemo(() => {
    if (!endDate) return false;
    const currentDate = new Date(selectedRange.year, selectedRange.month);
    const nextDate = addMonths(currentDate, 1);
    return isAfter(nextDate, endDate);
  }, [selectedRange, endDate]);

  // Convert games object to flat array for rendering
  const gamesList = useMemo(() => {
    if (!gameData || !gameData.games) {
      return [];
    }

    return Object.entries(gameData.games).flatMap(([date, dateGames]: any) =>
      dateGames.map((game: HexlingGame) => ({
        ...game,
        displayDate: date,
      })),
    );
  }, [gameData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="mb-6 text-center text-2xl font-bold">Hexling Vault</h3>
      <div className="flex w-full items-center justify-between space-x-2 px-3">
        <Button
          variant="outline"
          onClick={handlePreviousMonth}
          className="size-[40px]"
          disabled={isPreviousDisabled}
        >
          <CaretLeftIcon size={16} className="min-w-4" />
        </Button>
        <div className="flex w-full max-w-[200px] gap-2 md:max-w-[400px]">
          <Select
            value={selectedRange.month.toString()}
            onValueChange={(value) => handleMonthChange(parseInt(value))}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {format(new Date(selectedRange.year, month), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedRange.year.toString()}
            onValueChange={(value) => handleYearChange(parseInt(value))}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={handleNextMonth}
          className="size-[40px]"
          disabled={isNextDisabled}
        >
          <CaretRightIcon size={16} className="min-w-4" />
        </Button>
      </div>

      <div className="mt-4 mb-8 grid grid-cols-1 gap-2 px-4 md:grid-cols-2 md:gap-4">
        {gamesList.length === 0 ? (
          <div className="text-muted-foreground col-span-2 py-8 text-center">
            No games available for{" "}
            {format(
              new Date(selectedRange.year, selectedRange.month),
              "MMMM yyyy",
            )}
          </div>
        ) : (
          gamesList.map((game) => {
            const status = game.user_play_status;
            const isCompleted = status === "COMPLETED";
            const isInProgress = status === "IN_PROGRESS";
            const isNotPlayed = status === "NOT_PLAYED";

            return (
              <span
                key={game.id}
                className="hover:bg-muted/50 rounded-lg border"
              >
                <Link
                  href={`/games/hexling?game_date=${formatDate(game.game_date, DATE_FORMAT)}`}
                  prefetch={false}
                >
                  <div className="flex items-center gap-2 p-3">
                    <div
                      className={cn(
                        "leading-tightest flex size-9 min-w-9 items-center justify-center rounded-full font-semibold",
                        {
                          "bg-muted text-muted-foreground": isNotPlayed,
                          "bg-yellow-400 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-100":
                            isInProgress,
                          "bg-green-400 text-green-900 dark:bg-green-600 dark:text-green-100":
                            isCompleted,
                        },
                      )}
                    >
                      {game.game_number}
                    </div>
                    <div className="flex w-full flex-col">
                      <span>
                        {format(new Date(game.game_date), "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs font-semibold tracking-tight uppercase">
                        {game.user_stats
                          ? `${game.user_stats.earned_points} / ${game.total_points} POINTS | ${game.user_stats.found_words_count} WORDS | ${game.user_stats.earned_badges_count} BADGES`
                          : "NOT STARTED"}
                      </span>
                    </div>
                  </div>
                </Link>
              </span>
            );
          })
        )}
      </div>

      <div className="bg-muted text-primary/80 mx-auto mt-8 mb-8! flex w-fit max-w-[500px] flex-col items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold md:w-auto md:flex-row md:gap-8">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-400 dark:bg-green-600" />
          <span className="whitespace-nowrap">COMPLETED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-600" />
          <span>IN PROGRESS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-600" />
          <span>NOT STARTED</span>
        </div>
      </div>
    </div>
  );
}
