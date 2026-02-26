"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { centsToReais } from "@/lib/utils";

export const NewProductCard = ({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    imageUrl: string;
    basePrice: number;
  };
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative aspect-3/4 w-full overflow-hidden block">
      {isLoading && <Skeleton className="absolute inset-0" />}
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        sizes="400px"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />

      {/* 2. Scrim/Gradient Overlay (Crucial for text legibility) */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

      {/* 3. Text Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white space-y-2">
        <span className="text-[9px] tracking-[0.4em] uppercase font-sans text-white/70">
          {product.brand}
        </span>
        <h3 className="font-serif text-xl lg:text-2xl leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <p className="font-sans text-xs tracking-widest text-white/90">
            {centsToReais(product.basePrice)}
          </p>
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-500 underline underline-offset-4">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
};
