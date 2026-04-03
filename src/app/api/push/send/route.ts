
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import fs from 'fs/promises';
import path from 'path';

const subscriptionsPath = path.resolve(process.cwd(), 'data', 'subscriptions.json');

// VAPID keys should be stored in environment variables
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (!vapidPublicKey || !vapidPrivateKey) {
  console.error('VAPID keys are not configured. Please add them to your .env.local file.');
} else {
  webpush.setVapidDetails(
    'mailto:your-email@example.com', // Replace with your email
    vapidPublicKey,
    vapidPrivateKey
  );
}

async function getSubscriptions(): Promise<webpush.PushSubscription[]> {
  try {
    const data = await fs.readFile(subscriptionsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

export async function POST(req: NextRequest) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  try {
    const { title, body, icon } = await req.json();

    if (!title || !body) {
        return NextResponse.json({ error: 'Invalid notification payload' }, { status: 400 });
    }
    
    const subscriptions = await getSubscriptions();
    const notificationPayload = JSON.stringify({
      title,
      body,
      icon: icon || '/icon-192x192.png',
    });

    const promises = subscriptions.map(subscription =>
      webpush.sendNotification(subscription, notificationPayload)
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true, count: subscriptions.length });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
