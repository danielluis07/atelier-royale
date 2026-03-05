import { Receipt } from "lucide-react";
import { centsToReais } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
  debit_card: "Cartão de débito",
  boleto: "Boleto",
};

const OrderPaymentSection = ({
  payment,
}: {
  payment: {
    paymentMethod: string | null;
    amount: number;
    createdAt: Date;
  } | null;
}) => {
  if (!payment) {
    return null;
  }

  return (
    <div className="border border-border">
      <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-border bg-muted/30">
        <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
          <Receipt className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-serif text-base text-foreground">Pagamento</h2>
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            Informações do pagamento
          </p>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Método
          </p>
          <p className="font-sans text-sm text-foreground">
            {payment.paymentMethod
              ? (PAYMENT_METHOD_LABELS[payment.paymentMethod] ??
                payment.paymentMethod)
              : "—"}
          </p>
        </div>
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Valor
          </p>
          <p className="font-sans text-sm text-foreground">
            {centsToReais(payment.amount)}
          </p>
        </div>
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Data
          </p>
          <p className="font-sans text-sm text-foreground">
            {format(payment.createdAt, "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentSection;
