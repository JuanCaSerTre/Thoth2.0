import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRandomBooks } from '@/services/bookService';
import Navigation from './Navigation';
import BookCard from './BookCard';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Link } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  amazonLink?: string;
}

export default function Home() {
  const { user, addToHistory } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleReveal = async () => {
    setIsRevealing(true);
    
    try {
      const newBooks = await fetchRandomBooks(user?.preferences, user?.library);
      
      setTimeout(() => {
        setBooks(newBooks);
        setIsRevealing(false);
        
        if (user) {
          newBooks.forEach(book => {
            addToHistory({
              ...book,
              revealedAt: new Date().toISOString()
            });
          });
        }
      }, 800);
    } catch (error) {
      setIsRevealing(false);
      toast({
        title: 'Error',
        description: 'Failed to fetch books. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-8xl lg:text-9xl font-bold text-foreground mb-8 tracking-tight"
          >
            THOTH
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground/80 max-w-4xl mx-auto mb-6 leading-tight text-balance"
          >
            You don't know what to read…
            <br />
            <span className="font-normal">but you don't need to.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-16 font-light leading-relaxed"
          >
            One click reveals three personalized book recommendations,
            tailored to your taste and ready to captivate your imagination.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              onClick={handleReveal}
              disabled={isRevealing || (!user && books.length > 0)}
              size="lg"
              className="text-lg px-14 py-7 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 bg-foreground hover:bg-foreground/90 hover:scale-105 font-medium"
            >
              {isRevealing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Revealing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Reveal My Next Books
                </>
              )}
            </Button>
            
            {!user && (
              <p className="text-sm text-muted-foreground mt-6 font-light">
                <Link to="/register" className="underline hover:text-foreground transition-colors decoration-accent">
                  Create an account
                </Link>
                {' '}for personalized recommendations
              </p>
            )}
          </motion.div>
        </div>

        {books.length > 0 && !isRevealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12">
              Your Recommendations
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <BookCard book={book} isRevealing={false} />
                </motion.div>
              ))}
            </div>
            
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center mt-16 p-10 bg-card rounded-3xl shadow-sm border border-border"
              >
                <p className="text-foreground/80 mb-6 text-xl font-light">
                  Want personalized recommendations and to save your discoveries?
                </p>
                <Link to="/register">
                  <Button size="lg" className="px-10 py-6 text-base rounded-full hover:scale-105 transition-transform">
                    Create an Account
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
      
      <footer className="text-center py-10 text-muted-foreground text-sm border-t border-border mt-32 font-light">
        © 2025 Thoth · Built with thought.
      </footer>
    </div>
  );
}