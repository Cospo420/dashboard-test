import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Retell AI - Call Center Dashboard',
  description: 'Monitor and analyze your AI call center with Retell',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Phone className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">Retell AI Dashboard</span>
          </div>
          <nav>
            <Link href="/dashboard">
              <Button variant="outline">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AI Call Center Analytics</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor your Retell AI call performance, track customer satisfaction, and gain valuable insights from every conversation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3">Real-time Call Tracking</h2>
              <p className="text-gray-600 mb-4">
                View incoming and outgoing calls in real-time. Monitor call duration, success rates, and conversion metrics as they happen.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Live call monitoring
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Call status tracking
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Performance metrics
                </li>
              </ul>
              <Link href="/dashboard">
                <Button className="w-full">View Call Metrics</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3">Conversation Analytics</h2>
              <p className="text-gray-600 mb-4">
                Analyze conversation content, sentiment, and outcomes. Identify trends and improve your AI call scripts.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Sentiment analysis
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Call transcriptions
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Key insights extraction
                </li>
              </ul>
              <Link href="/dashboard">
                <Button className="w-full">Explore Analytics</Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Retell AI Dashboard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}