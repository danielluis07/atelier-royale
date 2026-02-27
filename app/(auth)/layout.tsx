import { playfair, montserrat } from "@/fonts";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} ${montserrat.variable} font-sans theme-luxury min-h-screen grid grid-cols-1 lg:grid-cols-2`}>
      {/* Left: Brand panel */}
      <div className="hidden lg:flex relative flex-col items-center justify-center bg-foreground text-background px-12 overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20" />

        {/* Decorative border lines */}
        <div className="absolute inset-8 border border-background/10" />

        <div className="relative z-10 text-center max-w-sm">
          {/* Logo */}
          <Link href="/" className="inline-flex flex-col items-center mb-12">
            <span className="font-serif text-4xl tracking-[0.2em] text-background">
              ATELIER
            </span>
            <span className="font-serif text-xs tracking-[0.6em] text-background/60 -mt-0.5">
              ROYALE
            </span>
          </Link>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-background/20" />
            <div className="w-1.5 h-1.5 rotate-45 border border-background/30" />
            <div className="h-px w-12 bg-background/20" />
          </div>

          {/* Tagline */}
          <p className="font-serif text-xl tracking-wide leading-relaxed text-background/80 mb-4">
            A arte da elegância
            <br />
            redefinida
          </p>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-background/40">
            Exclusividade em cada detalhe
          </p>
        </div>
      </div>

      {/* Right: Form area */}
      <div className="flex flex-col min-h-screen">
        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center pt-12 pb-4">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="font-serif text-2xl tracking-[0.2em] text-foreground">
              ATELIER
            </span>
            <span className="font-serif text-[10px] tracking-[0.5em] text-primary -mt-0.5">
              ROYALE
            </span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {children}
        </div>

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            &copy; {new Date().getFullYear()} Atelier Royale. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
