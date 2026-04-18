'use client';

import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ChannelSubscribe() {
  const channels = [
    {
      id: 'nitin-dass-satsang',
      name: 'Nitin Dass Satsang',
      url: 'https://youtube.com/@nitin.dasssatsang?si=OefoKqiXe5UwZaHj',
      description: 'Spiritual discourses and satsang sessions by Nitin Dass',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdroID4m8yqDqZfR8R5QfW3zKzO0f9gH4j5k6l7m8n9oPqRsTuV=s88-c-k-c0x00ffffff-no-rj-mo',
    },
    {
      id: 'nitin-kabir-krishna-nanak-ram',
      name: 'Nitin Kabir Krishna Nanak Ram',
      url: 'https://youtube.com/@nitin-kabir-krishna-nanak-ram-?si=hTj3qhVoDKYaw4fS',
      description: 'Devotional songs and spiritual teachings',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdroID5n6m7pQ8rStUvWxYcZ1aBcDeFgHiJkLmNopQr=s88-c-k-c0x00ffffff-no-rj-mo',
    },
  ];

  return (
    <div className="mb-12 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-2xl mb-6 shadow-2xl shadow-red-500/25">
          <Youtube className="h-10 w-10 text-white drop-shadow-lg" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Subscribe to Our YouTube Channels
          </h2>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Get daily satsang videos, live streams, and spiritual teachings directly on your favorite channel
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {channels.map((channel) => (
          <div 
            key={channel.id} 
            className="group relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 overflow-hidden hover:scale-[1.02]"
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Avatar className="h-28 w-28 border-4 border-white/20 shadow-2xl group-hover:border-pink-500/50 transition-all duration-300">
                    <AvatarImage src={channel.logo} alt={channel.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold text-2xl flex items-center justify-center">
                      {channel.name.split(' ').map(n => n.charAt(0)).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {/* Subscribers ring */}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg text-xs font-bold text-white ring-4 ring-black/20">
                    50K+
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 text-center line-clamp-2">
                {channel.name}
              </h3>
              
              <p className="text-slate-300 mb-8 text-center leading-relaxed max-w-md mx-auto">
                {channel.description}
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 px-8 py-6 font-bold text-lg transform hover:-translate-y-1 transition-all duration-300 min-w-[160px]"
                >
                  <a href={channel.url} target="_blank" rel="noopener noreferrer">
                    <Youtube className="mr-2 h-5 w-5" />
                    Subscribe
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/50 px-8 py-6 font-semibold text-lg min-w-[120px] transition-all duration-300"
                  asChild
                >
                  <a href={channel.url} target="_blank" rel="noopener noreferrer">
                    View Videos
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

