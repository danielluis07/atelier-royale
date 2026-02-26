import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function ProductDetailsError() {
  return (
    <section className="max-w-360 mx-auto px-6 lg:px-12 py-8 lg:py-16">
      <nav className="mb-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors duration-300">
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Voltar aos produtos
        </Link>
      </nav>
      <div className="text-center py-24">
        <h2 className="font-serif text-2xl text-foreground mb-2">
          Produto não encontrado
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          O produto que você procura não existe ou não está mais disponível.
        </p>
      </div>
    </section>
  );
}
