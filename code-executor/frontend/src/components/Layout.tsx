import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const showSidebar = location.pathname.startsWith('/learn/') && location.pathname.split('/').length > 2;
  const isInChatCodePage = location.pathname.split('/').length === 4; // /learn/language/topic

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        {showSidebar && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            forceCollapsible={isInChatCodePage}
          />
        )}
        <main className={`flex-1 transition-all duration-300 ${
          showSidebar && sidebarOpen ? 'lg:ml-80' : ''
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;