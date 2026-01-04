import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Heart, Compass, Sparkles, Target, Brain } from 'lucide-react';

// Genres (universal)
const GENRES = [
  'Fiction', 'Nonfiction', 'Fantasy', 'Science Fiction', 'Mystery', 
  'Romance', 'Biography', 'Self-help', 'Thriller', 'History',
  'Philosophy', 'Poetry', 'Horror', 'Adventure', 'Business'
];

// Localized content
const getLocalizedContent = (lang: string) => {
  const content = {
    en: {
      psychQuestions: [
        {
          id: 'stress_response',
          question: 'How do you react to stressful situations?',
          options: [
            { id: 'analyze', label: 'I analyze the situation calmly', icon: '🧠' },
            { id: 'action', label: 'I take immediate action', icon: '⚡' },
            { id: 'escape', label: 'I seek distraction or escape', icon: '🌙' },
            { id: 'support', label: 'I seek support from others', icon: '🤝' }
          ]
        },
        {
          id: 'decision_making',
          question: 'How do you make important decisions?',
          options: [
            { id: 'logic', label: 'With logic and data', icon: '📊' },
            { id: 'intuition', label: 'I follow my intuition', icon: '✨' },
            { id: 'advice', label: 'I consult with others', icon: '💬' },
            { id: 'time', label: 'I take a lot of time to think', icon: '⏳' }
          ]
        },
        {
          id: 'social_energy',
          question: 'How do you recharge your energy?',
          options: [
            { id: 'alone', label: 'Time alone', icon: '🏠' },
            { id: 'people', label: 'Surrounded by people', icon: '👥' },
            { id: 'nature', label: 'In nature', icon: '🌿' },
            { id: 'creative', label: 'Doing something creative', icon: '🎨' }
          ]
        },
        {
          id: 'life_priority',
          question: 'What do you value most in life?',
          options: [
            { id: 'knowledge', label: 'Knowledge and learning', icon: '📚' },
            { id: 'relationships', label: 'Relationships and connections', icon: '❤️' },
            { id: 'adventure', label: 'Adventure and experiences', icon: '🗺️' },
            { id: 'stability', label: 'Stability and security', icon: '🏡' }
          ]
        },
        {
          id: 'challenge_approach',
          question: 'How do you face challenges?',
          options: [
            { id: 'head_on', label: 'Head on, fearlessly', icon: '💪' },
            { id: 'strategic', label: 'With strategy and planning', icon: '♟️' },
            { id: 'creative', label: 'Looking for creative solutions', icon: '💡' },
            { id: 'patience', label: 'With patience, waiting for the right moment', icon: '🧘' }
          ]
        }
      ],
      readingGoals: [
        { id: 'escape', label: 'Escape from reality', icon: '🌙' },
        { id: 'learn', label: 'Learn something new', icon: '🧠' },
        { id: 'grow', label: 'Personal growth', icon: '🌱' },
        { id: 'entertain', label: 'Pure entertainment', icon: '🎭' },
        { id: 'inspire', label: 'Inspiration and motivation', icon: '✨' },
        { id: 'relax', label: 'Relax and disconnect', icon: '☕' },
        { id: 'challenge', label: 'Challenge my mind', icon: '🎯' },
        { id: 'connect', label: 'Connect with emotions', icon: '💫' }
      ],
      readerTypes: [
        { id: 'explorer', label: 'Explorer', desc: 'I like discovering new genres and authors', icon: '🧭' },
        { id: 'deep', label: 'Deep', desc: 'I prefer to analyze and reflect on what I read', icon: '🔍' },
        { id: 'fast', label: 'Fast', desc: 'I devour books quickly, always want more', icon: '⚡' },
        { id: 'selective', label: 'Selective', desc: 'I choose carefully, quality over quantity', icon: '💎' },
        { id: 'mood', label: 'Mood-based', desc: 'I read according to how I feel', icon: '🎨' },
        { id: 'loyal', label: 'Loyal', desc: 'I have favorite authors and follow them faithfully', icon: '❤️' }
      ],
      storyVibes: [
        { id: 'hopeful', label: 'Hopeful', desc: 'Happy endings, overcoming' },
        { id: 'dark', label: 'Dark', desc: 'Complex, morally gray' },
        { id: 'funny', label: 'Funny', desc: 'Humor, lightness, laughs' },
        { id: 'emotional', label: 'Emotional', desc: 'That make me cry or feel deeply' },
        { id: 'thoughtful', label: 'Thoughtful', desc: 'That leave me thinking for days' },
        { id: 'action', label: 'Action', desc: 'Fast pace, adrenaline' }
      ],
      steps: {
        step1Title: 'What genres are you passionate about?',
        step1Subtitle: 'Select at least 3 genres you enjoy',
        step2Title: 'Tell us about yourself',
        step2Subtitle: 'This helps us understand your reading personality',
        step3Title: 'What do you seek when reading?',
        step3Subtitle: 'Select all that apply',
        step4Title: 'How would you describe yourself as a reader?',
        step4Subtitle: 'Choose the one that best represents you',
        step5Title: 'What type of stories move you?',
        step5Subtitle: 'Select all that resonate with you',
        step6Title: 'Preferred language for books',
        step6Subtitle: 'We will recommend books in this language',
        favoriteBookLabel: 'Tell us about a book you loved (optional)',
        favoriteBookPlaceholder: 'Example: "1984 by George Orwell changed my perspective on..."',
        next: 'Next',
        back: 'Back',
        finish: 'Start Discovering',
        skip: 'Skip',
        successTitle: 'Profile created!',
        successDesc: 'We are ready to recommend books for you.'
      }
    },
    es: {
      psychQuestions: [
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
      ],
      readingGoals: [
        { id: 'escape', label: 'Escapar de la realidad', icon: '🌙' },
        { id: 'learn', label: 'Aprender algo nuevo', icon: '🧠' },
        { id: 'grow', label: 'Crecimiento personal', icon: '🌱' },
        { id: 'entertain', label: 'Entretenimiento puro', icon: '🎭' },
        { id: 'inspire', label: 'Inspiración y motivación', icon: '✨' },
        { id: 'relax', label: 'Relajarme y desconectar', icon: '☕' },
        { id: 'challenge', label: 'Desafiar mi mente', icon: '🎯' },
        { id: 'connect', label: 'Conectar con emociones', icon: '💫' }
      ],
      readerTypes: [
        { id: 'explorer', label: 'Explorador', desc: 'Me gusta descubrir géneros y autores nuevos', icon: '🧭' },
        { id: 'deep', label: 'Profundo', desc: 'Prefiero analizar y reflexionar sobre lo que leo', icon: '🔍' },
        { id: 'fast', label: 'Veloz', desc: 'Devoro libros rápidamente, siempre quiero más', icon: '⚡' },
        { id: 'selective', label: 'Selectivo', desc: 'Elijo cuidadosamente, calidad sobre cantidad', icon: '💎' },
        { id: 'mood', label: 'Por estado de ánimo', desc: 'Leo según cómo me siento en el momento', icon: '🎨' },
        { id: 'loyal', label: 'Leal', desc: 'Tengo autores favoritos y los sigo fielmente', icon: '❤️' }
      ],
      storyVibes: [
        { id: 'hopeful', label: 'Esperanzadoras', desc: 'Finales felices, superación' },
        { id: 'dark', label: 'Oscuras', desc: 'Complejas, moralmente grises' },
        { id: 'funny', label: 'Divertidas', desc: 'Humor, ligereza, risas' },
        { id: 'emotional', label: 'Emotivas', desc: 'Que me hagan llorar o sentir profundamente' },
        { id: 'thoughtful', label: 'Reflexivas', desc: 'Que me dejen pensando días después' },
        { id: 'action', label: 'De acción', desc: 'Ritmo rápido, adrenalina' }
      ],
      steps: {
        step1Title: '¿Qué géneros te apasionan?',
        step1Subtitle: 'Selecciona al menos 3 géneros que disfrutes',
        step2Title: 'Cuéntanos sobre ti',
        step2Subtitle: 'Esto nos ayuda a entender tu personalidad lectora',
        step3Title: '¿Qué buscas cuando lees?',
        step3Subtitle: 'Selecciona todas las que apliquen',
        step4Title: '¿Cómo te describes como lector?',
        step4Subtitle: 'Elige la que mejor te represente',
        step5Title: '¿Qué tipo de historias te conmueven?',
        step5Subtitle: 'Selecciona todas las que resuenen contigo',
        step6Title: 'Idioma preferido para libros',
        step6Subtitle: 'Te recomendaremos libros en este idioma',
        favoriteBookLabel: 'Cuéntanos sobre un libro que amaste (opcional)',
        favoriteBookPlaceholder: 'Ejemplo: "1984 de George Orwell cambió mi perspectiva sobre..."',
        next: 'Siguiente',
        back: 'Atrás',
        finish: 'Comenzar a Descubrir',
        skip: 'Omitir',
        successTitle: '¡Perfil creado!',
        successDesc: 'Estamos listos para recomendarte libros.'
      }
    }
  };
  
  return content[lang as keyof typeof content] || content.en;
};

