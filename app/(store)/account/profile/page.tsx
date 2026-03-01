import { ProfileForm } from "@/components/store/account/profile/profile-form";
import { db } from "@/db";
import { userAddress, userProfile } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser } from "@/lib/auth-utils";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProfileFormSkeleton } from "@/components/skeletons/store/profile-form-skeleton";

export const metadata: Metadata = {
  title: "Meu Perfil | Atelier Royale",
};

const ProfilePage = async () => {
  const { user } = await requireUser();

  const [profile, defaultAddress] = await Promise.all([
    db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, user.id))
      .then((res) => res[0] ?? null),
    db
      .select()
      .from(userAddress)
      .where(
        and(eq(userAddress.userId, user.id), eq(userAddress.isDefault, true)),
      )
      .then((res) => res[0] ?? null),
  ]);

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
            Perfil
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl tracking-tight text-foreground">
            Meus dados
          </h1>
        </div>
      </div>

      <Suspense fallback={<ProfileFormSkeleton />}>
        <ProfileForm
          name={user.name}
          email={user.email}
          profile={profile}
          // @ts-expect-error - State is defined as a string in the database, this will be fixed in a future PR
          defaultAddress={defaultAddress}
        />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
