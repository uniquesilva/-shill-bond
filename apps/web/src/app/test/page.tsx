export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Shill.bond Test Page</h1>
        <p className="text-gray-300 mb-8">This page works without NextAuth</p>
        <div className="space-y-4">
          <a href="/" className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Go to Homepage
          </a>
          <a href="/signup/developers" className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
            Go to Developer Signup
          </a>
          <a href="/signup/shillers" className="block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
            Go to Shiller Signup
          </a>
        </div>
      </div>
    </div>
  );
}
