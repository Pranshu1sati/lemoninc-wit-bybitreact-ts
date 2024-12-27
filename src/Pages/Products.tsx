import { Link } from "react-router-dom";
import Productlist from "../Components/Productlist";

import useStore from "../store";
import AddCategoryDialog from "../Components/AddCategoryDialog";
// import { useStore } from "../store";

const Products = () => {
  const store = useStore();

  // console.log("Store", store?.products);

  return (
    <div className="flex w-full flex-row flex-wrap justify-between space-y-3 sm:space-y-0 items-center">
      <div className="text-2xl sm:ml-8 lg:ml-0 sm:text-2xl text-center md:text-left lg:text-3xl font-semibold text-gray-900 w-screen sm:w-40">
        Products
      </div>
      <div className="flex gap-3 w-full lg:w-[25%] sm:w-2/5 md:justify-end ">
        {/* <button
          //   onClick={onAddCategory}
          className="flex-1 sm:flex-none px-3 py-2  border border-gray-300 
              rounded-lg text-sm bg-[#E1E7EB] font-semibold text-[#1F8CD0] hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200 w-1/2"
        >
          Add Category
        </button> */}
        <AddCategoryDialog />
        <Link
          to={"/add"}
          className="flex-1 sm:flex-none px-3 py-2  bg-[#1F8CD0] 
                text-white rounded-lg text-sm font-semibold hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-colors duration-200 w-1/2 text-center"
        >
          {/* <button
          > */}
          Add Product
          {/* </button> */}
        </Link>
      </div>

      <div className="w-full h-full ">
        <Productlist
          categories={store?.categories}
          products={store?.products}
        />
      </div>
    </div>
  );
};

export default Products;
