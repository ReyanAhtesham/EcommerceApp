import { useState, useEffect, useRef } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import "./Navigation.css";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const dropdownRef = useRef(null);

  const [logoutApiCall] = useLogoutMutation();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  // ✅ Optional: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-16 hover:w-auto min-w-16 h-screen fixed`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center">
        <Link to="/" className="flex items-center mb-16 mt-4">
          <AiOutlineHome size={26} />
          <span className="hidden nav-item-name ml-2">HOME</span>
        </Link>

        <Link to="/shop" className="flex items-center mb-16">
          <AiOutlineShopping size={26} />
          <span className="hidden nav-item-name ml-2">SHOP</span>
        </Link>

        <Link to="/cart" className="flex mb-16">
          <div className="flex items-center">
            <AiOutlineShoppingCart className="mr-2" size={26} />
            <span className="hidden nav-item-name">Cart</span>
          </div>
        </Link>

        <Link to="/favorite" className="flex items-center mb-16">
          <FaHeart size={20} className="ml-1" />
          <span className="hidden nav-item-name ml-2">Favorites</span>
        </Link>
      </div>

      <div className="mt-auto">
        {userInfo ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center text-white focus:outline-none"
            >
              <span className="hidden nav-item-name cursor-pointer">{userInfo.username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${dropdownOpen ? "transform rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </button>

            {dropdownOpen && (
              <ul
                className={`absolute right-0 mt-2 mr-14 space-y-2 bg-gray-800 text-white cursor-pointer ${
                  !userInfo.isAdmin ? "-top-20" : "-top-80"
                }`}
              >
                {userInfo.isAdmin && (
                  <>
                    <li>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/allproductslist"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categorylist"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orderlist"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        Users
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-600"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logoutHandler();
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <ul>
            <li>
              <Link to="/login" className="flex items-center mb-6">
                <AiOutlineLogin size={26} />
                <span className="hidden nav-item-name ml-2">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="flex items-center">
                <AiOutlineUserAdd size={26} />
                <span className="hidden nav-item-name ml-2">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
