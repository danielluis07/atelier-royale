import { Truck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { centsToReais } from "@/lib/utils";

export const OrderSummaryCard = ({
  orderNumber,
  createdAt,
  updatedAt,
  totalAmount,
}: {
  orderNumber: number;
  createdAt: Date;
  updatedAt: Date;
  totalAmount: number;
}) => {
  return (
    <div className="border border-border">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-border bg-muted/30">
        <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
          <Truck className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-serif text-base text-foreground">Resumo</h2>
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            Informações do pedido
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Número do pedido
          </p>
          <p className="font-sans text-sm font-medium text-foreground">
            #{orderNumber}
          </p>
        </div>
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Data do pedido
          </p>
          <p className="font-sans text-sm text-foreground">
            {format(createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Última atualização
          </p>
          <p className="font-sans text-sm text-foreground">
            {format(updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>

        <div className="h-px bg-border" />

        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Total
          </p>
          <p className="font-serif text-xl text-foreground">
            {centsToReais(totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};
