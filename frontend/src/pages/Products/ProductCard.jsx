import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg flex flex-col h-[320px] transition-shadow duration-300 hover:bg-[#181818] hover:shadow-md hover:shadow-fuchsia-950 group">
    <div className="relative h-[180px] overflow-hidden">
        <img
        src={p.image}
        alt={p.name}
        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 text-pink-600 font-bold bg-neutral-900 text-xs px-2 py-1 rounded-full">
          {p.brand}
        </span>
        <HeartIcon product={p} />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
       <Link to={`/product/${p._id}`} className="cursor-pointer " >
        <div className="hover:translate-y-0.1 hover:text-purple-300">
          <h3 className=" font-semibold text-base mb-1 line-clamp-2 ">
            {p.name}
          </h3>
          <p className="text-sm line-clamp-2 ">
            {p.description}
          </p>
        </div>
        </Link>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-pink-400 font-bold text-sm">
            ${p.price.toLocaleString()}
          </span>
          <button
            className="p-2 rounded-full cursor-pointer hover:text-amber-300"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
   
  );
};

export default ProductCard;