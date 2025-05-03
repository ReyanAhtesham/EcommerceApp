import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import AdminMenu from "./AdminMenu";
import { useAllProductsQuery } from "../../redux/api/productsApiSlice";

const AllProducts = () => {
  const [sortOption, setSortOption] = useState("default");

  const {
    data: allProducts,
    isLoading,
    isError,
    refetch,
  } = useAllProductsQuery(undefined, {
    refetchOnMountOrArgChange: true, 
  });

  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    if (allProducts) {
      let sorted = [...allProducts];
      switch (sortOption) {
        case "recent":
          sorted.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "priceLowHigh":
          sorted.sort((a, b) => a.price - b.price);
          break;
        case "priceHighLow":
          sorted.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
      setSortedProducts(sorted);
    }
  }, [allProducts, sortOption]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row">
        <div className="p-3 flex-1">
          <div className="ml-4 text-xl font-bold mb-2">
            All Products ({sortedProducts.length})
          </div>

          {/* Sort Dropdown */}
          <div className="ml-4 mb-4">
            <label className="mr-2 font-medium">Sort by:</label>
            <select
              className="border rounded px-3 py-1 bg-gray-800 text-white"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="recent">Most Recent</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-center">
            {sortedProducts.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block mb-4 w-full max-w-4xl border-b border-gray-300 pb-4"
              >
                <div className="flex">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[10rem] object-cover"
                  />
                  <div className="p-4 flex flex-col justify-around w-full">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xl font-semibold">{product.name}</h5>
                      <p className="text-amber-100 text-xs">
                        {moment(product.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {product.description?.substring(0, 160)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800"
                      >
                        Update Product
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                      <p className="text-green-400 font-medium">
                        $ {product.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="md:w-1/4 p-3 mt-2">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
