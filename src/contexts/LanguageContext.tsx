import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'tl';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translation data
const translations = {
  en: {
    // Navigation and General
    'app.name': 'SafetyConnect',
    'nav.home': 'Home',
    'nav.reportIssue': 'Report Issue',
    'nav.sosEmergency': 'SOS Emergency',
    'nav.trackReports': 'Track Reports',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // User Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.manageReports': 'Manage your reports, track progress, and stay safe.',
    'dashboard.reportIssue': 'Report Issue',
    'dashboard.sosEmergency': 'SOS Emergency',
    'dashboard.trackReports': 'Track Reports',
    'dashboard.aboutSafetyConnect': 'About SafetyConnect',
    'dashboard.reportCommunityIssues': 'Report Community Issues',
    'dashboard.reportDescription': 'Submit reports about infrastructure problems, safety concerns, environmental issues, and more. Track the progress of your reports from submission to resolution.',
    'dashboard.emergencyResponse': 'Emergency Response',
    'dashboard.emergencyDescription': 'Use the SOS Emergency feature for urgent situations that require immediate attention from local authorities and emergency services.',
    'dashboard.communitySafety': 'Community Safety',
    'dashboard.communityDescription': 'Help make your community safer by reporting issues early. Every report helps local authorities prioritize and address community concerns.',
    'dashboard.totalReports': 'Total Reports',
    'dashboard.pendingReports': 'Pending Reports',
    'dashboard.resolvedReports': 'Resolved Reports',
    
    // Language Settings
    'settings.language': 'Language',
    'settings.chooseLanguage': 'Choose your preferred language',
    'settings.english': 'English',
    'settings.tagalog': 'Tagalog',
    'settings.languageUpdated': 'Language updated successfully',
    
    // Staff Dashboard
    'staff.dashboard': 'Staff Dashboard',
    'staff.welcome': 'Welcome, {name}. Manage and respond to community reports.',
    'staff.totalReports': 'Total Reports',
    'staff.emergencyReports': 'Emergency Reports',
    'staff.pending': 'Pending',
    'staff.resolved': 'Resolved',
    'staff.manage': 'Manage',
    'staff.categories': 'Categories',
    'staff.sosAlerts': 'SOS Alerts',
    'staff.reportDetails': 'Report Details',
    'staff.alertDetails': 'Alert Details',
    'staff.location': 'Location',
    'staff.coordinates': 'Coordinates',
    
    // Report Status
    'status.submitted': 'Submitted',
    'status.underReview': 'Under Review',
    'status.assigned': 'Assigned',
    'status.inProgress': 'In Progress',
    'status.resolved': 'Resolved',
    'status.rejected': 'Rejected',
    
    // SOS Emergency
    'sos.emergencyOnly': 'For life-threatening emergencies only.',
    'sos.alertServices': 'This will immediately alert emergency services to your location.',
    'sos.emergency': 'Emergency SOS',
    'sos.pressButton': 'Press the SOS button below if you are in immediate danger and need emergency assistance. Your location will be shared with emergency services.',
    'sos.locationDetected': 'Location detected:',
    'sos.hotlinesUpdated': '- Emergency hotlines updated for your area.',
    'sos.updateLocation': 'Update Location',
    'sos.detecting': 'Detecting...',
    
    // Categories
    'category.infrastructure': 'Infrastructure',
    'category.emergency': 'Emergency',
    'category.publicSafety': 'Public Safety',
    'category.healthService': 'Health Service',
    'category.environmental': 'Environmental',
    'category.compliance': 'Compliance',
    'category.others': 'Others',
    
    // Common Actions
    'action.cancel': 'Cancel',
    'action.update': 'Update',
    'action.save': 'Save',
    'action.close': 'Close',
    'action.submit': 'Submit',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.view': 'View',
    
    // Common Fields
    'field.title': 'Title',
    'field.category': 'Category',
    'field.description': 'Description',
    'field.user': 'User',
    'field.status': 'Status',
    'field.date': 'Date',
    'field.time': 'Time',
    'field.location': 'Location',
    'field.id': 'ID',
    
    // Emergency Contacts
    'contacts.cityHotlines': 'City Departments Hotlines',
    'contacts.emergencyHotlines': 'Emergency Hotlines',
    'contacts.nationalHotlines': 'National emergency services and hotlines'
  },
  
  tl: {
    // Navigation and General
    'app.name': 'SafetyConnect',
    'nav.home': 'Tahanan',
    'nav.reportIssue': 'Mag-ulat ng Isyu',
    'nav.sosEmergency': 'SOS Emergency',
    'nav.trackReports': 'Sundan ang mga Ulat',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Mga Setting',
    'nav.logout': 'Mag-logout',
    
    // User Dashboard
    'dashboard.welcome': 'Maligayang Pagdating',
    'dashboard.manageReports': 'Pamahalaan ang inyong mga ulat, subaybayan ang progreso, at manatiling ligtas.',
    'dashboard.reportIssue': 'Mag-ulat ng Isyu',
    'dashboard.sosEmergency': 'SOS Emergency',
    'dashboard.trackReports': 'Sundan ang mga Ulat',
    'dashboard.aboutSafetyConnect': 'Tungkol sa SafetyConnect',
    'dashboard.reportCommunityIssues': 'Mag-ulat ng mga Isyu sa Komunidad',
    'dashboard.reportDescription': 'Magsumite ng mga ulat tungkol sa mga problema sa imprastraktura, mga alalahanin sa kaligtasan, mga isyu sa kapaligiran, at iba pa. Subaybayan ang progreso ng inyong mga ulat mula sa pagsusumite hanggang sa resolusyon.',
    'dashboard.emergencyResponse': 'Tugon sa Emergency',
    'dashboard.emergencyDescription': 'Gamitin ang SOS Emergency feature para sa mga urgent na sitwasyon na nangangailangan ng agarang atensyon mula sa mga lokal na awtoridad at emergency services.',
    'dashboard.communitySafety': 'Kaligtasan ng Komunidad',
    'dashboard.communityDescription': 'Tumulong na gawing mas ligtas ang inyong komunidad sa pamamagitan ng pag-uulat ng mga isyu nang maaga. Ang bawat ulat ay tumutulong sa mga lokal na awtoridad na pagtuunan at tugunan ang mga alalahanin ng komunidad.',
    'dashboard.totalReports': 'Kabuuang mga Ulat',
    'dashboard.pendingReports': 'Mga Nakabinbing Ulat',
    'dashboard.resolvedReports': 'Mga Naayos na Ulat',
    
    // Language Settings
    'settings.language': 'Wika',
    'settings.chooseLanguage': 'Piliin ang inyong gustong wika',
    'settings.english': 'Ingles',
    'settings.tagalog': 'Tagalog',
    'settings.languageUpdated': 'Matagumpay na na-update ang wika',
    
    // Staff Dashboard
    'staff.dashboard': 'Staff Dashboard',
    'staff.welcome': 'Maligayang pagdating, {name}. Pamahalaan at tumugon sa mga ulat ng komunidad.',
    'staff.totalReports': 'Kabuuang mga Ulat',
    'staff.emergencyReports': 'Mga Emergency Report',
    'staff.pending': 'Nakabinbin',
    'staff.resolved': 'Naayos na',
    'staff.manage': 'Pamahalaan',
    'staff.categories': 'Mga Kategorya',
    'staff.sosAlerts': 'Mga SOS Alert',
    'staff.reportDetails': 'Mga Detalye ng Ulat',
    'staff.alertDetails': 'Mga Detalye ng Alert',
    'staff.location': 'Lokasyon',
    'staff.coordinates': 'Mga Coordinate',
    
    // Report Status
    'status.submitted': 'Naisumite',
    'status.underReview': 'Nasa Pag-aaral',
    'status.assigned': 'Nakatakda',
    'status.inProgress': 'Isinasagawa',
    'status.resolved': 'Naayos na',
    'status.rejected': 'Hindi Tinanggap',
    
    // SOS Emergency
    'sos.emergencyOnly': 'Para lamang sa mga emergency na nakabubuhay.',
    'sos.alertServices': 'Ito ay agad na mag-aalert sa mga emergency services sa inyong lokasyon.',
    'sos.emergency': 'Emergency SOS',
    'sos.pressButton': 'Pindutin ang SOS button sa ibaba kung kayo ay nasa agarang panganib at nangangailangan ng emergency assistance. Ang inyong lokasyon ay maibabahagi sa mga emergency services.',
    'sos.locationDetected': 'Natukoy ang lokasyon:',
    'sos.hotlinesUpdated': '- Na-update ang mga emergency hotlines para sa inyong lugar.',
    'sos.updateLocation': 'I-update ang Lokasyon',
    'sos.detecting': 'Tinutukoy...',
    
    // Categories
    'category.infrastructure': 'Imprastraktura',
    'category.emergency': 'Emergency',
    'category.publicSafety': 'Kaligtasang Pampubliko',
    'category.healthService': 'Serbisyong Pangkalusugan',
    'category.environmental': 'Kapaligiran',
    'category.compliance': 'Pagsunod sa Batas',
    'category.others': 'Iba pa',
    
    // Common Actions
    'action.cancel': 'Kanselahin',
    'action.update': 'I-update',
    'action.save': 'I-save',
    'action.close': 'Isara',
    'action.submit': 'Isumite',
    'action.edit': 'I-edit',
    'action.delete': 'Tanggalin',
    'action.view': 'Tingnan',
    
    // Common Fields
    'field.title': 'Pamagat',
    'field.category': 'Kategorya',
    'field.description': 'Paglalarawan',
    'field.user': 'User',
    'field.status': 'Status',
    'field.date': 'Petsa',
    'field.time': 'Oras',
    'field.location': 'Lokasyon',
    'field.id': 'ID',
    
    // Emergency Contacts
    'contacts.cityHotlines': 'Mga Hotline ng mga Departamento ng Lungsod',
    'contacts.emergencyHotlines': 'Mga Emergency Hotlines',
    'contacts.nationalHotlines': 'Mga pambansang serbisyo sa emergency at hotlines'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('safetyconnect_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tl')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('safetyconnect_language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    if (translation) {
      return translation;
    }
    // Fallback to English if translation not found
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};