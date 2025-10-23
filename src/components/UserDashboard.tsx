import React, { useState } from 'react';
import { Button } from './ui/button';
import { LocationMap } from './LocationMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Phone, 
  FileText, 
  AlertTriangle, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Languages
} from 'lucide-react';
import { User as UserType, Report, Page } from '../App';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

interface UserDashboardProps {
  user: UserType;
  reports: Report[];
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function UserDashboard({ user, reports, onNavigate, onLogout }: UserDashboardProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedLocationReport, setSelectedLocationReport] = useState<Report | null>(null);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: 'en' | 'tl') => {
    setLanguage(newLanguage);
    setShowLanguageSettings(false);
    toast.success(t('settings.languageUpdated'));
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-500';
      case 'Under Review': return 'bg-yellow-500';
      case 'Assigned': return 'bg-orange-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter(r => !['Resolved', 'Rejected'].includes(r.status)).length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">SafetyConnect</h1>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => onNavigate('create-report')}
                className="text-gray-600 hover:text-gray-700"
              >
                {t('nav.reportIssue')}
              </button>
              <button 
                onClick={() => onNavigate('sos')}
                className="text-gray-600 hover:text-gray-700"
              >
                {t('nav.sosEmergency')}
              </button>
              <button 
                onClick={() => onNavigate('track-reports')}
                className="text-gray-600 hover:text-gray-700"
              >
                {t('nav.trackReports')}
              </button>
            </nav>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowLanguageSettings(true)}>
                  <Languages className="w-4 h-4 mr-2" />
                  {t('nav.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}, {user.name}</h2>
          <p className="text-blue-100">{t('dashboard.manageReports')}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button 
            onClick={() => onNavigate('create-report')}
            className="h-20 bg-white hover:bg-gray-50 text-gray-800 border shadow-sm flex flex-col gap-2"
            variant="outline"
          >
            <FileText className="w-6 h-6 text-blue-500" />
            <span>{t('dashboard.reportIssue')}</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('sos')}
            className="h-20 bg-white hover:bg-gray-50 text-gray-800 border shadow-sm flex flex-col gap-2"
            variant="outline"
          >
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span>{t('dashboard.sosEmergency')}</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('track-reports')}
            className="h-20 bg-white hover:bg-gray-50 text-gray-800 border shadow-sm flex flex-col gap-2"
            variant="outline"
          >
            <Search className="w-6 h-6 text-green-500" />
            <span>{t('dashboard.trackReports')}</span>
          </Button>
        </div>

        {/* Context Information */}
        <div className="bg-white rounded-xl p-6 mb-8 border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            {t('dashboard.aboutSafetyConnect')}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">{t('dashboard.reportCommunityIssues')}</h4>
              <p className="text-sm text-gray-600">
                {t('dashboard.reportDescription')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">{t('dashboard.emergencyResponse')}</h4>
              <p className="text-sm text-gray-600">
                {t('dashboard.emergencyDescription')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">{t('dashboard.communitySafety')}</h4>
              <p className="text-sm text-gray-600">
                {t('dashboard.communityDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('dashboard.totalReports')}</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('dashboard.pendingReports')}</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('dashboard.resolvedReports')}</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports - Full Width */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Recent Reports
            </CardTitle>
            <CardDescription>
              Track the status of your submitted reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 6).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-gray-800 truncate mb-1">
                      {report.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {report.category}
                      </span>
                      <span>•</span>
                      <span>{new Date(report.dateSubmitted).toLocaleDateString()}</span>
                      {report.location && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-xs">{report.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge
                      className={`${getStatusColor(report.status)} text-white`}
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No reports yet</p>
                  <p className="text-sm">Submit your first community report to get started</p>
                </div>
              )}
              {reports.length > 6 && (
                <div className="text-center pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('track-reports')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View All Reports ({reports.length})
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Detail Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Report Details
            </DialogTitle>
            <DialogDescription>
              Tracking ID: {selectedReport?.trackingId}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Title</h4>
                <p className="text-gray-600">{selectedReport.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Category</h4>
                  <p className="text-gray-600">{selectedReport.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Status</h4>
                  <Badge className={`${getStatusColor(selectedReport.status)} text-white`}>
                    {selectedReport.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Description</h4>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>
              
              {selectedReport.location && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Location</h4>
                  <p className="text-gray-600">{selectedReport.location}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Timeline</h4>
                <div className="space-y-2">
                  {selectedReport.timeline.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status as any)}`}></div>
                      <span className="font-medium">{event.status}</span>
                      <span className="text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      {event.notes && <span className="text-gray-600">- {event.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Location Report Modal */}
      <Dialog open={!!selectedLocationReport} onOpenChange={() => setSelectedLocationReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Report
            </DialogTitle>
            <DialogDescription>
              Report from the map
            </DialogDescription>
          </DialogHeader>
          {selectedLocationReport && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Title</h4>
                <p className="text-gray-600">{selectedLocationReport.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Category</h4>
                  <p className="text-gray-600">{selectedLocationReport.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Status</h4>
                  <Badge className={`${getStatusColor(selectedLocationReport.status)} text-white`}>
                    {selectedLocationReport.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Description</h4>
                <p className="text-gray-600">{selectedLocationReport.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Language Settings Modal */}
      <Dialog open={showLanguageSettings} onOpenChange={setShowLanguageSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              {t('settings.language')}
            </DialogTitle>
            <DialogDescription>
              {t('settings.chooseLanguage')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.chooseLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <span>🇺🇸</span>
                      <span>{t('settings.english')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="tl">
                    <div className="flex items-center gap-2">
                      <span>🇵🇭</span>
                      <span>{t('settings.tagalog')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLanguageSettings(false)}
                className="flex-1"
              >
                {t('action.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Emergency SOS Button - Always Accessible */}
      <Button 
        onClick={() => onNavigate('sos')}
        aria-label="Emergency SOS"
        variant="destructive"
        className="fixed bottom-6 right-6 w-28 h-28 md:w-32 md:h-32 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl z-50 flex items-center justify-center transition-all duration-200 hover:scale-110 focus:ring-4 ring-red-300"
        title="Emergency SOS - Quick Access"
      >
        <div className="flex flex-col items-center justify-center select-none">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 mb-1 opacity-90" />
          <span className="text-xl md:text-2xl font-extrabold tracking-wide">SOS</span>
          <span className="text-[10px] md:text-xs font-semibold tracking-wider opacity-90">EMERGENCY</span>
        </div>
      </Button>
    </div>
  );
}
