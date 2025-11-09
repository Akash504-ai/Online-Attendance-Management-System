import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { userAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Users, Search, Plus, Edit, Trash2 } from 'lucide-react'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ role: '', status: '' })
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    class: '',
    roll_number: '',
    status: 'active'
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async (searchTerm = search) => {
    setLoading(true)
    try {
      const params = {}
      
      // Only add non-empty filters
      if (filters.role && filters.role.trim() !== '') {
        params.role = filters.role
      }
      if (filters.status && filters.status.trim() !== '') {
        params.status = filters.status
      }
      if (searchTerm && searchTerm.trim() !== '') {
        params.search = searchTerm.trim()
      }
      
      console.log('Fetching users with params:', params)
      const response = await userAPI.list(params)
      console.log('Users API response:', response)
      
      if (response.success) {
        setUsers(response.data.users || [])
        console.log('Users loaded:', response.data.users.length)
      } else {
        console.error('API returned success=false:', response)
      }
    } catch (error) {
      console.error('Fetch users error:', error)
      console.error('Error details:', error.response)
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch users',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    console.log('Search clicked with:', search)
    console.log('Current filters:', filters)
    fetchUsers(search)
  }

  const handleFilterChange = (field, value) => {
    console.log('Filter changed:', field, value)
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({ role: '', status: '' })
    setTimeout(() => fetchUsers(''), 100)
  }

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        department: user.department || '',
        class: user.class || '',
        roll_number: user.roll_number || '',
        status: user.status
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        class: '',
        roll_number: '',
        status: 'active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response
      if (editingUser) {
        response = await userAPI.update(editingUser.id, formData)
      } else {
        response = await userAPI.create(formData)
      }

      if (response.success) {
        toast({
          title: editingUser ? 'User updated' : 'User created',
          description: editingUser ? 'User has been updated successfully' : 'New user has been created successfully',
        })
        handleCloseModal()
        fetchUsers()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save user',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      console.log('Deleting user:', userId)
      const response = await userAPI.delete(userId)
      console.log('Delete response:', response)
      
      if (response.success) {
        toast({
          title: 'User deleted',
          description: 'User has been removed successfully',
        })
        fetchUsers()
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete user',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      })
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground">Add, edit, and manage system users</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or roll number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <Button onClick={handleSearch}>Search</Button>
              <Button onClick={handleClearFilters} variant="outline">Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users List</CardTitle>
            <CardDescription>Total {users.length} users found</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No users found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Name</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Department</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.roll_number && (
                              <p className="text-sm text-muted-foreground">{user.roll_number}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm">{user.email}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-sm">{user.department || 'N/A'}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Full Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Password {editingUser ? '(leave blank to keep current)' : '*'}
                      </label>
                      <Input
                        required={!editingUser}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role *</label>
                      <select
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Class</label>
                      <Input
                        value={formData.class}
                        onChange={(e) => setFormData({...formData, class: e.target.value})}
                        placeholder="e.g., Class A"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Roll Number</label>
                      <Input
                        value={formData.roll_number}
                        onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                        placeholder="e.g., 2024001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status *</label>
                      <select
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
