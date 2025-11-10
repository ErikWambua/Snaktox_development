import React, { useState, useEffect } from 'react'
import { Camera, Upload, Search, AlertTriangle, Info, Shield } from 'lucide-react'
import { snakesAPI } from '../services/api'
import toast from 'react-hot-toast'

const SnakeID = () => {
  const [snakes, setSnakes] = useState([])
  const [filteredSnakes, setFilteredSnakes] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVenom, setSelectedVenom] = useState('')
  const [selectedRisk, setSelectedRisk] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [identificationResult, setIdentificationResult] = useState(null)

  useEffect(() => {
    fetchSnakes()
  }, [])

  useEffect(() => {
    filterSnakes()
  }, [snakes, searchTerm, selectedVenom, selectedRisk])

  const fetchSnakes = async () => {
    setLoading(true)
    try {
      // Mock data for now since API might not be ready
      const mockSnakes = [
        {
          _id: '1',
          commonName: 'Black Mamba',
          scientificName: 'Dendroaspis polylepis',
          venomType: 'neurotoxic',
          riskLevel: 'CRITICAL',
          region: 'East Africa',
          description: 'Highly venomous snake known for its speed and aggression.',
          localNames: ['Mamba mweusi'],
          images: []
        },
        {
          _id: '2',
          commonName: 'Puff Adder',
          scientificName: 'Bitis arietans',
          venomType: 'cytotoxic',
          riskLevel: 'HIGH',
          region: 'Sub-Saharan Africa',
          description: 'Responsible for most snakebite fatalities in Africa.',
          localNames: ['Puff adder'],
          images: []
        },
        {
          _id: '3',
          commonName: 'Boa Constrictor',
          scientificName: 'Boa constrictor',
          venomType: 'non-venomous',
          riskLevel: 'LOW',
          region: 'Various',
          description: 'Large, non-venomous snake that constricts its prey.',
          localNames: ['Boa'],
          images: []
        }
      ]
      setSnakes(mockSnakes)
    } catch (error) {
      console.error('Error fetching snakes:', error)
      toast.error('Failed to load snake species')
    } finally {
      setLoading(false)
    }
  }

  const filterSnakes = () => {
    let filtered = snakes

    if (searchTerm) {
      filtered = filtered.filter(snake =>
        snake.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snake.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (snake.localNames && snake.localNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    }

    if (selectedVenom) {
      filtered = filtered.filter(snake => snake.venomType === selectedVenom)
    }

    if (selectedRisk) {
      filtered = filtered.filter(snake => snake.riskLevel === selectedRisk)
    }

    setFilteredSnakes(filtered)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      identifySnake(file)
    }
  }

  const identifySnake = async (file) => {
    setLoading(true)
    try {
      // Mock identification for now
      setTimeout(() => {
        const mockResult = {
          matches: [
            {
              snake: {
                id: '1',
                commonName: 'Black Mamba',
                scientificName: 'Dendroaspis polylepis',
                riskLevel: 'CRITICAL',
                venomType: 'neurotoxic'
              },
              confidence: 0.85,
              matchingFeatures: ['slender body', 'dark coloration', 'coffin-shaped head']
            },
            {
              snake: {
                id: '2',
                commonName: 'African Rock Python',
                scientificName: 'Python sebae',
                riskLevel: 'LOW',
                venomType: 'non-venomous'
              },
              confidence: 0.45,
              matchingFeatures: ['patterned skin', 'large size']
            }
          ]
        }
        setIdentificationResult(mockResult)
        toast.success('Snake identification completed!')
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Identification error:', error)
      toast.error('Failed to identify snake')
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300',
      LOW: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300'
    }
    return colors[riskLevel] || colors.LOW
  }

  const getVenomColor = (venomType) => {
    const colors = {
      neurotoxic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      hemotoxic: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      cytotoxic: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'non-venomous': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      mixed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[venomType] || colors.mixed
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Snake Identification
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
          Identify snake species and learn about their venom characteristics
        </p>
      </div>

      {/* AI Identification Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          AI-Powered Snake Identification
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upload Snake Photo
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Take a clear photo of the snake for accurate identification
              </p>
              
              <label className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition-colors duration-200">
                <Upload className="h-5 w-5 mr-2" />
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {uploadedImage && (
                <div className="mt-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded snake"
                    className="mx-auto max-h-48 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Identification Tips */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2 text-green-500" />
                Identification Tips
              </h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>• Take photos from a safe distance</li>
                <li>• Include the entire snake in the frame</li>
                <li>• Capture head shape and color patterns</li>
                <li>• Take multiple angles if possible</li>
                <li>• Note the snake's size and behavior</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : identificationResult ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Identification Results
                </h3>
                
                {identificationResult.matches.map((match, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {match.snake.commonName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {match.snake.scientificName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {Math.round(match.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(match.snake.riskLevel)}`}>
                        {match.snake.riskLevel} Risk
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getVenomColor(match.snake.venomType)}`}>
                        {match.snake.venomType}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Matching Features:</strong> {match.matchingFeatures.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Upload a snake photo to begin identification</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Snake Database Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Snake Species Database
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, scientific name, or local name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <select
            value={selectedVenom}
            onChange={(e) => setSelectedVenom(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Venom Types</option>
            <option value="neurotoxic">Neurotoxic</option>
            <option value="hemotoxic">Hemotoxic</option>
            <option value="cytotoxic">Cytotoxic</option>
            <option value="non-venomous">Non-venomous</option>
            <option value="mixed">Mixed</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Snake Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnakes.map((snake) => (
              <div
                key={snake._id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Snake Image */}
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {snake.images?.find(img => img.isPrimary) ? (
                    <img
                      src={snake.images.find(img => img.isPrimary).url}
                      alt={snake.commonName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Shield className="h-12 w-12" />
                    </div>
                  )}
                  
                  {/* Risk Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(snake.riskLevel)}`}>
                      {snake.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Snake Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {snake.commonName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {snake.scientificName}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getVenomColor(snake.venomType)}`}>
                      {snake.venomType}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {snake.region}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {snake.description}
                  </p>

                  {snake.localNames && snake.localNames.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Local names: {snake.localNames.join(', ')}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-600 transition-colors duration-200">
                      View Details
                    </button>
                    <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      First Aid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredSnakes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No snakes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Emergency Warning */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
              Emergency Warning
            </h3>
            <p className="text-red-700 dark:text-red-400 text-sm">
              If you or someone else has been bitten by a snake, do not rely solely on this identification. 
              Seek immediate medical attention and call emergency services. This tool is for educational 
              purposes and should not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnakeID