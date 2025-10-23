import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

interface NetworkStatusProps {
  isOffline: boolean;
}

export function NetworkStatus({ isOffline }: NetworkStatusProps) {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setShowStatus(true);
      toast.warning('You are currently offline', {
        description: 'Some features may be limited. Data will sync when you reconnect.',
        duration: 5000,
      });
    } else {
      if (showStatus) {
        toast.success('Connection restored', {
          description: 'You are back online. Data is now syncing.',
          duration: 3000,
        });
      }
      
      // Hide status after showing online notification
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, showStatus]);

  if (!showStatus) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
      isOffline 
        ? 'bg-red-100 text-red-800 border border-red-200' 
        : 'bg-green-100 text-green-800 border border-green-200'
    }`}>
      {isOffline ? (
        <WifiOff className="w-4 h-4" />
      ) : (
        <Wifi className="w-4 h-4" />
      )}
      {isOffline ? 'Offline' : 'Online'}
    </div>
  );
}