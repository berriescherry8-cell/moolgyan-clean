'use client';

import { useLocale } from '@/lib/i18n';
import ChannelSubscribe from '@/components/ChannelSubscribe';
import YouTubePlaylist from '@/components/YouTubePlaylist';
import { Play, Video, Sparkles } from 'lucide-react';

export default function SatsangPage() {
  const { t } = useLocale();
  const playlistId = 'PL3YmFR4FKEbf0ZRztAuj2-RG4NVGtqyU-';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/30 to-pink-900/20 animate-pan-background py-12 px-4 relative overflow-hidden">
      {/* Divine Rays Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl divine-rays"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl divine-rays animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full blur-2xl divine-rays"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Enhanced Hero Header */}
        <div className="text-center space-y-12 pt-12">
          <div className="flex items-center justify-center gap-6 mb-12 animate-fade-in-up">
            <div className="p-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl shadow-3xl shadow-violet-500/50 divine-rays">
              <Video className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-violet-600 bg-clip-text text-transparent drop-shadow-4xl mb-4">
                SATSANG
              </h1>
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-violet-400 animate-pulse" />
                <p className="text-pink-300 font-medium text-lg">Divine Discourses</p>
                <Sparkles className="h-8 w-8 text-pink-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl text-slate-200/90 max-w-5xl mx-auto leading-relaxed drop-shadow-lg font-light">
            Immerse in divine satsang videos and spiritual discourses from Sadguru Nitin Sahib. 
            Experience spiritual enlightenment with beautifully designed inline video players.
          </p>
        </div>

        {/* Channel Subscribe Section */}
        <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <ChannelSubscribe />
        </div>

        {/* Video Grid Section */}
        <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-violet-600 bg-clip-text text-transparent flex items-center gap-6">
              <Play className="h-20 w-20 text-violet-500 drop-shadow-2xl glow-pulse" />
              Divine Satsang Collection
              <span className="text-3xl text-slate-300 font-normal">(Complete Archive)</span>
            </h2>
            {/* Search will be handled in YouTubePlaylist */}
          </div>
          <YouTubePlaylist playlistId={playlistId} />
        </div>
      </div>
    </div>
  );
}
