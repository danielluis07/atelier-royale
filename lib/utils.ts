import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAfter, subDays } from "date-fns";
import { NEW_PRODUCT_THRESHOLD_DAYS } from "@/constants";
import imageCompression from "browser-image-compression";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const compressImageToWebP = async (file: File) => {
  const compressionOptions = {
    maxSizeMB: 0.3, // 300kb
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };

  const compressedBlob = await imageCompression(file, compressionOptions);

  const originalName = file.name;
  const lowerName = originalName.toLowerCase();
  const newFileName = lowerName.endsWith(".webp")
    ? originalName
    : originalName.includes(".")
      ? originalName.replace(/\.[^/.]+$/, ".webp")
      : `${originalName}.webp`;

  const finalImageFile = new File([compressedBlob], newFileName, {
    type: "image/webp",
  });

  return finalImageFile;
};

export const digitsOnly = (v: string) => v.replace(/\D/g, "");

export function formatCpfCnpj(value: string) {
  const d = digitsOnly(value).slice(0, 14);

  // CPF: 000.000.000-00 (11)
  if (d.length <= 11) {
    const p1 = d.slice(0, 3);
    const p2 = d.slice(3, 6);
    const p3 = d.slice(6, 9);
    const p4 = d.slice(9, 11);

    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `-${p4}`;
    return out;
  }

  // CNPJ: 00.000.000/0000-00 (14)
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 8);
  const p4 = d.slice(8, 12);
  const p5 = d.slice(12, 14);

  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `/${p4}`;
  if (p5) out += `-${p5}`;
  return out;
}

export function formatPhoneBR(value: string) {
  // allows optional country code 55
  const d = digitsOnly(value).slice(0, 13);

  // If starts with 55 and has at least 12 digits, treat as +55
  const hasBR = d.startsWith("55") && d.length >= 12;
  const digits = hasBR ? d.slice(2) : d; // remove country code for local formatting

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  // 9-digit mobile: 99999-9999, landline: 9999-9999
  const isMobile = rest.length >= 9;
  const part1 = rest.slice(0, isMobile ? 5 : 4);
  const part2 = rest.slice(isMobile ? 5 : 4, isMobile ? 9 : 8);

  let out = "";
  if (hasBR) out += "+55 ";
  if (ddd) out += `(${ddd})`;
  if (part1) out += ` ${part1}`;
  if (part2) out += `-${part2}`;

  return out.trim();
}

export function formatCep(value: string) {
  const d = digitsOnly(value).slice(0, 8);
  const p1 = d.slice(0, 5);
  const p2 = d.slice(5, 8);
  return p2 ? `${p1}-${p2}` : p1;
}
