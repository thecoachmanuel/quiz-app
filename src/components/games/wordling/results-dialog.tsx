"use client";

import Loading from "@/app/(default)/loading";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import Link from "next/link";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const chartConfig = {
  you: {
    label: "You",
    color: "var(--chart-1)",
  },
  avg: {
    label: "Average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function ResultsChart({
  tryCount,
  arrayLength,
}: {
  tryCount: number;
  arrayLength: number;
}) {
  const tryCountData = Array(arrayLength).fill(0);

  tryCountData[tryCount - 1] = tryCount;

  const chartData = tryCountData.map((stat, idx) => ({
    turn: `Turn ${idx + 1}`,
    you: stat,
  }));

  return (
    <Card>
      <CardContent className="relative px-2 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="turn" />
            <PolarGrid />

            <Radar
              dataKey="you"
              fill="var(--color-primary)"
              fillOpacity={0.6}
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
            <PolarRadiusAxis
              angle={60}
              stroke="var(--color-primary)"
              orientation="middle"
              axisLine={false}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ResultsDialogComponent({
  open,
  onOpenChange,
  gameDate,
  gameType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userSubmissionData: any;
  gameDate?: string;
  gameType: string;
}) {
  // Build query parameters based on available data
  const [gameResult, setGameResult] = useState<any>("");

  const { data: resultData, isLoading: isLoadingResult } = useGetQuery({
    url: `/games/wordling/game-result`,
    params: {
      game_type: gameType,
      game_date: gameDate,
    },
  });

  const handleSetGameResult = useEffectEvent(() => {
    setGameResult(resultData);
  });

  useEffect(() => {
    handleSetGameResult();
  }, [resultData, isLoadingResult]);

  const totalWins = resultData?.player_stats?.total_wins || 0;
  const totalLosses = resultData?.player_stats?.total_losses || 0;
  const currentWinStreak = resultData?.player_stats?.current_win_streak || 0;
  const longestWinStreak = resultData?.player_stats?.longest_win_streak || 0;

  const gameData = resultData?.game_info;
  const roundData = resultData?.round_state;

  // Get current game status for dialog title
  const getStatusText = () => {
    if (!roundData) return "Game Statistics";

    switch (roundData.status) {
      case "won":
        return "Congratulations! You Won!";
      case "lost":
        return "Game Over";
      case "in_progress":
        return "Game in Progress";
      default:
        return "Game Statistics";
    }
  };

  const statBarData = useMemo(() => {
    const winRate =
      totalWins + totalLosses > 0
        ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
        : 0;

    return [
      {
        title: "Total Wins",
        value: totalWins,
      },
      {
        title: "Win Rate",
        value: `${winRate}%`,
      },
      {
        title: "Win Streak",
        value: currentWinStreak,
      },
      {
        title: "Max Streak",
        value: longestWinStreak,
      },
    ];
  }, [currentWinStreak, longestWinStreak, totalLosses, totalWins]);

  const tryCount = gameResult?.round_state?.round?.try_count;
  const arrayLength = gameResult?.game_info?.secret_word_length;
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-full overflow-y-auto sm:max-h-[90dvh]">
          {isLoadingResult ? (
            <div className="flex h-full max-h-[30vh] items-center justify-center overflow-hidden">
              <Loading />
            </div>
          ) : (
            <div>
              <DialogHeader className="px-0">
                <DialogTitle className="mb-2 border-0 font-bold">
                  {getStatusText()}
                </DialogTitle>
                {roundData?.secret_word && (
                  <p className="text-muted-foreground text-sm">
                    The word was:{" "}
                    <strong>{roundData.secret_word.toUpperCase()}</strong>
                  </p>
                )}
                {roundData?.time_solved_in_sec && (
                  <p className="text-muted-foreground mb-2 text-sm">
                    Solved in:{" "}
                    <strong>{roundData.time_solved_in_sec} seconds</strong>
                  </p>
                )}
              </DialogHeader>
              <div className="flex flex-col gap-3 md:px-0">
                <div className="flex flex-wrap gap-3">
                  {statBarData.map((data) => (
                    <Card
                      key={data.title}
                      className="min-w-[90px] grow p-0 shadow-none"
                    >
                      <CardHeader className="p-3">
                        <CardTitle>{data.value}</CardTitle>
                        <CardDescription>{data.title}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <ResultsChart tryCount={tryCount} arrayLength={arrayLength} />

                {/* Additional game information */}
                {gameData && (
                  <Card className="p-4">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-sm">
                        Game Information
                      </CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Type: </span>
                        <span className="font-medium capitalize">
                          {gameData.game_type?.replace("wordling_", "")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Length: </span>
                        <span className="font-medium">
                          {gameData.secret_word_length}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        <span className="font-medium">
                          {gameData.game_date}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Attempts:{" "}
                        </span>
                        <span className="font-medium">
                          {gameData.max_attempts}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                <span className="text-secondary text-center text-sm font-bold tracking-wider">
                  PLAY OTHER GAMES
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href="/games/wordling-min"
                    className="min-w-[90px] grow"
                    onClick={() => {
                      onOpenChange?.(false);
                    }}
                  >
                    <Card className="hover:bg-muted h-full p-0 shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-3">
                        <div className="relative mb-2 hidden h-[36px] sm:mb-1"></div>
                        <span className="w-full text-center text-sm font-bold tracking-wider uppercase">
                          Wordling Mini
                        </span>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link
                    href="/games/wordling-max"
                    className="min-w-[90px] grow"
                    onClick={() => {
                      onOpenChange?.(false);
                    }}
                  >
                    <Card className="hover:bg-muted h-full p-0 shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-3">
                        <div className="relative mb-2 hidden h-[36px] sm:mb-1"></div>
                        <span className="w-full text-center text-sm font-bold tracking-wider uppercase">
                          Wordling Max
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ResultsDialog({
  open,
  onOpenChange,
  userSubmissionData,
  gameType,
  gameDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userSubmissionData: any;
  gameType: string;
  gameDate?: string;
}) {
  if (open) {
    return (
      <ResultsDialogComponent
        open={open}
        onOpenChange={onOpenChange}
        userSubmissionData={userSubmissionData}
        gameDate={gameDate}
        gameType={gameType}
      />
    );
  }

  return null;
}
