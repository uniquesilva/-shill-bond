import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Shill.bond
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Sponsor shillers. Get transparent analytics. Pay on Solana.
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
            <p className="text-gray-300 mb-4">Create and fund campaigns to promote your tokens</p>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Set campaign requirements</li>
              <li>• Monitor shiller performance</li>
              <li>• Transparent analytics</li>
              <li>• Automated payouts</li>
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
            <p className="text-gray-300 mb-4">Complete missions and get paid for your content</p>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Browse available missions</li>
              <li>• Submit proof of work</li>
              <li>• Get paid automatically</li>
              <li>• Build your reputation</li>
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
