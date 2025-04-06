// import { Welcome } from "../../components/welcome";
import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Carousel } from "~/components/Carousel";
import { Filters } from "~/components/Filter";
import { ProductCard } from "~/components/ProductCard";
import { Footer } from "~/components/Footer";
import './home.css'

export function meta() {
  return [
    { title: "RJ Ecommerce App" },
    { name: "description", content: "Welcome to RJ Ecommerce Online Store! Everything is just a click away" },
  ];
}

export default function Home() {
  const [cartItems, setCartItems] = useState<number>(0);

  const handleAddToCart = (id: number) => {
    setCartItems((prev) => prev + 1);
  };

  return (
    <div>
      <div className="blur z-50" style={{ top: "29%", left: "-8rem" }}></div>
      <Navbar cartCount={cartItems} />
      <Carousel />
      <div className="p-4">
        <Filters />
        <div id="products" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <ProductCard
            id={1}
            name="Product 1"
            description="This is product 1 description."
            price="$100"
            rating={4.5}
            imageUrl="https://dlmag.com/wp-content/uploads/2020/03/Polo-Ralph-Lauren-deep-blue-perfume-3.jpg"
            onAddToCart={handleAddToCart}
          />
          <ProductCard
            id={2}
            name="Product 2"
            description="This is product 2 description."
            price="$150"
            rating={4.0}
            imageUrl="https://cdn2.vox-cdn.com/uploads/chorus_asset/file/7390261/vpavic_161031_1256_0264.0.jpg"
            onAddToCart={handleAddToCart}
          />
          <ProductCard
            id={3}
            name="Product 3"
            description="This is product 3 description."
            price="$200"
            rating={4.8}
            imageUrl="https://cdn.pixabay.com/photo/2023/05/06/01/34/t-shirt-7973404_960_720.jpg"
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
