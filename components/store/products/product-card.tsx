"use client";

import Image from "next/image";
import Link from "next/link";
import { centsToReais } from "@/lib/utils";
import { useState } from "react";

export const ProductCard = ({
  product,
  index,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    categoryName: string;
    description: string;
    brand: string;
    imageUrl: string;
    basePrice: number;
    categoryId: string | null;
    createdAt: Date;
  };
  index: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      {/* Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted mb-5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
            isLoading
              ? "scale-110 opacity-0 blur-md"
              : "scale-100 opacity-100 blur-0"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={index === 0}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 flex items-center justify-center">
          <span className="text-white text-xs tracking-[0.2em] uppercase font-sans opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 border border-white/40 px-6 py-3 backdrop-blur-sm">
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-primary truncate">
            {product.brand}
          </span>
          {product.categoryName && (
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground/60 shrink-0">
              {product.categoryName}
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
          {product.name}
        </h3>

        <p className="font-sans text-sm text-muted-foreground tracking-wide">
          {centsToReais(product.basePrice)}
        </p>
      </div>
    </Link>
  );
};
