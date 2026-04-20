import { NextRequest, NextResponse } from 'next/server';
import { runYouTubeAutomation } from '@/lib/youtube-automation';
import { getSupabase } from '@/lib/data-manager';

export const dynamic = 'force-static';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    console.log('Starting YouTube sync API call...');
    
    // Run the automation
    const results = await runYouTubeAutomation();
    
    // Log results for debugging
    console.log('YouTube sync results:', results);
    
    return NextResponse.json({
      success: true,
      message: 'YouTube sync completed successfully',
      data: {
        liveVideosFound: results.liveVideos.length,
        recentVideosFound: results.recentVideos.length,
        videosSynced: results.syncResults.success,
        videosSkipped: results.syncResults.skipped,
        errors: results.syncResults.errors,
        totalProcessed: results.liveVideos.length + results.recentVideos.length
      }
    });
    
  } catch (error) {
    console.error('YouTube sync API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'YouTube sync failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current status of live satsangs
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }
    
    const { data: liveVideos, error: liveError } = await supabase
      .from('live_satsangs')
      .select('*')
      .eq('is_live', true)
      .order('created_at', { ascending: false });
    
    const { data: archiveVideos, error: archiveError } = await supabase
      .from('live_satsangs')
      .select('*')
      .eq('is_live', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (liveError || archiveError) {
      throw new Error('Error fetching videos from database');
    }
    
    return NextResponse.json({
      success: true,
      data: {
        liveCount: liveVideos?.length || 0,
        archiveCount: archiveVideos?.length || 0,
        recentLive: liveVideos?.slice(0, 3) || [],
        recentArchive: archiveVideos?.slice(0, 3) || []
      }
    });
    
  } catch (error) {
    console.error('YouTube status API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
