"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";

const newProducts = [
  {
    name: "Collier Lumière",
    brand: "Maison Dorée",
    price: "R$ 15.200",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=987",
  },
  {
    name: "Bague Céleste",
    brand: "Joaillerie Étoile",
    price: "R$ 9.800",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=987",
  },
  {
    name: "Montre Impériale",
    brand: "Horlogerie Suisse",
    price: "R$ 34.500",
    image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=987",
  },
  {
    name: "Pochette Soirée",
    brand: "Atelier Cuir",
    price: "R$ 6.490",
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=987",
  },
  {
    name: "Bracelet Opale",
    brand: "Maison Lumière",
    price: "R$ 11.350",
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=987",
  },
  {
    name: "Foulard Parisien",
    brand: "Textile Royale",
    price: "R$ 3.200",
    image:
      "https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?q=80&w=987",
  },
];

export function NewArrivals() {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.4em] uppercase font-sans text-primary mb-4">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
              Novidades
            </span>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight text-foreground">
              Recém
              <br />
              <span className="italic text-muted-foreground">chegados</span>
            </h2>
          </div>
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
              href="#"
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
          {newProducts.map((product) => (
            <CarouselItem key={product.name} className="pl-6 basis-auto">
              <Link href="#" className="group shrink-0 w-75 lg:w-80 block">
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-muted mb-5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-800 ease-out group-hover:scale-105"
                    sizes="320px"
                  />

                  {/* New Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-foreground text-[9px] tracking-[0.3em] uppercase font-sans px-3 py-1.5">
                    <Sparkles
                      className="w-2.5 h-2.5 text-primary"
                      strokeWidth={2}
                    />
                    Novo
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 flex items-center justify-center">
                    <span className="text-white text-xs tracking-[0.2em] uppercase font-sans opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 border border-white/40 px-6 py-3 backdrop-blur-sm">
                      Descobrir
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-primary">
                    {product.brand}
                  </span>
                  <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground tracking-wide">
                    {product.price}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
