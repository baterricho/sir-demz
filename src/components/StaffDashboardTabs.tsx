import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TabsContent } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart3, Settings as SettingsIcon, Activity, TrendingUp, Download, FileText } from 'lucide-react';
import { Report, SOSAlert } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface StaffDashboardTabsProps {
  reports: Report[];
  sosAlerts: SOSAlert[];
  systemLogs: Array<{
    id: string;
    timestamp: string;
    actor: string;
    event: string;
    details: string;
  }>;
}

export function StaffDashboardTabs({ reports, sosAlerts, systemLogs }: StaffDashboardTabsProps) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  // Analytics data
  const categoryData = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    reports.forEach(report => {
      categoryMap.set(report.category, (categoryMap.get(report.category) || 0) + 1);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const statusData = React.useMemo(() => {
    const statusMap = new Map<string, number>();
    reports.forEach(report => {
      statusMap.set(report.status, (statusMap.get(report.status) || 0) + 1);
    });
    return Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const monthlyData = React.useMemo(() => {
    const monthMap = new Map<string, { reports: number; sos: number }>();
    
    reports.forEach(report => {
      const month = new Date(report.dateSubmitted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = monthMap.get(month) || { reports: 0, sos: 0 };
      monthMap.set(month, { ...existing, reports: existing.reports + 1 });
    });

    sosAlerts.forEach(alert => {
      const month = new Date(alert.time).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = monthMap.get(month) || { reports: 0, sos: 0 };
      monthMap.set(month, { ...existing, sos: existing.sos + 1 });
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .slice(-6); // Last 6 months
  }, [reports, sosAlerts]);

  const exportToCSV = () => {
    const csv = [
      ['Tracking ID', 'Title', 'Category', 'Status', 'Date', 'User'],
      ...reports.map(r => [
        r.trackingId,
        r.title,
        r.category,
        r.status,
        new Date(r.dateSubmitted).toLocaleDateString(),
        r.userName
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reports.length > 0 ? Math.round((reports.filter(r => r.status === 'Resolved').length / reports.length) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {reports.filter(r => r.status === 'Resolved').length} of {reports.length} resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2.4 hrs</div>
              <p className="text-sm text-gray-500 mt-2">
                <TrendingUp className="w-4 h-4 inline text-green-500" /> 15% faster than last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Emergency Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reports.filter(r => r.isEmergency).length}</div>
              <p className="text-sm text-gray-500 mt-2">
                Emergency reports handled
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports by Category</CardTitle>
              <CardDescription>Distribution of report types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports by Status</CardTitle>
              <CardDescription>Current status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Reports and SOS alerts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} name="Reports" />
                <Line type="monotone" dataKey="sos" stroke="#ef4444" strokeWidth={2} name="SOS Alerts" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate PDF Report
          </Button>
        </div>
      </TabsContent>

      {/* System Logs Tab */}
      <TabsContent value="logs" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Audit Logs
            </CardTitle>
            <CardDescription>View all system activities and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{log.event}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Actor:</strong> {log.actor}
                  </p>
                  <p className="text-sm text-gray-600">{log.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system preferences and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Email Notifications for New Reports</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">SMS Alerts for Emergency SOS</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Push Notifications</label>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Report Workflow</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Auto-assignment Rules</label>
                  <Select defaultValue="category">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category">Assign by Category</SelectItem>
                      <SelectItem value="location">Assign by Location</SelectItem>
                      <SelectItem value="manual">Manual Assignment Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Default Priority</label>
                  <Select defaultValue="normal">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">System Maintenance</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Export All Logs
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Clear Old Reports (90+ days)
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
