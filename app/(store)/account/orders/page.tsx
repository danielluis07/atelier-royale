import { requireUser } from "@/lib/auth-utils";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { OrdersSkeleton } from "@/components/skeletons/store/orders-skeleton";
import { OrdersList } from "@/components/store/account/orders/orders-list";

export const metadata: Metadata = {
  title: "Meus Pedidos | Atelier Royale",
};

const OrdersPage = async () => {
  const { user } = await requireUser();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      {/* Back link + Header */}
      <div className="mb-14">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          Minha conta
        </Link>

        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase font-sans text-primary mb-3 block">
            Pedidos
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl tracking-tight text-foreground">
            Meus pedidos
          </h1>
        </div>
      </div>

      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersList userId={user.id} />
      </Suspense>
    </div>
  );
};

export default OrdersPage;
