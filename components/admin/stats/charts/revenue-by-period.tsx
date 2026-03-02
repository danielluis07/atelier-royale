"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { centsToReais } from "@/lib/utils";
import { useGetRevenueByPeriod } from "@/modules/stats/hooks";

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenueByPeriod() {
  const { data, isPending, isError } = useGetRevenueByPeriod();

  const chartData = React.useMemo(() => data ?? [], [data]);

  const totalRevenue = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.revenue, 0),
    [chartData],
  );

  const cardTitle = "Receita por Período";
  const cardDescription = "Últimos 30 dias";

  return (
    <Card className="py-0">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </div>
          {!isPending && !isError && (
            <span className="text-sm font-semibold">
              {centsToReais(totalRevenue)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isPending ? (
          <div className="flex h-62.5 items-center justify-center text-sm text-muted-foreground">
            Carregando dados...
          </div>
        ) : null}

        {isError ? (
          <div className="flex h-62.5 items-center justify-center text-sm text-destructive">
            Não foi possível carregar o gráfico
          </div>
        ) : null}

        {!isPending && !isError ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-62.5 w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const [year, month, day] = value.split("-").map(Number);
                  const date = new Date(year, month - 1, day);
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-37.5"
                    formatter={(value) => centsToReais(Number(value))}
                    labelFormatter={(value) => {
                      const [year, month, day] = value.split("-").map(Number);
                      return new Date(year, month - 1, day).toLocaleDateString(
                        "pt-BR",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      );
                    }}
                  />
                }
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" />
            </BarChart>
          </ChartContainer>
        ) : null}
      </CardContent>
    </Card>
  );
}
