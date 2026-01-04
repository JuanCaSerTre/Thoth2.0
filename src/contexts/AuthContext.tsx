import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type LibraryRow = Database['public']['Tables']['library']['Row'];
type ToReadRow = Database['public']['Tables']['to_read']['Row'];
type LikedBooksRow = Database['public']['Tables']['liked_books']['Row'];
type DislikedBooksRow = Database['public']['Tables']['disliked_books']['Row'];
type BookHistoryRow = Database['public']['Tables']['book_history']['Row'];
type UserPreferencesRow = Database['public']['Tables']['user_preferences']['Row'];

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
  id: string; // Google Books ID
  rowId?: string; // Supabase row ID for delete/update operations
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
  id: string; // Google Books ID
  rowId?: string; // Supabase row ID for delete operations
  isbn?: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  addedAt: string;
  aiReasoning?: string;
  aiFocusArea?: string;
  compatibilityScore?: number;
  amazonLink?: string;
}

interface LikedBook {
  id: string; // Google Books ID
  rowId?: string; // Supabase row ID for delete operations
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
  id: string; // Google Books ID
  rowId?: string; // Supabase row ID for delete operations
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
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, preferences: User['preferences']) => Promise<{ requiresEmailConfirmation: boolean }>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const loadingUserIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Failsafe timeout - if loading takes more than 3 seconds, stop loading
    const failsafeTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        setIsLoading(false);
        setIsInitialized(true);
        loadingUserIdRef.current = null;
      }
    }, 3000);
    
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (isMounted) {
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }
        
        if (session?.user && isMounted) {
          loadingUserIdRef.current = session.user.id;
          await loadUserData(session.user.id);
          loadingUserIdRef.current = null;
        } else if (isMounted) {
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsLoading(false);
          loadingUserIdRef.current = null;
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
          clearTimeout(failsafeTimeout);
        }
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' && isMounted) {
        setUser(null);
        setIsLoading(false);
        loadingUserIdRef.current = null;
      }
      
      // Handle email confirmation and sign in events
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user && isMounted) {
        // Skip if we're already loading this user's data (login function is handling it)
        if (loadingUserIdRef.current === session.user.id) {
          return;
        }
        
        // Skip if user is already loaded
        if (user && user.id === session.user.id) {
          setIsLoading(false);
          return;
        }
        
        // Load user data - this handles:
        // 1. Email confirmation click
        // 2. Auto-login after registration (when confirmation not required)
        loadingUserIdRef.current = session.user.id;
        setIsLoading(true);
        try {
          await loadUserData(session.user.id);
        } finally {
          loadingUserIdRef.current = null;
        }
      }
    });

    // Then initialize
    initializeAuth();

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string): Promise<User | null> => {
    console.log('[AuthContext] Loading user data for:', userId);
    
    const queryTimeout = 8000; // 8 second timeout for each query
    
    const withTimeout = <T,>(promise: Promise<T>, name: string): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error(`${name} query timeout`)), queryTimeout)
        )
      ]);
    };
    
    try {
      // Execute all queries in parallel for faster loading
      const [
        preferencesResult,
        historyResult,
        libraryResult,
        toReadResult,
        likedBooksResult,
        dislikedBooksResult,
        authUserResult
      ] = await Promise.all([
        // Preferences with timeout
        withTimeout(
          supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single(),
          'Preferences'
        ).catch(err => {
          console.warn('[AuthContext] Preferences query failed:', err);
          return { data: null, error: err };
        }),
        // Book history
        withTimeout(
          supabase
            .from('book_history')
            .select('*')
            .eq('user_id', userId)
            .order('revealed_at', { ascending: false })
            .limit(50),
          'History'
        ).catch(err => {
          console.warn('[AuthContext] History query failed:', err);
          return { data: [], error: err };
        }),
        // Library
        withTimeout(
          supabase
            .from('library')
            .select('*')
            .eq('user_id', userId)
            .order('added_at', { ascending: false })
            .limit(100),
          'Library'
        ).catch(err => {
          console.warn('[AuthContext] Library query failed:', err);
          return { data: [], error: err };
        }),
        // To read
        withTimeout(
          supabase
            .from('to_read')
            .select('*')
            .eq('user_id', userId)
            .order('added_at', { ascending: false })
            .limit(50),
          'ToRead'
        ).catch(err => {
          console.warn('[AuthContext] ToRead query failed:', err);
          return { data: [], error: err };
        }),
        // Liked books
        withTimeout(
          supabase
            .from('liked_books')
            .select('*')
            .eq('user_id', userId)
            .order('liked_at', { ascending: false })
            .limit(50),
          'LikedBooks'
        ).catch(err => {
          console.warn('[AuthContext] LikedBooks query failed:', err);
          return { data: [], error: err };
        }),
        // Disliked books
        withTimeout(
          supabase
            .from('disliked_books')
            .select('*')
            .eq('user_id', userId)
            .order('disliked_at', { ascending: false })
            .limit(50),
          'DislikedBooks'
        ).catch(err => {
          console.warn('[AuthContext] DislikedBooks query failed:', err);
          return { data: [], error: err };
        }),
        // Auth user
        withTimeout(
          supabase.auth.getUser(),
          'AuthUser'
        ).catch(err => {
          console.warn('[AuthContext] AuthUser query failed:', err);
          return { data: { user: null }, error: err };
        })
      ]);

      const preferences = preferencesResult.data as UserPreferencesRow | null;
      const history = historyResult.data as BookHistoryRow[] | null;
      const library = libraryResult.data as LibraryRow[] | null;
      const toRead = toReadResult.data as ToReadRow[] | null;
      const likedBooks = likedBooksResult.data as LikedBooksRow[] | null;
      const dislikedBooks = dislikedBooksResult.data as DislikedBooksRow[] | null;
      const authUser = authUserResult.data?.user;

      console.log('[AuthContext] User data loaded:', {
        hasPreferences: !!preferences,
        historyCount: history?.length || 0,
        authUser: !!authUser,
        userId: userId
      });

      // Use authUser if available, otherwise create minimal user with userId
      const userEmail = authUser?.email || '';
      const userIdToUse = authUser?.id || userId;
      
      if (userIdToUse) {
        const newUser: User = {
          id: userIdToUse,
          email: userEmail,
          preferences: preferences ? {
            genres: preferences.genres || [],
            language: preferences.language || 'en',
            readingDuration: preferences.reading_duration || 'medium',
            onboardingCompleted: preferences.onboarding_completed === true,
            readingGoals: preferences.reading_goals || [],
            readerType: preferences.reader_type || undefined,
            storyVibes: preferences.story_vibes || [],
            psychologicalProfile: (typeof preferences.psychological_profile === 'object' && preferences.psychological_profile !== null && !Array.isArray(preferences.psychological_profile)) 
              ? preferences.psychological_profile as Record<string, string>
              : {},
            favoriteBooks: preferences.favorite_books || undefined
          } : {
            genres: [],
            language: 'en',
            readingDuration: 'medium',
            onboardingCompleted: false
          },
          history: history?.map(h => ({
            id: h.book_id, // Use book_id (Google Books ID) not the Supabase row ID
            rowId: h.id, // Keep Supabase row ID for operations
            title: h.title,
            author: h.authors?.[0] || 'Unknown',
            cover: h.cover_url || '',
            description: h.description || '',
            revealedAt: h.revealed_at
          })) || [],
          library: library?.map(l => ({
            id: l.book_id, // Use book_id (Google Books ID) not the Supabase row ID
            rowId: l.id, // Keep Supabase row ID for delete/update operations
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
            id: t.book_id, // Use book_id (Google Books ID) not the Supabase row ID
            rowId: t.id, // Keep Supabase row ID for delete operations
            isbn: t.isbn || undefined,
            title: t.title,
            author: t.author,
            cover: t.cover || '',
            description: '',
            addedAt: t.added_at
          })) || [],
          likedBooks: likedBooks?.map(l => ({
            id: l.book_id, // Use book_id (Google Books ID) not the Supabase row ID
            rowId: l.id, // Keep Supabase row ID for delete operations
            title: l.title,
            author: l.author,
            cover: l.cover || '',
            description: '',
            likedAt: l.liked_at
          })) || [],
          dislikedBooks: dislikedBooks?.map(d => ({
            id: d.book_id, // Use book_id (Google Books ID) not the Supabase row ID
            rowId: d.id, // Keep Supabase row ID for delete operations
            title: d.title,
            author: d.author,
            cover: d.cover || '',
            description: '',
            dislikedAt: d.disliked_at
          })) || []
        };
        setUser(newUser);
        setIsLoading(false);
        console.log('[AuthContext] User set successfully');
        return newUser;
      }
      console.log('[AuthContext] No auth user found');
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error('[AuthContext] Error loading user data:', error);
      setIsLoading(false);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    console.log('[AuthContext] Login attempt for:', email);
    
    // Set the ref BEFORE signing in to prevent auth state listener from duplicating work
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[AuthContext] Login error:', error);
      throw new Error(error.message === 'Invalid login credentials' 
        ? 'Email o contraseña incorrectos. Verifica tus credenciales.' 
        : error.message);
    }
    
    if (!data.user) {
      console.error('[AuthContext] No user data returned');
      throw new Error('Login failed');
    }

    console.log('[AuthContext] Login successful, user:', data.user.email);

    // Check if email is confirmed
    if (!data.user.email_confirmed_at && data.user.identities && data.user.identities.length === 0) {
      throw new Error('Por favor confirma tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
    }

    // Set ref to prevent auth listener from loading user data again
    loadingUserIdRef.current = data.user.id;
    
    try {
      console.log('[AuthContext] Loading user data after login...');
      const loadedUser = await loadUserData(data.user.id);
      if (!loadedUser) {
        console.error('[AuthContext] Failed to load user data');
        throw new Error('Failed to load user data');
      }
      console.log('[AuthContext] User data loaded successfully');
      return loadedUser;
    } catch (error) {
      console.error('[AuthContext] Error in login flow:', error);
      throw error;
    } finally {
      // Always clear the ref after login attempt
      loadingUserIdRef.current = null;
    }
  };

  const register = async (email: string, password: string, preferences: User['preferences']): Promise<{ requiresEmailConfirmation: boolean }> => {
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.user) throw new Error('Registration failed');

    // Check if email confirmation is required
    if (data.user.identities && data.user.identities.length === 0) {
      throw new Error('Este email ya está registrado. Por favor inicia sesión.');
    }

    // Save preferences
    const { error: prefError } = await supabase.from('user_preferences').insert({
      user_id: data.user.id,
      genres: preferences.genres || [],
      language: preferences.language || 'en',
      reading_duration: preferences.readingDuration || 'medium'
    } as Database['public']['Tables']['user_preferences']['Insert']);



    // If session exists (email confirmation not required), load user data
    // If session is null, user needs to confirm email first
    if (data.session) {
      await loadUserData(data.user.id);
      return { requiresEmailConfirmation: false };
    }
    
    // No session means email confirmation is required
    return { requiresEmailConfirmation: true };
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

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        genres: mergedPreferences.genres || [],
        language: mergedPreferences.language || 'en',
        reading_duration: mergedPreferences.readingDuration || 'medium',
        onboarding_completed: mergedPreferences.onboardingCompleted === true,
        reading_goals: mergedPreferences.readingGoals || [],
        reader_type: mergedPreferences.readerType || null,
        story_vibes: mergedPreferences.storyVibes || [],
        psychological_profile: mergedPreferences.psychologicalProfile || {},
        favorite_books: mergedPreferences.favoriteBooks || null
      }, {
        onConflict: 'user_id'
      });
    

    
    const updatedUser = { ...user, preferences: mergedPreferences };
    setUser(updatedUser);
    
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

    try {
      const { error } = await supabase.from('library').insert({
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

      if (error) {
        throw error;
      }

      const updatedLibrary = [book, ...currentLibrary];
      const updatedUser = { ...user, library: updatedLibrary };
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const removeFromLibrary = async (bookId: string) => {
    if (!user) return;

    // bookId is the Google Books ID, use book_id column for deletion
    await supabase
      .from('library')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId);

    const currentLibrary = user.library || [];
    const updatedLibrary = currentLibrary.filter(b => b.id !== bookId);
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
  };

  const updateLibraryBook = async (bookId: string, updates: Partial<LibraryBook>) => {
    if (!user) return;

    // bookId is the Google Books ID, use book_id column for update
    await supabase
      .from('library')
      .update({
        status: updates.status,
        current_page: updates.currentPage,
        rating: updates.rating,
        notes: updates.notes
      })
      .eq('user_id', user.id)
      .eq('book_id', bookId);

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
      return;
    }

    try {
      const { error } = await supabase.from('to_read').insert({
        user_id: user.id,
        book_id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        isbn: book.isbn || null
      });

      if (error) {
        return;
      }

      const updatedToRead = [book, ...currentToRead];
      const updatedUser = { ...user, toRead: updatedToRead };
      setUser(updatedUser);
      
    } catch {
    }
  };

  const removeFromToRead = async (bookId: string) => {
    if (!user) return;

    // Remove from to_read table
    await supabase
      .from('to_read')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId);

    // Also remove from liked_books if it exists there
    await supabase
      .from('liked_books')
      .delete()
      .eq('user_id', user.id)
      .eq('book_id', bookId);

    const currentToRead = user.toRead || [];
    const updatedToRead = currentToRead.filter(b => b.id !== bookId);
    
    const currentLiked = user.likedBooks || [];
    const updatedLiked = currentLiked.filter(b => b.id !== bookId);
    
    const updatedUser = { ...user, toRead: updatedToRead, likedBooks: updatedLiked };
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
    if (exists) {
      return;
    }

    try {
      const { error } = await supabase.from('liked_books').insert({
        user_id: user.id,
        book_id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        isbn: book.isbn || null
      });

      if (error) {
        return;
      }

      const updatedLiked = [book, ...currentLiked];
      const updatedUser = { ...user, likedBooks: updatedLiked };
      setUser(updatedUser);

    } catch {
    }
  };

  const dislikeBook = async (book: DislikedBook) => {
    if (!user) return;

    const currentDisliked = user.dislikedBooks || [];
    const exists = currentDisliked.find(b => b.id === book.id);
    if (exists) return;

    try {
      const { error } = await supabase.from('disliked_books').insert({
        user_id: user.id,
        book_id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover
      });

      if (error) {
        return;
      }

      const updatedDisliked = [book, ...currentDisliked];
      const updatedUser = { ...user, dislikedBooks: updatedDisliked };
      setUser(updatedUser);

    } catch {
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      isInitialized,
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