import { useGetTopProductsQuery } from "../redux/api/productsApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
     <div className="flex px-12 py-2">
  {/* Left side - products (1/3) */}
  <div className="flex-3 grid grid-cols-2 gap-x-12 justify-between">
    {data.map((product) => (
      <SmallProduct key={product._id} product={product} />
    ))}
  </div>

  {/* Right side - carousel (2/3) */}
  <div className="flex-[5]">
    <ProductCarousel />
  </div>
</div>

    </>
  );
};

export default Header;