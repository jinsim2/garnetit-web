import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // 메인 웹사이트용 배경색과 글자색 적용
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
