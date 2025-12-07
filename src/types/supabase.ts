export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          genres: string[]
          language: string
          reading_duration: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          genres?: string[]
          language?: string
          reading_duration?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          genres?: string[]
          language?: string
          reading_duration?: string
          created_at?: string
          updated_at?: string
        }
      }
      book_history: {
        Row: {
          id: string
          user_id: string
          book_id: string
          title: string
          authors: string[]
          description: string | null
          cover_url: string | null
          revealed_at: string
          rating: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          title: string
          authors?: string[]
          description?: string | null
          cover_url?: string | null
          revealed_at?: string
          rating?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          title?: string
          authors?: string[]
          description?: string | null
          cover_url?: string | null
          revealed_at?: string
          rating?: number | null
          notes?: string | null
        }
      }
      library: {
        Row: {
          id: string
          user_id: string
          book_id: string
          isbn: string
          title: string
          author: string
          cover: string | null
          pages: number | null
          status: string
          current_page: number
          rating: number | null
          notes: string | null
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          isbn: string
          title: string
          author: string
          cover?: string | null
          pages?: number | null
          status?: string
          current_page?: number
          rating?: number | null
          notes?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          isbn?: string
          title?: string
          author?: string
          cover?: string | null
          pages?: number | null
          status?: string
          current_page?: number
          rating?: number | null
          notes?: string | null
          added_at?: string
        }
      }
      to_read: {
        Row: {
          id: string
          user_id: string
          book_id: string
          title: string
          author: string
          cover: string | null
          isbn: string | null
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          title: string
          author: string
          cover?: string | null
          isbn?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          title?: string
          author?: string
          cover?: string | null
          isbn?: string | null
          added_at?: string
        }
      }
      liked_books: {
        Row: {
          id: string
          user_id: string
          book_id: string
          title: string
          author: string
          cover: string | null
          liked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          title: string
          author: string
          cover?: string | null
          liked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          title?: string
          author?: string
          cover?: string | null
          liked_at?: string
        }
      }
      disliked_books: {
        Row: {
          id: string
          user_id: string
          book_id: string
          title: string
          author: string
          cover: string | null
          disliked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          title: string
          author: string
          cover?: string | null
          disliked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          title?: string
          author?: string
          cover?: string | null
          disliked_at?: string
        }
      }
    }
  }
}
