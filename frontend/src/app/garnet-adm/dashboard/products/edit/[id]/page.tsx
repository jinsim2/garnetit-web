"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileText, Image as ImageIcon, Plus, Loader2 } from "lucide-react";

import type { Category, ProductFeature, ProductSpec } from "@/types/product";

// 💡 [추가됨] 관리자가 선택할 수 있는 아이콘 목록
const ICON_OPTIONS = [
    { value: "Check", label: "체크 (Check)" },
    { value: "Eye", label: "눈 (Eye)" },
    { value: "Zap", label: "번개 (Zap)" },
    { value: "Shield", label: "방패 (Shield)" },
    { value: "Settings", label: "설정 (Settings)" },
    { value: "Server", label: "서버 (Server)" },
    { value: "Video", label: "비디오 (Video)" },
    { value: "Wifi", label: "와이파이 (Wifi)" }
];

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();  // URL 파라미터 가져오기
    const productId = params.id;  // 현재 보고싶은 제품의 ID  /edit/1의 '1' 이다.

    // 1. 카테고리 목록 상태(백엔드에서 가져옴)
    const [categories, setCategories] = useState<Category[]>([]);

    // 2. 폼 입력값 상태 관리(사용자가 타자 치는 값들)
    const [formData, setFormData] = useState({
        categoryId: "",
        isVisible: "show",
        name: "",
        modelNumber: "",
        procurementCode: "",
        description: "",
        displayOrder: "0", // [추가됨] 정렬 순서 기본값 0
        isFeatured: "normal", // 💡 [추가됨] 기본값은 일반(normal)
    });

    // [추가됨] 동적 배열 상태 관리(초기값으로 빈 입력간 1개씩 세팅)
    const [features, setFeatures] = useState<ProductFeature[]>([{ icon: "Check", title: "", desc: "" }]);
    const [specs, setSpecs] = useState<ProductSpec[]>([{ label: "", value: "" }]);

    // 3. 파일 상태 관리 (실제 업로드할 파일 객체)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [catalogFile, setCatalogFile] = useState<File | null>(null);

    // [추가됨] 기존 파일 URL을 기억해둘 상태
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [existingCatalogUrl, setExistingCatalogUrl] = useState<string | null>(null);

    // 로딩 상태 (등록 버튼 누른 후 스피너용)
    const [isSubmitting, setIsSubmitting] = useState(false);


    // [최초 1회 실행] 백엔드에서 카테고리 목록을 가져온다.
    useEffect(() => {
        // 1. 카테고리 목록 가져오기 (기존과 동일)
        fetch("http://localhost:8000/api/v1/categories/")
            .then(res => res.json())
            .then(data => setCategories(data));

        // 2. [추가됨] productId가 있으면 백엔드에서 해당 제품 정보 가져오기
        if (productId) {
            fetch(`http://localhost:8000/api/v1/products/${productId}`)
                .then(res => res.json())
                .then(data => {
                    // 백엔드에서 받은 데이터를 폼 상태에 쏙쏙 채워넣기
                    setFormData({
                        categoryId: data.category_id.toString(),
                        isVisible: data.is_visible ? "show" : "hide",
                        name: data.name,
                        modelNumber: data.model_number || "",
                        procurementCode: data.procurement_code || "",
                        description: data.description || "",

                        // [추가됨] DB에 저장된 display_order 채우기
                        displayOrder: data.display_order?.toString() || "0",

                        // [추가됨] DB의 is_featured가 true면 featured, 아니면 normal
                        isFeatured: data.is_featured ? "featured" : "normal",
                    });

                    // 💡 [추가됨] DB에 저장된 JSON 객체 배열을 상태(State)에 그대로 꽂아주기!
                    // (만약 DB에 내용이 없으면 빈 입력칸 1개를 기본으로 띄워줌)
                    if (data.features && data.features.length > 0) {
                        setFeatures(data.features);
                    }
                    if (data.specs && data.specs.length > 0) {
                        setSpecs(data.specs);
                    }

                    // 기존에 등록해둔 파일이 있다면 URL 상태에 넣어주기
                    if (data.image_url) {
                        setExistingImageUrl(data.image_url);
                        // 백엔드의 uploads 폴더 이미지를 화면에 띄웁니다.
                        setPreviewUrl(data.image_url);
                    }
                    if (data.catalog_url) {
                        setExistingCatalogUrl(data.catalog_url);
                    }
                })
                .catch(err => console.error("카테고리 로딩 실패:", err));
        }
    }, [productId]);  // 외존형 배열에 productId 추가

    // 입력값이 변할 때 상태 업데이트하는 공통 함수
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // --- 💡 [추가됨] Features(특징) 제어 함수들 --
    const addFeatures = () => setFeatures([...features, { icon: "Check", title: "", desc: "" }]);
    const removeFeatures = (index: number) => setFeatures(features.filter((_, i) => i !== index));
    const handleFeatureChange = (index: number, field: keyof ProductFeature, value: string) => {
        const newFeatures = [...features];
        newFeatures[index][field] = value;
        setFeatures(newFeatures);
    };

    // --- 💡 [추가됨] Specs(스펙) 제어 함수들 ---
    const addSpec = () => setSpecs([...specs, { label: "", value: "" }]);
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
    const handleSpecChange = (index: number, field: keyof ProductSpec, value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    // 이미지 선택 시 미리보기 및 파일 저장
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file); // 실제 전송할 파일 저장

            // 미리보기용 URL 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    // 대망의 폼 전송 함수!
    const handleSubmit = async () => {
        // 필수값 검사 (새 파일이 없더라도 기존 이미지가 있으면 통과!)
        if (!formData.categoryId || !formData.name || !formData.modelNumber) {
            alert("카테고리, 제품명, 모델명은 필수입니다!");
            return;
        }
        if (!thumbnailFile && !existingImageUrl) {
            alert("썸네일 이미지는 필수입니다!");
            return;
        }
        setIsSubmitting(true);
        try {
            // STEP 1: 새로운 썸네일을 올렸을 때만 업로드, 아니면 기존 URL 재사용
            let imageUrl = existingImageUrl;
            if (thumbnailFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", thumbnailFile);
                const imageRes = await fetch("http://localhost:8000/api/v1/upload/", {
                    method: "POST",
                    body: imageFormData
                });
                const imageData = await imageRes.json();
                imageUrl = imageData.url;
            }
            // STEP 2: 새로운 카탈로그를 올렸을 때만 업로드, 아니면 기존 URL 재사용
            let catalogUrl = existingCatalogUrl;
            if (catalogFile) {
                const catalogFormData = new FormData();
                catalogFormData.append("file", catalogFile);
                const catalogRes = await fetch("http://localhost:8000/api/v1/upload/", { // 뒤에 슬래시(/) 주의
                    method: "POST",
                    body: catalogFormData
                });
                const catalogData = await catalogRes.json();
                catalogUrl = catalogData.url;
            }
            // STEP 3: 백엔드 DB 구조에 맞게 데이터 예쁘게 포장하기
            const payload = {
                category_id: parseInt(formData.categoryId),
                name: formData.name,
                model_number: formData.modelNumber,
                procurement_code: formData.procurementCode || null,
                description: formData.description || null,
                image_url: imageUrl,      // 새 URL 또는 기존 URL
                catalog_url: catalogUrl,  // 새 URL 또는 기존 URL
                is_visible: formData.isVisible === "show",
                is_featured: formData.isFeatured === "featured", // "feature"면 true, 아니면 false

                // [수정됨] 문자열 쪼개기가 아니라 진짜 객체 배열을 그대로 전송!
                // 단, 제목이나 라벨을 입력하지 않은 빈 칸은 filter로 무시한다.
                display_order: parseInt(formData.displayOrder) || 0,
                features: features.filter(f => f.title.trim() !== ""),
                specs: specs.filter(s => s.label.trim() !== ""),
            };
            // STEP 4: 폼 전송! (나머지는 기존과 동일)
            const token = localStorage.getItem('admin_token');
            const submitRes = await fetch(`http://localhost:8000/api/v1/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (submitRes.ok) {
                alert("제품이 성공적으로 수정되었습니다!");
                router.push("/garnet-adm/dashboard/products");
            } else {
                alert("수정에 실패했습니다. 관리자에게 문의하세요!")
            }
        } catch (error) {
            console.error("수정 중 에러 발생: ", error);
            alert("서버와 통신 중 문제가 발생했습니다!");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-in fade-in duration-300">
            {/* 1. 상단 헤더 & 뒤로가기 */}
            <div className="flex items-center gap-4">
                <Link
                    href="/garnet-adm/dashboard/products"
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">제품 수정</h1>
                    <p className="text-slate-500 text-sm mt-1">기존 제품의 상세 정보와 카탈로그를 수정합니다.</p>
                </div>
            </div>
            {/* 2. 등록 폼 영역 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* 카테고리 & 노출 상태 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">카테고리 <span className="text-[#C1121F]">*</span></label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] bg-white text-slate-800 transition-all"
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">홈페이지 노출 여부</label>
                            <select
                                name="isVisible"
                                value={formData.isVisible}
                                onChange={handleChange}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] bg-white text-slate-800 transition-all"
                            >
                                <option value="show">노출 (사용자에게 보임)</option>
                                <option value="hide">숨김 (임시저장 상태)</option>
                            </select>
                        </div>
                        {/* 💡 [새로 추가된 영역!] 메인 페이지 전시 여부 */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">⭐ 메인 쇼케이스 전시</label>
                            <select
                                name="isFeatured"
                                value={formData.isFeatured}
                                onChange={handleChange}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 transition-all"
                            >
                                <option value="normal">일반 (목록에만 노출)</option>
                                <option value="featured">🔥 메인 전시 (홈페이지 1면에 노출)</option>
                            </select>
                        </div>
                    </div>
                    {/* 제품명 & 모델명 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">제품명 <span className="text-[#C1121F]">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="예: AXGATE 40"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">모델명 <span className="text-[#C1121F]">*</span></label>
                            <input
                                type="text"
                                name="modelNumber"
                                value={formData.modelNumber}
                                onChange={handleChange}
                                placeholder="예: AX40"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                            />
                        </div>
                    </div>
                    {/* 조달식별번호 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 pr-3">조달물품 식별번호</label>
                        <input
                            type="text"
                            name="procurementCode"
                            value={formData.procurementCode}
                            onChange={handleChange}
                            placeholder="나라장터 식별번호 8자리를 입력하세요 (선택)"
                            className="w-full md:w-1/2 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] transition-all"
                        />
                    </div>
                    {/* 한 줄 설명 */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">제품 한 줄 설명</label>
                        <textarea
                            rows={2}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="제품 목록이나 카드에 보여질 핵심 특징을 간략히 적어주세요."
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] resize-none transition-all"
                        ></textarea>
                    </div>
                    {/* [추가됨] 정렬 순서 입력칸 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">정렬 순서(숫자가 클수록 우선순위 등)</label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>

                    {/* 💡 [교체됨] 핵심 특징 동적 폼 */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold">핵심 특징 (Features)</label>
                            <button type="button" onClick={addFeatures} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                                <Plus size={16} /> 특징 추가
                            </button>
                        </div>

                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-2 items-start border p-3 rounded-md bg-gray-50">
                                <select
                                    value={feature.icon}
                                    onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
                                    className="px-2 py-2 border rounded-md bg-white outline-none"
                                >
                                    {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>

                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                                        placeholder="특징 제목 (예: Full-HD 고해상도)"
                                        className="w-full px-3 py-2 border rounded-md outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={feature.desc}
                                        onChange={(e) => handleFeatureChange(index, "desc", e.target.value)}
                                        placeholder="상세 설명 (예: 1920x1080 해상도로...)"
                                        className="w-full px-3 py-2 border rounded-md outline-none text-sm"
                                    />
                                </div>

                                <button type="button" onClick={() => removeFeatures(index)} className="text-red-500 p-2 hover:bg-red-50 rounded-md">
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 💡 [추가됨] 기술 스펙 동적 폼 */}
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold">기술 스펙 (Specifications)</label>
                            <button type="button" onClick={addSpec} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                                <Plus size={16} /> 스펙 추가
                            </button>
                        </div>

                        {specs.map((spec, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={spec.label}
                                    onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                                    placeholder="항목명 (예: 최대 해상도)"
                                    className="w-1/3 px-3 py-2 border rounded-md outline-none"
                                />
                                <input
                                    type="text"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                    placeholder="내용 (예: 1920 x 1080 @ 30fps)"
                                    className="flex-1 px-3 py-2 border rounded-md outline-none"
                                />
                                <button type="button" onClick={() => removeSpec(index)} className="text-red-500 p-2 hover:bg-red-50 rounded-md">
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>

                    <hr className="border-slate-100" />
                    {/* 파일 업로드 영역 (이미지 & 카탈로그) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 썸네일 이미지 업로드 */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <ImageIcon size={18} className="text-slate-400" />
                                    제품 썸네일 이미지 <span className="text-[#C1121F]">*</span>
                                </label>
                                <span className="text-xs text-slate-400">권장: 800x800px (PNG)</span>
                            </div>
                            <label className={`
                                flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                                ${previewUrl ? 'border-[#C1121F] bg-red-50/10' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
                            `}>
                                {previewUrl ? (
                                    <div className="relative w-full h-full p-4 flex items-center justify-center group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain drop-shadow-md transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium flex items-center gap-2">
                                                <UploadCloud size={20} /> 이미지 변경
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                                        <UploadCloud size={40} className="mb-3 text-slate-300" />
                                        <p className="mb-2 text-sm font-semibold text-slate-600">클릭하여 이미지 업로드</p>
                                        <p className="text-xs text-slate-400">SVG, PNG, JPG (최대 5MB)</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        {/* 카탈로그 PDF 업로드 */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText size={18} className="text-slate-400" />
                                    제품 카탈로그 / 제안서
                                </label>
                                <span className="text-xs text-slate-400">PDF 전용</span>
                            </div>
                            <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${catalogFile ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                                    <FileText size={40} className={`mb-3 ${catalogFile ? 'text-blue-500' : 'text-slate-300'}`} />
                                    <p className="mb-2 text-sm font-semibold text-slate-600">
                                        {catalogFile ? catalogFile.name : "클릭하여 PDF 파일 첨부"}
                                    </p>
                                    <p className="text-xs text-slate-400">최대 20MB</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) setCatalogFile(e.target.files[0]);
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                {/* 3. 하단 액션 버튼 */}
                <div className="bg-slate-50 p-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-lg font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg font-medium text-white bg-[#C1121F] hover:bg-red-800 shadow-md transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isSubmitting ? '수정 중...' : '수정하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
