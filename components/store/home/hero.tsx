import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-svh min-h-220 overflow-hidden bg-foreground">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 -top-20 -bottom-20">
        <Image
          src="/images/hero-bg.png"
          alt="Coleção de moda de luxo"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-black/1" />
      <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-20 lg:pb-34 max-w-360 mx-auto px-6 lg:px-12">
        {/* Decorative Line */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-px bg-white/40" />
          <span className="text-white/60 text-xs tracking-[0.4em] uppercase font-sans">
            Nova Coleção 2026
          </span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl xl:text-9xl text-white leading-[0.9] tracking-tight max-w-4xl">
          A arte da
          <br />
          <span className="italic text-white/80">elegância</span>
        </h1>

        <p className="font-sans text-sm lg:text-base text-white/50 max-w-md mt-8 leading-relaxed tracking-wide">
          Peças cuidadosamente selecionadas que transcendem tendências. Cada
          item, uma declaração de estilo atemporal.
        </p>

        <div className="flex items-center gap-6 mt-10">
          <Link
            href="#"
            className="group inline-flex items-center gap-3 bg-white text-foreground px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500">
            Explorar coleção
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="#"
            className="text-white/60 text-xs tracking-[0.2em] uppercase font-sans hover:text-white transition-colors duration-300 border-b border-white/20 pb-1 hover:border-white/60">
            Lookbook
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-6 lg:right-12 flex flex-col items-center gap-3">
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-sans [writing-mode:vertical-lr]">
            Scroll
          </span>
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-white/60 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
