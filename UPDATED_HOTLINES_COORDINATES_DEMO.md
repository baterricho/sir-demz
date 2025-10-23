# Updated Emergency Hotlines & Coordinates Display Demo

This document demonstrates the updated Puerto Princesa emergency hotlines and enhanced coordinates display in the SafetyConnect Staff Dashboard.

## Features Updated

### 1. **Verified Puerto Princesa Emergency Hotlines**
Updated with the official emergency contact numbers for Puerto Princesa City, Palawan.

### 2. **Enhanced Coordinates Display in Staff Dashboard**
Added coordinates display to all location fields in the staff dashboard reports list and details.

## Updated Emergency Hotlines for Puerto Princesa

### **CITY DEPARTMENTS HOTLINES:**

#### **Health Emergency Services**
- **CHO-HERO (HEALTH EMERGENCY RESPONSE OPERATION)**
  - 0917-777-7296
  - 0966-802-7420  
  - 0950-491-2599
  - 0951-312-6727

#### **Emergency Services**
- **PUERTO PRINCESA CITY 911**
  - 0927-797-2009
  - 0920-430-5378
  - 0917-112-0324

#### **Medical Facilities**
- **OSPITAL NG PALAWAN**
  - 0927-133-8635

- **ACE MEDICAL CENTER**
  - 0917-632-3122

- **ADVENTIST HOSPITAL-PALAWAN**
  - 0945-509-7723

#### **Fire & Emergency Response**
- **PPC- BUREAU OF FIRE PROTECTION**
  - 0977-855-1600
  - 0925-707-7710

- **CDRRMO (Disaster Risk Reduction)**
  - 0965-314-8399
  - 0938-794-4004

#### **Police Stations**
- **PNP STATION 1 (MENDOZA STATION)**
  - 0917-311-5746

- **PNP STATION 2 (IRAWAN STATION)**
  - 0927-162-4065

- **PNP STATION 3 (LUZVIMINDA)**
  - 0927-234-7433

- **PNP STATION 4 (MACARASCAS STATION)**
  - 0928-200-6155

#### **University & Educational Services**
- **PSU HOTLINES: UDRRMO**
  - 0964-921-8925

- **PSU HOTLINES: CLINIC**
  - 0949-758-4517

- **CNHS (MEDIC)**
  - 0964-921-8925

#### **Cooperative Services**
- **PMMG-COOP**
  - 0908-813-0866

## Enhanced Coordinates Display

### **Where Coordinates Now Appear:**

#### **1. Staff Dashboard Reports List**
- **Regular Reports**: Location with coordinates
- **Emergency SOS Reports**: Location with coordinates
- **Format**: `Location: Main Street & Oak Avenue, Puerto Princesa City, Palawan (9.7392, 118.7353)`

#### **2. Report Details Modal**
- **Location Field**: Shows coordinates alongside location text
- **Format**: `Location: [Address] (lat, lng)`

#### **3. SOS Alert Details**
- **Alert Update Modal**: Coordinates in location field
- **Location Map Modal**: Coordinates displayed

## How to Test

### **Test Updated Emergency Hotlines**
1. Run development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Login as regular user (any email/password)
4. Go to "SOS Emergency" page
5. **Check hotlines section**: Should display all updated Puerto Princesa numbers
6. **Verify location detection**: Should show Puerto Princesa with updated hotlines

### **Test Coordinates Display in Staff Dashboard**

#### **Step 1: View Reports with Coordinates**
1. Login as staff: `staff@communitycall.com` / `staff123`
2. Navigate to Staff Dashboard
3. **Dashboard Tab**: View reports list with coordinates
4. **Expected format**: 
   ```
   ID: SC-2025-001
   Location: Main Street & Oak Avenue, Puerto Princesa City, Palawan (9.7392, 118.7353)
   ```

#### **Step 2: Test Report Details Modal**
1. Click "Update" on any report
2. **Check Report Details section**
3. **Expected format**:
   ```
   Report Details
   Title: Broken Street Light on Main Street
   Category: Infrastructure  
   User: Maria Santos (+63 917 123 4567)
   Current Status: In Progress
   Location: Main Street & Oak Avenue, Puerto Princesa City, Palawan (9.7392, 118.7353)
   ```

#### **Step 3: Test SOS Alert Coordinates**
1. Go to "SOS Alerts" tab
2. Click "Update" on any SOS alert
3. **Expected format**:
   ```
   Alert Details
   User: [Name] (+63 917 123 4567)
   Time: [Date/Time]
   Location: Puerto Princesa, Palawan (9.7392, 118.7353)
   Current Status: Active
   ```

