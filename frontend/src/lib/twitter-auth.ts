// Minimal Twitter OAuth implementation
export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

export class TwitterAuth {
  // Mock sign-in that simulates real OAuth flow
  async signIn(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Twitter auth can only be used on the client side');
    }

    // Simulate OAuth flow with a delay
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // Simulate occasional failures for testing (reduced rate for better UX)
          if (Math.random() < 0.1) {
            throw new Error('OAuth authentication failed. Please check your Twitter app configuration.');
          }

          // Create mock user data
          const mockUser: TwitterUser = {
            id: '123456789',
            username: 'testuser',
            name: 'Test User',
            profile_image_url: 'https://via.placeholder.com/150/1DA1F2/FFFFFF?text=TW'
          };

          // Store user data in localStorage
          localStorage.setItem('twitter_user', JSON.stringify(mockUser));
          
          // Trigger a custom event to notify the app
          window.dispatchEvent(new CustomEvent('twitterAuthSuccess', { 
            detail: mockUser 
          }));

          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000); // 1 second delay to simulate real OAuth
    });
  }
}

export const twitterAuth = new TwitterAuth();
