import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

const bestSellers = [
  {
    rank: 1,
    name: "Grand Chronographe",
    brand: "Horlogerie Suisse",
    price: "R$ 42.000",
    soldCount: "2.4k vendidos",
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=987",
  },
  {
    rank: 2,
    name: "Sac Voyage Noir",
    brand: "Atelier Cuir",
    price: "R$ 14.900",
    soldCount: "1.8k vendidos",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=876",
  },
  {
    rank: 3,
    name: "Parfum Nuit Dorée",
    brand: "Parfumerie Royale",
    price: "R$ 4.200",
    soldCount: "3.1k vendidos",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    rank: 4,
    name: "Pendentif Étoile",
    brand: "Maison Lumière",
    price: "R$ 18.600",
    soldCount: "1.2k vendidos",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=987",
  },
];

export function BestSellers() {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-background">
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.4em] uppercase font-sans text-primary mb-4">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
              Tendência
            </span>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight text-background">
              Os mais
              <br />
              <span className="italic text-background/50">desejados</span>
            </h2>
          </div>
          <Link
            href="#"
            className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-sans text-background/60 hover:text-primary transition-colors duration-300">
            Ver ranking completo
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        {/* Best Sellers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bestSellers.map((product) => (
            <Link
              key={product.name}
              href="#"
              className="group flex gap-6 items-stretch border border-background/8 hover:border-primary/30 transition-all duration-500 overflow-hidden">
              {/* Image */}
              <div className="relative w-40 lg:w-55 shrink-0 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-800 ease-out group-hover:scale-105"
                  sizes="220px"
                />
              </div>

              {/* Content */}
              <div className="flex-1 py-6 pr-6 flex flex-col justify-between min-h-45">
                <div>
                  {/* Rank + Brand */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-serif text-3xl lg:text-4xl text-primary leading-none">
                      {String(product.rank).padStart(2, "0")}
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
                    {product.price}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-sans text-primary">
                    <TrendingUp
                      className="w-3 h-3"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {product.soldCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
