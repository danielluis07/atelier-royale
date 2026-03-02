"use client";

import Link from "next/link";
import { useGetCategories } from "@/modules/categories/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const NavItems = () => {
  const { data, isLoading } = useGetCategories();

  if (isLoading) {
    return (
      <nav className="hidden lg:flex items-center gap-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-24 h-4" />
        ))}
      </nav>
    );
  }

  if (!data) return null;

  return (
    <nav className="hidden lg:flex items-center gap-10">
      {data.map((item) => (
        <Link
          key={item.id}
          href={`/categories/${item.slug}`}
          className="text-xs tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors duration-300 relative group">
          {item.name}
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
        </Link>
      ))}
    </nav>
  );
};
