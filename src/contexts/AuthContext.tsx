import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  preferences: {
    genres: string[];
    language: string;
    readingDuration: string;
    emotion?: string;
    favoriteBooks?: string;
  };
  history: Book[];
  library: LibraryBook[];
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
  rating?: number;
  notes?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, preferences: User['preferences']) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: User['preferences']) => void;
  addToHistory: (book: Book) => void;
  addToLibrary: (book: LibraryBook) => void;
  removeFromLibrary: (bookId: string) => void;
  updateLibraryBook: (bookId: string, updates: Partial<LibraryBook>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('thoth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('thoth_user', JSON.stringify(userWithoutPassword));
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
      library: []
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

  const updatePreferences = (preferences: User['preferences']) => {
    if (!user) return;
    
    const updatedUser = { ...user, preferences };
    setUser(updatedUser);
    localStorage.setItem('thoth_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('thoth_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, preferences } : u
    );
    localStorage.setItem('thoth_users', JSON.stringify(updatedUsers));
  };

  const addToHistory = (book: Book) => {
    if (!user) return;

    const updatedHistory = [book, ...user.history];
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

    const exists = user.library.find(b => b.isbn === book.isbn);
    if (exists) {
      throw new Error('Book already in library');
    }

    const updatedLibrary = [book, ...user.library];
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

    const updatedLibrary = user.library.filter(b => b.id !== bookId);
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

    const updatedLibrary = user.library.map(b => 
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
      updateLibraryBook
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