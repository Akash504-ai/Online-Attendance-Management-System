import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { attendanceAPI } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, Calendar, Award } from 'lucide-react'
import { getAttendanceColor } from '@/lib/utils'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await attendanceAPI.stats({
        start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      })
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
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

  const monthlyData = stats?.monthly?.map(m => ({
    month: m.month,
    percentage: parseFloat(m.percentage) || 0,
    present: parseInt(m.present_days) || 0,
    total: parseInt(m.total_days) || 0,
  })) || []

  const subjectData = stats?.by_subject?.map(s => ({
    subject: s.subject,
    percentage: parseFloat(s.percentage) || 0,
    present: parseInt(s.present_days) || 0,
    total: parseInt(s.total_days) || 0,
  })) || []

  const overall = stats?.overall || {}

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">Detailed analysis of your attendance patterns</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getAttendanceColor(overall.attendance_percentage || 0)}`}>
                {overall.attendance_percentage || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overall.present_days || 0} out of {overall.total_days || 0} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {monthlyData.length > 0 ? Math.max(...monthlyData.map(m => m.percentage)).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Highest monthly attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overall.total_days || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Classes attended this year</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance Trend</CardTitle>
            <CardDescription>Your attendance percentage over the months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} name="Attendance %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject-wise Analysis */}
        {subjectData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
              <CardDescription>Attendance breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" fill="#3b82f6" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your last 10 attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent?.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{record.subject || 'General'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceColor(record.status === 'present' ? 100 : 0)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
