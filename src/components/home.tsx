import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Heart, Brain, Percent, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();

  // Si el usuario está logueado pero no completó el onboarding, redirigir
  if (user && !user.preferences?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-24 md:mb-32 relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl" />
            <div className="absolute top-32 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8"
          >
            <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-sm font-medium text-amber-700 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
              Tu próximo libro favorito te espera
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 tracking-tight"
          >
            THOTH
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground/80 max-w-3xl mx-auto mb-5 leading-snug"
          >
            ¿No sabes qué leer?
            <br />
            <span className="font-semibold text-foreground">
              Nosotros sí.
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12 font-light leading-relaxed"
          >
            Recomendaciones de libros personalizadas con IA que aprende de tus gustos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-5"
          >
            {user ? (
              <Link to="/profile">
                <Button
                  size="lg"
                  className="text-base px-12 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105 font-semibold group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Descubrir Libros
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="text-base px-12 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105 font-semibold group w-full sm:w-auto"
                    >
                      <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Comenzar Gratis
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base px-10 py-7 rounded-full border-2 hover:bg-muted transition-all duration-300 hover:scale-105 font-medium w-full sm:w-auto"
                    >
                      Ya tengo cuenta
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground font-light flex items-center justify-center gap-2 mt-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  +2,500 lectores descubriendo libros
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
          className="grid grid-cols-3 gap-4 md:gap-8 mb-24 max-w-2xl mx-auto"
        >
          <div className="text-center p-5 md:p-7 bg-card rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
            <div className="text-3xl md:text-5xl font-bold text-amber-600 mb-2">3</div>
            <div className="text-xs md:text-sm text-muted-foreground">Libros por sesión</div>
          </div>
          <div className="text-center p-5 md:p-7 bg-card rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
            <div className="text-3xl md:text-5xl font-bold text-amber-600 mb-2">95%</div>
            <div className="text-xs md:text-sm text-muted-foreground">Precisión IA</div>
          </div>
          <div className="text-center p-5 md:p-7 bg-card rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
            <div className="text-3xl md:text-5xl font-bold text-amber-600 mb-2">∞</div>
            <div className="text-xs md:text-sm text-muted-foreground">Libros disponibles</div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24"
        >
          <div className="group relative bg-card border border-border/50 rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Brain className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">IA que te conoce</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Aprende de cada libro que evalúas para entender tu gusto único
            </p>
          </div>

          <div className="group relative bg-card border border-border/50 rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">Explora y elige</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Ve 3 recomendaciones personalizadas y guarda las que te interesen
            </p>
          </div>

          <div className="group relative bg-card border border-border/50 rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Percent className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">% de compatibilidad</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Cada libro muestra qué tan compatible es con tu perfil lector
            </p>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Cómo Funciona
          </h2>
          <p className="text-muted-foreground mb-12">
            3 pasos simples para encontrar tu próximo libro
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="relative p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-xl mb-5 shadow-lg">
                1
              </div>
              <h4 className="font-bold text-foreground mb-3">Crea tu perfil</h4>
              <p className="text-sm text-muted-foreground">
                Responde preguntas sobre tus gustos y personalidad lectora
              </p>
            </div>
            
            <div className="relative p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-xl mb-5 shadow-lg">
                2
              </div>
              <h4 className="font-bold text-foreground mb-3">Elige tus favoritos</h4>
              <p className="text-sm text-muted-foreground">
                Guarda los libros que te interesan. La IA aprende de cada decisión
              </p>
            </div>
            
            <div className="relative p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto font-bold text-xl mb-5 shadow-lg">
                3
              </div>
              <h4 className="font-bold text-foreground mb-3">Lee y repite</h4>
              <p className="text-sm text-muted-foreground">
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
          className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/30 dark:border-amber-800/20 rounded-3xl p-8 md:p-10 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            ¿Por qué THOTH?
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Sin parálisis de elección</p>
                <p className="text-sm text-muted-foreground">Solo 3 opciones perfectas</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">IA que evoluciona</p>
                <p className="text-sm text-muted-foreground">Mejora con cada elección</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Perfil psicológico</p>
                <p className="text-sm text-muted-foreground">Entiende tu personalidad</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">100% gratis</p>
                <p className="text-sm text-muted-foreground">Apóyanos comprando en Amazon</p>
              </div>
            </div>
          </div>
          
          {/* Support message */}
          <div className="mt-6 pt-6 border-t border-amber-200/30 dark:border-amber-800/20 text-center">
            <p className="text-xs text-muted-foreground">
              💛 THOTH es gratis gracias a las comisiones de Amazon. Al comprar a través de nuestros enlaces, 
              nos ayudas a seguir mejorando sin que te cueste nada extra.
            </p>
          </div>
        </motion.div>
      </main>
      
      <footer className="text-center py-10 text-muted-foreground text-sm border-t border-border/50 mt-20">
        <p>© 2025 THOTH · Descubre tu próximo libro favorito</p>
      </footer>
    </div>
  );
}