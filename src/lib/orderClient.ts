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

    // Create Supabase client
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const totalAmount = orderData.quantity * parseFloat(orderData.bookPrice);

    const { data, error } = await supabase
      .from('orders')
      .insert({
        book_id: parseInt(orderData.bookId.toString()),
        book_title: orderData.bookTitle,
        book_price: parseFloat(orderData.bookPrice),
        quantity: orderData.quantity,
        full_name: orderData.customerName,
        mobile_number: orderData.mobile,
        address: orderData.address,
        pin_code: orderData.pinCode,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return {
      success: true,
      orderId: data.id,
      totalAmount: totalAmount,
      message: 'Order placed successfully!'
    };

  } catch (error) {
    console.error('Order error:', error);
    throw error;
  }
}
