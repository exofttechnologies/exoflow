'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Shield, User } from 'lucide-react';
import { ExoftLogo } from '@/components/brand/logo';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, allProfiles } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('••••••••');
    setIsLoading(true);
    const result = await login(demoEmail);
    setIsLoading(false);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Decorative Soft Geometric Curves in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left subtle shape */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-neutral-200/40 blur-3xl" />
        
        {/* Bottom-right smooth sweeping curves matching the design */}
        <svg
          className="absolute -bottom-24 -right-24 w-[700px] h-[700px] text-neutral-200/50"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M200 600C200 379.086 379.086 200 600 200V600H200Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <path
            d="M320 600C320 445.36 445.36 320 600 320V600H320Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <path
            d="M440 600C440 511.634 511.634 440 600 440V600H440Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
        </svg>

        {/* Soft left accent curve */}
        <svg
          className="absolute -left-20 top-1/4 w-80 h-96 text-neutral-200/30"
          viewBox="0 0 300 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50 0C80 80 80 320 -50 400"
            stroke="currentColor"
            strokeWidth="80"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-[430px] bg-white rounded-[24px] sm:rounded-[28px] border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 z-10 transition-all">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <ExoftLogo size="md" />
        </div>

        {/* Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-[32px] font-bold text-neutral-900 tracking-tight leading-tight">
            Welcome back
          </h1>
          <p className="text-sm sm:text-[15px] text-neutral-400 font-normal mt-1.5">
            Sign in to your workspace
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
              Email address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                <Mail className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@exoft.com"
                required
                className="w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                <Lock className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-11 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={1.75} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900"
              />
              <span className="text-sm text-neutral-600 font-normal">
                Remember me
              </span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('For demo purposes: sign in using any team account below or type any email.');
              }}
              className="text-sm font-semibold text-neutral-900 hover:underline transition-all"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            id="signin-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-neutral-950 hover:bg-neutral-900 active:scale-[0.99] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer disabled:opacity-70 group"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
            {!isLoading && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="w-full border-t border-neutral-200"></div>
          <span className="absolute bg-white px-3 text-xs font-medium text-neutral-400">
            or
          </span>
        </div>

        {/* Quick Demo Access: 1-Click Role Login */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@exoft.tech')}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-all cursor-pointer group"
            >
              <Shield className="w-3.5 h-3.5 text-neutral-700" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('liam@exoft.tech')}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-all cursor-pointer group"
            >
              <User className="w-3.5 h-3.5 text-neutral-700" />
              <span>Employee Demo</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="w-full text-center text-xs text-neutral-500 hover:text-neutral-900 transition-colors py-1 cursor-pointer font-medium"
          >
            {showDemoAccounts ? 'Hide team accounts ↑' : 'Show all 7 team accounts ↓'}
          </button>

          {/* Expandable Team Accounts List */}
          {showDemoAccounts && (
            <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2 max-h-56 overflow-y-auto">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-1">
                Select any team member to sign in:
              </div>
              {allProfiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickLogin(p.email)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-200/60 hover:border-neutral-900 text-left transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.avatar_url}
                      alt={p.full_name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {p.full_name}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {p.designation}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.role === 'admin'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {p.role === 'admin' ? 'Admin' : 'Employee'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
