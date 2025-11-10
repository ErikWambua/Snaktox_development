// src/components/Header.jsx
import React, { useState } from 'react'
import { Menu, Bell, User, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              SnaKTox
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Snakebite Emergency Response System
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <User className="h-5 w-5" />
              <span className="hidden sm:block text-sm font-medium">
                {user?.profile?.firstName || 'User'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header