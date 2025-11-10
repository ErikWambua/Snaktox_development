import React, { useState } from 'react'
import { X, User, Mail, Phone, Building, Shield } from 'lucide-react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      institution: '',
      specialization: ''
    },
    permissions: []
  })
  const [loading, setLoading] = useState(false)

  const roles = [
    { value: 'USER', label: 'User', description: 'Basic access to report emergencies' },
    { value: 'VIEWER', label: 'Viewer', description: 'Read-only access to system data' },
    { value: 'MEDICAL_EXPERT', label: 'Medical Expert', description: 'Medical professional with enhanced access' },
    { value: 'MODERATOR', label: 'Moderator', description: 'Can manage content and users' },
    { value: 'ADMIN', label: 'Administrator', description: 'Full system access' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await adminAPI.createUser(formData)
      toast.success('User created successfully!')
      onSuccess()
      onClose()
      // Reset form
      setFormData({
        email: '',
        password: '',
        role: 'USER',
        profile: {
          firstName: '',
          lastName: '',
          phone: '',
          institution: '',
          specialization: ''
        },
        permissions: []
      })
    } catch (error) {
      console.error('Create user error:', error)
      toast.error('Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="profile.firstName"
                    required
                    value={formData.profile.firstName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="profile.lastName"
                  required
                  value={formData.profile.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="profile.phone"
                    value={formData.profile.phone}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="profile.institution"
                    value={formData.profile.institution}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter institution"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <select
                  name="profile.specialization"
                  value={formData.profile.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select specialization</option>
                  <option value="Medical Doctor">Medical Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Paramedic">Paramedic</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Public Health">Public Health</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Account Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Set temporary password"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Role *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Role Description */}
            {formData.role && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>{roles.find(r => r.value === formData.role)?.label}:</strong>{' '}
                  {roles.find(r => r.value === formData.role)?.description}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-medical-500 text-white rounded-lg hover:bg-medical-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUserModal