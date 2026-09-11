// 💡 export 키워드를 붙여서 다른 파일에서 import 할 수 있게 만든다!

export interface Category {
    id: number;
    name: string;
    type?: string; // 백엔드의 PRODUCT, BOARD 등의 타입 구분용 (선택적)
}

// [추가됨] 핵심 특징(Features) 1개에 대한 모양
export interface ProductFeature {
    icon: string;
    title: string;
    desc: string;
}

// [추가됨] 기술 스펙(Specs) 1개에 대한 모양
export interface ProductSpec {
    label: string;
    value: string
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    model_number: string;
    is_visible: boolean;
    display_order: number; // [추가됨]
    created_at: string;

    // (선택적 속성들)
    procurement_code?: string;
    description?: string;
    image_url?: string;
    catalog_url?: string;
    features?: ProductFeature[]; // [추가됨] 객체 배열
    specs?: ProductSpec[]; // [추가됨] 객체 배열

}
