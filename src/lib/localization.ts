// Amazon domains by country
export const AMAZON_DOMAINS: Record<string, { domain: string; name: string }> = {
  US: { domain: 'amazon.com', name: 'United States' },
  GB: { domain: 'amazon.co.uk', name: 'United Kingdom' },
  DE: { domain: 'amazon.de', name: 'Germany' },
  FR: { domain: 'amazon.fr', name: 'France' },
  ES: { domain: 'amazon.es', name: 'Spain' },
  IT: { domain: 'amazon.it', name: 'Italy' },
  JP: { domain: 'amazon.co.jp', name: 'Japan' },
  CA: { domain: 'amazon.ca', name: 'Canada' },
  MX: { domain: 'amazon.com.mx', name: 'Mexico' },
  BR: { domain: 'amazon.com.br', name: 'Brazil' },
  AU: { domain: 'amazon.com.au', name: 'Australia' },
  IN: { domain: 'amazon.in', name: 'India' },
  NL: { domain: 'amazon.nl', name: 'Netherlands' },
  SE: { domain: 'amazon.se', name: 'Sweden' },
  PL: { domain: 'amazon.pl', name: 'Poland' },
  AE: { domain: 'amazon.ae', name: 'UAE' },
  SA: { domain: 'amazon.sa', name: 'Saudi Arabia' },
  SG: { domain: 'amazon.sg', name: 'Singapore' },
  TR: { domain: 'amazon.com.tr', name: 'Turkey' },
  BE: { domain: 'amazon.com.be', name: 'Belgium' },
  // Latin America defaults to US or MX
  AR: { domain: 'amazon.com', name: 'Argentina' },
  CL: { domain: 'amazon.com', name: 'Chile' },
  CO: { domain: 'amazon.com', name: 'Colombia' },
  PE: { domain: 'amazon.com', name: 'Peru' },
  VE: { domain: 'amazon.com', name: 'Venezuela' },
};

// Language codes by country
export const COUNTRY_LANGUAGES: Record<string, string> = {
  US: 'en',
  GB: 'en',
  AU: 'en',
  CA: 'en',
  IN: 'en',
  SG: 'en',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CL: 'es',
  CO: 'es',
  PE: 'es',
  VE: 'es',
  FR: 'fr',
  BE: 'fr',
  DE: 'de',
  IT: 'it',
  BR: 'pt',
  JP: 'ja',
  NL: 'nl',
  SE: 'sv',
  PL: 'pl',
  AE: 'ar',
  SA: 'ar',
  TR: 'tr',
};

