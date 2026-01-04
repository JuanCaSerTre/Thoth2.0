import { generateAIRecommendations, type UserProfile } from '@/services/aiService';
import type { RecommendedBook } from '@/components/BookRecommendationCard';
import { cacheService } from '@/services/cacheService';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  amazonLink?: string;
  isbn?: string;
  aiReasoning?: string;
  aiFocusArea?: string;
  emotionalHook?: string;
  categories?: string[];
  compatibilityScore?: number;
}

interface BookByISBN extends Book {
  isbn: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
}

interface LibraryBook {
  id?: string;
  isbn: string;
  title: string;
  author: string;
}

interface UserPreferences {
  genres?: string[];
  language?: string;
  readingDuration?: string;
  emotion?: string;
  favoriteBooks?: string;
}

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
// Amazon Affiliate Tag - Change this to your own tag
const AMAZON_AFFILIATE_TAG = import.meta.env.VITE_AMAZON_AFFILIATE_TAG || 'thoth02-22';

// Cache to reduce API calls
const bookCache = new Map<string, any>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Emotion to genre/keyword mapping
const EMOTION_KEYWORDS: Record<string, string[]> = {
  'Inspiration': ['motivational', 'biography', 'success', 'leadership', 'self-improvement'],
  'Relaxation': ['cozy', 'light', 'comfort', 'gentle', 'peaceful'],
  'Adventure': ['adventure', 'travel', 'exploration', 'journey', 'quest'],
  'Knowledge': ['science', 'history', 'philosophy', 'education', 'learning'],
  'Escape': ['fantasy', 'science fiction', 'magical', 'alternate world'],
  'Growth': ['self-help', 'personal development', 'psychology', 'mindfulness'],
  'Entertainment': ['thriller', 'mystery', 'suspense', 'drama', 'humor']
};

// Extract keywords from favorite books
const extractKeywords = (favoriteBooks?: string): string[] => {
  if (!favoriteBooks) return [];
  
  const keywords: string[] = [];
  const books = favoriteBooks.toLowerCase().split(/[,;]/);
  
  books.forEach(book => {
    const words = book.trim().split(/\s+/);
    keywords.push(...words.filter(w => w.length > 3));
  });
  
  return keywords.slice(0, 5);
};

// Build intelligent search query
const buildSearchQuery = (
  preferences?: UserPreferences,
  library?: LibraryBook[],
  iteration: number = 0
): string => {
  const queries: string[] = [];
  
  // Strategy 1: Use emotion-based keywords
  if (preferences?.emotion && EMOTION_KEYWORDS[preferences.emotion]) {
    const emotionKeywords = EMOTION_KEYWORDS[preferences.emotion];
    const keyword = emotionKeywords[iteration % emotionKeywords.length];
    queries.push(`subject:${keyword}`);
  }
  
  // Strategy 2: Use favorite books keywords
  if (preferences?.favoriteBooks && iteration === 0) {
    const keywords = extractKeywords(preferences.favoriteBooks);
    if (keywords.length > 0) {
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      queries.push(`${keyword}`);
    }
  }
  
  // Strategy 3: Use preferred genres
  if (preferences?.genres && preferences.genres.length > 0) {
    const genre = preferences.genres[iteration % preferences.genres.length];
    queries.push(`subject:${genre}`);
  }
  
  // Strategy 4: Similar authors from library
  if (library && library.length > 0 && iteration === 1) {
    const randomBook = library[Math.floor(Math.random() * library.length)];
    const authorLastName = randomBook.author.split(' ').slice(-1)[0];
    queries.push(`inauthor:${authorLastName}`);
  }
  
  // Default fallback
  if (queries.length === 0) {
    queries.push('subject:fiction');
  }
  
  return queries.join('+');
};

