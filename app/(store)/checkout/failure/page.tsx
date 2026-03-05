"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, Phone } from "lucide-react";

const CheckoutFailurePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full mt-5">
        {/* Error Icon */}
        <div className="flex justify-center mb-12">
          <div className="relative w-24 h-24">
            {/* Animated glow background */}
            <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse blur-xl" />

            {/* Icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle
                className="w-20 h-20 text-destructive stroke-[1.5]"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase font-sans text-destructive mb-4 block">
            Falha na Transação
          </span>

          <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-foreground mb-4">
            Ops! Algo deu
            <br />
            <span className="italic text-muted-foreground">errado</span>
          </h1>

          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            Desculpe, não conseguimos processar seu pagamento. Isso pode ter
            acontecido devido a dados incorretos, saldo insuficiente ou limite
            atingido. Por favor, verifique seus dados e tente novamente.
          </p>
        </div>

        {/* Separator */}
        <div className="h-px bg-border/50 mb-12" />

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 justify-center">
          <Link
            href="/checkout"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300 hover:bg-primary/90">
            Tentar Novamente
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>

          <Link
            href="/cart"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-background text-foreground text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300 hover:bg-muted/50">
            Voltar ao Carrinho
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        {/* Bottom Support Section */}
        <div className="mt-16">
          <div className="border border-border/50 bg-muted/20 px-8 py-8 text-center">
            <p className="font-sans text-xs text-muted-foreground tracking-widest mb-4">
              Continua com problemas?
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-300 font-sans tracking-widest underline underline-offset-4">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Suporte
              </Link>

              <span className="hidden sm:block w-px h-4 bg-border/50" />

              <a
                href="mailto:contato@atelierroyale.com"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-300 font-sans tracking-widest underline underline-offset-4">
                contato@atelierroyale.com
              </a>
            </div>
          </div>

          <p className="font-sans text-xs text-muted-foreground/60 text-center mt-6">
            Seus dados de carrinho foram salvos e estão esperando você.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailurePage;
