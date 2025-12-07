import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trackAmazonClick } from '@/services/bookService';
import { useAuth } from '@/contexts/AuthContext';

export interface Book {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating?: number;
  pageCount?: number;
  publishedDate?: string;
  categories?: string[];
  amazonLink?: string;
  aiReasoning?: string;
  aiFocusArea?: string;
}

interface BookCardProps {
  book: Book | null;
  isRevealing: boolean;
}

export default function BookCard({ book, isRevealing }: BookCardProps) {
  const { user, addToToRead } = useAuth();
  
  if (!book) return null;

  const handleAmazonClick = () => {
    trackAmazonClick(user?.id, book.id, book.title);
  };

  const handleAddToToRead = () => {
    try {
      addToToRead({
        id: book.id,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        cover: book.cover,
        description: book.description,
        addedAt: new Date().toISOString(),
        aiReasoning: book.aiReasoning,
        aiFocusArea: book.aiFocusArea
      });
    } catch (error) {
      // Already in list
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden shadow-2xl border-2 border-border bg-card">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="bg-muted flex items-center justify-center p-10 min-h-[320px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/50" />
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              src={book.cover}
              alt={book.title}
              className="w-full max-w-[200px] h-auto shadow-2xl rounded-sm relative z-10 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <div className="p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-foreground mb-3 line-clamp-2 leading-tight">
                {book.title}
              </h3>
              <p className="text-base text-muted-foreground mb-4 font-light">by {book.author}</p>
              <p className="text-sm text-foreground/70 leading-relaxed line-clamp-4 mb-6 flex-1 font-light">
                {book.description}
              </p>
            </motion.div>

            {/* AI Reasoning Section */}
            {book.aiReasoning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Why THOTH chose this
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book.aiReasoning}
                </p>
                {book.aiFocusArea && (
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="secondary" className="text-xs">
                      {book.aiFocusArea}
                    </Badge>
                  </div>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex gap-3"
            >
              <Button
                onClick={handleAddToToRead}
                variant="outline"
                className="flex-1 rounded-full py-6 hover:scale-105 transition-transform duration-300"
                size="lg"
              >
                Add to To Read
              </Button>
              
              {book.amazonLink && (
                <Button
                  asChild
                  className="flex-1 bg-foreground hover:bg-foreground/90 rounded-full py-6 hover:scale-105 transition-transform duration-300"
                  size="lg"
                >
                  <a
                    href={book.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleAmazonClick}
                    className="flex items-center justify-center gap-2"
                  >
                    View on Amazon
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}