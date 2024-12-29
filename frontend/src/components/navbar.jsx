import { Link } from 'react-router-dom';
import { Home, Mic, Info, FileText } from 'lucide-react';

const isActive = (path) => {
  //Implementation for isActive function.  This is a placeholder.  Replace with your actual implementation.
  return window.location.pathname === path ? 'bg-blue-600 text-white' : '';
};

const Navbar = () => {
  return (
    <nav className="top-0 bg-transparent h-full fixed left-0 rounded-lg justify-center w-16 bg-gray-900 flex flex-col items-center py-8 space-y-8">
      <Link to="/main" className={`p-3 rounded-lg hover:bg-blue-600 transition-colors ${isActive('/main')}`}>
        <Home className="text-white h-6 w-6" />
      </Link>
      <Link to="/audio-search" className={`p-3 rounded-lg hover:bg-blue-600 transition-colors ${isActive('/audio-search')}`}>
        <Mic className="text-white h-6 w-6" />
      </Link>
      <Link to="/form" className={`p-3 rounded-lg hover:bg-blue-600 transition-colors ${isActive('/form')}`}>
        <FileText className="text-white h-6 w-6" />
      </Link>
      <Link to="/about" className={`p-3 rounded-lg hover:bg-blue-600 transition-colors ${isActive('/about')}`}>
        <Info className="text-white h-6 w-6" />
      </Link>
    </nav>
  );
};

export default Navbar;