// Languages (universal)
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
  const { user, updatePreferences, isLoading } = useAuth();
  const { language } = useLocalization();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const localizedContent = getLocalizedContent(language);

  // Redirect to home if user is not logged in or already completed onboarding
  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;
    
    // If not logged in, redirect to login (they need to be authenticated for onboarding)
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    // If already completed onboarding, redirect to home
    if (user.preferences?.onboardingCompleted) {
      navigate('/', { replace: true });
    }
  }, [user, navigate, isLoading]);

  // Show loading while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render anything if user is not logged in
  if (!user) {
    return null;
  }
  
  const [formData, setFormData] = useState({
    genres: [] as string[],
    psychologicalProfile: {} as Record<string, string>,
    readingGoals: [] as string[],
    readerType: '',
    storyVibes: [] as string[],
    language: language,
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
        title: language === 'es' ? 'Selecciona al menos un género' : 'Select at least one genre',
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
      title: localizedContent.steps.successTitle,
      description: localizedContent.steps.successDesc
    });

    navigate('/profile?tab=library');
  };

  const icons = [BookOpen, Brain, Heart, Compass, Sparkles, Target];
  const Icon = icons[step - 1] || BookOpen;
  const totalSteps = 6;

  const titles = [
    localizedContent.steps.step1Title,
    localizedContent.steps.step2Title,
    localizedContent.steps.step3Title,
    localizedContent.steps.step4Title,
    localizedContent.steps.step5Title,
    localizedContent.steps.step6Title
  ];

  const subtitles = [
    localizedContent.steps.step1Subtitle,
    localizedContent.steps.step2Subtitle,
    localizedContent.steps.step3Subtitle,
    localizedContent.steps.step4Subtitle,
    localizedContent.steps.step5Subtitle,
    localizedContent.steps.step6Subtitle
  ];

  const isPsychologicalComplete = Object.keys(formData.psychologicalProfile).length === localizedContent.psychQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <motion.div
            key={step}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-3 sm:mb-4"
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600 dark:text-amber-400" />
          </motion.div>
          
          <motion.h1 
            key={`title-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1"
          >
            {titles[step - 1]}
          </motion.h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            {language === 'es' ? 'Paso' : 'Step'} {step} {language === 'es' ? 'de' : 'of'} {totalSteps} • {subtitles[step - 1]}
          </p>
          
          <div className="mt-3 sm:mt-4 flex gap-1 sm:gap-1.5 max-w-xs mx-auto px-4">
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
            className="bg-card rounded-xl sm:rounded-2xl shadow-lg border border-border p-4 sm:p-5 md:p-6 min-h-[340px] sm:min-h-[380px] flex flex-col"
          >
            {/* Paso 1: Géneros */}
            {step === 1 && (
              <div className="space-y-2 sm:space-y-3 flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {GENRES.map(genre => (
                    <motion.div
                      key={genre}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultiSelect('genres', genre)}
                      className={`p-2 sm:p-3 md:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        formData.genres.includes(genre)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Checkbox checked={formData.genres.includes(genre)} className="pointer-events-none w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="font-medium text-[10px] sm:text-xs md:text-sm">{genre}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 2: Preguntas Psicológicas */}
            {step === 2 && (
              <div className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto max-h-[400px] sm:max-h-[500px] pr-1 sm:pr-2">
                {localizedContent.psychQuestions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    <Label className="text-xs sm:text-sm md:text-base font-semibold block">
                      {index + 1}. {q.question}
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {q.options.map(option => (
                        <motion.div
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePsychologicalAnswer(q.id, option.id)}
                          className={`p-2 sm:p-3 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                            formData.psychologicalProfile[q.id] === option.id
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                              : 'border-border hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-base sm:text-lg">{option.icon}</span>
                            <span className="font-medium text-[10px] sm:text-xs md:text-sm">{option.label}</span>
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
              <div className="space-y-2 sm:space-y-3 flex-1">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {localizedContent.readingGoals.map(goal => (
                    <motion.div
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultiSelect('readingGoals', goal.id)}
                      className={`p-3 sm:p-4 md:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        formData.readingGoals.includes(goal.id)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">{goal.icon}</span>
                        <span className="font-medium text-xs sm:text-sm md:text-base">{goal.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 4: Tipo de lector */}
            {step === 4 && (
              <div className="space-y-2 sm:space-y-3 flex-1">
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {localizedContent.readerTypes.map(type => (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setFormData(prev => ({ ...prev, readerType: type.id }))}
                      className={`p-3 sm:p-4 md:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        formData.readerType === type.id
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">{type.icon}</span>
                        <div>
                          <span className="font-semibold text-xs sm:text-sm md:text-base block">{type.label}</span>
                          <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{type.desc}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 5: Tipo de historias */}
            {step === 5 && (
              <div className="space-y-2 sm:space-y-3 flex-1">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {localizedContent.storyVibes.map(vibe => (
                    <motion.div
                      key={vibe.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultiSelect('storyVibes', vibe.id)}
                      className={`p-3 sm:p-4 md:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        formData.storyVibes.includes(vibe.id)
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-xs sm:text-sm md:text-base block">{vibe.label}</span>
                        <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{vibe.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 6: Idioma y libro favorito */}
            {step === 6 && (
              <div className="space-y-4 sm:space-y-6 flex-1">
                <div>
                  <Label className="text-sm sm:text-base md:text-lg font-semibold block mb-2 sm:mb-3">
                    {localizedContent.steps.step6Title}
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {LANGUAGES.map(lang => (
                      <motion.div
                        key={lang.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
                        className={`p-2 sm:p-3 md:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all text-center ${
                          formData.language === lang.code
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-sm'
                            : 'border-border hover:border-amber-300'
                        }`}
                      >
                        <span className="text-lg sm:text-xl mb-0.5 sm:mb-1 block">{lang.flag}</span>
                        <span className="font-medium text-[10px] sm:text-xs md:text-sm">{lang.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm sm:text-base md:text-lg font-semibold block mb-2 sm:mb-3">
                    {localizedContent.steps.favoriteBookLabel}
                  </Label>
                  <Textarea
                    placeholder={localizedContent.steps.favoriteBookPlaceholder}
                    value={formData.favoriteBook}
                    onChange={(e) => setFormData(prev => ({ ...prev, favoriteBook: e.target.value }))}
                    className="text-xs sm:text-sm md:text-base p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 min-h-[80px] sm:min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 rounded-full py-4 sm:py-5 text-xs sm:text-sm"
                  size="default"
                >
                  {localizedContent.steps.back}
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 rounded-full py-4 sm:py-5 text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white"
                  size="default"
                  disabled={
                    (step === 1 && formData.genres.length === 0) ||
                    (step === 2 && !isPsychologicalComplete) ||
                    (step === 3 && formData.readingGoals.length === 0) ||
                    (step === 4 && !formData.readerType)
                  }
                >
                  {localizedContent.steps.next}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-full py-4 sm:py-5 text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white"
                  size="default"
                >
                  {localizedContent.steps.finish} ✨
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}