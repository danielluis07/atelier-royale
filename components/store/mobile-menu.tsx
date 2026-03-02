"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/modules/categories/hooks";
import { SearchDialog } from "@/components/store/search-dialog";
import { User } from "lucide-react";
import { CartSheet } from "@/components/store/cart/cart-sheet";
import { Skeleton } from "@/components/ui/skeleton";

export const MobileMenu = ({
  mobileMenuOpen,
  hasSession,
}: {
  mobileMenuOpen: boolean;
  hasSession: boolean;
}) => {
  const { data, isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-500 bg-background border-t border-border",
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}>
        <div className="px-6 py-8 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-4" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className={cn(
        "lg:hidden overflow-hidden transition-all duration-500 bg-background border-t border-border",
        mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
      )}>
      <div className="px-6 py-8 space-y-6">
        {data.map((item, i) => (
          <Link
            key={i}
            href={`/categories/${item.slug}`}
            className="block text-sm tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors">
            {item.name}
          </Link>
        ))}
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <SearchDialog />
          <Link
            href={hasSession ? "/account" : "/login"}
            className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            <User className="w-4.5 h-4.5" strokeWidth={1.5} />
          </Link>
          <CartSheet />
        </div>
      </div>
    </div>
  );
};
