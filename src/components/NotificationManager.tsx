
'use client';

import { useEffect, useState } from 'react';
import { urlBase64ToUint8Array } from '@/lib/utils';

export function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          if (subscription) {
            setIsSubscribed(true);
          }
          setIsLoading(false);
        });
      });
    } else {
        setIsLoading(false);
    }
  }, []);

  const subscribeButtonOnClick = async () => {
    if (!('serviceWorker' in navigator)) {
        console.error('Service Worker not supported');
        return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.error('Permission not granted for Notification');
      return;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
        console.error('VAPID public key not configured');
        return;
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    try {
      const response = await fetch('/api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        console.error('Failed to save subscription on server.');
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <div className="fixed bottom-16 right-4 z-50">
      {!isSubscribed && (
        <button 
          onClick={subscribeButtonOnClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Enable Notifications
        </button>
      )}
      {isSubscribed && (
         <p className="text-sm text-gray-600">Notifications Enabled</p>
      )}
    </div>
  );
}
