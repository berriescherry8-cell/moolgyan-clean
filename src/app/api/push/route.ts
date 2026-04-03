
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

async function saveSubscription(subscription: webpush.PushSubscription): Promise<void> {
  const subscriptions = await getSubscriptions();
  // Check if the subscription already exists
  if (!subscriptions.some(s => s.endpoint === subscription.endpoint)) {
    subscriptions.push(subscription);
    // WARNING: This is a non-atomic operation and can lead to race conditions
    // in a high-concurrency environment. For a simple, low-traffic app,
    // it might be acceptable. For a real application, use a proper database.
    await fs.writeFile(subscriptionsPath, JSON.stringify(subscriptions, null, 2));
  }
}

export async function POST(req: NextRequest) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  try {
    const subscription = await req.json();
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }
    await saveSubscription(subscription);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
