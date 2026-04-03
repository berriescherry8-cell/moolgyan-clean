'use client';

import { useEffect, useState, useCallback } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useFirebaseApp, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { doc, setDoc } from 'firebase/firestore';

const VAPID_KEY = process.env.NEXT_PUBLIC_FCM_VAPID_KEY;

export default function NotificationPermissionHandler() {
    const { toast } = useToast();
    const app = useFirebaseApp();
    const firestore = useFirestore();
    const [permissionRequested, setPermissionRequested] = useState(false);

    const requestPermission = useCallback(async () => {
        if (!VAPID_KEY || VAPID_KEY === "YOUR_VAPID_KEY_HERE") {
            console.error('VAPID key not configured. Please add it to your .env file.');
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'Notification service is not configured by the administrator.'
            });
            return;
        }
        if (!app || !firestore) return;

        try {
            const messaging = getMessaging(app);
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
                if (currentToken) {
                    const tokenRef = doc(firestore, 'fcmTokens', currentToken);
                    await setDoc(tokenRef, { subscribedAt: new Date().toISOString() });
                    toast({ title: 'Notifications Enabled!', description: 'You will now receive updates.' });
                }
            } else {
                toast({ variant: 'destructive', title: 'Notifications Denied', description: 'You will not receive updates.' });
            }
        } catch (error) {
            console.error('Error getting permission or token', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not enable notifications.' });
        }
    }, [app, firestore, toast]);

    useEffect(() => {
        // Check if running on client, service worker is available, and permission has not been requested yet.
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && Notification) {
            
            // Don't ask if permission is already granted or denied
            if (Notification.permission !== 'default' || permissionRequested) {
                return;
            }

            const timer = setTimeout(() => {
                toast({
                    title: 'Enable Notifications',
                    description: 'Get updates on news and events directly on your device.',
                    action: <Button onClick={() => { requestPermission(); }}>Enable</Button>,
                    duration: 15000, // Give user 15 seconds to respond
                });
                setPermissionRequested(true);
            }, 8000); // Wait 8 seconds before showing the prompt

            return () => clearTimeout(timer);
        }
    }, [permissionRequested, requestPermission, toast]);

    // Set up foreground message handler
    useEffect(() => {
        if (app) {
            const messaging = getMessaging(app);
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground message received.', payload);
                toast({
                    title: payload.notification?.title,
                    description: payload.notification?.body,
                });
            });
            return () => unsubscribe();
        }
    }, [app, toast]);

    return null; // This component does not render anything.
}
