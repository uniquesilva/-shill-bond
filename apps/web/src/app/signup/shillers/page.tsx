'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ShillerSignUpPage() {
  const { 
    signInWithTwitter, 
    connectWallet, 
    isAuthenticated, 
    user, 
    loading,
    setUserRole,
    twitterUser,
    walletUser
  } = useAuth();
  
  const [step, setStep] = useState<'auth' | 'role' | 'complete'>('auth');
  const router = useRouter();

  useEffect(() => {
    // Only redirect to dashboard if user is authenticated AND has completed signup (has role)
    if (isAuthenticated && user && user.role) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    // Check if user has connected both Twitter and wallet
    if (twitterUser && walletUser) {
      setStep('role');
    } else if (twitterUser && !walletUser) {
      // User connected Twitter but not wallet yet
      setStep('auth');
    } else if (!twitterUser && walletUser) {
      // User connected wallet but not Twitter yet
      setStep('auth');
    } else {
      // Neither connected
      setStep('auth');
    }
  }, [twitterUser, walletUser]);

  const handleTwitterSignIn = async () => {
    try {
      await signInWithTwitter();
    } catch (error) {
      console.error('Twitter sign-in failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Twitter sign-in failed. Please try again.';
      alert(errorMessage);
    }
  };

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const handleRoleSelection = (role: 'developer' | 'shiller') => {
    setUserRole(role);
    setStep('complete');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join as a Shiller</h1>
          <p className="text-gray-300">Complete missions and get paid for your content</p>
        </div>

        {step === 'auth' && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Step 1: Connect Your Accounts</CardTitle>
                <CardDescription className="text-gray-300">
                  Connect your X account and Solana wallet to start earning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Button
                    onClick={handleTwitterSignIn}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={loading}
                  >
                    {twitterUser ? '✓ Connected to X' : 'Connect X (Twitter)'}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-400"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-transparent px-2 text-gray-300">And connect your wallet</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleWalletConnect}
                    variant="outline"
                    className="w-full border border-white text-white hover:bg-white hover:text-gray-900"
                    disabled={loading}
                  >
                    {walletUser ? '✓ Wallet Connected' : 'Connect Solana Wallet'}
                  </Button>
                </div>
                
                <div className="text-sm text-gray-300 space-y-2">
                  <h4 className="font-semibold text-white">What you'll get:</h4>
                  <ul className="space-y-1">
                    <li>• Browse available missions</li>
                    <li>• Submit proof of work</li>
                    <li>• Get paid automatically</li>
                    <li>• Build your reputation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Why Join as a Shiller?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Earn from Content</h4>
                      <p className="text-gray-300 text-sm">Get paid for creating quality content about tokens and projects</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Transparent Payments</h4>
                      <p className="text-gray-300 text-sm">All payments are on-chain and transparent</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Build Reputation</h4>
                      <p className="text-gray-300 text-sm">Establish your credibility in the crypto community</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Automated Payouts</h4>
                      <p className="text-gray-300 text-sm">Get paid automatically when your work is approved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'role' && (
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Step 2: Confirm Your Role</CardTitle>
              <CardDescription className="text-center text-gray-300">
                You're signing up as a Shiller. This will allow you to complete missions and earn rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <span>✓</span>
                  <span>X Account Connected</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <span>✓</span>
                  <span>Solana Wallet Connected</span>
                </div>
              </div>
              
              <Button
                onClick={() => handleRoleSelection('shiller')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Complete Shiller Sign-Up
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && (
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-green-400">Welcome to Shill.bond!</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Your Shiller account has been created successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-white mb-4">You can now:</p>
                <ul className="text-gray-300 space-y-2">
                  <li>• Browse available missions</li>
                  <li>• Submit proof of work</li>
                  <li>• Get paid automatically</li>
                  <li>• Build your reputation</li>
                </ul>
              </div>
              
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-300 text-sm">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
