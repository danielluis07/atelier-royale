import Link from "next/link";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { XIcon } from "@/components/icons/x-icon";

const footerLinks = {
  "A Maison": ["Nossa História", "Artesãos", "Sustentabilidade", "Carreiras"],
  Atendimento: [
    "Central de Ajuda",
    "Política de Trocas",
    "Rastrear Pedido",
    "Contato",
  ],
  Legal: ["Termos de Uso", "Privacidade", "Cookies", "Acessibilidade"],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="max-w-360 mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <span className="font-serif text-2xl tracking-[0.15em] text-background">
                ATELIER
              </span>
              <span className="font-serif text-xs tracking-[0.5em] text-primary block -mt-1">
                ROYALE
              </span>
            </Link>

            <p className="font-sans text-sm text-background/40 leading-relaxed max-w-xs mb-8">
              Curadoria de peças excepcionais para aqueles que entendem que o
              verdadeiro luxo está na qualidade, na história e no detalhe.
            </p>

            <div className="flex items-center gap-5">
              {[InstagramIcon, FacebookIcon, XIcon].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 border border-background/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-300">
                  <Icon
                    className="w-4 h-4 text-background/50 hover:text-primary"
                    strokeWidth={1.5}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-background/30 mb-6">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="font-sans text-sm text-background/50 hover:text-primary transition-colors duration-300">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-background/30 mb-6">
              Contato
            </h4>
            <div className="space-y-4 font-sans text-sm text-background/50">
              <p>contato@atelierroyale.com</p>
              <p>+55 (11) 9999-9999</p>
              <p>
                Seg — Sex
                <br />
                10h — 19h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/5">
        <div className="max-w-360 mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[11px] text-background/20 tracking-wide">
            &copy; {new Date().getFullYear()} Atelier Royale. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-6">
            {["Visa", "Mastercard", "Amex", "Pix"].map((method) => (
              <span
                key={method}
                className="font-sans text-[10px] text-background/15 tracking-[0.2em] uppercase">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
