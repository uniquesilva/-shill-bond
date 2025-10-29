import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
              Powered by X402 Protocol
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Shill.bond
          </h1>
          <p className="text-xl text-gray-300 mb-2 max-w-2xl mx-auto">
            The Web3 Performance Network
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
            Fully automated on-chain engine that verifies and rewards real engagement. 
            Sponsor shillers, get transparent analytics, and pay on Solana.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup/developers">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
                Sign Up as Developer
              </button>
            </Link>
            <Link href="/signup/shillers">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                Sign Up as Shiller
              </button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">For Developers</h3>
            <p className="text-gray-300 mb-4">Create automated campaigns with X402 Protocol</p>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Set budget and engagement goals</li>
              <li>• Oracle verifies engagement automatically</li>
              <li>• Real-time transparent analytics</li>
              <li>• Instant automated payouts</li>
            </ul>
            <div className="mt-4">
              <Link href="/signup/developers">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Join as Developer
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">For Shillers</h3>
            <p className="text-gray-300 mb-4">Post with campaign hashtags and earn instantly</p>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Browse active campaigns</li>
              <li>• Post with campaign hashtag</li>
              <li>• Engagement verified automatically</li>
              <li>• Instant SOL rewards</li>
            </ul>
            <div className="mt-4">
              <Link href="/signup/shillers">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Join as Shiller
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Transparent</h3>
            <p className="text-gray-300 mb-4">All transactions and metrics are on-chain</p>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• On-chain transactions</li>
              <li>• Public metrics</li>
              <li>• Oracle verification</li>
              <li>• No hidden fees</li>
            </ul>
            <div className="mt-4">
              <Link href="/auth/signin">
                <button className="w-full border border-white text-white hover:bg-white hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-300 mb-8">
            Choose your role and start creating or completing missions today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup/developers">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
                I'm a Developer
              </button>
            </Link>
            <Link href="/signup/shillers">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                I'm a Shiller
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
