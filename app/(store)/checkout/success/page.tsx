"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const [displayedSeconds, setDisplayedSeconds] = useState(7);
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);

  useEffect(() => {
    clearCart();

    const timer = setTimeout(() => {
      setIsAutoRedirecting(true);
      router.push("/");
    }, 7000);

    const interval = setInterval(() => {
      setDisplayedSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full mt-5">
        {/* Success Animation */}
        <div className="flex justify-center mb-12">
          <div className="relative w-24 h-24">
            {/* Animated glow background */}
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse blur-xl" />

            {/* Icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle
                className="w-20 h-20 text-green-500 stroke-[1.5]"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase font-sans text-green-500 mb-4 block">
            Compra Confirmada
          </span>

          <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-foreground mb-4">
            Obrigado pela sua
            <br />
            <span className="italic text-muted-foreground">compra</span>
          </h1>

          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-2">
            Seu pedido foi processado com sucesso. Você receberá um e-mail de
            confirmação em breve com os detalhes do seu pedido e informações de
            rastreamento.
          </p>

          {/* Countdown */}
          <p className="font-sans text-sm text-muted-foreground/60 mt-6">
            {isAutoRedirecting
              ? "Redirecionando..."
              : `Voltando para a loja em ${displayedSeconds}s`}
          </p>
        </div>

        {/* Separator */}
        <div className="h-px bg-border/50 mb-12" />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300 hover:bg-primary/90">
            Ver Meu Pedido
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>

          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-background text-foreground text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300 hover:bg-muted/50">
            Continuar Comprando
            <ArrowRight
              className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <p className="font-sans text-xs text-muted-foreground tracking-widest mb-2">
            Dúvidas sobre seu pedido?
          </p>
          <Link
            href="/contact"
            className="font-sans text-sm text-primary hover:text-primary/80 transition-colors duration-300 underline underline-offset-4">
            Entre em contato com nosso atendimento
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
