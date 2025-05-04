
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {

  const dispatch = useDispatch();
  const [showCategories, setShowCategories] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
    maxPrice: priceFilter ? parseFloat(priceFilter) : undefined,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        if (priceFilter.trim() === "") {
          dispatch(setProducts(filteredProductsQuery.data));
          return;
        }
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          return product.price <= parseFloat(priceFilter);
        });
  
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);
  

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 pl-12 py-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <aside className="bg-gradient-to-br from-[#191616] to-neutral-950 text-white p-4 rounded-xl w-full md:w-[250px] sticky top-4 h-fit">
        <h2 onClick={() => setShowCategories(!showCategories)} 
            className="text-center text-lg font-semibold py-2 bg-black rounded-full mb-4 cursor-pointer hover:bg-blue-950">
          Filter by Categories
        </h2>
        {showCategories && 
        <div className="space-y-3">
          {categories?.map((c) => (
            <label key={c._id} className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                className="w-4 h-4 text-pink-500 bg-gray-100 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm">{c.name}</span>
            </label>
          ))}
        </div>}

        <h2  onClick={() => setShowBrands(!showBrands)}
            className="text-center text-lg font-semibold py-2 bg-black rounded-full my-4 cursor-pointer hover:bg-indigo-950">
          Filter by Brands
        </h2>
       {showBrands &&
        <div className="space-y-3">
          {uniqueBrands.map((brand, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name="brand"
                onChange={() => handleBrandClick(brand)}
                className="w-4 h-4 text-pink-500"
              />
              <span className="ml-2 text-sm">{brand}</span>
            </label>
          ))}
        </div>
       }

        <h2 className="text-center text-lg font-semibold py-2 bg-black rounded-full my-4 cursor-pointer hover:bg-purple-950"
            onClick={() => setShowPrice(!showPrice)}
        >
          Filter by Price
        </h2>
       { showPrice &&
        <input
          type="text"
          placeholder="Enter Maximum Price"
          value={priceFilter}
          onChange={handlePriceChange}
          className="w-full px-3 py-2 mb-4 text-white placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
        />
        }
        <button
          className="w-full py-2 border border-pink-500 rounded text-pink-500 hover:bg-pink-500 hover:text-white transition"
          onClick={() => window.location.reload()}
        >
          Reset
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <h2 className="text-center text-xl font-semibold mb-4">
          {products?.length} Products
        </h2>

        {products.length === 0 ? (
          <Loader />
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
