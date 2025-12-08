import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Heart, Brain, Percent, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { t, language } = useLocalization();

  // Wait for auth to load before checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  // Redirect to onboarding if user hasn't completed it
  if (user && !user.preferences?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // Localized content
  const heroContent = {
    en: {
      badge: 'Your next favorite book awaits',
      question: "Don't know what to read?",
      answer: 'We do.',
      subtitle: 'AI-powered book recommendations that learn from your taste.',
      discover: 'Discover Books',
      start: 'Start Free',
      hasAccount: 'I have an account',
      readers: '+2,500 readers discovering books',
      booksPerSession: 'Books per session',
      aiAccuracy: 'AI Accuracy',
      satisfaction: 'Satisfaction',
    },
    es: {
      badge: 'Tu próximo libro favorito te espera',
      question: '¿No sabes qué leer?',
      answer: 'Nosotros sí.',
      subtitle: 'Recomendaciones de libros personalizadas con IA que aprende de tus gustos.',
      discover: 'Descubrir Libros',
      start: 'Comenzar Gratis',
      hasAccount: 'Ya tengo cuenta',
      readers: '+2,500 lectores descubriendo libros',
      booksPerSession: 'Libros por sesión',
      aiAccuracy: 'Precisión IA',
      satisfaction: 'Satisfacción',
    },
    fr: {
      badge: 'Votre prochain livre préféré vous attend',
      question: 'Vous ne savez pas quoi lire?',
      answer: 'Nous oui.',
      subtitle: 'Recommandations de livres personnalisées par IA qui apprend de vos goûts.',
      discover: 'Découvrir des Livres',
      start: 'Commencer Gratuitement',
      hasAccount: "J'ai un compte",
      readers: '+2,500 lecteurs découvrant des livres',
      booksPerSession: 'Livres par session',
      aiAccuracy: 'Précision IA',
      satisfaction: 'Satisfaction',
    },
    pt: {
      badge: 'Seu próximo livro favorito espera',
      question: 'Não sabe o que ler?',
      answer: 'Nós sabemos.',
      subtitle: 'Recomendações de livros personalizadas com IA que aprende seus gostos.',
      discover: 'Descobrir Livros',
      start: 'Começar Grátis',
      hasAccount: 'Já tenho conta',
      readers: '+2,500 leitores descobrindo livros',
      booksPerSession: 'Livros por sessão',
      aiAccuracy: 'Precisão IA',
      satisfaction: 'Satisfação',
    },
    de: {
      badge: 'Dein nächstes Lieblingsbuch wartet',
      question: 'Weißt du nicht, was du lesen sollst?',
      answer: 'Wir schon.',
      subtitle: 'KI-gestützte Buchempfehlungen, die von deinem Geschmack lernen.',
      discover: 'Bücher Entdecken',
      start: 'Kostenlos Starten',
      hasAccount: 'Ich habe ein Konto',
      readers: '+2,500 Leser entdecken Bücher',
      booksPerSession: 'Bücher pro Sitzung',
      aiAccuracy: 'KI-Genauigkeit',
      satisfaction: 'Zufriedenheit',
    },
    it: {
      badge: 'Il tuo prossimo libro preferito ti aspetta',
      question: 'Non sai cosa leggere?',
      answer: 'Noi sì.',
      subtitle: 'Raccomandazioni di libri personalizzate con IA che impara dai tuoi gusti.',
      discover: 'Scopri Libri',
      start: 'Inizia Gratis',
      hasAccount: 'Ho già un account',
      readers: '+2,500 lettori che scoprono libri',
      booksPerSession: 'Libri per sessione',
      aiAccuracy: 'Precisione IA',
      satisfaction: 'Soddisfazione',
    },
  };

  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-24 md:mb-32 relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-10 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-amber-500/8 rounded-full blur-3xl" />
            <div className="absolute top-32 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {content.badge}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-6 sm:mb-8 tracking-tight"
          >
            THOTH
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-foreground/80 max-w-3xl mx-auto mb-4 sm:mb-5 leading-snug px-4"
          >
            {content.question}
            <br />
            <span className="font-semibold text-foreground">
              {content.answer}
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-12 font-light leading-relaxed px-4"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 sm:space-y-5 px-4"
          >
            {user ? (
              <Link to="/profile">
                <Button
                  size="lg"
                  className="text-sm sm:text-base px-8 sm:px-12 py-5 sm:py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105 font-semibold group"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  {content.discover}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="text-sm sm:text-base px-8 sm:px-12 py-5 sm:py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105 font-semibold group w-full sm:w-auto"
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      {content.start}
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-sm sm:text-base px-6 sm:px-10 py-5 sm:py-7 rounded-full border-2 hover:bg-muted transition-all duration-300 hover:scale-105 font-medium w-full sm:w-auto"
                    >
                      {content.hasAccount}
                    </Button>
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-light flex items-center justify-center gap-2 mt-3 sm:mt-4">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {content.readers}
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-16 sm:mb-24 max-w-2xl mx-auto px-2"
        >
          <div className="text-center p-3 sm:p-5 md:p-7 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
            <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-amber-600 mb-1 sm:mb-2">3</div>
            <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{content.booksPerSession}</div>
          </div>
          <div className="text-center p-3 sm:p-5 md:p-7 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
            <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-amber-600 mb-1 sm:mb-2">95%</div>
            <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{content.aiAccuracy}</div>
          </div>
          <div className="text-center p-3 sm:p-5 md:p-7 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
            <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-amber-600 mb-1 sm:mb-2">∞</div>
            <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{language === 'en' ? 'Books available' : language === 'es' ? 'Libros disponibles' : language === 'fr' ? 'Livres disponibles' : language === 'pt' ? 'Livros disponíveis' : language === 'de' ? 'Bücher verfügbar' : 'Libri disponibili'}</div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-24 px-2"
        >
          <div className="group relative bg-card border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">IA que te conoce</h3>
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              Aprende de cada libro que evalúas para entender tu gusto único
            </p>
          </div>

          <div className="group relative bg-card border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">Explora y elige</h3>
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              Ve 3 recomendaciones personalizadas y guarda las que te interesen
            </p>
          </div>

          <div className="group relative bg-card border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
              <Percent className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">% de compatibilidad</h3>
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              Cada libro muestra qué tan compatible es con tu perfil lector
            </p>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-16 sm:mb-24 px-2"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Cómo Funciona
          </h2>
          <p className="text-muted-foreground mb-8 sm:mb-12 text-sm sm:text-base">
            3 pasos simples para encontrar tu próximo libro
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg sm:text-xl mb-4 sm:mb-5 shadow-lg">
                1
              </div>
              <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Crea tu perfil</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Responde preguntas sobre tus gustos y personalidad lectora
              </p>
            </div>
            
            <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg sm:text-xl mb-4 sm:mb-5 shadow-lg">
                2
              </div>
              <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Elige tus favoritos</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Guarda los libros que te interesan. La IA aprende de cada decisión
              </p>
            </div>
            
            <div className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg sm:text-xl mb-4 sm:mb-5 shadow-lg">
                3
              </div>
              <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Lee y repite</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Marca libros como leídos y obtén recomendaciones cada vez mejores
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why Different Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/30 dark:border-amber-800/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-3xl mx-auto mx-2 sm:mx-auto"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 text-center">
            ¿Por qué THOTH?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs sm:text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">Sin parálisis de elección</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Solo 3 opciones perfectas</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs sm:text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">IA que evoluciona</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Mejora con cada elección</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs sm:text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">Perfil psicológico</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Entiende tu personalidad</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs sm:text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">100% gratis</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Apóyanos comprando en Amazon</p>
              </div>
            </div>
          </div>
          
          {/* Support message */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-amber-200/30 dark:border-amber-800/20 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground px-2">
              💛 THOTH es gratis gracias a las comisiones de Amazon. Al comprar a través de nuestros enlaces, 
              nos ayudas a seguir mejorando sin que te cueste nada extra.
            </p>
          </div>
        </motion.div>
      </main>
      
      <footer className="text-center py-8 sm:py-10 text-muted-foreground text-xs sm:text-sm border-t border-border/50 mt-12 sm:mt-20 px-4">
        <p>© 2025 THOTH · Descubre tu próximo libro favorito</p>
      </footer>
    </div>
  );
}