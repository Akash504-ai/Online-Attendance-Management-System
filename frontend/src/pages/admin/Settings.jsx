import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  Settings as SettingsIcon, 
  Calendar, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Clock,
  Percent,
  Save,
  RotateCcw
} from 'lucide-react'

const DEFAULT_SETTINGS = {
  // Academic Settings
  academicYear: '2024-2025',
  semesterStart: '2024-08-01',
  semesterEnd: '2024-12-31',
  
  // Attendance Settings
  attendanceThreshold: 75,
  lateMarkMinutes: 15,
  autoMarkAbsent: true,
  
  // Notification Settings
  emailNotifications: true,
  lowAttendanceAlert: true,
  dailyReportEmail: false,
  
  // System Settings
  systemName: 'Trackify',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
}

export default function Settings() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('systemSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
        toast({
          title: 'Settings Loaded',
          description: 'Your saved settings have been loaded',
        })
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    // Validation
    if (settings.attendanceThreshold < 0 || settings.attendanceThreshold > 100) {
      toast({
        title: 'Validation Error',
        description: 'Attendance threshold must be between 0 and 100',
        variant: 'destructive',
      })
      return
    }

    if (settings.lateMarkMinutes < 0 || settings.lateMarkMinutes > 60) {
      toast({
        title: 'Validation Error',
        description: 'Late mark minutes must be between 0 and 60',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem('systemSettings', JSON.stringify(settings))
      setHasChanges(false)
      
      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(DEFAULT_SETTINGS)
      setHasChanges(true)
      toast({
        title: 'Settings Reset',
        description: 'All settings have been reset to defaults. Click Save to apply.',
      })
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">
              Configure system preferences and parameters
              {hasChanges && <span className="text-orange-600 ml-2">• Unsaved changes</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" disabled={saving}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} disabled={saving || !hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Academic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Academic Settings
            </CardTitle>
            <CardDescription>Configure academic year and semester dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={settings.academicYear}
                  onChange={(e) => handleChange('academicYear', e.target.value)}
                  placeholder="2024-2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="semesterStart">Semester Start Date</Label>
                <Input
                  id="semesterStart"
                  type="date"
                  value={settings.semesterStart}
                  onChange={(e) => handleChange('semesterStart', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesterEnd">Semester End Date</Label>
                <Input
                  id="semesterEnd"
                  type="date"
                  value={settings.semesterEnd}
                  onChange={(e) => handleChange('semesterEnd', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent className="mr-2 h-5 w-5" />
              Attendance Settings
            </CardTitle>
            <CardDescription>Configure attendance thresholds and rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attendanceThreshold">
                  Minimum Attendance Threshold (%)
                </Label>
                <Input
                  id="attendanceThreshold"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.attendanceThreshold}
                  onChange={(e) => handleChange('attendanceThreshold', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Students below this percentage will be flagged
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lateMarkMinutes">Late Mark Grace Period (minutes)</Label>
                <Input
                  id="lateMarkMinutes"
                  type="number"
                  min="0"
                  max="60"
                  value={settings.lateMarkMinutes}
                  onChange={(e) => handleChange('lateMarkMinutes', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Students arriving within this time are marked as late
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoMarkAbsent"
                checked={settings.autoMarkAbsent}
                onChange={(e) => handleChange('autoMarkAbsent', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="autoMarkAbsent" className="cursor-pointer">
                Automatically mark students as absent if not marked by end of day
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure email and system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="emailNotifications" className="cursor-pointer">
                  Enable email notifications
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="lowAttendanceAlert"
                  checked={settings.lowAttendanceAlert}
                  onChange={(e) => handleChange('lowAttendanceAlert', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="lowAttendanceAlert" className="cursor-pointer">
                  Send alerts for low attendance students
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dailyReportEmail"
                  checked={settings.dailyReportEmail}
                  onChange={(e) => handleChange('dailyReportEmail', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="dailyReportEmail" className="cursor-pointer">
                  Send daily attendance report to admins
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>View system details and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">System Name</p>
                <p className="text-sm text-muted-foreground">{settings.systemName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Version</p>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Database</p>
                <p className="text-sm text-muted-foreground">MySQL 8.0</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Backend</p>
                <p className="text-sm text-muted-foreground">PHP 8.x</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button (Bottom) */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button onClick={handleReset} variant="outline" disabled={saving} size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChanges} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : hasChanges ? 'Save All Changes' : 'No Changes'}
          </Button>
        </div>
      </div>
    </Layout>
  )
}
