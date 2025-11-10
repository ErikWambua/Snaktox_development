import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Emergency from './pages/Emergency'
import Hospitals from './pages/Hospitals'
import SnakeID from './pages/SnakeID'
import Education from './pages/Education'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminEmergencies from './pages/admin/AdminEmergencies'
import AdminHospitals from './pages/admin/AdminHospitals'
import AdminSnakes from './pages/admin/AdminSnakes'
import AdminSystem from './pages/admin/AdminSystem'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Main App Routes */}
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="emergency" element={<Emergency />} />
                <Route path="hospitals" element={<Hospitals />} />
                <Route path="snake-id" element={<SnakeID />} />
                <Route path="education" element={<Education />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="emergencies" element={<AdminEmergencies />} />
                <Route path="hospitals" element={<AdminHospitals />} />
                <Route path="snakes" element={<AdminSnakes />} />
                <Route path="system" element={<AdminSystem />} />
              </Route>
            </Routes>
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App