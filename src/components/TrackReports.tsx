import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { LocationMap } from './LocationMap';
import { 
  Phone, 
  User, 
  Settings, 
  LogOut, 
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { User as UserType, Report, Page } from '../App';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface TrackReportsProps {
  user: UserType;
  reports: Report[];
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function TrackReports({ user, reports, onNavigate, onLogout }: TrackReportsProps) {

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedLocationReport, setSelectedLocationReport] = useState<Report | null>(null);

  const statuses = ['All Status', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];


  
  const categories = [
    'All Categories', 
    'Infrastructure', 
    'Public Safety', 
    'Health Services', 
    'Environmental', 
    'Emergency', 
    'Compliance',
    'Others'
  ];



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

  const getTimelineSteps = () => [
    'Submitted',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved'
  ];

  const getStepStatus = (report: Report, step: string) => {
    const hasStep = report.timeline.some(t => t.status === step);
    const currentIndex = getTimelineSteps().indexOf(report.status);
    const stepIndex = getTimelineSteps().indexOf(step);
    
    if (hasStep) return 'completed';
    if (stepIndex <= currentIndex) return 'current';
    return 'pending';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.trackingId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'All Categories' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const TimelineStep = ({ step, status, report }: { step: string; status: 'completed' | 'current' | 'pending'; report: Report }) => {
    const stepData = report.timeline.find(t => t.status === step);
    
    return (
      <div className="flex items-center">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
          ${status === 'completed' ? 'bg-green-500 text-white' : 
            status === 'current' ? 'bg-blue-500 text-white' : 
            'bg-gray-200 text-gray-500'}
        `}>
          {status === 'completed' ? <CheckCircle className="w-4 h-4" /> : 
           status === 'current' ? <Clock className="w-4 h-4" /> : '○'}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-800">{step}</div>
          {stepData && (
            <div className="text-xs text-gray-500">
              {new Date(stepData.date).toLocaleDateString()} at {new Date(stepData.date).toLocaleTimeString()}
              {stepData.notes && <div className="mt-1">{stepData.notes}</div>}
            </div>
          )}
        </div>
      </div>
    );
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
              <h1 className="text-lg font-bold text-gray-800">SafetyConnect</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-gray-600 hover:text-gray-700"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('create-report')}
                className="text-gray-600 hover:text-gray-700"
              >
                Report Issue
              </button>
              <button 
                onClick={() => onNavigate('sos')}
                className="text-gray-600 hover:text-gray-700"
              >
                SOS Emergency
              </button>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Track Reports
              </button>
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Reports</h2>
          <p className="text-gray-600">Monitor the progress of your submitted reports</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search Reports</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by title or tracking ID..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-4">
                  {reports.length === 0 
                    ? "You haven't submitted any reports yet."
                    : "Try adjusting your search criteria or filters."}
                </p>
                {reports.length === 0 && (
                  <Button onClick={() => onNavigate('create-report')}>
                    Submit Your First Report
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-800">{report.trackingId}</h3>
                        <Badge className={`${getStatusColor(report.status)} text-white`}>
                          {report.status}
                        </Badge>
                        {report.isEmergency && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Emergency
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">{report.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.dateSubmitted).toLocaleDateString()}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{report.category}</span>
                        {report.location && (
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
                            onClick={() => setSelectedLocationReport(report)}
                          >
                            <MapPin className="w-3 h-3" />
                            View Location
                          </button>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedReport(report)}
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Timeline */}
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-700 mb-3">Progress Timeline</h5>
                    <div className="flex items-center justify-between">
                      {getTimelineSteps().map((step, index) => (
                        <div key={step} className="flex items-center flex-1">
                          <div className="flex flex-col items-center">
                            <div className={`
                              w-4 h-4 rounded-full
                              ${getStepStatus(report, step) === 'completed' ? 'bg-green-500' :
                                getStepStatus(report, step) === 'current' ? 'bg-blue-500' :
                                'bg-gray-300'}
                            `} />
                            <span className="text-xs text-gray-600 mt-1 text-center max-w-16">
                              {step.replace(' ', '\n')}
                            </span>
                          </div>
                          {index < getTimelineSteps().length - 1 && (
                            <div className={`
                              flex-1 h-0.5 mx-2
                              ${report.timeline.some(t => getTimelineSteps().indexOf(t.status) > index) ? 'bg-green-500' : 'bg-gray-300'}
                            `} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details - {selectedReport?.trackingId}</DialogTitle>
            <DialogDescription>
              Submitted on {selectedReport && new Date(selectedReport.dateSubmitted).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`${getStatusColor(selectedReport.status)} text-white`}>
                  {selectedReport.status}
                </Badge>
                {selectedReport.isEmergency && (
                  <Badge variant="destructive">Emergency</Badge>
                )}
                {selectedReport.isConfidential && (
                  <Badge variant="secondary">Confidential</Badge>
                )}
                <Badge variant="outline">{selectedReport.category}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Title</h4>
                <p className="text-gray-800">{selectedReport.title}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>

              {selectedReport.isEmergency && selectedReport.emergencyDetails && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Emergency Details</h4>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm"><strong>Type:</strong> {selectedReport.emergencyType}</p>
                    <p className="text-sm mt-1"><strong>Details:</strong> {selectedReport.emergencyDetails}</p>
                  </div>
                </div>
              )}

              {selectedReport.location && (
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">{selectedReport.location}</p>
            
                  </div>
                </div>
              )}

              {(selectedReport.barangay || selectedReport.purok || selectedReport.street) && (
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm border-l-4 border-blue-200">
                  <h4 className="font-medium text-gray-800 mb-2">Location Details</h4>
                  {selectedReport.barangay && <p><strong>Barangay:</strong> {selectedReport.barangay}</p>}
                  {selectedReport.purok && <p><strong>Purok:</strong> {selectedReport.purok}</p>}
                  {selectedReport.street && <p><strong>Street:</strong> {selectedReport.street}</p>}
                </div>
              )}

              {selectedReport.assignedStaff && (
                <div>
                  <h4 className="font-medium mb-2">Assigned Staff</h4>
                  <p className="text-gray-600">{selectedReport.assignedStaff}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-4">Detailed Timeline</h4>
                <div className="space-y-4">
                  {selectedReport.timeline.map((item, index) => (
                    <TimelineStep 
                      key={index} 
                      step={item.status} 
                      status="completed" 
                      report={selectedReport}
                    />
                  ))}
                </div>
              </div>

              {selectedReport.resolutionNotes && (
                <div>
                  <h4 className="font-medium mb-2">Resolution Notes</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedReport.resolutionNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Location Map Modal for Reports */}
      <Dialog open={!!selectedLocationReport} onOpenChange={() => setSelectedLocationReport(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Report Location
            </DialogTitle>
            <DialogDescription>
              Location where this issue was reported
            </DialogDescription>
          </DialogHeader>
          
          {selectedLocationReport && (
            <div className="space-y-4">
              {/* Report Info */}
              <div className={`p-4 rounded-lg border ${selectedLocationReport.isEmergency ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className={selectedLocationReport.isEmergency ? 'text-red-700' : 'text-blue-700'}>
                      Tracking ID:
                    </strong> {selectedLocationReport.trackingId}
                  </div>
                  <div>
                    <strong className={selectedLocationReport.isEmergency ? 'text-red-700' : 'text-blue-700'}>
                      Category (Kategorya):
                    </strong> {selectedLocationReport.category}
                  </div>
                  <div>
                    <strong className={selectedLocationReport.isEmergency ? 'text-red-700' : 'text-blue-700'}>
                      Date Submitted (Petsa ng Pagsusumite):
                    </strong> {new Date(selectedLocationReport.dateSubmitted).toLocaleDateString()}
                  </div>
                  <div>
                    <strong className={selectedLocationReport.isEmergency ? 'text-red-700' : 'text-blue-700'}>
                      Status (Katayuan):
                    </strong> 
                    <Badge className={`ml-2 ${getStatusColor(selectedLocationReport.status)} text-white`}>
                      {selectedLocationReport.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <strong className={selectedLocationReport.isEmergency ? 'text-red-700' : 'text-blue-700'}>
                    Title (Pamagat):
                  </strong> {selectedLocationReport.title}
                </div>
                <div className="mt-2">
                  <strong className={selectedLocationReport.isEmergency ? 'text-red-700' : 'text-blue-700'}>
                    Location (Lokasyon):
                  </strong> {selectedLocationReport.location}
                </div>
              </div>

              {/* Location Map */}
              <LocationMap
                location={selectedLocationReport.location}
                coordinates={{
                  lat: 9.7392 + (Math.random() - 0.5) * 0.1,
                  lng: 118.7353 + (Math.random() - 0.5) * 0.1
                }}
                isEmergency={selectedLocationReport.isEmergency}
                showControls={true}
                height="400px"
              />

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                
                <Button 
                  variant="outline"
                  onClick={() => setSelectedLocationReport(null)}
                >
                  Close (Isara)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Emergency SOS Button - Always Accessible */}
      <Button 
        onClick={() => onNavigate('sos')}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg z-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Emergency SOS - Quick Access"
      >
        <AlertTriangle className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
}
