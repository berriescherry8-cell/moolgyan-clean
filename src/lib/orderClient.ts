'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase-config';

export interface OrderData {
  bookId: string;
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

    // Direct Supabase client insert (static export friendly)
    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const orderTotal = orderData.quantity * parseFloat(orderData.bookPrice);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderPayload = {
      book_id: orderData.bookId.toString(),
      book_title: orderData.bookTitle,
      book_price: parseFloat(orderData.bookPrice),
      quantity: orderData.quantity,
      full_name: orderData.customerName,
      mobile_number: orderData.mobile,
      address: orderData.address,
      pin_code: orderData.pinCode,
      total_amount: orderTotal,
      status: 'pending',
      order_number: orderNumber,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      success: true,
      orderId: data.id,
      totalAmount: orderTotal,
      orderNumber: orderNumber,
      message: 'Order placed successfully! Send payment screenshot to WhatsApp.'
    };

  } catch (error) {
    console.error('Order error:', error);
    throw error;
  }
}
