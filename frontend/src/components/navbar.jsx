import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mic, Info } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="fixed left-0 rounded-lg justify-center w-16 bg-gray-900 flex flex-col items-center py-8 space-y-8">
      <Link to="/main" className={`p-3 rounded-lg hover:bg-blue-600 transition-colors ${isActive('/main')}`}>
        <Home className="text-white h-6 w-6" />
      </Link>
      <Link to="/audio-search" className={`p-3 rounded-lg hover:bg-blue-600 transition-colors ${isActive('/audio-search')}`}>
        <Mic className="text-white h-6 w-6" />
      </Link>
      <Link to="/about" className={`p-3 rounded-lg hover:bg-blue-600 transition-colors ${isActive('/about')}`}>
        <Info className="text-white h-6 w-6" />
      </Link>
    </nav>
  );
};

export default Navbar;