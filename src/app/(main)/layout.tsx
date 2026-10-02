import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ContentGate } from "@/components/home/ContentGate";
import { PwaRegister } from "@/components/shared/PwaRegister";
import { BottomTabBar } from "@/components/shared/BottomTabBar";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ContentGate>
      <PwaRegister />
      <Header />
      <main className="flex-1 pb-[64px] md:pb-0">{children}</main>
      <Footer />
      <BottomTabBar />
      <InstallPrompt />
    </ContentGate>
  );
}