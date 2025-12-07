import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, BookOpen, Target, Flame, Zap, Crown, Rocket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function LearningProgress() {
  const { user } = useAuth();

  if (!user) return null;

  const likedCount = user.likedBooks?.length || 0;
  const dislikedCount = user.dislikedBooks?.length || 0;
  const libraryCount = user.library?.length || 0;
  const totalInteractions = likedCount + dislikedCount + libraryCount;

  const getReaderLevel = () => {
    if (totalInteractions === 0) return { 
      level: 'Explorador Curioso', 
      emoji: '🌱',
      icon: BookOpen,
      progress: 0, 
      next: 5, 
      color: 'from-slate-400 to-slate-500',
      bgColor: 'bg-slate-50 dark:bg-slate-950/20',
      description: 'Tu viaje literario comienza aquí'
    };
    if (totalInteractions < 5) return { 
      level: 'Lector Casual', 
      emoji: '📖',
      icon: BookOpen,
      progress: (totalInteractions / 5) * 100, 
      next: 5, 
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      description: 'Descubriendo nuevos mundos'
    };
    if (totalInteractions < 15) return { 
      level: 'Devorador de Páginas', 
      emoji: '🔥',
      icon: Flame,
      progress: ((totalInteractions - 5) / 10) * 100, 
      next: 15, 
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      description: 'Los libros no pueden escapar de ti'
    };
    if (totalInteractions < 30) return { 
      level: 'Bibliófilo Legendario', 
      emoji: '⚡',
      icon: Zap,
      progress: ((totalInteractions - 15) / 15) * 100, 
      next: 30, 
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      description: 'Tu biblioteca es tu reino'
    };
    if (totalInteractions < 50) return { 
      level: 'Maestro del Conocimiento', 
      emoji: '👑',
      icon: Crown,
      progress: ((totalInteractions - 30) / 20) * 100, 
      next: 50, 
      color: 'from-amber-400 to-yellow-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      description: 'La sabiduría fluye por tus venas'
    };
    return { 
      level: 'Oráculo Literario', 
      emoji: '🚀',
      icon: Rocket,
      progress: 100, 
      next: null, 
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      description: 'THOTH te conoce mejor que nadie'
    };
  };

  const readerData = getReaderLevel();
  const IconComponent = readerData.icon;

  if (totalInteractions === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-gradient-to-br from-card via-card to-amber-50/10 dark:to-amber-950/10 shadow-lg mb-6 overflow-hidden">
        <CardContent className="p-6 relative">
          {/* Decorative background element */}
          <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${readerData.color} opacity-10 blur-2xl`} />
          
          <div className="flex items-center gap-4 mb-4 relative">
            <motion.div 
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${readerData.color} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl">{readerData.emoji}</span>
            </motion.div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                {readerData.level}
                {readerData.level === 'Oráculo Literario' && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </motion.div>
                )}
              </h3>
              <p className="text-sm text-muted-foreground italic">
                {readerData.description}
              </p>
            </div>
          </div>

          <div className="relative mb-2">
            <Progress value={readerData.progress} className="h-3" />
            <motion.div 
              className="absolute -top-1 h-5 w-5 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center"
              style={{ left: `calc(${Math.min(readerData.progress, 95)}% - 10px)` }}
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <IconComponent className="w-3 h-3 text-amber-600" />
            </motion.div>
          </div>

          {readerData.next && (
            <p className="text-xs text-muted-foreground text-right mb-4">
              <span className="font-semibold text-foreground">{readerData.next - totalInteractions}</span> para el siguiente nivel
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 mt-4">
            <motion.div 
              className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200/30 dark:border-green-800/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xl font-bold text-green-600">{likedCount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">Guardados</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200/30 dark:border-red-800/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-red-600" />
                <span className="text-xl font-bold text-red-600">{dislikedCount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">Pasados</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/30 dark:border-amber-800/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xl font-bold text-amber-600">{libraryCount}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">Leídos</p>
            </motion.div>
          </div>

          <motion.div 
            className={`mt-4 p-4 ${readerData.bgColor} rounded-xl border border-amber-200/30 dark:border-amber-800/20`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-center">
              {readerData.level === 'Oráculo Literario' ? (
                <>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">🎯 Precisión máxima</span>
                  <br />
                  <span className="text-muted-foreground text-xs">THOTH predice tus gustos con exactitud sobrenatural</span>
                </>
              ) : readerData.level === 'Maestro del Conocimiento' ? (
                <>
                  <span className="font-bold text-amber-600 dark:text-amber-400">👑 Casi en la cima</span>
                  <br />
                  <span className="text-muted-foreground text-xs">Las recomendaciones son casi perfectas</span>
                </>
              ) : readerData.level === 'Bibliófilo Legendario' ? (
                <>
                  <span className="font-bold text-purple-600 dark:text-purple-400">⚡ Conexión establecida</span>
                  <br />
                  <span className="text-muted-foreground text-xs">THOTH entiende tu alma lectora</span>
                </>
              ) : readerData.level === 'Devorador de Páginas' ? (
                <>
                  <span className="font-bold text-orange-600 dark:text-orange-400">🔥 En llamas</span>
                  <br />
                  <span className="text-muted-foreground text-xs">Cada libro mejora las predicciones</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-blue-600 dark:text-blue-400">📖 Construyendo tu perfil</span>
                  <br />
                  <span className="text-muted-foreground text-xs">Sigue explorando para mejores recomendaciones</span>
                </>
              )}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
