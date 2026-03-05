import { CartClientSkeleton } from "@/components/skeletons/store/cart-client-skeleton";
import { ClearCartButton } from "@/components/store/cart/clear-cart-button";
import { CartClient } from "@/components/store/cart/client";
import { db } from "@/db";
import { userAddress } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sacola | Atelier Royale",
};

const CartPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id || "";

  const [address] = await db
    .select({
      id: userAddress.id,
    })
    .from(userAddress)
    .where(eq(userAddress.userId, userId));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Continuar comprando
          </Link>
          <h1 className="font-serif text-3xl lg:text-4xl tracking-tight text-foreground">
            Sua Sacola
          </h1>
        </div>
        <ClearCartButton />
      </div>

      <Suspense fallback={<CartClientSkeleton />}>
        <CartClient addressId={address?.id} />
      </Suspense>
    </div>
  );
};

export default CartPage;
