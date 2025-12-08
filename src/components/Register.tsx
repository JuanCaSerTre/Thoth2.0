import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { language } = useLocalization();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      title: 'Join THOTH',
      subtitle: 'Create your account and discover your next perfect read',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      continue: 'Continue',
      creating: 'Creating account...',
      hasAccount: 'Already have an account?',
      login: 'Sign in',
      passwordMismatch: "Passwords don't match",
      passwordMismatchDesc: 'Please verify both passwords are the same',
      passwordShort: 'Password too short',
      passwordShortDesc: 'Password must be at least 6 characters',
      accountCreated: 'Account created!',
      accountCreatedDesc: 'Complete your profile for better recommendations.',
      error: 'Error',
      errorDesc: 'Could not create account',
    },
    es: {
      title: 'Únete a THOTH',
      subtitle: 'Crea tu cuenta y descubre tu próxima lectura perfecta',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      continue: 'Continuar',
      creating: 'Creando cuenta...',
      hasAccount: '¿Ya tienes cuenta?',
      login: 'Inicia sesión',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordMismatchDesc: 'Por favor verifica que ambas contraseñas sean iguales',
      passwordShort: 'Contraseña muy corta',
      passwordShortDesc: 'La contraseña debe tener al menos 6 caracteres',
      accountCreated: '¡Cuenta creada!',
      accountCreatedDesc: 'Completa tu perfil para obtener mejores recomendaciones.',
      error: 'Error',
      errorDesc: 'No se pudo crear la cuenta',
    },
    fr: {
      title: 'Rejoignez THOTH',
      subtitle: 'Créez votre compte et découvrez votre prochaine lecture parfaite',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      continue: 'Continuer',
      creating: 'Création du compte...',
      hasAccount: 'Déjà un compte?',
      login: 'Se connecter',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      passwordMismatchDesc: 'Veuillez vérifier que les deux mots de passe sont identiques',
      passwordShort: 'Mot de passe trop court',
      passwordShortDesc: 'Le mot de passe doit contenir au moins 6 caractères',
      accountCreated: 'Compte créé!',
      accountCreatedDesc: 'Complétez votre profil pour de meilleures recommandations.',
      error: 'Erreur',
      errorDesc: 'Impossible de créer le compte',
    },
    pt: {
      title: 'Junte-se ao THOTH',
      subtitle: 'Crie sua conta e descubra sua próxima leitura perfeita',
      email: 'Email',
      password: 'Senha',
      confirmPassword: 'Confirmar senha',
      continue: 'Continuar',
      creating: 'Criando conta...',
      hasAccount: 'Já tem conta?',
      login: 'Entrar',
      passwordMismatch: 'As senhas não coincidem',
      passwordMismatchDesc: 'Por favor verifique se ambas as senhas são iguais',
      passwordShort: 'Senha muito curta',
      passwordShortDesc: 'A senha deve ter pelo menos 6 caracteres',
      accountCreated: 'Conta criada!',
      accountCreatedDesc: 'Complete seu perfil para melhores recomendações.',
      error: 'Erro',
      errorDesc: 'Não foi possível criar a conta',
    },
    de: {
      title: 'Tritt THOTH bei',
      subtitle: 'Erstelle dein Konto und entdecke dein nächstes perfektes Buch',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      continue: 'Weiter',
      creating: 'Konto wird erstellt...',
      hasAccount: 'Bereits ein Konto?',
      login: 'Anmelden',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      passwordMismatchDesc: 'Bitte überprüfe, ob beide Passwörter gleich sind',
      passwordShort: 'Passwort zu kurz',
      passwordShortDesc: 'Das Passwort muss mindestens 6 Zeichen haben',
      accountCreated: 'Konto erstellt!',
      accountCreatedDesc: 'Vervollständige dein Profil für bessere Empfehlungen.',
      error: 'Fehler',
      errorDesc: 'Konto konnte nicht erstellt werden',
    },
    it: {
      title: 'Unisciti a THOTH',
      subtitle: 'Crea il tuo account e scopri la tua prossima lettura perfetta',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Conferma password',
      continue: 'Continua',
      creating: 'Creazione account...',
      hasAccount: 'Hai già un account?',
      login: 'Accedi',
      passwordMismatch: 'Le password non corrispondono',
      passwordMismatchDesc: 'Verifica che entrambe le password siano uguali',
      passwordShort: 'Password troppo corta',
      passwordShortDesc: 'La password deve avere almeno 6 caratteri',
      accountCreated: 'Account creato!',
      accountCreatedDesc: 'Completa il tuo profilo per migliori raccomandazioni.',
      error: 'Errore',
      errorDesc: 'Impossibile creare l\'account',
    },
  };

  const c = content[language as keyof typeof content] || content.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: c.passwordMismatch,
        description: c.passwordMismatchDesc,
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: c.passwordShort,
        description: c.passwordShortDesc,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting registration with email:', email);
      await register(email, password, {
        genres: [],
        language: language,
        onboardingCompleted: false
      });
      console.log('Registration successful');
      toast({
        title: c.accountCreated,
        description: c.accountCreatedDesc
      });
      navigate('/onboarding');
    } catch (error) {
      console.error('Registration error in component:', error);
      toast({
        title: c.error,
        description: error instanceof Error ? error.message : c.errorDesc,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      
      <main className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center pb-2 px-4 sm:px-6">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-serif font-bold">{c.title}</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {c.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm">{c.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="password" className="text-sm">{c.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">{c.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full py-5 sm:py-6 text-sm sm:text-base font-medium group"
                  disabled={isLoading}
                >
                  {isLoading ? c.creating : (
                    <>
                      {c.continue}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
                <span className="text-muted-foreground">{c.hasAccount} </span>
                <Link to="/login" className="text-primary font-medium hover:underline">
                  {c.login}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}