import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length ;

  return (
    <div className="absolute left-9">
      {favoriteCount > 0 && (
        <span className="px-0.5 py-0 text-sm font-light text-white bg-pink-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;