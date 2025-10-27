import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft,
  Save,
  X,
  AlertTriangle,
  Clock,
  Edit2,
  FileText,
  Eye,
  MapPin,
  Camera,
  Paperclip,
  Trash2,
  History
} from 'lucide-react';
import { User as UserType, Report, ReportEdit, Attachment, Page } from '../App';
import { toast } from 'sonner';
import { PUERTO_PRINCESA_BARANGAYS } from '../utils/barangays';

interface EditReportProps {
  user: UserType;
  report: Report;
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function EditReport({ user, report, onUpdateReport, onNavigate, onLogout }: EditReportProps) {
  const [editingReport, setEditingReport] = useState<Partial<Report>>({
    title: report.title,
    category: report.category,
    description: report.description,
    location: report.location,
    barangay: report.barangay,
    purok: report.purok,
    street: report.street,
    isEmergency: report.isEmergency,
    isConfidential: report.isConfidential,
    emergencyType: report.emergencyType,
    emergencyDetails: report.emergencyDetails
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>(report.attachments || []);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  // Check if report can be edited
  const canEdit = report.canEdit && ['Draft', 'Submitted'].includes(report.status);

  useEffect(() => {
    // Check if there are any changes
    const changes = (
      editingReport.title !== report.title ||
      editingReport.category !== report.category ||
      editingReport.description !== report.description ||
      editingReport.location !== report.location ||
      editingReport.barangay !== report.barangay ||
      editingReport.purok !== report.purok ||
      editingReport.street !== report.street ||
      editingReport.isEmergency !== report.isEmergency ||
      editingReport.isConfidential !== report.isConfidential ||
      editingReport.emergencyType !== report.emergencyType ||
      editingReport.emergencyDetails !== report.emergencyDetails ||
      JSON.stringify(attachments) !== JSON.stringify(report.attachments || [])
    );
    
    setHasChanges(changes);
  }, [editingReport, attachments, report]);

  const handleSave = () => {
    if (!canEdit) {
      toast.error('This report cannot be edited in its current status');
      return;
    }

    if (!editingReport.title?.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!editingReport.description?.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      // Create edit history entry
      const previousVersion = {
        title: report.title,
        description: report.description,
        category: report.category
      };

      const changes: string[] = [];
      if (editingReport.title !== report.title) changes.push('Title updated');
      if (editingReport.description !== report.description) changes.push('Description updated');
      if (editingReport.category !== report.category) changes.push('Category changed');
      if (editingReport.location !== report.location) changes.push('Location updated');
      if (editingReport.barangay !== report.barangay) changes.push('Barangay updated');
      if (editingReport.purok !== report.purok) changes.push('Purok updated');
      if (editingReport.street !== report.street) changes.push('Street updated');
      if (editingReport.isEmergency !== report.isEmergency) {
        changes.push(editingReport.isEmergency ? 'Marked as emergency' : 'Unmarked as emergency');
      }
      if (editingReport.isConfidential !== report.isConfidential) {
        changes.push(editingReport.isConfidential ? 'Marked as confidential' : 'Unmarked as confidential');
      }

      const editEntry: ReportEdit = {
        id: `edit-${Date.now()}`,
        editDate: new Date().toISOString(),
        editedBy: user.name,
        previousVersion,
        changes
      };

      const updatedReport: Partial<Report> = {
        ...editingReport,
        attachments,
        lastEditDate: new Date().toISOString(),
        editHistory: [...(report.editHistory || []), editEntry]
      };

      onUpdateReport(report.id, updatedReport);
      
      toast.success('Report updated successfully!', {
        description: `${changes.length} change(s) saved`
      });
      
      onNavigate('track-reports');
    } catch (error) {
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      onNavigate('track-reports');
    }
  };

  const confirmCancel = () => {
    setShowConfirmDialog(false);
    onNavigate('track-reports');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        
        const newAttachment: Attachment = {
          id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64,
          uploadDate: new Date().toISOString(),
          preview: file.type.startsWith('image/') ? base64 : undefined
        };

        setAttachments(prev => [...prev, newAttachment]);
        toast.success(`File ${file.name} uploaded successfully`);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
    toast.success('Attachment removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500';
      case 'Submitted': return 'bg-blue-500';
      case 'Under Review': return 'bg-yellow-500';
      case 'Assigned': return 'bg-orange-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('track-reports')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Edit Report</h1>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Report Cannot Be Edited
                </h3>
                <p className="text-gray-600 mb-4">
                  This report is currently <Badge className={getStatusColor(report.status)}>{report.status}</Badge> and cannot be modified.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Reports can only be edited when they are in "Draft" or "Submitted" status.
                </p>
                <div className="space-x-2">
                  <Button onClick={() => onNavigate('track-reports')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Report Details
                  </Button>
                  <Button variant="outline" onClick={() => onNavigate('dashboard')}>
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Edit Report</h1>
            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Unsaved Changes
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  Edit History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit History</DialogTitle>
                  <DialogDescription>
                    Track record of all changes made to this report
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96">
                  <div className="space-y-4">
                    {report.editHistory && report.editHistory.length > 0 ? (
                      report.editHistory.map((edit) => (
                        <div key={edit.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{edit.editedBy}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(edit.editDate).toLocaleString()}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {edit.changes.map((change, index) => (
                              <div key={index} className="text-sm text-gray-600 flex items-center">
                                <Edit2 className="h-3 w-3 mr-2 text-orange-500" />
                                {change}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No edit history available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Report Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
                <CardDescription>
                  Edit the details of your report. Tracking ID: {report.trackingId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Report Title</label>
                      <Input
                        value={editingReport.title || ''}
                        onChange={(e) => setEditingReport(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Brief title describing the issue"
                        className="mt-1"
                        maxLength={100}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editingReport.title?.length || 0}/100 characters
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <Select 
                        value={editingReport.category} 
                        onValueChange={(value) => setEditingReport(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Public Safety">Public Safety</SelectItem>
                          <SelectItem value="Health Service">Health Service</SelectItem>
                          <SelectItem value="Environmental">Environmental</SelectItem>
                          <SelectItem value="Compliance">Compliance</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={editingReport.location || ''}
                          onChange={(e) => setEditingReport(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Where is this issue located?"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barangay, Purok, Street */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Barangay</label>
                      <Select
                        value={editingReport.barangay || ''}
                        onValueChange={(value) => setEditingReport(prev => ({ ...prev, barangay: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a barangay" />
                        </SelectTrigger>
                        <SelectContent>
                          {PUERTO_PRINCESA_BARANGAYS.map((barangay) => (
                            <SelectItem key={barangay} value={barangay}>
                              {barangay}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Purok</label>
                      <Input
                        value={editingReport.purok || ''}
                        onChange={(e) => setEditingReport(prev => ({ ...prev, purok: e.target.value }))}
                        placeholder="e.g., Mahogany"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Street</label>
                      <Input
                        value={editingReport.street || ''}
                        onChange={(e) => setEditingReport(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="e.g., Elm Street"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        value={editingReport.description || ''}
                        onChange={(e) => setEditingReport(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide detailed information about the issue"
                        className="mt-1"
                        rows={6}
                        maxLength={1000}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editingReport.description?.length || 0}/1000 characters
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="emergency"
                          checked={editingReport.isEmergency || false}
                          onChange={(e) => setEditingReport(prev => ({ ...prev, isEmergency: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="emergency" className="text-sm font-medium text-gray-700">
                          This is an emergency requiring immediate attention
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="confidential"
                          checked={editingReport.isConfidential || false}
                          onChange={(e) => setEditingReport(prev => ({ ...prev, isConfidential: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="confidential" className="text-sm font-medium text-gray-700">
                          Keep this report confidential
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {editingReport.isEmergency && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-red-800 text-base">Emergency Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-red-800">Emergency Type</label>
                        <Select 
                          value={editingReport.emergencyType || ''} 
                          onValueChange={(value) => setEditingReport(prev => ({ ...prev, emergencyType: value }))}
                        >
                          <SelectTrigger className="mt-1 border-red-200">
                            <SelectValue placeholder="Select emergency type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fire">Fire</SelectItem>
                            <SelectItem value="Medical">Medical Emergency</SelectItem>
                            <SelectItem value="Crime">Crime in Progress</SelectItem>
                            <SelectItem value="Accident">Accident</SelectItem>
                            <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
                            <SelectItem value="Public Safety">Public Safety Threat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-red-800">Additional Emergency Information</label>
                        <Textarea
                          value={editingReport.emergencyDetails || ''}
                          onChange={(e) => setEditingReport(prev => ({ ...prev, emergencyDetails: e.target.value }))}
                          placeholder="Provide any additional details about the emergency"
                          className="mt-1 border-red-200"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments">
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>
                  Add or remove files related to your report. Maximum file size: 10MB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Upload Files</label>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="image/*,application/pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Choose Files
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: Images, PDF, Word documents
                    </p>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Current Attachments</label>
                    <div className="space-y-2">
                      {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {attachment.preview ? (
                              <img 
                                src={attachment.preview} 
                                alt={attachment.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <FileText className="h-8 w-8 text-gray-400" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{attachment.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.size)} • {new Date(attachment.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirm Cancel Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard Changes?</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to leave without saving?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Continue Editing
              </Button>
              <Button variant="destructive" onClick={confirmCancel}>
                Discard Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}