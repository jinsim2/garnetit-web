"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Product, Category } from "@/types/product";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // DB에서 가져올 실제 데이터 상태
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 컴포넌트가 처음 열릴 때 실행
    useEffect(() => {
        // 1. 카테고리 목록을 가져온다. (category_id를 '이름'으로 변환하기 위해 필요)
        fetch("/api/v1/categories/")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        // 2. 제품 목록을 가져온다.
        fetchProducts();
    }, []);

    // 제품 목록 불러오기 함수
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/v1/products/");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("제품 로딩 실패: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    // 카테고리 번호(id)를 던져주면 한글 이름으로 바꿔주는 마법의 함수
    const getCategoryName = (id: number) => {
        const target = categories.find(c => c.id === id);
        return target ? target.name : "미분류";
    };

    // 휴지통 버튼 클릭 시 실행될 삭제 함수
    const handleDelete = async (productId: number) => {
        const isConfirm = window.confirm("정말 이 제품을 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)");
        if (!isConfirm) return;

        try {
            // [추가됨] 로컬 스토리지에서 출입증(토큰) 꺼내기
            const token = localStorage.getItem('admin_token');

            const res = await fetch(`/api/v1/products/${productId}`, {
                method: "DELETE",
                headers: {
                    // [추가됨] 헤더에 토큰 달아서 보내기
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert("성공적으로 삭제되었습니다.")
                fetchProducts(); // 리스트 새로고침
            } else {
                alert("삭제에 실패했습니다.")
            }
        } catch (error) {
            console.error("삭제 에러: ", error);
            alert("서버 통신 에러가 발생했습니다.");
        }
    };

    // 검색어에 맞게 제품 걸러내기 (프론트엔드 필터링)
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.model_number.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="space-y-6 max-w-full overflow-hidden animate-in fade-in duration-300">
            {/* 1. 상단 헤더 영역 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-800">제품 관리</h1>
                <Link
                    href="/garnet-adm/dashboard/products/new"
                    className="flex items-center justify-center gap-2 bg-[#C1121F] hover:bg-red-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto"
                >
                    <Plus size={18} />
                    제품 등록
                </Link>
            </div>
            {/* 2. 필터 및 검색 영역 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="제품명, 모델명 검색.."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shrink-0">
                        <Filter size={18} />
                    </button>
                </div>
                <div className="text-sm text-slate-500 w-full md:w-auto text-left md:text-right">
                    총 <span className="font-bold text-slate-800">{filteredProducts.length}</span>개의 제품
                </div>
            </div>
            {/* 3. 데이터 테이블 영역 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto w-full">
                <Table className="min-w-full">
                    <TableHeader className="bg-slate-50 border-b border-slate-100">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="hidden md:table-cell w-[80px] text-center font-semibold text-slate-600">ID</TableHead>
                            <TableHead className="hidden md:table-cell font-semibold text-slate-600">카테고리</TableHead>
                            <TableHead className="font-semibold text-slate-600 min-w-[120px]">제품명</TableHead>
                            <TableHead className="hidden lg:table-cell font-semibold text-slate-600">모델명</TableHead>
                            <TableHead className="text-center font-semibold text-slate-600 w-[70px]">상태</TableHead>
                            <TableHead className="hidden md:table-cell text-center font-semibold text-slate-600 w-[120px]">등록일</TableHead>
                            <TableHead className="text-center w-[90px] font-semibold text-slate-600">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C1121F]" />
                                    <p className="mt-2 text-sm">데이터를 불러오는 중입니다...</p>
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-medium">
                                    등록된 제품이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50">
                                    <TableCell className="hidden md:table-cell text-center text-slate-500">{product.id}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                                            {getCategoryName(product.category_id)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-800 max-w-[120px] md:max-w-[200px] truncate">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-slate-600">{product.model_number}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${product.is_visible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                            }`}>
                                            {product.is_visible ? "ON" : "OFF"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-center text-slate-500 text-sm">
                                        {/* 백엔드에서 온 날짜를 2026. 8. 28. 형식의 깔끔한 한국 시간으로 변환합니다 */}
                                        {new Date(product.created_at).toLocaleDateString("ko-KR")}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {/* 수정 버튼: 클릭 시 제품 ID를 가지고 수정 페이지로 이동 예정 */}
                                            <Link
                                                href={`/garnet-adm/dashboard/products/edit/${product.id}`}
                                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50" title="수정">
                                                <Edit size={16} />
                                            </Link>

                                            {/* 삭제 버튼: 누르면 바로 DB 날려버림! */}
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50" title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
