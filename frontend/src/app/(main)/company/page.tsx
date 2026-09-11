import { redirect } from "next/navigation";

export default function CompanyRootPage() {
    // /company 로 접속하면 기본 탭인 '인사말(about)'로 튕겨냅니다.
    redirect("/company/about");
}
