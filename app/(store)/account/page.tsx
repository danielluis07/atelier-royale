import { requireUser } from "@/lib/auth-utils";
import type { Metadata } from "next";
import Link from "next/link";
import {
  User,
  Package,
  ChevronRight,
  Heart,
  MapPin,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { SignOutButton } from "@/components/store/account/sign-out-button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Minha Conta | Atelier Royale",
};

const MENU_SECTIONS = [
  {
    title: "Minha conta",
    items: [
      {
        href: "/account/profile",
        icon: User,
        label: "Meu perfil",
        description: "Dados pessoais e preferências",
      },
      {
        href: "/account/orders",
        icon: Package,
        label: "Meus pedidos",
        description: "Acompanhe suas compras",
      },
    ],
  },
  {
    title: "Configurações",
    items: [
      {
        href: "/account/addresses",
        icon: MapPin,
        label: "Endereços",
        description: "Gerencie seus endereços de entrega",
      },
      {
        href: "/account/wishlist",
        icon: Heart,
        label: "Lista de desejos",
        description: "Peças que você salvou",
      },
      {
        href: "/account/payments",
        icon: CreditCard,
        label: "Formas de pagamento",
        description: "Cartões e métodos salvos",
      },
    ],
  },
] as const;

const AccountPage = async () => {
  const { user } = await requireUser();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      {/* Header */}
      <div className="mb-14">
        <span className="text-[10px] tracking-[0.4em] uppercase font-sans text-primary mb-4 block">
          Minha conta
        </span>
        <h1 className="font-serif text-3xl lg:text-4xl tracking-tight text-foreground">
          Área do cliente
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Left: User card */}
        <div className="lg:col-span-1">
          <div className="border border-border p-8 text-center">
            {/* Avatar */}
            {user.image ? (
              <div className="relative size-20 mx-auto mb-6">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto mb-6 bg-foreground text-background flex items-center justify-center font-serif text-xl tracking-wide">
                {initials}
              </div>
            )}

            <h2 className="font-serif text-lg text-foreground mb-1">
              {user.name}
            </h2>
            <p className="font-sans text-xs text-muted-foreground tracking-wide mb-8">
              {user.email}
            </p>

            {/* Divider */}
            <div className="h-px w-full bg-border mb-6" />

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <ShieldCheck
                className="w-3.5 h-3.5 text-primary"
                strokeWidth={1.5}
              />
              <span className="font-sans text-[11px] tracking-wide">
                Conta verificada
              </span>
            </div>

            {/* Sign out */}
            <SignOutButton />
          </div>
        </div>

        {/* Right: Menu sections */}
        <div className="lg:col-span-2 space-y-12">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-5">
                {section.title}
              </h3>

              <div className="space-y-0 border border-border divide-y divide-border">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center gap-5 p-5 sm:p-6 hover:bg-muted/50 transition-colors duration-300">
                      <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0 group-hover:border-primary transition-colors duration-300">
                        <Icon
                          className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-sans text-sm text-foreground block mb-0.5">
                          {item.label}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>

                      <ChevronRight
                        className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
                        strokeWidth={1.5}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
