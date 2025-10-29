'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  walletAddress?: string;
  role?: 'developer' | 'shiller';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  twitterSignIn: () => void;
  signInWithTwitter: () => void;
  connectWallet: () => void;
  signUp: (role: 'developer' | 'shiller') => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  twitterUser: any;
  walletUser: string | null;
  setUserRole: (role: 'developer' | 'shiller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Update user when session changes
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id || session.user.email || 'unknown',
        name: session.user.name || undefined,
        email: session.user.email || undefined,
        image: session.user.image || undefined,
        walletAddress: user?.walletAddress, // Preserve existing wallet address
        role: user?.role, // Preserve existing role
      });
    } else {
      setUser(null);
    }
    setLoading(status === 'loading');
  }, [session, status]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shill_bond_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shill_bond_user');
    }
  }, [user]);

  const twitterSignIn = () => {
    signIn('twitter');
  };

  const signInWithTwitter = async () => {
    try {
      await signIn('twitter');
    } catch (error) {
      console.error('Twitter sign-in failed:', error);
      throw error; // Re-throw to show error in UI
    }
  };

  const connectWallet = () => {
    // For now, simulate wallet connection
    const mockWalletAddress = `wallet_${Date.now()}`;
    setUser(prev => ({
      ...prev,
      id: prev?.id || `user-${Date.now()}`,
      walletAddress: mockWalletAddress,
    }));
  };

  const signUp = async (role: 'developer' | 'shiller') => {
    if (user && user.name && user.walletAddress) {
      setUser(prev => ({ ...prev, role }));
      router.push('/dashboard');
    } else {
      console.error('Cannot sign up: Twitter or Wallet not connected.');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('shill_bond_user');
    signOut();
    router.push('/');
  };


  const setUserRole = (role: 'developer' | 'shiller') => {
    setUser(prev => ({ ...prev, role }));
  };


  const value = {
    user,
    loading,
    twitterSignIn,
    signInWithTwitter,
    connectWallet,
    signUp,
    signOut: handleSignOut,
    isAuthenticated: !!user,
    twitterUser: user || null,
    walletUser: user?.walletAddress || null,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
