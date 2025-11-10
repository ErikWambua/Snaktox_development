import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
      return
    }

    // Check for iOS
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIos)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after a delay if not dismissed before
      const hasSeenPrompt = localStorage.getItem('pwaPromptDismissed')
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      }
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwaPromptDismissed', 'true')
  }

  if (isStandalone || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-50 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Install SnaKTox
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get quick access to emergency help
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {isIOS ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tap <Download className="h-3 w-3 inline mx-1" /> then "Add to Home Screen"
          </p>
          <button
            onClick={handleDismiss}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Got it
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Install App</span>
        </button>
      )}
    </div>
  )
}

export default PWAInstallPrompt