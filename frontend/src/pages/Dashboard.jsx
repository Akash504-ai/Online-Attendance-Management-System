import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardAPI, attendanceAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { getAttendanceColor, getStatusColor } from '@/lib/utils'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.stats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  const overallStats = stats?.overall || {}
  const monthStats = stats?.this_month || {}
  const weekTrend = stats?.week_trend || []

  const pieData = [
    { name: 'Present', value: parseInt(overallStats.present_days) || 0, color: '#10b981' },
    { name: 'Absent', value: parseInt(overallStats.absent_days) || 0, color: '#ef4444' },
  ]

  const barData = weekTrend.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: day.status === 'present' ? 1 : 0,
  }))

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's your attendance overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.total_days || 0}</div>
              <p className="text-xs text-muted-foreground">All time attendance records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{overallStats.present_days || 0}</div>
              <p className="text-xs text-muted-foreground">Days you attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overallStats.absent_days || 0}</div>
              <p className="text-xs text-muted-foreground">Days you missed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAttendanceColor(overallStats.percentage || 0)}`}>
                {overallStats.percentage || 0}%
              </div>
              <p className="text-xs text-muted-foreground">Overall attendance rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pie Chart */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-red-500 rounded-full"></div>
                Attendance Distribution
              </CardTitle>
              <CardDescription>Overall present vs absent ratio</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <defs>
                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Present' ? 'url(#presentGradient)' : 
                              entry.name === 'Absent' ? 'url(#absentGradient)' : 
                              'url(#lateGradient)'} 
                        strokeWidth={2}
                        stroke="#fff"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Last 7 Days Trend
              </CardTitle>
              <CardDescription>Your recent attendance pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart 
                  data={barData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                    label={{ value: 'Status', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    formatter={(value) => {
                      if (value === 1) return ['Present', 'Status']
                      if (value === 0) return ['Absent', 'Status']
                      if (value === 0.5) return ['Late', 'Status']
                      return [value, 'Status']
                    }}
                  />
                  <Bar 
                    dataKey="status" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {barData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.status === 1 ? '#10b981' : 
                              entry.status === 0 ? '#ef4444' : 
                              '#f59e0b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* This Month Stats */}
        <Card>
          <CardHeader>
            <CardTitle>This Month's Performance</CardTitle>
            <CardDescription>Your attendance for the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Days</p>
                  <p className="text-2xl font-bold">{monthStats.total_days || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-green-600">{monthStats.present_days || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Percentage</p>
                  <p className={`text-2xl font-bold ${getAttendanceColor(monthStats.percentage || 0)}`}>
                    {monthStats.percentage || 0}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="/attendance"
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">View Attendance</p>
                  <p className="text-sm text-muted-foreground">Check your records</p>
                </div>
              </a>
              <a
                href="/analytics"
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">Detailed insights</p>
                </div>
              </a>
              <a
                href="/profile"
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Profile</p>
                  <p className="text-sm text-muted-foreground">Manage your info</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
