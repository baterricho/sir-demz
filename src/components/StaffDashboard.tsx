import React, { useState, useMemo, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { 
  User, 
  Settings, 
  LogOut, 
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  BarChart3,
  Shield,
  Search,
  Filter,
  Edit,
  MapPin,
  Calendar,
  ChevronDown,
  Navigation,
  RefreshCw,
  Eye,
  Phone,
  Activity,
  Trash2,
  Flag
} from 'lucide-react';
import { User as UserType, Report, SOSAlert, Page } from '../App';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { getUsersDatabase } from '../utils/storage';
import { StaffDashboardTabs } from './StaffDashboardTabs';

interface StaffDashboardProps {
  user: UserType;
  reports: Report[];
  sosAlerts: SOSAlert[];
  onUpdateReportStatus: (reportId: string, status: Report['status'], notes?: string) => void;
  onUpdateSOSStatus: (alertId: string, status: SOSAlert['status']) => void;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  onDeleteReport: (reportId: string) => void;
  onAssignStaff: (reportId: string, staffName: string) => void;
  onBulkUpdate: (reportIds: string[], updates: Partial<Report>) => void;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  reportCount: number;
  status: 'Active' | 'Inactive';
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
  details: string;
}

export function StaffDashboard({ 
  user, 
  reports, 
  sosAlerts, 
  onUpdateReportStatus, 
  onUpdateSOSStatus, 
  onUpdateReport,
  onDeleteReport,
  onAssignStaff,
  onBulkUpdate,
  onNavigate, 
  onLogout 
}: StaffDashboardProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSOSAlert, setSelectedSOSAlert] = useState<SOSAlert | null>(null);
  const [selectedLocationAlert, setSelectedLocationAlert] = useState<SOSAlert | null>(null);
  const [updateStatus, setUpdateStatus] = useState<Report['status']>('Submitted');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [internalComment, setInternalComment] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMember | null>(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffFormData, setStaffFormData] = useState({ name: '', email: '', role: '', status: 'Active' as const });
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Function to get user details by userId
  const getUserDetails = (userId: string, userName: string): { name: string; phoneNumber?: string } => {
    try {
      const usersDb = getUsersDatabase();
      
      // Find user by userId or email (since users might be stored by email)
      for (const [email, userData] of Object.entries(usersDb)) {
        if (userData.id === userId || userData.name === userName) {
          return {
            name: userData.name || userName,
            phoneNumber: userData.phoneNumber
          };
        }
      }
      
      // If user not found in database, return default data for demo
      return {
        name: userName,
        phoneNumber: '+63 917 123 4567' // Default user phone
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return {
        name: userName,
        phoneNumber: '+63 917 123 4567'
      };
    }
  };

  // Dynamic categories based on actual reports
  const categories = useMemo<Category[]>(() => {
    const categoryMap = new Map<string, number>();
    reports.forEach(report => {
      categoryMap.set(report.category, (categoryMap.get(report.category) || 0) + 1);
    });

    const predefinedCategories = [
      { name: 'Infrastructure', description: 'Roads, utilities, public facilities' },
      { name: 'Emergency', description: 'Urgent issues requiring immediate attention' },
      { name: 'Public Safety', description: 'Security, crime, safety concerns' },
      { name: 'Health Service', description: 'Healthcare facilities, medical issues' },
      { name: 'Environmental', description: 'Pollution, waste, environmental concerns' },
      { name: 'Compliance', description: 'Building permits, regulations, violations' },
      { name: 'Others', description: 'Miscellaneous community issues' }
    ];

    return predefinedCategories.map((cat, index) => ({
      id: (index + 1).toString(),
      name: cat.name,
      description: cat.description,
      reportCount: categoryMap.get(cat.name) || 0,
      status: 'Active' as const
    }));
  }, [reports]);

  const [staffMembers] = useState<StaffMember[]>([
    { id: '1', name: 'John Smith', email: 'john.smith@communitycall.com', role: 'Administrator', status: 'Active' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@communitycall.com', role: 'Field Coordinator', status: 'Active' },
    { id: '3', name: 'Mike Davis', email: 'mike.davis@communitycall.com', role: 'Emergency Responder', status: 'Active' },
    { id: '4', name: 'Lisa Wilson', email: 'lisa.wilson@communitycall.com', role: 'Community Liaison', status: 'Inactive' }
  ]);

  const [systemLogs] = useState<SystemLog[]>([
    { id: '1', timestamp: '2025-01-15T14:30:00Z', actor: 'John Smith', event: 'Report Status Updated', details: 'Changed report CC-2025-001 from "Under Review" to "In Progress"' },
    { id: '2', timestamp: '2025-01-15T13:45:00Z', actor: 'Sarah Johnson', event: 'SOS Alert Responded', details: 'Marked SOS alert sos1 as "Responded"' },
    { id: '3', timestamp: '2025-01-15T10:20:00Z', actor: 'Mike Davis', event: 'Staff Assignment', details: 'Assigned report CC-2025-002 to Lisa Wilson' },
    { id: '4', timestamp: '2025-01-15T09:15:00Z', actor: 'System', event: 'New Report Created', details: 'New report CC-2025-003 submitted by user Jane Doe' }
  ]);

  const getStatusColor = (status: Report['status'] | SOSAlert['status']) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-500';
      case 'Under Review': return 'bg-yellow-500';
      case 'Assigned': return 'bg-orange-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-600';
      case 'Active': return 'bg-red-500';
      case 'Responded': return 'bg-yellow-500';
      case 'Closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleUpdateReport = useCallback(async () => {
    if (!selectedReport) return;
    
    try {
      setIsLoading(true);
      
      if (!updateStatus) {
        toast.error('Please select a status');
        return;
      }

      onUpdateReportStatus(selectedReport.id, updateStatus, resolutionNotes);
      
      // Assign staff if selected
      if (assignedStaff && assignedStaff !== 'unassigned' && assignedStaff !== selectedReport.assignedStaff) {
        onAssignStaff(selectedReport.id, assignedStaff);
      } else if (assignedStaff === 'unassigned' && selectedReport.assignedStaff) {
        // Clear assignment
        onAssignStaff(selectedReport.id, '');
      }
      
      toast.success(`Report ${selectedReport.trackingId} updated to ${updateStatus}`);
      setSelectedReport(null);
      setResolutionNotes('');
      setUpdateStatus('Submitted');
      setAssignedStaff('');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedReport, updateStatus, resolutionNotes, assignedStaff, onUpdateReportStatus, onAssignStaff]);

  const handleDeleteReport = useCallback((reportId: string) => {
    setReportToDelete(reportId);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (reportToDelete) {
      onDeleteReport(reportToDelete);
      setReportToDelete(null);
      setShowDeleteConfirm(false);
      setSelectedReport(null);
    }
  }, [reportToDelete, onDeleteReport]);

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(r => r.id));
    }
  };

  const handleBulkAction = (action: string, value?: any) => {
    if (selectedReports.length === 0) {
      toast.error('Please select at least one report');
      return;
    }

    switch (action) {
      case 'status':
        onBulkUpdate(selectedReports, { status: value });
        break;
      case 'assign':
        onBulkUpdate(selectedReports, { assignedStaff: value });
        break;
      default:
        break;
    }
    setSelectedReports([]);
  };

  const handleFlagSpam = (reportId: string) => {
    onUpdateReport(reportId, { status: 'Rejected' });
    toast.success('Report flagged as spam');
  };

  const addInternalComment = (reportId: string) => {
    if (!internalComment.trim()) return;
    onUpdateReport(reportId, { 
      resolutionNotes: internalComment 
    });
    toast.success('Internal comment added');
    setInternalComment('');
  };

  // Get all citizens from reports
  const getCitizens = useMemo(() => {
    const usersDb = getUsersDatabase();
    const citizenMap = new Map();
    
    reports.forEach(report => {
      if (!citizenMap.has(report.userId)) {
        const userDetails = getUserDetails(report.userId, report.userName);
        citizenMap.set(report.userId, {
          id: report.userId,
          name: report.userName,
          phoneNumber: userDetails.phoneNumber,
          reportCount: 0,
          sosCount: 0,
          status: 'Active'
        });
      }
      const citizen = citizenMap.get(report.userId);
      citizen.reportCount++;
    });
    
    sosAlerts.forEach(alert => {
      if (citizenMap.has(alert.userId)) {
        citizenMap.get(alert.userId).sosCount++;
      }
    });
    
    return Array.from(citizenMap.values());
  }, [reports, sosAlerts]);

  const handleUpdateSOS = useCallback(async (status: SOSAlert['status']) => {
    if (!selectedSOSAlert) return;
    
    try {
      setIsLoading(true);
      onUpdateSOSStatus(selectedSOSAlert.id, status);
      toast.success(`SOS Alert #${selectedSOSAlert.id} updated to ${status}`);
      setSelectedSOSAlert(null);
    } catch (error) {
      console.error('Error updating SOS alert:', error);
      toast.error('Failed to update SOS alert. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSOSAlert, onUpdateSOSStatus]);

  const stats = {
    totalReports: reports.length,
    emergencyReports: reports.filter(r => r.isEmergency).length,
    pendingReports: reports.filter(r => !['Resolved', 'Rejected'].includes(r.status)).length,
    resolvedReports: reports.filter(r => r.status === 'Resolved').length,
    activeSOS: sosAlerts.filter(s => s.status === 'Active').length
  };

  const filteredReports = useMemo(() => {
    let filtered = reports.filter(report => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.userName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All Status' || report.status === statusFilter;
      const matchesCategory = categoryFilter === 'All Categories' || report.category === categoryFilter;
      
      const matchesLocation = !locationFilter || 
        (report.location && report.location.toLowerCase().includes(locationFilter.toLowerCase()));
      
      const matchesDate = (!dateFilter.from || new Date(report.dateSubmitted) >= new Date(dateFilter.from)) &&
                         (!dateFilter.to || new Date(report.dateSubmitted) <= new Date(dateFilter.to));
      
      return matchesSearch && matchesStatus && matchesCategory && matchesLocation && matchesDate;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
        case 'oldest':
          return new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime();
        case 'priority':
          return (b.isEmergency ? 1 : 0) - (a.isEmergency ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reports, searchQuery, statusFilter, categoryFilter, locationFilter, dateFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-white">SafetyConnect</h1>
              </div>
              
              <nav className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 bg-white/20 font-medium"
                  onClick={() => onNavigate('staff-dashboard')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-blue-100 text-sm">{user.type === 'staff' ? 'Staff Member' : 'User'}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <ChevronDown className="w-4 h-4" />
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Staff Dashboard</h2>
          <p className="text-gray-600">Welcome, {user.name}. Manage and respond to community reports.</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="inline-flex w-full justify-start overflow-x-auto bg-white shadow-sm p-1 rounded-lg">
            <TabsTrigger value="dashboard" className="whitespace-nowrap">Dashboard</TabsTrigger>
            <TabsTrigger value="manage" className="whitespace-nowrap">Manage</TabsTrigger>
            <TabsTrigger value="users" className="whitespace-nowrap">Citizens</TabsTrigger>
            <TabsTrigger value="staff" className="whitespace-nowrap">Staff</TabsTrigger>
            <TabsTrigger value="sos" className="whitespace-nowrap">SOS</TabsTrigger>
            <TabsTrigger value="analytics" className="whitespace-nowrap">Analytics</TabsTrigger>
            <TabsTrigger value="logs" className="whitespace-nowrap">Logs</TabsTrigger>
            <TabsTrigger value="settings" className="whitespace-nowrap">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalReports}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Emergency Reports</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.emergencyReports}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pending</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.pendingReports}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Resolved</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.resolvedReports}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Section */}
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Filter Reports:</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Showing {filteredReports.length} of {reports.length} reports
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Status">All Status</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Categories">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name} ({category.reportCount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStatusFilter('All Status');
                      setCategoryFilter('All Categories');
                      setSearchQuery('');
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-0">
                <div className="space-y-0 divide-y">
                  {filteredReports.slice(0, 10).map((report) => (
                    <div key={report.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800">
                              {report.isEmergency ? 'EMERGENCY SOS ALERT' : report.title.toUpperCase()}
                            </h3>
                            {report.isEmergency && (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                🚨 EMERGENCY
                              </Badge>
                            )}
                            <Badge className={`${getStatusColor(report.status)} text-white`}>
                              {report.status.toUpperCase()}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="ml-auto"
                              onClick={() => setSelectedReport(report)}
                            >
                              Manage
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>ID: {report.trackingId}</span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Citizen Report
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              {report.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(report.dateSubmitted).toLocaleDateString()}
                            </span>
                          </div>
                          {report.isEmergency ? (
                            <p className="text-gray-700 mb-2">
                              Emergency SOS triggered by {report.userName} at {new Date(report.dateSubmitted).toLocaleDateString()}, {new Date(report.dateSubmitted).toLocaleTimeString()}. 
                              Location: {report.location || 'Location not available'}
                              {report.coordinates && (
                                <span className="text-gray-500 ml-1">
                                  ({report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)})
                                </span>
                              )}.
                            </p>
                          ) : (
                            <p className="text-gray-700 mb-2">{report.description}</p>
                          )}
                          {report.location && !report.isEmergency && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>Location: {report.location}
                                {report.coordinates && (
                                  <span className="text-gray-500 ml-1">
                                    ({report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)})
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                          {report.status === 'Resolved' && report.resolutionNotes && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-medium">Resolution: {report.resolutionNotes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Reports */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Manage Reports</span>
                  {selectedReports.length > 0 && (
                    <Badge variant="outline" className="text-lg">
                      {selectedReports.length} selected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Update report statuses and add resolution notes</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Advanced Filters */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search reports..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Input
                      type="text"
                      placeholder="Filter by location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="priority">Priority (Emergency)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Status">All Status</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Assigned">Assigned</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      placeholder="From date"
                      value={dateFilter.from}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                    />
                    <Input
                      type="date"
                      placeholder="To date"
                      value={dateFilter.to}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                    />
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All Status');
                      setLocationFilter('');
                      setDateFilter({ from: '', to: '' });
                      setSortBy('newest');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedReports.length > 0 && (
                  <div className="flex gap-2 mb-4 p-4 bg-blue-50 rounded-lg">
                    <Select onValueChange={(value) => handleBulkAction('status', value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Bulk Status Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under Review">Mark as Under Review</SelectItem>
                        <SelectItem value="Assigned">Mark as Assigned</SelectItem>
                        <SelectItem value="In Progress">Mark as In Progress</SelectItem>
                        <SelectItem value="Resolved">Mark as Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => handleBulkAction('assign', value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Bulk Assign Staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.map(staff => (
                          <SelectItem key={staff.id} value={staff.name}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setSelectedReports([])}>
                      Clear Selection
                    </Button>
                  </div>
                )}

                {/* Reports List with Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">Select All ({filteredReports.length} reports)</span>
                  </div>
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex gap-4 items-start">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => toggleReportSelection(report.id)}
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{report.trackingId}</h4>
                            <Badge className={`${getStatusColor(report.status)} text-white`}>
                              {report.status}
                            </Badge>
                            {report.isEmergency && (
                              <Badge variant="destructive">Emergency</Badge>
                            )}
                            {report.assignedStaff && (
                              <Badge variant="outline">👤 {report.assignedStaff}</Badge>
                            )}
                          </div>
                          <p className="text-gray-800 mb-2">{report.title}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Submitted by: {report.userName}</p>
                            <p>Category: {report.category}</p>
                            <p>Date: {new Date(report.dateSubmitted).toLocaleDateString()}</p>
                            {report.location && <p>Location: {report.location}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setUpdateStatus(report.status);
                              setAssignedStaff(report.assignedStaff || '');
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Citizens Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Citizen Management
                </CardTitle>
                <CardDescription>View and manage registered citizens</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Citizen ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>SOS Alerts</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCitizens.map((citizen) => (
                      <TableRow key={citizen.id}>
                        <TableCell className="font-mono text-sm">{citizen.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-medium">{citizen.name}</TableCell>
                        <TableCell>{citizen.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>{citizen.reportCount}</TableCell>
                        <TableCell>{citizen.sosCount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50">
                            {citizen.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCitizen(citizen)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Management */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Staff Management
                  </span>
                  <Button onClick={() => {
                    setShowStaffModal(true);
                    setStaffFormData({ name: '', email: '', role: '', status: 'Active' });
                  }}>
                    Add Staff Member
                  </Button>
                </CardTitle>
                <CardDescription>Manage staff members and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffMembers.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{staff.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {staff.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedStaffMember(staff);
                              setShowStaffModal(true);
                              setStaffFormData({ name: staff.name, email: staff.email, role: staff.role, status: staff.status });
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories - Keeping original */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>Configure report categories and their settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Number of Reports</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.reportCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SOS Alerts */}
          <TabsContent value="sos" className="space-y-6">
            {/* SOS Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 mb-1">Active SOS</p>
                      <p className="text-3xl font-bold text-red-800">{sosAlerts.filter(s => s.status === 'Active').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 mb-1">Responded</p>
                      <p className="text-3xl font-bold text-yellow-800">{sosAlerts.filter(s => s.status === 'Responded').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 mb-1">Closed</p>
                      <p className="text-3xl font-bold text-green-800">{sosAlerts.filter(s => s.status === 'Closed').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SOS Alerts Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  SOS Emergency Alerts Management
                </CardTitle>
                <CardDescription>
                  Monitor and respond to emergency SOS alerts from community members
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sosAlerts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SOS ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sosAlerts.map((alert) => (
                          <TableRow key={alert.id} className={
                            alert.status === 'Active' ? 'bg-red-50' :
                            alert.status === 'Responded' ? 'bg-yellow-50' :
                            'bg-green-50'
                          }>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  alert.status === 'Active' ? 'bg-red-500 animate-pulse' :
                                  alert.status === 'Responded' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}></div>
                                SOS-{alert.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                {alert.userName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                {new Date(alert.time).toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <button
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                                onClick={() => setSelectedLocationAlert(alert)}
                                aria-label={`View location for SOS ${alert.id}`}
                              >
                                <MapPin className="w-4 h-4" />
                                {alert.location}
                              </button>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(alert.status)} text-white`}>
                                {alert.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedSOSAlert(alert)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
                                  {isLoading ? 'Updating...' : 'Update'}
                                </Button>
                                {alert.status === 'Active' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleUpdateSOS('Responded')}
                                    disabled={isLoading}
                                  >
                                    <Phone className="w-4 h-4 mr-1" />
                                    Respond
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No SOS Alerts</h3>
                    <p>Emergency SOS alerts from community members will appear here</p>
                    <p className="text-sm mt-2 text-gray-400">
                      Active alerts require immediate attention and response
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Tabs: Analytics, Logs, Settings */}
          <StaffDashboardTabs reports={reports} sosAlerts={sosAlerts} systemLogs={systemLogs} />

        </Tabs>
      </div>

      {/* Report Update Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Report - {selectedReport?.trackingId}</DialogTitle>
            <DialogDescription>
              Change the status and add resolution notes for this report
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (() => {
              const userDetails = getUserDetails(selectedReport.userId, selectedReport.userName);
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Report Details</h4>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                      <p><strong>Title:</strong> {selectedReport.title}</p>
                      <p><strong>Category:</strong> {selectedReport.category}</p>
                      <p><strong>User:</strong> {userDetails.name} {userDetails.phoneNumber ? `(${userDetails.phoneNumber})` : ''}</p>
                      <p><strong>Current Status:</strong> {selectedReport.status}</p>
                      {selectedReport.location && (
                        <p><strong>Location:</strong> {selectedReport.location}
                          {selectedReport.coordinates && (
                            <span className="text-gray-500 ml-2">
                              ({selectedReport.coordinates.lat.toFixed(4)}, {selectedReport.coordinates.lng.toFixed(4)})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

              
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status</label>
                <Select value={updateStatus} onValueChange={(value) => setUpdateStatus(value as Report['status'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign to Staff Member</label>
                <Select value={assignedStaff} onValueChange={setAssignedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {staffMembers.filter(s => s.status === 'Active').map(staff => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name} - {staff.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  placeholder="Add notes about the status update or resolution..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                />
              </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleUpdateReport} disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Report'}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedReport(null)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        handleDeleteReport(selectedReport.id);
                        setSelectedReport(null);
                      }}
                      disabled={isLoading}
                    >
                      Delete Report
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleFlagSpam(selectedReport.id)}
                      disabled={isLoading}
                    >
                      Flag as Spam
                    </Button>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* SOS Alert Update Modal */}
      <Dialog open={!!selectedSOSAlert} onOpenChange={() => setSelectedSOSAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update SOS Alert</DialogTitle>
            <DialogDescription>
              Update the status of this emergency alert
            </DialogDescription>
          </DialogHeader>
          
          {selectedSOSAlert && (() => {
              const userDetails = getUserDetails(selectedSOSAlert.userId, selectedSOSAlert.userName);
              return (
                <div className="space-y-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-medium text-red-700 mb-2">Alert Details</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>User:</strong> {userDetails.name} {userDetails.phoneNumber ? `(${userDetails.phoneNumber})` : ''}</p>
                      <p><strong>Time:</strong> {new Date(selectedSOSAlert.time).toLocaleString()}</p>
                      <p><strong>Location:</strong> {selectedSOSAlert.location}
                        {selectedSOSAlert.coordinates && (
                          <span className="text-gray-500 ml-2">
                            ({selectedSOSAlert.coordinates.lat.toFixed(4)}, {selectedSOSAlert.coordinates.lng.toFixed(4)})
                          </span>
                        )}
                      </p>
                      <p><strong>Current Status:</strong> {selectedSOSAlert.status}</p>
                    </div>
                  </div>


                  <div className="flex gap-4 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => handleUpdateSOS('Responded')}
                      disabled={selectedSOSAlert.status === 'Responded' || selectedSOSAlert.status === 'Closed' || isLoading}
                    >
                      Mark as Responded
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleUpdateSOS('Closed')}
                      disabled={selectedSOSAlert.status === 'Closed' || isLoading}
                    >
                      Close Alert
                    </Button>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 pt-4">
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Report
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Map Modal */}
      <Dialog open={!!selectedLocationAlert} onOpenChange={() => setSelectedLocationAlert(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              SOS Emergency Location
            </DialogTitle>
            <DialogDescription>
              Detailed location where the emergency alert was triggered
            </DialogDescription>
          </DialogHeader>
          
          {selectedLocationAlert && (() => {
              const userDetails = getUserDetails(selectedLocationAlert.userId, selectedLocationAlert.userName);
              return (
                <div className="space-y-4">
                  {/* Alert Info */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-red-700">SOS ID:</strong> SOS-{selectedLocationAlert.id}
                      </div>
                      <div>
                        <strong className="text-red-700">User:</strong> {userDetails.name} {userDetails.phoneNumber ? `(${userDetails.phoneNumber})` : ''}
                      </div>
                      <div>
                        <strong className="text-red-700">Time Triggered:</strong> {new Date(selectedLocationAlert.time).toLocaleString()}
                      </div>
                      <div>
                        <strong className="text-red-700">Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedLocationAlert.status)} text-white`}>
                          {selectedLocationAlert.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2">
                      <strong className="text-red-700">Location:</strong> {selectedLocationAlert.location}
                      {selectedLocationAlert.coordinates && (
                        <span className="text-red-500 ml-2">
                          ({selectedLocationAlert.coordinates.lat.toFixed(4)}, {selectedLocationAlert.coordinates.lng.toFixed(4)})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Emergency Response Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedLocationAlert(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}