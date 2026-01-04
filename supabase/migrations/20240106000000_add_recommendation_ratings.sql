CREATE TABLE IF NOT EXISTS public.recommendation_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  book_title TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recommendation_ratings_user_id ON public.recommendation_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_ratings_book_id ON public.recommendation_ratings(book_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_ratings_rating ON public.recommendation_ratings(rating);
