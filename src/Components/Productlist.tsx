import React from "react";
import { Product, Category } from "../types";

interface Productlist {
  //   onAddCategory: () => void;
  //   onAddProduct?: () => void;
  categories: Category[];
  products: Product[];
}

const Productlist: React.FC<Productlist> = ({
  //   onAddCategory,
  //   onAddProduct,
  categories,
  products,
}) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#F8F8F8] rounded-xl shadow-sm hover:shadow-md transition-shadow 
              duration-200 p-4 md:p-6 h-screen"
            >
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                {category.name}
              </h2>

              <div className="space-y-4">
                {products.filter(
                  (product) => product.category === category.name
                ).length > 0 ? (
                  products
                    .filter((product) => product.category === category.name)
                    .map((product) => (
                      <div
                        key={product?.name}
                        className="bg-white mb-4 flex gap-4 p-2 rounded-lg shadow-md"
                      >
                        <div className="flex-1 bg-gray-200 rounded-md overflow-hidden">
                          {product?.image && (
                            <img
                              className="object-cover w-full h-full "
                              src={product?.image}
                              alt={product?.name}
                            />
                          )}
                        </div>
                        <div className="flex-[2]">
                          <div className="text-sm font-medium">
                            {product?.name}
                          </div>
                          <div className=" text-sm mb-2">₹{product?.price}</div>
                          <div className="p-1 bg-sky-100 text-primary w-fit rounded-md text-xs">
                            {product?.brand}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="rounded-lg p-6 bg-gray-50 text-center">
                    <p className="text-sm text-gray-500">
                      No products available in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Productlist;
