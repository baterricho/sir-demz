import { Heart, Phone, Shield, Flame, AlertTriangle, Car, Hospital } from 'lucide-react';

export interface EmergencyContact {
  name: string;
  numbers: string[];
  type: string;
  icon: any;
  color: string;
  priority?: number; // Lower numbers = higher priority
}

export interface CityHotlines {
  cityName: string;
  province: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number; // in kilometers
  contacts: EmergencyContact[];
}

// Comprehensive Philippine emergency hotlines by city
export const cityHotlinesDatabase: CityHotlines[] = [
  // Metro Manila Cities
  {
    cityName: 'Manila',
    province: 'Metro Manila',
    coordinates: { lat: 14.5995, lng: 120.9842 },
    radius: 15,
    contacts: [
      { name: 'Manila Emergency 911', numbers: ['911', '117'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'Manila Police District (MPD)', numbers: ['(02) 527-3110', '(02) 527-3116'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'Bureau of Fire Protection Manila', numbers: ['(02) 244-1250', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'Manila Disaster Risk Reduction', numbers: ['(02) 527-3000'], type: 'Disaster Response', icon: AlertTriangle, color: 'text-yellow-500', priority: 3 },
      { name: 'Philippine General Hospital', numbers: ['(02) 554-8400'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Manila Health Department', numbers: ['(02) 711-5585'], type: 'Health Emergency', icon: Heart, color: 'text-red-500', priority: 4 },
      { name: 'MMDA Emergency', numbers: ['136'], type: 'Traffic/Road Emergency', icon: Car, color: 'text-green-500', priority: 4 }
    ]
  },
  {
    cityName: 'Quezon City',
    province: 'Metro Manila',
    coordinates: { lat: 14.6760, lng: 121.0437 },
    radius: 20,
    contacts: [
      { name: 'Quezon City 911', numbers: ['911', '122'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'QCPD Emergency Hotline', numbers: ['(02) 8806-4701', '(02) 414-2584'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'QC Fire Department', numbers: ['(02) 426-0219', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'QC Disaster Risk Reduction', numbers: ['(02) 988-4242'], type: 'Disaster Response', icon: AlertTriangle, color: 'text-yellow-500', priority: 3 },
      { name: 'East Avenue Medical Center', numbers: ['(02) 435-0870'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Veterans Memorial Medical Center', numbers: ['(02) 927-0001'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  },
  {
    cityName: 'Makati',
    province: 'Metro Manila',
    coordinates: { lat: 14.5547, lng: 121.0244 },
    radius: 10,
    contacts: [
      { name: 'Makati Emergency Response', numbers: ['168', '911'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'Makati Police Station', numbers: ['(02) 899-9014', '(02) 899-9015'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'Makati Fire Department', numbers: ['(02) 899-9016', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'Makati Medical Center', numbers: ['(02) 888-8999'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Makati Health Department', numbers: ['(02) 870-1448'], type: 'Health Emergency', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  },
  // Cebu
  {
    cityName: 'Cebu City',
    province: 'Cebu',
    coordinates: { lat: 10.3157, lng: 123.8854 },
    radius: 15,
    contacts: [
      { name: 'Cebu City Emergency 911', numbers: ['911', '(032) 412-4131'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'Cebu City Police Office', numbers: ['(032) 231-3161', '(032) 231-0916'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'Cebu City Fire Department', numbers: ['(032) 254-4180', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'Cebu City Disaster Risk Reduction', numbers: ['(032) 412-7640'], type: 'Disaster Response', icon: AlertTriangle, color: 'text-yellow-500', priority: 3 },
      { name: 'Vicente Sotto Memorial Medical Center', numbers: ['(032) 253-9891'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Cebu Doctors Hospital', numbers: ['(032) 255-5555'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  },
  // Davao
  {
    cityName: 'Davao City',
    province: 'Davao del Sur',
    coordinates: { lat: 7.1907, lng: 125.4553 },
    radius: 25,
    contacts: [
      { name: 'Davao Emergency 911', numbers: ['911', '(082) 241-1911'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'Davao City Police Office', numbers: ['(082) 244-4374', '117'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'Davao Fire Bureau', numbers: ['(082) 221-0251', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'City Disaster Risk Reduction', numbers: ['(082) 241-1000'], type: 'Disaster Response', icon: AlertTriangle, color: 'text-yellow-500', priority: 3 },
      { name: 'Southern Philippines Medical Center', numbers: ['(082) 227-2731'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Davao Medical School Foundation', numbers: ['(082) 226-4433'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  },
  // Baguio
  {
    cityName: 'Baguio City',
    province: 'Benguet',
    coordinates: { lat: 16.4023, lng: 120.5960 },
    radius: 10,
    contacts: [
      { name: 'Baguio Emergency Services', numbers: ['911', '117'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'Baguio City Police Office', numbers: ['(074) 442-8293'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'Baguio Fire Bureau', numbers: ['(074) 442-3121', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'Baguio General Hospital', numbers: ['(074) 442-2216'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Saint Louis University Hospital', numbers: ['(074) 447-6361'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  },
  // Puerto Princesa (Updated with correct hotlines)
  {
    cityName: 'Puerto Princesa',
    province: 'Palawan',
    coordinates: { lat: 9.7392, lng: 118.7353 },
    radius: 50,
    contacts: [
      { name: 'CHO-HERO (HEALTH EMERGENCY RESPONSE OPERATION)', numbers: ['0917-777-7296', '0966-802-7420', '0950-491-2599', '0951-312-6727'], type: 'Health Emergency', icon: Heart, color: 'text-red-500', priority: 1 },
      { name: 'PUERTO PRINCESA CITY 911', numbers: ['0927-797-2009', '0920-430-5378', '0917-112-0324'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'PPC- BUREAU OF FIRE PROTECTION', numbers: ['0977-855-1600', '0925-707-7710'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'CDRRMO', numbers: ['0965-314-8399', '0938-794-4004'], type: 'Disaster Response', icon: AlertTriangle, color: 'text-yellow-500', priority: 2 },
      { name: 'PNP STATION 1 (MENDOZA STATION)', numbers: ['0917-311-5746'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 3 },
      { name: 'PNP STATION 2 (IRAWAN STATION)', numbers: ['0927-162-4065'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 3 },
      { name: 'PNP STATION 3 (LUZVIMINDA)', numbers: ['0927-234-7433'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 3 },
      { name: 'PNP STATION 4 (MACARASCAS STATION)', numbers: ['0928-200-6155'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 3 },
      { name: 'OSPITAL NG PALAWAN', numbers: ['0927-133-8635'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 },
      { name: 'ACE MEDICAL CENTER', numbers: ['0917-632-3122'], type: 'Medical Center', icon: Heart, color: 'text-red-500', priority: 4 },
      { name: 'ADVENTIST HOSPITAL-PALAWAN', numbers: ['0945-509-7723'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 },
      { name: 'PMMG-COOP', numbers: ['0908-813-0866'], type: 'Cooperative', icon: Phone, color: 'text-green-500', priority: 5 },
      { name: 'PSU HOTLINES: UDRRMO', numbers: ['0964-921-8925'], type: 'University Emergency', icon: Phone, color: 'text-green-500', priority: 5 },
      { name: 'PSU HOTLINES: CLINIC', numbers: ['0949-758-4517'], type: 'University Clinic', icon: Heart, color: 'text-red-500', priority: 5 },
      { name: 'CNHS (MEDIC)', numbers: ['0964-921-8925'], type: 'School Medic', icon: Heart, color: 'text-red-500', priority: 5 }
    ]
  },
  // Iloilo
  {
    cityName: 'Iloilo City',
    province: 'Iloilo',
    coordinates: { lat: 10.7202, lng: 122.5621 },
    radius: 15,
    contacts: [
      { name: 'Iloilo Emergency 911', numbers: ['911', '(033) 335-0297'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'Iloilo City Police Office', numbers: ['(033) 320-9634', '117'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'Iloilo Fire Bureau', numbers: ['(033) 335-0336', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'Western Visayas Medical Center', numbers: ['(033) 321-0853'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Iloilo Mission Hospital', numbers: ['(033) 338-7071'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  },
  // Zamboanga
  {
    cityName: 'Zamboanga City',
    province: 'Zamboanga del Sur',
    coordinates: { lat: 6.9214, lng: 122.0790 },
    radius: 20,
    contacts: [
      { name: 'Zamboanga Emergency 911', numbers: ['911', '(062) 991-2923'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'Zamboanga City Police Office', numbers: ['(062) 991-2977', '117'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'Zamboanga Fire Bureau', numbers: ['(062) 991-2344', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'Zamboanga City Medical Center', numbers: ['(062) 991-2927'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Brent Hospital', numbers: ['(062) 991-2071'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  },
  // Cagayan de Oro
  {
    cityName: 'Cagayan de Oro',
    province: 'Misamis Oriental',
    coordinates: { lat: 8.4542, lng: 124.6319 },
    radius: 15,
    contacts: [
      { name: 'CDO Emergency 911', numbers: ['911', '(088) 856-2225'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
      { name: 'CDO Police Office', numbers: ['(088) 856-4003', '117'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
      { name: 'CDO Fire Bureau', numbers: ['(088) 857-3894', '116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
      { name: 'Northern Mindanao Medical Center', numbers: ['(088) 856-3271'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 3 },
      { name: 'Polymedic General Hospital', numbers: ['(088) 856-0908'], type: 'Hospital', icon: Heart, color: 'text-red-500', priority: 4 }
    ]
  }
];

// Default/fallback emergency contacts for unrecognized locations
export const defaultPhilippineHotlines: EmergencyContact[] = [
  { name: 'National Emergency Hotline', numbers: ['911'], type: 'Emergency Services', icon: AlertTriangle, color: 'text-red-500', priority: 1 },
  { name: 'Philippine National Police', numbers: ['117'], type: 'Police', icon: Shield, color: 'text-blue-500', priority: 2 },
  { name: 'Bureau of Fire Protection', numbers: ['116'], type: 'Fire Department', icon: Flame, color: 'text-orange-500', priority: 2 },
  { name: 'Philippine Red Cross', numbers: ['143'], type: 'Medical Emergency', icon: Heart, color: 'text-red-500', priority: 3 },
  { name: 'NDRRMC Emergency', numbers: ['(02) 8911-1406'], type: 'Disaster Response', icon: AlertTriangle, color: 'text-yellow-500', priority: 4 }
];

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Get city-specific hotlines based on coordinates
 */
export function getCityHotlines(lat: number, lng: number): { city: CityHotlines | null, contacts: EmergencyContact[] } {
  // Find the closest city within its radius
  let closestCity: CityHotlines | null = null;
  let shortestDistance = Infinity;

  for (const city of cityHotlinesDatabase) {
    const distance = calculateDistance(lat, lng, city.coordinates.lat, city.coordinates.lng);
    
    // Check if within city radius and closer than previous matches
    if (distance <= city.radius && distance < shortestDistance) {
      closestCity = city;
      shortestDistance = distance;
    }
  }

  if (closestCity) {
    // Sort contacts by priority
    const sortedContacts = [...closestCity.contacts].sort((a, b) => (a.priority || 999) - (b.priority || 999));
    return { city: closestCity, contacts: sortedContacts };
  }

  // Return default Philippine hotlines if no city match
  return { city: null, contacts: defaultPhilippineHotlines };
}

/**
 * Get location description from coordinates
 */
export async function getLocationDescription(lat: number, lng: number): Promise<string> {
  try {
    // In a real app, you would use a reverse geocoding service like Google Maps API
    // For this demo, we'll use the city detection logic
    const { city } = getCityHotlines(lat, lng);
    
    if (city) {
      return `${city.cityName}, ${city.province}`;
    }
    
    // Fallback description
    return `${lat.toFixed(4)}, ${lng.toFixed(4)} - Philippines`;
  } catch (error) {
    console.error('Error getting location description:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)} - Location Detected`;
  }
}

/**
 * Search for cities by name
 */
export function searchCitiesByName(query: string): CityHotlines[] {
  const searchQuery = query.toLowerCase().trim();
  return cityHotlinesDatabase.filter(city => 
    city.cityName.toLowerCase().includes(searchQuery) ||
    city.province.toLowerCase().includes(searchQuery)
  );
}

/**
 * Get all available cities
 */
export function getAllCities(): CityHotlines[] {
  return cityHotlinesDatabase.sort((a, b) => a.cityName.localeCompare(b.cityName));
}