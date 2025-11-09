import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from './components/ui/toaster'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Dashboard Pages
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageAttendance from './pages/admin/ManageAttendance'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Student/Employee Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin/Teacher Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRoles={['admin', 'teacher']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRoles={['admin', 'teacher']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <ProtectedRoute requiredRoles={['admin', 'teacher']}>
                  <ManageAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRoles={['admin', 'teacher']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
