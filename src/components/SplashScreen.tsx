'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1500); // Reduced from 2800ms to 1500ms to fix stuck loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Main splash image – larger and more prominent */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 mb-4">
        <img
<<<<<<< HEAD
          src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/splash.png"
=======
          src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/general-gallery/1775567829626-splash.png"
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
          alt="Mool Gyan Splash"
          className="w-full h-full object-contain drop-shadow-2xl animate-pulse-slow"
        />
      </div>

      {/* App name - smaller and less prominent */}
      <h1 className="text-2xl sm:text-3xl font-semibold font-headline text-primary mb-2 tracking-wide animate-fade-in">
        Mool Gyan
      </h1>

      {/* Loading indicator */}
      <div className="flex items-center gap-3 mb-6">
        <Loader2 className="h-7 w-7 animate-spin text-primary/80" />
        <p className="text-lg sm:text-xl text-white/80 font-medium">
          Loading spiritual wisdom...
        </p>
      </div>

      {/* Signature mantra */}
      <p className="text-base sm:text-lg text-primary/90 font-medium tracking-wider animate-fade-in-delay">
        Sahib Bandagi Satnam
      </p>

      {/* Optional subtle footer text */}
      <p className="absolute bottom-8 text-xs text-white/40">
        © Mool Gyan App
      </p>
    </div>
  );
}
