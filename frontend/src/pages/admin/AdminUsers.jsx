import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  Mail,
  Phone,
  Building
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import CreateUserModal from '../../components/admin/CreateUserModal'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const { users, loading, fetchUsers, deleteUser } = useAdmin()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(userId)
      if (result.success) {
        toast.success('User deleted successfully')
      }
    }
  }

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      MODERATOR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      MEDICAL_EXPERT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      VIEWER: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      USER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[role] || colors.USER
  }

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      INACTIVE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      SUSPENDED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }
    return colors[status] || colors.ACTIVE
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage system users and their permissions
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-medical-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <Users className="h-5 w-5" />
          <span>Create User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Administrator</option>
            <option value="MODERATOR">Moderator</option>
            <option value="MEDICAL_EXPERT">Medical Expert</option>
            <option value="VIEWER">Viewer</option>
            <option value="USER">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-medical-100 rounded-full flex items-center justify-center">
                        <span className="text-medical-600 font-medium">
                          {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{user.profile?.phone || 'N/A'}</span>
                    </div>
                    {user.profile?.institution && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Building className="h-4 w-4" />
                        <span className="text-xs">{user.profile.institution}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-medical-600 hover:text-medical-900 dark:text-medical-400 dark:hover:text-medical-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || roleFilter || statusFilter 
                ? 'Try adjusting your filters or search terms'
                : 'No users have been created yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          fetchUsers()
        }}
      />
    </div>
  )
}

export default AdminUsers