'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/adminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Mail, Lock, Eye, EyeOff, Fingerprint, Zap, Brain, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import confetti from 'canvas-confetti';

const ADMIN_ACCOUNTS = [
  { email: 'sharmadevendra715@gmail.com', label: 'Devendra Sharma' },
  { email: 'kpdeora1986@gmail.com', label: 'Kapil Deora' },
  { email: 'berriescherry8@gmail.com', label: 'Sunita Kapil' },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, checkSession, isAuthenticated, isLoading, logout } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkSession();
    generateCaptcha();
    checkBiometric();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      celebrateLogin();
      router.replace('/admin');
    }
  }, [isAuthenticated]);

  const celebrateLogin = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setCaptchaValue('');
  };

  const checkBiometric = async () => {
    if ('credentials' in navigator) setBiometricAvailable(true);
  };

  const handleQuickLogin = (email: string) => {
    setSelectedAccount(email);
    setEmail(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaValue !== captchaQuestion.answer.toString()) {
      setError('Captcha incorrect');
      generateCaptcha();
      return;
    }
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setLocalLoading(true);
    setError('');
    const success = await login(email, password);
    setLocalLoading(false);
    if (!success) setError('Login failed. Check credentials and rate limit.');
  };

  const handleBiometricLogin = async () => {
    // Simulate biometric (WebAuthn placeholder)
    setError('Biometric login coming soon (device fingerprint)');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
          <p className="text-white text-xl">Quantum Auth Check...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900/30 to-pink-900 relative overflow-hidden">
      {/* Animated particles background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Main card with glassmorphism + neon glow */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-3xl border-white/30 shadow-2xl border border-white/20">
          <CardHeader className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
              <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">
                Quantum Admin Portal
              </CardTitle>
            </div>
            <CardDescription className="text-white/80 text-lg">
              Futuristic secure access to Mool Gyan control matrix
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Biometric button */}
            {biometricAvailable && (
              <Button onClick={handleBiometricLogin} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg">
                <Fingerprint className="mr-2 h-5 w-5" />
                Biometric Login (Beta)
              </Button>
            )}

            <div className="text-center text-white/70 text-sm uppercase tracking-wider font-bold mb-6">or</div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-white font-semibold text-lg">Neural ID</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Select value={selectedAccount} onValueChange={handleQuickLogin}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white placeholder-white/70">
                      <SelectValue placeholder="Quick neural sync..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/20">
                      {ADMIN_ACCOUNTS.map((account) => (
                        <SelectItem key={account.email} value={account.email} className="text-white">
                          {account.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                    <Input
                      type="email"
                      placeholder="Enter quantum ID..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/70 h-14 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-white font-semibold text-lg">Access Code</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter secure code..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/70 h-14 rounded-2xl focus:ring-4 focus:ring-purple-500/30 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 transition-all"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Futuristic Captcha */}
              <div className="space-y-3 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                <Label className="text-white/90 font-mono text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Captcha: {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    className="bg-white/10 border-white/30 text-white font-mono text-lg pl-12 h-12 rounded-xl"
                    placeholder="?"
                  />
                  <RotateCcw 
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 hover:text-white cursor-pointer transition-colors"
                    onClick={generateCaptcha}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
                  <Zap className="h-4 w-4" />
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                disabled={localLoading || isLoading}
                className="w-full h-16 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 focus:ring-4 focus:ring-white/20"
              >
                {localLoading ? (
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                ) : (
                  <Shield className="mr-3 h-6 w-6" />
                )}
                Enter Quantum Portal
              </Button>
            </form>

            <div className="text-center pt-8 opacity-75">
              <p className="text-white/60 text-sm">Protected by quantum encryption & AI sentinel</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
