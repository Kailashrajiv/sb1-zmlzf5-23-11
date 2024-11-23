import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  TrendingUp, 
  ClipboardList, 
  Quote, 
  Settings, 
  ChevronLeft,
  LogOut,
  CreditCard,
  ChevronRight,
  Moon,
  Sun,
  Home,
  Newspaper
} from 'lucide-react';

type Page = 'home' | 'dashboard' | 'trends' | 'aluminum-shorts' | 'mcx-orders' | 'quote';

interface Props {
  currentPage: string;
  onPageChange: (page: Page) => void;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isDarkMode: boolean;
  onThemeChange: (isDark: boolean) => void;
}

export default function Sidebar({ 
  currentPage, 
  isCollapsed, 
  onCollapse,
  isDarkMode,
  onThemeChange
}: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Market Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'trends', label: 'Trends', icon: TrendingUp, path: '/trends' },
    { id: 'aluminum-shorts', label: 'Aluminum Shorts', icon: Newspaper, path: '/aluminum-shorts' },
    { id: 'quote', label: 'Get Quote', icon: Quote, path: '/quote' },
    { id: 'mcx-orders', label: 'Manage MCX Orders', icon: ClipboardList, path: '/mcx-orders' },
  ] as const;

  return (
    <div className="relative">
      <div 
        className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20
          ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <button
          onClick={() => onCollapse(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-3 py-2 mb-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-transparent bg-clip-text'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  {!isCollapsed && (
                    <span className={`ml-3 text-sm font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'
                        : ''
                    }`}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">Settings</span>
                )}
              </button>

              {/* Settings Dropdown */}
              {showSettings && !isCollapsed && (
                <div className="absolute bottom-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mb-1 overflow-hidden">
                  <button
                    onClick={() => onThemeChange(!isDarkMode)}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 mr-2" />
                    ) : (
                      <Moon className="w-4 h-4 mr-2" />
                    )}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button
                    onClick={() => setShowSubscription(true)}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Subscription
                  </button>
                  <button
                    onClick={() => setShowSignOutConfirm(true)}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}