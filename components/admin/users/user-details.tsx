import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DELIVERY_STATUS_LABELS, ORDER_STATUS_LABELS } from "@/constants";
import { formatCep, formatCpfCnpj, formatPhoneBR } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

const formatDate = (value: Date | string | null | undefined) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

export const UserDetails = ({
  userData,
  profile,
  defaultAddress,
  totalOrders,
  recentOrders,
}: {
  userData: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    banned: boolean;
    createdAt: Date;
    emailVerified: boolean;
  };
  profile: {
    document: string | null;
    phone: string | null;
    birthDate: string | null;
  } | null;
  defaultAddress: {
    label: string | null;
    recipientName: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
  } | null;
  totalOrders: number;
  recentOrders: {
    id: string;
    orderNumber: number;
    status: keyof typeof ORDER_STATUS_LABELS;
    deliveryStatus: keyof typeof DELIVERY_STATUS_LABELS | null;
    totalAmount: number;
    createdAt: Date;
  }[];
}) => {
  const initials = userData.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const addressLine = defaultAddress
    ? `${defaultAddress.street}, ${defaultAddress.number}${defaultAddress.complement ? `, ${defaultAddress.complement}` : ""}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Usuário</h1>
          <p className="text-sm text-muted-foreground">
            Informações da conta e atividade recente.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/users">Voltar para usuários</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Dados principais do usuário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage
                  src={userData.image || "/images/user-placeholder.jpg"}
                  alt={userData.name}
                />
                <AvatarFallback>{initials || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold leading-none">{userData.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {userData.email}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Status da conta</p>
                <div className="mt-1">
                  {userData.banned ? (
                    <Badge variant="destructive">Banido</Badge>
                  ) : (
                    <Badge>Ativo</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Email verificado
                </p>
                <div className="mt-1">
                  {userData.emailVerified ? (
                    <Badge variant="default">Verificado</Badge>
                  ) : (
                    <Badge variant="secondary">Pendente</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cadastro</p>
                <p className="mt-1 font-medium">
                  {formatDate(userData.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total de pedidos
                </p>
                <p className="mt-1 font-medium">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Documento e contato.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Documento</p>
              <p className="font-medium">
                {profile?.document ? formatCpfCnpj(profile.document) : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="font-medium">
                {profile?.phone ? formatPhoneBR(profile.phone) : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nascimento</p>
              <p className="font-medium">{formatDate(profile?.birthDate)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pedidos recentes</CardTitle>
            <CardDescription>Últimos 5 pedidos desse usuário.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum pedido encontrado.
              </p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((orderItem) => (
                  <Link
                    key={orderItem.id}
                    href={`/admin/orders/${orderItem.id}`}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 transition-colors hover:bg-muted/40">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        Pedido #{orderItem.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(orderItem.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {ORDER_STATUS_LABELS[orderItem.status]}
                      </Badge>
                      {orderItem.deliveryStatus && (
                        <Badge variant="outline">
                          {DELIVERY_STATUS_LABELS[orderItem.deliveryStatus]}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço padrão</CardTitle>
            <CardDescription>Dados de entrega preferenciais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {defaultAddress ? (
              <>
                <p className="font-medium">
                  {defaultAddress.label || "Principal"} ·{" "}
                  {defaultAddress.recipientName}
                </p>
                <p>{addressLine}</p>
                <p>
                  {defaultAddress.neighborhood} · {defaultAddress.city}/
                  {defaultAddress.state}
                </p>
                <p>CEP {formatCep(defaultAddress.zipCode)}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Nenhum endereço padrão.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
