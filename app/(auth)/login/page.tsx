import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role) {
    redirect(`/${session.user.role}`);
  }

  return <LoginForm />;
};

export default LoginPage;
