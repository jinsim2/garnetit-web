import HeroSection from "@/components/home/HeroSection";
import BusinessSection from "@/components/home/BusinessSection";
import ProductShowcase from "@/components/home/ProductShowcase";
import BannerSection from "@/components/home/BannerSection";


export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* 컴포넌트를 조합하여 단일 책임 원칙을 준수하는 엔터프라이즈 패턴 */}
      <HeroSection />
      <BusinessSection />
      <ProductShowcase />
      <BannerSection />

    </main>
  );
}
