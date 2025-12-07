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

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { t, language } = useLocalization();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      welcome: 'Welcome back',
      subtitle: 'Sign in to access your personalized recommendations',
      email: 'Email',
      password: 'Password',
      login: 'Sign in',
      loggingIn: 'Signing in...',
      noAccount: "Don't have an account?",
      createOne: 'Create one',
      successTitle: 'Welcome back!',
      successDesc: 'You have successfully signed in.',
      errorTitle: 'Error',
      invalidCreds: 'Invalid credentials',
    },
    es: {
      welcome: 'Bienvenido de vuelta',
      subtitle: 'Inicia sesión para acceder a tus recomendaciones personalizadas',
      email: 'Correo electrónico',
      password: 'Contraseña',
      login: 'Iniciar sesión',
      loggingIn: 'Iniciando sesión...',
      noAccount: '¿No tienes cuenta?',
      createOne: 'Crear una',
      successTitle: '¡Bienvenido de vuelta!',
      successDesc: 'Has iniciado sesión correctamente.',
      errorTitle: 'Error',
      invalidCreds: 'Credenciales inválidas',
    },
    fr: {
      welcome: 'Bon retour',
      subtitle: 'Connectez-vous pour accéder à vos recommandations personnalisées',
      email: 'Email',
      password: 'Mot de passe',
      login: 'Se connecter',
      loggingIn: 'Connexion...',
      noAccount: "Pas de compte?",
      createOne: 'Créer un',
      successTitle: 'Bon retour!',
      successDesc: 'Vous êtes connecté avec succès.',
      errorTitle: 'Erreur',
      invalidCreds: 'Identifiants invalides',
    },
    pt: {
      welcome: 'Bem-vindo de volta',
      subtitle: 'Entre para acessar suas recomendações personalizadas',
      email: 'Email',
      password: 'Senha',
      login: 'Entrar',
      loggingIn: 'Entrando...',
      noAccount: 'Não tem conta?',
      createOne: 'Criar uma',
      successTitle: 'Bem-vindo de volta!',
      successDesc: 'Você entrou com sucesso.',
      errorTitle: 'Erro',
      invalidCreds: 'Credenciais inválidas',
    },
    de: {
      welcome: 'Willkommen zurück',
      subtitle: 'Melde dich an, um auf deine personalisierten Empfehlungen zuzugreifen',
      email: 'E-Mail',
      password: 'Passwort',
      login: 'Anmelden',
      loggingIn: 'Anmeldung...',
      noAccount: 'Kein Konto?',
      createOne: 'Erstellen',
      successTitle: 'Willkommen zurück!',
      successDesc: 'Du hast dich erfolgreich angemeldet.',
      errorTitle: 'Fehler',
      invalidCreds: 'Ungültige Anmeldedaten',
    },
    it: {
      welcome: 'Bentornato',
      subtitle: 'Accedi per accedere ai tuoi consigli personalizzati',
      email: 'Email',
      password: 'Password',
      login: 'Accedi',
      loggingIn: 'Accesso...',
      noAccount: 'Non hai un account?',
      createOne: 'Creane uno',
      successTitle: 'Bentornato!',
      successDesc: 'Hai effettuato l\'accesso con successo.',
      errorTitle: 'Errore',
      invalidCreds: 'Credenziali non valide',
    },
  };

  const c = content[language as keyof typeof content] || content.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with email:', email);
      const loggedInUser = await login(email, password);
      console.log('Login successful:', loggedInUser);
      toast({
        title: c.successTitle,
        description: c.successDesc
      });
      
      navigate('/');
    } catch (error) {
      console.error('Login error in component:', error);
      toast({
        title: c.errorTitle,
        description: error instanceof Error ? error.message : c.invalidCreds,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      
      <main className="max-w-md mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-serif font-bold">{c.welcome}</CardTitle>
              <CardDescription className="text-base">
                {c.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{c.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{c.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full py-6 text-base font-medium group"
                  disabled={isLoading}
                >
                  {isLoading ? c.loggingIn : (
                    <>
                      {c.login}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">{c.noAccount} </span>
                <Link to="/register" className="text-primary font-medium hover:underline">
                  {c.createOne}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
