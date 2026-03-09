import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

// Frontend utilities for chart data manipulation
export function getLocalDateString(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function calculateDeltaPercent(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

// Backend utilities for chart data manipulation
export function parseChartDate(dateString: string) {
  return parse(dateString, "yyyy-MM-dd", new Date());
}

export function formatAxisDate(dateString: string) {
  return format(parseChartDate(dateString), "dd MMM", {
    locale: ptBR,
  });
}

export function formatFullDate(dateString: string) {
  return format(parseChartDate(dateString), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
}

export function formatShortDate(dateString: string) {
  return format(parseChartDate(dateString), "dd/MM/yyyy", {
    locale: ptBR,
  });
}

export function formatMetricValue(
  value: number,
  metric: "revenue" | "orders" | "averageTicket",
) {
  if (metric === "orders") {
    return new Intl.NumberFormat("pt-BR").format(value);
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export function formatDeltaPercent(value: number) {
  const signal = value > 0 ? "+" : "";
  return `${signal}${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;
}
