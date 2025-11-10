import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Globe, Clock, Shield, Search, Navigation } from 'lucide-react'
import { hospitalsAPI } from '../services/api'
import toast from 'react-hot-toast'

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([])
  const [filteredHospitals, setFilteredHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    hasAntivenom: false,
    verifiedOnly: true
  })
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    fetchHospitals()
    getCurrentLocation()
  }, [])

  useEffect(() => {
    filterHospitals()
  }, [hospitals, filters])

  const fetchHospitals = async () => {
    try {
      const response = await hospitalsAPI.getHospitals()
      setHospitals(response.data.hospitals)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      toast.error('Failed to load hospitals')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }

  const filterHospitals = () => {
    let filtered = hospitals

    if (filters.search) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        hospital.location.address?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.hasAntivenom) {
      filtered = filtered.filter(hospital =>
        hospital.antivenomStock.polyvalent > 0 || hospital.antivenomStock.monovalent > 0
      )
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter(hospital => hospital.verifiedStatus === 'VERIFIED')
    }

    setFilteredHospitals(filtered)
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getStockLevel = (quantity) => {
    if (quantity >= 30) return { color: 'text-green-600', label: 'High' }
    if (quantity >= 10) return { color: 'text-yellow-600', label: 'Medium' }
    return { color: 'text-red-600', label: 'Low' }
  }

  const getVerificationBadge = (status) => {
    const statusConfig = {
      VERIFIED: { color: 'bg-green-100 text-green-800', label: 'Verified' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      UNVERIFIED: { color: 'bg-red-100 text-red-800', label: 'Unverified' }
    }
    
    const config = statusConfig[status] || statusConfig.UNVERIFIED
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Shield className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Find Hospitals with Antivenom
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
          Locate nearby hospitals with snake antivenom stock
        </p>
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
                placeholder="Search hospitals by name or location..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasAntivenom}
                onChange={(e) => setFilters(prev => ({ ...prev, hasAntivenom: e.target.checked }))}
                className="rounded text-medical-500 focus:ring-medical-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Antivenom</span>
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                className="rounded text-medical-500 focus:ring-medical-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Verified Only</span>
            </label>
          </div>
        </div>

        {/* Location Status */}
        {userLocation && (
          <div className="mt-4 p-3 bg-medical-50 dark:bg-medical-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-medical-500" />
                <span className="text-sm text-medical-700 dark:text-medical-300">
                  Using your current location to calculate distances
                </span>
              </div>
              <button
                onClick={getCurrentLocation}
                className="text-sm text-medical-600 hover:text-medical-700 dark:text-medical-400 dark:hover:text-medical-300"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => {
          const distance = userLocation && hospital.location.coordinates
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                hospital.location.coordinates[1],
                hospital.location.coordinates[0]
              ).toFixed(1)
            : null

          return (
            <div
              key={hospital._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-medical-500 to-medical-700 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">{hospital.name}</h3>
                  {getVerificationBadge(hospital.verifiedStatus)}
                </div>
                
                {distance && (
                  <div className="flex items-center mt-2 text-medical-100">
                    <Navigation className="h-4 w-4 mr-1" />
                    <span className="text-sm">{distance} km away</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Location */}
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {hospital.location.address}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  {hospital.contactInfo.emergency && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {hospital.contactInfo.emergency}
                      </span>
                    </div>
                  )}
                  
                  {hospital.contactInfo.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {hospital.contactInfo.email}
                      </span>
                    </div>
                  )}
                  
                  {hospital.contactInfo.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {hospital.contactInfo.website}
                      </span>
                    </div>
                  )}
                </div>

                {/* Operating Hours */}
                {hospital.operatingHours?.emergency && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Emergency: {hospital.operatingHours.emergency}
                    </span>
                  </div>
                )}

                {/* Antivenom Stock */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Antivenom Stock
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Polyvalent</div>
                      <div className={`text-lg font-bold ${getStockLevel(hospital.antivenomStock.polyvalent).color}`}>
                        {hospital.antivenomStock.polyvalent} vials
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getStockLevel(hospital.antivenomStock.polyvalent).label}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Monovalent</div>
                      <div className={`text-lg font-bold ${getStockLevel(hospital.antivenomStock.monovalent).color}`}>
                        {hospital.antivenomStock.monovalent} vials
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getStockLevel(hospital.antivenomStock.monovalent).label}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Updated: {new Date(hospital.antivenomStock.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                {/* Specialties */}
                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {hospital.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-medical-100 text-medical-800 dark:bg-medical-900 dark:text-medical-300"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-2">
                  <button className="flex-1 bg-medical-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-medical-600 transition-colors duration-200">
                    Get Directions
                  </button>
                  <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredHospitals.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hospitals found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  )
}

export default Hospitals