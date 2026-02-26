"use client";

import Image from "next/image";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { centsToReais } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const BestSellersCard = ({
  product,
  index,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    imageUrl: string;
    basePrice: number;
  };
  index: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex gap-6 items-stretch border border-background/8 hover:border-primary/30 transition-all duration-500 overflow-hidden">
      {/* Image */}
      <div className="relative w-40 lg:w-55 shrink-0 overflow-hidden">
        {isLoading && <Skeleton className="absolute inset-0" />}
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-800 ease-out group-hover:scale-105"
          sizes="220px"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 py-6 pr-6 flex flex-col justify-between min-h-45">
        <div>
          {/* Rank + Brand */}
          <div className="flex items-center gap-3 mb-3">
            <span className="font-serif text-3xl lg:text-4xl text-primary leading-none">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-background">
              {product.brand}
            </span>
          </div>

          <h3 className="font-serif text-xl lg:text-2xl text-background group-hover:text-primary transition-colors duration-300 mb-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between">
          <p className="font-sans text-sm text-background/60 tracking-wide">
            {centsToReais(product.basePrice)}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-sans text-primary">
            <TrendingUp
              className="w-3 h-3"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {index + 1} vendidos
          </span>
        </div>
      </div>
    </Link>
  );
};
