"use client";

import * as React from "react";
import { Pie, PieChart } from "recharts";

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
import { useGetProductsByStatus } from "@/modules/stats/hooks";

const chartConfig = {
  total: {
    label: "Produtos",
  },
  available: {
    label: "Disponível",
    color: "var(--chart-1)",
  },
  outOfStock: {
    label: "Sem estoque",
    color: "var(--chart-2)",
  },
  unavailable: {
    label: "Indisponível",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ProductsByStatus() {
  const { data, isPending, isError } = useGetProductsByStatus();

  const chartData = React.useMemo(
    () =>
      (data ?? []).map((item) => ({
        ...item,
        fill: `var(--color-${item.key})`,
      })),
    [data],
  );

  const totalProducts = React.useMemo(
    () => chartData.reduce((sum, item) => sum + item.total, 0),
    [chartData],
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Produtos por Status</CardTitle>
        <CardDescription>Total: {totalProducts}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
            className="mx-auto aspect-square max-h-62.5">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="total" nameKey="status" />
            </PieChart>
          </ChartContainer>
        ) : null}
      </CardContent>
    </Card>
  );
}
