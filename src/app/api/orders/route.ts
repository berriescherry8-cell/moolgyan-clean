import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    const requiredFields = ['bookId', 'bookTitle', 'customerName', 'mobile', 'address', 'pinCode', 'quantity'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate mobile number format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(orderData.mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    // Validate pin code format
    const pinCodeRegex = /^\d{6}$/;
    if (!pinCodeRegex.test(orderData.pinCode)) {
      return NextResponse.json(
        { error: 'Invalid pin code format' },
        { status: 400 }
      );
    }

    // Validate quantity range
    if (orderData.quantity < 10 || orderData.quantity > 2000) {
      return NextResponse.json(
        { error: 'Quantity must be between 10 and 2000' },
        { status: 400 }
      );
    }

    // Insert order into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_date: new Date().toISOString(),
        status: 'pending',
        name: orderData.customerName,
        mobile: orderData.mobile,
        address: orderData.address,
        pincode: orderData.pinCode,
        book_title: orderData.bookTitle,
        quantity: orderData.quantity
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      message: 'Order saved successfully'
    });

  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json(
      { error: 'Failed to save order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data || []
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
