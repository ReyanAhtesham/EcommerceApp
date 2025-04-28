import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiShoppingCart, HiSearch, HiUser, HiX, HiMenu } from "react-icons/hi";

// Define the props that Navbar will accept
interface NavbarProps {
  cartCount: number;
}

export function Navbar({ cartCount }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-yellow-400 text-3xl font-extrabold mr-1">RJ</span>
          <span className="text-white text-2xl font-bold">Ecommerce</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 flex-grow justify-center">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors font-medium">Home</Link>
          {/* <Link to="/products" className="text-white hover:text-yellow-400 transition-colors font-medium">Products</Link> */}
          <button
            onClick={() => {
                const section = document.getElementById("products");
                section?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-white hover:text-yellow-400 transition-colors font-medium hover:cursor-pointer"
            >
            Products
            </button>
          <Link to="/about" className="text-white hover:text-yellow-400 transition-colors font-medium">About</Link>
          <Link to="/contact" className="text-white hover:text-yellow-400 transition-colors font-medium">Contact</Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Feature */}
          <div className="hidden md:block">
            {isSearchVisible ? (
              <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="px-4 py-2 bg-gray-700 text-white border-none focus:outline-none w-64"
                  placeholder="Search products..."
                  autoFocus
                />
                <button 
                  onClick={toggleSearch}
                  className="text-gray-300 hover:text-white px-3"
                >
                  <HiX className="text-xl" />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Search"
              >
                <HiSearch className="text-xl" />
              </button>
            )}
          </div>

          {/* Shopping Cart */}
          {isLoggedIn && <div className="relative">
            <Link to="/cart" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <HiShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          }

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              aria-label="User menu"
            >
              <HiUser className="text-2xl" />
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-xl py-1 z-10">
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors">Orders</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors border-t border-gray-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin} 
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      Login
                    </button>
                    <Link to="/register" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors border-t border-gray-200">Create Account</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <HiMenu className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col space-y-3">
            <Link to="/" className="text-white hover:text-yellow-400 transition-colors py-2">Home</Link>
            <Link to="/products" className="text-white hover:text-yellow-400 transition-colors py-2">Products</Link>
            <Link to="/about" className="text-white hover:text-yellow-400 transition-colors py-2">About</Link>
            <Link to="/contact" className="text-white hover:text-yellow-400 transition-colors py-2">Contact</Link>
          </div>
          
          {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
               {/* Mobile Search */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="px-4 py-2 bg-gray-700 text-white border-none flex-grow focus:outline-none"
                placeholder="Search products..."
              />
              <button className="text-gray-300 hover:text-white px-3">
                <HiSearch className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
