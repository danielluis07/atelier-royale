import { RegisterForm } from "@/components/auth/register-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role) {
    redirect(`/${session.user.role}`);
  }

  return <RegisterForm />;
};

export default RegisterPage;
