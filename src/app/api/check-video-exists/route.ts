import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/data-manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }
    
    // Check if video already exists in database
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    const { data, error } = await supabase
      .from('live_satsangs')
      .select('id')
      .eq('youtube_url', youtubeUrl)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }
    
    return NextResponse.json({
      exists: !!data,
      videoId: videoId
    });
    
  } catch (error) {
    console.error('Check video exists API error:', error);
    
    return NextResponse.json({
      error: 'Failed to check video existence',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