// Translations
export const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Home
    'home.title': 'Discover Your Next Read',
    'home.subtitle': 'Let AI reveal the perfect book for you',
    'home.reveal': 'Reveal My Book',
    'home.revealing': 'Finding your book...',
    'home.loginPrompt': 'Login to get personalized recommendations',
    
    // Book Card
    'book.buyOn': 'Buy on Amazon',
    'book.addToRead': 'Add to To Read',
    'book.added': 'Added!',
    'book.pages': 'pages',
    'book.by': 'by',
    'book.whyRecommended': 'Why this book?',
    'book.compatibility': 'Match',
    'book.revealAnother': 'Reveal Another',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.preferences': 'Reading Preferences',
    'profile.genres': 'Favorite Genres',
    'profile.language': 'Preferred Language',
    'profile.readingDuration': 'Reading Duration',
    'profile.history': 'Reading History',
    'profile.library': 'My Library',
    'profile.toRead': 'To Read',
    'profile.reading': 'Currently Reading',
    'profile.read': 'Read',
    'profile.scanBook': 'Scan Book',
    'profile.addManually': 'Add Manually',
    'profile.searchBooks': 'Search books...',
    'profile.noBooks': 'No books yet',
    'profile.saveChanges': 'Save Changes',
    'profile.saved': 'Saved!',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.login': 'Login',
    'auth.register': 'Create Account',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.forgotPassword': 'Forgot password?',
    
    // About
    'about.title': 'About THOTH',
    'about.philosophy': 'Our Philosophy',
    'about.howItWorks': 'How It Works',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.skip': 'Skip',
    'common.finish': 'Finish',
    
    // Toasts
    'toast.bookAdded': 'Book added!',
    'toast.bookExists': 'Book already in library',
    'toast.preferencesUpdated': 'Preferences updated',
    'toast.errorOccurred': 'An error occurred',
    
    // Profile Page
    'profile.discoverNext': 'Discover your next book',
    'profile.booksRead': 'Books I\'ve read',
    'profile.addBooksDesc': 'Add books to improve your recommendations',
    'profile.add': 'Add',
    'profile.scan': 'Scan',
    'profile.noBooksYet': 'No books added yet',
    'profile.addBooksHelp': 'Add books you\'ve read to help THOTH recommend better matches',
    'profile.readingList': 'Reading List',
    'profile.readingListDesc': 'Books you want to read from recommendations',
    'profile.noReadingList': 'No books in your list',
    'profile.saveFromRecs': 'Save books from recommendations to add them here',
    'profile.readingPrefs': 'Reading Preferences',
    'profile.updatePrefsDesc': 'Update your preferences for better recommendations',
    'profile.favoriteGenres': 'Favorite Genres',
    'profile.settings': 'Settings',
    'profile.historyTab': 'History',
    'profile.markRead': 'Read',
    
    // Learning Progress
    'progress.saved': 'Saved',
    'progress.skipped': 'Skipped',
    'progress.read': 'Read',
    'progress.toNextLevel': 'to next level',
    
    // Home Page
    'home.howItWorks': 'How It Works',
    'home.simpleSteps': '3 simple steps to find your next book',
    'home.createProfile': 'Create your profile',
    'home.createProfileDesc': 'Answer questions about your tastes and reading personality',
    'home.chooseFavorites': 'Choose your favorites',
    'home.chooseFavoritesDesc': 'Save books you like. AI learns from each decision',
    'home.readRepeat': 'Read and repeat',
    'home.readRepeatDesc': 'Mark books as read and get better recommendations',
    'home.whyThoth': 'Why THOTH?',
    'home.noParalysis': 'No choice paralysis',
    'home.onlyThreeOptions': 'Only 3 perfect options',
    'home.evolvingAI': 'Evolving AI',
    'home.improvesWithChoice': 'Improves with each choice',
    'home.psychProfile': 'Psychological profile',
    'home.understandsYou': 'Understands your personality',
    'home.freeForever': '100% free',
    'home.supportAmazon': 'Support us by buying on Amazon',
    'home.supportMessage': '💛 THOTH is free thanks to Amazon commissions. By buying through our links, you help us keep improving at no extra cost to you.',
    'home.footer': '© 2025 THOTH · Discover your next favorite book',
    'home.aiKnowsYou': 'AI that knows you',
    'home.aiKnowsYouDesc': 'Learns from every book you rate to understand your unique taste',
    'home.exploreChoose': 'Explore and choose',
    'home.exploreChooseDesc': 'See 3 personalized recommendations and save the ones you like',
    'home.compatibilityScore': '% compatibility',
    'home.compatibilityScoreDesc': 'Each book shows how compatible it is with your reader profile',
    
    // Book Card
    'book.whyChosen': 'Why THOTH chose this for you?',
    'book.noDescription': 'No description available.',
    
    // Barcode Scanner
    'scanner.title': 'Scan Barcode',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.profile': 'Perfil',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    
    // Home
    'home.title': 'Descubre Tu Próxima Lectura',
    'home.subtitle': 'Deja que la IA revele el libro perfecto para ti',
    'home.reveal': 'Revelar Mi Libro',
    'home.revealing': 'Buscando tu libro...',
    'home.loginPrompt': 'Inicia sesión para obtener recomendaciones personalizadas',
    
    // Book Card
    'book.buyOn': 'Comprar en Amazon',
    'book.addToRead': 'Agregar a Por Leer',
    'book.added': '¡Agregado!',
    'book.pages': 'páginas',
    'book.by': 'por',
    'book.whyRecommended': '¿Por qué este libro?',
    'book.compatibility': 'Compatibilidad',
    'book.revealAnother': 'Revelar Otro',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.preferences': 'Preferencias de Lectura',
    'profile.genres': 'Géneros Favoritos',
    'profile.language': 'Idioma Preferido',
    'profile.readingDuration': 'Duración de Lectura',
    'profile.history': 'Historial de Lectura',
    'profile.library': 'Mi Biblioteca',
    'profile.toRead': 'Por Leer',
    'profile.reading': 'Leyendo',
    'profile.read': 'Leídos',
    'profile.scanBook': 'Escanear Libro',
    'profile.addManually': 'Agregar Manualmente',
    'profile.searchBooks': 'Buscar libros...',
    'profile.noBooks': 'Sin libros aún',
    'profile.saveChanges': 'Guardar Cambios',
    'profile.saved': '¡Guardado!',
    
    // Auth
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Crear Cuenta',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    
    // About
    'about.title': 'Acerca de THOTH',
    'about.philosophy': 'Nuestra Filosofía',
    'about.howItWorks': 'Cómo Funciona',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.skip': 'Omitir',
    'common.finish': 'Finalizar',
    
    // Toasts
    'toast.bookAdded': '¡Libro agregado!',
    'toast.bookExists': 'El libro ya está en tu biblioteca',
    'toast.preferencesUpdated': 'Preferencias actualizadas',
    'toast.errorOccurred': 'Ocurrió un error',
    
    // Profile Page
    'profile.discoverNext': 'Descubre tu próximo libro',
    'profile.booksRead': 'Libros que he leído',
    'profile.addBooksDesc': 'Agrega libros para mejorar tus recomendaciones',
    'profile.add': 'Agregar',
    'profile.scan': 'Escanear',
    'profile.noBooksYet': 'Sin libros aún',
    'profile.addBooksHelp': 'Agrega libros que has leído para que THOTH te recomiende mejor',
    'profile.readingList': 'Lista de Lectura',
    'profile.readingListDesc': 'Libros que quieres leer de las recomendaciones',
    'profile.noReadingList': 'Sin libros en tu lista',
    'profile.saveFromRecs': 'Guarda libros de las recomendaciones para agregarlos aquí',
    'profile.readingPrefs': 'Preferencias de Lectura',
    'profile.updatePrefsDesc': 'Actualiza tus preferencias para mejores recomendaciones',
    'profile.favoriteGenres': 'Géneros Favoritos',
    'profile.settings': 'Ajustes',
    'profile.historyTab': 'Historial',
    'profile.markRead': 'Leído',
    
    // Learning Progress
    'progress.saved': 'Guardados',
    'progress.skipped': 'Pasados',
    'progress.read': 'Leídos',
    'progress.toNextLevel': 'para el siguiente nivel',
    
    // Home Page
    'home.howItWorks': 'Cómo Funciona',
    'home.simpleSteps': '3 pasos simples para encontrar tu próximo libro',
    'home.createProfile': 'Crea tu perfil',
    'home.createProfileDesc': 'Responde preguntas sobre tus gustos y personalidad lectora',
    'home.chooseFavorites': 'Elige tus favoritos',
    'home.chooseFavoritesDesc': 'Guarda los libros que te interesan. La IA aprende de cada decisión',
    'home.readRepeat': 'Lee y repite',
    'home.readRepeatDesc': 'Marca libros como leídos y obtén recomendaciones cada vez mejores',
    'home.whyThoth': '¿Por qué THOTH?',
    'home.noParalysis': 'Sin parálisis de elección',
    'home.onlyThreeOptions': 'Solo 3 opciones perfectas',
    'home.evolvingAI': 'IA que evoluciona',
    'home.improvesWithChoice': 'Mejora con cada elección',
    'home.psychProfile': 'Perfil psicológico',
    'home.understandsYou': 'Entiende tu personalidad',
    'home.freeForever': '100% gratis',
    'home.supportAmazon': 'Apóyanos comprando en Amazon',
    'home.supportMessage': '💛 THOTH es gratis gracias a las comisiones de Amazon. Al comprar a través de nuestros enlaces, nos ayudas a seguir mejorando sin que te cueste nada extra.',
    'home.footer': '© 2025 THOTH · Descubre tu próximo libro favorito',
    'home.aiKnowsYou': 'IA que te conoce',
    'home.aiKnowsYouDesc': 'Aprende de cada libro que evalúas para entender tu gusto único',
    'home.exploreChoose': 'Explora y elige',
    'home.exploreChooseDesc': 'Ve 3 recomendaciones personalizadas y guarda las que te interesen',
    'home.compatibilityScore': '% de compatibilidad',
    'home.compatibilityScoreDesc': 'Cada libro muestra qué tan compatible es con tu perfil lector',
    
    // Book Card
    'book.whyChosen': '¿Por qué THOTH lo eligió para ti?',
    'book.noDescription': 'Sin descripción disponible.',
    
    // Barcode Scanner
    'scanner.title': 'Escanear Código de Barras',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.profile': 'Profil',
    'nav.login': 'Connexion',
    'nav.register': "S'inscrire",
    'nav.logout': 'Déconnexion',
    
    // Home
    'home.title': 'Découvrez Votre Prochaine Lecture',
    'home.subtitle': "Laissez l'IA révéler le livre parfait pour vous",
    'home.reveal': 'Révéler Mon Livre',
    'home.revealing': 'Recherche de votre livre...',
    'home.loginPrompt': 'Connectez-vous pour des recommandations personnalisées',
    
    // Book Card
    'book.buyOn': 'Acheter sur Amazon',
    'book.addToRead': 'Ajouter à Lire',
    'book.added': 'Ajouté!',
    'book.pages': 'pages',
    'book.by': 'par',
    'book.whyRecommended': 'Pourquoi ce livre?',
    'book.compatibility': 'Compatibilité',
    'book.revealAnother': 'Révéler Un Autre',
    
    // Profile
    'profile.title': 'Mon Profil',
    'profile.preferences': 'Préférences de Lecture',
    'profile.genres': 'Genres Favoris',
    'profile.language': 'Langue Préférée',
    'profile.readingDuration': 'Durée de Lecture',
    'profile.history': 'Historique de Lecture',
    'profile.library': 'Ma Bibliothèque',
    'profile.toRead': 'À Lire',
    'profile.reading': 'En Cours',
    'profile.read': 'Lus',
    'profile.scanBook': 'Scanner Livre',
    'profile.addManually': 'Ajouter Manuellement',
    'profile.searchBooks': 'Rechercher des livres...',
    'profile.noBooks': 'Pas encore de livres',
    'profile.saveChanges': 'Enregistrer',
    'profile.saved': 'Enregistré!',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.login': 'Connexion',
    'auth.register': 'Créer un compte',
    'auth.noAccount': "Pas de compte?",
    'auth.hasAccount': 'Déjà un compte?',
    'auth.forgotPassword': 'Mot de passe oublié?',
    
    // About
    'about.title': 'À propos de THOTH',
    'about.philosophy': 'Notre Philosophie',
    'about.howItWorks': 'Comment ça marche',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.skip': 'Passer',
    'common.finish': 'Terminer',
    
    // Toasts
    'toast.bookAdded': 'Livre ajouté!',
    'toast.bookExists': 'Livre déjà dans la bibliothèque',
    'toast.preferencesUpdated': 'Préférences mises à jour',
    'toast.errorOccurred': 'Une erreur est survenue',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.about': 'Sobre',
    'nav.profile': 'Perfil',
    'nav.login': 'Entrar',
    'nav.register': 'Cadastrar',
    'nav.logout': 'Sair',
    
    // Home
    'home.title': 'Descubra Sua Próxima Leitura',
    'home.subtitle': 'Deixe a IA revelar o livro perfeito para você',
    'home.reveal': 'Revelar Meu Livro',
    'home.revealing': 'Procurando seu livro...',
    'home.loginPrompt': 'Entre para obter recomendações personalizadas',
    
    // Book Card
    'book.buyOn': 'Comprar na Amazon',
    'book.addToRead': 'Adicionar para Ler',
    'book.added': 'Adicionado!',
    'book.pages': 'páginas',
    'book.by': 'por',
    'book.whyRecommended': 'Por que este livro?',
    'book.compatibility': 'Compatibilidade',
    'book.revealAnother': 'Revelar Outro',
    
    // Profile
    'profile.title': 'Meu Perfil',
    'profile.preferences': 'Preferências de Leitura',
    'profile.genres': 'Gêneros Favoritos',
    'profile.language': 'Idioma Preferido',
    'profile.readingDuration': 'Duração de Leitura',
    'profile.history': 'Histórico de Leitura',
    'profile.library': 'Minha Biblioteca',
    'profile.toRead': 'Para Ler',
    'profile.reading': 'Lendo',
    'profile.read': 'Lidos',
    'profile.scanBook': 'Escanear Livro',
    'profile.addManually': 'Adicionar Manualmente',
    'profile.searchBooks': 'Buscar livros...',
    'profile.noBooks': 'Sem livros ainda',
    'profile.saveChanges': 'Salvar Alterações',
    'profile.saved': 'Salvo!',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.login': 'Entrar',
    'auth.register': 'Criar Conta',
    'auth.noAccount': 'Não tem conta?',
    'auth.hasAccount': 'Já tem conta?',
    'auth.forgotPassword': 'Esqueceu a senha?',
    
    // About
    'about.title': 'Sobre o THOTH',
    'about.philosophy': 'Nossa Filosofia',
    'about.howItWorks': 'Como Funciona',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.close': 'Fechar',
    'common.back': 'Voltar',
    'common.next': 'Próximo',
    'common.skip': 'Pular',
    'common.finish': 'Finalizar',
    
    // Toasts
    'toast.bookAdded': 'Livro adicionado!',
    'toast.bookExists': 'Livro já está na biblioteca',
    'toast.preferencesUpdated': 'Preferências atualizadas',
    'toast.errorOccurred': 'Ocorreu um erro',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.about': 'Über uns',
    'nav.profile': 'Profil',
    'nav.login': 'Anmelden',
    'nav.register': 'Registrieren',
    'nav.logout': 'Abmelden',
    
    // Home
    'home.title': 'Entdecke Dein Nächstes Buch',
    'home.subtitle': 'Lass die KI das perfekte Buch für dich finden',
    'home.reveal': 'Mein Buch Enthüllen',
    'home.revealing': 'Suche dein Buch...',
    'home.loginPrompt': 'Melde dich an für personalisierte Empfehlungen',
    
    // Book Card
    'book.buyOn': 'Bei Amazon kaufen',
    'book.addToRead': 'Zur Leseliste',
    'book.added': 'Hinzugefügt!',
    'book.pages': 'Seiten',
    'book.by': 'von',
    'book.whyRecommended': 'Warum dieses Buch?',
    'book.compatibility': 'Übereinstimmung',
    'book.revealAnother': 'Weiteres Enthüllen',
    
    // Profile
    'profile.title': 'Mein Profil',
    'profile.preferences': 'Lesevorlieben',
    'profile.genres': 'Lieblingsgenres',
    'profile.language': 'Bevorzugte Sprache',
    'profile.readingDuration': 'Lesedauer',
    'profile.history': 'Leseverlauf',
    'profile.library': 'Meine Bibliothek',
    'profile.toRead': 'Zu Lesen',
    'profile.reading': 'Lese Gerade',
    'profile.read': 'Gelesen',
    'profile.scanBook': 'Buch Scannen',
    'profile.addManually': 'Manuell Hinzufügen',
    'profile.searchBooks': 'Bücher suchen...',
    'profile.noBooks': 'Noch keine Bücher',
    'profile.saveChanges': 'Änderungen Speichern',
    'profile.saved': 'Gespeichert!',
    
    // Auth
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.login': 'Anmelden',
    'auth.register': 'Konto erstellen',
    'auth.noAccount': 'Kein Konto?',
    'auth.hasAccount': 'Bereits ein Konto?',
    'auth.forgotPassword': 'Passwort vergessen?',
    
    // About
    'about.title': 'Über THOTH',
    'about.philosophy': 'Unsere Philosophie',
    'about.howItWorks': 'Wie es funktioniert',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.close': 'Schließen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.skip': 'Überspringen',
    'common.finish': 'Fertig',
    
    // Toasts
    'toast.bookAdded': 'Buch hinzugefügt!',
    'toast.bookExists': 'Buch bereits in der Bibliothek',
    'toast.preferencesUpdated': 'Einstellungen aktualisiert',
    'toast.errorOccurred': 'Ein Fehler ist aufgetreten',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'Chi Siamo',
    'nav.profile': 'Profilo',
    'nav.login': 'Accedi',
    'nav.register': 'Registrati',
    'nav.logout': 'Esci',
    
    // Home
    'home.title': 'Scopri la Tua Prossima Lettura',
    'home.subtitle': "Lascia che l'IA riveli il libro perfetto per te",
    'home.reveal': 'Rivela il Mio Libro',
    'home.revealing': 'Cercando il tuo libro...',
    'home.loginPrompt': 'Accedi per raccomandazioni personalizzate',
    
    // Book Card
    'book.buyOn': 'Compra su Amazon',
    'book.addToRead': 'Aggiungi da Leggere',
    'book.added': 'Aggiunto!',
    'book.pages': 'pagine',
    'book.by': 'di',
    'book.whyRecommended': 'Perché questo libro?',
    'book.compatibility': 'Compatibilità',
    'book.revealAnother': 'Rivela Un Altro',
    
    // Profile
    'profile.title': 'Il Mio Profilo',
    'profile.preferences': 'Preferenze di Lettura',
    'profile.genres': 'Generi Preferiti',
    'profile.language': 'Lingua Preferita',
    'profile.readingDuration': 'Durata Lettura',
    'profile.history': 'Cronologia Lettura',
    'profile.library': 'La Mia Libreria',
    'profile.toRead': 'Da Leggere',
    'profile.reading': 'In Lettura',
    'profile.read': 'Letti',
    'profile.scanBook': 'Scansiona Libro',
    'profile.addManually': 'Aggiungi Manualmente',
    'profile.searchBooks': 'Cerca libri...',
    'profile.noBooks': 'Nessun libro ancora',
    'profile.saveChanges': 'Salva Modifiche',
    'profile.saved': 'Salvato!',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Conferma Password',
    'auth.login': 'Accedi',
    'auth.register': 'Crea Account',
    'auth.noAccount': 'Non hai un account?',
    'auth.hasAccount': 'Hai già un account?',
    'auth.forgotPassword': 'Password dimenticata?',
    
    // About
    'about.title': 'Chi è THOTH',
    'about.philosophy': 'La Nostra Filosofia',
    'about.howItWorks': 'Come Funziona',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.success': 'Successo',
    'common.cancel': 'Annulla',
    'common.save': 'Salva',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.close': 'Chiudi',
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.skip': 'Salta',
    'common.finish': 'Fine',
    
    // Toasts
    'toast.bookAdded': 'Libro aggiunto!',
    'toast.bookExists': 'Libro già in libreria',
    'toast.preferencesUpdated': 'Preferenze aggiornate',
    'toast.errorOccurred': 'Si è verificato un errore',
  },
};

