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
      description: 'Spiritual discourses and satsang sessions',
      logo: 'https://yt3.ggpht.com/ytc/AL5GRJXc2044Q0407v0Q6Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q=s88-c-k-c0x00ffffff-no-rj',
    },
    {
      id: 'nitin-kabir-krishna-nanak-ram',
      name: 'Nitin Kabir Krishna Nanak Ram',
      url: 'https://youtube.com/@nitin-kabir-krishna-nanak-ram-?si=hTj3qhVoDKYaw4fS',
      description: 'Devotional songs and spiritual teachings',
      logo: 'https://yt3.ggpht.com/ytc/AL5GRJXc2044Q0407v0Q6Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q=s88-c-k-c0x00ffffff-no-rj',
    },
  ];

  return (
      <div className="mb-8 p-6 border rounded-lg bg-card text-card-foreground">
          <h2 className="text-xl font-bold mb-6 text-center">Subscribe to Our Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {channels.map(channel => (
                  <div key={channel.id} className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={channel.logo} alt={channel.name} />
                        <AvatarFallback>{channel.name.split(' ').map(n => n.charAt(0)).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
                      <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                           <a href={channel.url} target="_blank" rel="noopener noreferrer">
                                <Youtube className="mr-2 h-4 w-4" />
                                Subscribe
                           </a>
                      </Button>
                  </div>
              ))}
          </div>
      </div>
  )
}
