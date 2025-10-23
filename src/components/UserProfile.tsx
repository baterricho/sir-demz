import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  User as UserIcon, 
  Settings, 
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit2,
  Save,
  X,
  Eye
} from 'lucide-react';
import { User as UserType, Report, Page } from '../App';
import { toast } from 'sonner';
import { saveUserSession } from '../utils/storage';

interface UserProfileProps {
  user: UserType;
  reports: Report[];
  onNavigate: (page: Page) => void;
  onUserUpdate: (updatedUser: UserType) => void;
  onLogout: () => void;
}

interface ActivityLogEntry {
  id: string;
  type: 'report_created' | 'report_updated' | 'profile_updated' | 'login';
  date: string;
  description: string;
  reportId?: string;
}

export function UserProfile({ user, reports, onNavigate, onUserUpdate, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType>(user);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  // Initialize activity log based on user's reports
  useEffect(() => {
    const userReports = reports.filter(report => report.userId === user.id);
    const activities: ActivityLogEntry[] = [];

    // Add login activity (mock)
    activities.push({
      id: 'login-1',
      type: 'login',
      date: new Date().toISOString(),
      description: 'Logged in to SafetyConnect'
    });

    // Add report activities
    userReports.forEach(report => {
      activities.push({
        id: `report-create-${report.id}`,
        type: 'report_created',
        date: report.dateSubmitted,
        description: `Created report "${report.title}"`,
        reportId: report.id
      });

      if (report.lastEditDate) {
        activities.push({
          id: `report-edit-${report.id}`,
          type: 'report_updated',
          date: report.lastEditDate,
          description: `Updated report "${report.title}"`,
          reportId: report.id
        });
      }
    });

    // Sort by date (newest first)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setActivityLog(activities);
  }, [user.id, reports]);

  const handleSaveProfile = () => {
    try {
      const updatedUser = {
        ...editingUser,
        lastLoginDate: new Date().toISOString()
      };

      onUserUpdate(updatedUser);
      saveUserSession(updatedUser);
      setIsEditing(false);
      
      toast.success('Profile updated successfully!');
      
      // Add activity log entry
      setActivityLog(prev => [{
        id: `profile-update-${Date.now()}`,
        type: 'profile_updated',
        date: new Date().toISOString(),
        description: 'Updated profile information'
      }, ...prev]);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(user);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image must be smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setEditingUser(prev => ({ ...prev, profileImage: base64 }));
        setShowImageUpload(false);
        toast.success('Profile image updated!');
      };
      reader.readAsDataURL(file);
    }
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

  const getActivityIcon = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'report_created': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'report_updated': return <Edit2 className="h-4 w-4 text-orange-500" />;
      case 'profile_updated': return <UserIcon className="h-4 w-4 text-green-500" />;
      case 'login': return <Shield className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const userReports = reports.filter(report => report.userId === user.id);
  const totalReports = userReports.length;
  const resolvedReports = userReports.filter(report => report.status === 'Resolved').length;
  const pendingReports = userReports.filter(report => !['Resolved'].includes(report.status)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage 
                          src={editingUser.profileImage || editingUser.idPhoto} 
                          alt={editingUser.name} 
                        />
                        <AvatarFallback className="text-2xl">
                          {editingUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Profile Picture</DialogTitle>
                              <DialogDescription>
                                Choose a new profile picture. Max size: 5MB
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{editingUser.name}</h2>
                      <p className="text-gray-600">{editingUser.email}</p>
                      <Badge variant="secondary" className="mt-1">
                        {editingUser.type === 'user' ? 'Community Member' : 'Staff'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} size="sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <Input
                        value={editingUser.name}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input
                        value={editingUser.email}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input
                        value={editingUser.phoneNumber || ''}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="+63 917 123 4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <Textarea
                        value={editingUser.address || ''}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, address: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                      <Input
                        value={editingUser.emergencyContact || ''}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Contact name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Emergency Phone</label>
                      <Input
                        value={editingUser.emergencyPhone || ''}
                        onChange={(e) => setEditingUser(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="+63 917 123 4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalReports}</div>
                      <div className="text-sm text-gray-600">Total Reports</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
                      <div className="text-sm text-gray-600">Resolved</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>My Reports History</CardTitle>
                <CardDescription>
                  All reports you've submitted through SafetyConnect
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No reports submitted yet</p>
                    <Button 
                      onClick={() => onNavigate('create-report')} 
                      className="mt-4"
                    >
                      Create Your First Report
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tracking ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-mono text-sm">
                              {report.trackingId}
                            </TableCell>
                            <TableCell className="font-medium">
                              {report.title}
                            </TableCell>
                            <TableCell>{report.category}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(report.dateSubmitted).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                {report.canEdit && (
                                  <Button size="sm" variant="outline">
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Your recent activity on SafetyConnect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive updates about your reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-gray-500">
                        Receive email updates about your reports
                      </p>
                    </div>
                    <Switch
                      checked={editingUser.notificationSettings?.email ?? true}
                      onCheckedChange={(checked) => 
                        setEditingUser(prev => ({
                          ...prev,
                          notificationSettings: { ...prev.notificationSettings, email: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">SMS Notifications</label>
                      <p className="text-xs text-gray-500">
                        Receive SMS updates for urgent reports
                      </p>
                    </div>
                    <Switch
                      checked={editingUser.notificationSettings?.sms ?? false}
                      onCheckedChange={(checked) => 
                        setEditingUser(prev => ({
                          ...prev,
                          notificationSettings: { ...prev.notificationSettings, sms: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Share Location</label>
                      <p className="text-xs text-gray-500">
                        Allow automatic location detection for reports
                      </p>
                    </div>
                    <Switch
                      checked={editingUser.privacySettings?.shareLocation ?? true}
                      onCheckedChange={(checked) => 
                        setEditingUser(prev => ({
                          ...prev,
                          privacySettings: { ...prev.privacySettings, shareLocation: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Public Profile</label>
                      <p className="text-xs text-gray-500">
                        Make your profile visible to other community members
                      </p>
                    </div>
                    <Switch
                      checked={editingUser.privacySettings?.publicProfile ?? false}
                      onCheckedChange={(checked) => 
                        setEditingUser(prev => ({
                          ...prev,
                          privacySettings: { ...prev.privacySettings, publicProfile: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Verification</CardTitle>
                  <CardDescription>
                    Your account verification status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Shield className={`h-5 w-5 ${
                      editingUser.idVerificationStatus === 'verified' ? 'text-green-500' :
                      editingUser.idVerificationStatus === 'rejected' ? 'text-red-500' :
                      'text-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium">
                        ID Verification: {
                          editingUser.idVerificationStatus === 'verified' ? 'Verified' :
                          editingUser.idVerificationStatus === 'rejected' ? 'Rejected' :
                          'Pending'
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        {editingUser.idVerificationStatus === 'verified' 
                          ? 'Your identity has been verified'
                          : 'Upload a valid ID to verify your account'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}