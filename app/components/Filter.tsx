import React, { useState } from "react";
import { HiFilter, HiChevronDown, HiX } from "react-icons/hi";

interface FilterOption {
  id: string;
  label: string;
}

export function Filters() {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  const categories: FilterOption[] = [
    { id: "electronics", label: "Electronics" },
    { id: "fashion", label: "Fashion" },
    { id: "home", label: "Home & Kitchen" },
    { id: "books", label: "Books" },
    { id: "toys", label: "Toys & Games" }
  ];
  
  const brands: FilterOption[] = [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "sony", label: "Sony" }
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
  };
  
  return (
    <div className="mb-6 mx-6">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <HiFilter />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      
      {/* Filter Content */}
      <div className={`bg-gradient-to-br from-white/15 via-white/30 to-white/20 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
      <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Filters</h3>
          
          {selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 ? (
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-200 hover:text-blue-300 flex items-center gap-1"
            >
              <HiX className="text-sm" /> Clear all
            </button>
          ) : null}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-100">Price Range</h4>
            <span className="text-sm text-gray-200">${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="w-1/2 accent-blue-600" 
            />
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="w-1/2 accent-blue-600" 
            />
          </div>
        </div>
        
        {/* Categories Filter */}
        <FilterSection 
          title="Categories" 
          options={categories}
          selectedOptions={selectedCategories}
          toggleOption={toggleCategory}
        />
        
        {/* Brands Filter */}
        <FilterSection 
          title="Brands" 
          options={brands}
          selectedOptions={selectedBrands}
          toggleOption={toggleBrand}
        />
        
        <button className="w-full mt-4 bg-blue-600 hover:bg-purple-700 hover:cursor-pointer text-white py-2 rounded-lg transition-colors font-medium">
          Apply Filters
        </button>
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedOptions: string[];
  toggleOption: (id: string) => void;
}

function FilterSection({ title, options, selectedOptions, toggleOption }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default
  
  return (
    <div className="mb-4 pb-4 border-b border-gray-200">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-2"
      >
        <h4 className="font-medium text-gray-200">{title}</h4>
        <HiChevronDown className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="space-y-2">
          {options.map(option => (
            <label key={option.id} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-gray-400">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
