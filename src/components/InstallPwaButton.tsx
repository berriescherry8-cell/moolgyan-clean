
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This interface is a subset of the actual BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();
  
  // In a preview environment, the 'beforeinstallprompt' event may not fire.
  // We can force the button to be visible for development and styling purposes.
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      // Hide the app-provided install promotion
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // This may happen in the dev preview or unsupported browsers
      toast({
        variant: "destructive",
        title: "Install Not Supported",
        description: "Your browser doesn't support this feature in this context.",
      });
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      toast({ title: "Success", description: "App installed successfully!"});
    } else {
      // User dismissed the prompt, do nothing. The prompt can be shown again later.
    }
    // We've used the prompt, and it can't be used again.
    setDeferredPrompt(null);
  };
  
  // Show button in dev, or if the prompt is available in production
  if (!isDevelopment && !deferredPrompt) {
    return null;
  }

  return (
    <Button onClick={handleInstallClick} variant="outline" size="sm" className="gap-2">
      <DownloadCloud className="h-4 w-4" />
      <span className="hidden sm:inline">Install App</span>
    </Button>
  );
}
