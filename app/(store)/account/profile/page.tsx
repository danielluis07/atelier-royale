import { ProfileClient } from "@/components/store/account/profile/client";
import { requireUser } from "@/lib/auth-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil | Atelier Royale",
};

const ProfilePage = async () => {
  await requireUser();

  return <ProfileClient />;
};

export default ProfilePage;
