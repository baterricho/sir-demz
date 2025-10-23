import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { LocationMap } from "./LocationMap";
import {
  Phone,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  Clock,
  MapPin,
  Shield,
  Flame,
  Heart,
  Car,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { User as UserType, SOSAlert, Page } from "../App";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import {
  getCityHotlines,
  getLocationDescription,
  defaultPhilippineHotlines,
  EmergencyContact,
  CityHotlines
} from "../utils/locationHotlines";

interface SOSEmergencyProps {
  user: UserType;
  sosAlerts: SOSAlert[];
  onSubmitSOS: (alert: Omit<SOSAlert, "id">) => SOSAlert;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function SOSEmergency({
  user,
  sosAlerts,
  onSubmitSOS,
  onNavigate,
  onLogout,
}: SOSEmergencyProps) {
  const [isSubmittingSOS, setIsSubmittingSOS] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [showLocationModal, setShowLocationModal] =
    useState(false);
  const [currentCity, setCurrentCity] = useState<CityHotlines | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(
    defaultPhilippineHotlines
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Auto-detect location on component mount
  useEffect(() => {
    detectCurrentLocation();
  }, []);

  const safetyTips = {
    medical: [
      "Stay calm and assess the situation",
      "Check for breathing and consciousness",
      "Apply pressure to bleeding wounds",
      "Do not move injured person unless in immediate danger",
      "Provide clear information to emergency responders",
    ],
    fire: [
      "Get out of the building immediately",
      "Stay low to avoid smoke inhalation",
      "Touch doors before opening - if hot, find another route",
      "Never use elevators during a fire",
      "Call 116 once you are in a safe location",
    ],
    security: [
      "Move to a safe location immediately",
      "Do not confront the perpetrator",
      "Call 117 or 911 for immediate assistance",
      "Provide detailed description of suspect if safe to do so",
      "Preserve evidence if possible",
    ],
    general: [
      "Stay calm and think clearly",
      "Move away from immediate danger",
      "Call appropriate emergency services",
      "Provide your exact location",
      "Follow instructions from emergency responders",
    ],
  };

  const detectCurrentLocation = async () => {
    if (isDetectingLocation) return;
    
    setIsDetectingLocation(true);
    setLocationStatus("loading");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get city-specific hotlines
            const { city, contacts } = getCityHotlines(latitude, longitude);
            
            // Get location description
            const address = await getLocationDescription(latitude, longitude);
            
            // Update state
            setCurrentCity(city);
            setEmergencyContacts(contacts);
            setCurrentLocation({ lat: latitude, lng: longitude, address });
            setLocationStatus("success");
            
            if (city) {
              toast.success(`Location detected: ${city.cityName}, ${city.province}`);
            } else {
              toast.info("Using national emergency hotlines");
            }
          } catch (error) {
            console.error('Error processing location:', error);
            setLocationStatus("error");
            toast.error("Failed to detect location. Using default hotlines.");
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationStatus("error");
          
          // Use default location (Puerto Princesa) if geolocation fails
          const { city, contacts } = getCityHotlines(9.7392, 118.7353);
          setCurrentCity(city);
          setEmergencyContacts(contacts);
          setCurrentLocation({
            lat: 9.7392,
            lng: 118.7353,
            address: "Puerto Princesa City, Palawan (Default Location)"
          });
          
          toast.warning("Location access denied. Using Puerto Princesa hotlines.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    } else {
      setLocationStatus("error");
      
      // Use default Philippine hotlines if geolocation is not supported
      setEmergencyContacts(defaultPhilippineHotlines);
      toast.error("Geolocation not supported. Using national hotlines.");
    }
    
    setIsDetectingLocation(false);
  };

  const handleSOSSubmit = async () => {
    setIsSubmittingSOS(true);
    setCountdown(3);
    setLocationStatus("loading");

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          
          // Process SOS after countdown
          processSOS();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const processSOS = () => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Get location description using our utility
          const address = await getLocationDescription(latitude, longitude);

          const locationData = {
            lat: latitude,
            lng: longitude,
            address: address,
          };

          setCurrentLocation(locationData);
          setLocationStatus("success");

          const newAlert = onSubmitSOS({
            userId: user.id,
            userName: user.name,
            time: new Date().toISOString(),
            location: address,
            coordinates: {
              lat: latitude,
              lng: longitude
            },
            status: "Active",
          });

          setIsSubmittingSOS(false);
          setCountdown(null);
          setShowLocationModal(true);
          toast.success(
            "Your SOS has been sent. Help is on the way.",
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationStatus("error");

          // Use current location if already detected, otherwise fallback
          const fallbackLocation = currentLocation || {
            lat: 9.7392,
            lng: 118.7353,
            address: "Puerto Princesa City, Palawan (Approximate Location)",
          };

          setCurrentLocation(fallbackLocation);

          const newAlert = onSubmitSOS({
            userId: user.id,
            userName: user.name,
            time: new Date().toISOString(),
            location: fallbackLocation.address,
            coordinates: {
              lat: fallbackLocation.lat,
              lng: fallbackLocation.lng
            },
            status: "Active",
          });

          setIsSubmittingSOS(false);
          setCountdown(null);
          setShowLocationModal(true);
          toast.success(
            "Your SOS has been sent. Help is on the way.",
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    } else {
      setLocationStatus("error");
      // Use current location if already detected, otherwise fallback
      const fallbackLocation = currentLocation || {
        lat: 9.7392,
        lng: 118.7353,
        address: "Puerto Princesa City, Palawan (Location Services Unavailable)",
      };

      setCurrentLocation(fallbackLocation);

      const newAlert = onSubmitSOS({
        userId: user.id,
        userName: user.name,
        time: new Date().toISOString(),
        location: fallbackLocation.address,
        coordinates: {
          lat: fallbackLocation.lat,
          lng: fallbackLocation.lng
        },
        status: "Active",
      });

      setIsSubmittingSOS(false);
      setCountdown(null);
      setShowLocationModal(true);
      toast.success(
        "Your SOS has been sent. Help is on the way.",
      );
    }
  };

  const handleSOSCancel = () => {
    setIsSubmittingSOS(false);
    setCountdown(null);
  };

  const getStatusColor = (status: SOSAlert["status"]) => {
    switch (status) {
      case "Active":
        return "bg-red-500";
      case "Responded":
        return "bg-yellow-500";
      case "Closed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">
                SafetyConnect
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate("dashboard")}
                className="text-gray-600 hover:text-gray-700"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate("create-report")}
                className="text-gray-600 hover:text-gray-700"
              >
                Report Issue
              </button>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                SOS Emergency
              </button>
              <button
                onClick={() => onNavigate("track-reports")}
                className="text-gray-600 hover:text-gray-700"
              >
                Track Reports
              </button>
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Status Banner */}
        {currentCity && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <MapPin className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Location detected:</strong> {currentCity.cityName}, {currentCity.province}
              {" "}- Emergency hotlines updated for your area.
            </AlertDescription>
          </Alert>
        )}

        {/* Warning Banner */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <strong>
              For life-threatening emergencies only.
            </strong>{" "}
            This will immediately alert emergency services to
            your location.
          </AlertDescription>
        </Alert>

        {/* SOS Button */}
        <div className="text-center mb-8 md:mb-12">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Emergency SOS
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto px-4 text-sm md:text-base">
              Press the SOS button if you are in immediate danger and need emergency assistance. Your location will be shared with emergency services.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              {/* Pulse animation ring for mobile */}
              <div className={`absolute inset-0 rounded-full ${
                isSubmittingSOS ? 'animate-ping bg-red-400' : ''
              }`}></div>
              
              <Button
                onClick={handleSOSSubmit}
                aria-label="Emergency SOS"
                variant="destructive"
                className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-[0_20px_50px_rgba(239,68,68,0.5)] transition-all duration-300 focus:ring-4 ring-red-300 aspect-square flex items-center justify-center ${
                  isSubmittingSOS 
                    ? 'scale-110 animate-pulse ring-4 ring-red-300' 
                    : 'hover:scale-105 active:scale-95'
                }`}
                style={{ borderRadius: '50%', aspectRatio: '1 / 1' }}
                size="lg"
                disabled={isSubmittingSOS}
              >
                <div className="flex flex-col items-center gap-1 md:gap-1.5 select-none">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 opacity-90" />
                  <span className="text-2xl md:text-3xl font-extrabold tracking-wide">SOS</span>
                  <span className="text-sm md:text-base font-semibold tracking-wider opacity-95">
                    {isSubmittingSOS 
                      ? (countdown !== null ? `${countdown}` : "SENDING...") 
                      : "EMERGENCY"
                    }
                  </span>
                </div>
              </Button>
            </div>
            
            {isSubmittingSOS && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleSOSCancel}
                className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl px-8 py-3 font-semibold"
              >
                Cancel Emergency
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Emergency Contacts */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                {currentCity ? `${currentCity.cityName} Emergency Hotlines` : 'Emergency Hotlines'}
              </CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>
                  {currentCity 
                    ? `${currentCity.cityName}, ${currentCity.province} emergency services and departments`
                    : 'National emergency services and hotlines'
                  }
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={detectCurrentLocation}
                  disabled={isDetectingLocation}
                  className="text-xs h-6 px-2"
                >
                  {isDetectingLocation ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3 mr-1" />
                      Update Location
                    </>
                  )}
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyContacts.slice(0, 6).map((contact, index) => (
                  <div key={index} className="p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <contact.icon className={`w-5 h-5 ${contact.color}`} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm leading-tight">{contact.name}</div>
                        <div className="text-xs text-blue-600 font-medium mt-1">{contact.type}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {contact.numbers.slice(0, 2).map((number, numberIndex) => (
                        <div key={numberIndex} className="flex items-center justify-between">
                          <span className="font-mono text-gray-700 text-sm font-medium">{number}</span>
                          <Button
                            size="sm"
                            onClick={() => {
                              // In a real app, this would initiate a call
                              toast.info(`Calling ${number}...`);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            CALL
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              

            </CardContent>
          </Card>

          {/* SOS History */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-orange-600" />
                SOS History
              </CardTitle>
              <CardDescription>
                Your previous emergency alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sosAlerts.length > 0 ? (
                <div className="space-y-4">
                  {sosAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            alert.status === 'Active' ? 'bg-red-500 animate-pulse' :
                            alert.status === 'Responded' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="font-medium">SOS Alert #{alert.id}</span>
                          <Badge className={
                            alert.status === 'Active' ? 'bg-red-500 text-white' :
                            alert.status === 'Responded' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          }>
                            {alert.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.time).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {alert.location}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No SOS alerts sent</p>
                  <p className="text-sm">
                    Your emergency alerts will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Safety Tips */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Emergency Safety Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(safetyTips).map(
              ([category, tips]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize text-lg">
                      {category === "medical" && (
                        <Heart className="w-5 h-5 inline mr-2 text-red-500" />
                      )}
                      {category === "fire" && (
                        <Flame className="w-5 h-5 inline mr-2 text-orange-500" />
                      )}
                      {category === "security" && (
                        <Shield className="w-5 h-5 inline mr-2 text-blue-500" />
                      )}
                      {category === "general" && (
                        <AlertTriangle className="w-5 h-5 inline mr-2 text-yellow-500" />
                      )}
                      {category} Emergency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {tips.map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
      </div>

      {/* SOS Location Confirmation Modal */}
      <Dialog
        open={showLocationModal}
        onOpenChange={setShowLocationModal}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <MapPin className="w-5 h-5" />
              SOS Alert Sent - Emergency Location
            </DialogTitle>
            <DialogDescription>
              Your emergency alert has been sent successfully.
              Emergency services have been notified of your
              location.
            </DialogDescription>
          </DialogHeader>

          {currentLocation && (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">
                  Emergency Alert Details:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Time Sent:</strong>{" "}
                    {new Date().toLocaleString()}
                  </div>
                  <div>
                    <strong>User:</strong> {user.name}
                  </div>
                  <div className="md:col-span-2">
                    <strong>Location:</strong>{" "}
                    {currentLocation.address}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <Badge className="bg-red-500 text-white">
                      Active Emergency
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Emergency services have been notified and are
                  responding to your location.
                </p>
                <Button
                  onClick={() => setShowLocationModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}