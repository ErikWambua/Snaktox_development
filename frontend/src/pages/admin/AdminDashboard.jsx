import React, { useState, useEffect } from 'react'
import { 
  Users, 
  AlertTriangle, 
  Building2, 
  Shield, 
  TrendingUp
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const AdminDashboard = () => {
  const { overview, fetchOverview } = useAdmin()
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchOverview()
  }, [timeRange])

  const stats = [
    {
      label: 'Total Users',
      value: overview?.userStats?.total || 0,
      change: overview?.userStats?.growth || 0,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Emergencies',
      value: overview?.emergencyStats?.total || 0,
      change: overview?.emergencyStats?.growth || 0,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Hospitals',
      value: overview?.hospitalStats?.total || 0,
      change: overview?.hospitalStats?.growth || 0,
      icon: Building2,
      color: 'green'
    },
    {
      label: 'Snake Species',
      value: overview?.snakeStats?.total || 0,
      change: overview?.snakeStats?.growth || 0,
      icon: Shield,
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            System overview and management
          </p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.change >= 0
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className={`flex items-center mt-1 text-sm ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${!isPositive && 'rotate-180'}`} />
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'red' ? 'bg-red-100 text-red-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          System Status
        </h2>
        <div className="text-center py-8">
          <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">All systems operational</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
