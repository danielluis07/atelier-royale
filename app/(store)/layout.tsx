import { montserrat, playfair } from "@/fonts";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfair.variable} ${montserrat.variable} font-sans`}>
      {children}
    </div>
  );
}
