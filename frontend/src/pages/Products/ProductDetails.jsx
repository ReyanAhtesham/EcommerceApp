import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Rating";
import ProductTabs from "./Tabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo)
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };
  
  const addToCartHandler = () => {
    console.log("Adding to cart")
    dispatch(addToCart({ ...product,qty}));
    console.log("Added to cart")
    navigate("/cart");
  };

  return (
    <>
      <div className="ml-[10rem] pt-4">
        <Link to="/" className="text-white font-semibold hover:underline">
          &larr; Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="ml-[10rem] mt-8 px-4">
          {/* TOP: Image + Product Info */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Image */}
            <div className="flex-1 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-[500px] rounded-xl shadow-lg"
              />
              <HeartIcon product={product} />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              <p className="text-gray-400 mb-6">{product.description}</p>

              <p className="text-4xl font-extrabold mb-6 text-pink-500">
                ${product.price}
              </p>

              <div className="grid grid-cols-2 gap-6 text-sm text-white">
                <div>
                  <p className="flex items-center gap-2">
                    <FaStore /> <span>Brand: {product.brand}</span>
                  </p>
                  <p className="flex items-center gap-2 mt-3">
                    <FaClock /> <span>Added: {moment(product.createdAt).fromNow()}</span>
                  </p>
                  <p className="flex items-center gap-2 mt-3">
                    <FaStar /> <span>Reviews: {product.numReviews}</span>
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2">
                    <FaStar /> <span>Rating: {product.rating}</span>
                  </p>
                 {qty &&
                 <p className="flex items-center gap-2 mt-3">
                    <FaShoppingCart /> <span>Quantity: {qty}</span>
                  </p>}
                  <p className="flex items-center gap-2 mt-3">
                    <FaBox /> <span>In Stock: {product.countInStock}</span>
                  </p>
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="mt-6 flex items-center gap-4">
                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-2 w-[6rem] rounded-lg text-green-700 border-1"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg"
                >
                  Add To Cart
                </button>
              </div>

              <div className="mt-6">
                <Ratings value={product.rating} text={`${product.numReviews} review(s)`} />
              </div>
            </div>
          </div>

          {/* Product Tabs (Reviews) */}
          <div className="mt-[1rem] pb-7">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;