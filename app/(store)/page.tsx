import { Hero } from "@/components/store/home/hero";
import { BrandMarquee } from "@/components/store/home/brand-marquee";
import { FeaturedCategories } from "@/components/store/home/featured-categories";
import { NewProducts } from "@/components/store/home/new-products";
import { FeaturedProducts } from "@/components/store/home/featured-products";
import { BestSellers } from "@/components/store/home/best-sellers";
import { Editorial } from "@/components/store/home/editorial";
import { TrustBadges } from "@/components/store/home/trust-badges";
import { Newsletter } from "@/components/store/home/newsletter";
import { Suspense } from "react";
import { FeaturedCategoriesSkeleton } from "@/components/skeletons/store/feat-categories-skeleton";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { FeaturedProductsSkeleton } from "@/components/skeletons/store/feat-products-skeleton";
import { NewProductsCarouselSkeleton } from "@/components/skeletons/store/new-products-skeleton";
import { BestSellersSkeleton } from "@/components/skeletons/store/best-sellers-skeleton";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Hero />
      <BrandMarquee />

      {/* Featured Products */}
      <section className="py-24 lg:py-32 bg-muted/50 border-y border-border/50">
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
              href="/products"
              className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-sans text-foreground hover:text-primary transition-colors duration-300">
              Ver todos os produtos
              <ArrowRight
                className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          {/* Product Grid */}
          <Suspense fallback={<FeaturedProductsSkeleton />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Featured Categories */}
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
        <Suspense fallback={<FeaturedCategoriesSkeleton count={5} />}>
          <FeaturedCategories />
        </Suspense>
      </section>

      {/* New Products */}
      <Suspense fallback={<NewProductsCarouselSkeleton />}>
        <NewProducts />
      </Suspense>

      {/* Best Sellers */}
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
          <Suspense fallback={<BestSellersSkeleton />}>
            <BestSellers />
          </Suspense>
        </div>
      </section>

      {/* Editorial */}
      <Editorial />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
