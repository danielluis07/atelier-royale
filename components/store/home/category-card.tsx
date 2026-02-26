"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const CategoryCard = ({
  category,
  className,
}: {
  category: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  };
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn("relative group overflow-hidden", className)}>
      {isLoading && <Skeleton className="absolute inset-0" />}
      <Image
        src={category.imageUrl || ""}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-800 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500" />
      <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
        <div className="flex items-end justify-between">
          <h3 className="font-serif text-2xl lg:text-3xl text-white tracking-wide">
            {category.name}
          </h3>
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:border-white">
            <ArrowUpRight
              className="w-4 h-4 text-white transition-colors duration-500 group-hover:text-foreground"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
