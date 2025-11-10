// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { 
  AlertTriangle, 
  Building2 as Hospital,
   
  BookOpen,
  Users,
  Shield
} from 'lucide-react'

const Home = () => {
  const stats = [
    { label: 'Emergency Responses', value: '1,247', icon: AlertTriangle, color: 'red' },
    { label: 'Hospitals in Network', value: '156', icon: Hospital, color: 'blue' },
    { label: 'Snake Species', value: '42', icon: Shield, color: 'green' },
    { label: 'Lives Saved', value: '894', icon: Users, color: 'purple' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Snakebite <span className="text-red-500">Emergency</span> Response
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          AI-powered life-saving system for snakebite emergencies in Sub-Saharan Africa. 
          Get immediate help, find antivenom, and save lives.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/emergency" className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-600 transition-colors duration-200 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Emergency Help
          </Link>
          <Link to="/education" className="border border-blue-500 text-blue-500 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors duration-200 flex items-center">
            <BookOpen className="h-6 w-6 mr-2" />
            Learn First Aid
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default Home