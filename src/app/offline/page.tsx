'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setRetryCount(0);
      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Mool Gyan Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Icon */}
        <div className="mb-6">
          {isOnline ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <WifiOff className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isOnline ? 'Connection Restored!' : 'No Internet Connection'}
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {isOnline 
            ? 'You\'re back online! Redirecting to the app...'
            : 'Please check your internet connection and try again.'
          }
        </p>

        {/* Status Indicator */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Checking connection...
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {!isOnline && (
            <>
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${retryCount > 0 ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Go to Home
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        {!isOnline && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips:</h3>
            <ul className="text-xs text-blue-700 space-y-1 text-left">
              <li>• Check your Wi-Fi or mobile data connection</li>
              <li>• Move closer to your router if using Wi-Fi</li>
              <li>• Restart your device if the problem persists</li>
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Mool Gyan App • Stay Connected to Spiritual Knowledge
          </p>
        </div>
      </div>
    </div>
  );
}