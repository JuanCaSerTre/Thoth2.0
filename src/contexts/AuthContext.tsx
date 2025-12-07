import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type LibraryRow = Database['public']['Tables']['library']['Row'];
type ToReadRow = Database['public']['Tables']['to_read']['Row'];
type LikedBooksRow = Database['public']['Tables']['liked_books']['Row'];
type DislikedBooksRow = Database['public']['Tables']['disliked_books']['Row'];
type BookHistoryRow = Database['public']['Tables']['book_history']['Row'];

interface User {
  id: string;
  email: string;
  preferences: {
    genres: string[];
    language: string;
    readingDuration?: string;
    emotion?: string;
    favoriteBooks?: string;
    storytellingStyles?: string[];
    themes?: string[];
    discoveryMethod?: string;
    endingPreference?: string;
    nextBookGoal?: string;
    emotions?: string[];
    // New fields for improved onboarding
    readingGoals?: string[];
    readerType?: string;
    storyVibes?: string[];
    psychologicalProfile?: Record<string, string>;
    onboardingCompleted?: boolean;
  };
  history: Book[];
  library: LibraryBook[];
  toRead: ToReadBook[];
  likedBooks: LikedBook[];
  dislikedBooks: DislikedBook[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  revealedAt: string;
}

interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  addedAt: string;
  status: 'read' | 'reading' | 'toRead' | 'to-read';
  pages?: number;
  currentPage?: number;
  rating?: number;
  notes?: string;
}

interface ToReadBook {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  addedAt: string;
  aiReasoning?: string;
  aiFocusArea?: string;
  compatibilityScore?: number;
}

interface LikedBook {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  categories?: string[];
  likedAt: string;
  aiReasoning?: string;
  aiFocusArea?: string;
}

