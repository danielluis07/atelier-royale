"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSalesEvolution } from "@/modules/stats/hooks";
import {
  formatAxisDate,
  formatFullDate,
  formatMetricValue,
  formatShortDate,
  formatDeltaPercent,
} from "@/lib/chart-utils";
import { Skeleton } from "@/components/ui/skeleton";

type RangeDays = 7 | 30 | 90;

const chartConfig = {
  currentValue: {
    label: "Período atual",
    color: "var(--chart-1)",
  },
  previousValue: {
    label: "Período anterior",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const metricMeta: Record<
  "revenue" | "orders" | "averageTicket",
  {
    label: string;
    title: string;
  }
> = {
  revenue: {
    label: "Receita",
    title: "Evolução de receita",
  },
  orders: {
    label: "Pedidos",
    title: "Evolução de pedidos",
  },
  averageTicket: {
    label: "Ticket médio",
    title: "Evolução de ticket médio",
  },
};

function EvolutionTooltip({
  active,
  payload,
  label,
  metric,
  comparePrevious,
}: {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      previousDate: string;
      currentValue: number;
      previousValue: number;
    };
  }>;
  label?: string;
  metric: "revenue" | "orders" | "averageTicket";
  comparePrevious: boolean;
}) {
  if (!active || !payload?.length || !label) {
    return null;
  }

  const point = payload[0]?.payload;

  if (!point) {
    return null;
  }

  const deltaPercent =
    point.previousValue === 0
      ? point.currentValue === 0
        ? 0
        : 100
      : ((point.currentValue - point.previousValue) / point.previousValue) *
        100;

  return (
    <div className="min-w-60 rounded-lg border bg-background p-3 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-medium">{formatFullDate(label)}</p>
        {comparePrevious ? (
          <p className="text-xs text-muted-foreground">
            Comparado com {formatFullDate(point.previousDate)}
          </p>
        ) : null}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Período atual</span>
          <span className="font-medium">
            {formatMetricValue(point.currentValue, metric)}
          </span>
        </div>

        {comparePrevious ? (
          <>
            <div className="flex items-center justify-between gap-6">
              <span className="text-muted-foreground">Período anterior</span>
              <span className="font-medium">
                {formatMetricValue(point.previousValue, metric)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-6 border-t pt-2">
              <span className="text-muted-foreground">Variação</span>
              <span
                className={cn(
                  "font-medium",
                  deltaPercent >= 0 ? "text-emerald-600" : "text-red-600",
                )}>
                {formatDeltaPercent(deltaPercent)}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function SalesEvolutionChart() {
  const [rangeDays, setRangeDays] = React.useState<RangeDays>(30);
  const [metric, setMetric] = React.useState<
    "revenue" | "orders" | "averageTicket"
  >("revenue");
  const [comparePrevious, setComparePrevious] = React.useState(true);

  const { data, isLoading } = useGetSalesEvolution({ rangeDays });

  const chartData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return data.series.map((item) => {
      const currentValue =
        metric === "revenue"
          ? item.revenue
          : metric === "orders"
            ? item.orders
            : item.averageTicket;

      const previousValue =
        metric === "revenue"
          ? item.previousRevenue
          : metric === "orders"
            ? item.previousOrders
            : item.previousAverageTicket;

      return {
        date: item.date,
        previousDate: item.previousDate,
        currentValue,
        previousValue,
      };
    });
  }, [data, metric]);

  const metricSummary = data?.summary[metric];

  return (
    <Card className="pt-0">
      <CardHeader className="gap-4 border-b py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="grid gap-1">
            {isLoading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <CardTitle>{metricMeta[metric].title}</CardTitle>
            )}

            <CardDescription>
              {isLoading ? (
                <Skeleton className="h-4 w-48" />
              ) : data ? (
                `${formatShortDate(data.period.currentStartDate)} a ${formatShortDate(data.period.currentEndDate)}${
                  comparePrevious
                    ? ` • vs ${formatShortDate(data.period.previousStartDate)} a ${formatShortDate(data.period.previousEndDate)}`
                    : ""
                }`
              ) : null}
            </CardDescription>

            <div className="mt-2 flex items-end gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-5 w-12" />
                </>
              ) : metricSummary ? (
                <>
                  <div className="text-2xl font-semibold tabular-nums">
                    {formatMetricValue(metricSummary.current, metric)}
                  </div>

                  {comparePrevious ? (
                    <div
                      className={cn(
                        "text-sm font-medium",
                        metricSummary.deltaPercent >= 0
                          ? "text-emerald-600"
                          : "text-red-600",
                      )}>
                      {formatDeltaPercent(metricSummary.deltaPercent)}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-full lg:w-90" />
                <Skeleton className="h-9 w-full lg:w-44" />
                <Skeleton className="h-9 w-full lg:w-40" />
              </>
            ) : (
              <>
                <Tabs
                  value={metric}
                  onValueChange={(value) =>
                    setMetric(value as "revenue" | "orders" | "averageTicket")
                  }>
                  <TabsList className="grid w-full grid-cols-3 lg:w-90">
                    <TabsTrigger value="revenue">Receita</TabsTrigger>
                    <TabsTrigger value="orders">Pedidos</TabsTrigger>
                    <TabsTrigger value="averageTicket">
                      Ticket médio
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                  <Switch
                    id="compare-previous"
                    checked={comparePrevious}
                    onCheckedChange={setComparePrevious}
                  />
                  <Label htmlFor="compare-previous" className="cursor-pointer">
                    Comparar período anterior
                  </Label>
                </div>

                <Select
                  value={String(rangeDays)}
                  onValueChange={(value) =>
                    setRangeDays(Number(value) as RangeDays)
                  }>
                  <SelectTrigger
                    className="w-full rounded-lg lg:w-40"
                    aria-label="Selecionar período">
                    <SelectValue placeholder="Selecionar período" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl">
                    <SelectItem value="90" className="rounded-lg">
                      Últimos 90 dias
                    </SelectItem>
                    <SelectItem value="30" className="rounded-lg">
                      Últimos 30 dias
                    </SelectItem>
                    <SelectItem value="7" className="rounded-lg">
                      Últimos 7 dias
                    </SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="relative">
          {isLoading ? (
            <Skeleton className="absolute inset-0 z-10 rounded-lg" />
          ) : null}

          <ChartContainer
            config={chartConfig}
            className={cn(
              "aspect-auto h-87.5 w-full",
              isLoading && "invisible",
            )}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="fillCurrentValue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-currentValue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-currentValue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient
                  id="fillPreviousValue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-previousValue)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-previousValue)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatAxisDate}
              />

              <YAxis
                hide
                domain={[(dataMin: number) => dataMin * 0.9, "auto"]}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <EvolutionTooltip
                    metric={metric}
                    comparePrevious={comparePrevious}
                  />
                }
              />

              {comparePrevious ? (
                <Area
                  dataKey="previousValue"
                  type="monotone"
                  fill="url(#fillPreviousValue)"
                  stroke="var(--color-previousValue)"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                />
              ) : null}

              <Area
                dataKey="currentValue"
                type="monotone"
                fill="url(#fillCurrentValue)"
                stroke="var(--color-currentValue)"
                strokeWidth={2}
              />

              {comparePrevious ? (
                <ChartLegend content={<ChartLegendContent />} />
              ) : null}
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
