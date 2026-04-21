import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/supabase';
=======
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export const dynamic = 'force-static';
export const revalidate = 0;
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

<<<<<<< HEAD
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
=======
    console.log('=== ORDER API DEBUG ===');
    console.log('Request body:', orderData);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));

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

    // Pin code
    if (!/^\d{6}$/.test(orderData.pinCode)) {
      return NextResponse.json({ error: 'Invalid pin code (6 digits)' }, { status: 400 });
    }

    // Quantity
    if (orderData.quantity < 10 || orderData.quantity > 2000) {
      return NextResponse.json({ error: 'Quantity must be 10-2000' }, { status: 400 });
    }

    // Anon Supabase client - no cookies, public insert
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      console.error('Supabase client failed');
      return NextResponse.json({ error: 'Supabase not available' }, { status: 500 });
    }

    console.log('Inserting order...');

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
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
      })
      .select()
      .single();

    if (error) {
<<<<<<< HEAD
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
=======
      console.error('Supabase error:', error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    console.log('Order created:', data.id);

    return NextResponse.json({
      success: true,
      orderId: data.id,
      totalAmount: totalAmount,
      message: 'Order placed successfully!'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  }
}

export async function GET() {
<<<<<<< HEAD
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
=======
  // Admin-only GET - keep server client if needed
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not available' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data || [] });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
