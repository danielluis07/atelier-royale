import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const OrderPageHeader = ({
  orderNumber,
  createdAt,
}: {
  orderNumber: number;
  createdAt: Date;
}) => {
  return (
    <div className="mb-14">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Meus pedidos
      </Link>

      <div>
        <span className="text-[10px] tracking-[0.4em] uppercase font-sans text-primary mb-3 block">
          Pedido #{orderNumber}
        </span>
        <h1 className="font-serif text-3xl lg:text-4xl tracking-tight text-foreground">
          Detalhes do pedido
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          Realizado em{" "}
          {format(createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
            locale: ptBR,
          })}
        </p>
      </div>
    </div>
  );
};
