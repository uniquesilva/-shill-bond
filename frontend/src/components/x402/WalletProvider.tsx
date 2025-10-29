'use client';

import React from 'react';

// Temporary placeholder for wallet provider
// Will be re-implemented after deployment is working
interface X402WalletProviderProps {
  children: React.ReactNode;
}

export function X402WalletProvider({ children }: X402WalletProviderProps) {
  return <>{children}</>;
}

// Temporary placeholder components
export function WalletDisconnectButton() {
  return <div>Wallet Disconnect (Coming Soon)</div>;
}

export function WalletMultiButton() {
  return <div>Connect Wallet (Coming Soon)</div>;
}
