import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1675537057530-312348c6caa2"
          alt="Newsletter background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/90" />
      </div>

      {/* Content */}
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <span className="text-xs tracking-[0.4em] uppercase font-sans text-primary mb-6 block">
          Exclusividade
        </span>

        <h2 className="font-serif text-3xl lg:text-5xl text-background tracking-tight mb-6 leading-[1.15]">
          Seja o primeiro a
          <br />
          <span className="italic text-background/60">
            descobrir o extraordinário
          </span>
        </h2>

        <p className="font-sans text-sm text-background/40 mb-10 leading-relaxed max-w-md mx-auto">
          Inscreva-se para receber acesso antecipado a novas coleções, convites
          para eventos exclusivos e ofertas reservadas aos nossos membros.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="flex-1 bg-transparent border border-background/20 px-6 py-4 text-background text-sm font-sans tracking-wide placeholder:text-background/30 focus:outline-none focus:border-primary transition-colors duration-300"
          />
          <button
            type="submit"
            className="group flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:bg-primary/90 transition-all duration-500 shrink-0">
            Inscrever
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </button>
        </form>

        <p className="font-sans text-[10px] text-background/20 mt-6 tracking-wide">
          Ao se inscrever, você concorda com nossa política de privacidade.
          Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}
