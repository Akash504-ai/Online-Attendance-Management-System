import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  User,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  GraduationCap,
  FileText,
} from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const studentNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  const teacherNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Mark Attendance', path: '/admin/attendance', icon: Calendar },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'My Profile', path: '/profile', icon: User },
  ]

  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: Calendar },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  const navigation = user?.role === 'admin' ? adminNav : user?.role === 'teacher' ? teacherNav : studentNav

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl">Trackify</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right mr-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="container py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="border-t pt-2 mt-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 w-full text-left text-muted-foreground hover:bg-accent rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-6">{children}</main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="flex justify-around items-center h-16">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