interface DislikedBook {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  categories?: string[];
  dislikedAt: string;
  aiReasoning?: string;
  aiFocusArea?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, preferences: User['preferences']) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  addToHistory: (book: Book) => void;
  addToLibrary: (book: LibraryBook) => void;
  removeFromLibrary: (bookId: string) => void;
  updateLibraryBook: (bookId: string, updates: Partial<LibraryBook>) => void;
  addToToRead: (book: ToReadBook) => void;
  removeFromToRead: (bookId: string) => void;
  moveToReadFromToRead: (bookId: string) => void;
  likeBook: (book: LikedBook) => void;
  dislikeBook: (book: DislikedBook) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Get user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get book history
      const { data: history } = await supabase
        .from('book_history')
        .select('*')
        .eq('user_id', userId)
        .order('revealed_at', { ascending: false }) as { data: BookHistoryRow[] | null };

      // Get library
      const { data: library } = await supabase
        .from('library')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false }) as { data: LibraryRow[] | null };

      // Get to_read
      const { data: toRead } = await supabase
        .from('to_read')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false }) as { data: ToReadRow[] | null };

      // Get liked_books
      const { data: likedBooks } = await supabase
        .from('liked_books')
        .select('*')
        .eq('user_id', userId)
        .order('liked_at', { ascending: false }) as { data: LikedBooksRow[] | null };

      // Get disliked_books
      const { data: dislikedBooks } = await supabase
        .from('disliked_books')
        .select('*')
        .eq('user_id', userId)
        .order('disliked_at', { ascending: false }) as { data: DislikedBooksRow[] | null };

      // Get user profile
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          preferences: preferences ? {
            genres: preferences.genres || [],
            language: preferences.language || 'en',
            readingDuration: preferences.reading_duration || 'medium',
            onboardingCompleted: true
          } : {
            genres: [],
            language: 'en',
            readingDuration: 'medium',
            onboardingCompleted: false
          },
          history: history?.map(h => ({
            id: h.id,
            title: h.title,
            author: h.authors?.[0] || 'Unknown',
            cover: h.cover_url || '',
            description: h.description || '',
            revealedAt: h.revealed_at
          })) || [],
          library: library?.map(l => ({
            id: l.id,
            isbn: l.isbn,
            title: l.title,
            author: l.author,
            cover: l.cover || '',
            description: '',
            pages: l.pages || 0,
            status: l.status as 'to-read' | 'reading' | 'read',
            currentPage: l.current_page,
            rating: l.rating || undefined,
            notes: l.notes || undefined,
            addedAt: l.added_at
          })) || [],
          toRead: toRead?.map(t => ({
            id: t.id,
            isbn: t.isbn || undefined,
            title: t.title,
            author: t.author,
            cover: t.cover || '',
            description: '',
            addedAt: t.added_at
          })) || [],
          likedBooks: likedBooks?.map(l => ({
            id: l.id,
            title: l.title,
            author: l.author,
            cover: l.cover || '',
            description: '',
            likedAt: l.liked_at
          })) || [],
          dislikedBooks: dislikedBooks?.map(d => ({
            id: d.id,
            title: d.title,
            author: d.author,
            cover: d.cover || '',
            description: '',
            dislikedAt: d.disliked_at
          })) || []
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    await loadUserData(data.user.id);
    return user!;
  };

  const register = async (email: string, password: string, preferences: User['preferences']) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed');

    // Save preferences
    await supabase.from('user_preferences').insert({
      user_id: data.user.id,
      genres: preferences.genres || [],
      language: preferences.language || 'en',
      reading_duration: preferences.readingDuration || 'medium'
    });

    await loadUserData(data.user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    const mergedPreferences = {
      ...user.preferences,
      ...preferences
    };

    await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        genres: mergedPreferences.genres || [],
        language: mergedPreferences.language || 'en',
        reading_duration: mergedPreferences.readingDuration || 'medium'
      });
    
    const updatedUser = { ...user, preferences: mergedPreferences };
    setUser(updatedUser);
    
    console.log('Preferences updated:', mergedPreferences);
  };

  const addToHistory = async (book: Book) => {
    if (!user) return;

    await supabase.from('book_history').insert({
      user_id: user.id,
      book_id: book.id,
      title: book.title,
      authors: [book.author],
      description: book.description,
      cover_url: book.cover
    });

    const currentHistory = user.history || [];
    const updatedHistory = [book, ...currentHistory];
    const updatedUser = { ...user, history: updatedHistory };
    setUser(updatedUser);
  };

  const addToLibrary = async (book: LibraryBook) => {
    if (!user) return;

    const currentLibrary = user.library || [];
    const exists = currentLibrary.find(b => b.isbn === book.isbn);
    if (exists) {
      throw new Error('Book already in library');
    }

    await supabase.from('library').insert({
      user_id: user.id,
      book_id: book.id,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      cover: book.cover,
      pages: book.pages,
      status: book.status,
      current_page: book.currentPage,
      rating: book.rating,
      notes: book.notes
    });

    const updatedLibrary = [book, ...currentLibrary];
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
  };

  const removeFromLibrary = async (bookId: string) => {
    if (!user) return;

    await supabase
      .from('library')
      .delete()
      .eq('user_id', user.id)
      .eq('id', bookId);

    const currentLibrary = user.library || [];
    const updatedLibrary = currentLibrary.filter(b => b.id !== bookId);
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
  };

  const updateLibraryBook = async (bookId: string, updates: Partial<LibraryBook>) => {
    if (!user) return;

    await supabase
      .from('library')
      .update({
        status: updates.status,
        current_page: updates.currentPage,
        rating: updates.rating,
        notes: updates.notes
      })
      .eq('user_id', user.id)
      .eq('id', bookId);

    const currentLibrary = user.library || [];
    const updatedLibrary = currentLibrary.map(b => 
      b.id === bookId ? { ...b, ...updates } : b
    );
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
  };

  const addToToRead = async (book: ToReadBook) => {
    if (!user) return;

    const currentToRead = user.toRead || [];
    const exists = currentToRead.find(b => b.id === book.id);
    if (exists) {
      throw new Error('Book already in To Read list');
    }

    await supabase.from('to_read').insert({
      user_id: user.id,
      book_id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      isbn: book.isbn
    });

    const updatedToRead = [book, ...currentToRead];
    const updatedUser = { ...user, toRead: updatedToRead };
    setUser(updatedUser);
  };

  const removeFromToRead = async (bookId: string) => {
    if (!user) return;

    await supabase
      .from('to_read')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId);

    const currentToRead = user.toRead || [];
    const updatedToRead = currentToRead.filter(b => b.id !== bookId);
    const updatedUser = { ...user, toRead: updatedToRead };
    setUser(updatedUser);
  };

  const moveToReadFromToRead = async (bookId: string) => {
    if (!user) return;

    const currentToRead = user.toRead || [];
    const book = currentToRead.find(b => b.id === bookId);
    if (!book) return;

    // Remove from toRead
    await supabase
      .from('to_read')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId);

    const updatedToRead = currentToRead.filter(b => b.id !== bookId);
    
    // Add to library as 'read'
    const currentLibrary = user.library || [];
    const libraryBook: LibraryBook = {
      ...book,
      isbn: book.isbn || `manual-${Date.now()}`,
      addedAt: new Date().toISOString(),
      status: 'read'
    };

    await supabase.from('library').insert({
      user_id: user.id,
      book_id: libraryBook.id,
      isbn: libraryBook.isbn,
      title: libraryBook.title,
      author: libraryBook.author,
      cover: libraryBook.cover,
      status: 'read'
    });

    const updatedLibrary = [libraryBook, ...currentLibrary];

    const updatedUser = { ...user, toRead: updatedToRead, library: updatedLibrary };
    setUser(updatedUser);
  };

  const likeBook = async (book: LikedBook) => {
    if (!user) return;

    const currentLiked = user.likedBooks || [];
    const exists = currentLiked.find(b => b.id === book.id);
    if (exists) return;

    await supabase.from('liked_books').insert({
      user_id: user.id,
      book_id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover
    });

    const updatedLiked = [book, ...currentLiked];
    const updatedUser = { ...user, likedBooks: updatedLiked };
    setUser(updatedUser);

    console.log('📚 Book LIKED - AI will learn from this!', book.title);
  };

  const dislikeBook = async (book: DislikedBook) => {
    if (!user) return;

    const currentDisliked = user.dislikedBooks || [];
    const exists = currentDisliked.find(b => b.id === book.id);
    if (exists) return;

    await supabase.from('disliked_books').insert({
      user_id: user.id,
      book_id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover
    });

    const updatedDisliked = [book, ...currentDisliked];
    const updatedUser = { ...user, dislikedBooks: updatedDisliked };
    setUser(updatedUser);

    console.log('👎 Book DISLIKED - AI will avoid similar books!', book.title);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updatePreferences, 
      addToHistory,
      addToLibrary,
      removeFromLibrary,
      updateLibraryBook,
      addToToRead,
      removeFromToRead,
      moveToReadFromToRead,
      likeBook,
      dislikeBook
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};