// Detect user's country from browser
export async function detectUserCountry(): Promise<string> {
  // First try to get from localStorage
  const savedCountry = localStorage.getItem('userCountry');
  if (savedCountry) {
    return savedCountry;
  }

  try {
    // Use a free IP geolocation API
    const response = await fetch('https://ipapi.co/json/', { 
      signal: AbortSignal.timeout(3000) 
    });
    if (response.ok) {
      const data = await response.json();
      const country = data.country_code || 'US';
      localStorage.setItem('userCountry', country);
      return country;
    }
  } catch (error) {
    console.log('Could not detect country, using default');
  }

  // Fallback: try to detect from browser language
  const browserLang = navigator.language || 'en-US';
  const countryFromLang = browserLang.split('-')[1]?.toUpperCase();
  
  if (countryFromLang && AMAZON_DOMAINS[countryFromLang]) {
    localStorage.setItem('userCountry', countryFromLang);
    return countryFromLang;
  }

  return 'US';
}

// Get Amazon domain for a country
export function getAmazonDomain(countryCode: string): string {
  return AMAZON_DOMAINS[countryCode]?.domain || 'amazon.com';
}

// Generate Amazon link based on user's country
export function generateAmazonLink(isbn: string | undefined, title: string, author: string, countryCode: string, affiliateTag?: string): string {
  const domain = getAmazonDomain(countryCode);
  const tag = affiliateTag || import.meta.env.VITE_AMAZON_AFFILIATE_TAG || 'thoth02-22';
  
  // Always use search - ISBN in /dp/ format doesn't work reliably
  // Amazon search handles ISBN well and finds the correct product
  if (isbn) {
    return `https://www.${domain}/s?k=${isbn}&i=stripbooks&tag=${tag}`;
  }
  
  const searchQuery = encodeURIComponent(`${title} ${author}`);
  return `https://www.${domain}/s?k=${searchQuery}&i=stripbooks&tag=${tag}`;
}

