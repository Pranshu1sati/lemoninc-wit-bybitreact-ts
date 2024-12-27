import { create } from "zustand";
import { Category, Product } from "../types";
import { devtools } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface Store {
  categories: Category[];
  products: Product[];
  addCategory: (name: string) => void;
  addProduct: (product: Product) => void;
}

const useStore = create<Store>()(
  devtools((set) => ({
    categories: [
      { id: "abc", name: "Shoes" },
      { id: "xyz", name: "T-shirt" },
    ],
    products: [
      {
        name: "Nike Air Max 270",
        category: "Shoes",
        brand: "Nike",
        image: "./Rectangle.png",
        variants: [
          { option: "Size", values: ["8", "9", "10"] },
          { option: "Color", values: ["Black", "White"] },
        ],
        combinations: [
          {
            combination: "8/Black",
            sku: "AIRMAX270-BLK-8",
            quantity: 5,
            inStock: true,
          },
          {
            combination: "9/White",
            sku: "AIRMAX270-WHT-9",
            quantity: 3,
            inStock: true,
          },
        ],
        price: 12999,
        discount: { method: "pct", value: 10 },
      },
      {
        name: "Nike Revolution 6",
        category: "Shoes",
        brand: "Nike",
        image: "./Rectangle.png",
        variants: [
          { option: "Size", values: ["7", "8", "9", "10"] },
          { option: "Color", values: ["Blue", "Gray"] },
        ],
        combinations: [
          {
            combination: "7/Blue",
            sku: "REV6-BLU-7",
            quantity: 8,
            inStock: true,
          },
          {
            combination: "10/Gray",
            sku: "REV6-GRY-10",
            quantity: 0,
            inStock: false,
          },
        ],
        price: 8499,
        discount: { method: "flat", value: 500 },
      },
    ],
    addCategory: (name: string) =>
      set((state) => {
        const newId = uuidv4();
        return { categories: [...state.categories, { id: newId, name }] };
      }),
    addProduct: (product: Product) =>
      set((state) => ({ products: [...state.products, product] })),
  }))
);

export default useStore;
