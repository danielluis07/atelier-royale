"use client";

import Link from "next/link";
import { Clock, ArrowRight, RefreshCw } from "lucide-react";

const CheckoutPendingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Animated Spinner */}
        <div className="flex justify-center mb-12">
          <div className="relative w-24 h-24">
            {/* Animated glow background */}
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse blur-xl" />

            {/* Animated spinner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-20 h-20">
                {/* Rotating outer ring */}
                <div className="absolute inset-0 border-2 border-transparent border-t-primary border-r-primary rounded-full animate-spin" />

                {/* Static inner icon */}
                <Clock
                  className="absolute inset-0 m-auto w-8 h-8 text-primary/60 stroke-[1.5]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase font-sans text-primary mb-4 block">
            Processando
          </span>

          <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-foreground mb-4">
            Processando seu
            <br />
            <span className="italic text-muted-foreground">pagamento</span>
          </h1>

          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            Estamos processando sua transação. Este é um processo importante que
            deve ser concluído. Isso pode levar alguns minutos. Por favor, não
            feche esta página.
          </p>
        </div>

        {/* Separator */}
        <div className="h-px bg-border/50 mb-12" />

        {/* Status Info Box */}
        <div className="mb-8 border border-border/50 bg-muted/20 px-8 py-8">
          <div className="space-y-4">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">
                O que fazer agora?
              </p>
              <ul className="font-sans text-sm text-foreground space-y-2 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold shrink-0 mt-0.5">
                    •
                  </span>
                  <span>Aguarde enquanto processamos sua transação</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold shrink-0 mt-0.5">
                    •
                  </span>
                  <span>
                    Você receberá um e-mail de confirmação assim que concluído
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold shrink-0 mt-0.5">
                    •
                  </span>
                  <span>
                    Não atualize a página ou volte para trás durante este
                    processo
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/account/orders"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300 hover:bg-primary/90">
            Acompanhar Pedido
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-background text-foreground text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300 hover:bg-muted/50">
            Atualizar Status
            <RefreshCw
              className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Bottom Support Info */}
        <div className="text-center border-t border-border/50 pt-8">
          <p className="font-sans text-xs text-muted-foreground tracking-widest mb-3">
            Pagamento não saiu de sua conta
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4 max-w-md mx-auto">
            Se o pagamento foi debitado de sua conta mas o pedido ainda está
            pendente, entre em contato com nosso suporte.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-300 font-sans tracking-widest underline underline-offset-4">
            Contatar Suporte
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPendingPage;
