import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplet, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'DONOR') return '/donor';
    if (user?.role === 'HOSPITAL') return '/hospital';
    return '/';
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    const path = getDashboardPath();
    // Dispatch event to reset any active dashboard tabs to 'overview'
    window.dispatchEvent(new CustomEvent('reset-dashboard-tab', { detail: 'overview' }));
    navigate(path, { state: { tab: 'overview', timestamp: Date.now() } });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 text-gray-900 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group active:scale-95 transition-transform duration-150">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Lifeline <span className="text-red-600 font-semibold text-sm">Blood Bank</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDashboardClick}
                className="text-xs font-bold px-3 py-1.5 rounded bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                Dashboard
              </button>
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-gray-900 block">{user?.name}</span>
                <span className="text-[10px] text-gray-600 uppercase font-semibold">{user?.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded text-gray-500 hover:text-red-700 hover:bg-gray-100 active:scale-90 transition-all duration-150"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold text-gray-700 hover:text-gray-900 px-3.5 py-1.5 rounded-md hover:bg-gray-100 active:scale-95 transition-all duration-150 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
              <Link
                to="/register/donor"
                className="text-xs font-bold btn-primary px-4 py-1.5 active:scale-95 transition-all duration-150 transform hover:-translate-y-0.5 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
