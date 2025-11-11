import { motion } from 'framer-motion';
import { BookOpen, Brain, Heart, Sparkles } from 'lucide-react';
import Navigation from './Navigation';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">
              You don't know what to read…
            </h1>
            <p className="text-3xl md:text-4xl font-serif text-gray-600">
              but you don't need to.
            </p>
          </div>

          {/* Philosophy */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed">
              In a world overflowing with choices, decision fatigue has become our constant companion. 
              THOTH exists to eliminate that burden when it comes to your next read.
            </p>
            
            <p className="text-xl text-gray-700 leading-relaxed mt-6">
              Named after the Egyptian god of wisdom and knowledge, THOTH is your personal literary guide. 
              We believe that the perfect book finds you when you're ready for it—not when you're 
              endlessly scrolling through lists and reviews.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Intelligent Recommendations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our algorithm learns from your reading preferences, mood, and history to suggest 
                books that resonate with your current state of mind.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Serendipitous Discovery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sometimes the best books are the ones you never knew you needed. We balance 
                personalization with delightful surprises.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Your Personal Library
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track what you've read, scan books with your camera, and let your reading 
                history shape future recommendations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Thoughtfully Curated
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every recommendation is carefully selected to match your taste, ensuring 
                quality over quantity in your reading journey.
              </p>
            </motion.div>
          </div>

          {/* How It Works */}
          <div className="mt-20 space-y-8">
            <h2 className="text-4xl font-serif font-bold text-gray-900 text-center">
              How It Works
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <p>
                  <strong>Create your profile:</strong> Answer five simple questions about your 
                  reading preferences, habits, and favorite books.
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <p>
                  <strong>Click "Reveal":</strong> Our algorithm analyzes your profile and 
                  presents three personalized book recommendations.
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <p>
                  <strong>Build your library:</strong> Add books you've read by searching or 
                  scanning their ISBN barcode to refine future recommendations.
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <p>
                  <strong>Discover and enjoy:</strong> Purchase recommended books through our 
                  Amazon affiliate links and start your next reading adventure.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-16 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 THOTH · Built with thought
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
