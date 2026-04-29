import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabase-config';

function getSupabase() {
  // Prefer service role key to bypass RLS; fall back to anon key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    return null;
  }
  return createClient(SUPABASE_URL, key);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const orderData = await request.json();

    const requiredFields = ['bookId', 'bookTitle', 'bookPrice', 'customerName', 'mobile', 'address', 'pinCode', 'quantity'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    if (!/^[6-9]\d{9}$/.test(orderData.mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number (10 digits starting 6-9)' }, { status: 400 });
    }

    if (!/^\d{6}$/.test(orderData.pinCode)) {
      return NextResponse.json({ error: 'Invalid pin code (6 digits)' }, { status: 400 });
    }

    if (orderData.quantity < 10 || orderData.quantity > 2000) {
      return NextResponse.json({ error: 'Quantity must be 10-2000' }, { status: 400 });
    }

    const totalAmount = orderData.quantity * parseFloat(orderData.bookPrice);

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Use stored procedure first to bypass PostgREST schema cache issues
    try {
      const { data, error } = await supabase.rpc('place_order', {
        p_book_id: orderData.bookId.toString(),
        p_book_title: orderData.bookTitle,
        p_book_price: parseFloat(orderData.bookPrice),
        p_quantity: orderData.quantity,
        p_full_name: orderData.customerName,
        p_mobile: orderData.mobile,
        p_address: orderData.address,
        p_pin_code: orderData.pinCode,
        p_order_number: orderNumber
      });

      if (error) {
        console.warn('RPC failed, falling back to direct insert:', error);
        throw new Error('RPC failed');
      }

      // RPC returns JSON, parse it
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      return NextResponse.json(result);
    } catch (rpcError) {
      // Fallback: direct insert (works if schema cache is fresh)
      console.log('Trying direct insert fallback...');

      const insertPayload: any = {
        book_id: orderData.bookId.toString(),
        book_title: orderData.bookTitle,
        book_price: parseFloat(orderData.bookPrice),
        quantity: orderData.quantity,
        full_name: orderData.customerName,
        mobile_number: orderData.mobile,
        address: orderData.address,
        pin_code: orderData.pinCode,
        total_amount: totalAmount,
        status: 'pending',
        order_number: orderNumber
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(insertPayload)
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
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

