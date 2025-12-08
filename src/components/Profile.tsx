import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import BarcodeScanner from '@/components/BarcodeScanner';
import BookCard from '@/components/BookCard';
import BookRecommendationCard, { type RecommendedBook } from '@/components/BookRecommendationCard';
import FeedbackDialog from '@/components/FeedbackDialog';
import ProfileCompletion from '@/components/ProfileCompletion';
import { fetchBookByISBN, getPersonalizedRecommendations } from '@/services/bookService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Info, 
  Sparkles, 
  Library, 
  BookMarked, 
  Settings, 
  BookOpen, 
  Plus, 
  ScanBarcode, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle, 
  Search, 
  X, 
  Loader2,
  ShoppingCart,
  ExternalLink,
  Tablet,
  MessageSquare
} from 'lucide-react';
import LearningProgress from '@/components/LearningProgress';
import { trackAmazonClick } from '@/services/bookService';

const GENRES = [
  'Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy',
  'Thriller', 'Historical', 'Biography', 'Self-Help', 'Business'
];

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

interface BookSearchResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    description?: string;
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updatePreferences, addToHistory, addToLibrary, removeFromLibrary, updateLibraryBook, removeFromToRead, moveToReadFromToRead, likeBook, dislikeBook, addToToRead } = useAuth();
  const { t, getAmazonLink, getKindleLink, language: appLanguage } = useLocalization();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('discover');
  const [books, setBooks] = useState<RecommendedBook[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [editingBook, setEditingBook] = useState<any>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [showFirstTimeHelp, setShowFirstTimeHelp] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.preferences?.genres || []);
  
  // New state for book recommendations
  const [showScanner, setShowScanner] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addMethod, setAddMethod] = useState<'search' | 'isbn' | 'manual'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [language, setLanguage] = useState(user?.preferences?.language || 'en');
  const [readingDuration, setReadingDuration] = useState(user?.preferences?.readingDuration || 'medium');
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  // Update preferences when user changes them
  useEffect(() => {
    if (user) {
      setSelectedGenres(user.preferences?.genres || []);
      setLanguage(user.preferences?.language || 'en');
      setReadingDuration(user.preferences?.readingDuration || 'medium');
    }
  }, [user]);

  // Save preferences whenever they change
  useEffect(() => {
    if (user && (
      JSON.stringify(selectedGenres) !== JSON.stringify(user.preferences?.genres) ||
      language !== user.preferences?.language ||
      readingDuration !== user.preferences?.readingDuration
    )) {
      const timer = setTimeout(() => {
        updatePreferences({
          genres: selectedGenres,
          language,
          readingDuration
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedGenres, language, readingDuration, user, updatePreferences]);

  // Search effect - debounced search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const response = await fetch(
          `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(searchQuery)}&maxResults=8&printType=books`
        );
        const data = await response.json();
        setSearchResults(data.items || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  if (!user) {
    navigate('/login');
    return null;
  }



  // New function to handle book reveal
  const handleReveal = async () => {
    setIsRevealing(true);
    
    try {
      const newBooks = await getPersonalizedRecommendations(user);
      
      const totalInteractions = (user.likedBooks?.length || 0) + (user.dislikedBooks?.length || 0) + (user.library?.length || 0);
      
      setTimeout(() => {
        setBooks(newBooks);
        setIsRevealing(false);
        
        newBooks.forEach(book => {
          addToHistory({
            ...book,
            revealedAt: new Date().toISOString()
          });
        });

        toast({
          title: '¡Libros revelados!',
          description: `${newBooks.length} libros personalizados. ${totalInteractions >= 5 ? 'La IA está aprendiendo de tus gustos.' : 'Guarda o pasa libros para mejorar las recomendaciones.'}`
        });
      }, 800);
    } catch (error) {
      setIsRevealing(false);
      toast({
        title: 'Error',
        description: 'No se pudieron obtener los libros. Intenta de nuevo.',
        variant: 'destructive'
      });
    }
  };

  const handleLikeBook = async (book: RecommendedBook) => {
    // Add to liked books for AI learning
    likeBook({
      ...book,
      likedAt: new Date().toISOString()
    });
    
    // Also add to To Read list
    addToToRead({
      ...book,
      addedAt: new Date().toISOString()
    });
    
    const totalInteractions = (user.likedBooks?.length || 0) + (user.dislikedBooks?.length || 0) + (user.library?.length || 0) + 1;
    
    toast({
      title: '❤️ ¡Libro guardado!',
      description: (
        <div className="space-y-2">
          <p>"{book.title}" agregado a tu lista.</p>
          {totalInteractions === 5 && <p className="text-amber-600 font-medium">🎉 ¡La IA está aprendiendo tus gustos!</p>}
          {totalInteractions === 15 && <p className="text-purple-600 font-medium">🚀 ¡Perfil bien establecido!</p>}
          {totalInteractions === 30 && <p className="text-green-600 font-medium">⭐ ¡Eres un experto! Recomendaciones perfectas.</p>}
          <a 
            href={getAmazonLink(book.isbn, book.title, book.author)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAmazonClick(user?.id, book.id, book.title)}
            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {t('book.buyOn')} →
          </a>
        </div>
      )
    });
    
    // Small delay for animation to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Remove from current display
    setBooks(prev => prev.filter(b => b.id !== book.id));
  };

  const handleDislikeBook = async (book: RecommendedBook) => {
    // Add to disliked books for AI learning
    dislikeBook({
      ...book,
      dislikedAt: new Date().toISOString()
    });
    
    const totalInteractions = (user.likedBooks?.length || 0) + (user.dislikedBooks?.length || 0) + (user.library?.length || 0) + 1;
    
    toast({
      title: '👎 Libro pasado',
      description: totalInteractions >= 5 
        ? 'La IA evitará libros similares en el futuro.' 
        : 'Sigue interactuando para que la IA aprenda tus gustos.'
    });
    
    // Small delay for animation to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Remove from current display
    setBooks(prev => prev.filter(b => b.id !== book.id));
  };

  const handleAddFromSearch = async (book: BookSearchResult) => {
    setIsAddingBook(true);
    try {
      const isbn = book.volumeInfo.industryIdentifiers?.find(
        id => id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier || `google-${book.id}`;

      const bookData = {
        id: book.id,
        isbn,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || 'Unknown Author',
        cover: book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') ||
               book.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:') ||
               'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
        description: book.volumeInfo.description || 'No description available.',
        addedAt: new Date().toISOString(),
        status: 'read' as const
      };

      addToLibrary(bookData);
      toast({
        title: t('toast.bookAdded'),
        description: `${bookData.title}`
      });
      setShowAddDialog(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('toast.errorOccurred'),
        variant: 'destructive'
      });
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleAddByISBN = async () => {
    if (!manualISBN.trim()) {
      toast({
        title: 'ISBN requerido',
        description: 'Por favor ingresa un código ISBN',
        variant: 'destructive'
      });
      return;
    }

    setIsAddingBook(true);
    try {
      const bookData = await fetchBookByISBN(manualISBN);
      addToLibrary({
        ...bookData,
        addedAt: new Date().toISOString(),
        status: 'read'
      });
      toast({
        title: t('toast.bookAdded'),
        description: `${bookData.title}`
      });
      setShowAddDialog(false);
      setManualISBN('');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('toast.errorOccurred'),
        variant: 'destructive'
      });
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleManualAdd = () => {
    if (!manualTitle.trim() || !manualAuthor.trim()) {
      toast({
        title: 'Información faltante',
        description: 'Por favor ingresa título y autor',
        variant: 'destructive'
      });
      return;
    }

    const bookData = {
      id: `manual-${Date.now()}`,
      isbn: `manual-${Date.now()}`,
      title: manualTitle,
      author: manualAuthor,
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
      description: 'Manually added book',
      addedAt: new Date().toISOString(),
      status: 'read' as const
    };

    addToLibrary(bookData);
    toast({
      title: 'Book added!',
      description: `${bookData.title} has been marked as read and will improve your recommendations.`
    });
    setShowAddDialog(false);
    setManualTitle('');
    setManualAuthor('');
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSavePreferences = () => {
    if (selectedGenres.length === 0) {
      toast({
        title: 'Select at least one genre',
        variant: 'destructive'
      });
      return;
    }

    updatePreferences({
      genres: selectedGenres,
      language,
      readingDuration
    });

    toast({
      title: '¡Preferencias actualizadas!',
      description: 'Tus preferencias de lectura han sido guardadas.'
    });
  };

  const handleScanResult = async (isbn: string) => {
    setIsAddingBook(true);
    try {
      const bookData = await fetchBookByISBN(isbn);
      try {
        await addToLibrary({
          ...bookData,
          addedAt: new Date().toISOString(),
          status: 'read'
        });
        toast({
          title: t('toast.bookAdded'),
          description: `${bookData.title}`
        });
      } catch (libraryError) {
        // Book already exists in library
        toast({
          title: t('toast.bookExists'),
          description: `${bookData.title}`,
          variant: 'default'
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('toast.errorOccurred'),
        variant: 'destructive'
      });
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleRemoveBook = (bookId: string) => {
    removeFromLibrary(bookId);
    toast({
      title: 'Book removed',
      description: 'The book has been removed from your library.'
    });
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setEditNotes(book.notes || '');
    setEditRating(book.rating || 0);
  };

  const handleSaveEdit = () => {
    if (editingBook) {
      updateLibraryBook(editingBook.id, {
        notes: editNotes,
        rating: editRating
      });
      toast({
        title: 'Book updated',
        description: 'Changes saved successfully.'
      });
      setEditingBook(null);
    }
  };

  const handleMoveToRead = (bookId: string) => {
    moveToReadFromToRead(bookId);
    toast({
      title: 'Book moved to library',
      description: 'The book has been marked as read.'
    });
  };

  const handleRemoveFromToRead = (bookId: string) => {
    removeFromToRead(bookId);
    toast({
      title: 'Libro eliminado',
      description: 'El libro ha sido eliminado de tu lista.'
    });
  };

  const filteredLibrary = user.library?.filter(book => {
    if (libraryFilter === 'all') return true;
    if (libraryFilter === 'read') return book.status === 'read';
    if (libraryFilter === 'reading') return book.status === 'reading';
    if (libraryFilter === 'toRead') return book.status === 'toRead' || !book.status;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-4 sm:mb-6 md:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">{t('profile.discoverNext')}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">{user.email}</p>
          </div>

          {/* Learning Progress */}
          <LearningProgress />

          {/* Profile Completion */}
          <ProfileCompletion />

          {/* Reveal Books Section */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card via-card to-amber-50/20 dark:to-amber-950/10 mb-6 sm:mb-8 overflow-hidden">
            <CardContent className="py-6 sm:py-10 px-4 sm:px-6">
              {/* First Time User Help */}
              {showFirstTimeHelp && books.length === 0 && !isRevealing && (
                <Alert className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-200/50 dark:border-amber-800/30">
                  <Info className="w-4 h-4 text-amber-600" />
                  <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                    <strong className="block mb-1">¡Bienvenido a THOTH! 👋</strong>
                    Haz clic en el botón para obtener 3 recomendaciones personalizadas basadas en tu perfil.
                    <button 
                      onClick={() => setShowFirstTimeHelp(false)}
                      className="ml-2 underline text-xs opacity-70 hover:opacity-100"
                    >
                      Cerrar
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Reveal Button - Centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {books.length === 0 && !isRevealing && (
                  <>
                    <div className="mb-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-amber-600" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Descubre tu próxima lectura
                      </h2>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Nuestra IA analizará tu perfil para encontrar los libros perfectos para ti
                      </p>
                    </div>
                  </>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleReveal}
                        disabled={isRevealing}
                        size="lg"
                        className={`
                          text-sm sm:text-base px-8 sm:px-12 py-5 sm:py-7 rounded-full shadow-xl hover:shadow-2xl 
                          transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 
                          hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105 
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group
                          ${books.length > 0 ? 'mt-0' : ''}
                        `}
                      >
                        {isRevealing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-5 h-5 mr-2" />
                            </motion.div>
                            Analizando tu perfil...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                            {books.length > 0 ? 'Nuevas Recomendaciones' : 'Descubrir Libros'}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">Obtén 3 libros personalizados basados en tu perfil único</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>

              {/* Display revealed books as 3 cards */}
              {books.length > 0 && !isRevealing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-10"
                >
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-full mb-3">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        Seleccionados para ti
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Tus Recomendaciones
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
                      THOTH ha analizado tu perfil y seleccionado estos libros especialmente para ti. 
                      Guarda los que te interesen para mejorar futuras recomendaciones.
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Al comprar en Amazon, apoyas el desarrollo de THOTH
                    </p>
                  </div>
                  
                  {/* 3 Book Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto px-2 sm:px-0">
                    {books.slice(0, 3).map((book, index) => (
                      <BookRecommendationCard
                        key={book.id}
                        book={book}
                        onLike={handleLikeBook}
                        onDislike={handleDislikeBook}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="library" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="library" className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-[10px] sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400 rounded-lg">
                <Library className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{t('profile.library')}</span>
              </TabsTrigger>
              <TabsTrigger value="toRead" className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-[10px] sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400 rounded-lg">
                <BookMarked className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{t('profile.toRead')}</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-[10px] sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400 rounded-lg">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{t('profile.settings')}</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-[10px] sm:text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400 rounded-lg">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{t('profile.historyTab')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library">
              <Card className="shadow-md border border-border">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">{t('profile.booksRead')}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1">
                        {t('profile.addBooksDesc')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setShowAddDialog(true)} size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-xs sm:text-sm">
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                        {t('profile.add')}
                      </Button>
                      <Button onClick={() => setShowScanner(true)} size="sm" variant="outline" className="rounded-full text-xs sm:text-sm">
                        <ScanBarcode className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                        <span className="hidden sm:inline">{t('profile.scan')}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  {(!user.library || user.library.length === 0) ? (
                    <div className="text-center py-12 sm:py-16 md:py-20">
                      <Library className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground/30 mx-auto mb-3 sm:mb-4" />
                      <p className="text-foreground/80 text-base sm:text-lg mb-2">{t('profile.noBooksYet')}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground px-4">
                        {t('profile.addBooksHelp')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {user.library.map((book, index) => (
                        <motion.div
                          key={`${book.id}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
                        >
                          <div className="bg-muted p-4 sm:p-6 flex items-center justify-center min-h-[180px] sm:min-h-[240px]">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-full max-w-[100px] sm:max-w-[140px] h-auto shadow-lg rounded-sm group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                            <div>
                              <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-1 text-sm sm:text-base">
                                {book.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">by {book.author}</p>
                            </div>
                            
                            {book.rating && (
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < book.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            
                            <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditBook(book)}
                                className="flex-1 rounded-full text-xs sm:text-sm py-1.5 sm:py-2"
                              >
                                <Edit className="w-3 h-3 mr-0.5 sm:mr-1" />
                                <span className="hidden xs:inline">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveBook(book.id)}
                                className="rounded-full px-2 sm:px-3"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="toRead">
              <Card className="shadow-md border border-border">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">{t('profile.readingList')}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t('profile.readingListDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {(!user.toRead || user.toRead.length === 0) ? (
                    <div className="text-center py-10 sm:py-12">
                      <BookMarked className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-2 sm:mb-3" />
                      <p className="text-foreground/80 text-sm sm:text-base mb-1">{t('profile.noReadingList')}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground px-4">
                        {t('profile.saveFromRecs')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {user.toRead.map((book, index) => (
                        <motion.div
                          key={`${book.id}-${index}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden hover:shadow-md transition-all group"
                        >
                          <div className="bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-3 sm:p-4 flex items-center justify-center min-h-[160px] sm:min-h-[200px] relative">
                            {/* Compatibility Score Badge */}
                            {book.compatibilityScore !== undefined && (
                              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10">
                                <div className={`
                                  flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold text-[10px] sm:text-xs shadow-md
                                  ${book.compatibilityScore >= 85 ? 'bg-green-500 text-white' : 
                                    book.compatibilityScore >= 70 ? 'bg-emerald-500 text-white' :
                                    book.compatibilityScore >= 55 ? 'bg-yellow-500 text-white' :
                                    'bg-orange-500 text-white'}
                                `}>
                                  <span className="text-[10px] sm:text-xs">
                                    {book.compatibilityScore >= 85 ? '🔥' : 
                                     book.compatibilityScore >= 70 ? '✨' :
                                     book.compatibilityScore >= 55 ? '👍' : '🤔'}
                                  </span>
                                  <span>{book.compatibilityScore}%</span>
                                </div>
                              </div>
                            )}
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-full max-w-[100px] sm:max-w-[140px] h-auto shadow-lg rounded-sm group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                            <div>
                              <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-1 text-xs sm:text-sm">
                                {book.title}
                              </h3>
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">por {book.author}</p>
                            </div>
                            
                            {book.aiReasoning && (
                              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30 rounded-lg p-1.5 sm:p-2">
                                <p className="text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2">
                                  {book.aiReasoning}
                                </p>
                              </div>
                            )}
                            
                            {/* Amazon Buy Buttons */}
                            <div className="flex gap-1 sm:gap-1.5">
                              <Button
                                asChild
                                size="sm"
                                className="flex-1 rounded-full text-[10px] sm:text-xs h-7 sm:h-9 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md"
                              >
                                <a
                                  href={getAmazonLink(book.isbn, book.title, book.author)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => trackAmazonClick(user?.id, book.id, book.title)}
                                  className="flex items-center justify-center gap-0.5 sm:gap-1"
                                >
                                  <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  <span className="hidden xs:inline">{t('book.buyOn')}</span>
                                  <span className="xs:hidden">Amazon</span>
                                </a>
                              </Button>
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="rounded-full text-[10px] sm:text-xs h-7 sm:h-9 px-2 sm:px-3 border-amber-500/30 text-amber-600"
                              >
                                <a
                                  href={getKindleLink(book.isbn, book.title, book.author)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => trackAmazonClick(user?.id, book.id, book.title)}
                                  className="flex items-center justify-center gap-0.5 sm:gap-1"
                                >
                                  <Tablet className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </a>
                              </Button>
                            </div>
                            
                            <div className="flex gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                              <Button
                                size="sm"
                                onClick={() => handleMoveToRead(book.id)}
                                className="flex-1 rounded-full text-[10px] sm:text-xs h-6 sm:h-8 bg-amber-600 hover:bg-amber-700"
                              >
                                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                                <span className="hidden xs:inline">{t('profile.markRead')}</span>
                                <span className="xs:hidden">✓</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveFromToRead(book.id)}
                                className="rounded-full h-6 sm:h-8 w-6 sm:w-8 p-0"
                              >
                                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="shadow-md border border-border">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl font-bold">{t('profile.readingPrefs')}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t('profile.updatePrefsDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-medium">{t('profile.favoriteGenres')}</Label>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {GENRES.map(genre => (
                        <div key={genre} className="flex items-center space-x-1.5 sm:space-x-2">
                          <Checkbox
                            id={`pref-${genre}`}
                            checked={selectedGenres.includes(genre)}
                            onCheckedChange={() => toggleGenre(genre)}
                          />
                          <label
                            htmlFor={`pref-${genre}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pref-language">Preferred Language</Label>
                    <select
                      id="pref-language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pref-duration">Reading Duration Preference</Label>
                    <select
                      id="pref-duration"
                      value={readingDuration}
                      onChange={(e) => setReadingDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="short">Short (&lt; 200 pages)</option>
                      <option value="medium">Medium (200-400 pages)</option>
                      <option value="long">Long (&gt; 400 pages)</option>
                    </select>
                  </div>

                  <Button onClick={handleSavePreferences} className="w-full">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="shadow-lg border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold">Reading History</CardTitle>
                  <CardDescription className="text-base">
                    Books you've discovered on THOTH
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!user.history || user.history.length === 0) ? (
                    <div className="text-center py-16 md:py-20">
                      <BookOpen className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-foreground/80 text-lg mb-2">No books revealed yet</p>
                      <p className="text-sm text-muted-foreground">
                        Start discovering books to build your history
                      </p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {user.history.map((book, index) => (
                        <motion.div
                          key={`${book.id}-${index}-history`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                        >
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-16 h-24 object-cover rounded shadow"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground line-clamp-2 text-sm mb-1">
                              {book.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2">by {book.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(book.revealedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Feedback Button */}
          <div className="mt-6 sm:mt-8 text-center">
            <Button
              onClick={() => setShowFeedbackDialog(true)}
              variant="outline"
              className="rounded-full border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {t('feedback.title')}
            </Button>
          </div>
        </motion.div>
      </main>

      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanResult}
      />

      <FeedbackDialog
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
      />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold">Add Book You've Read</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Books you add will be used to personalize your recommendations
            </p>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant={addMethod === 'search' ? 'default' : 'outline'}
                onClick={() => setAddMethod('search')}
                className="flex-1 rounded-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                variant={addMethod === 'isbn' ? 'default' : 'outline'}
                onClick={() => setAddMethod('isbn')}
                className="flex-1 rounded-full"
              >
                ISBN
              </Button>
              <Button
                variant={addMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setAddMethod('manual')}
                className="flex-1 rounded-full"
              >
                Manual
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {addMethod === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or author..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 py-6 text-base rounded-xl"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>

                  {isSearching && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                      {searchResults.map((book) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => handleAddFromSearch(book)}
                        >
                          <img
                            src={
                              book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') ||
                              'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&q=80'
                            }
                            alt={book.volumeInfo.title}
                            className="w-12 h-16 object-cover rounded shadow"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1">{book.volumeInfo.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {addMethod === 'isbn' && (
                <motion.div
                  key="isbn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="isbn" className="text-base mb-2 block">ISBN Code</Label>
                    <Input
                      id="isbn"
                      placeholder="Enter ISBN (10 or 13 digits)"
                      value={manualISBN}
                      onChange={(e) => setManualISBN(e.target.value)}
                      className="text-base p-6 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleAddByISBN}
                    disabled={isAddingBook}
                    className="w-full py-6 rounded-full"
                    size="lg"
                  >
                    {isAddingBook ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Book
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {addMethod === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="title" className="text-base mb-2 block">Book Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter book title"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      className="text-base p-6 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author" className="text-base mb-2 block">Author</Label>
                    <Input
                      id="author"
                      placeholder="Enter author name"
                      value={manualAuthor}
                      onChange={(e) => setManualAuthor(e.target.value)}
                      className="text-base p-6 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleManualAdd}
                    className="w-full py-6 rounded-full"
                    size="lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Book</DialogTitle>
          </DialogHeader>
          {editingBook && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-1">{editingBook.title}</h3>
                <p className="text-sm text-muted-foreground">by {editingBook.author}</p>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= editRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Your thoughts about this book..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1 rounded-full">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditingBook(null)} className="rounded-full">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}