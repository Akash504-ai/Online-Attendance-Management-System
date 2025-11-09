import { useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { attendanceAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { FileText, Download, Calendar, XCircle, Eye } from 'lucide-react'

export default function Reports() {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [reportType, setReportType] = useState('')
  const { toast } = useToast()

  const handleViewReport = async (type) => {
    setLoading(true)
    setReportType(type)
    
    let filters = {}
    const today = new Date().toISOString().split('T')[0]
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    
    if (type === 'today') {
      filters = { start_date: today, end_date: today }
    } else if (type === 'monthly') {
      filters = { start_date: monthStart, end_date: today }
    } else if (type === 'absent') {
      filters = { start_date: monthStart, end_date: today, status: 'absent' }
    }
    
    try {
      const response = await attendanceAPI.report(filters)
      
      if (response.success) {
        setReportData(response.data)
        toast({
          title: 'Report Generated',
          description: `Found ${response.data.records?.length || 0} records`,
        })
      }
    } catch (error) {
      console.error('Generate report error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate report',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCSV = () => {
    if (!reportData || !reportData.records) return
    
    // Create CSV content
    const headers = ['Date', 'Student Name', 'Email', 'Department', 'Class', 'Status', 'Marked By']
    const rows = reportData.records.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.user_name,
      r.user_email,
      r.department || '-',
      r.class || '-',
      r.status,
      r.marked_by_name || 'System'
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast({
      title: 'Downloaded',
      description: 'Report downloaded successfully',
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50'
      case 'absent': return 'text-red-600 bg-red-50'
      case 'late': return 'text-yellow-600 bg-yellow-50'
      case 'excused': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getReportTitle = () => {
    if (reportType === 'today') return "Today's Report"
    if (reportType === 'monthly') return "Monthly Report"
    if (reportType === 'absent') return "Absent Students Report"
    return "Report"
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View and download attendance reports</p>
        </div>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Quick Reports
            </CardTitle>
            <CardDescription>Click any button to view and download reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Today's Report */}
              <Button
                onClick={() => handleViewReport('today')}
                disabled={loading}
                variant="outline"
                className="h-auto flex-col items-center p-6 hover:bg-blue-50"
              >
                <Calendar className="h-8 w-8 mb-3 text-blue-600" />
                <span className="font-semibold text-lg">Today's Report</span>
                <span className="text-xs text-muted-foreground mt-1">Current day attendance</span>
              </Button>

              {/* Monthly Report */}
              <Button
                onClick={() => handleViewReport('monthly')}
                disabled={loading}
                variant="outline"
                className="h-auto flex-col items-center p-6 hover:bg-green-50"
              >
                <FileText className="h-8 w-8 mb-3 text-green-600" />
                <span className="font-semibold text-lg">Monthly Report</span>
                <span className="text-xs text-muted-foreground mt-1">Current month data</span>
              </Button>

              {/* Absent Students */}
              <Button
                onClick={() => handleViewReport('absent')}
                disabled={loading}
                variant="outline"
                className="h-auto flex-col items-center p-6 hover:bg-red-50"
              >
                <XCircle className="h-8 w-8 mb-3 text-red-600" />
                <span className="font-semibold text-lg">Absent Students</span>
                <span className="text-xs text-muted-foreground mt-1">All absent records</span>
              </Button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Generating report...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Results */}
        {reportData && reportData.records && reportData.records.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{getReportTitle()}</CardTitle>
                  <CardDescription>
                    Showing {reportData.records.length} records
                  </CardDescription>
                </div>
                <Button onClick={handleDownloadCSV} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Student Name</th>
                        <th className="p-3 text-left font-medium">Email</th>
                        <th className="p-3 text-left font-medium">Department</th>
                        <th className="p-3 text-left font-medium">Class</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Marked By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.records.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="p-3 font-medium">{record.user_name}</td>
                          <td className="p-3 text-muted-foreground">{record.user_email}</td>
                          <td className="p-3">{record.department || '-'}</td>
                          <td className="p-3">{record.class || '-'}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">
                            {record.marked_by_name || 'System'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-lg border bg-green-50">
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.records.filter(r => r.status === 'present').length}
                  </div>
                  <div className="text-sm text-green-600">Present</div>
                </div>
                <div className="p-4 rounded-lg border bg-red-50">
                  <div className="text-2xl font-bold text-red-600">
                    {reportData.records.filter(r => r.status === 'absent').length}
                  </div>
                  <div className="text-sm text-red-600">Absent</div>
                </div>
                <div className="p-4 rounded-lg border bg-yellow-50">
                  <div className="text-2xl font-bold text-yellow-600">
                    {reportData.records.filter(r => r.status === 'late').length}
                  </div>
                  <div className="text-sm text-yellow-600">Late</div>
                </div>
                <div className="p-4 rounded-lg border bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.records.length}
                  </div>
                  <div className="text-sm text-blue-600">Total Records</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Data Message */}
        {reportData && reportData.records && reportData.records.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Records Found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                No attendance records found for this report.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
