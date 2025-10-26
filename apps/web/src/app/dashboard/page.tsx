'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { 
    isAuthenticated, 
    user, 
    loading, 
    twitterUser, 
    walletUser,
    signOutTwitter,
    disconnectWallet
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-xl">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Shill.bond!</h1>
          <p className="text-gray-300">Your {user.role} dashboard</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* User Info Card */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Role:</p>
                <p className="text-white font-semibold capitalize">{user.role}</p>
              </div>
              
              {twitterUser && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">X (Twitter):</p>
                  <p className="text-white">@{user.username || 'Connected'}</p>
                </div>
              )}
              
              {walletUser && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">Wallet Address:</p>
                  <p className="text-white font-mono text-sm">
                    {user.walletAddress?.slice(0, 8)}...{user.walletAddress?.slice(-8)}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Member Since:</p>
                <p className="text-white">{user.createdAt ? user.createdAt.toLocaleDateString() : 'Recently joined'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === 'developer' ? (
                <div className="space-y-3">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Create Campaign
                  </Button>
                  <Button variant="outline" className="w-full border border-white text-white hover:bg-white hover:text-gray-900">
                    View My Campaigns
                  </Button>
                  <Button variant="outline" className="w-full border border-white text-white hover:bg-white hover:text-gray-900">
                    Analytics Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Browse Missions
                  </Button>
                  <Button variant="outline" className="w-full border border-white text-white hover:bg-white hover:text-gray-900">
                    My Submissions
                  </Button>
                  <Button variant="outline" className="w-full border border-white text-white hover:bg-white hover:text-gray-900">
                    Earnings History
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Connection Status */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">X (Twitter):</span>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${twitterUser ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-white">{twitterUser ? 'Connected' : 'Not Connected'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Solana Wallet:</span>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${walletUser ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-white">{walletUser ? 'Connected' : 'Not Connected'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="text-center">
          <div className="space-x-4">
            {twitterUser && (
              <Button
                onClick={signOutTwitter}
                variant="outline"
                className="border border-white text-white hover:bg-white hover:text-gray-900"
              >
                Sign Out of X
              </Button>
            )}
            
            {walletUser && (
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="border border-white text-white hover:bg-white hover:text-gray-900"
              >
                Disconnect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
