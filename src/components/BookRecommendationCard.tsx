import { motion } from 'framer-motion';
import { X, Sparkles, BookOpen, User, Tag, ExternalLink, Star, BookmarkPlus, Clock, Calendar, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { trackAmazonClick } from '@/services/bookService';
import { useAuth } from '@/contexts/AuthContext';

export interface RecommendedBook {
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
  pageCount?: number;
  publishedDate?: string;
  averageRating?: number;
}

interface BookRecommendationCardProps {
  book: RecommendedBook;
  onLike: (book: RecommendedBook) => void;
  onDislike: (book: RecommendedBook) => void;
  index: number;
}

const getCompatibilityConfig = (score: number) => {
  if (score >= 90) return { 
    gradient: 'from-emerald-500 to-green-600', 
    emoji: '🔥', 
    label: 'Match perfecto',
    bgGlow: 'shadow-emerald-500/20'
  };
  if (score >= 80) return { 
    gradient: 'from-teal-500 to-cyan-600', 
    emoji: '✨', 
    label: 'Excelente match',
    bgGlow: 'shadow-teal-500/20'
  };
  if (score >= 70) return { 
    gradient: 'from-amber-500 to-orange-500', 
    emoji: '👍', 
    label: 'Buen match',
    bgGlow: 'shadow-amber-500/20'
  };
  return { 
    gradient: 'from-orange-500 to-red-500', 
    emoji: '🤔', 
    label: 'Puede interesarte',
    bgGlow: 'shadow-orange-500/20'
  };
};

export default function BookRecommendationCard({ book, onLike, onDislike, index }: BookRecommendationCardProps) {
  const { user } = useAuth();
  const compatConfig = book.compatibilityScore !== undefined 
    ? getCompatibilityConfig(book.compatibilityScore) 
    : null;

  const handleAmazonClick = () => {
    trackAmazonClick(user?.id, book.id, book.title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className={`
        overflow-hidden border border-border/60 bg-card h-full flex flex-col
        hover:shadow-2xl transition-all duration-500 group
        ${compatConfig?.bgGlow || ''}
      `}>
        <CardContent className="p-0 flex flex-col h-full">
          {/* Compatibility Score Header */}
          {compatConfig && book.compatibilityScore !== undefined && (
            <div className={`
              bg-gradient-to-r ${compatConfig.gradient} px-4 py-2.5
              flex items-center justify-between
            `}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{compatConfig.emoji}</span>
                <span className="text-white font-semibold text-sm">
                  {book.compatibilityScore}% compatible
                </span>
              </div>
              <span className="text-white/80 text-xs font-medium">
                {compatConfig.label}
              </span>
            </div>
          )}

          {/* Book Cover & Info */}
          <div className="flex gap-4 p-4">
            {/* Cover */}
            <div className="relative flex-shrink-0">
              <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-[100px] h-[150px] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-[100px] h-[150px] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-amber-600/40" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col">
              <h3 className="font-bold text-foreground text-base leading-tight line-clamp-2 mb-1.5 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {book.title}
              </h3>
              
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{book.author}</span>
              </p>
              
              {/* Categories */}
              {book.categories && book.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {book.categories.slice(0, 2).map((cat, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="text-[10px] px-2 py-0.5 bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                {book.averageRating && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-medium">{book.averageRating.toFixed(1)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Rating promedio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {book.pageCount && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{book.pageCount} págs</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Número de páginas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {book.publishedDate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{book.publishedDate.split('-')[0]}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Año de publicación</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          {book.aiReasoning && (
            <div className="px-4 pb-3">
              <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/40 rounded-xl p-3.5 border border-amber-200/30 dark:border-amber-800/20">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                      ¿Por qué THOTH lo eligió para ti?
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {book.aiReasoning}
                    </p>
                    {book.aiFocusArea && (
                      <div className="flex items-center gap-1 mt-2">
                        <Tag className="w-3 h-3 text-amber-600/60" />
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {book.aiFocusArea}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="px-4 pb-4 flex-1">
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {book.description || 'Sin descripción disponible.'}
            </p>
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 mt-auto space-y-3">
            {/* Amazon Buy Button - Primary CTA */}
            {book.amazonLink && (
              <Button
                asChild
                size="sm"
                className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-5"
              >
                <a
                  href={book.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleAmazonClick}
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar en Amazon
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}

            {/* Secondary Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => onDislike(book)}
                variant="outline"
                size="sm"
                className="flex-1 rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-1.5" />
                Pasar
              </Button>
              <Button
                onClick={() => onLike(book)}
                variant="outline"
                size="sm"
                className="flex-1 rounded-full border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-200"
              >
                <BookmarkPlus className="w-4 h-4 mr-1.5" />
                Guardar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
