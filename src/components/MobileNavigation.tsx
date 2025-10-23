import React from 'react';
import { Button } from './ui/button';
import { 
  ArrowLeft, 
  Home, 
  Plus, 
  Search, 
  AlertTriangle,
  Menu,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Page } from '../App';

interface MobileNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onBack?: () => void;
  title?: string;
  isOffline?: boolean;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

export function MobileNavigation({ 
  currentPage, 
  onNavigate, 
  onBack, 
  title, 
  isOffline = false,
  showBackButton = false,
  actions 
}: MobileNavigationProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (!isMobile) return null;

  const getPageTitle = () => {
    if (title) return title;
    
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'create-report': return 'Create Report';
      case 'sos': return 'Emergency SOS';
      case 'track-reports': return 'Track Reports';
      case 'staff-dashboard': return 'Staff Dashboard';
      default: return 'SafetyConnect';
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      icon: <Home className="w-5 h-5" />,
      label: 'Home',
      page: 'dashboard' as Page,
      disabled: isOffline
    },
    {
      id: 'create-report',
      icon: <Plus className="w-5 h-5" />,
      label: 'Report',
      page: 'create-report' as Page,
      disabled: isOffline
    },
    {
      id: 'sos',
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'SOS',
      page: 'sos' as Page,
      disabled: false // Always enabled, even offline
    },
    {
      id: 'track-reports',
      icon: <Search className="w-5 h-5" />,
      label: 'Track',
      page: 'track-reports' as Page,
      disabled: isOffline
    }
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showBackButton && onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Offline Indicator */}
            <div className="flex items-center space-x-1">
              {isOffline ? (
                <WifiOff className="w-4 h-4 text-red-500" />
              ) : (
                <Wifi className="w-4 h-4 text-green-500" />
              )}
              <span className={`text-xs ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                {isOffline ? 'Offline' : 'Online'}
              </span>
            </div>
            
            {actions && (
              <div className="flex items-center space-x-1">
                {actions}
              </div>
            )}
          </div>
        </div>
        
        {/* Offline Mode Banner */}
        {isOffline && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Offline Mode: Only SOS Emergency features are available
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.page ? "default" : "ghost"}
              size="sm"
              disabled={item.disabled}
              onClick={() => !item.disabled && onNavigate(item.page)}
              className={`flex flex-col items-center space-y-1 h-12 px-3 ${
                currentPage === item.page 
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' 
                  : item.disabled 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed navigation */}
      <div className="h-16 md:hidden"></div>
      <div className="h-20 md:hidden fixed bottom-0 left-0 right-0 pointer-events-none"></div>
    </>
  );
}