## Sample Report with Coordinates

### **Regular Report Example**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ BROKEN STREET LIGHT ON MAIN STREET    [IN PROGRESS]    [Manage]          │
├─────────────────────────────────────────────────────────────────────────┤
│ ID: SC-2025-001  👤 Citizen Report  ⚠️ Infrastructure  📅 1/15/2025     │
│                                                                         │
│ The street light near the intersection of Main Street and Oak Avenue   │
│ has been flickering for weeks and now completely stopped working.      │
│                                                                         │
│ 📍 Location: Main Street & Oak Avenue, Puerto Princesa City, Palawan   │
│     (9.7392, 118.7353)                                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

### **Emergency SOS Example**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ EMERGENCY SOS ALERT  🚨 EMERGENCY  [ACTIVE]           [Manage]          │
├─────────────────────────────────────────────────────────────────────────┤
│ ID: SOS-2025-001  👤 Citizen Report  🚨 Emergency  📅 10/11/2025       │
│                                                                         │
│ Emergency SOS triggered by John Doe at 10/11/2025, 2:30:00 PM.        │
│ Location: Puerto Princesa, Palawan (9.7392, 118.7353).                │
└─────────────────────────────────────────────────────────────────────────┘
```

## Technical Implementation

### **Updated Emergency Contacts Structure**
```typescript
// Puerto Princesa hotlines with correct numbers
{
  cityName: 'Puerto Princesa',
  province: 'Palawan',
  coordinates: { lat: 9.7392, lng: 118.7353 },
  radius: 50,
  contacts: [
    { name: 'CHO-HERO (HEALTH EMERGENCY RESPONSE OPERATION)', 
      numbers: ['0917-777-7296', '0966-802-7420', '0950-491-2599', '0951-312-6727'] },
    { name: 'PUERTO PRINCESA CITY 911', 
      numbers: ['0927-797-2009', '0920-430-5378', '0917-112-0324'] },
    // ... all other verified numbers
  ]
}
```

### **Enhanced Coordinates Display**
```tsx
// Reports list location with coordinates
<span>Location: {report.location}
  {report.coordinates && (
    <span className="text-gray-500 ml-1">
      ({report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)})
    </span>
  )}
</span>

// SOS emergency location with coordinates
Location: {report.location || 'Location not available'}
{report.coordinates && (
  <span className="text-gray-500 ml-1">
    ({report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)})
  </span>
)}
```

### **Mock Data with Coordinates**
```typescript
// Sample reports now include coordinates
{
  id: "1",
  trackingId: "SC-2025-001", 
  location: "Main Street & Oak Avenue, Puerto Princesa City, Palawan",
  coordinates: {
    lat: 9.7392,
    lng: 118.7353
  }
  // ... other fields
}
```

## Benefits

### **For Emergency Response**
1. **Accurate Hotlines**: Verified, current emergency contact numbers
2. **Precise Location**: GPS coordinates for faster response
3. **Complete Coverage**: All major emergency services included
4. **Easy Access**: Numbers prioritized by emergency type

### **For Staff Operations**
1. **Quick Navigation**: Copy coordinates for GPS routing
2. **Better Documentation**: Precise incident locations
3. **Improved Efficiency**: No need to search for addresses
4. **Data Analysis**: Geographic patterns in reports and emergencies

## Testing Results Expected

### **Emergency Hotlines (Puerto Princesa)**
- ✅ Updated with 15+ verified emergency contact numbers
- ✅ Proper categorization by service type
- ✅ Priority ordering (Health Emergency, 911, Fire, Police, etc.)
- ✅ Location-based display (shows only when in Puerto Princesa area)

### **Coordinates Display**
- ✅ Reports list shows coordinates for all location fields
- ✅ Report details modal includes coordinates
- ✅ SOS alerts show coordinates in all modals
- ✅ Format: `(latitude, longitude)` with 4 decimal precision
- ✅ Consistent styling with gray text for coordinates

Both enhancements are now fully implemented and ready for production use!

## Quick Test Checklist

- [ ] Emergency hotlines display correct Puerto Princesa numbers
- [ ] Reports list shows coordinates next to location
- [ ] Report details modal includes coordinates
- [ ] SOS alert modals show coordinates
- [ ] Coordinate format is `(lat, lng)` with 4 decimals
- [ ] All location fields enhanced with coordinates