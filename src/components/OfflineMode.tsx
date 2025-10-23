import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  Phone, 
  Clock,
  WifiOff,
  Battery,
  Signal,
  MapPin,
  CheckCircle,
  Navigation
} from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner';

interface OfflineModeProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function OfflineMode({ user, onNavigate }: OfflineModeProps) {
  const [sosInitiated, setSosInitiated] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number; address: string} | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [offlineEmergencies, setOfflineEmergencies] = useState<any[]>([]);
  const [emergencyContacts] = useState([
    { name: 'CHO-HERO (HEALTH EMERGENCY RESPONSE OPERATION)', numbers: ['0917-777-7296', '0966-802-7420', '0950-491-2599', '0951-312-6727'], type: 'Health Emergency' },
    { name: 'PUERTO PRINCESA CITY 911', numbers: ['0927-797-2009', '0920-430-5378', '0917-112-0324'], type: 'Emergency Services' },
    { name: 'OSPITAL NG PALAWAN', numbers: ['0927-133-8635'], type: 'Hospital' },
    { name: 'ACE MEDICAL CENTER', numbers: ['0917-632-3122'], type: 'Medical Center' },
    { name: 'ADVENTIST HOSPITAL-PALAWAN', numbers: ['0945-509-7723'], type: 'Hospital' },
    { name: 'PMMG-COOP', numbers: ['0908-813-0866'], type: 'Cooperative' },
    { name: 'PNP STATION 1 (MENDOZA STATION)', numbers: ['0917-311-5746'], type: 'Police' },
    { name: 'PNP STATION 2 (IRAWAN STATION)', numbers: ['0927-162-4065'], type: 'Police' },
    { name: 'PNP STATION 3 (LUZVIMINDA)', numbers: ['0927-234-7433'], type: 'Police' },
    { name: 'PNP STATION 4 (MACARASCAS STATION)', numbers: ['0928-200-6155'], type: 'Police' },
    { name: 'PPC- BUREAU OF FIRE PROTECTION', numbers: ['0977-855-1600', '0925-707-7710'], type: 'Fire Department' },
    { name: 'CDRRMO', numbers: ['0965-314-8399', '0938-794-4004'], type: 'Disaster Response' },
    { name: 'PSU HOTLINES: UDRRMO', numbers: ['0964-921-8925'], type: 'University Emergency' },
    { name: 'PSU HOTLINES: CLINIC', numbers: ['0949-758-4517'], type: 'University Clinic' },
    { name: 'CNHS (MEDIC)', numbers: ['0964-921-8925'], type: 'School Medic' },
  ]);

  // Auto-detect location on component mount and load offline emergencies
  useEffect(() => {
    detectLocation();
    loadOfflineEmergencies();
  }, []);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
          setLocationDetected(true);
          toast.success('Location detected for emergency use');
        },
        (error) => {
          console.error('Location detection failed:', error);
          // Use Puerto Princesa as fallback
          setCurrentLocation({
            lat: 9.7392,
            lng: 118.7353,
            address: 'Puerto Princesa City, Palawan (Approximate Location)'
          });
          setLocationDetected(true);
          toast.warning('Using approximate location for emergency');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Fallback location
      setCurrentLocation({
        lat: 9.7392,
        lng: 118.7353,
        address: 'Location services unavailable'
      });
      setLocationDetected(true);
    }
  };

  const loadOfflineEmergencies = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('offline_emergencies') || '[]');
      setOfflineEmergencies(stored);
    } catch (error) {
      console.error('Failed to load offline emergencies:', error);
    }
  };

  const handleSOSPress = () => {
    setSosInitiated(true);
    setCountdown(3);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          
          // Process SOS after countdown
          const emergencyData = {
            id: `offline-sos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            userName: user.name,
            timestamp: new Date().toISOString(),
            location: currentLocation?.address || 'Location unavailable',
            coordinates: currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : null,
            status: 'pending_sync',
            type: 'offline_emergency'
          };
          
          // Store in localStorage for sync when online
          const storedEmergencies = JSON.parse(localStorage.getItem('offline_emergencies') || '[]');
          storedEmergencies.push(emergencyData);
          localStorage.setItem('offline_emergencies', JSON.stringify(storedEmergencies));
          
          // Update local state
          setOfflineEmergencies(storedEmergencies);
          
          // Show success message
          toast.success('🚨 Emergency alert stored!', {
            description: 'Your emergency alert will be sent when connection is restored.'
          });
          
          setTimeout(() => {
            setSosInitiated(false);
            setCountdown(null);
          }, 1000);
          
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSOSCancel = () => {
    setSosInitiated(false);
    setCountdown(null);
  };

  const handleCall = (number: string) => {
    // In a real mobile app, this would trigger the phone call
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Mobile Status Bar */}
      <div className="bg-red-600 text-white px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">Offline Mode</span>
        </div>
        <div className="flex items-center space-x-2">
          <Battery className="w-4 h-4" />
          <Signal className="w-4 h-4" />
          <span className="text-xs">12:30</span>
        </div>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Mode</h1>
          <p className="text-gray-600 text-sm px-4">You're offline but emergency features are still available</p>
        </div>

        {/* Offline Warning */}
        <Alert className="mb-6 border-red-200 bg-red-50 rounded-xl">
          <WifiOff className="w-4 h-4" />
          <AlertDescription className="text-red-800">
            <strong>No internet connection.</strong> Emergency features remain active and will sync when reconnected.
          </AlertDescription>
        </Alert>

      {/* Location Status */}
      {locationDetected && currentLocation && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <MapPin className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>Location ready for emergency:</strong> {currentLocation.address}
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Offline Emergencies */}
      {offlineEmergencies.length > 0 && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <Clock className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <strong>{offlineEmergencies.length} emergency alert(s) pending sync.</strong> These will be sent automatically when internet is restored.
          </AlertDescription>
        </Alert>
      )}

        {/* Emergency SOS Button */}
        <Card className="mb-6 border-red-200 bg-red-50 rounded-2xl shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-red-800 flex items-center justify-center space-x-2 text-lg">
              <AlertTriangle className="w-6 h-6" />
              <span>Emergency SOS</span>
            </CardTitle>
            <CardDescription className="text-red-600 text-sm px-2">
              Tap and hold to activate emergency alert (works offline)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pb-6">
            <div className="relative">
              {/* Pulse animation ring */}
              <div className={`absolute inset-0 rounded-full ${
                sosInitiated ? 'animate-ping bg-red-400' : ''
              }`}></div>
              <Button
                size="lg"
                className={`relative w-40 h-40 rounded-full text-white font-bold text-xl transition-all duration-300 shadow-2xl ${
                  sosInitiated 
                    ? 'bg-red-600 scale-110 animate-pulse ring-4 ring-red-300' 
                    : 'bg-red-500 hover:bg-red-600 active:scale-95 hover:shadow-xl'
                }`}
                onMouseDown={handleSOSPress}
                onTouchStart={handleSOSPress}
                disabled={sosInitiated}
              >
                {sosInitiated ? (
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="w-10 h-10 mb-2" />
                    <span className="text-lg font-bold">
                      {countdown !== null ? countdown : 'SENDING'}
                    </span>
                    <span className="text-xs opacity-90">Emergency Alert</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="w-10 h-10 mb-2" />
                    <span className="text-lg font-bold">SOS</span>
                    <span className="text-xs opacity-90">Emergency</span>
                  </div>
                )}
              </Button>
            </div>
            
            {sosInitiated && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleSOSCancel}
                className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl px-8 py-3 font-semibold"
              >
                Cancel Emergency
              </Button>
            )}
          </CardContent>
        </Card>

      {/* Offline Emergency History */}
      {offlineEmergencies.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Pending Emergency Alerts</span>
            </CardTitle>
            <CardDescription>
              These alerts will be automatically sent when you're back online
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {offlineEmergencies.map((emergency, index) => (
              <div key={emergency.id || index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-yellow-500 text-white">
                    Pending Sync
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(emergency.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  <div><strong>User:</strong> {emergency.userName}</div>
                  <div><strong>Location:</strong> {emergency.location}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

        {/* Emergency Contacts */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>Emergency Hotlines</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Tap to call emergency services (works without internet)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.slice(0, 5).map((contact, index) => (
              <div key={index} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="mb-3">
                  <div className="font-semibold text-gray-900 text-sm leading-tight">{contact.name}</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">{contact.type}</div>
                </div>
                <div className="space-y-2">
                  {contact.numbers.slice(0, 2).map((number, numberIndex) => (
                    <div key={numberIndex} className="flex items-center justify-between">
                      <span className="font-mono text-gray-700 text-sm font-medium">{number}</span>
                      <Button
                        size="sm"
                        onClick={() => handleCall(number)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-xs font-semibold"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        CALL
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Show more contacts button */}
            <Button
              variant="outline"
              className="w-full mt-4 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => {/* Add logic to show all contacts */}}
            >
              View All Emergency Contacts ({emergencyContacts.length})
            </Button>
          </CardContent>
        </Card>

        {/* User Status Card */}
        <Card className="mt-6 rounded-2xl shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <span>Current User</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Name</span>
                <span className="font-semibold text-gray-800">{user.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-700 text-xs">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Status</span>
                </div>
                <span className="font-medium text-red-600 text-xs">Offline Mode</span>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* User Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Current User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-red-600">Offline</span>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Connection Status Footer */}
        <div className="mt-8 text-center pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Offline Mode Active</h3>
          <p className="text-sm text-gray-600 px-6 leading-relaxed">
            Emergency features are fully functional. The app will automatically reconnect and sync when internet is restored.
          </p>
          
          {/* Auto-reconnect indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Searching for connection...</span>
          </div>
        </div>
      </div>
    </div>
  );
}