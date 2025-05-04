import { useGetTopProductsQuery } from "../../redux/api/productsApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 lg:block xl:block md:block w-full max-w-[40rem] ml-auto">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[40rem]  lg:w-[40rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[28rem]"
                />

                <div className="mt-4 flex justify-between">
                  <div className="one">
                    <h2>{name}</h2>
                    <p className="text-amber-200"> $ {price}</p>
                    <p className="w-[21rem] text-sm font-light pt-4.5">
                      {description.substring(0, 100)} ...
                    </p>
                  </div>

                  <div className="flex justify-between w-[20rem]">
                    <div className="one">
                      <h1 className="flex items-center mb-4">
                        <FaStore className="mr-2 text-white text-sm font-light" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-4">
                        <FaClock className="mr-2 text-white text-sm font-light" /> Added:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-4">
                        <FaStar className="mr-2 text-white text-sm font-light" /> Reviews:{" "}
                        {numReviews}
                      </h1>
                    </div>

                    <div className="two">
                      <h1 className="flex items-center mb-4">
                        <FaStar className="mr-2 text-white !text-sm !font-light" /> Ratings:{" "}
                        {Math.round(rating)}
                      </h1>
                     {userInfo && userInfo.isAdmin && <h1 className="flex items-center mb-4">
                        <FaShoppingCart className="mr-2 text-white !text-sm !font-light" /> Quantity:{" "}
                        {quantity}
                      </h1>}
                      <h1 className="flex items-center mb-4">
                        <FaBox className="mr-2 text-white !text-sm !font-light" /> In Stock:{" "}
                        {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;