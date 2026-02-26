import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAfter, subDays } from "date-fns";
import { NEW_PRODUCT_THRESHOLD_DAYS } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Verify if the error is a database unique constraint violation (PostgreSQL error code 23505)
 */
export const isDatabaseUniqueError = (error: unknown): boolean => {
  return (
    error !== null &&
    typeof error === "object" &&
    "cause" in error &&
    error.cause !== null &&
    typeof error.cause === "object" &&
    "code" in error.cause &&
    error.cause.code === "23505"
  );
};

/*
 * Convert a string into a URL-friendly slug
 */
export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 200);

/**
 * Format a number of cents into a Brazilian Real currency string
 */
export function centsToReais(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function isProductNew(
  createdAt: Date,
  days = NEW_PRODUCT_THRESHOLD_DAYS,
): boolean {
  const thresholdDate = subDays(new Date(), days);
  return isAfter(createdAt, thresholdDate);
}
