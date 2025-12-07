-- Create users table extension
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  genres TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en',
  reading_duration TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create book history table
CREATE TABLE IF NOT EXISTS public.book_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[] DEFAULT '{}',
  description TEXT,
  cover_url TEXT,
  revealed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT
);

-- Create library table
CREATE TABLE IF NOT EXISTS public.library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT NOT NULL,
  isbn TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT,
  pages INTEGER,
  status TEXT DEFAULT 'to-read',
  current_page INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create to_read table
CREATE TABLE IF NOT EXISTS public.to_read (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT,
  isbn TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create liked_books table
CREATE TABLE IF NOT EXISTS public.liked_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create disliked_books table
CREATE TABLE IF NOT EXISTS public.disliked_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT,
  disliked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_book_history_user_id ON public.book_history(user_id);
CREATE INDEX IF NOT EXISTS idx_book_history_revealed_at ON public.book_history(revealed_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_user_id ON public.library(user_id);
CREATE INDEX IF NOT EXISTS idx_to_read_user_id ON public.to_read(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_books_user_id ON public.liked_books(user_id);
CREATE INDEX IF NOT EXISTS idx_disliked_books_user_id ON public.disliked_books(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.to_read ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disliked_books ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for book_history
CREATE POLICY "Users can view own book history"
  ON public.book_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own book history"
  ON public.book_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own book history"
  ON public.book_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own book history"
  ON public.book_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for library
CREATE POLICY "Users can view own library"
  ON public.library FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own library"
  ON public.library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own library"
  ON public.library FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own library"
  ON public.library FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for to_read
CREATE POLICY "Users can view own to_read"
  ON public.to_read FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own to_read"
  ON public.to_read FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own to_read"
  ON public.to_read FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for liked_books
CREATE POLICY "Users can view own liked_books"
  ON public.liked_books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own liked_books"
  ON public.liked_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for disliked_books
CREATE POLICY "Users can view own disliked_books"
  ON public.disliked_books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disliked_books"
  ON public.disliked_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
