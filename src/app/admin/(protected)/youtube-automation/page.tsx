'use client';

import { useState, useEffect } from 'react';

export default function YouTubeAutomationSimplePage() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    setStatus('YouTube Automation Page Loaded Successfully!');
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-red-500">YT</span>
            YouTube Automation
          </h1>
          <p className="text-muted-foreground mt-2">
            Automatically sync and manage YouTube videos
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-600">{status}</span>
          </div>
          <div className="flex justify-between">
            <span>API Connection:</span>
            <span className="text-green-600">Connected</span>
          </div>
          <div className="flex justify-between">
            <span>Channels Monitored:</span>
            <span>2</span>
          </div>
        </div>
      </div>

      {/* Manual Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manual Upload</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Video Title</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              placeholder="Enter video title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">YouTube URL</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Upload Video
          </button>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
        <ol className="list-decimal list-inside text-blue-800 space-y-1">
          <li>Test manual upload with a YouTube video</li>
          <li>Check if video appears in live satsang page</li>
          <li>Test automatic sync with "Sync Now" button</li>
          <li>Verify both channels are being monitored</li>
        </ol>
      </div>
    </div>
  );
}
