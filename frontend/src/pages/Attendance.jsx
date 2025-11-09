import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { attendanceAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, Download, Filter, TrendingUp } from 'lucide-react'
import { getStatusColor, formatDate } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function Attendance() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchAttendance()
  }, [filters])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const response = await attendanceAPI.list(filters)
      if (response.success) {
        const fetchedRecords = response.data.records || []
        setRecords(fetchedRecords)
        calculateMonthlyData(fetchedRecords)
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMonthlyData = (records) => {
    // Group records by month
    const monthlyStats = {}
    
    records.forEach(record => {
      const date = new Date(record.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthName,
          total: 0,
          present: 0,
          absent: 0,
          late: 0
        }
      }
      
      monthlyStats[monthKey].total++
      if (record.status === 'present') monthlyStats[monthKey].present++
      if (record.status === 'absent') monthlyStats[monthKey].absent++
      if (record.status === 'late') monthlyStats[monthKey].late++
    })
    
    // Convert to array and calculate percentages
    const monthlyArray = Object.keys(monthlyStats)
      .sort()
      .map(key => ({
        month: monthlyStats[key].month,
        percentage: monthlyStats[key].total > 0 
          ? Math.round((monthlyStats[key].present / monthlyStats[key].total) * 100)
          : 0,
        present: monthlyStats[key].present,
        absent: monthlyStats[key].absent,
        late: monthlyStats[key].late,
        total: monthlyStats[key].total
      }))
    
    setMonthlyData(monthlyArray)
  }

  const handleExport = async () => {
    try {
      const response = await attendanceAPI.report({ ...filters, format: 'csv' })
      // Handle CSV download
      console.log('Export data:', response)
    } catch (error) {
      console.error('Failed to export:', error)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance Records</h1>
            <p className="text-muted-foreground">View your attendance history</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchAttendance} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Attendance Trend Chart */}
        {monthlyData.length > 0 && (
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                Monthly Attendance Trend
              </CardTitle>
              <CardDescription>Your attendance percentage over the months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart 
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6"/>
                      <stop offset="50%" stopColor="#8b5cf6"/>
                      <stop offset="100%" stopColor="#ec4899"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                    domain={[0, 100]}
                    label={{ value: 'Attendance %', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 rounded-lg border-2 shadow-lg">
                            <p className="font-semibold text-sm mb-2">{data.month}</p>
                            <p className="text-2xl font-bold text-purple-600 mb-2">{data.percentage}%</p>
                            <div className="space-y-1 text-xs">
                              <p className="flex justify-between gap-4">
                                <span className="text-gray-600">Present:</span>
                                <span className="font-semibold text-green-600">{data.present}</span>
                              </p>
                              <p className="flex justify-between gap-4">
                                <span className="text-gray-600">Absent:</span>
                                <span className="font-semibold text-red-600">{data.absent}</span>
                              </p>
                              <p className="flex justify-between gap-4">
                                <span className="text-gray-600">Late:</span>
                                <span className="font-semibold text-orange-600">{data.late}</span>
                              </p>
                              <p className="flex justify-between gap-4 pt-1 border-t">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold">{data.total}</span>
                              </p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    fill="url(#colorPercentage)"
                    animationBegin={0}
                    animationDuration={1000}
                    dot={{ 
                      fill: '#8b5cf6', 
                      strokeWidth: 2, 
                      r: 5,
                      stroke: '#fff'
                    }}
                    activeDot={{ 
                      r: 8, 
                      fill: '#8b5cf6',
                      stroke: '#fff',
                      strokeWidth: 3
                    }}
                  />
                  {/* Reference line at 75% */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 75} 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target (75%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <span className="text-gray-600">Your Attendance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-red-500" style={{ borderStyle: 'dashed' }}></div>
                  <span className="text-gray-600">Target (75%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              Showing {records.length} records from {formatDate(filters.start_date)} to {formatDate(filters.end_date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No attendance records found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Subject</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">{formatDate(record.date)}</td>
                        <td className="p-4">{record.subject || 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{record.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
