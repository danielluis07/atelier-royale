import { OrderDetailLoading } from "@/components/skeletons/store/order-skeleton";
import { OrderMain } from "@/components/store/account/order";
import { requireUser } from "@/lib/auth-utils";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Meus Pedidos | Atelier Royale",
};

const OrderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await requireUser();

  return (
    <Suspense fallback={<OrderDetailLoading />}>
      <OrderMain orderId={id} userId={user.id} />
    </Suspense>
  );
};

export default OrderPage;
