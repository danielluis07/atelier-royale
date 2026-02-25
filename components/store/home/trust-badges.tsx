import { Gem, Truck, ShieldCheck, RotateCcw } from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "Autenticidade Garantida",
    description:
      "Cada peça é verificada e acompanha certificado de autenticidade, garantindo a procedência que você merece.",
  },
  {
    icon: Truck,
    title: "Entrega com Cuidado",
    description:
      "Embalagem artesanal premium e entrega em mãos com seguro total. Uma experiência do início ao fim.",
  },
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    description:
      "Pagamento criptografado e proteção completa ao comprador. Sua tranquilidade é nossa prioridade.",
  },
  {
    icon: RotateCcw,
    title: "Troca Sem Complicações",
    description:
      "Política de troca de 30 dias sem perguntas. Porque sua satisfação não é negociável.",
  },
];

export function TrustBadges() {
  return (
    <section className="py-24 lg:py-32 border-y border-border">
      <div className="max-w-360 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-6 border border-border flex items-center justify-center transition-all duration-500 group-hover:border-primary group-hover:bg-primary/5">
                  <Icon
                    className="w-6 h-6 text-primary transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={1}
                  />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-3 tracking-wide">
                  {feature.title}
                </h3>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
