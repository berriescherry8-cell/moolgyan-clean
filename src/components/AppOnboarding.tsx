'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { Sparkles, Languages, ArrowRight, Menu, MousePointer2, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Specific versioned key to ensure it only shows once even after code updates
const ONBOARDING_KEY = 'mool_gyan_onboarding_final_v5';

export default function AppOnboarding() {
  const { t, locale, setLocale } = useLocale();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeen = localStorage.getItem(ONBOARDING_KEY);
      if (!hasSeen) {
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    setIsOpen(false);
  };

  const steps = [
    {
      title: t.onboarding_welcome_title || 'Welcome to Mool Gyan',
      description: t.onboarding_welcome_desc || 'Embark on a spiritual journey of self-realization and true knowledge.',
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      image: "https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-git/12bf4df5ce312f2559ee02268c32feca19ab89e4/app%20logo%20and%20screenshot/WhatsApp_Image_2025-12-30_at_11.37.03_PM-removebg-preview.png",
      target: null,
      showLangSwitch: true,
    },
    {
      title: t.onboarding_lang_title || 'Choose Your Language',
      description: t.onboarding_lang_desc || 'Switch between Hindi and English at any time using this button.',
      icon: <Languages className="h-12 w-12 text-primary" />,
      target: 'top-right'
    },
    {
      title: t.onboarding_nav_title || 'Explore Features',
      description: t.onboarding_nav_desc || 'Use the menu to find Satsang videos, books, and galleries.',
      icon: <Menu className="h-12 w-12 text-primary" />,
      target: isMobile ? 'top-right' : 'top-left'
    }
  ];

  const currentStepData = steps[step - 1];

  if (!isOpen) return null;

  return (
    <>
      {currentStepData.target && (
        <div className="fixed inset-0 z-[150] pointer-events-none">
          <div className={cn(
            "absolute transition-all duration-1000 ease-in-out",
            currentStepData.target === 'top-left' ? "top-4 left-4" : "top-4 right-4"
          )}>
            <div className="relative">
              <div className="absolute inset-[-20px] bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
              <MousePointer2 className={cn(
                "h-8 w-8 text-primary animate-pointing-hand drop-shadow-[0_0_15px_rgba(234,179,8,1)]",
                currentStepData.target === 'top-left' ? "rotate-[225deg]" : "rotate-[-45deg]"
              )} />
            </div>
          </div>
          <div className={cn(
            "absolute w-12 h-12 border-2 border-primary rounded-2xl animate-pulse-glow",
            currentStepData.target === 'top-left' ? "top-3 left-3" : "top-3 right-3"
          )}></div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
        <DialogContent className="sm:max-w-lg bg-zinc-950/95 backdrop-blur-[40px] border-white/5 text-white overflow-hidden p-0 gap-0 z-[160] shadow-[0_0_80px_rgba(0,0,0,0.9)] rounded-[3rem] [&>button]:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleFinish}
            className="absolute right-6 top-6 z-50 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="p-12 flex flex-col items-center text-center space-y-10">
            <div className="relative group">
              <div className="absolute inset-[-30px] bg-primary/10 blur-[50px] rounded-full animate-heartbeat"></div>
              {currentStepData.image ? (
                  <div className="relative w-32 h-32 transform transition-all duration-1000 group-hover:scale-110">
                      <Image src={currentStepData.image} alt="Branding" fill className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" priority />
                  </div>
              ) : (
                  <div className="relative p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl transition-transform duration-700 hover:rotate-6">
                      {currentStepData.icon}
                  </div>
              )}
            </div>
            
            <div className="space-y-6">
              {currentStepData.showLangSwitch && (
                <div className="flex justify-center">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
                        className="h-10 px-6 bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/40 text-white/90 rounded-full flex items-center gap-3 transition-all hover:scale-105 shadow-xl"
                    >
                        <Languages className="h-4 w-4 text-primary" />
                        {locale === 'en' ? 'हिन्दी में देखें' : 'Switch to English'}
                    </Button>
                </div>
              )}

              <div className="animate-fade-in-up">
                <DialogTitle className="text-4xl md:text-5xl font-headline font-bold text-gold-foil">
                  {currentStepData.title}
                </DialogTitle>
                <DialogDescription className="text-white/70 text-xl leading-relaxed max-w-sm mx-auto mt-4 font-medium">
                  {currentStepData.description}
                </DialogDescription>
              </div>
            </div>

            <div className="flex gap-3">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-2 rounded-full transition-all duration-1000",
                    step === i + 1 ? 'w-12 bg-primary shadow-[0_0_20px_rgba(234,179,8,0.8)]' : 'w-2.5 bg-white/10'
                  )} 
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between sm:justify-between items-center w-full px-8 py-8 bg-black/40 border-t border-white/5 backdrop-blur-xl">
            <Button 
              variant="ghost" 
              onClick={handleFinish} 
              className="text-white/40 hover:text-white hover:bg-transparent px-0 h-auto py-2 text-base font-bold tracking-widest uppercase"
            >
              {t.onboarding_skip || 'Skip'}
            </Button>
            
            <Button 
              onClick={() => step < steps.length ? setStep(step + 1) : handleFinish()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-14 rounded-full font-black text-lg shadow-[0_10px_30px_rgba(234,179,8,0.3)] transition-all hover:scale-105 active:scale-95 group"
            >
              {step === steps.length ? (
                  t.onboarding_finish || 'Begin Journey'
              ) : (
                  <span className="flex items-center gap-3">
                      {t.onboarding_next || 'Next'} <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}