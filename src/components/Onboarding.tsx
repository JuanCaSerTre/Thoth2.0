import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useToast } from './ui/use-toast';
import { BookOpen, Clock, Globe, Heart, Sparkles } from 'lucide-react';

const GENRES = [
  'Fiction', 'Nonfiction', 'Fantasy', 'Self-help', 'Mystery', 
  'Romance', 'Biography', 'Science Fiction', 'Thriller', 'History'
];

const READING_DURATIONS = [
  'Less than 15 minutes',
  '30 minutes',
  '1 hour',
  'More than 1 hour'
];

const EMOTIONS = [
  'Inspiration', 'Relaxation', 'Adventure', 'Knowledge', 
  'Escape', 'Growth', 'Entertainment'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updatePreferences } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    genres: [] as string[],
    readingDuration: '',
    language: 'en',
    emotion: '',
    favoriteBooks: ''
  });

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSubmit = () => {
    if (formData.genres.length === 0) {
      toast({
        title: 'Please select at least one genre',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.readingDuration || !formData.emotion) {
      toast({
        title: 'Please complete all required fields',
        variant: 'destructive'
      });
      return;
    }

    updatePreferences({
      genres: formData.genres,
      language: formData.language,
      readingDuration: formData.readingDuration,
      emotion: formData.emotion,
      favoriteBooks: formData.favoriteBooks
    } as any);

    toast({
      title: 'Profile created!',
      description: 'Your reading preferences have been saved.'
    });

    navigate('/');
  };

  const icons = [BookOpen, Clock, Globe, Heart, Sparkles];
  const Icon = icons[step - 1];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6"
          >
            <Icon className="w-8 h-8 text-foreground" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Create Your Reading Profile
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Question {step} of 5
          </p>
          
          <div className="mt-8 flex gap-2 max-w-md mx-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i <= step ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= step ? 'bg-foreground' : 'bg-border'
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
            transition={{ duration: 0.3 }}
            className="bg-card rounded-3xl shadow-lg border border-border p-8 md:p-12 min-h-[400px] flex flex-col"
          >
            {step === 1 && (
              <div className="space-y-6 flex-1">
                <Label className="text-2xl md:text-3xl font-bold block">
                  What genres do you enjoy most?
                </Label>
                <p className="text-muted-foreground font-light">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GENRES.map(genre => (
                    <motion.div
                      key={genre}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenreToggle(genre)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.genres.includes(genre)
                          ? 'border-foreground bg-accent/10'
                          : 'border-border hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={formData.genres.includes(genre)} />
                        <span className="font-medium text-sm">{genre}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 flex-1">
                <Label className="text-2xl md:text-3xl font-bold block">
                  How much time do you spend reading each day?
                </Label>
                <div className="space-y-3 mt-8">
                  {READING_DURATIONS.map(duration => (
                    <motion.div
                      key={duration}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, readingDuration: duration }))}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.readingDuration === duration
                          ? 'border-foreground bg-accent/10'
                          : 'border-border hover:border-foreground/30'
                      }`}
                    >
                      <span className="font-medium">{duration}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 flex-1">
                <Label className="text-2xl md:text-3xl font-bold block">
                  What language do you prefer reading in?
                </Label>
                <div className="space-y-3 mt-8">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'es', name: 'Spanish' },
                    { code: 'fr', name: 'French' },
                    { code: 'de', name: 'German' },
                    { code: 'it', name: 'Italian' }
                  ].map(lang => (
                    <motion.div
                      key={lang.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.language === lang.code
                          ? 'border-foreground bg-accent/10'
                          : 'border-border hover:border-foreground/30'
                      }`}
                    >
                      <span className="font-medium">{lang.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 flex-1">
                <Label className="text-2xl md:text-3xl font-bold block">
                  What emotion or experience are you seeking?
                </Label>
                <div className="grid grid-cols-2 gap-3 mt-8">
                  {EMOTIONS.map(emotion => (
                    <motion.div
                      key={emotion}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, emotion }))}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.emotion === emotion
                          ? 'border-foreground bg-accent/10'
                          : 'border-border hover:border-foreground/30'
                      }`}
                    >
                      <span className="font-medium">{emotion}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 flex-1">
                <Label className="text-2xl md:text-3xl font-bold block">
                  Mention one or two books you loved
                </Label>
                <p className="text-muted-foreground font-light">
                  This helps us understand your taste better (optional)
                </p>
                <Input
                  placeholder="e.g., 1984 by George Orwell, The Alchemist by Paulo Coelho"
                  value={formData.favoriteBooks}
                  onChange={(e) => setFormData(prev => ({ ...prev, favoriteBooks: e.target.value }))}
                  className="text-base p-6 rounded-xl border-2"
                />
              </div>
            )}

            <div className="flex gap-4 mt-8 pt-6 border-t border-border">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 rounded-full py-6"
                  size="lg"
                >
                  Back
                </Button>
              )}
              {step < 5 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 rounded-full py-6"
                  size="lg"
                  disabled={step === 1 && formData.genres.length === 0}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-full py-6"
                  size="lg"
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}