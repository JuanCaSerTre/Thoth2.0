import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Heart, Compass, Sparkles, Target, Brain } from 'lucide-react';

// Paso 1: ¿Qué géneros te apasionan?
const GENRES = [
  'Fiction', 'Nonfiction', 'Fantasy', 'Science Fiction', 'Mystery', 
  'Romance', 'Biography', 'Self-help', 'Thriller', 'History',
  'Philosophy', 'Poetry', 'Horror', 'Adventure', 'Business'
];

// Paso 2: Preguntas psicológicas para perfilar
const PSYCHOLOGICAL_QUESTIONS = [
  {
    id: 'stress_response',
    question: '¿Cómo reaccionas ante situaciones de estrés?',
    options: [
      { id: 'analyze', label: 'Analizo la situación con calma', icon: '🧠' },
      { id: 'action', label: 'Tomo acción inmediata', icon: '⚡' },
      { id: 'escape', label: 'Busco distraerme o escapar', icon: '🌙' },
      { id: 'support', label: 'Busco apoyo en otros', icon: '🤝' }
    ]
  },
  {
    id: 'decision_making',
    question: '¿Cómo tomas decisiones importantes?',
    options: [
      { id: 'logic', label: 'Con lógica y datos', icon: '📊' },
      { id: 'intuition', label: 'Sigo mi intuición', icon: '✨' },
      { id: 'advice', label: 'Consulto con otros', icon: '💬' },
      { id: 'time', label: 'Me tomo mucho tiempo para pensar', icon: '⏳' }
    ]
  },
  {
    id: 'social_energy',
    question: '¿Cómo recargas tu energía?',
    options: [
      { id: 'alone', label: 'Tiempo a solas', icon: '🏠' },
      { id: 'people', label: 'Rodeado de personas', icon: '👥' },
      { id: 'nature', label: 'En la naturaleza', icon: '🌿' },
      { id: 'creative', label: 'Haciendo algo creativo', icon: '🎨' }
    ]
  },
  {
    id: 'life_priority',
    question: '¿Qué valoras más en la vida?',
    options: [
      { id: 'knowledge', label: 'Conocimiento y aprendizaje', icon: '📚' },
      { id: 'relationships', label: 'Relaciones y conexiones', icon: '❤️' },
      { id: 'adventure', label: 'Aventura y experiencias', icon: '🗺️' },
      { id: 'stability', label: 'Estabilidad y seguridad', icon: '🏡' }
    ]
  },
  {
    id: 'challenge_approach',
    question: '¿Cómo enfrentas los desafíos?',
    options: [
      { id: 'head_on', label: 'De frente, sin miedo', icon: '💪' },
      { id: 'strategic', label: 'Con estrategia y planificación', icon: '♟️' },
      { id: 'creative', label: 'Buscando soluciones creativas', icon: '💡' },
      { id: 'patience', label: 'Con paciencia, esperando el momento', icon: '🧘' }
    ]
  }
];

// Paso 3: ¿Qué buscas cuando lees?
const READING_GOALS = [
  { id: 'escape', label: 'Escapar de la realidad', icon: '🌙' },
  { id: 'learn', label: 'Aprender algo nuevo', icon: '🧠' },
  { id: 'grow', label: 'Crecimiento personal', icon: '🌱' },
  { id: 'entertain', label: 'Entretenimiento puro', icon: '🎭' },
  { id: 'inspire', label: 'Inspiración y motivación', icon: '✨' },
  { id: 'relax', label: 'Relajarme y desconectar', icon: '☕' },
  { id: 'challenge', label: 'Desafiar mi mente', icon: '🎯' },
  { id: 'connect', label: 'Conectar con emociones', icon: '💫' }
];

