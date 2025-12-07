import React, { createContext, useContext, useState, useEffect } from 'react';

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
  status: 'read' | 'reading' | 'toRead';
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
    const storedUser = localStorage.getItem('thoth_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure all arrays exist
      setUser({
        ...parsedUser,
        library: parsedUser.library || [],
        history: parsedUser.history || [],
        toRead: parsedUser.toRead || [],
        likedBooks: parsedUser.likedBooks || [],
        dislikedBooks: parsedUser.dislikedBooks || []
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    const userWithDefaults = {
      ...userWithoutPassword,
      library: userWithoutPassword.library || [],
      history: userWithoutPassword.history || [],
      toRead: userWithoutPassword.toRead || [],
      likedBooks: userWithoutPassword.likedBooks || [],
      dislikedBooks: userWithoutPassword.dislikedBooks || []
    };
    setUser(userWithDefaults);
    localStorage.setItem('thoth_user', JSON.stringify(userWithDefaults));
    return userWithDefaults;
  };

  const register = async (email: string, password: string, preferences: User['preferences']) => {
    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      preferences,
      history: [],
      library: [],
      toRead: [],
      likedBooks: [],
      dislikedBooks: []
    };

    users.push(newUser);
    localStorage.setItem('thoth_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('thoth_user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('thoth_user');
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    // Merge preferences instead of replacing
    const mergedPreferences = {
      ...user.preferences,
      ...preferences
    };
    
    const updatedUser = { ...user, preferences: mergedPreferences };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, preferences: mergedPreferences } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
    
    console.log('Preferences updated:', mergedPreferences);
  };

  const addToHistory = (book: Book) => {
    if (!user) return;

    const currentHistory = user.history || [];
    const updatedHistory = [book, ...currentHistory];
    const updatedUser = { ...user, history: updatedHistory };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, history: updatedHistory } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const addToLibrary = (book: LibraryBook) => {
    if (!user) return;

    const currentLibrary = user.library || [];
    const exists = currentLibrary.find(b => b.isbn === book.isbn);
    if (exists) {
      throw new Error('Book already in library');
    }

    const updatedLibrary = [book, ...currentLibrary];
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, library: updatedLibrary } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const removeFromLibrary = (bookId: string) => {
    if (!user) return;

    const currentLibrary = user.library || [];
    const updatedLibrary = currentLibrary.filter(b => b.id !== bookId);
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, library: updatedLibrary } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const updateLibraryBook = (bookId: string, updates: Partial<LibraryBook>) => {
    if (!user) return;

    const currentLibrary = user.library || [];
    const updatedLibrary = currentLibrary.map(b => 
      b.id === bookId ? { ...b, ...updates } : b
    );
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, library: updatedLibrary } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const addToToRead = (book: ToReadBook) => {
    if (!user) return;

    const currentToRead = user.toRead || [];
    const exists = currentToRead.find(b => b.id === book.id);
    if (exists) {
      throw new Error('Book already in To Read list');
    }

    const updatedToRead = [book, ...currentToRead];
    const updatedUser = { ...user, toRead: updatedToRead };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, toRead: updatedToRead } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const removeFromToRead = (bookId: string) => {
    if (!user) return;

    const currentToRead = user.toRead || [];
    const updatedToRead = currentToRead.filter(b => b.id !== bookId);
    const updatedUser = { ...user, toRead: updatedToRead };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, toRead: updatedToRead } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const moveToReadFromToRead = (bookId: string) => {
    if (!user) return;

    const currentToRead = user.toRead || [];
    const book = currentToRead.find(b => b.id === bookId);
    if (!book) return;

    // Remove from toRead
    const updatedToRead = currentToRead.filter(b => b.id !== bookId);
    
    // Add to library as 'read'
    const currentLibrary = user.library || [];
    const libraryBook: LibraryBook = {
      ...book,
      isbn: book.isbn || `manual-${Date.now()}`,
      addedAt: new Date().toISOString(),
      status: 'read'
    };
    const updatedLibrary = [libraryBook, ...currentLibrary];

    const updatedUser = { ...user, toRead: updatedToRead, library: updatedLibrary };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, toRead: updatedToRead, library: updatedLibrary } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const likeBook = (book: LikedBook) => {
    if (!user) return;

    const currentLiked = user.likedBooks || [];
    const exists = currentLiked.find(b => b.id === book.id);
    if (exists) return;

    const updatedLiked = [book, ...currentLiked];
    const updatedUser = { ...user, likedBooks: updatedLiked };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, likedBooks: updatedLiked } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));

    console.log('📚 Book LIKED - AI will learn from this!', book.title);
  };

  const dislikeBook = (book: DislikedBook) => {
    if (!user) return;

    const currentDisliked = user.dislikedBooks || [];
    const exists = currentDisliked.find(b => b.id === book.id);
    if (exists) return;

    const updatedDisliked = [book, ...currentDisliked];
    const updatedUser = { ...user, dislikedBooks: updatedDisliked };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, dislikedBooks: updatedDisliked } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));

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