'use client';

import { Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ReferencePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Coming Soon Card */}
        <Card className="relative bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-12">
          <div className="relative z-10">
            {/* Icon */}
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/30">
              <Clock className="h-12 w-12 text-white animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 mb-6">
              Coming Soon
            </h1>

            {/* Description */}
            <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
              We're working on something amazing! The reference section will be available soon with comprehensive spiritual resources and teachings.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Spiritual Calendar</h3>
                <p className="text-zinc-400 text-sm">Important dates and events</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Daily Wisdom</h3>
                <p className="text-zinc-400 text-sm">Inspirational quotes and teachings</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Study Materials</h3>
                <p className="text-zinc-400 text-sm">Comprehensive learning resources</p>
              </div>
            </div>

            {/* Notification */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-300 text-sm">
                Stay tuned! This section will be updated with valuable spiritual reference materials.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