// Paso 4: ¿Cómo te describes como lector?
const READER_TYPES = [
  { id: 'explorer', label: 'Explorador', desc: 'Me gusta descubrir géneros y autores nuevos', icon: '🧭' },
  { id: 'deep', label: 'Profundo', desc: 'Prefiero analizar y reflexionar sobre lo que leo', icon: '🔍' },
  { id: 'fast', label: 'Veloz', desc: 'Devoro libros rápidamente, siempre quiero más', icon: '⚡' },
  { id: 'selective', label: 'Selectivo', desc: 'Elijo cuidadosamente, calidad sobre cantidad', icon: '💎' },
  { id: 'mood', label: 'Por estado de ánimo', desc: 'Leo según cómo me siento en el momento', icon: '🎨' },
  { id: 'loyal', label: 'Leal', desc: 'Tengo autores favoritos y los sigo fielmente', icon: '❤️' }
];

// Paso 5: ¿Qué tipo de historias te conmueven?
const STORY_VIBES = [
  { id: 'hopeful', label: 'Esperanzadoras', desc: 'Finales felices, superación' },
  { id: 'dark', label: 'Oscuras', desc: 'Complejas, moralmente grises' },
  { id: 'funny', label: 'Divertidas', desc: 'Humor, ligereza, risas' },
  { id: 'emotional', label: 'Emotivas', desc: 'Que me hagan llorar o sentir profundamente' },
  { id: 'thoughtful', label: 'Reflexivas', desc: 'Que me dejen pensando días después' },
  { id: 'action', label: 'De acción', desc: 'Ritmo rápido, adrenalina' }
];

