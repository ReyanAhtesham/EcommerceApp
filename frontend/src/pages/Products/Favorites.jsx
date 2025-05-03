import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import SmallProduct from "./SmallProduct";
const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] pt-[3rem]">
        FAVORITE PRODUCTS
      </h1>
      
      {favorites && <div className="flex flex-wrap">
        {favorites.map((product) => (
            <>
          <SmallProduct key={product._id} product={product} />
          </>
        ))}
      </div>}
    </div>
  );
};

export default Favorites;