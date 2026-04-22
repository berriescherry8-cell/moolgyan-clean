import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validation
    const requiredFields = ['bookId', 'bookTitle', 'bookPrice', 'customerName', 'mobile', 'address', 'pinCode', 'quantity'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(orderData.mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number (10 digits starting 6-9)' }, { status: 400 });
    }

    // Pin code validation
    if (!/^\d{6}$/.test(orderData.pinCode)) {
      return NextResponse.json({ error: 'Invalid pin code (6 digits)' }, { status: 400 });
    }

    // Quantity validation
    if (orderData.quantity < 10 || orderData.quantity > 2000) {
      return NextResponse.json({ error: 'Quantity must be 10-2000' }, { status: 400 });
    }

    const totalAmount = orderData.quantity * parseFloat(orderData.bookPrice);

    const { data, error } = await supabase
      .from('orders')
      .insert({
        book_id: parseInt(orderData.bookId),
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
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      totalAmount: totalAmount,
      message: 'Order placed successfully!'
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
