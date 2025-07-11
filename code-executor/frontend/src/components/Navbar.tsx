import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Code, BookOpen } from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/learn', label: 'Learn/Practice', icon: BookOpen },
    { path: '/quiz', label: 'Quiz', icon: Code },
    { path: '/notes', label: 'Notes', icon: BookOpen },
    { path: '/resources', label: 'Resources', icon: BookOpen },
  ];

  // Show hamburger menu if we're in a ChatCodePage (4 path segments: /learn/language/topic)
  const showHamburgerMenu = location.pathname.split('/').length === 4;

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {showHamburgerMenu && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-white hover:bg-white/10 transition-colors mr-4"
                title="Toggle sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">CTutor</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-2">
              <User className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Adithya</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;