import React, { useState } from "react";
import { HiShoppingCart, HiHeart, HiStar } from "react-icons/hi";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: number;
  imageUrl: string;
  onAddToCart: (id: number) => void;
}

export function ProductCard({ 
  id,
  name, 
  description, 
  price, 
  originalPrice, 
  rating, 
  imageUrl, 
  onAddToCart 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(id);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl bg-white transition-all duration-300 transform hover:-translate-y-1 mx-6 my-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative ">
        <img 
          className="w-full h-64 object-cover transition-transform duration-700 ease-in-out" 
          src={imageUrl} 
          alt={name}
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        
        {/* Discount Badge */}
        {originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            {Math.round((1 - (parseFloat(price.replace(/[^0-9.-]+/g, "")) / parseFloat(originalPrice.replace(/[^0-9.-]+/g, "")))) * 100)}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        {/* <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-colors"
        >
          <HiHeart 
            className={`text-xl ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
          />
        </button>*/}
      </div> 
      
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <HiStar 
              key={i} 
              className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-lg`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
        </div>
        
        <h2 className="font-bold text-xl text-gray-800 mb-1">{name}</h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        
        <div className="flex items-center">
          <span className="text-gray-800 font-bold text-xl">{price}</span>
          {originalPrice && (
            <span className="text-gray-500 line-through text-sm ml-2">{originalPrice}</span>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <HiShoppingCart className="text-lg" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}