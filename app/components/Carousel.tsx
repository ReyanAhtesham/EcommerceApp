import React, { useState, useEffect, useCallback } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

type CarouselItem = {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export function Carousel() {
  // Sample carousel data
  const items: CarouselItem[] = [
    {
      id: 1,
      image: "/api/placeholder/1200/500",
      title: "Summer Collection",
      description: "Discover our latest summer styles with up to 40% off",
      buttonText: "Shop Now",
      buttonLink: "/collections/summer",
    },
    {
      id: 2,
      image: "/api/placeholder/1200/500",
      title: "New Arrivals",
      description: "Be the first to explore our fresh new products",
      buttonText: "Explore",
      buttonLink: "/new-arrivals",
    },
    {
      id: 3,
      image: "/api/placeholder/1200/500",
      title: "Limited Edition",
      description: "Exclusive products available for a limited time only",
      buttonText: "View Collection",
      buttonLink: "/limited-edition",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPaused, nextSlide]);

  return (
    <div 
      className="relative overflow-hidden w-full h-96 md:h-[500px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-full relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-black to-indigo-950 bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-lg">
                <h2 className="text-4xl font-bold mb-4">{item.title}</h2>
                <p className="text-lg mb-6">{item.description}</p>
                <a 
                  href={item.buttonLink} 
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  {item.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <HiChevronLeft className="text-2xl" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <HiChevronRight className="text-2xl" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? "bg-yellow-500" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}