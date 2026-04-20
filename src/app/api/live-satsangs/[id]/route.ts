import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/data-manager';

export const dynamic = 'force-static';
export const revalidate = 0;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }
    
    // Delete the video
    const { error } = await supabase
      .from('live_satsangs')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete video API error:', error);
    
    return NextResponse.json({
      error: 'Failed to delete video',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }
    
    // Get the video
    const { data, error } = await supabase
      .from('live_satsangs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error('Get video API error:', error);
    
    return NextResponse.json({
      error: 'Failed to get video',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }
    
    // Update the video
    const { data, error } = await supabase
      .from('live_satsangs')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Video updated successfully',
      data: data
    });
    
  } catch (error) {
    console.error('Update video API error:', error);
    
    return NextResponse.json({
      error: 'Failed to update video',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
