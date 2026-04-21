<<<<<<< HEAD
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
=======
"use client";

import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, Eye, EyeOff, AlertCircle, Lock, Mail, User, CheckCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Check for recovery token in URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      setIsResetMode(true);
      setResetMessage('Please set your new password below.');
    }
  }, []);

  // Check lock status
  useEffect(() => {
    const lockUntil = localStorage.getItem('admin_lock_until');
    if (lockUntil) {
      const lockTime = parseInt(lockUntil);
      const now = Date.now();
      
      if (now < lockTime) {
        setIsLocked(true);
        setLockTimeRemaining(Math.ceil((lockTime - now) / 1000 / 60));
        
        const interval = setInterval(() => {
          const remaining = Math.ceil((lockTime - Date.now()) / 1000 / 60);
          if (remaining <= 0) {
            setIsLocked(false);
            setLockTimeRemaining(0);
            localStorage.removeItem('admin_lock_until');
            clearInterval(interval);
          } else {
            setLockTimeRemaining(remaining);
          }
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        localStorage.removeItem('admin_lock_until');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setErrorMessage('Account temporarily locked. Please try again later.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const supabase = createClient();
      
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      // Enhanced authentication with admin verification
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle login attempts and lock mechanism
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        
        if (attempts >= 5) {
          const lockUntil = Date.now() + (30 * 60 * 1000); // 30 minutes
          localStorage.setItem('admin_lock_until', lockUntil.toString());
          setIsLocked(true);
          setErrorMessage('Too many failed attempts. Account locked for 30 minutes.');
        } else {
          setErrorMessage(`Invalid credentials. ${5 - attempts} attempts remaining.`);
        }
        return;
      }

      if (!data.user) {
        throw new Error('Authentication failed - no user data returned');
      }

      // Verify admin status with enhanced security
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_active, locked_until, login_attempts')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error('Profile verification failed');
      }

      // Check account status
      if (!profile.is_active) {
        await supabase.auth.signOut();
        throw new Error('Account is deactivated');
      }

      if (profile.locked_until && new Date(profile.locked_until) > new Date()) {
        await supabase.auth.signOut();
        throw new Error('Account is temporarily locked');
      }

      if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      // Log successful login
      await supabase
        .from('admin_activity_log')
        .insert({
          user_id: data.user.id,
          action: 'LOGIN_SUCCESS',
          details: { email: data.user.email, timestamp: new Date().toISOString() }
        });

      // Reset login attempts
      setLoginAttempts(0);
      localStorage.removeItem('admin_lock_until');
      
      // Set secure session
      localStorage.setItem('moolgyan_admin', data.user.email);
      localStorage.setItem('moolgyan_admin_session', Date.now().toString());
      
      setSuccessMessage('Login successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
      
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const supabase = createClient();
      
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      // Get the recovery token from URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage('Password reset successful! You can now login with your new password.');
      
      // Clear the hash and redirect to login
      setTimeout(() => {
        window.location.hash = '';
        setIsResetMode(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
      
    } catch (error: any) {
      setErrorMessage(error.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address first');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const supabase = createClient();
      
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage('Password reset link sent! Check your email inbox.');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Security Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure Admin Access</span>
          </div>
        </div>

        <Card className="w-full bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              {isResetMode ? 'Reset Password' : 'Admin Portal'}
            </CardTitle>
            <p className="text-gray-300 text-sm mt-2">
              {isResetMode ? 'Create your new secure password' : 'Enter your admin credentials'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}
            
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Lock Warning */}
            {isLocked && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5" />
                  <span className="font-semibold">Account Locked</span>
                </div>
                <p className="text-sm">
                  Too many failed login attempts. Please try again in {lockTimeRemaining} minutes.
                </p>
              </div>
            )}

            {isResetMode ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10" 
                  onClick={() => {
                    setIsResetMode(false);
                    window.location.hash = '';
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Back to Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3" 
                  disabled={loading || isLocked}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10" 
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Forgot Password?'}
                </Button>
              </form>
            )}

            {/* Security Features */}
            <div className="pt-4 border-t border-white/10">
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Automatic session timeout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Failed login protection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>For security assistance, contact system administrator</p>
        </div>
      </div>
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
    </div>
  );
}
