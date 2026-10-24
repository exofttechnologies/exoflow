'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, UserRole } from '@/types/database';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  allProfiles: Profile[];
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  switchProfile: (profileId: string) => void;
  logout: () => void;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'exoflow_active_user_id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check if Supabase client is available
    const supabase = createClient();
    if (supabase) {
      setIsSupabaseConnected(true);
    }

    // Load saved user from localStorage
    try {
      const savedUserId = localStorage.getItem(STORAGE_KEY);
      if (savedUserId) {
        const found = INITIAL_PROFILES.find((p) => p.id === savedUserId);
        if (found) {
          setUser(found);
        } else {
          // Default to Alex Vance (Admin) if saved is not found
          setUser(INITIAL_PROFILES[0]);
          localStorage.setItem(STORAGE_KEY, INITIAL_PROFILES[0].id);
        }
      } else {
        // Default to Alex Vance (Admin) for initial ready-to-test workspace
        setUser(INITIAL_PROFILES[0]);
        localStorage.setItem(STORAGE_KEY, INITIAL_PROFILES[0].id);
      }
    } catch {
      setUser(INITIAL_PROFILES[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const supabase = createClient();
    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Find matching profile or default
          const matching = INITIAL_PROFILES.find(
            (p) => p.email.toLowerCase() === email.toLowerCase()
          );
          const finalProfile = matching || {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || 'Exoft Member',
            role: (data.user.user_metadata?.role as UserRole) || 'employee',
            designation: 'Team Member',
            department: 'Operations',
            status: 'active',
            created_at: new Date().toISOString(),
          };
          setUser(finalProfile);
          localStorage.setItem(STORAGE_KEY, finalProfile.id);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.error('Supabase sign-in error:', err);
      }
    }

    // Local authentication & demo matching
    const normalizedEmail = email.trim().toLowerCase();
    const matched = INITIAL_PROFILES.find(
      (p) => p.email.toLowerCase() === normalizedEmail || p.email.split('@')[0] === normalizedEmail.split('@')[0]
    );

    if (matched) {
      setUser(matched);
      localStorage.setItem(STORAGE_KEY, matched.id);
      setIsLoading(false);
      return { success: true };
    }

    // If an unknown email is entered without Supabase, create an employee profile or sign them in
    if (normalizedEmail.includes('@')) {
      const newEmployee: Profile = {
        id: `user-${Date.now()}`,
        email: normalizedEmail,
        full_name: normalizedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        role: normalizedEmail.includes('admin') ? 'admin' : 'employee',
        designation: normalizedEmail.includes('admin') ? 'Operations Director' : 'Software Engineer',
        department: 'Technology',
        status: 'active',
        created_at: new Date().toISOString(),
      };
      setUser(newEmployee);
      localStorage.setItem(STORAGE_KEY, newEmployee.id);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Please enter a valid email address.' };
  };

  const switchProfile = (profileId: string) => {
    const profile = INITIAL_PROFILES.find((p) => p.id === profileId);
    if (profile) {
      setUser(profile);
      localStorage.setItem(STORAGE_KEY, profile.id);
    }
  };

  const logout = () => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
        isLoading,
        allProfiles: INITIAL_PROFILES,
        login,
        switchProfile,
        logout,
        isSupabaseConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
