import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Building2,
  Shield,
  BookOpen, 
  Clock, 
  MapPin,
  TrendingUp,
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEmergencies: 0,
    resolvedCases: 0,
    activeCases: 0,
    responseTime: '4.2min'
  })

  useEffect(() => {
    fetchUserEmergencies()
  }, [])

  const fetchUserEmergencies = async () => {
    try {
      // Mock data for now
      const mockEmergencies = [
        {
          _id: '1',
          snakeSpecies: {
            commonName: 'Black Mamba',
            riskLevel: 'CRITICAL'
          },
          status: 'RESOLVED',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          snakeSpecies: {
            commonName: 'Puff Adder',
            riskLevel: 'HIGH'
          },
          status: 'PENDING',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
      
      setEmergencies(mockEmergencies)
      
      const total = mockEmergencies.length
      const resolved = mockEmergencies.filter(e => e.status === 'RESOLVED').length
      const active = mockEmergencies.filter(e => e.status === 'PENDING' || e.status === 'IN_PROGRESS').length
      
      setStats({
        totalEmergencies: total,
        resolvedCases: resolved,
        activeCases: active,
        responseTime: '4.2min'
      })
    } catch (error) {
      console.error('Error fetching emergencies:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return colors[status] || colors.PENDING
  }

  const getRiskColor = (riskLevel) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
    return colors[riskLevel] || colors.MEDIUM
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.profile?.firstName || 'User'}!
            </h1>
            <p className="text-blue-100 text-lg">
              Here's your SnaKTox dashboard overview
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <User className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Emergencies</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEmergencies}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Cases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolvedCases}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCases}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.responseTime}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Emergencies */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Emergencies
              </h2>
              <Link 
                to="/emergency"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {emergencies.length > 0 ? (
                emergencies.map((emergency) => (
                  <div
                    key={emergency._id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        emergency.snakeSpecies?.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                        emergency.snakeSpecies?.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {emergency.snakeSpecies?.commonName || 'Unknown Snake'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(emergency.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}>
                        {emergency.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(emergency.snakeSpecies?.riskLevel)}`}>
                        {emergency.snakeSpecies?.riskLevel}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No emergencies reported
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't reported any snakebite emergencies yet.
                  </p>
                  <Link
                    to="/emergency"
                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Report Emergency
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/emergency"
                className="flex items-center space-x-3 p-3 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
              >
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-300">Report Emergency</span>
              </Link>

              <Link
                to="/hospitals"
                className="flex items-center space-x-3 p-3 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
              >
                <Building2 className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Find Hospitals</span>
              </Link>

              <Link
                to="/snake-id"
                className="flex items-center space-x-3 p-3 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
              >
                <Shield className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-300">Identify Snake</span>
              </Link>

              <Link
                to="/education"
                className="flex items-center space-x-3 p-3 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
              >
                <BookOpen className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-purple-700 dark:text-purple-300">Learn First Aid</span>
              </Link>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Emergency Contacts
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">Emergency Services</span>
                <span className="text-red-600 font-semibold">911</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">Poison Control</span>
                <span className="text-red-600 font-semibold">+254-700-123-456</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">KEMRI Helpline</span>
                <span className="text-red-600 font-semibold">+254-20-271-3344</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="text-green-500 mr-2">🛡️</span>
          Safety Reminders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">1</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Stay calm and move away slowly if you encounter a snake
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">2</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Wear protective clothing when in snake-prone areas
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">3</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Use a flashlight at night and watch where you step
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard