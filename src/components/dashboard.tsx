'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Clock, 
  Calendar, 
  Star, 
  RefreshCw, 
  BarChart2, 
  TrendingUp,
  ThumbsUp,
  Users,
  Activity,
  Shield,
  AlertTriangle
} from 'lucide-react';

// Import Recharts components for better charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Types for dashboard data
interface DashboardData {
  stats: {
    totalCalls: number;
    appointmentsBooked: number;
    averageDuration: number;
    averageRating: number;
    conversionRate: number;
  };
  volumeData: {
    date: string;
    calls: number;
  }[];
  recentCalls: {
    id: string;
    call_id: string;
    call_type: string;
    from_number: string;
    to_number: string;
    duration: number;
    rating: number;
    appointment_booked: boolean;
    summary: string;
    formatted_start_time: string;
    sentiment: string;
  }[];
  typeDistribution: {
    name: string;
    value: number;
  }[];
  customerData: {
    satisfaction: number;
    nps: number;
    firstCallResolution: number;
  };
  securityData: {
    complianceRate: number;
    securityIssues: number;
    dataProtection: number;
  };
  timeSeriesData: {
    name: string;
    resolutionRate: number;
    calls: number;
    satisfaction: number;
    nps: number;
    complianceRate: number;
    securityIssues: number;
  }[];
  lastUpdated: string;
}

// COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [timeFrame, setTimeFrame] = useState<string>("7"); // Default to 7 days
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/call-analysis?days=${timeFrame}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const dashboardData = await response.json();
      setData(dashboardData);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [timeFrame]);
  
  // Fetch data on initial load and whenever refreshKey changes
  useEffect(() => {
    fetchDashboardData();
    
    // Set up automatic refresh based on user preference
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchDashboardData();
      }, 30000); // Refresh every 30 seconds
    }
    
    // Clean up the interval on component unmount or when autoRefresh changes
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshKey, timeFrame, autoRefresh, fetchDashboardData]);
  
  // Manual refresh function
  const handleRefresh = () => {
    fetchDashboardData();
  };
  
  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format the last refreshed time
  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString();
  };

  // Handle timeframe change
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);
  };
  
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-medium">Loading dashboard data...</h3>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-red-700 mb-2">Error loading dashboard</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">AI Call Center Dashboard</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 Hours</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              size="sm" 
              onClick={toggleAutoRefresh} 
              variant={autoRefresh ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleRefresh} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last updated: {formatLastRefreshed()}</span>
            {loading && <span className="text-xs text-blue-500 animate-pulse ml-2">Syncing data...</span>}
          </div>
        </div>
      </div>

      {/* Main Tabs for Organization */}
      <Tabs defaultValue="performance">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="customer">Customer Experience</TabsTrigger>
          <TabsTrigger value="security">Security & Compliance</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance">
          {/* KPI Cards for Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                <Phone className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.stats.totalCalls.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.stats.appointmentsBooked.toLocaleString() || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(data?.stats.averageDuration || 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.stats.averageRating.toFixed(1) || 0}/5
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.stats.conversionRate || 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  {data?.volumeData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.volumeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="calls" stroke="#0088FE" name="Calls" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Call Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  {data?.typeDistribution && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.typeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.typeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} calls`, 'Value']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Calls Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Calls</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                className="hidden md:flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh Table
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Appointment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.recentCalls?.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>{call.formatted_start_time}</TableCell>
                        <TableCell className="capitalize">{call.call_type}</TableCell>
                        <TableCell>{call.from_number}</TableCell>
                        <TableCell>{call.to_number}</TableCell>
                        <TableCell>{formatDuration(call.duration)}</TableCell>
                        <TableCell>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < call.rating 
                                    ? "text-yellow-400 fill-yellow-400" 
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            call.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            call.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {call.sentiment || 'neutral'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {call.appointment_booked ? (
                            <span className="text-green-600 font-medium">Yes</span>
                          ) : (
                            <span className="text-red-600 font-medium">No</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {(!data?.recentCalls || data.recentCalls.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No call data available yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Experience Tab */}
        <TabsContent value="customer">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <ThumbsUp className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Satisfaction Score</p>
                    <h3 className="text-2xl font-bold">
                      {data?.customerData?.satisfaction || 0}%
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-pink-500" />
                  <div>
                    <p className="text-sm text-gray-500">NPS Score</p>
                    <h3 className="text-2xl font-bold">
                      {data?.customerData?.nps || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Activity className="h-8 w-8 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-500">First Call Resolution</p>
                    <h3 className="text-2xl font-bold">
                      {data?.customerData?.firstCallResolution || 0}%
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {data?.timeSeriesData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="satisfaction" stroke="#f59e0b" name="Satisfaction Score" strokeWidth={2} />
                      <Line type="monotone" dataKey="nps" stroke="#ec4899" name="NPS" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Compliance Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Compliance Rate</p>
                    <h3 className="text-2xl font-bold">
                      {data?.securityData?.complianceRate || 0}%
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Security Issues</p>
                    <h3 className="text-2xl font-bold">
                      {data?.securityData?.securityIssues || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <BarChart2 className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Data Protection Score</p>
                    <h3 className="text-2xl font-bold">
                      {data?.securityData?.dataProtection || 0}/10
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {data?.timeSeriesData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="complianceRate" stroke="#10b981" name="Compliance Rate" strokeWidth={2} />
                      <Line type="monotone" dataKey="securityIssues" stroke="#ef4444" name="Security Issues" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-sm text-gray-500 mt-8">
        {autoRefresh ? 
          "Dashboard is automatically refreshing every 30 seconds" : 
          "Auto-refresh is turned off. Click Refresh to update data manually."}
      </div>
    </div>
  );
};

export default Dashboard;