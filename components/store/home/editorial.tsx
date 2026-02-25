import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Editorial() {
  return (
    <section className="py-24 lg:py-32 max-w-360 mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-3 items-center">
        {/* Left Column - Stacked Images */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative aspect-4/3 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1170"
              alt="Editorial lookbook"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=987"
                alt="Detail shot"
                fill
                className="object-cover"
                sizes="20vw"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=987"
                alt="Craftsmanship"
                fill
                className="object-cover"
                sizes="20vw"
              />
            </div>
          </div>
        </div>

        {/* Center Spacer */}
        <div className="hidden lg:block lg:col-span-1" />

        {/* Right Column - Text Content */}
        <div className="lg:col-span-6 lg:pl-12">
          <span className="text-xs tracking-[0.4em] uppercase font-sans text-primary mb-6 block">
            Nossa filosofia
          </span>

          <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl tracking-tight text-foreground leading-[1.1] mb-8">
            O luxo está nos{" "}
            <span className="italic text-muted-foreground">
              detalhes invisíveis
            </span>
          </h2>

          <div className="w-16 h-px bg-primary mb-8" />

          <p className="font-sans text-sm lg:text-base text-muted-foreground leading-[1.8] mb-6">
            Na Atelier Royale, acreditamos que o verdadeiro luxo reside na
            atenção meticulosa a cada detalhe — desde a seleção dos materiais
            mais nobres até o acabamento impecável que só as mãos de artesãos
            experientes podem oferecer.
          </p>

          <p className="font-sans text-sm lg:text-base text-muted-foreground leading-[1.8] mb-10">
            Cada peça em nossa coleção carrega uma história de tradição,
            inovação e a busca incansável pela perfeição. Não seguimos
            tendências — nós as transcendemos.
          </p>

          <Link
            href="#"
            className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-sans text-foreground hover:text-primary transition-colors duration-300 border-b border-border pb-2 hover:border-primary">
            Conheça nossa história
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
