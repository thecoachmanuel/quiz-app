"use client";

import { cn } from "@/utils/cn";
import * as React from "react";
import * as RechartsPrimitive from "recharts";

// Theme configuration
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
    theme?: Record<keyof typeof THEMES, string>;
  };
};

type ChartContextProps = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

// Simple payload type for tooltip (recharts@2.15.4)
interface TooltipPayload {
  name?: string;
  value?: number | string;
  color?: string;
  payload?: any;
}

// Simple payload type for legend (recharts@2.15.4)
interface LegendPayload {
  value: string;
  dataKey?: string | number;
  color?: string;
}

// Simple props for ChartTooltipContent
interface ChartTooltipContentProps extends React.ComponentProps<"div"> {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {label && <div className="font-medium">{label}</div>}
      <div className="grid gap-1">
        {payload.map((item, index) => {
          const key = item.name || "value";
          const itemConfig = config[key] || {};
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color || itemConfig.color }}
                />
                <span className="text-muted-foreground">
                  {itemConfig.label || item.name}
                </span>
              </div>
              {item.value !== undefined && (
                <span className="font-mono font-medium">
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 flex aspect-video justify-center text-xs",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
            ${prefix} [data-chart=${id}] {
            ${colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                  itemConfig.color;
                return color ? `  --color-${key}: ${color};` : null;
              })
              .filter(Boolean)
              .join("\n")}
            }
            `,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartLegend = RechartsPrimitive.Legend;

// Simple props for ChartLegendContent
interface ChartLegendContentProps extends React.ComponentProps<"div"> {
  payload?: LegendPayload[];
  verticalAlign?: "top" | "bottom" | "middle";
}

function ChartLegendContent({
  className,
  payload,
  verticalAlign = "bottom",
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload.map((item) => {
        const key = item.dataKey || "value";
        const itemConfig = config[key] || {};
        return (
          <div key={item.value} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {itemConfig.label || item.value}
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend, // Explicitly exported
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
