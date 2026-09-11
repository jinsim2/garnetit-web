import { redirect } from "next/navigation";

export default function ProductRootPage() {
    // /product 로 접속하면 자동으로 /product/cctv 로 튕겨낸다!
    redirect("/product/cctv");
}
