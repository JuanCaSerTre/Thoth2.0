-- Add isbn column to liked_books table
ALTER TABLE public.liked_books ADD COLUMN IF NOT EXISTS isbn TEXT;

-- Add index on book_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_liked_books_book_id ON public.liked_books(book_id);
CREATE INDEX IF NOT EXISTS idx_to_read_book_id ON public.to_read(book_id);
CREATE INDEX IF NOT EXISTS idx_disliked_books_book_id ON public.disliked_books(book_id);
CREATE INDEX IF NOT EXISTS idx_library_book_id ON public.library(book_id);
CREATE INDEX IF NOT EXISTS idx_book_history_book_id ON public.book_history(book_id);
