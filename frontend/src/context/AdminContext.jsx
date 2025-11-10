import React, { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOverview = async () => {
    try {
      const response = await adminAPI.getOverview()
      setOverview(response.data)
    } catch (error) {
      console.error('Error fetching overview:', error)
      toast.error('Failed to load admin overview')
    }
  }

  const fetchUsers = async (params = {}) => {
    setLoading(true)
    try {
      const response = await adminAPI.getUsers(params)
      setUsers(response.data.users)
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchEmergencies = async (params = {}) => {
    setLoading(true)
    try {
      const response = await adminAPI.getEmergencyReports(params)
      setEmergencies(response.data.emergencies)
      return response.data
    } catch (error) {
      console.error('Error fetching emergencies:', error)
      toast.error('Failed to load emergencies')
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData) => {
    try {
      await adminAPI.createUser(userData)
      toast.success('User created successfully')
      fetchUsers() // Refresh the list
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const updateUser = async (id, updates) => {
    try {
      await adminAPI.updateUser(id, updates)
      toast.success('User updated successfully')
      fetchUsers() // Refresh the list
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const deleteUser = async (id) => {
    try {
      await adminAPI.deleteUser(id)
      toast.success('User deleted successfully')
      fetchUsers() // Refresh the list
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const updateEmergencyStatus = async (id, status) => {
    try {
      await adminAPI.updateEmergencyStatus(id, { status })
      toast.success('Emergency status updated')
      fetchEmergencies() // Refresh the list
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update emergency'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  const value = {
    overview,
    users,
    emergencies,
    loading,
    fetchOverview,
    fetchUsers,
    fetchEmergencies,
    createUser,
    updateUser,
    deleteUser,
    updateEmergencyStatus
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}