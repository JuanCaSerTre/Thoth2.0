import { motion } from 'framer-motion';
import { BookOpen, Brain, Heart, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useLocalization } from '@/contexts/LocalizationContext';

export default function About() {
  const { language } = useLocalization();

  const content = {
    en: {
      hero1: "Don't know what to read?",
      hero2: "We do.",
      philosophy1: "In a world full of options, decision fatigue has become our constant companion. THOTH exists to eliminate that burden when it comes to your next read.",
      philosophy2: "Named after the Egyptian god of wisdom and knowledge, THOTH is your personal literary guide. We believe the perfect book finds you when you're ready for it, not when you're endlessly scrolling through lists and reviews.",
      smartRec: "Smart Recommendations",
      smartRecDesc: "Our algorithm learns from your reading preferences, mood, and history to suggest books that resonate with your current mental state.",
      serendipity: "Serendipitous Discovery",
      serendipityDesc: "Sometimes the best books are the ones you never knew you needed. We balance personalization with delightful surprises.",
      library: "Your Personal Library",
      libraryDesc: "Track what you've read, scan books with your camera, and let your reading history shape future recommendations.",
      curated: "Carefully Curated",
      curatedDesc: "Every recommendation is thoughtfully selected to match your taste, ensuring quality over quantity in your reading journey.",
      howItWorks: "How It Works",
      step1Title: "Create your profile:",
      step1Desc: "Answer simple questions about your reading preferences, habits, and favorite books.",
      step2Title: 'Click "Discover":',
      step2Desc: "Our algorithm analyzes your profile and presents three personalized book recommendations.",
      step3Title: "Build your library:",
      step3Desc: "Add books you've read by searching or scanning their ISBN code to refine future recommendations.",
      step4Title: "Discover and enjoy:",
      step4Desc: "Purchase recommended books through our Amazon affiliate links and start your next reading adventure.",
      supportTitle: "💛 Support THOTH",
      supportDesc: "THOTH is completely free. When you buy a book through our Amazon links, we receive a small commission that helps us maintain and improve the service.",
      supportExtra: "It costs you nothing extra.",
      samePrice: "Same Amazon price",
      supportDev: "Support development",
      freeService: "100% free service",
      footer: "© 2025 THOTH · Built with passion",
    },
    es: {
      hero1: "¿No sabes qué leer?",
      hero2: "Nosotros sí.",
      philosophy1: "En un mundo lleno de opciones, la fatiga de decisión se ha convertido en nuestra compañera constante. THOTH existe para eliminar esa carga cuando se trata de tu próxima lectura.",
      philosophy2: "Nombrado en honor al dios egipcio de la sabiduría y el conocimiento, THOTH es tu guía literario personal. Creemos que el libro perfecto te encuentra cuando estás listo para él, no cuando estás desplazándote sin fin por listas y reseñas.",
      smartRec: "Recomendaciones Inteligentes",
      smartRecDesc: "Nuestro algoritmo aprende de tus preferencias de lectura, estado de ánimo e historial para sugerir libros que resuenan con tu estado mental actual.",
      serendipity: "Descubrimiento Serendípico",
      serendipityDesc: "A veces los mejores libros son los que nunca supiste que necesitabas. Equilibramos la personalización con sorpresas encantadoras.",
      library: "Tu Biblioteca Personal",
      libraryDesc: "Registra lo que has leído, escanea libros con tu cámara, y deja que tu historial de lectura moldee las recomendaciones futuras.",
      curated: "Cuidadosamente Curado",
      curatedDesc: "Cada recomendación es cuidadosamente seleccionada para coincidir con tu gusto, asegurando calidad sobre cantidad en tu viaje de lectura.",
      howItWorks: "Cómo Funciona",
      step1Title: "Crea tu perfil:",
      step1Desc: "Responde preguntas simples sobre tus preferencias de lectura, hábitos y libros favoritos.",
      step2Title: 'Haz clic en "Descubrir":',
      step2Desc: "Nuestro algoritmo analiza tu perfil y presenta tres recomendaciones de libros personalizadas.",
      step3Title: "Construye tu biblioteca:",
      step3Desc: "Agrega libros que has leído buscando o escaneando su código ISBN para refinar las recomendaciones futuras.",
      step4Title: "Descubre y disfruta:",
      step4Desc: "Compra los libros recomendados a través de nuestros enlaces de afiliados de Amazon y comienza tu próxima aventura de lectura.",
      supportTitle: "💛 Apoya a THOTH",
      supportDesc: "THOTH es completamente gratuito. Cuando compras un libro a través de nuestros enlaces de Amazon, recibimos una pequeña comisión que nos ayuda a mantener y mejorar el servicio.",
      supportExtra: "No te cuesta nada extra.",
      samePrice: "Mismo precio de Amazon",
      supportDev: "Apoyas el desarrollo",
      freeService: "Servicio 100% gratis",
      footer: "© 2025 THOTH · Construido con pasión",
    },
    fr: {
      hero1: "Vous ne savez pas quoi lire?",
      hero2: "Nous oui.",
      philosophy1: "Dans un monde plein d'options, la fatigue décisionnelle est devenue notre compagne constante. THOTH existe pour éliminer ce fardeau quand il s'agit de votre prochaine lecture.",
      philosophy2: "Nommé d'après le dieu égyptien de la sagesse et de la connaissance, THOTH est votre guide littéraire personnel. Nous croyons que le livre parfait vous trouve quand vous êtes prêt, pas quand vous faites défiler sans fin des listes et des critiques.",
      smartRec: "Recommandations Intelligentes",
      smartRecDesc: "Notre algorithme apprend de vos préférences de lecture, de votre humeur et de votre historique pour suggérer des livres qui résonnent avec votre état mental actuel.",
      serendipity: "Découverte Sérendipiteuse",
      serendipityDesc: "Parfois, les meilleurs livres sont ceux dont vous ne saviez pas avoir besoin. Nous équilibrons la personnalisation avec des surprises délicieuses.",
      library: "Votre Bibliothèque Personnelle",
      libraryDesc: "Suivez ce que vous avez lu, scannez des livres avec votre caméra, et laissez votre historique de lecture façonner les recommandations futures.",
      curated: "Soigneusement Sélectionné",
      curatedDesc: "Chaque recommandation est soigneusement sélectionnée pour correspondre à vos goûts, assurant la qualité plutôt que la quantité dans votre parcours de lecture.",
      howItWorks: "Comment ça marche",
      step1Title: "Créez votre profil:",
      step1Desc: "Répondez à des questions simples sur vos préférences de lecture, vos habitudes et vos livres préférés.",
      step2Title: 'Cliquez sur "Découvrir":',
      step2Desc: "Notre algorithme analyse votre profil et présente trois recommandations de livres personnalisées.",
      step3Title: "Construisez votre bibliothèque:",
      step3Desc: "Ajoutez des livres que vous avez lus en recherchant ou en scannant leur code ISBN pour affiner les recommandations futures.",
      step4Title: "Découvrez et profitez:",
      step4Desc: "Achetez les livres recommandés via nos liens d'affiliation Amazon et commencez votre prochaine aventure de lecture.",
      supportTitle: "💛 Soutenez THOTH",
      supportDesc: "THOTH est entièrement gratuit. Lorsque vous achetez un livre via nos liens Amazon, nous recevons une petite commission qui nous aide à maintenir et améliorer le service.",
      supportExtra: "Cela ne vous coûte rien de plus.",
      samePrice: "Même prix Amazon",
      supportDev: "Soutenez le développement",
      freeService: "Service 100% gratuit",
      footer: "© 2025 THOTH · Construit avec passion",
    },
    pt: {
      hero1: "Não sabe o que ler?",
      hero2: "Nós sabemos.",
      philosophy1: "Em um mundo cheio de opções, a fadiga de decisão se tornou nossa companheira constante. THOTH existe para eliminar esse fardo quando se trata da sua próxima leitura.",
      philosophy2: "Nomeado em homenagem ao deus egípcio da sabedoria e do conhecimento, THOTH é seu guia literário pessoal. Acreditamos que o livro perfeito te encontra quando você está pronto, não quando você está rolando infinitamente por listas e resenhas.",
      smartRec: "Recomendações Inteligentes",
      smartRecDesc: "Nosso algoritmo aprende com suas preferências de leitura, humor e histórico para sugerir livros que ressoam com seu estado mental atual.",
      serendipity: "Descoberta Serendipitosa",
      serendipityDesc: "Às vezes, os melhores livros são aqueles que você nunca soube que precisava. Equilibramos personalização com surpresas encantadoras.",
      library: "Sua Biblioteca Pessoal",
      libraryDesc: "Acompanhe o que você leu, escaneie livros com sua câmera e deixe seu histórico de leitura moldar recomendações futuras.",
      curated: "Cuidadosamente Curado",
      curatedDesc: "Cada recomendação é cuidadosamente selecionada para combinar com seu gosto, garantindo qualidade sobre quantidade em sua jornada de leitura.",
      howItWorks: "Como Funciona",
      step1Title: "Crie seu perfil:",
      step1Desc: "Responda perguntas simples sobre suas preferências de leitura, hábitos e livros favoritos.",
      step2Title: 'Clique em "Descobrir":',
      step2Desc: "Nosso algoritmo analisa seu perfil e apresenta três recomendações de livros personalizadas.",
      step3Title: "Construa sua biblioteca:",
      step3Desc: "Adicione livros que você leu pesquisando ou escaneando seu código ISBN para refinar recomendações futuras.",
      step4Title: "Descubra e aproveite:",
      step4Desc: "Compre os livros recomendados através de nossos links de afiliados da Amazon e comece sua próxima aventura de leitura.",
      supportTitle: "💛 Apoie o THOTH",
      supportDesc: "THOTH é completamente gratuito. Quando você compra um livro através de nossos links da Amazon, recebemos uma pequena comissão que nos ajuda a manter e melhorar o serviço.",
      supportExtra: "Não custa nada extra para você.",
      samePrice: "Mesmo preço da Amazon",
      supportDev: "Apoie o desenvolvimento",
      freeService: "Serviço 100% gratuito",
      footer: "© 2025 THOTH · Construído com paixão",
    },
    de: {
      hero1: "Weißt du nicht, was du lesen sollst?",
      hero2: "Wir schon.",
      philosophy1: "In einer Welt voller Optionen ist Entscheidungsmüdigkeit zu unserem ständigen Begleiter geworden. THOTH existiert, um diese Last zu beseitigen, wenn es um deine nächste Lektüre geht.",
      philosophy2: "Benannt nach dem ägyptischen Gott der Weisheit und des Wissens, ist THOTH dein persönlicher literarischer Führer. Wir glauben, dass das perfekte Buch dich findet, wenn du bereit bist, nicht wenn du endlos durch Listen und Rezensionen scrollst.",
      smartRec: "Intelligente Empfehlungen",
      smartRecDesc: "Unser Algorithmus lernt aus deinen Lesevorlieben, deiner Stimmung und deinem Verlauf, um Bücher vorzuschlagen, die mit deinem aktuellen mentalen Zustand resonieren.",
      serendipity: "Zufällige Entdeckung",
      serendipityDesc: "Manchmal sind die besten Bücher die, von denen du nie wusstest, dass du sie brauchst. Wir balancieren Personalisierung mit entzückenden Überraschungen.",
      library: "Deine Persönliche Bibliothek",
      libraryDesc: "Verfolge, was du gelesen hast, scanne Bücher mit deiner Kamera und lass deinen Leseverlauf zukünftige Empfehlungen formen.",
      curated: "Sorgfältig Kuratiert",
      curatedDesc: "Jede Empfehlung wird sorgfältig ausgewählt, um deinem Geschmack zu entsprechen und Qualität über Quantität in deiner Lesereise zu gewährleisten.",
      howItWorks: "Wie es funktioniert",
      step1Title: "Erstelle dein Profil:",
      step1Desc: "Beantworte einfache Fragen zu deinen Lesevorlieben, Gewohnheiten und Lieblingsbüchern.",
      step2Title: 'Klicke auf "Entdecken":',
      step2Desc: "Unser Algorithmus analysiert dein Profil und präsentiert drei personalisierte Buchempfehlungen.",
      step3Title: "Baue deine Bibliothek auf:",
      step3Desc: "Füge Bücher hinzu, die du gelesen hast, indem du suchst oder ihren ISBN-Code scannst, um zukünftige Empfehlungen zu verfeinern.",
      step4Title: "Entdecke und genieße:",
      step4Desc: "Kaufe empfohlene Bücher über unsere Amazon-Affiliate-Links und starte dein nächstes Leseabenteuer.",
      supportTitle: "💛 Unterstütze THOTH",
      supportDesc: "THOTH ist völlig kostenlos. Wenn du ein Buch über unsere Amazon-Links kaufst, erhalten wir eine kleine Provision, die uns hilft, den Service zu pflegen und zu verbessern.",
      supportExtra: "Es kostet dich nichts extra.",
      samePrice: "Gleicher Amazon-Preis",
      supportDev: "Unterstütze die Entwicklung",
      freeService: "100% kostenloser Service",
      footer: "© 2025 THOTH · Mit Leidenschaft gebaut",
    },
    it: {
      hero1: "Non sai cosa leggere?",
      hero2: "Noi sì.",
      philosophy1: "In un mondo pieno di opzioni, la fatica decisionale è diventata la nostra compagna costante. THOTH esiste per eliminare quel peso quando si tratta della tua prossima lettura.",
      philosophy2: "Chiamato in onore del dio egizio della saggezza e della conoscenza, THOTH è la tua guida letteraria personale. Crediamo che il libro perfetto ti trovi quando sei pronto, non quando scorri all'infinito liste e recensioni.",
      smartRec: "Raccomandazioni Intelligenti",
      smartRecDesc: "Il nostro algoritmo impara dalle tue preferenze di lettura, umore e cronologia per suggerire libri che risuonano con il tuo stato mentale attuale.",
      serendipity: "Scoperta Serendipitosa",
      serendipityDesc: "A volte i migliori libri sono quelli di cui non sapevi di aver bisogno. Bilanciamo la personalizzazione con sorprese deliziose.",
      library: "La Tua Biblioteca Personale",
      libraryDesc: "Tieni traccia di ciò che hai letto, scansiona libri con la tua fotocamera e lascia che la tua cronologia di lettura plasmi le raccomandazioni future.",
      curated: "Accuratamente Curato",
      curatedDesc: "Ogni raccomandazione è accuratamente selezionata per corrispondere ai tuoi gusti, garantendo qualità sulla quantità nel tuo viaggio di lettura.",
      howItWorks: "Come Funziona",
      step1Title: "Crea il tuo profilo:",
      step1Desc: "Rispondi a semplici domande sulle tue preferenze di lettura, abitudini e libri preferiti.",
      step2Title: 'Clicca su "Scopri":',
      step2Desc: "Il nostro algoritmo analizza il tuo profilo e presenta tre raccomandazioni di libri personalizzate.",
      step3Title: "Costruisci la tua biblioteca:",
      step3Desc: "Aggiungi libri che hai letto cercando o scansionando il loro codice ISBN per affinare le raccomandazioni future.",
      step4Title: "Scopri e goditi:",
      step4Desc: "Acquista i libri consigliati tramite i nostri link di affiliazione Amazon e inizia la tua prossima avventura di lettura.",
      supportTitle: "💛 Supporta THOTH",
      supportDesc: "THOTH è completamente gratuito. Quando acquisti un libro tramite i nostri link Amazon, riceviamo una piccola commissione che ci aiuta a mantenere e migliorare il servizio.",
      supportExtra: "Non ti costa nulla in più.",
      samePrice: "Stesso prezzo Amazon",
      supportDev: "Supporta lo sviluppo",
      freeService: "Servizio 100% gratuito",
      footer: "© 2025 THOTH · Costruito con passione",
    },
  };

  const c = content[language as keyof typeof content] || content.en;

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
              {c.hero1}
            </h1>
            <p className="text-3xl md:text-4xl text-muted-foreground">
              {c.hero2}
            </p>
          </div>

          {/* Philosophy */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              {c.philosophy1}
            </p>
            
            <p className="text-xl text-muted-foreground leading-relaxed mt-6">
              {c.philosophy2}
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
                {c.smartRec}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {c.smartRecDesc}
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
                {c.serendipity}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {c.serendipityDesc}
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
                {c.library}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {c.libraryDesc}
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
                {c.curated}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {c.curatedDesc}
              </p>
            </motion.div>
          </div>

          {/* How It Works */}
          <div className="mt-20 space-y-8">
            <h2 className="text-4xl font-bold text-foreground text-center">
              {c.howItWorks}
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <p>
                  <strong className="text-foreground">{c.step1Title}</strong> {c.step1Desc}
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <p>
                  <strong className="text-foreground">{c.step2Title}</strong> {c.step2Desc}
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <p>
                  <strong className="text-foreground">{c.step3Title}</strong> {c.step3Desc}
                </p>
              </div>
              
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <p>
                  <strong className="text-foreground">{c.step4Title}</strong> {c.step4Desc}
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
              {c.supportTitle}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {c.supportDesc}
              <strong className="text-foreground"> {c.supportExtra}</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">{c.samePrice}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">{c.supportDev}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">{c.freeService}</span>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center pt-16 border-t border-border">
            <p className="text-muted-foreground text-sm">
              {c.footer}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
