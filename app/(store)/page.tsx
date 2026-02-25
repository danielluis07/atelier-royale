import { Hero } from "@/components/store/home/hero";
import { BrandMarquee } from "@/components/store/home/brand-marquee";
import { FeaturedCategories } from "@/components/store/home/featured-categories";
import { NewArrivals } from "@/components/store/home/new-arrivals";
import { FeaturedProducts } from "@/components/store/home/featured-products";
import { BestSellers } from "@/components/store/home/best-sellers";
import { Editorial } from "@/components/store/home/editorial";
import { TrustBadges } from "@/components/store/home/trust-badges";
import { Newsletter } from "@/components/store/home/newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <FeaturedCategories />
      <FeaturedProducts />
      <NewArrivals />
      <BestSellers />
      <Editorial />
      <TrustBadges />
      <Newsletter />
    </>
  );
}
