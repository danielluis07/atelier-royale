"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToReais } from "@/lib/utils";

export const FeaturedProductsCard = ({
  product,
  isNew,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    imageUrl: string;
    basePrice: number;
    createdAt: Date;
  };
  isNew: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/products/${product.slug}`} className="group">
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted mb-6">
        {isLoading && <Skeleton className="absolute inset-0" />}
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-all duration-800 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-4 left-4 bg-foreground text-background text-[9px] tracking-[0.3em] uppercase font-sans px-3 py-1.5">
            Novo
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
          <span className="text-white text-xs tracking-[0.2em] uppercase font-sans opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 border border-white/40 px-6 py-3 backdrop-blur-sm">
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-primary">
          {product.brand}
        </span>
        <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-sans text-sm text-muted-foreground tracking-wide">
            {centsToReais(product.basePrice)}
          </p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 fill-primary/60 text-primary/60"
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
