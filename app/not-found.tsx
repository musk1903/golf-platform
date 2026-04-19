import { notFound } from 'next/navigation'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h2>
      <p className="text-xl text-gray-600 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  )
}
