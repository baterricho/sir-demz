import React, { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { UserDashboard } from "./components/UserDashboard";
import { CreateReport } from "./components/CreateReport";
import { EditReport } from "./components/EditReport";
import { UserProfile } from "./components/UserProfile";
import { SOSEmergency } from "./components/SOSEmergency";
import { TrackReports } from "./components/TrackReports";
import { StaffDashboard } from "./components/StaffDashboard";
import { UserReviews } from "./components/UserReviews";
import { TermsAcceptanceModal } from "./components/TermsAcceptanceModal";
import { MobileNavigation } from "./components/MobileNavigation";
import { OfflineMode } from "./components/OfflineMode";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NetworkStatus } from "./components/NetworkStatus";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  saveUserSession,
  getUserSession,
  clearUserSession,
  saveReports,
  getReports,
  saveSOSAlerts,
  getSOSAlerts,
  generateUniqueTrackingId,
  generateUniqueSOSId,
  validateReportData,
  initializeDefaultAccounts,
  logError,
} from "./utils/storage";
import { LanguageProvider } from "./contexts/LanguageContext";

export type UserType = "user" | "staff" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  phoneNumber?: string;
  address?: string;
  barangay?: string;
  purok?: string;
  street?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  idPhoto?: string; // Base64 encoded ID photo
  idVerificationStatus?: 'pending' | 'verified' | 'rejected';
  profileImage?: string; // Base64 encoded profile photo
  joinDate?: string;
  lastLoginDate?: string;
  notificationSettings?: {
    email: boolean;
    sms: boolean;
    pushNotifications: boolean;
  };
  privacySettings?: {
    shareLocation: boolean;
    publicProfile: boolean;
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // Base64 or file path
  uploadDate: string;
  preview?: string; // Thumbnail for images/videos
}

export interface ReportEdit {
  id: string;
  editDate: string;
  editedBy: string;
  previousVersion: {
    title: string;
    description: string;
    category: string;
  };
  changes: string[];
}

export interface Report {
  id: string;
  trackingId: string;
  title: string;
  category: string;
  description: string;
  status:
    | "Draft"
    | "Submitted"
    | "Under Review"
    | "Assigned"
    | "In Progress"
    | "Resolved";
  dateSubmitted: string;
  lastEditDate?: string;
  userId: string;
  userName: string;
  isEmergency: boolean;
  isConfidential: boolean;
  emergencyType?: string;
  emergencyDetails?: string;
  location?: string;
  barangay?: string;
  purok?: string;
  street?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  attachments?: Attachment[];
  assignedStaff?: string;
  resolutionNotes?: string;
  canEdit: boolean; // Based on status and user permissions
  editHistory?: ReportEdit[];
  timeline: Array<{
    status: string;
    date: string;
    notes?: string;
  }>;
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  time: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: "Active" | "Responded" | "Closed";
}

