import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { attendanceAPI, userAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Users, CheckCircle2, XCircle, Clock } from 'lucide-react'

export default function ManageAttendance() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await userAPI.list({ role: 'student', status: 'active' })
      if (response.success) {
        setStudents(response.data.users || [])
        // Initialize attendance state
        const initialAttendance = {}
        response.data.users.forEach(student => {
          initialAttendance[student.id] = 'present'
        })
        setAttendance(initialAttendance)
      }
    } catch (error) {
      console.error('Fetch students error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const attendanceRecords = filteredStudents.map(student => ({
        user_id: student.id,
        date: selectedDate,
        status: attendance[student.id] || 'present',
      }))

      const response = await attendanceAPI.bulk({ records: attendanceRecords })
      
      if (response.success) {
        toast({
          title: 'Success',
          description: `Attendance marked for ${attendanceRecords.length} students`,
        })
      }
    } catch (error) {
      console.error('Mark attendance error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark attendance',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const markAllAs = (status) => {
    const newAttendance = {}
    filteredStudents.forEach(student => {
      newAttendance[student.id] = status
    })
    setAttendance(newAttendance)
    toast({
      title: 'Updated',
      description: `Marked all as ${status}`,
    })
  }

  const filteredStudents = students.filter(student => {
    if (filterDepartment && student.department !== filterDepartment) return false
    if (filterClass && student.class !== filterClass) return false
    return true
  })

  const departments = [...new Set(students.map(s => s.department).filter(Boolean))]
  const classes = [...new Set(students.map(s => s.class).filter(Boolean))]

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground">Mark attendance for students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Settings</CardTitle>
            <CardDescription>Choose date and filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              {departments.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <select
                    id="department"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {classes.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <select
                    id="class"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => markAllAs('present')}
                    className="flex-1"
                  >
                    All Present
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => markAllAs('absent')}
                    className="flex-1"
                  >
                    All Absent
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Students
              </div>
              <span className="text-sm font-normal text-muted-foreground">
                Showing {filteredStudents.length} of {students.length}
              </span>
            </CardTitle>
            <CardDescription>Mark attendance for each student</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && students.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No students found</p>
                <p className="text-sm text-muted-foreground">
                  {students.length === 0 ? 'Add students to mark attendance' : 'Try changing filters'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-base">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.roll_number || student.email}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <Button
                          type="button"
                          variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className="flex-1 sm:flex-none"
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Present</span>
                          <span className="sm:hidden">P</span>
                        </Button>
                        <Button
                          type="button"
                          variant={attendance[student.id] === 'absent' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className="flex-1 sm:flex-none"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Absent</span>
                          <span className="sm:hidden">A</span>
                        </Button>
                        <Button
                          type="button"
                          variant={attendance[student.id] === 'late' ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className="flex-1 sm:flex-none"
                        >
                          <Clock className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Late</span>
                          <span className="sm:hidden">L</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={fetchStudents}
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting || filteredStudents.length === 0}
                    className="w-full sm:w-auto"
                  >
                    {submitting ? 'Submitting...' : (
                      <>
                        <span className="hidden sm:inline">Submit Attendance ({filteredStudents.length} students)</span>
                        <span className="sm:hidden">Submit ({filteredStudents.length})</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
