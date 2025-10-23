import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Crosshair,
  AlertTriangle,
  Phone
} from 'lucide-react';

interface LocationMapProps {
  location?: string;
  coordinates?: { lat: number; lng: number };
  isEmergency?: boolean;
  showControls?: boolean;
  onLocationSelect?: (coordinates: { lat: number; lng: number }, address: string) => void;
  className?: string;
  height?: string;
}

export function LocationMap({ 
  location, 
  coordinates, 
  isEmergency = false,
  showControls = false,
  onLocationSelect,
  className = "",
  height = "300px"
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapZoom, setMapZoom] = useState(15);

  // Puerto Princesa City center coordinates (City Hall area)
  const defaultCenter = { lat: 9.7392, lng: 118.7353 };
  const displayCoords = coordinates || currentLocation || defaultCenter;

  // Get current location with proper error handling
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      setCurrentLocation(defaultCenter);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(coords);
        
        // Simulate reverse geocoding
        const address = "Current Location, Puerto Princesa City, Palawan";
        if (onLocationSelect) {
          onLocationSelect(coords, address);
        }
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = 'Unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = `Location error: ${error.message || 'Unknown error'}`;
            break;
        }
        
        // Only log for development, don't show error to user
        if (process.env.NODE_ENV === 'development') {
          console.warn('Geolocation error:', errorMessage);
        }
        
        // Fallback to Puerto Princesa center
        setCurrentLocation(defaultCenter);
        setIsLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  const zoomIn = () => setMapZoom(prev => Math.min(prev + 1, 20));
  const zoomOut = () => setMapZoom(prev => Math.max(prev - 1, 1));

  // Simulate map click for location selection
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onLocationSelect) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simulate coordinate calculation based on click position (simplified)
    const latOffset = (y - rect.height / 2) / rect.height * 0.01;
    const lngOffset = (x - rect.width / 2) / rect.width * 0.01;
    
    const newCoords = {
      lat: displayCoords.lat - latOffset,
      lng: displayCoords.lng + lngOffset
    };
    
    const address = `Selected Location, Puerto Princesa City, Palawan`;
    onLocationSelect(newCoords, address);
  };

  return (
    <Card className={className}>
      
      
    </Card>
  );
}