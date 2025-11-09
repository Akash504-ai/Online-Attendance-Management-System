import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Users, Calendar, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

export default function AdminDashboard() {
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

  const userStats = stats?.users || {}
  const todayStats = stats?.today || {}
  const monthStats = stats?.this_month || {}
  const lowAttendance = stats?.low_attendance_alerts || []

  const userChartData = Object.entries(userStats.by_role || {}).map(([role, count]) => ({
    role: role.charAt(0).toUpperCase() + role.slice(1),
    count: count,
  }))

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' 
              ? 'Overview of attendance management system' 
              : 'Manage attendance and view reports'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {user?.role === 'admin' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.total || 0}</div>
                <p className="text-xs text-muted-foreground">Active users in system</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userStats.by_role?.student || 0}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          {user?.role === 'admin' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.by_role?.teacher || 0}</div>
                <p className="text-xs text-muted-foreground">Active teachers</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthStats.avg_attendance || 0}%</div>
              <p className="text-xs text-muted-foreground">This month's average</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>Snapshot of today's attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{todayStats.total || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-green-600">{todayStats.present || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{todayStats.absent || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className={`grid gap-4 ${user?.role === 'admin' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {/* User Distribution - Admin Only */}
          {user?.role === 'admin' && (
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 rounded-full"></div>
                  User Distribution
                </CardTitle>
                <CardDescription>Users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart 
                    data={userChartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="teacherGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#6d28d9" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis 
                      dataKey="role" 
                      tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                      label={{ value: 'Number of Users', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 rounded-lg border-2 shadow-lg">
                              <p className="font-semibold text-sm mb-1">{data.role}</p>
                              <p className="text-2xl font-bold text-blue-600">{data.count}</p>
                              <p className="text-xs text-gray-500 mt-1">Total Users</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[12, 12, 0, 0]}
                      animationBegin={0}
                      animationDuration={800}
                      maxBarSize={80}
                    >
                      {userChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={
                            entry.role === 'Student' ? 'url(#studentGradient)' :
                            entry.role === 'Teacher' ? 'url(#teacherGradient)' :
                            'url(#adminGradient)'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-b from-blue-500 to-blue-700"></div>
                    <span className="text-gray-600">Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-b from-green-500 to-green-700"></div>
                    <span className="text-gray-600">Teachers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-b from-purple-500 to-purple-700"></div>
                    <span className="text-gray-600">Admins</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Low Attendance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                Low Attendance Alerts
              </CardTitle>
              <CardDescription>Students with attendance below 75%</CardDescription>
            </CardHeader>
            <CardContent>
              {lowAttendance.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                  <p className="mt-2 text-sm text-muted-foreground">All students have good attendance!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {lowAttendance.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.roll_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{student.percentage}%</p>
                        <p className="text-xs text-muted-foreground">
                          {student.present_days}/{student.total_days}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* This Month Summary */}
        <Card>
          <CardHeader>
            <CardTitle>This Month's Summary</CardTitle>
            <CardDescription>Overall attendance statistics for current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Total Records</span>
                <span className="text-3xl font-bold">{monthStats.total_records || 0}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Active Students</span>
                <span className="text-3xl font-bold">{monthStats.total_students || 0}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Average Attendance</span>
                <span className="text-3xl font-bold text-primary">{monthStats.avg_attendance || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {user?.role === 'admin' && (
                <a
                  href="/admin/users"
                  className="flex flex-col items-center justify-center p-6 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <span className="font-medium">Manage Users</span>
                </a>
              )}
              <a
                href="/admin/attendance"
                className="flex flex-col items-center justify-center p-6 rounded-lg border hover:bg-accent transition-colors"
              >
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Mark Attendance</span>
              </a>
              <a
                href="/admin/reports"
                className="flex flex-col items-center justify-center p-6 rounded-lg border hover:bg-accent transition-colors"
              >
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">View Reports</span>
              </a>
              {user?.role === 'admin' && (
                <a
                  href="/admin/settings"
                  className="flex flex-col items-center justify-center p-6 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <span className="font-medium">Settings</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