// Generate Amazon Kindle/eBook link
export function generateKindleLink(isbn: string | undefined, title: string, author: string, countryCode: string, affiliateTag?: string): string {
  const domain = getAmazonDomain(countryCode);
  const tag = affiliateTag || import.meta.env.VITE_AMAZON_AFFILIATE_TAG || 'thoth02-22';
  
  if (isbn) {
    // Direct to Kindle store with ISBN
    return `https://www.${domain}/s?k=${isbn}&i=digital-text&tag=${tag}`;
  }
  
  const searchQuery = encodeURIComponent(`${title} ${author}`);
  return `https://www.${domain}/s?k=${searchQuery}&i=digital-text&tag=${tag}`;
}

// Check if ISBN is valid (10 or 13 digits)
export function isValidISBN(isbn: string | undefined): boolean {
  if (!isbn) return false;
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  return /^(\d{10}|\d{13})$/.test(cleanISBN);
}

// Get language from country code
export function getLanguageFromCountry(countryCode: string): string {
  return COUNTRY_LANGUAGES[countryCode] || 'en';
}

// Detect user's preferred language
export function detectUserLanguage(): string {
  // First check localStorage
  const savedLang = localStorage.getItem('userLanguage');
  if (savedLang && translations[savedLang]) {
    return savedLang;
  }

  // Then check browser language
  const browserLang = navigator.language?.split('-')[0] || 'en';
  if (translations[browserLang]) {
    return browserLang;
  }

  return 'en';
}

// Translation function
export function t(key: string, lang: string = 'en'): string {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}

// Get all supported languages
export function getSupportedLanguages(): { code: string; name: string }[] {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
  ];
}
