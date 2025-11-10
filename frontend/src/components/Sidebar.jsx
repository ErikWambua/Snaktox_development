import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  X, 
  Home, 
  AlertTriangle, 
  Building2 as Hospital,
    // Using Activity as replacement for Snake
  BookOpen,
  BarChart3,
  Users,
  
  Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  const mainNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle },
    { name: 'Hospitals', href: '/hospitals', icon: Hospital },
    { name: 'Snake ID', href: '/snake-id', icon: Snake },
    { name: 'Education', href: '/education', icon: BookOpen },
  ]

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Emergency Reports', href: '/admin/emergencies', icon: AlertTriangle },
    { name: 'Hospital Management', href: '/admin/hospitals', icon: Hospital },
    { name: 'Snake Species', href: '/admin/snakes', icon: Snake },
    { name: 'System Health', href: '/admin/system', icon: Settings },
  ]

  const isActiveLink = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SnaKTox</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Main
            </h3>
            <div className="mt-2 space-y-1">
              {mainNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActiveLink(item.href)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Admin Navigation */}
          {isAdmin && (
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Administration
              </h3>
              <div className="mt-2 space-y-1">
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => onClose()}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${isActiveLink(item.href)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.profile?.firstName || 'User'} {user?.profile?.lastName || ''}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role?.toLowerCase() || 'user'}
              </p>
              {user?.profile?.institution && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {user.profile.institution}
                </p>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Sidebar