"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

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

export default function ResultsChart({
  playerStats,
  totalStats,
}: {
  playerStats: number[];
  totalStats?: number[];
}) {
  const chartData = playerStats.map((stat, idx) => ({
    turn: `Turn ${idx + 1}`,
    you: stat,
    avg: totalStats ? totalStats[idx] : undefined,
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
              dataKey="avg"
              fill="var(--color-secondary)"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
            <Radar
              dataKey="you"
              fill="var(--color-primary)"
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
