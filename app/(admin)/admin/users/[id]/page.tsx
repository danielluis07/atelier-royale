import { UserDetails } from "@/components/admin/users/user-details";
import { DetailsSkeleton } from "@/components/skeletons/admin/details-skeleton";
import { db } from "@/db";
import {
  order,
  orderDelivery,
  user,
  userAddress,
  userProfile,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth-utils";
import { and, count, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const UserDetailsContent = async ({ id }: { id: string }) => {
  const [userData] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      banned: user.banned,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
    })
    .from(user)
    .where(eq(user.id, id));

  if (!userData) {
    notFound();
  }

  const [profile, defaultAddress, totalOrders, recentOrders] =
    await Promise.all([
      db
        .select({
          document: userProfile.document,
          phone: userProfile.phone,
          birthDate: userProfile.birthDate,
        })
        .from(userProfile)
        .where(eq(userProfile.userId, id))
        .then(([result]) => result ?? null),
      db
        .select({
          label: userAddress.label,
          recipientName: userAddress.recipientName,
          zipCode: userAddress.zipCode,
          street: userAddress.street,
          number: userAddress.number,
          complement: userAddress.complement,
          neighborhood: userAddress.neighborhood,
          city: userAddress.city,
          state: userAddress.state,
        })
        .from(userAddress)
        .where(and(eq(userAddress.userId, id), eq(userAddress.isDefault, true)))
        .then(([result]) => result ?? null),
      db
        .select({ count: count() })
        .from(order)
        .where(eq(order.userId, id))
        .then(([result]) => result?.count ?? 0),
      db
        .select({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          deliveryStatus: orderDelivery.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
        })
        .from(order)
        .leftJoin(orderDelivery, eq(order.id, orderDelivery.orderId))
        .where(eq(order.userId, id))
        .orderBy(desc(order.createdAt))
        .limit(5),
    ]);

  return (
    <UserDetails
      userData={userData}
      profile={profile}
      defaultAddress={defaultAddress}
      totalOrders={totalOrders}
      recentOrders={recentOrders}
    />
  );
};

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;

  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <UserDetailsContent id={id} />
    </Suspense>
  );
};

export default UserPage;
