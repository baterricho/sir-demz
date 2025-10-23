# Location-Based Emergency Hotlines Demo

This document demonstrates the new location-based emergency hotlines feature in the SafetyConnect SOS Emergency dashboard.

## How It Works

The application now automatically detects your location and displays emergency hotlines specific to your city:

### 1. **Automatic Location Detection**
- When you open the SOS Emergency page, it automatically detects your location using GPS
- Emergency hotlines are updated based on your detected city
- A green banner shows which city was detected

### 2. **City-Specific Hotlines**
The system includes comprehensive emergency hotlines for major Philippine cities:

#### **Metro Manila Cities**
- **Manila**: Manila 911, MPD, BFP Manila, Philippine General Hospital
- **Quezon City**: QC 911, QCPD, QC Fire Dept, East Avenue Medical Center
- **Makati**: Makati Emergency Response (168), Makati Police, Makati Medical Center

#### **Major Regional Cities**
- **Cebu City**: Cebu 911, Cebu Police, Vicente Sotto Memorial Medical Center
- **Davao City**: Davao 911, Davao Police, Southern Philippines Medical Center
- **Baguio City**: Baguio Emergency Services, Baguio General Hospital
- **Puerto Princesa**: CHO-HERO, PPC 911, BFP Palawan, Ospital ng Palawan
- **Iloilo City**: Iloilo 911, Western Visayas Medical Center
- **Zamboanga City**: Zamboanga 911, Zamboanga City Medical Center
- **Cagayan de Oro**: CDO 911, Northern Mindanao Medical Center

### 3. **Smart Fallback System**
- If your exact city isn't in our database, national emergency hotlines (911, 117, 116) are shown
- If location access is denied, it defaults to Puerto Princesa hotlines
- If geolocation isn't supported, national hotlines are used

### 4. **Manual Location Update**
- Click the "Update Location" button to refresh your location
- Useful when traveling between cities
- Shows a spinning icon while detecting

## Features

### **Priority-Based Hotlines**
Emergency contacts are sorted by priority:
1. **Priority 1**: Main emergency services (911, health emergency)
2. **Priority 2**: Police and fire services
3. **Priority 3**: Major hospitals and disaster response
4. **Priority 4**: Additional medical facilities
5. **Priority 5**: Secondary services (schools, cooperatives)

### **Visual Indicators**
- **Green Banner**: Shows detected city location
- **Color-coded Icons**: Different types of emergency services
- **Update Button**: Refresh location with loading animation

### **Seamless Integration**
- Works with existing SOS emergency alert system
- Location-aware emergency alerts include correct city information
- No impact on offline functionality

## Test the Feature

### Option 1: Allow Location Access
1. Navigate to SOS Emergency page
2. Allow location access when prompted
3. See hotlines update for your actual city
4. Green banner shows detected location

### Option 2: Simulate Different Cities
You can test by temporarily changing coordinates in the browser developer console:
```javascript
// Simulate Manila
navigator.geolocation.getCurrentPosition = (success) => {
  success({ coords: { latitude: 14.5995, longitude: 120.9842 } });
};

// Simulate Cebu
navigator.geolocation.getCurrentPosition = (success) => {
  success({ coords: { latitude: 10.3157, longitude: 123.8854 } });
};

// Then click "Update Location" button
```

### Option 3: Deny Location Access
1. Navigate to SOS Emergency page
2. Deny location access when prompted
3. See it fallback to Puerto Princesa hotlines
4. Warning message explains the fallback

## Technical Implementation

### Location Detection Algorithm
1. **GPS Coordinates**: Gets precise lat/lng from browser
2. **Distance Calculation**: Uses Haversine formula to find nearest city
3. **Radius Check**: Each city has a coverage radius (10-50km)
4. **Best Match**: Selects closest city within radius
5. **Fallback Logic**: Returns national hotlines if no city matches

### Data Structure
```typescript
CityHotlines {
  cityName: string;
  province: string;
  coordinates: { lat: number, lng: number };
  radius: number; // coverage area in km
  contacts: EmergencyContact[];
}
```

### Performance
- Location cached for 5 minutes to avoid repeated requests
- Instant hotline updates when location detected
- No impact on app loading time
- Works offline with last detected location

## Benefits

1. **Relevant Emergency Numbers**: Always shows the most appropriate local emergency contacts
2. **Faster Response**: Users get direct numbers for their area instead of generic national hotlines  
3. **Comprehensive Coverage**: Includes hospitals, police stations, fire departments, and disaster response
4. **User-Friendly**: Automatic detection with manual refresh option
5. **Reliable Fallbacks**: Always shows working emergency numbers even when location fails

This feature makes SafetyConnect more practical and effective for users across different cities in the Philippines!