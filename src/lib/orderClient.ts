'use client';

import { createBrowserClient } from '@supabase/ssr';

export interface OrderData {
  bookId: number;
  bookTitle: string;
  bookPrice: string;
  customerName: string;
  mobile: string;
  address: string;
  pinCode: string;
  quantity: number;
}

export async function placeOrder(orderData: OrderData) {
  try {
    // Validation
    const requiredFields = ['bookId', 'bookTitle', 'bookPrice', 'customerName', 'mobile', 'address', 'pinCode', 'quantity'];
    for (const field of requiredFields) {
      if (!orderData[field as keyof OrderData]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(orderData.mobile)) {
      throw new Error('Invalid mobile number (10 digits starting 6-9)');
    }

    // Pin code validation
    if (!/^\d{6}$/.test(orderData.pinCode)) {
      throw new Error('Invalid pin code (6 digits)');
    }

    // Quantity validation
    if (orderData.quantity < 10 || orderData.quantity > 2000) {
      throw new Error('Quantity must be 10-2000');
    }

    const totalAmount = orderData.quantity * parseFloat(orderData.bookPrice);

    // Use API route instead of direct Supabase call
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to place order');
    }

    return result;

  } catch (error) {
    console.error('Order error:', error);
    throw error;
  }
}
