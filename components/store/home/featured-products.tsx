import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const products = [
  {
    name: "Rivière Éternelle",
    brand: "Maison Lumière",
    price: "R$ 12.490",
    category: "Joias",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=987",
    isNew: true,
  },
  {
    name: "Chrono Céleste",
    brand: "Horlogerie Suisse",
    price: "R$ 28.900",
    category: "Relógios",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=989",
    isNew: false,
  },
  {
    name: "Sac Parisienne",
    brand: "Atelier Cuir",
    price: "R$ 8.750",
    category: "Bolsas",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1169",
    isNew: true,
  },
  {
    name: "Essence Noire",
    brand: "Parfumerie Royale",
    price: "R$ 2.890",
    category: "Perfumes",
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1039",
    isNew: false,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <span className="text-xs tracking-[0.4em] uppercase font-sans text-primary mb-4 block">
              Seleção
            </span>
            <h2 className="font-serif text-4xl lg:text-6xl tracking-tight text-foreground">
              Nossos
              <br />
              <span className="italic text-muted-foreground">destaques</span>
            </h2>
          </div>
          <Link
            href="#"
            className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-sans text-foreground hover:text-primary transition-colors duration-300">
            Ver todos os produtos
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <Link key={product.name} href="#" className="group">
              {/* Image Container */}
              <div className="relative aspect-3/4 overflow-hidden bg-muted mb-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-800 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* New Badge */}
                {product.isNew && (
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
                    {product.price}
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
          ))}
        </div>
      </div>
    </section>
  );
}
