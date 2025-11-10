import React, { useState } from 'react'
import { BookOpen, Shield, AlertTriangle, Bandage, Download, Share2, Video } from 'lucide-react'

const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'prevention', name: 'Prevention' },
    { id: 'first-aid', name: 'First Aid' },
    { id: 'treatment', name: 'Treatment' },
    { id: 'species', name: 'Snake Species' },
    { id: 'emergency', name: 'Emergency Procedures' }
  ]

  const resources = [
    {
      id: 1,
      title: 'Snakebite Prevention Guide',
      category: 'prevention',
      description: 'Comprehensive guide on how to avoid snakebites in different environments and situations.',
      type: 'PDF',
      pages: 12,
      icon: Shield,
      color: 'green',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'First Aid for Snakebites',
      category: 'first-aid',
      description: 'Step-by-step instructions for immediate first aid response to snakebites.',
      type: 'Video',
      duration: '8:30',
      icon: Bandage,
      color: 'red',
      downloadUrl: '#'
    },
    {
      id: 3,
      title: 'Venomous Snakes of East Africa',
      category: 'species',
      description: 'Identification guide for common venomous snakes found in East Africa.',
      type: 'PDF',
      pages: 24,
      icon: BookOpen,
      color: 'blue',
      downloadUrl: '#'
    },
    {
      id: 4,
      title: 'Emergency Response Protocol',
      category: 'emergency',
      description: 'Official emergency response protocol for healthcare providers.',
      type: 'PDF',
      pages: 18,
      icon: AlertTriangle,
      color: 'orange',
      downloadUrl: '#'
    },
    {
      id: 5,
      title: 'Antivenom Administration',
      category: 'treatment',
      description: 'Medical guidelines for proper antivenom administration and dosage.',
      type: 'PDF',
      pages: 16,
      icon: Bandage,
      color: 'purple',
      downloadUrl: '#'
    },
    {
      id: 6,
      title: 'Snake Habitat Awareness',
      category: 'prevention',
      description: 'Understanding snake habitats and behaviors to prevent encounters.',
      type: 'Video',
      duration: '12:15',
      icon: Shield,
      color: 'green',
      downloadUrl: '#'
    }
  ]

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory)

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Educational Resources
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
          Comprehensive guides and materials for snakebite prevention, first aid, and treatment
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
          <BookOpen className="h-8 w-8 text-medical-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Resources</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
          <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Prevention Guides</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
          <Bandage className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">6</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">First Aid Guides</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
          <Video className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">4</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Video Tutorials</div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Browse by Category
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-medical-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = resource.icon
          
          return (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className={`p-4 ${getColorClasses(resource.color)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium capitalize">{resource.type}</span>
                  </div>
                  {resource.type === 'PDF' && (
                    <span className="text-sm opacity-75">{resource.pages} pages</span>
                  )}
                  {resource.type === 'Video' && (
                    <span className="text-sm opacity-75">{resource.duration}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                    {resource.category.replace('-', ' ')}
                  </span>

                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 pb-4">
                <button className="w-full bg-medical-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-medical-600 transition-colors duration-200">
                  {resource.type === 'PDF' ? 'Download PDF' : 'Watch Video'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Emergency First Aid Section */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-6 flex items-center">
          <Bandage className="h-6 w-6 mr-3" />
          Emergency First Aid - Do's and Don'ts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-sm">✓</span>
              </div>
              What TO DO
            </h3>
            <ul className="space-y-3 text-green-800 dark:text-green-300">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Keep the victim calm and still</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Remove tight clothing and jewelry</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Keep the bite area below heart level</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Seek immediate medical attention</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Note the snake's appearance for identification</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-sm">✗</span>
              </div>
              What NOT TO DO
            </h3>
            <ul className="space-y-3 text-red-800 dark:text-red-300">
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Do NOT cut the wound or attempt to suck out venom</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Do NOT apply a tourniquet</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Do NOT apply ice or immerse in water</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Do NOT give the victim alcohol or caffeine</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Do NOT try to catch or kill the snake</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Important:</strong> These are general first aid guidelines. Always follow the specific 
            instructions of medical professionals and seek immediate emergency care for snakebites.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Education