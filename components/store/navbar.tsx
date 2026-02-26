"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = ["Camisas", "Ternos", "Camisas", "Relógios", "Sapatos"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-foreground text-background text-center py-2 text-xs tracking-[0.3em] uppercase font-sans">
        Frete grátis em compras acima de R$ 500
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 border-b",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-border shadow-sm"
            : "bg-background border-transparent",
        )}>
        <div className="max-w-360 mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-center group">
              <span className="font-serif text-2xl lg:text-3xl tracking-[0.15em] text-foreground transition-colors duration-300">
                ATELIER
              </span>
              <span className="font-serif text-[10px] lg:text-xs tracking-[0.5em] text-primary uppercase -mt-1">
                ROYALE
              </span>
            </Link>
            {/* Left Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_ITEMS.map((item, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-xs tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors duration-300 relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                aria-label="Buscar"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
              </button>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                <User className="w-4.5 h-4.5" strokeWidth={1.5} />
              </Link>
              <button
                aria-label="Carrinho de compras"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative">
                <ShoppingBag className="size-4.5" strokeWidth={1.5} />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[9px] flex items-center justify-center rounded-full">
                  0
                </span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu">
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500 bg-background border-t border-border",
            mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
          )}>
          <div className="px-6 py-8 space-y-6">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={i}
                href="#"
                className="block text-sm tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
            <div className="flex items-center gap-6 pt-4 border-t border-border">
              <Search
                className="w-4.5 h-4.5 text-muted-foreground"
                strokeWidth={1.5}
              />
              <User
                className="w-4.5 h-4.5 text-muted-foreground"
                strokeWidth={1.5}
              />
              <ShoppingBag
                className="w-4.5 h-4.5 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
