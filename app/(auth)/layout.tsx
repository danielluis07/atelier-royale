import { playfair, montserrat } from "@/fonts";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} ${montserrat.variable} font-sans min-h-screen flex items-center justify-center`}>
      {children}
    </div>
  );
}
