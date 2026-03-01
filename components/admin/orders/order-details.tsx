import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DELIVERY_STATUS_LABELS, ORDER_STATUS_LABELS } from "@/constants";
import { centsToReais, formatCep } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

const formatDateTime = (value: Date | null | undefined) => {
  if (!value) {
    return "-";
  }

  return format(value, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

const badgeVariantByOrderStatus = {
  pending_payment: "secondary",
  paid: "default",
  processing: "default",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
  refunded: "secondary",
} as const;

const badgeVariantByDeliveryStatus = {
  processing: "secondary",
  dispatched: "secondary",
  in_transit: "default",
  delivered: "default",
  failed: "destructive",
} as const;

export const OrderDetails = ({
  orderData,
  items,
}: {
  orderData: {
    id: string;
    orderNumber: number;
    userId: string;
    userName: string;
    userEmail: string;
    status: keyof typeof ORDER_STATUS_LABELS;
    subtotalAmount: number;
    shippingAmount: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    deliveryStatus: keyof typeof DELIVERY_STATUS_LABELS | null;
    trackingCode: string | null;
    carrier: string | null;
    recipientName: string | null;
    zipCode: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    dispatchedAt: Date | null;
    deliveredAt: Date | null;
  };
  items: {
    id: string;
    productNameSnapshot: string;
    variantNameSnapshot: string;
    skuSnapshot: string;
    priceAtTime: number;
    quantity: number;
  }[];
}) => {
  const hasDeliveryAddress =
    orderData.street &&
    orderData.number &&
    orderData.neighborhood &&
    orderData.city &&
    orderData.state &&
    orderData.zipCode;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pedido #{orderData.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">
            Detalhes completos do pedido e entrega.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/orders">Voltar para pedidos</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumo do pedido</CardTitle>
            <CardDescription>Informações de status e valores.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={badgeVariantByOrderStatus[orderData.status]}>
                {ORDER_STATUS_LABELS[orderData.status]}
              </Badge>
              {orderData.deliveryStatus ? (
                <Badge
                  variant={
                    badgeVariantByDeliveryStatus[orderData.deliveryStatus]
                  }>
                  {DELIVERY_STATUS_LABELS[orderData.deliveryStatus]}
                </Badge>
              ) : (
                <Badge variant="outline">Sem entrega</Badge>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Subtotal</p>
                <p className="mt-1 font-medium">
                  {centsToReais(orderData.subtotalAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Frete</p>
                <p className="mt-1 font-medium">
                  {centsToReais(orderData.shippingAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="mt-1 font-semibold">
                  {centsToReais(orderData.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Criado em</p>
                <p className="mt-1 font-medium">
                  {formatDateTime(orderData.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Atualizado em</p>
                <p className="mt-1 font-medium">
                  {formatDateTime(orderData.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Itens</p>
                <p className="mt-1 font-medium">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
            <CardDescription>Dados do comprador.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="font-medium">{orderData.userName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{orderData.userEmail}</p>
            </div>
            <Button variant="secondary" asChild className="w-full">
              <Link href={`/admin/users/${orderData.userId}`}>
                Ver perfil do usuário
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens do pedido</CardTitle>
          <CardDescription>Snapshot dos produtos comprados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Qtd.</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium">{item.productNameSnapshot}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.variantNameSnapshot}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{item.skuSnapshot}</TableCell>
                  <TableCell className="text-right">
                    {centsToReais(item.priceAtTime)}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    {centsToReais(item.priceAtTime * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entrega</CardTitle>
          <CardDescription>Endereço e rastreamento.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Destinatário</p>
            <p className="mt-1 font-medium">{orderData.recipientName || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Transportadora</p>
            <p className="mt-1 font-medium">{orderData.carrier || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Código de rastreio</p>
            <p className="mt-1 font-medium">{orderData.trackingCode || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Despachado em</p>
            <p className="mt-1 font-medium">
              {formatDateTime(orderData.dispatchedAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entregue em</p>
            <p className="mt-1 font-medium">
              {formatDateTime(orderData.deliveredAt)}
            </p>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-muted-foreground">Endereço</p>
            {hasDeliveryAddress ? (
              <p className="mt-1 font-medium">
                {orderData.street}, {orderData.number}
                {orderData.complement ? `, ${orderData.complement}` : ""} ·{" "}
                {orderData.neighborhood} · {orderData.city}/{orderData.state} ·
                CEP {orderData.zipCode ? formatCep(orderData.zipCode) : "-"}
              </p>
            ) : (
              <p className="mt-1 font-medium">-</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
