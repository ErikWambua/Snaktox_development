import React, { useState } from 'react';
import { 
  MapPin, 
  Camera, 
  Upload, 
  AlertTriangle, 
  Phone, 
  Stethoscope, 
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';
import { emergenciesAPI, snakesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Emergency = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [snakeIdentification, setSnakeIdentification] = useState(null);
  const [selectedSnake, setSelectedSnake] = useState(null);

  const [emergencyData, setEmergencyData] = useState({
    location: {
      coordinates: [],
      address: '',
      description: ''
    },
    snakeSpecies: '',
    victimInfo: {
      age: '',
      gender: '',
      condition: '',
      symptoms: [],
      biteTime: ''
    },
    images: []
  });

  const symptomsOptions = [
    'Pain at bite site',
    'Swelling',
    'Nausea/Vomiting',
    'Difficulty breathing',
    'Blurred vision',
    'Dizziness',
    'Sweating',
    'Weakness',
    'Bleeding',
    'Paralysis'
  ];

  const riskLevels = {
    CRITICAL: { color: 'bg-red-100 text-red-800', label: 'Critical Risk' },
    HIGH: { color: 'bg-orange-100 text-orange-800', label: 'High Risk' },
    MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Risk' },
    LOW: { color: 'bg-green-100 text-green-800', label: 'Low Risk' }
  };

  // Location handling
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    toast.loading('Getting your location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss();
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        updateEmergencyData('location', {
          ...emergencyData.location,
          coordinates: [longitude, latitude]
        });
        toast.success('Location obtained successfully!');
      },
      (error) => {
        toast.dismiss();
        console.error('Location error:', error);
        toast.error('Failed to get location. Please enter manually.');
      }
    );
  };

  // Image handling
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      description: 'Snake photo',
      uploadedAt: new Date().toISOString()
    }));
    
    updateEmergencyData('images', [...emergencyData.images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = emergencyData.images.filter((_, i) => i !== index);
    updateEmergencyData('images', updatedImages);
  };

  // Snake identification
  const handleIdentifySnake = async () => {
    if (emergencyData.images.length === 0) {
      toast.error('Please upload at least one snake photo');
      return;
    }

    setIsLoading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', emergencyData.images[0].file);
      if (userLocation) {
        uploadData.append('latitude', userLocation.lat);
        uploadData.append('longitude', userLocation.lng);
      }
      
      const response = await snakesAPI.identifySnake(uploadData);
      setSnakeIdentification(response.data);
      setCurrentStep(2);
      toast.success('Snake identification completed!');
    } catch (error) {
      console.error('Snake identification error:', error);
      toast.error('Failed to identify snake. Please select manually.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form handling
  const handleSymptomToggle = (symptom) => {
    const currentSymptoms = emergencyData.victimInfo.symptoms;
    const updatedSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter(s => s !== symptom)
      : [...currentSymptoms, symptom];
    
    updateEmergencyData('victimInfo', {
      ...emergencyData.victimInfo,
      symptoms: updatedSymptoms
    });
  };

  const handleInputChange = (section, field, value) => {
    updateEmergencyData(section, {
      ...emergencyData[section],
      [field]: value
    });
  };

  const updateEmergencyData = (section, data) => {
    setEmergencyData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Emergency submission
  const handleSubmitEmergency = async () => {
    if (!emergencyData.snakeSpecies) {
      toast.error('Please select or identify the snake species');
      return;
    }

    if (!emergencyData.victimInfo.age || !emergencyData.victimInfo.gender) {
      toast.error('Please provide victim age and gender');
      return;
    }

    setIsLoading(true);
    try {
      const submissionData = {
        ...emergencyData,
        reportedBy: user?.id || 'anonymous',
        timestamp: new Date().toISOString(),
        status: 'reported'
      };
      
      await emergenciesAPI.createEmergency(submissionData);
      toast.success('Emergency reported successfully! Help is on the way.');
      setCurrentStep(4);
    } catch (error) {
      console.error('Emergency submission error:', error);
      toast.error('Failed to report emergency. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setEmergencyData({
      location: {
        coordinates: [],
        address: '',
        description: ''
      },
      snakeSpecies: '',
      victimInfo: {
        age: '',
        gender: '',
        condition: '',
        symptoms: [],
        biteTime: ''
      },
      images: []
    });
    setUserLocation(null);
    setSnakeIdentification(null);
    setSelectedSnake(null);
    setCurrentStep(1);
  };

  // Navigation
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const steps = [
    { number: 1, title: 'Location', icon: MapPin },
    { number: 2, title: 'Snake ID', icon: Camera },
    { number: 3, title: 'Victim Info', icon: User },
    { number: 4, title: 'Help', icon: Stethoscope }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🐍 Snakebite Emergency
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Get immediate medical assistance for snakebite emergencies
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
            <div 
              className="h-1 bg-emergency-500 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;
            
            return (
              <div key={step.number} className="flex flex-col items-center z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emergency-500 border-emergency-500 text-white'
                    : isCurrent
                    ? 'border-emergency-500 bg-white dark:bg-gray-800 text-emergency-500'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span className={`text-sm font-medium mt-3 ${
                  isCurrent || isCompleted
                    ? 'text-emergency-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Location */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Step 1: Emergency Location
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Help us locate you quickly for emergency response
            </p>
            
            <div className="space-y-6">
              {/* Auto Location Detection */}
              <div className="text-center">
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLoading}
                  className="w-full max-w-md mx-auto bg-medical-50 dark:bg-medical-900/20 border-2 border-dashed border-medical-300 dark:border-medical-700 rounded-xl p-8 hover:bg-medical-100 dark:hover:bg-medical-900/30 transition-all duration-200 disabled:opacity-50"
                >
                  <MapPin className="h-16 w-16 text-medical-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {isLoading ? 'Detecting Location...' : 'Use My Current Location'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Automatically share your GPS location for fastest response
                  </p>
                </button>
                
                {userLocation && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg max-w-md mx-auto">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      ✅ Location detected: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Or Enter Location Manually
                </h3>
                
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address
                    </label>
                    <textarea
                      value={emergencyData.location.address}
                      onChange={(e) => handleInputChange('location', 'address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Enter your exact address, street, or location..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Location Details
                    </label>
                    <input
                      type="text"
                      value={emergencyData.location.description}
                      onChange={(e) => handleInputChange('location', 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="e.g., Near the river, behind school, floor number..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <div></div> {/* Spacer */}
                <button
                  onClick={nextStep}
                  disabled={!emergencyData.location.coordinates.length && !emergencyData.location.address}
                  className="bg-emergency-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emergency-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Next: Identify Snake</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Snake Identification */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Step 2: Snake Identification
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Identify the snake for appropriate medical response
            </p>

            <div className="space-y-8">
              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center transition-colors hover:border-medical-400">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Snake Photos
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  Clear photos from different angles help us identify the snake accurately and provide the right treatment advice.
                </p>
                
                <label className="inline-flex items-center px-6 py-3 bg-medical-500 text-white rounded-lg cursor-pointer hover:bg-medical-600 transition-all duration-200 shadow-md">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Image Previews */}
                {emergencyData.images.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Uploaded Photos ({emergencyData.images.length})
                    </h4>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {emergencyData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image.url} 
                            alt={`Snake photo ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg shadow-md"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Identification */}
              <div className="bg-snake-50 dark:bg-snake-900/20 rounded-xl p-6 border border-snake-200 dark:border-snake-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  AI Snake Identification
                </h3>
                
                <button
                  onClick={handleIdentifySnake}
                  disabled={isLoading || emergencyData.images.length === 0}
                  className="w-full bg-snake-500 text-white py-4 rounded-lg font-semibold hover:bg-snake-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Identifying Snake...
                    </span>
                  ) : (
                    'Identify Snake Automatically'
                  )}
                </button>

                {/* Identification Results */}
                {snakeIdentification && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Identification Results
                    </h4>
                    <div className="space-y-4">
                      {snakeIdentification.matches?.map((match, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedSnake === match.snake.id
                              ? 'border-snake-500 bg-snake-50 dark:bg-snake-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-snake-300'
                          }`}
                          onClick={() => {
                            setSelectedSnake(match.snake.id);
                            updateEmergencyData('snakeSpecies', match.snake.id);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900 dark:text-white text-lg">
                                {match.snake.commonName}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                {match.snake.scientificName}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  riskLevels[match.snake.riskLevel]?.color || riskLevels.MEDIUM.color
                                }`}>
                                  {riskLevels[match.snake.riskLevel]?.label || 'Unknown Risk'}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                  {match.snake.venomType || 'Unknown Venom'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-snake-600">
                                {Math.round(match.confidence * 100)}%
                              </div>
                              <div className="text-sm text-gray-500">Confidence</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={nextStep}
                  disabled={!emergencyData.snakeSpecies}
                  className="bg-emergency-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emergency-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Next: Victim Information</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Victim Information */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Step 3: Victim Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Provide details about the victim for appropriate medical care
            </p>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={emergencyData.victimInfo.age}
                    onChange={(e) => handleInputChange('victimInfo', 'age', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={emergencyData.victimInfo.gender}
                    onChange={(e) => handleInputChange('victimInfo', 'gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                {/* Bite Time */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time of Bite
                  </label>
                  <input
                    type="datetime-local"
                    value={emergencyData.victimInfo.biteTime}
                    onChange={(e) => handleInputChange('victimInfo', 'biteTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>

                {/* Current Condition */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Condition Description
                  </label>
                  <textarea
                    value={emergencyData.victimInfo.condition}
                    onChange={(e) => handleInputChange('victimInfo', 'condition', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Describe the victim's current condition, any first aid administered, and visible symptoms..."
                  />
                </div>

                {/* Symptoms */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Symptoms Observed
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {symptomsOptions.map((symptom) => (
                      <label
                        key={symptom}
                        className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={emergencyData.victimInfo.symptoms.includes(symptom)}
                          onChange={() => handleSymptomToggle(symptom)}
                          className="w-4 h-4 text-medical-500 focus:ring-medical-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleSubmitEmergency}
                  disabled={isLoading || !emergencyData.victimInfo.age || !emergencyData.victimInfo.gender}
                  className="bg-emergency-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emergency-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>{isLoading ? 'Reporting Emergency...' : 'Report Emergency'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success/Help */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="h-12 w-12 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Help is On The Way! 🚑
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Emergency services have been notified and medical assistance is being dispatched to your location immediately.
            </p>

            {/* Emergency Instructions */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Critical First Aid Instructions
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Keep the victim <strong>calm and still</strong> - movement spreads venom faster</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Keep the bite area <strong>below heart level</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Remove tight clothing or jewelry near the bite area</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span><strong>DO NOT</strong> cut the wound or try to suck out venom</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span><strong>DO NOT</strong> apply a tourniquet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span><strong>DO NOT</strong> apply ice or immerse in water</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span><strong>DO NOT</strong> give the victim alcohol or caffeine</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('tel:911', '_self')}
                className="inline-flex items-center justify-center px-8 py-4 bg-emergency-500 text-white rounded-lg hover:bg-emergency-600 transition-all duration-200 font-semibold shadow-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency Services (911)
              </button>
              <button 
                onClick={handleResetForm}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
              >
                Report Another Emergency
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-2xl mx-auto">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <strong>Note:</strong> Medical professionals have been alerted with all the information you provided. 
                Stay on the line if emergency services call you back for additional details.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Emergency;