// Paso 6: Idioma preferido
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updatePreferences } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    genres: [] as string[],
    psychologicalProfile: {} as Record<string, string>,
    readingGoals: [] as string[],
    readerType: '',
    storyVibes: [] as string[],
    language: 'es',
    favoriteBook: ''
  });

  const handleMultiSelect = (field: 'genres' | 'readingGoals' | 'storyVibes', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handlePsychologicalAnswer = (questionId: string, answerId: string) => {
    setFormData(prev => ({
      ...prev,
      psychologicalProfile: {
        ...prev.psychologicalProfile,
        [questionId]: answerId
      }
    }));
  };

  const handleSubmit = () => {
    if (formData.genres.length === 0) {
      toast({
        title: 'Selecciona al menos un género',
        variant: 'destructive'
      });
      return;
    }

    const preferences = {
      genres: formData.genres,
      language: formData.language,
      readingGoals: formData.readingGoals,
      readerType: formData.readerType,
      storyVibes: formData.storyVibes,
      favoriteBooks: formData.favoriteBook,
      psychologicalProfile: formData.psychologicalProfile,
      onboardingCompleted: true
    };

    console.log('Saving preferences:', preferences);
    updatePreferences(preferences);

    toast({
      title: '¡Perfil creado!',
      description: 'Tu personalidad lectora ha sido guardada. Ahora puedes agregar libros que ya hayas leído.'
    });

    navigate('/profile?tab=library');
  };

  const icons = [BookOpen, Brain, Heart, Compass, Sparkles, Target];
  const Icon = icons[step - 1] || BookOpen;
  const totalSteps = 6;

  const titles = [
    '¿Qué géneros te apasionan?',
    'Conociéndote mejor',
    '¿Qué buscas cuando lees?',
    '¿Cómo te describes como lector?',
    '¿Qué tipo de historias te conmueven?',
    'Cuéntanos un poco más'
  ];

  const subtitles = [
    'Selecciona todos los que te gusten',
    'Responde estas 5 preguntas para personalizar tu experiencia',
    'Elige lo que más te motiva a leer',
    'Selecciona el que más te represente',
    'Puedes elegir varios',
    'Esto nos ayuda a conocerte mejor'
  ];

  const isPsychologicalComplete = Object.keys(formData.psychologicalProfile).length === PSYCHOLOGICAL_QUESTIONS.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            key={step}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4"
          >
            <Icon className="w-7 h-7 md:w-8 md:h-8 text-amber-600 dark:text-amber-400" />
          </motion.div>
          
          <motion.h1 
            key={`title-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold text-foreground mb-1"
          >
            {titles[step - 1]}
          </motion.h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Paso {step} de {totalSteps} • {subtitles[step - 1]}
          </p>
          
          <div className="mt-4 flex gap-1.5 max-w-xs mx-auto px-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < step ? 'bg-amber-500' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-card rounded-2xl shadow-lg border border-border p-5 md:p-6 min-h-[380px] flex flex-col"
          >
            {/* Paso 1: Géneros */}
            {step === 1 && (
              <div className="space-y-3 flex-1">
                <div className="grid grid-cols-3 gap-2">
                  {GENRES.map(genre => (
                    <motion.div
                      key={genre}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultiSelect('genres', genre)}
                      className={`p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.genres.includes(genre)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={formData.genres.includes(genre)} className="pointer-events-none" />
                        <span className="font-medium text-xs md:text-sm">{genre}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 2: Preguntas Psicológicas */}
            {step === 2 && (
              <div className="space-y-6 flex-1 overflow-y-auto max-h-[500px] pr-2">
                {PSYCHOLOGICAL_QUESTIONS.map((q, index) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm md:text-base font-semibold block">
                      {index + 1}. {q.question}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map(option => (
                        <motion.div
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePsychologicalAnswer(q.id, option.id)}
                          className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.psychologicalProfile[q.id] === option.id
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                              : 'border-border hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{option.icon}</span>
                            <span className="font-medium text-xs md:text-sm">{option.label}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Paso 3: ¿Qué buscas cuando lees? */}
            {step === 3 && (
              <div className="space-y-3 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {READING_GOALS.map(goal => (
                    <motion.div
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultiSelect('readingGoals', goal.id)}
                      className={`p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.readingGoals.includes(goal.id)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <span className="font-medium text-sm md:text-base">{goal.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 4: Tipo de lector */}
            {step === 4 && (
              <div className="space-y-3 flex-1">
                <div className="grid grid-cols-1 gap-3">
                  {READER_TYPES.map(type => (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setFormData(prev => ({ ...prev, readerType: type.id }))}
                      className={`p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.readerType === type.id
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <span className="font-semibold text-sm md:text-base block">{type.label}</span>
                          <span className="text-xs md:text-sm text-muted-foreground">{type.desc}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 5: Tipo de historias */}
            {step === 5 && (
              <div className="space-y-3 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STORY_VIBES.map(vibe => (
                    <motion.div
                      key={vibe.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultiSelect('storyVibes', vibe.id)}
                      className={`p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.storyVibes.includes(vibe.id)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-sm md:text-base block">{vibe.label}</span>
                        <span className="text-xs md:text-sm text-muted-foreground">{vibe.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 6: Idioma y libro favorito */}
            {step === 6 && (
              <div className="space-y-6 flex-1">
                <div>
                  <Label className="text-base md:text-lg font-semibold block mb-3">
                    ¿En qué idioma prefieres leer?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {LANGUAGES.map(lang => (
                      <motion.div
                        key={lang.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
                        className={`p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
                          formData.language === lang.code
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                            : 'border-border hover:border-amber-300'
                        }`}
                      >
                        <span className="text-xl mb-1 block">{lang.flag}</span>
                        <span className="font-medium text-xs md:text-sm">{lang.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base md:text-lg font-semibold block mb-3">
                    ¿Cuál es un libro que te haya marcado? (opcional)
                  </Label>
                  <Textarea
                    placeholder="Ej: 'Cien años de soledad' porque me transportó a un mundo mágico..."
                    value={formData.favoriteBook}
                    onChange={(e) => setFormData(prev => ({ ...prev, favoriteBook: e.target.value }))}
                    className="text-sm md:text-base p-4 rounded-xl border-2 min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 md:gap-4 mt-6 pt-4 border-t border-border">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 rounded-full py-5 text-sm"
                  size="default"
                >
                  Atrás
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 rounded-full py-5 text-sm bg-amber-600 hover:bg-amber-700 text-white"
                  size="default"
                  disabled={
                    (step === 1 && formData.genres.length === 0) ||
                    (step === 2 && !isPsychologicalComplete) ||
                    (step === 3 && formData.readingGoals.length === 0) ||
                    (step === 4 && !formData.readerType)
                  }
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-full py-5 text-sm bg-amber-600 hover:bg-amber-700 text-white"
                  size="default"
                >
                  ¡Comenzar! ✨
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}