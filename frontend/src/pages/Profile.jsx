import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { userAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { User, Mail, Phone, Building, GraduationCap, Save, Loader2, Shield, Calendar, Eye, EyeOff } from 'lucide-react'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    class: user?.class || '',
  })
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  })

  // Sync form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        class: user.class || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await userAPI.update(user.id, formData)
      if (response.success) {
        updateUser(response.data)
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully',
        })
      }
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.password !== passwordData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await userAPI.update(user.id, { password: passwordData.password })
      if (response.success) {
        setPasswordData({ password: '', confirmPassword: '' })
        toast({
          title: 'Password updated',
          description: 'Your password has been changed successfully',
        })
      }
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Avatar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role}
                  </span>
                  {user?.roll_number && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Roll: {user.roll_number}
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                {user?.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm font-medium capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Roll Number</span>
                <span className="text-sm font-medium">{user?.roll_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium capitalize">{user?.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">
                  {new Date(user?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
