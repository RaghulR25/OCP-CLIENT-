import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X, Home, User, Calendar, MessageCircle, LogOutIcon } from "lucide-react";
import Footer from "./Footer";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            {user && user.role !== "counselor" && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-blue-500 transition"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <span className="font-bold text-2xl tracking-wide hover:text-gray-200 transition">
              Counseling Platform
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="hover:text-gray-200 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                {/* Hide email on small screens */}
                <span className="font-medium bg-blue-500 px-3 py-1 rounded-md shadow hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md shadow font-medium transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {user && user.role !== "counselor" && (
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col justify-between">
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-blue-600">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-md"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex flex-col gap-4 p-4 text-gray-700">
              <Link
                to="/"
                className="flex items-center gap-3 hover:text-blue-600 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="h-5 w-5" /> Home
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 hover:text-blue-600 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <Calendar className="h-5 w-5" /> Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 hover:text-blue-600 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <User className="h-5 w-5" /> Profile
              </Link>
              <button
                className="flex items-center gap-3 hover:text-blue-600 transition"
                onClick={logout}
              >
                <LogOutIcon className="h-5 w-5" /> Logout
              </button>
            </div>

            {/* Hide user email in sidebar on small screens */}
            <span className="font-medium bg-blue-500 text-white px-3 py-3 rounded-md shadow my-96 hidden sm:block">
              {user.email}
            </span>

            <Footer />
          </div>
        </div>
      )}

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-opacity-30 z-40"
        />
      )}
    </>
  );
};

export default Navbar;
