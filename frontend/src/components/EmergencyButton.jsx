import React, { useState } from 'react'
import { AlertTriangle, Phone, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const EmergencyButton = () => {
  const [isPulsing, setIsPulsing] = useState(true)
  const navigate = useNavigate()

  const handleEmergencyClick = () => {
    navigate('/emergency')
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className={`relative animate-pulse ${isPulsing ? 'animate-ping' : ''}`}>
        <div 
          className="absolute inset-0 bg-red-500 rounded-full opacity-75"
          style={{ animation: `${isPulsing ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'}` }}
        ></div>
      </div>
      
      <button
        onClick={handleEmergencyClick}
        className="bg-gradient-to-r from-emergency-500 to-emergency-700 text-white font-bold py-4 px-6 rounded-full shadow-xl hover:shadow-red-500/50 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 flex items-center justify-center space-x-3 min-w-[200px]"
      >
        <AlertTriangle className="h-6 w-6" />
        <span className="text-lg font-bold">EMERGENCY</span>
      </button>
      
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

export default EmergencyButton