"use client";

import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

export function ProductsCarousel({
  label,
  className,
  products,
}: {
  label: string;
  className?: string;
  products:
    | {
        id: string;
        name: string;
        slug: string;
        categoryName: string;
        brand: string;
        imageUrl: string;
        basePrice: number;
        categoryId: string;
        createdAt: Date;
      }[]
    | undefined;
}) {
  const [api, setApi] = useState<CarouselApi>();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-24 lg:py-32", className)}>
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <h2 className="font-serif text-2xl lg:text-4xl tracking-tight text-foreground">
            {label}
          </h2>
          <div className="flex items-center gap-4">
            {/* Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => api?.scrollPrev()}
                className="w-11 h-11 border border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all duration-300"
                aria-label="Anterior">
                <ChevronLeft
                  className="w-4 h-4 text-foreground"
                  strokeWidth={1.5}
                />
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="w-11 h-11 border border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all duration-300"
                aria-label="Próximo">
                <ChevronRight
                  className="w-4 h-4 text-foreground"
                  strokeWidth={1.5}
                />
              </button>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-sans text-foreground hover:text-primary transition-colors duration-300">
              Ver tudo
              <ArrowRight
                className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="max-w-360 mx-auto px-6 lg:px-12">
        <CarouselContent className="-ml-6">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-6 basis-1/2 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
