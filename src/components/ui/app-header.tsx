import { Bell, ChevronDown, Menu, User } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "./sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface AppHeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export function AppHeader({
  userName = "John Doe",
  userRole = "Admin",
  userAvatar,
}: AppHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual logout API endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming you store the token in localStorage
          },
        }
      );

      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      // Clear session storage
      sessionStorage.clear();

      // Redirect to login page
      navigate("/auth/signin");
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if API call fails, clear session and redirect
      localStorage.clear();
      navigate("/auth/signin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="h-15 border-b flex items-center justify-between px-4 bg-white">
      {/* Left section with menu toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right section with notifications and user profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-md hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="font-medium">{userName}</div>
              <div className="text-xs text-gray-500">{userRole}</div>
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
              <div className="md:p-4 p-2">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Profile
                </a>
                <a
                  href="#account"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  Account Settings
                </a>
                <hr className="my-1" />
                <button
                  role="menuitem"
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-md"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Log Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