// Search Google Books API
const searchGoogleBooks = async (query: string, language: string = 'en'): Promise<any[]> => {
  try {
    const params = new URLSearchParams({
      q: query,
      maxResults: '20',
      orderBy: 'relevance',
      langRestrict: language,
      printType: 'books'
    });

    const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
    
    if (!response.ok) {
      console.error(`Google Books API request failed for query: ${query}`);
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching Google Books:', error);
    return [];
  }
};

// Filter out books already in library
const isBookInLibrary = (bookId: string, isbn: string | undefined, library?: LibraryBook[]): boolean => {
  if (!library || library.length === 0) return false;
  
  return library.some(libBook => 
    libBook.isbn === isbn || 
    libBook.id === bookId
  );
};

// Score and rank books based on preferences and quality
const scoreBook = (book: any, preferences?: UserPreferences, likedBooks?: any[], dislikedBooks?: any[]): number => {
  // Start with a base score of 80 to make it easier to reach 70%+ compatibility
  let score = 80;
  const volumeInfo = book.volumeInfo;
  const categories = volumeInfo.categories || [];
  const bookTitle = volumeInfo.title?.toLowerCase() || '';
  const bookDescription = volumeInfo.description?.toLowerCase() || '';
  const bookAuthor = volumeInfo.authors?.[0]?.toLowerCase() || '';
  
  // Calculate learning weight based on interaction history
  const totalInteractions = (likedBooks?.length || 0) + (dislikedBooks?.length || 0);
  const learningWeight = Math.min(1, totalInteractions / 10); // 0 to 1, maxes at 10 interactions
  
  // ═══════════════════════════════════════════════════════════
  // 1. APRENDIZAJE DE LIBROS GUSTADOS (MÁXIMA PRIORIDAD - 200 puntos max)
  // Peso aumenta con más interacciones
  // ═══════════════════════════════════════════════════════════
  if (likedBooks && likedBooks.length > 0) {
    const likedCategories = new Set(
      likedBooks.flatMap((b: any) => b.categories || []).map((c: string) => c.toLowerCase())
    );
    const likedAuthors = new Set(
      likedBooks.map((b: any) => b.author?.toLowerCase()).filter(Boolean)
    );
    
    // BOOST FUERTE: Categorías que coinciden con libros gustados
    // Aumenta con el aprendizaje
    let categoryMatchCount = 0;
    categories.forEach((cat: string) => {
      const catLower = cat.toLowerCase();
      if (likedCategories.has(catLower)) {
        categoryMatchCount++;
        score += 60 + (learningWeight * 40); // 60-100 puntos según aprendizaje
      }
      // También buscar coincidencias parciales
      likedCategories.forEach(likedCat => {
        if (catLower.includes(likedCat) || likedCat.includes(catLower)) {
          score += 30 + (learningWeight * 20); // 30-50 puntos
        }
      });
    });
    
    // BOOST EXTRA: Si coincide con múltiples categorías gustadas
    if (categoryMatchCount >= 2) {
      score += 50 + (learningWeight * 50); // 50-100 puntos
    }
    
    // BOOST FUERTE: Mismo autor que libro gustado
    if (bookAuthor && likedAuthors.has(bookAuthor)) {
      score += 100 + (learningWeight * 50); // 100-150 puntos - MUY alto por autor conocido
    }
    
    // Buscar autores similares (mismo apellido)
    likedAuthors.forEach(likedAuthor => {
      const likedLastName = likedAuthor.split(' ').pop();
      const bookLastName = bookAuthor.split(' ').pop();
      if (likedLastName && bookLastName && likedLastName === bookLastName && likedAuthor !== bookAuthor) {
        score += 40 + (learningWeight * 30); // 40-70 puntos
      }
    });
    
    console.log(`📊 Learning boost applied: ${Math.round(learningWeight * 100)}% (${likedBooks.length} liked books)`);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 2. EVITAR LIBROS NO GUSTADOS (PENALIZACIÓN FUERTE)
  // Penalización aumenta con más interacciones
  // ═══════════════════════════════════════════════════════════
  if (dislikedBooks && dislikedBooks.length > 0) {
    const dislikedCategories = new Set(
      dislikedBooks.flatMap((b: any) => b.categories || []).map((c: string) => c.toLowerCase())
    );
    const dislikedAuthors = new Set(
      dislikedBooks.map((b: any) => b.author?.toLowerCase()).filter(Boolean)
    );
    
    // PENALIZACIÓN: Categorías de libros no gustados
    // Aumenta con el aprendizaje
    categories.forEach((cat: string) => {
      if (dislikedCategories.has(cat.toLowerCase())) {
        score -= 80 + (learningWeight * 70); // -80 a -150 puntos
      }
    });
    
    // PENALIZACIÓN CRÍTICA: Mismo autor que libro no gustado
    if (bookAuthor && dislikedAuthors.has(bookAuthor)) {
      score -= 150 + (learningWeight * 100); // -150 a -250 puntos
    }
    
    console.log(`🚫 Avoidance penalty applied: ${Math.round(learningWeight * 100)}% (${dislikedBooks.length} disliked books)`);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 3. GÉNEROS PREFERIDOS DEL USUARIO (100 puntos max)
  // ═══════════════════════════════════════════════════════════
  if (preferences?.genres && preferences.genres.length > 0 && categories.length > 0) {
    let genreMatchCount = 0;
    categories.forEach((cat: string) => {
      const catLower = cat.toLowerCase();
      preferences.genres?.forEach(g => {
        const genreLower = g.toLowerCase();
        if (catLower.includes(genreLower) || genreLower.includes(catLower)) {
          genreMatchCount++;
          score += 40; // Boost por género preferido
        }
      });
    });
    
    // Bonus si coincide con múltiples géneros preferidos
    if (genreMatchCount >= 2) {
      score += 30;
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // 4. CALIDAD DEL LIBRO (80 puntos max)
  // ═══════════════════════════════════════════════════════════
  
  // Rating promedio (importante para calidad)
  if (volumeInfo.averageRating) {
    score += volumeInfo.averageRating * 12; // Max 60 puntos (5 estrellas)
  }
  
  // Cantidad de ratings (popularidad y confiabilidad)
  if (volumeInfo.ratingsCount) {
    if (volumeInfo.ratingsCount > 1000) score += 25;
    else if (volumeInfo.ratingsCount > 500) score += 18;
    else if (volumeInfo.ratingsCount > 100) score += 10;
  }
  
  // Descripción completa (señal de calidad)
  if (volumeInfo.description) {
    if (volumeInfo.description.length > 500) score += 15;
    else if (volumeInfo.description.length > 200) score += 8;
  }
  
  // Imagen de portada (presentación)
  if (volumeInfo.imageLinks?.thumbnail) {
    score += 10;
  }
  
  // ═══════════════════════════════════════════════════════════
  // 5. PREFERENCIAS ADICIONALES
  // ═══════════════════════════════════════════════════════════
  
  // Duración de lectura preferida
  if (preferences?.readingDuration && volumeInfo.pageCount) {
    const pages = volumeInfo.pageCount;
    if (preferences.readingDuration.includes('15') && pages < 200) score += 20;
    if (preferences.readingDuration.includes('30') && pages >= 200 && pages < 350) score += 20;
    if (preferences.readingDuration.includes('1 hour') && pages >= 350 && pages < 500) score += 20;
    if (preferences.readingDuration.includes('More') && pages >= 500) score += 20;
  }
  
  // Preferencia por libros recientes (leve)
  if (volumeInfo.publishedDate) {
    const year = parseInt(volumeInfo.publishedDate.split('-')[0]);
    if (year >= 2020) score += 8;
    else if (year >= 2015) score += 4;
  }
  
  return score;
};

// Map book data to RecommendedBook interface
const mapToBook = (book: any): RecommendedBook | null => {
  const volumeInfo = book.volumeInfo;
  const isbn = volumeInfo.industryIdentifiers?.find((id: any) => 
    id.type === 'ISBN_13' || id.type === 'ISBN_10'
  )?.identifier;

  // Only return books with valid ISBN for Amazon links
  if (!isbn || !/^(\d{10}|\d{13})$/.test(isbn.replace(/[-\s]/g, ''))) {
    console.log(`Skipping book without valid ISBN: "${volumeInfo.title}"`);
    return null;
  }

  return {
    id: book.id,
    title: volumeInfo.title || 'Unknown Title',
    author: volumeInfo.authors?.[0] || 'Unknown Author',
    cover: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 
           volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:') ||
           'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    description: volumeInfo.description?.substring(0, 400) || 'No description available.',
    isbn,
    categories: volumeInfo.categories || [],
    pageCount: volumeInfo.pageCount,
    publishedDate: volumeInfo.publishedDate,
    averageRating: volumeInfo.averageRating
  };
};

export async function getPersonalizedRecommendations(user: any): Promise<RecommendedBook[]> {
  try {
    // Log all user data at start for debugging
    console.log('🚀 getPersonalizedRecommendations called');
    console.log('📊 User data received:');
    console.log('   - likedBooks:', user.likedBooks?.length || 0, user.likedBooks?.map((b: any) => b.id) || []);
    console.log('   - dislikedBooks:', user.dislikedBooks?.length || 0, user.dislikedBooks?.map((b: any) => b.id) || []);
    console.log('   - toRead:', user.toRead?.length || 0, user.toRead?.map((b: any) => b.id) || []);
    console.log('   - history:', user.history?.length || 0, user.history?.map((b: any) => b.id) || []);
    console.log('=== STARTING PERSONALIZED RECOMMENDATIONS ===');
    console.log('\n📊 USER PROFILE ANALYSIS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📚 Genres:', user.preferences?.genres?.join(', ') || 'None - IMPORTANT: Add genres for better matches!');
    console.log('  🎯 Reading Goals:', user.preferences?.readingGoals?.join(', ') || 'None');
    console.log('  👤 Reader Type:', user.preferences?.readerType || 'None');
    console.log('  ✨ Story Vibes:', user.preferences?.storyVibes?.join(', ') || 'None');
    console.log('  🌍 Language:', user.preferences?.language || 'en');
    console.log('  🧠 Psychological Profile:', user.preferences?.psychologicalProfile ? Object.entries(user.preferences.psychologicalProfile).map(([k, v]) => `${k}:${v}`).join(', ') : 'None');
    console.log('\n📖 READING DATA:');
    console.log('  Library:', user.library?.length || 0, 'books');
    console.log('  History:', user.history?.length || 0, 'books');
    console.log('  To Read:', user.toRead?.length || 0, 'books');
    console.log('\n🎯 LEARNING DATA (CRITICAL FOR PERSONALIZATION):');
    console.log('  ✅ Liked books:', user.likedBooks?.length || 0);
    if (user.likedBooks?.length > 0) {
      console.log('     LIKED PATTERNS:');
      const likedGenres = new Set<string>();
      user.likedBooks.slice(0, 5).forEach((b: any) => {
        console.log(`     - "${b.title}" by ${b.author}`);
        if (b.categories) b.categories.forEach((c: string) => likedGenres.add(c));
      });
      if (likedGenres.size > 0) {
        console.log(`     → Detected genres: ${Array.from(likedGenres).join(', ')}`);
      }
    }
    console.log('  ❌ Disliked books:', user.dislikedBooks?.length || 0);
    if (user.dislikedBooks?.length > 0) {
      user.dislikedBooks.slice(0, 3).forEach((b: any) => {
        console.log(`     - "${b.title}" by ${b.author} [AVOID: ${b.categories?.join(', ') || 'No categories'}]`);
      });
    }
    console.log('═══════════════════════════════════════════════════════════');

    // Extract genres from liked books if user has no genres configured
    let effectiveGenres = user.preferences?.genres || [];
    if (effectiveGenres.length === 0 && user.likedBooks?.length > 0) {
      const likedGenresSet = new Set<string>();
      user.likedBooks.forEach((b: any) => {
        if (b.categories) b.categories.forEach((c: string) => likedGenresSet.add(c));
      });
      effectiveGenres = Array.from(likedGenresSet).slice(0, 5);
      console.log('📊 Auto-detected genres from liked books:', effectiveGenres.join(', '));
    }

    // Build user profile for AI with ALL available data INCLUDING LIKES/DISLIKES/TOREAD
    const userProfile: UserProfile = {
      genres: effectiveGenres,
      emotions: user.preferences?.emotions || (user.preferences?.emotion ? [user.preferences.emotion] : []),
      themes: user.preferences?.themes || [],
      storytellingStyles: user.preferences?.storytellingStyles || [],
      favoriteBooks: user.preferences?.favoriteBooks || '',
      language: user.preferences?.language || 'en',
      readingDuration: user.preferences?.readingDuration || '',
      discoveryMethod: user.preferences?.discoveryMethod || '',
      endingPreference: user.preferences?.endingPreference || '',
      nextBookGoal: user.preferences?.nextBookGoal || '',
      // New onboarding fields
      readingGoals: user.preferences?.readingGoals || [],
      readerType: user.preferences?.readerType || '',
      storyVibes: user.preferences?.storyVibes || [],
      psychologicalProfile: user.preferences?.psychologicalProfile || {},
      library: user.library || [],
      readingHistory: user.history || [],
      likedBooks: user.likedBooks || [],
      dislikedBooks: user.dislikedBooks || [],
      toReadBooks: user.toRead || []
    };

    // Build comprehensive exclusion sets FIRST
    const libraryISBNs = new Set(
      (user.library || []).map((book: any) => book.isbn).filter(Boolean)
    );
    
    const toReadISBNs = new Set(
      (user.toRead || []).map((book: any) => book.isbn).filter(Boolean)
    );
    
    const likedISBNs = new Set(
      (user.likedBooks || []).map((book: any) => book.isbn).filter(Boolean)
    );
    
    // Exclude books by title/author from library, history, toRead, AND likedBooks
    const readBookTitles = new Set(
      [...(user.library || []), ...(user.history || []), ...(user.toRead || []), ...(user.likedBooks || []), ...(user.dislikedBooks || [])]
        .map((book: any) => book.title?.toLowerCase().trim())
        .filter(Boolean)
    );
    
    // Also exclude by book ID (Google Books IDs)
    const seenBookIds = new Set(
      [...(user.library || []), ...(user.history || []), ...(user.toRead || []), ...(user.likedBooks || []), ...(user.dislikedBooks || [])]
        .map((book: any) => book.id)
        .filter(Boolean)
    );
    
    // Disliked book IDs (to completely exclude)
    const dislikedBookIds = new Set(
      (user.dislikedBooks || []).map((book: any) => book.id).filter(Boolean)
    );
    
    // Revealed book IDs (from history)
    const revealedBookIds = new Set(
      (user.history || []).map((book: any) => book.id).filter(Boolean)
    );
    
    // To Read book IDs (to exclude from recommendations)
    const toReadBookIds = new Set(
      (user.toRead || []).map((book: any) => book.id).filter(Boolean)
    );
    
    // Liked book IDs (already saved)
    const likedBookIds = new Set(
      (user.likedBooks || []).map((book: any) => book.id).filter(Boolean)
    );
    
    const readBookAuthors = new Set<string>();
    // Don't exclude by author - just by specific books

    const dislikedAuthors = new Set(
      (user.dislikedBooks || []).map((b: any) => b.author?.toLowerCase().trim()).filter(Boolean)
    );

    console.log('=== EXCLUSION SETS ===');
    console.log('📚 Library ISBNs:', Array.from(libraryISBNs));
    console.log('📖 ToRead ISBNs:', Array.from(toReadISBNs));
    console.log('❤️ Liked ISBNs:', Array.from(likedISBNs));
    console.log('📝 All Titles to exclude:', Array.from(readBookTitles));
    console.log('🔑 All Book IDs to exclude:', Array.from(seenBookIds));
    console.log('❌ Disliked Book IDs:', Array.from(dislikedBookIds));
    console.log('👁️ Revealed Book IDs:', Array.from(revealedBookIds));
    console.log('📖 ToRead Book IDs:', Array.from(toReadBookIds));
    console.log('❤️ Liked Book IDs:', Array.from(likedBookIds));
    console.log('🚫 Disliked Authors:', Array.from(dislikedAuthors));
    console.log('======================');

    // DISABLED CACHE - Always get fresh recommendations
    // The cache was returning books that the user had already liked/disliked
    // This caused the same books to be shown repeatedly
    console.log('🔄 Fetching fresh recommendations (cache disabled for accurate filtering)');

    const allBooks: RecommendedBook[] = [];
    const seenISBNs = new Set<string>();
    const seenTitles = new Set<string>();

    // Map language codes to Google Books API language codes
    const languageMap: Record<string, string> = {
      'en': 'en',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'it': 'it',
      'pt': 'pt'
    };

    const langRestrict = languageMap[userProfile.language] || 'en';
    console.log(`🌍 Using language restriction: ${langRestrict} (user preference: ${userProfile.language})`);
    console.log(`📚 Will filter books to show only ${langRestrict === 'es' ? 'Spanish' : langRestrict === 'en' ? 'English' : langRestrict} books`);

    // Get AI-powered recommendations
    const aiRecommendations = await generateAIRecommendations(userProfile);
    console.log('AI Recommendations:', JSON.stringify(aiRecommendations, null, 2));

    // Fetch books for each AI recommendation
    for (const aiRec of aiRecommendations) {
      try {
        console.log(`\n--- Fetching books for query: ${aiRec.searchQuery} ---`);
        
        // Add language restriction to improve results
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            aiRec.searchQuery
          )}&maxResults=40&orderBy=relevance&langRestrict=${langRestrict}&printType=books`
        );

        if (!response.ok) {
          console.warn(`API request failed for query: ${aiRec.searchQuery}`);
          continue;
        }

        const data = await response.json();
        if (!data.items) {
          console.warn(`No items found for query: ${aiRec.searchQuery}`);
          continue;
        }

        console.log(`Found ${data.items.length} books for query: ${aiRec.searchQuery}`);

        // Score and filter books
        const scoredBooks = data.items
          .map((item: any) => {
            const isbn = item.volumeInfo.industryIdentifiers?.find(
              (id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
            )?.identifier;
            
            const title = item.volumeInfo.title?.toLowerCase().trim();
            const author = item.volumeInfo.authors?.[0]?.toLowerCase().trim();
            const bookId = item.id;
            const bookLanguage = item.volumeInfo.language;
            
            // Create normalized title for comparison (removes special chars and extra spaces)
            const normalizedTitle = title?.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

            // Skip if book language doesn't match user preference (when not English)
            if (langRestrict !== 'en' && bookLanguage && bookLanguage !== langRestrict) {
              console.log(`Skipping book "${item.volumeInfo.title}" - wrong language: ${bookLanguage} (expected: ${langRestrict})`);
              return null;
            }

            // CRITICAL: Filter out all books that user has interacted with
            
            // Skip by Book ID (use the combined seenBookIds set which includes everything)
            if (seenBookIds.has(bookId)) {
              console.log(`❌ FILTER: Skipping "${item.volumeInfo.title}" - ID already in user data: ${bookId}`);
              return null;
            }

            // Also check specific sets in case IDs differ
            if (dislikedBookIds.has(bookId) || revealedBookIds.has(bookId) || toReadBookIds.has(bookId) || likedBookIds.has(bookId)) {
              console.log(`❌ FILTER: Skipping "${item.volumeInfo.title}" - Found in specific ID set: ${bookId}`);
              return null;
            }

            // Skip if in library by ID (check book_id property)
            if (user.library && user.library.some((b: any) => b.id === bookId || b.book_id === bookId)) {
              console.log(`❌ FILTER: Skipping "${item.volumeInfo.title}" - In library: ${bookId}`);
              return null;
            }

            // Skip by ISBN
            if (isbn && (libraryISBNs.has(isbn) || toReadISBNs.has(isbn) || likedISBNs.has(isbn))) {
              console.log(`❌ FILTER: Skipping "${item.volumeInfo.title}" - ISBN match: ${isbn}`);
              return null;
            }
            
            // Skip by exact title match
            if (title && (readBookTitles.has(title) || seenTitles.has(title))) {
              console.log(`❌ FILTER: Skipping "${item.volumeInfo.title}" - Exact title match`);
              return null;
            }
            
            // Skip if normalized title matches any in our exclusion list (handles slight variations)
            if (normalizedTitle) {
              for (const existingTitle of readBookTitles) {
                const normalizedExisting = existingTitle?.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
                if (normalizedExisting && normalizedTitle === normalizedExisting) {
                  console.log(`Skipping book "${item.volumeInfo.title}" - normalized title match: ${normalizedExisting}`);
                  return null;
                }
              }
              for (const existingTitle of seenTitles) {
                const normalizedExisting = existingTitle?.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
                if (normalizedExisting && normalizedTitle === normalizedExisting) {
                  console.log(`Skipping book "${item.volumeInfo.title}" - normalized title match in session: ${normalizedExisting}`);
                  return null;
                }
              }
            }

            // Skip if author is from disliked books
            if (author && dislikedAuthors.has(author)) {
              console.log(`Skipping book "${item.volumeInfo.title}" - disliked author: ${author}`);
              return null;
            }

            // Use effective genres for scoring
            const effectivePreferences = {
              ...user.preferences,
              genres: effectiveGenres
            };
            const score = scoreBook(item, effectivePreferences, user.likedBooks, user.dislikedBooks);
            return {
              ...item,
              isbn,
              title,
              score,
              aiReasoning: aiRec.reasoning,
              aiFocusArea: aiRec.focusArea,
              emotionalHook: aiRec.emotionalHook
            };
          })
          .filter((book): book is any => book !== null)
          .sort((a, b) => b.score - a.score);

        console.log(`After filtering: ${scoredBooks.length} unique books`);

        // Take top book from this AI recommendation
        if (scoredBooks.length > 0) {
          for (const topBook of scoredBooks) {
            // CHECK AGAIN here before adding to final list
            const bookId = topBook.id;
            const bookISBN = topBook.isbn;
            const bookTitle = topBook.title;
            
            // Skip if book was already interacted with
            if (dislikedBookIds.has(bookId) || revealedBookIds.has(bookId) || toReadBookIds.has(bookId) || likedBookIds.has(bookId)) {
              console.log(`⚠️ FINAL CHECK: Skipping "${topBook.volumeInfo?.title}" - ID already in user history`);
              continue;
            }
            
            if (bookISBN && (libraryISBNs.has(bookISBN) || toReadISBNs.has(bookISBN) || likedISBNs.has(bookISBN) || seenISBNs.has(bookISBN))) {
              console.log(`⚠️ FINAL CHECK: Skipping "${topBook.volumeInfo?.title}" - ISBN already seen`);
              continue;
            }
            
            if (bookTitle && (readBookTitles.has(bookTitle) || seenTitles.has(bookTitle))) {
              console.log(`⚠️ FINAL CHECK: Skipping "${topBook.volumeInfo?.title}" - Title already seen`);
              continue;
            }
            
            const mappedBook = mapToBook(topBook);
            if (!mappedBook) continue; // Skip books without valid ISBN
            
            if (topBook.isbn) seenISBNs.add(topBook.isbn);
            if (topBook.title) seenTitles.add(topBook.title);
            
            mappedBook.aiReasoning = aiRec.reasoning;
            mappedBook.aiFocusArea = aiRec.focusArea;
            mappedBook.emotionalHook = aiRec.emotionalHook;
            
            // Calculate compatibility score based on actual score
            // Score ranges: 50 base + up to 400 from matches
          const rawScore = Math.max(0, topBook.score);
          
          // More generous scoring to reach 80%+
          let compatibilityScore: number;
          if (rawScore >= 200) {
            compatibilityScore = 95 + Math.min(4, Math.floor((rawScore - 200) / 50)); // 95-99%
          } else if (rawScore >= 150) {
            compatibilityScore = 88 + Math.floor((rawScore - 150) / 7); // 88-94%
          } else if (rawScore >= 100) {
            compatibilityScore = 80 + Math.floor((rawScore - 100) / 6); // 80-87%
          } else if (rawScore >= 70) {
            compatibilityScore = 70 + Math.floor((rawScore - 70) / 3); // 70-79%
          } else if (rawScore >= 50) {
            compatibilityScore = 60 + Math.floor((rawScore - 50) / 2); // 60-69%
          } else {
            compatibilityScore = 50 + Math.floor(rawScore / 5); // 50-59%
          }
          
          mappedBook.compatibilityScore = Math.min(99, compatibilityScore);
          
          // Add books with 70% or higher compatibility
          if (mappedBook.compatibilityScore >= 70) {
            allBooks.push(mappedBook);
            console.log(`✓ Added book: "${mappedBook.title}" by ${mappedBook.author} (Score: ${topBook.score}, Compatibility: ${mappedBook.compatibilityScore}%, ISBN: ${mappedBook.isbn})`);
            break; // Only take one book per AI recommendation
          } else {
            console.log(`✗ Skipped book (below 70%): "${mappedBook.title}" (${mappedBook.compatibilityScore}%)`);
          }
          }
        }
      } catch (error) {
        console.error('Error fetching AI recommendation:', error);
      }
    }

    console.log(`\n=== Total books found: ${allBooks.length} ===`);

    // If we don't have 3 books, try to get more AI recommendations
    if (allBooks.length < 3) {
      console.log(`⚠️ Only ${allBooks.length} books found. Need ${3 - allBooks.length} more.`);
      console.log('Requesting additional AI recommendations...');
      
      // Try to get more recommendations from AI
      const additionalRecs = await generateAIRecommendations(userProfile);
      
      for (const aiRec of additionalRecs) {
        if (allBooks.length >= 3) break;
        
        try {
          const searchResults = await searchGoogleBooks(aiRec.searchQuery, userProfile.language);
          
          if (searchResults.length > 0) {
            const effectivePreferences = {
              ...user.preferences,
              genres: effectiveGenres
            };
            const scoredBooks = searchResults.map((book: any) => ({
              ...book,
              score: scoreBook(book, effectivePreferences, user.likedBooks, user.dislikedBooks)
            }));
            
            scoredBooks.sort((a, b) => b.score - a.score);
            
            for (const topBook of scoredBooks.slice(0, 2)) {
              if (allBooks.length >= 3) break;
              
              const bookISBN = topBook.volumeInfo.industryIdentifiers?.[0]?.identifier;
              const bookTitle = topBook.volumeInfo.title?.toLowerCase().trim();
              const bookId = topBook.id;
              
              // Apply same exclusion logic as main loop
              const isExcluded = 
                (bookId && (dislikedBookIds.has(bookId) || revealedBookIds.has(bookId) || seenBookIds.has(bookId) || toReadBookIds.has(bookId) || likedBookIds.has(bookId))) ||
                (bookISBN && (libraryISBNs.has(bookISBN) || toReadISBNs.has(bookISBN) || likedISBNs.has(bookISBN) || seenISBNs.has(bookISBN))) ||
                (bookTitle && (readBookTitles.has(bookTitle) || seenTitles.has(bookTitle)));
              
              if (isExcluded) {
                console.log(`Skipping additional book "${topBook.volumeInfo.title}" - already excluded`);
                continue;
              }
              
              if (bookISBN) seenISBNs.add(bookISBN);
              if (bookTitle) seenTitles.add(bookTitle);
              
              const mappedBook = mapToBook(topBook);
              if (!mappedBook) continue;
              
              mappedBook.aiReasoning = aiRec.reasoning;
              mappedBook.aiFocusArea = aiRec.focusArea;
              mappedBook.emotionalHook = aiRec.emotionalHook;
              
              const rawScore = Math.max(0, topBook.score);
              let compatibilityScore: number;
              if (rawScore >= 200) {
                compatibilityScore = 95 + Math.min(4, Math.floor((rawScore - 200) / 50));
              } else if (rawScore >= 150) {
                compatibilityScore = 88 + Math.floor((rawScore - 150) / 7);
              } else if (rawScore >= 100) {
                compatibilityScore = 80 + Math.floor((rawScore - 100) / 6);
              } else if (rawScore >= 70) {
                compatibilityScore = 70 + Math.floor((rawScore - 70) / 3);
              } else if (rawScore >= 50) {
                compatibilityScore = 60 + Math.floor((rawScore - 50) / 2);
              } else {
                compatibilityScore = 50 + Math.floor(rawScore / 5);
              }
              
              mappedBook.compatibilityScore = Math.min(99, compatibilityScore);
              
              // Add books with 70% or higher compatibility
              if (mappedBook.compatibilityScore >= 70) {
                allBooks.push(mappedBook);
                console.log(`✓ Added additional book: "${mappedBook.title}" (${mappedBook.compatibilityScore}%)`);
              } else {
                console.log(`✗ Skipped additional book (below 70%): "${mappedBook.title}" (${mappedBook.compatibilityScore}%)`);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching additional recommendation:', error);
        }
      }
    }

    // If still don't have 3 books, try with lower threshold but still show compatibility
    if (allBooks.length < 3) {
      console.log(`⚠️ Only ${allBooks.length} books with 80%+. Trying to find more quality matches...`);
      
      // Try one more round with genre-specific searches (language-aware)
      const isSpanish = userProfile.language === 'es';
      const defaultGenres = isSpanish 
        ? ['novela', 'literatura', 'ficción'] 
        : ['fiction', 'novel', 'literature'];
      
      const genreSearches = (user.preferences?.genres || defaultGenres).slice(0, 3).map((genre: string) => ({
        searchQuery: isSpanish 
          ? `subject:${genre.toLowerCase()} español OR novela` 
          : `subject:${genre.toLowerCase()} bestseller`,
        reasoning: `Bestseller en ${genre} para ti`,
        focusArea: 'Género preferido'
      }));
      
      // Add Spanish-specific searches if language is Spanish
      if (isSpanish && genreSearches.length < 3) {
        genreSearches.push({
          searchQuery: 'inauthor:Gabriel García Márquez OR inauthor:Isabel Allende',
          reasoning: 'Autores clásicos en español',
          focusArea: 'Literatura hispana'
        });
      }
      
      for (const search of genreSearches) {
        if (allBooks.length >= 3) break;
        
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
              search.searchQuery
            )}&maxResults=20&orderBy=relevance&langRestrict=${langRestrict}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.items) {
              const scoredBooks = data.items
                .map((item: any) => {
                  const isbn = item.volumeInfo.industryIdentifiers?.find(
                    (id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
                  )?.identifier;
                  const title = item.volumeInfo.title?.toLowerCase().trim();
                  const bookLanguage = item.volumeInfo.language;
                  const bookId = item.id;
                  
                  // Skip if book language doesn't match user preference
                  if (langRestrict !== 'en' && bookLanguage && bookLanguage !== langRestrict) {
                    return null;
                  }
                  
                  // Skip if already seen by ID, ISBN, or title
                  if (
                    seenBookIds.has(bookId) ||
                    (isbn && seenISBNs.has(isbn)) ||
                    (title && seenTitles.has(title))
                  ) {
                    return null;
                  }
                  
                  return {
                    ...item,
                    isbn,
                    title,
                    score: scoreBook(item, { ...user.preferences, genres: effectiveGenres }, user.likedBooks, user.dislikedBooks)
                  };
                })
                .filter((book): book is any => book !== null)
                .sort((a, b) => b.score - a.score);
              
              for (const topBook of scoredBooks.slice(0, 2)) {
                if (allBooks.length >= 3) break;
                
                if (topBook.isbn) seenISBNs.add(topBook.isbn);
                if (topBook.title) seenTitles.add(topBook.title);
                
                const mappedBook = mapToBook(topBook);
                if (!mappedBook) continue; // Skip if mapping failed
                mappedBook.aiReasoning = search.reasoning;
                mappedBook.aiFocusArea = search.focusArea;
                mappedBook.emotionalHook = search.emotionalHook;
                
                const rawScore = Math.max(0, topBook.score);
                let compatibilityScore: number;
                if (rawScore >= 200) {
                  compatibilityScore = 95 + Math.min(4, Math.floor((rawScore - 200) / 50));
                } else if (rawScore >= 150) {
                  compatibilityScore = 88 + Math.floor((rawScore - 150) / 7);
                } else if (rawScore >= 100) {
                  compatibilityScore = 80 + Math.floor((rawScore - 100) / 6);
                } else if (rawScore >= 70) {
                  compatibilityScore = 70 + Math.floor((rawScore - 70) / 3);
                } else if (rawScore >= 50) {
                  compatibilityScore = 60 + Math.floor((rawScore - 50) / 2);
                } else {
                  compatibilityScore = 50 + Math.floor(rawScore / 5);
                }
                
                mappedBook.compatibilityScore = Math.min(99, compatibilityScore);
                
                // Accept books with 60%+ in this fallback round
                if (mappedBook.compatibilityScore >= 60) {
                  allBooks.push(mappedBook);
                  console.log(`✓ Added fallback book: "${mappedBook.title}" (${mappedBook.compatibilityScore}%)`);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error in fallback search:', error);
        }
      }
    }

    // Final message
    if (allBooks.length === 0) {
      console.log('⚠️ No books found matching your profile. Try adjusting your preferences.');
    } else if (allBooks.length < 3) {
      console.log(`ℹ️ Found ${allBooks.length} quality matches for your profile.`);
    }

    console.log('=== FINAL RECOMMENDATIONS ===');
    allBooks.forEach((b, i) => {
      console.log(`\n${i + 1}. "${b.title}" by ${b.author}`);
      console.log(`   📊 Compatibility: ${b.compatibilityScore}%`);
      console.log(`   💡 Reason: ${b.aiReasoning}`);
      console.log(`   🎯 Focus: ${b.aiFocusArea}`);
      console.log(`   📚 Categories: ${b.categories?.join(', ') || 'N/A'}`);
    });

    // CACHE DISABLED - We need fresh recommendations each time
    // to properly exclude books the user has interacted with

    // Return only books with 80%+ compatibility
    return allBooks.slice(0, 3);
  } catch (error) {
    console.error('AI recommendation error, using fallback:', error);
    return fetchRandomBooks(user.preferences, user.library);
  }
}

export const fetchRandomBooks = async (
  preferences?: UserPreferences,
  library?: LibraryBook[]
): Promise<RecommendedBook[]> => {
  try {
    const books: RecommendedBook[] = [];
    const fetchedIds = new Set<string>();
    const libraryISBNs = new Set(library?.map(b => b.isbn) || []);
    
    // Try to fetch 3 diverse books using different strategies
    for (let i = 0; i < 3; i++) {
      const query = buildSearchQuery(preferences, library, i);
      const cacheKey = `${query}-${preferences?.language || 'en'}-${i}`;
      
      // Check cache first
      let data;
      const cached = bookCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        data = cached.data;
      } else {
        const params = new URLSearchParams({
          q: query,
          maxResults: '40',
          orderBy: 'relevance',
          langRestrict: preferences?.language || 'en',
          printType: 'books'
        });

        const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
        
        if (!response.ok) {
          console.error(`API request failed for query: ${query}`);
          continue;
        }

        data = await response.json();
        
        // Cache the result
        bookCache.set(cacheKey, { data, timestamp: Date.now() });
      }
      
      if (!data.items || data.items.length === 0) continue;

      // Score and sort books
      const scoredBooks = data.items
        .map((item: any) => ({
          item,
          score: scoreBook(item, preferences)
        }))
        .sort((a: any, b: any) => b.score - a.score);

      // Find a unique, high-quality book not in library
      let bookData;
      for (const { item } of scoredBooks) {
        const isbn = item.volumeInfo.industryIdentifiers?.find((id: any) => 
          id.type === 'ISBN_13' || id.type === 'ISBN_10'
        )?.identifier;
        
        if (!fetchedIds.has(item.id) && !libraryISBNs.has(isbn)) {
          bookData = item;
          break;
        }
      }

      if (!bookData) continue;

      fetchedIds.add(bookData.id);
      const volumeInfo = bookData.volumeInfo;
      const isbn = volumeInfo.industryIdentifiers?.find((id: any) => 
        id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier;

      books.push({
        id: bookData.id,
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors?.[0] || 'Unknown Author',
        cover: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 
               volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:') ||
               'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
        description: volumeInfo.description?.substring(0, 300) + '...' || 'No description available.',
        amazonLink: isbn 
          ? `https://www.amazon.com/dp/${isbn}?tag=${AMAZON_AFFILIATE_TAG}` 
          : `https://www.amazon.com/s?k=${encodeURIComponent(volumeInfo.title + ' ' + volumeInfo.authors?.[0])}&tag=${AMAZON_AFFILIATE_TAG}`,
        compatibilityScore: Math.floor(Math.random() * 25) + 55 // 55-80% for random books
      });
    }

    // If we couldn't get 3 books, fill with fallback
    while (books.length < 3) {
      const fallbackBook = await fetchFallbackBook(preferences, library, fetchedIds, libraryISBNs);
      if (fallbackBook && !fetchedIds.has(fallbackBook.id)) {
        fallbackBook.compatibilityScore = Math.floor(Math.random() * 20) + 50; // 50-70% for fallback
        books.push(fallbackBook);
        fetchedIds.add(fallbackBook.id);
      } else {
        break;
      }
    }

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

const fetchFallbackBook = async (
  preferences?: UserPreferences,
  library?: LibraryBook[],
  excludeIds?: Set<string>,
  excludeISBNs?: Set<string>
): Promise<Book | null> => {
  try {
    const query = preferences?.genres?.[0] 
      ? `subject:${preferences.genres[0]}` 
      : 'subject:bestseller';
    
    const params = new URLSearchParams({
      q: query,
      maxResults: '40',
      orderBy: 'relevance',
      langRestrict: preferences?.language || 'en',
      printType: 'books'
    });

    const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
    
    if (!response.ok) return null;

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) return null;

    for (const item of data.items) {
      const isbn = item.volumeInfo.industryIdentifiers?.find((id: any) => 
        id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier;
      
      if (excludeIds?.has(item.id) || excludeISBNs?.has(isbn)) continue;

      const volumeInfo = item.volumeInfo;
      return {
        id: item.id,
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors?.[0] || 'Unknown Author',
        cover: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 
               'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
        description: volumeInfo.description?.substring(0, 300) + '...' || 'No description available.',
        amazonLink: isbn 
          ? `https://www.amazon.com/dp/${isbn}?tag=${AMAZON_AFFILIATE_TAG}` 
          : `https://www.amazon.com/s?k=${encodeURIComponent(volumeInfo.title + ' ' + volumeInfo.authors?.[0])}&tag=${AMAZON_AFFILIATE_TAG}`
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching fallback book:', error);
    return null;
  }
};

// Keep original function for backward compatibility
export const fetchRandomBook = async (
  preferences?: UserPreferences,
  library?: LibraryBook[]
): Promise<Book> => {
  const books = await fetchRandomBooks(preferences, library);
  return books[0];
};

export const fetchBookByISBN = async (isbn: string): Promise<BookByISBN> => {
  try {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    
    // Check cache first
    const cacheKey = `isbn-${cleanISBN}`;
    const cached = bookCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const response = await fetch(`${GOOGLE_BOOKS_API}?q=isbn:${cleanISBN}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Book not found');
    }

    const book = data.items[0].volumeInfo;
    const industryIdentifiers = book.industryIdentifiers || [];
    const isbnData = industryIdentifiers.find((id: any) => 
      id.type === 'ISBN_13' || id.type === 'ISBN_10'
    );

    const result = {
      id: data.items[0].id,
      isbn: isbnData?.identifier || cleanISBN,
      title: book.title || 'Unknown Title',
      author: book.authors?.join(', ') || 'Unknown Author',
      cover: book.imageLinks?.thumbnail?.replace('http:', 'https:') || 
             book.imageLinks?.smallThumbnail?.replace('http:', 'https:') ||
             'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
      description: book.description || 'No description available.',
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      pageCount: book.pageCount,
      amazonLink: isbnData?.identifier 
        ? `https://www.amazon.com/dp/${isbnData.identifier}?tag=${AMAZON_AFFILIATE_TAG}` 
        : undefined
    };
    
    // Cache the result
    bookCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw error;
  }
};

// Analytics tracking function
export const trackAmazonClick = (userId: string | undefined, bookId: string, bookTitle: string) => {
  try {
    const clicks = JSON.parse(localStorage.getItem('thoth_amazon_clicks') || '[]');
    
    clicks.push({
      userId: userId || 'guest',
      bookId,
      bookTitle,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('thoth_amazon_clicks', JSON.stringify(clicks));
    
    console.log('Amazon click tracked:', { userId, bookId, bookTitle });
  } catch (error) {
    console.error('Error tracking Amazon click:', error);
  }
};