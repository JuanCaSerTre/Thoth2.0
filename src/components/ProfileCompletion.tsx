import { motion } from 'framer-motion';
import { CheckCircle, Circle, TrendingUp, BookOpen, Heart, BookmarkPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CompletionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  completed: boolean;
  weight: number;
}

export default function ProfileCompletion() {
  const { user } = useAuth();
  const { t } = useLocalization();

  if (!user) return null;

  const libraryCount = user.library?.length || 0;
  const toReadCount = user.toRead?.length || 0;
  const likedCount = user.likedBooks?.length || 0;
  const dislikedCount = user.dislikedBooks?.length || 0;
  const onboardingCompleted = user.preferences?.onboardingCompleted || false;

  // Define completion items with weights
  const completionItems: CompletionItem[] = [
    {
      id: 'onboarding',
      label: t('profile.onboardingComplete'),
      icon: CheckCircle,
      completed: onboardingCompleted,
      weight: 30
    },
    {
      id: 'library',
      label: t('profile.addBooks'),
      icon: BookOpen,
      completed: libraryCount >= 3,
      weight: 25
    },
    {
      id: 'liked',
      label: t('profile.likeBooks'),
      icon: Heart,
      completed: likedCount + dislikedCount >= 5,
      weight: 25
    },
    {
      id: 'toRead',
      label: t('profile.saveBooks'),
      icon: BookmarkPlus,
      completed: toReadCount >= 2,
      weight: 20
    }
  ];

  // Calculate completion percentage
  const completedWeight = completionItems
    .filter(item => item.completed)
    .reduce((sum, item) => sum + item.weight, 0);

  // Add partial progress for items not fully completed
  let partialProgress = 0;
  
  // Partial progress for library (up to 3 books)
  if (!completionItems[1].completed && libraryCount > 0) {
    partialProgress += (libraryCount / 3) * completionItems[1].weight;
  }
  
  // Partial progress for liked books (up to 5 interactions)
  const totalInteractions = likedCount + dislikedCount;
  if (!completionItems[2].completed && totalInteractions > 0) {
    partialProgress += (totalInteractions / 5) * completionItems[2].weight;
  }
  
  // Partial progress for toRead (up to 2 books)
  if (!completionItems[3].completed && toReadCount > 0) {
    partialProgress += (toReadCount / 2) * completionItems[3].weight;
  }

  const totalProgress = Math.min(100, Math.round(completedWeight + partialProgress));

  // Get color based on progress
  const getProgressColor = () => {
    if (totalProgress >= 80) return 'from-green-500 to-emerald-600';
    if (totalProgress >= 50) return 'from-amber-500 to-orange-600';
    return 'from-blue-500 to-indigo-600';
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-blue-50/10 dark:to-blue-950/10 shadow-lg mb-4 sm:mb-6 overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${getProgressColor()} flex items-center justify-center shadow-md`}>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">{t('profile.completion')}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{t('profile.completionTip')}</p>
            </div>
          </div>
          <motion.div
            key={totalProgress}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${getProgressColor()} bg-clip-text text-transparent`}
          >
            {totalProgress}%
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
            />
          </div>
        </div>

        {/* Completion Items */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {completionItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-lg border transition-all ${
                  item.completed
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/30'
                    : 'bg-muted/30 border-border/50'
                }`}
              >
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                  item.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {item.completed ? (
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  ) : (
                    <Circle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium ${
                  item.completed ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
