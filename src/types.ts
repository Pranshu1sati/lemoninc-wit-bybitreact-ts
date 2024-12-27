export interface Variant {
  option: string;
  values: string[];
}

export interface Combination {
  combination: string;
  sku: string;
  quantity: number;
  inStock: boolean;
}

export interface Product {
  name: string;
  category: string;
  brand: string;
  image: string;
  variants: Variant[];
  combinations: Combination[];
  price: number;
  discount?: {
    method: string;
    value: number;
  };
}

export interface Category {
  id: string;
  name: string;
  products?: Product[];
}