export type Page =
  | "landing"
  | "login"
  | "dashboard"
  | "create-report"
  | "edit-report"
  | "user-profile"
  | "sos"
  | "track-reports"
  | "staff-dashboard"
  | "reviews"
  | "offline";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>("landing");
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [reports, setReports] = useState<Report[]>([]);
  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([]);
  const [pendingUser, setPendingUser] = useState<User | null>(
    null,
  );
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReportForEdit, setSelectedReportForEdit] = useState<Report | null>(null);

  // Initialize app and restore session
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        // Initialize default accounts and restore session
        initializeDefaultAccounts();

        // Restore user session
        const savedUser = getUserSession();
        if (savedUser) {
          setCurrentUser(savedUser);
          setCurrentPage(
            savedUser.type === "staff"
              ? "staff-dashboard"
              : "dashboard",
          );
        }

        // Restore data from localStorage
        const savedReports = getReports();
        const savedSOSAlerts = getSOSAlerts();

        if (savedReports.length > 0) {
          setReports(savedReports);
        } else {
          // Initialize with mock data only if no saved data exists
          setReports(getMockReports());
        }

        setSOSAlerts(savedSOSAlerts);
      } catch (error) {
        logError(error as Error, "App Initialization");
        toast.error("Failed to load application data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Detect mobile and online status
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleOnline = () => {
      setIsOffline(false);
      // Sync offline data when coming back online
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Initial checks
    checkMobile();
    setIsOffline(!navigator.onLine);

    // Event listeners
    window.addEventListener("resize", checkMobile);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_EMERGENCY_ALERTS') {
          syncOfflineData();
        }
      });
    }
  }, []);

  // Sync offline data when coming back online
  const syncOfflineData = () => {
    try {
      // Sync offline emergency alerts
      const offlineEmergencies = JSON.parse(
        localStorage.getItem("offline_emergencies") || "[]",
      );
      if (offlineEmergencies.length > 0) {
        offlineEmergencies.forEach((emergency: any) => {
          const sosAlert: SOSAlert = {
            id: generateUniqueSOSId(),
            userId: emergency.userId,
            userName: emergency.userName,
            time: emergency.timestamp,
            location: emergency.location,
            coordinates: emergency.coordinates || undefined,
            status: "Active",
          };
          setSOSAlerts((prev) => [sosAlert, ...prev]);
        });

        // Clear synced data
        localStorage.removeItem("offline_emergencies");

        toast.success("Emergency alerts synced", {
          description: `${offlineEmergencies.length} offline alert(s) have been synced successfully.`,
        });
      }

      // Sync offline reports if any
      const offlineReports = JSON.parse(
        localStorage.getItem("offline_reports") || "[]",
      );
      if (offlineReports.length > 0) {
        offlineReports.forEach((reportData: any) => {
          const report: Report = {
            ...reportData,
            id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            trackingId: generateUniqueTrackingId(),
            dateSubmitted: new Date().toISOString(),
            timeline: [
              {
                status: "Submitted",
                date: new Date().toISOString(),
              },
            ],
          };
          setReports((prev) => [report, ...prev]);
        });

        // Clear synced data
        localStorage.removeItem("offline_reports");

        toast.success("Reports synced", {
          description: `${offlineReports.length} offline report(s) have been synced successfully.`,
        });
      }
    } catch (error) {
      logError(error as Error, "Offline Data Sync");
      toast.error("Failed to sync some offline data");
    }
  };

  // Auto-save data when it changes
  useEffect(() => {
    if (!isLoading) {
      saveReports(reports);
    }
  }, [reports, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveSOSAlerts(sosAlerts);
    }
  }, [sosAlerts, isLoading]);

  const getMockReports = (): Report[] => [
    {
      id: "1",
      trackingId: "SC-2025-001",
      title: "Broken Street Light on Main Street",
      category: "Infrastructure",
      description:
        "The street light near the intersection of Main Street and Oak Avenue has been flickering for weeks and now completely stopped working. This creates a safety hazard during nighttime.",
      status: "In Progress",
      dateSubmitted: "2025-01-15T10:30:00Z",
      userId: "user1",
      userName: "Maria Santos",
      isEmergency: false,
      isConfidential: false,
      location:
        "Main Street & Oak Avenue, Puerto Princesa City, Palawan",
      barangay: "San Jose",
      purok: "Mahogany",
      street: "Elm Street (45-67)",
      coordinates: {
        lat: 9.7392,
        lng: 118.7353
      },
      attachments: [],
      assignedStaff: "Engineer Rodriguez",
      canEdit: false,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-15T10:30:00Z" },
        {
          status: "Under Review",
          date: "2025-01-15T14:20:00Z",
        },
        { status: "Assigned", date: "2025-01-16T09:15:00Z" },
        {
          status: "In Progress",
          date: "2025-01-17T11:45:00Z",
          notes: "Work crew dispatched to site",
        },
      ],
    },
    {
      id: "2",
      trackingId: "SC-2025-002",
      title: "Water Leak at Community Center",
      category: "Infrastructure",
      description:
        "There is a significant water leak in the basement of the community center that started after the recent heavy rains. Water is pooling and may damage equipment.",
      status: "Resolved",
      dateSubmitted: "2025-01-12T08:45:00Z",
      userId: "user2",
      userName: "Juan Cruz",
      isEmergency: false,
      isConfidential: false,
      location:
        "Barangay Community Center, Puerto Princesa City, Palawan",
      barangay: "Liwanag",
      purok: "Bayview",
      street: "Community Avenue",
      coordinates: {
        lat: 9.7421,
        lng: 118.7285
      },
      attachments: [],
      assignedStaff: "Maintenance Team Alpha",
      resolutionNotes:
        "Pipe replaced and basement waterproofed. Issue resolved.",
      canEdit: false,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-12T08:45:00Z" },
        {
          status: "Under Review",
          date: "2025-01-12T10:30:00Z",
        },
        { status: "Assigned", date: "2025-01-12T15:20:00Z" },
        { status: "In Progress", date: "2025-01-13T08:00:00Z" },
        {
          status: "Resolved",
          date: "2025-01-14T16:30:00Z",
          notes: "Pipe replaced and basement waterproofed",
        },
      ],
    },
    {
      id: "3",
      trackingId: "SC-2025-003",
      title: "Unsafe Tree Branches Near Playground",
      category: "Public Safety",
      description:
        "Several large tree branches are hanging dangerously low over the children's playground area. After the storm last week, some branches appear damaged and could fall.",
      status: "Under Review",
      dateSubmitted: "2025-01-18T16:20:00Z",
      userId: "user3",
      userName: "Elena Rodriguez",
      isEmergency: false,
      isConfidential: false,
      location:
        "Riverside Park Playground, Puerto Princesa City, Palawan",
      barangay: "Maunlad (Poblacion)",
      purok: "Green Park",
      street: "Riverside Avenue",
      coordinates: {
        lat: 9.7456,
        lng: 118.7412
      },
      attachments: [],
      canEdit: true,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-18T16:20:00Z" },
        {
          status: "Under Review",
          date: "2025-01-19T09:00:00Z",
        },
      ],
    },
    {
      id: "4",
      trackingId: "SC-2025-004",
      title: "Potholes on Residential Street",
      category: "Infrastructure",
      description:
        "Multiple large potholes have formed on Elm Street between houses 45-67. These pose a risk to vehicles and cyclists, especially during rain when they fill with water.",
      status: "Submitted",
      dateSubmitted: "2025-01-20T07:15:00Z",
      userId: "user4",
      userName: "Roberto Tan",
      isEmergency: false,
      isConfidential: false,
      location:
        "Elm Street (45-67), Puerto Princesa City, Palawan",
      barangay: "San Jose",
      purok: "Mahogany",
      street: "Elm Street (45-67)",
      coordinates: {
        lat: 9.7381,
        lng: 118.7295
      },
      attachments: [],
      canEdit: true,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-20T07:15:00Z" },
      ],
    },
    {
      id: "5",
      trackingId: "SC-2025-005",
      title: "Illegal Dumping Behind Shopping Center",
      category: "Environmental",
      description:
        "Someone has been regularly dumping household waste and construction debris behind the shopping center. This is attracting pests and creating unsanitary conditions.",
      status: "Assigned",
      dateSubmitted: "2025-01-16T12:00:00Z",
      userId: "user5",
      userName: "Carmen Delgado",
      isEmergency: false,
      isConfidential: false,
      location:
        "Behind Plaza Shopping Center, Puerto Princesa City, Palawan",
      barangay: "Masigla (Poblacion)",
      purok: "Commercial",
      street: "Mall Avenue",
      coordinates: {
        lat: 9.7405,
        lng: 118.7368
      },
      attachments: [],
      assignedStaff: "Environmental Services",
      canEdit: false,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-16T12:00:00Z" },
        {
          status: "Under Review",
          date: "2025-01-16T15:30:00Z",
        },
        { status: "Assigned", date: "2025-01-17T10:00:00Z" },
      ],
    },
    {
      id: "6",
      trackingId: "SC-2025-006",
      title: "Broken Playground Equipment",
      category: "Public Safety",
      description:
        "The swing set at the neighborhood playground has a broken chain on one of the swings, and the slide has some loose bolts. Children are still using the equipment.",
      status: "In Progress",
      dateSubmitted: "2025-01-14T14:45:00Z",
      userId: "user6",
      userName: "Lisa Park",
      isEmergency: false,
      isConfidential: false,
      location:
        "Oakwood Neighborhood Playground, Puerto Princesa City, Palawan",
      barangay: "Santa Monica",
      purok: "Oakwood",
      street: "Park Lane",
      attachments: [],
      assignedStaff: "Parks & Recreation",
      canEdit: false,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-14T14:45:00Z" },
        {
          status: "Under Review",
          date: "2025-01-15T08:30:00Z",
        },
        { status: "Assigned", date: "2025-01-15T13:20:00Z" },
        {
          status: "In Progress",
          date: "2025-01-18T10:15:00Z",
          notes: "Safety inspection completed, parts ordered",
        },
      ],
    },
    {
      id: "7",
      trackingId: "SC-2025-007",
      title: "Non-functioning Traffic Signal",
      category: "Public Safety",
      description:
        "The traffic light at the intersection of Park Avenue and 3rd Street has been stuck on red for all directions since yesterday morning, causing traffic confusion.",
      status: "Resolved",
      dateSubmitted: "2025-01-13T09:20:00Z",
      userId: "user7",
      userName: "Ana Mercado",
      isEmergency: false,
      isConfidential: false,
      location:
        "Park Avenue & 3rd Street Intersection, Puerto Princesa City, Palawan",
      barangay: "Princesa (Poblacion)",
      purok: "Downtown",
      street: "Park Avenue & 3rd Street",
      attachments: [],
      assignedStaff: "Traffic Management",
      resolutionNotes:
        "Signal controller repaired and tested. Normal operation restored.",
      canEdit: false,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-13T09:20:00Z" },
        {
          status: "Under Review",
          date: "2025-01-13T10:00:00Z",
        },
        { status: "Assigned", date: "2025-01-13T11:30:00Z" },
        { status: "In Progress", date: "2025-01-13T14:15:00Z" },
        {
          status: "Resolved",
          date: "2025-01-13T17:45:00Z",
          notes: "Signal controller repaired and tested",
        },
      ],
    },
    {
      id: "8",
      trackingId: "SC-2025-008",
      title: "Overflowing Storm Drain",
      category: "Infrastructure",
      description:
        "The storm drain on River Road has been overflowing during recent rains, causing flooding on the sidewalk and making it difficult for pedestrians to pass.",
      status: "Under Review",
      dateSubmitted: "2025-01-19T11:30:00Z",
      userId: "user8",
      userName: "David Kim",
      isEmergency: false,
      isConfidential: false,
      location:
        "River Road near Bridge, Puerto Princesa City, Palawan",
      barangay: "Manggahan (Poblacion)",
      purok: "Riverside",
      street: "River Road",
      attachments: [],
      canEdit: true,
      editHistory: [],
      timeline: [
        { status: "Submitted", date: "2025-01-19T11:30:00Z" },
        {
          status: "Under Review",
          date: "2025-01-19T15:45:00Z",
        },
      ],
    },
  ];

  const login = (user: User) => {
    try {
      setCurrentUser(user);
      saveUserSession(user);

      if (user.type === "staff") {
        setCurrentPage("staff-dashboard");
      } else {
        setCurrentPage("dashboard");
      }

      toast.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      logError(error as Error, "User Login");
      toast.error("Login failed. Please try again.");
    }
  };

  const handleRegister = (user: User) => {
    // Store the user temporarily and show terms modal
    setPendingUser(user);
    setShowTermsModal(true);
  };

  const handleTermsAccept = () => {
    if (pendingUser) {
      setCurrentUser(pendingUser);
      setCurrentPage("dashboard");
      setPendingUser(null);
      setShowTermsModal(false);

      toast.success("Welcome to SafetyConnect!", {
        description:
          "Your account has been created successfully. You can now start reporting community issues.",
      });
    }
  };

  const handleTermsDecline = () => {
    setPendingUser(null);
    setShowTermsModal(false);

    toast.error("Registration cancelled", {
      description:
        "You must accept the Terms & Conditions to use SafetyConnect.",
    });
  };

  const logout = () => {
    try {
      clearUserSession();
      setCurrentUser(null);
      setPendingUser(null);
      setShowTermsModal(false);
      setCurrentPage("landing");
      toast.success("Logged out successfully");
    } catch (error) {
      logError(error as Error, "User Logout");
    }
  };

  const addReport = (
    report: Omit<
      Report,
      "id" | "trackingId" | "dateSubmitted" | "timeline"
    >,
  ) => {
    try {
      // Validate report data
      const validationErrors = validateReportData(report);
      if (validationErrors.length > 0) {
        toast.error("Invalid report data", {
          description: validationErrors.join(", "),
        });
        throw new Error(
          `Validation failed: ${validationErrors.join(", ")}`,
        );
      }

      const newReport: Report = {
        ...report,
        id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        trackingId: generateUniqueTrackingId(),
        dateSubmitted: new Date().toISOString(),
        attachments: report.attachments || [],
        canEdit: true, // New reports can be edited by default
        editHistory: [],
        timeline: [
          {
            status: "Submitted",
            date: new Date().toISOString(),
          },
        ],
      };

      setReports((prev) => [newReport, ...prev]);

      toast.success("Report submitted successfully!", {
        description: `Tracking ID: ${newReport.trackingId}`,
      });

      return newReport;
    } catch (error) {
      logError(error as Error, "Add Report");
      toast.error("Failed to submit report. Please try again.");
      throw error;
    }
  };

  const addSOSAlert = (alert: Omit<SOSAlert, "id">) => {
    try {
      const newAlert: SOSAlert = {
        ...alert,
        id: generateUniqueSOSId(),
        status: "Active",
      };

      setSOSAlerts((prev) => [newAlert, ...prev]);

      // Alert staff with toast notification
      toast.error("🚨 New SOS Emergency Alert!", {
        description: `${alert.userName} has activated SOS emergency at ${alert.location}`,
        duration: 10000,
      });

      return newAlert;
    } catch (error) {
      logError(error as Error, "Add SOS Alert");
      toast.error(
        "Failed to send SOS alert. Please try again.",
      );
      throw error;
    }
  };

  const updateReportStatus = (
    reportId: string,
    status: Report["status"],
    notes?: string,
  ) => {
    try {
      setReports((prev) =>
        prev.map((report) => {
          if (report.id === reportId) {
            const newTimeline = [...report.timeline];
            if (!newTimeline.find((t) => t.status === status)) {
              newTimeline.push({
                status,
                date: new Date().toISOString(),
                notes,
              });
            }
            return { ...report, status, timeline: newTimeline };
          }
          return report;
        }),
      );

      toast.success(`Report status updated to ${status}`);
    } catch (error) {
      logError(error as Error, "Update Report Status");
      toast.error("Failed to update report status");
    }
  };

  const updateSOSStatus = (
    alertId: string,
    status: SOSAlert["status"],
  ) => {
    try {
      setSOSAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status } : alert,
        ),
      );

      toast.success(
        `SOS Alert ${alertId} status updated to ${status}`,
      );
    } catch (error) {
      logError(error as Error, "Update SOS Status");
      toast.error("Failed to update SOS status");
    }
  };

  const updateReport = (reportId: string, updates: Partial<Report>) => {
    try {
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, ...updates } : report,
        ),
      );
    } catch (error) {
      logError(error as Error, "Update Report");
      toast.error("Failed to update report");
    }
  };

  const deleteReport = (reportId: string) => {
    try {
      setReports((prev) => prev.filter((report) => report.id !== reportId));
      toast.success("Report deleted successfully");
    } catch (error) {
      logError(error as Error, "Delete Report");
      toast.error("Failed to delete report");
    }
  };

  const assignStaffToReport = (reportId: string, staffName: string) => {
    try {
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId 
            ? { ...report, assignedStaff: staffName } 
            : report
        )
      );
      toast.success(`Report assigned to ${staffName}`);
    } catch (error) {
      logError(error as Error, "Assign Staff");
      toast.error("Failed to assign staff");
    }
  };

  const bulkUpdateReports = (reportIds: string[], updates: Partial<Report>) => {
    try {
      setReports((prev) =>
        prev.map((report) =>
          reportIds.includes(report.id) ? { ...report, ...updates } : report
        )
      );
      toast.success(`${reportIds.length} reports updated successfully`);
    } catch (error) {
      logError(error as Error, "Bulk Update Reports");
      toast.error("Failed to bulk update reports");
    }
  };

  const updateUser = (updatedUser: User) => {
    try {
      setCurrentUser(updatedUser);
      saveUserSession(updatedUser);
    } catch (error) {
      logError(error as Error, "Update User");
      toast.error("Failed to update user profile");
    }
  };

  const navigateToEditReport = (report: Report) => {
    setSelectedReportForEdit(report);
    setCurrentPage("edit-report");
  };

  const renderPage = () => {
    // If offline, show offline mode for authenticated users on mobile
    // BUT always allow SOS emergency access - it's critical!
    if (
      isOffline &&
      currentUser &&
      currentPage !== "landing" &&
      currentPage !== "login" &&
      currentPage !== "sos"  // Always allow SOS access, even offline
    ) {
      // On mobile, show full offline mode
      if (isMobile) {
        return (
          <OfflineMode
            user={currentUser}
            onNavigate={setCurrentPage}
          />
        );
      }
      // On desktop, show offline banner but allow limited functionality
      // This ensures SOS is always accessible
    }

    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "login":
        return (
          <LoginPage
            onLogin={login}
            onNavigate={setCurrentPage}
            onRegister={handleRegister}
          />
        );
      case "dashboard":
        return (
          <UserDashboard
            user={currentUser!}
            reports={reports}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case "create-report":
        return (
          <CreateReport
            user={currentUser!}
            onSubmit={addReport}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case "edit-report":
        return selectedReportForEdit ? (
          <EditReport
            user={currentUser!}
            report={selectedReportForEdit}
            onUpdateReport={updateReport}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        ) : (
          <UserDashboard
            user={currentUser!}
            reports={reports}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case "user-profile":
        return (
          <UserProfile
            user={currentUser!}
            reports={reports}
            onNavigate={setCurrentPage}
            onUserUpdate={updateUser}
            onLogout={logout}
          />
        );
      case "sos":
        return (
          <SOSEmergency
            user={currentUser!}
            sosAlerts={sosAlerts.filter(
              (alert) => alert.userId === currentUser?.id,
            )}
            onSubmitSOS={addSOSAlert}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case "track-reports":
        return (
          <TrackReports
            user={currentUser!}
            reports={reports}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );
      case "staff-dashboard":
        return (
          <StaffDashboard
            user={currentUser!}
            reports={reports}
            sosAlerts={sosAlerts}
            onUpdateReportStatus={updateReportStatus}
            onUpdateSOSStatus={updateSOSStatus}
            onUpdateReport={updateReport}
            onDeleteReport={deleteReport}
            onAssignStaff={assignStaffToReport}
            onBulkUpdate={bulkUpdateReports}
            onNavigate={setCurrentPage}
            onLogout={logout}
          />
        );

      case "reviews":
        return <UserReviews onNavigate={setCurrentPage} />;
      case "offline":
        return currentUser ? (
          <OfflineMode
            user={currentUser}
            onNavigate={setCurrentPage}
          />
        ) : (
          <LandingPage onNavigate={setCurrentPage} />
        );
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  // Enhanced mobile navigation logic for offline SOS access
  const shouldShowMobileNav =
    currentUser &&
    isMobile &&
    (navigator.onLine || currentPage === "sos" || currentPage === "offline") &&  // Always show nav for SOS and offline mode
    !["landing", "login"].includes(currentPage);

  // Add emergency SOS shortcut when offline
  const shouldShowEmergencyShortcut = isOffline && currentUser && currentPage !== "sos";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading SafetyConnect...
          </p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
          {/* Mobile Navigation */}
          {shouldShowMobileNav && (
            <MobileNavigation
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              isOffline={isOffline}
              showBackButton={[
                "create-report",
                "edit-report",
                "user-profile",
                "sos",
                "track-reports",
              ].includes(currentPage)}
              onBack={() => {
                if (currentPage === "edit-report") {
                  setSelectedReportForEdit(null);
                }
                setCurrentPage("dashboard");
              }}
            />
          )}

          <div
            className={shouldShowMobileNav ? "pb-20 pt-16" : ""}
          >
            {renderPage()}
          </div>

          {/* Network Status Indicator */}
          <NetworkStatus isOffline={isOffline} />

          {/* Terms Acceptance Modal for New Users */}
          <TermsAcceptanceModal
            isOpen={showTermsModal}
            onAccept={handleTermsAccept}
            onDecline={handleTermsDecline}
            userName={pendingUser?.name || ""}
          />

          <Toaster />
        </div>
      </ErrorBoundary>
    </LanguageProvider>
  );
}