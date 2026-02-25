import { montserrat, playfair } from "@/fonts";
import { Navbar } from "@/components/store/navbar";
import { Footer } from "@/components/store/footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${playfair.variable} ${montserrat.variable} font-sans theme-luxury`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
