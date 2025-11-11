interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
}

interface BookByISBN extends Book {
  isbn: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
}

interface LibraryBook {
  isbn: string;
  title: string;
  author: string;
}

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const AMAZON_AFFILIATE_TAG = 'thoth-20'; // Replace with your actual Amazon affiliate tag

export const fetchRandomBooks = async (preferences?: {
  genres?: string[];
  language?: string;
}, library?: LibraryBook[]): Promise<Book[]> => {
  try {
    const books: Book[] = [];
    const fetchedIds = new Set<string>();

    // Fetch 3 different books
    for (let i = 0; i < 3; i++) {
      let query = 'subject:fiction';
      
      if (library && library.length > 0 && i === 0) {
        const randomLibraryBook = library[Math.floor(Math.random() * library.length)];
        const authorQuery = randomLibraryBook.author.split(' ').slice(-1)[0];
        query = `inauthor:${authorQuery}`;
      } else if (preferences?.genres && preferences.genres.length > 0) {
        const randomGenre = preferences.genres[Math.floor(Math.random() * preferences.genres.length)];
        query = `subject:${randomGenre}`;
      }

      const params = new URLSearchParams({
        q: query,
        maxResults: '40',
        orderBy: 'relevance',
        langRestrict: preferences?.language || 'en',
        printType: 'books'
      });

      const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
      
      if (!response.ok) continue;

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) continue;

      // Find a unique book
      let attempts = 0;
      let bookData;
      do {
        const randomIndex = Math.floor(Math.random() * data.items.length);
        bookData = data.items[randomIndex];
        attempts++;
      } while (fetchedIds.has(bookData.id) && attempts < 10);

      if (fetchedIds.has(bookData.id)) continue;

      fetchedIds.add(bookData.id);
      const book = bookData.volumeInfo;
      const isbn = book.industryIdentifiers?.find((id: any) => 
        id.type === 'ISBN_13' || id.type === 'ISBN_10'
      )?.identifier;

      books.push({
        id: bookData.id,
        title: book.title || 'Unknown Title',
        author: book.authors?.[0] || 'Unknown Author',
        cover: book.imageLinks?.thumbnail?.replace('http:', 'https:') || 
               'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
        description: book.description || 'No description available.',
        amazonLink: isbn ? `https://www.amazon.com/dp/${isbn}?tag=${AMAZON_AFFILIATE_TAG}` : undefined
      });
    }

    // If we couldn't get 3 books, fill with generic ones
    while (books.length < 3) {
      const fallbackBook = await fetchRandomBook(preferences, library);
      if (!fetchedIds.has(fallbackBook.id)) {
        books.push(fallbackBook);
        fetchedIds.add(fallbackBook.id);
      }
    }

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const fetchRandomBook = async (preferences?: {
  genres?: string[];
  language?: string;
}, library?: LibraryBook[]): Promise<Book> => {
  try {
    let query = 'subject:fiction';
    
    if (library && library.length > 0) {
      const randomLibraryBook = library[Math.floor(Math.random() * library.length)];
      const authorQuery = randomLibraryBook.author.split(' ').slice(-1)[0];
      query = `inauthor:${authorQuery}`;
    } else if (preferences?.genres && preferences.genres.length > 0) {
      query = `subject:${preferences.genres[0]}`;
    }

    const params = new URLSearchParams({
      q: query,
      maxResults: '40',
      orderBy: 'relevance',
      langRestrict: preferences?.language || 'en',
      printType: 'books'
    });

    const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No books found');
    }

    const randomIndex = Math.floor(Math.random() * data.items.length);
    const book = data.items[randomIndex].volumeInfo;
    const isbn = book.industryIdentifiers?.find((id: any) => 
      id.type === 'ISBN_13' || id.type === 'ISBN_10'
    )?.identifier;

    return {
      id: data.items[randomIndex].id,
      title: book.title || 'Unknown Title',
      author: book.authors?.[0] || 'Unknown Author',
      cover: book.imageLinks?.thumbnail?.replace('http:', 'https:') || 
             'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
      description: book.description || 'No description available.',
      amazonLink: isbn ? `https://www.amazon.com/dp/${isbn}?tag=${AMAZON_AFFILIATE_TAG}` : undefined
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

export const fetchBookByISBN = async (isbn: string): Promise<BookByISBN> => {
  try {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
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

    return {
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
      pageCount: book.pageCount
    };
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw error;
  }
};