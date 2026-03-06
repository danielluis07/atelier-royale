import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCep } from "@/lib/utils";

export const OrderDeliverySection = ({
  delivery,
}: {
  delivery: {
    recipientName: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    trackingCode: string | null;
    carrier: string | null;
    dispatchedAt: Date | null;
    deliveredAt: Date | null;
  } | null;
}) => {
  if (!delivery) {
    return null;
  }

  const hasDeliveryAddress =
    delivery.street &&
    delivery.number &&
    delivery.neighborhood &&
    delivery.city &&
    delivery.state &&
    delivery.zipCode;

  return (
    <div className="border border-border">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-border bg-muted/30">
        <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-serif text-base text-foreground">Entrega</h2>
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            Endereço e rastreamento
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
            Destinatário
          </p>
          <p className="font-sans text-sm text-foreground">
            {delivery.recipientName}
          </p>
        </div>

        {hasDeliveryAddress && (
          <div>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
              Endereço
            </p>
            <p className="font-sans text-sm text-foreground leading-relaxed">
              {delivery.street}, {delivery.number}
              {delivery.complement ? ` · ${delivery.complement}` : ""}
              <br />
              {delivery.neighborhood} · {delivery.city}/{delivery.state}
              <br />
              CEP {formatCep(delivery.zipCode)}
            </p>
          </div>
        )}

        {(delivery.trackingCode || delivery.carrier) && (
          <div className="border-t border-border pt-5 space-y-4">
            {delivery.carrier && (
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
                  Transportadora
                </p>
                <p className="font-sans text-sm text-foreground">
                  {delivery.carrier}
                </p>
              </div>
            )}
            {delivery.trackingCode && (
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
                  Código de rastreio
                </p>
                <p className="font-sans text-sm font-medium text-foreground tracking-wide">
                  {delivery.trackingCode}
                </p>
              </div>
            )}
          </div>
        )}

        {(delivery.dispatchedAt || delivery.deliveredAt) && (
          <div className="border-t border-border pt-5 space-y-4">
            {delivery.dispatchedAt && (
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
                  Despachado em
                </p>
                <p className="font-sans text-sm text-foreground">
                  {format(delivery.dispatchedAt, "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            )}
            {delivery.deliveredAt && (
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
                  Entregue em
                </p>
                <p className="font-sans text-sm text-foreground">
                  {format(delivery.deliveredAt, "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
