import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white">
      <div className="w-28 h-28 bg-gsg-purple rounded-card flex items-center justify-center mb-8">
        <span className="text-5xl font-bold text-white">404</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gsg-black mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        This page isn’t here. Head back to the store or home and we’ll get you sorted.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-gsg-purple hover:bg-gsg-purple-dark text-white px-8 py-3 rounded-pill font-medium transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="border-2 border-gray-300 hover:border-gsg-purple text-gray-700 px-8 py-3 rounded-pill font-medium transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
