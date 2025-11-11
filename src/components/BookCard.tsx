import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  amazonLink?: string;
}

interface BookCardProps {
  book: Book | null;
  isRevealing: boolean;
}

export default function BookCard({ book, isRevealing }: BookCardProps) {
  if (!book) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={book.id}
        initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        exit={{ opacity: 0, rotateY: 15, scale: 0.95 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <Card className="overflow-hidden shadow-lg border border-border bg-card hover:shadow-2xl transition-all duration-500 h-full group">
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
            
            <div className="p-8 flex flex-col flex-1">
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

              {book.amazonLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    asChild
                    className="w-full bg-foreground hover:bg-foreground/90 rounded-full py-6 hover:scale-105 transition-transform duration-300"
                    size="lg"
                  >
                    <a
                      href={book.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View on Amazon
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}