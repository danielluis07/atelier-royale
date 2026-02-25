import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Bolsas",
    subtitle: "Artesanato italiano",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1035",
  },
  {
    name: "Relógios",
    subtitle: "Precisão suíça",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1180",
  },
  {
    name: "Joias",
    subtitle: "Brilho eterno",
    image:
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1515562141589-67f0d569b6fc?q=80&w=1170",
  },
  {
    name: "Perfumes",
    subtitle: "Essências raras",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1004",
  },
  {
    name: "Acessórios",
    subtitle: "Detalhes que definem",
    image:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=987",
  },
];

function CategoryCard({
  category,
  className,
}: {
  category: (typeof categories)[number];
  className?: string;
}) {
  return (
    <Link
      href="#"
      className={`relative group overflow-hidden ${className ?? ""}`}>
      {/* Imagem, Overlay e Conteúdo originais (mantidos intactos) */}
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-800 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500" />
      <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-sans block mb-2">
              {category.subtitle}
            </span>
            <h3 className="font-serif text-2xl lg:text-3xl text-white tracking-wide">
              {category.name}
            </h3>
          </div>
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
}

export function FeaturedCategories({
  items = categories,
}: {
  items?: typeof categories;
}) {
  const getCardClasses = (index: number, totalItems: number) => {
    const positionInBlock = index % 5;
    const blockIndex = Math.floor(index / 5);
    const isLastBlock = blockIndex === Math.floor((totalItems - 1) / 5);
    const itemsInThisBlock = isLastBlock
      ? totalItems % 5 === 0
        ? 5
        : totalItems % 5
      : 5;

    const isRow1 = positionInBlock < 3;
    const heightClass = isRow1 ? "h-85 lg:h-140" : "h-75 lg:h-95";

    if (!isLastBlock || itemsInThisBlock === 5) {
      if (positionInBlock === 0 || positionInBlock === 2)
        return `${heightClass} lg:col-span-1`;
      if (
        positionInBlock === 1 ||
        positionInBlock === 3 ||
        positionInBlock === 4
      )
        return `${heightClass} lg:col-span-2`;
    }

    if (itemsInThisBlock === 1) {
      return `${heightClass} lg:col-span-4`;
    }
    if (itemsInThisBlock === 2) {
      return `${heightClass} lg:col-span-2`;
    }
    if (itemsInThisBlock === 3) {
      if (positionInBlock === 0 || positionInBlock === 2)
        return `${heightClass} lg:col-span-1`;
      if (positionInBlock === 1) return `${heightClass} lg:col-span-2`;
    }
    if (itemsInThisBlock === 4) {
      if (positionInBlock === 0 || positionInBlock === 2)
        return `${heightClass} lg:col-span-1`;
      if (positionInBlock === 1) return `${heightClass} lg:col-span-2`;
      if (positionInBlock === 3) return `h-75 lg:h-95 lg:col-span-4`;
    }

    return `${heightClass} lg:col-span-1`;
  };

  return (
    <section className="py-24 lg:py-32 max-w-360 mx-auto px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
        <div>
          <span className="text-xs tracking-[0.4em] uppercase font-sans text-primary mb-4 block">
            Curadoria
          </span>
          <h2 className="font-serif text-4xl lg:text-6xl tracking-tight text-foreground">
            Explore por
            <br />
            <span className="italic text-muted-foreground">categoria</span>
          </h2>
        </div>
        <p className="font-sans text-muted-foreground max-w-sm leading-relaxed lg:text-right text-pretty">
          Cada categoria é uma porta de entrada para um universo de peças
          selecionadas com o rigor que você merece.
        </p>
      </div>

      {/* Single Symmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((category, index) => (
          <CategoryCard
            key={category.name}
            category={category}
            className={getCardClasses(index, items.length)}
          />
        ))}
      </div>
    </section>
  );
}
