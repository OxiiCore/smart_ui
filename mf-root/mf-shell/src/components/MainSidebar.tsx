import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { useI18n } from '../providers/I18nProvider';

// MobileSidebarContext for managing mobile sidebar state
interface MobileSidebarContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
  toggleSidebar: () => {},
});

export const useMobileSidebar = () => useContext(MobileSidebarContext);

// Type definitions for menu items
interface MenuItem {
  id: string;
  name: string;
  code: string;
  parent_id: string | null;
  workflow_id: string | null;
  children?: MenuItem[];
}

// MainSidebar component
export const MainSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useI18n();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle sidebar function
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        console.log("Fetching menus for sidebar...");
        console.log("Fetching all menus from API...");
        
        // This would be an actual API call in the real implementation
        const response = await fetch('/api/menus');
        if (!response.ok) {
          throw new Error('Failed to fetch menus');
        }
        
        const data = await response.json();
        console.log("Successfully fetched menus:", data.length, "items");
        
        // Filter menus that are not deleted (deleted_at is null)
        const filteredMenus = data.filter((menu: any) => menu.deleted_at === null);
        
        // Process menus to create a hierarchical structure
        const parentMenus = filteredMenus.filter((menu: MenuItem) => menu.parent_id === null);
        const childMenus = filteredMenus.filter((menu: MenuItem) => menu.parent_id !== null);
        
        // Add children to each parent menu
        parentMenus.forEach((parent: MenuItem) => {
          const children = childMenus.filter((child: MenuItem) => child.parent_id === parent.id);
          if (children.length > 0) {
            parent.children = children;
            console.log(`Menu '${parent.name}' has ${children.length} child menus`);
          }
        });
        
        setMenus(parentMenus);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };
    
    fetchMenus();
  }, []);

  // Check if the device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;
      console.log("Current screen size:", width < 768 ? "mobile" : "desktop", "width:", width);
      setIsMobile(width < 768);
    };
    
    // Set initial value
    checkIsMobile();
    
    // Listen for window resize events
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Filter menus based on search term
  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.children?.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MobileSidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      <div className="flex h-screen overflow-hidden">
        {/* Mobile hamburger menu button */}
        {isMobile && (
          <button 
            className="fixed z-50 top-[20px] left-4 p-2 rounded-md bg-primary text-white"
            onClick={toggleSidebar}
          >
            ☰
          </button>
        )}
        
        {/* Sidebar */}
        <div 
          className={`${
            isMobile 
              ? `fixed inset-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`
              : 'relative w-64 flex-shrink-0'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
        >
          {/* Mobile close button */}
          {isMobile && isOpen && (
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          )}
          
          {/* Logo and app name */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">SmartFlow</span>
            </div>
          </div>
          
          {/* Search box */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          
          {/* Menu list */}
          <div className="overflow-y-auto h-full pb-20">
            <ul className="p-4 space-y-1">
              {filteredMenus.map((menu) => (
                <li key={menu.id} className="mb-2">
                  <div className="font-medium text-gray-700 dark:text-gray-300 py-2">
                    {menu.name}
                  </div>
                  
                  {menu.children && menu.children.length > 0 && (
                    <ul className="ml-4 space-y-1">
                      {menu.children.map((child) => (
                        <li key={child.id}>
                          <Link 
                            href={`/submissions?menuId=${child.id}`}
                            onClick={() => isMobile && setIsOpen(false)}
                            className={`block py-2 px-3 rounded-md ${
                              location.includes(child.id) 
                                ? 'bg-primary text-white' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="flex-1 truncate">{child.name}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {/* Mobile sidebar backdrop */}
          {isMobile && isOpen && (
            <div 
              className="fixed inset-0 z-30 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            ></div>
          )}
          
          {/* Content */}
          <div className="container mx-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </MobileSidebarContext.Provider>
  );
};