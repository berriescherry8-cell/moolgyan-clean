'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Youtube,
  RefreshCw,
  Play,
  Archive,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Radio,
  Video,
  Settings,
  Activity,
  Calendar,
  Eye,
  Loader2,
  Upload,
  Plus,
  Link,
  Trash2,
} from 'lucide-react';

interface SyncStatus {
  liveCount: number;
  archiveCount: number;
  recentLive: any[];
  recentArchive: any[];
  lastSync?: Date;
}

interface SyncResult {
  success: boolean;
  message: string;
  data?: {
    liveVideosFound: number;
    recentVideosFound: number;
    videosSynced: number;
    videosSkipped: number;
    errors: number;
    totalProcessed: number;
  };
}

export default function YouTubeAutomationPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [manualUploadResult, setManualUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isManualUploading, setIsManualUploading] = useState(false);
  
  // Manual upload form state
  const [manualUpload, setManualUpload] = useState({
    title: '',
    description: '',
    youtube_url: '',
    is_live: false,
    channel_name: '',
    view_count: 0,
    duration: ''
  });

  // Fetch current status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/sync-youtube');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  // Manual sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync-youtube', { method: 'POST' });
      const result = await response.json();
      
      setLastSyncResult(result);
      
      if (result.success) {
        // Refresh status after successful sync
        setTimeout(fetchStatus, 2000);
      }
    } catch (error) {
      console.error('Error during sync:', error);
      setLastSyncResult({
        success: false,
        message: 'Sync failed. Please try again.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual upload
  const handleManualUpload = async () => {
    if (!manualUpload.title || !manualUpload.youtube_url) {
      setManualUploadResult({
        success: false,
        message: 'Title and YouTube URL are required'
      });
      return;
    }

    setIsManualUploading(true);
    try {
      const response = await fetch('/api/live-satsangs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualUpload),
      });
      
      if (response.ok) {
        setManualUploadResult({
          success: true,
          message: 'Video uploaded successfully!'
        });
        
        // Reset form
        setManualUpload({
          title: '',
          description: '',
          youtube_url: '',
          is_live: false,
          channel_name: '',
          view_count: 0,
          duration: ''
        });
        
        // Refresh status
        setTimeout(fetchStatus, 2000);
      } else {
        const error = await response.json();
        setManualUploadResult({
          success: false,
          message: error.message || 'Upload failed'
        });
      }
    } catch (error) {
      console.error('Error during manual upload:', error);
      setManualUploadResult({
        success: false,
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setIsManualUploading(false);
    }
  };

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Delete video
  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${videoTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/live-satsangs/${videoId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setManualUploadResult({
          success: true,
          message: 'Video deleted successfully!'
        });
        
        // Refresh status
        setTimeout(fetchStatus, 1000);
      } else {
        const error = await response.json();
        setManualUploadResult({
          success: false,
          message: error.message || 'Delete failed'
        });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      setManualUploadResult({
        success: false,
        message: 'Delete failed. Please try again.'
      });
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Youtube className="h-8 w-8 text-red-500" />
            YouTube Automation
          </h1>
          <p className="text-muted-foreground mt-2">
            Automatically sync live and uploaded videos from your YouTube channels
          </p>
        </div>
        <Button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
      </div>

      {/* Last Sync Result */}
      {lastSyncResult && (
        <Card className={lastSyncResult.success ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {lastSyncResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-semibold">{lastSyncResult.message}</p>
                {lastSyncResult.data && (
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="mr-4">Found: {lastSyncResult.data.totalProcessed}</span>
                    <span className="mr-4">Synced: {lastSyncResult.data.videosSynced}</span>
                    <span className="mr-4">Skipped: {lastSyncResult.data.videosSkipped}</span>
                    {lastSyncResult.data.errors > 0 && (
                      <span className="text-red-500">Errors: {lastSyncResult.data.errors}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Upload Result */}
      {manualUploadResult && (
        <Card className={manualUploadResult.success ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {manualUploadResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <p className="font-semibold">{manualUploadResult.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manual-upload">Manual Upload</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Manual Upload Tab */}
        <TabsContent value="manual-upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Manual Video Upload
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Manually add YouTube videos that weren't automatically synced
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Video Title *</Label>
                    <Input
                      id="title"
                      value={manualUpload.title}
                      onChange={(e) => setManualUpload({...manualUpload, title: e.target.value})}
                      placeholder="Enter video title"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtube_url">YouTube URL *</Label>
                    <Input
                      id="youtube_url"
                      value={manualUpload.youtube_url}
                      onChange={(e) => setManualUpload({...manualUpload, youtube_url: e.target.value})}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="mt-1"
                    />
                    {extractVideoId(manualUpload.youtube_url) && (
                      <p className="text-xs text-green-600 mt-1">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Valid YouTube URL detected
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="channel_name">Channel Name</Label>
                    <Input
                      id="channel_name"
                      value={manualUpload.channel_name}
                      onChange={(e) => setManualUpload({...manualUpload, channel_name: e.target.value})}
                      placeholder="e.g., @nitin.dasssatsang"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={manualUpload.description}
                      onChange={(e) => setManualUpload({...manualUpload, description: e.target.value})}
                      placeholder="Enter video description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={manualUpload.duration}
                      onChange={(e) => setManualUpload({...manualUpload, duration: e.target.value})}
                      placeholder="e.g., 1:23:45"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="view_count">View Count</Label>
                    <Input
                      id="view_count"
                      type="number"
                      value={manualUpload.view_count}
                      onChange={(e) => setManualUpload({...manualUpload, view_count: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Video Type Selection */}
              <div>
                <Label>Video Type</Label>
                <Select
                  value={manualUpload.is_live ? 'live' : 'archive'}
                  onValueChange={(value) => setManualUpload({...manualUpload, is_live: value === 'live'})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select video type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">
                      <div className="flex items-center gap-2">
                        <Radio className="h-4 w-4 text-red-500" />
                        Live Video
                      </div>
                    </SelectItem>
                    <SelectItem value="archive">
                      <div className="flex items-center gap-2">
                        <Archive className="h-4 w-4 text-blue-500" />
                        Archive Video
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {manualUpload.is_live ? 'This video will appear in the Live section' : 'This video will appear in the Archive section'}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleManualUpload}
                  disabled={isManualUploading || !manualUpload.title || !manualUpload.youtube_url}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isManualUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Upload Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Manual Upload Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Use for special videos</p>
                  <p className="text-sm text-muted-foreground">
                    Manually upload videos that the automation might miss
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">YouTube URL formats accepted</p>
                  <p className="text-sm text-muted-foreground">
                    youtube.com/watch?v=ID, youtu.be/ID, or youtube.com/embed/ID
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Duplicate prevention</p>
                  <p className="text-sm text-muted-foreground">
                    System will skip videos that already exist in the database
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Videos Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Videos</CardTitle>
                <Radio className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status?.liveCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Currently live streams
                </p>
              </CardContent>
            </Card>

            {/* Archive Videos Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Archive Videos</CardTitle>
                <Archive className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status?.archiveCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Total archived videos
                </p>
              </CardContent>
            </Card>

            {/* Total Videos Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                <Video className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(status?.liveCount || 0) + (status?.archiveCount || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All videos in database
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Live Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-red-500" />
                  Recent Live Videos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {status?.recentLive?.length ? (
                  status.recentLive.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(video.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          LIVE
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVideo(video.id, video.title)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No live videos found</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Archive Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-blue-500" />
                  Recent Archive Videos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {status?.recentArchive?.length ? (
                  status.recentArchive.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(video.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Archive
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVideo(video.id, video.title)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No archive videos found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected YouTube Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Channel 1 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">@nitin.dasssatsang</p>
                    <p className="text-sm text-muted-foreground">Main Satsang Channel</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Connected</Badge>
              </div>

              {/* Channel 2 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">@nitin-kabir-krishna-nanak-ram</p>
                    <p className="text-sm text-muted-foreground">Spiritual Teachings Channel</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Connected</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Channel Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Channel Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sync Frequency</label>
                  <p className="text-sm text-muted-foreground">Every 6 hours (automatic)</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Max Videos per Sync</label>
                  <p className="text-sm text-muted-foreground">10 recent videos + all live</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Auto-categorize</label>
                  <p className="text-sm text-muted-foreground">Live videos go to Live, uploads to Archive</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Duplicate Prevention</label>
                  <p className="text-sm text-muted-foreground">Skip existing videos automatically</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Sync</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync videos every 6 hours
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Video Quality</p>
                  <p className="text-sm text-muted-foreground">
                    Fetch high-quality thumbnails
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new videos are synced
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>YouTube API</span>
                <Badge className="bg-green-100 text-green-700">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Supabase Database</span>
                <Badge className="bg-green-100 text-green-700">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Automation Service</span>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
