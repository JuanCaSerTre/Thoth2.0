import { useState, useEffect } from 'react';
import { cacheService } from '@/services/cacheService';

interface SavedBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  savedAt: string;
}

export function useOfflineBooks(userId: string) {
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);

  useEffect(() => {
    if (userId) {
      loadSavedBooks();
    }
  }, [userId]);

  const loadSavedBooks = () => {
    const books = cacheService.get<SavedBook[]>(`offline_books_${userId}`) || [];
    setSavedBooks(books);
  };

  const saveBookOffline = (book: Omit<SavedBook, 'savedAt'>) => {
    const existingBooks = cacheService.get<SavedBook[]>(`offline_books_${userId}`) || [];
    const updatedBooks = [
      { ...book, savedAt: new Date().toISOString() },
      ...existingBooks.filter(b => b.id !== book.id)
    ].slice(0, 20);
    
    cacheService.set(`offline_books_${userId}`, updatedBooks, 60 * 24 * 7);
    setSavedBooks(updatedBooks);
  };

  const removeBook = (bookId: string) => {
    const updated = savedBooks.filter(b => b.id !== bookId);
    cacheService.set(`offline_books_${userId}`, updated, 60 * 24 * 7);
    setSavedBooks(updated);
  };

  return {
    savedBooks,
    saveBookOffline,
    removeBook
  };
}
