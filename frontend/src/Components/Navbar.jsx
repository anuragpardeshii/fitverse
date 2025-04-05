import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaTrophy,
  FaWallet,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdFitness } from "react-icons/io";
import { BiRun } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, balance, loading } = useAuth();
  console.log("Auth state:", { user, loading });
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  useEffect(() => {
    if (location.pathname === "/login") return;
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  if (location.pathname === "/login") return null;
  if (loading) {
    return (
      <nav className="bg-white backdrop-blur-sm bg-opacity-90 border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <IoMdFitness className="text-3xl text-blue-600" />
              <h1 className="text-3xl font-bold">
                <span className="text-gray-800">Fit</span>
                <span className="text-blue-600">Verse</span>
              </h1>
            </div>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }
  if (!user) return null;

  const navItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard className="text-blue-500" />,
    },
    {
      path: "activity",
      label: "Activity",
      icon: <BiRun className="text-green-500" />,
    },
    {
      path: "challenges",
      label: "Challenges",
      icon: <IoMdFitness className="text-purple-500" />,
    },
    {
      path: "rewards",
      label: "Rewards",
      icon: <FaTrophy className="text-amber-500" />,
    },
  ];

  const activeClassName = "text-blue-600 font-semibold";
  const inactiveClassName =
    "text-gray-700 hover:text-blue-500 transition-colors duration-200";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsDropdownOpen(false);
    }
  };

  const isPathActive = (path) => {
    return location.pathname === `/${path}`;
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <nav className="bg-white backdrop-blur-sm bg-opacity-90 border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <NavLink to="/dashboard" className="flex items-center space-x-2">
              <IoMdFitness className="text-3xl text-blue-600" />
              <h1 className="text-3xl font-bold">
                <span className="text-gray-800">Fit</span>
                <span className="text-blue-600">Verse</span>
              </h1>
            </NavLink>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <ul className="flex space-x-3 lg:space-x-6 text-lg">
                {navItems.map(({ path, label, icon }) => (
                  <li key={path}>
                    <NavLink
                      to={`/${path}`}
                      className={({ isActive }) =>
                        `flex items-center space-x-1 py-1 px-2 rounded-md transition-all duration-200 ${
                          isActive ? activeClassName : inactiveClassName
                        }`
                      }
                    >
                      <span className="hidden lg:block">{icon}</span>
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 flex items-center px-4 py-2 rounded-full border border-green-100 text-green-600 font-medium">
                  <span className="mr-2">💰</span>
                  <span>{balance ?? 0} Coins</span>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex items-center space-x-2 focus:outline-none group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
                      <img
                        src={user?.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.target.src = "/default-profile.png"; // Use a default profile image
                        }}
                      />
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-12 mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50 animate-fadeIn">
                      <div className="p-3 border-b border-gray-100">
                        <p className="font-medium text-gray-800 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                      <ul>
                        <li>
                          <NavLink
                            to="/my-profile"
                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            My Profile
                          </NavLink>
                        </li>
                        <li>
                          <button
                            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150"
                            onClick={() => {
                              logout();
                              navigate("/", { replace: true });
                            }}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex md:hidden items-center space-x-3">
              <div className="bg-green-50 flex items-center px-3 py-1.5 rounded-full text-green-600 text-sm font-medium border border-green-100">
                <span className="mr-1">💰</span>
                <span>{balance ?? 0}</span>
              </div>

              <button
                className="mobile-menu-button p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                onClick={toggleMobileMenu}
              >
                <FaBars size={20} className="text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
              ref={mobileMenuRef}
              className="fixed inset-x-4 top-20 bg-white rounded-2xl shadow-xl z-50 transform transition-all duration-300 ease-out overflow-hidden"
              style={{ maxHeight: "calc(100vh - 6rem)" }}
            >
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-blue-200 flex items-center justify-center overflow-hidden">
                        {user?.profilePicture ? (
                          <img
                            src={user?.profilePicture}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                              e.target.src = "/default-profile.png"; // Use a default profile image
                            }}
                          />
                        ) : (
                          <FaUserCircle className="text-gray-400 text-3xl" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-100 border border-white shadow-sm text-green-600 rounded-full px-2 py-0.5 text-xs font-bold">
                        {balance ?? 0}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-3 overflow-auto">
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map(({ path, label, icon }) => {
                    const active = isPathActive(path);
                    return (
                      <NavLink
                        key={path}
                        to={`/${path}`}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
                          active
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div
                          className={`text-2xl mb-2 ${
                            !active ? "text-opacity-80" : ""
                          }`}
                        >
                          {icon}
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                      </NavLink>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2">
                  <NavLink
                    to="/my-profile"
                    className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserCircle className="text-gray-500" />
                    <span>My Profile</span>
                  </NavLink>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/", { replace: true });
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-red-50 rounded-xl text-red-600 font-medium hover:bg-red-100 transition-colors"
                  >
                    <FaTimes className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
