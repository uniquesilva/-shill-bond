'use client';

import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function TestTwitterPage() {
  const { data: session, status } = useSession();

  const handleTwitterSignIn = async () => {
    try {
      console.log('Starting Twitter sign-in...');
      const result = await signIn('twitter', { 
        callbackUrl: '/signup/developers',
        redirect: true 
      });
      console.log('Sign-in result:', result);
    } catch (error) {
      console.error('Twitter sign-in error:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Twitter OAuth Test</h1>
      
      <div className="mb-4">
        <p>Status: {status}</p>
        <p>Session: {session ? 'Authenticated' : 'Not authenticated'}</p>
        {session && (
          <div>
            <p>User: {session.user?.name}</p>
            <p>Email: {session.user?.email}</p>
          </div>
        )}
      </div>

      <button 
        onClick={handleTwitterSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Twitter Sign-In
      </button>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
        <p>Twitter Client ID: {process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID ? 'Set' : 'Not set'}</p>
        <p>Twitter Client Secret: {process.env.TWITTER_CLIENT_SECRET ? 'Set' : 'Not set'}</p>
        <p>NextAuth URL: {process.env.NEXTAUTH_URL || 'Not set'}</p>
      </div>
    </div>
  );
}