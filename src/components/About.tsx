import { motion } from 'framer-motion';
import { BookOpen, Brain, Heart, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              ¿No sabes qué leer?
            </h1>
            <p className="text-3xl md:text-4xl text-muted-foreground">
              Nosotros sí.
            </p>
          </div>

          {/* Philosophy */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              En un mundo lleno de opciones, la fatiga de decisión se ha convertido en nuestra compañera constante. 
              THOTH existe para eliminar esa carga cuando se trata de tu próxima lectura.
            </p>
            
            <p className="text-xl text-muted-foreground leading-relaxed mt-6">
              Nombrado en honor al dios egipcio de la sabiduría y el conocimiento, THOTH es tu guía literario personal. 
              Creemos que el libro perfecto te encuentra cuando estás listo para él, no cuando estás 
              desplazándote sin fin por listas y reseñas.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Recomendaciones Inteligentes
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Nuestro algoritmo aprende de tus preferencias de lectura, estado de ánimo e historial para sugerir 
                libros que resuenan con tu estado mental actual.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Descubrimiento Serendípico
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A veces los mejores libros son los que nunca supiste que necesitabas. Equilibramos 
                la personalización con sorpresas encantadoras.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Tu Biblioteca Personal
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Registra lo que has leído, escanea libros con tu cámara, y deja que tu historial 
                de lectura moldee las recomendaciones futuras.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Cuidadosamente Curado
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Cada recomendación es cuidadosamente seleccionada para coincidir con tu gusto, asegurando 
                calidad sobre cantidad en tu viaje de lectura.
              </p>
            </motion.div>
          </div>

          {/* How It Works */}
          <div className="mt-20 space-y-8">
            <h2 className="text-4xl font-bold text-foreground text-center">
              Cómo Funciona
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <p>
                  <strong className="text-foreground">Crea tu perfil:</strong> Responde preguntas simples sobre tus 
                  preferencias de lectura, hábitos y libros favoritos.
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <p>
                  <strong className="text-foreground">Haz clic en "Descubrir":</strong> Nuestro algoritmo analiza tu perfil y 
                  presenta tres recomendaciones de libros personalizadas.
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <p>
                  <strong className="text-foreground">Construye tu biblioteca:</strong> Agrega libros que has leído buscando o 
                  escaneando su código ISBN para refinar las recomendaciones futuras.
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <p>
                  <strong className="text-foreground">Descubre y disfruta:</strong> Compra los libros recomendados a través de nuestros 
                  enlaces de afiliados de Amazon y comienza tu próxima aventura de lectura.
                </p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/30 dark:border-amber-800/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              💛 Apoya a THOTH
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              THOTH es completamente gratuito. Cuando compras un libro a través de nuestros enlaces de Amazon, 
              recibimos una pequeña comisión que nos ayuda a mantener y mejorar el servicio. 
              <strong className="text-foreground"> No te cuesta nada extra.</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">Mismo precio de Amazon</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">Apoyas el desarrollo</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">Servicio 100% gratis</span>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center pt-16 border-t border-border">
            <p className="text-muted-foreground text-sm">
              © 2025 THOTH · Construido con pasión
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
