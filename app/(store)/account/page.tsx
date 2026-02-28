import { Account } from "@/components/store/account";
import { requireUser } from "@/lib/auth-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Conta | Atelier Royale",
};

const AccountPage = async () => {
  const { user } = await requireUser();

  return (
    <Account
      user={{
        name: user.name,
        email: user.email,
        image: user.image ?? null,
      }}
    />
  );
};

export default AccountPage;
