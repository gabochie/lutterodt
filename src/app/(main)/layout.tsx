import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ContentGate } from "@/components/home/ContentGate";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ContentGate>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ContentGate>
  );
}
