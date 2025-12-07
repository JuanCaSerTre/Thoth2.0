# 📚 THOTH - Smart Book Discovery App

THOTH is an AI-powered book recommendation system that learns from your preferences and reading behavior to suggest personalized book recommendations.

## ✨ Features

- **AI-Powered Recommendations**: Uses Google Gemini AI to analyze your reading preferences and suggest books
- **Continuous Learning**: The system improves recommendations based on your likes, dislikes, and reading history
- **Multi-Language Support**: Get recommendations in English, Spanish, French, German, Italian, or Portuguese
- **Amazon Affiliate Integration**: Purchase recommended books directly through Amazon
- **Reading Progress Tracking**: Track your reading journey with library management and progress indicators
- **Barcode Scanner**: Add books to your library by scanning ISBN barcodes
- **Personalized Onboarding**: Answer questions about your reading preferences to get started

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Amazon Associates account (optional, for affiliate links)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in Tempo project settings:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
   - `VITE_AMAZON_AFFILIATE_TAG`: Your Amazon Associates tag (optional, defaults to 'thoth02-22')

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + ShadCN UI components
- **AI**: Google Gemini API
- **Animations**: Framer Motion
- **Book Data**: Google Books API
- **State Management**: React Context API
- **Storage**: LocalStorage (for MVP)

## 📖 How It Works

1. **Onboarding**: Users answer questions about their reading preferences, goals, and personality
2. **AI Analysis**: Google Gemini analyzes the user profile and generates personalized search queries
3. **Book Fetching**: The system queries Google Books API with AI-generated searches
4. **Smart Scoring**: Books are scored based on compatibility with user preferences (80%+ target)
5. **Continuous Learning**: As users like/dislike books, the AI learns and improves future recommendations

### Learning Levels

- **Nuevo (0 interactions)**: Uses declared preferences
- **Aprendiendo (1-4 interactions)**: Starts detecting patterns
- **Conociendo (5-14 interactions)**: Combines patterns with preferences
- **Establecido (15-29 interactions)**: Well-established profile
- **Experto (30+ interactions)**: Expert-level personalization

## 🔧 Configuration

### Amazon Affiliate Tag

Update your Amazon Associates tag in project settings or it will default to 'thoth02-22'.

### Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Google Gemini AI for powering recommendations
- Google Books API for book data
- Amazon Associates for affiliate program
- ShadCN UI for beautiful components
