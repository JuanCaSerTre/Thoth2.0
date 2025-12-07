import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState, useCallback } from 'react';

export interface SwipeableBook {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  categories?: string[];
  amazonLink?: string;
  aiReasoning?: string;
  aiFocusArea?: string;
  compatibilityScore?: number;
}

interface SwipeableBookCardProps {
  book: SwipeableBook;
  onLike: (book: SwipeableBook) => void;
  onDislike: (book: SwipeableBook) => void;
  index: number;
}

export default function SwipeableBookCard({ book, onLike, onDislike, index }: SwipeableBookCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const dislikeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = useCallback(async (event: any, info: PanInfo) => {
    const threshold = 80;
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      setIsExiting(true);
      const direction = offset > 0 || velocity > 500 ? 1 : -1;
      
      await controls.start({
        x: direction * 400,
        opacity: 0,
        transition: { duration: 0.2, ease: "easeOut" }
      });
      
      if (direction > 0) {
        onLike(book);
      } else {
        onDislike(book);
      }
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  }, [book, onLike, onDislike, controls]);

  const handleDislike = useCallback(async () => {
    if (isExiting) return;
    setIsExiting(true);
    await controls.start({
      x: -400,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    });
    onDislike(book);
  }, [book, onDislike, controls, isExiting]);

  const handleLike = useCallback(async () => {
    if (isExiting) return;
    setIsExiting(true);
    await controls.start({
      x: 400,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    });
    onLike(book);
  }, [book, onLike, controls, isExiting]);

  return (
    <motion.div
      style={{
        x,
        rotate,
        zIndex: 1000 - index,
      }}
      animate={controls}
      drag={index === 0 && !isExiting ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      whileInView={{ 
        scale: index === 0 ? 1 : 0.95 - (index * 0.03),
        opacity: index < 3 ? 1 : 0,
        y: index * 8
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden h-full max-w-sm mx-auto relative">
        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-4 left-4 z-20 bg-red-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg"
          style={{ opacity: dislikeOpacity }}
        >
          <div className="flex items-center gap-1.5">
            <X className="w-4 h-4" />
            <span>PASAR</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-4 right-4 z-20 bg-green-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg"
          style={{ opacity: likeOpacity }}
        >
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            <span>GUARDAR</span>
          </div>
        </motion.div>

        {/* Book Cover */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 flex items-center justify-center p-6 min-h-[240px] relative">
          {/* Compatibility Score Badge */}
          {book.compatibilityScore !== undefined && (
            <div className="absolute top-3 left-3 z-10">
              <div className={`
                flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs shadow-md
                ${book.compatibilityScore >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 
                  book.compatibilityScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' :
                  book.compatibilityScore >= 70 ? 'bg-amber-500 text-white' :
                  'bg-orange-500 text-white'}
              `}>
                <span>
                  {book.compatibilityScore >= 90 ? '🔥' : 
                   book.compatibilityScore >= 80 ? '✨' :
                   book.compatibilityScore >= 70 ? '👍' : '🤔'}
                </span>
                <span>{book.compatibilityScore}% match</span>
              </div>
            </div>
          )}
          <img
            src={book.cover}
            alt={book.title}
            className="w-full max-w-[150px] h-auto shadow-xl rounded"
            loading="eager"
          />
        </div>
        
        {/* Book Info */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-[320px]">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2 leading-snug">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground">por {book.author}</p>
          </div>

          <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
            {book.description}
          </p>

          {/* AI Reasoning */}
          {book.aiReasoning && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  ¿Por qué este libro?
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {book.aiReasoning}
              </p>
              {book.aiFocusArea && (
                <Badge variant="secondary" className="text-[10px] mt-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                  {book.aiFocusArea}
                </Badge>
              )}
            </div>
          )}

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 3).map((cat, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5">
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-muted/50 border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDislike}
              disabled={isExiting}
              className="flex-1 rounded-full border-2 border-red-200 hover:bg-red-50 hover:border-red-400 active:scale-95 transition-all h-12"
            >
              <X className="w-5 h-5 mr-1.5 text-red-500" />
              <span className="text-red-600 font-medium">Pasar</span>
            </Button>

            <Button
              size="lg"
              onClick={handleLike}
              disabled={isExiting}
              className="flex-1 rounded-full bg-green-600 hover:bg-green-700 active:scale-95 transition-all h-12"
            >
              <Heart className="w-5 h-5 mr-1.5" />
              <span className="font-medium">Guardar</span>
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            ← Desliza para pasar • Desliza para guardar →
          </p>
        </div>
      </div>
    </motion.div>
  );
}