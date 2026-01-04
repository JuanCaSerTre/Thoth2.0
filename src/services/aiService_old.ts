import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface UserProfile {
  genres: string[];
  emotions: string[];
  themes: string[];
  storytellingStyles: string[];
  favoriteBooks: string;
  language: string;
  readingDuration: string;
  discoveryMethod?: string;
  endingPreference?: string;
  nextBookGoal?: string;
  // New fields from improved onboarding
  readingGoals?: string[];
  readerType?: string;
  storyVibes?: string[];
  psychologicalProfile?: Record<string, string>;
  library: Array<{
    title: string;
    author: string;
    isbn: string;
  }>;
  readingHistory: Array<{
    title: string;
    author: string;
  }>;
  likedBooks?: Array<{
    title: string;
    author: string;
    categories?: string[];
  }>;
  dislikedBooks?: Array<{
    title: string;
    author: string;
    categories?: string[];
  }>;
}

export interface AIRecommendation {
  searchQuery: string;
  reasoning: string;
  focusArea: string;
  expectedGenre?: string;
  confidenceLevel?: string;
  emotionalHook?: string;
}

// Analyze patterns from liked books
function analyzeLikedBooksPatterns(likedBooks: Array<{title: string; author: string; categories?: string[]}>): {
  hasData: boolean;
  genres: string[];
  authors: string[];
  themes: string[];
  style: string;
} {
  if (!likedBooks || likedBooks.length === 0) {
    return { hasData: false, genres: [], authors: [], themes: [], style: '' };
  }

  const genres = new Set<string>();
  const authors = new Set<string>();
  const themes = new Set<string>();

  likedBooks.forEach(book => {
    if (book.categories) {
      book.categories.forEach(cat => genres.add(cat.toLowerCase()));
    }
    if (book.author) {
      authors.add(book.author);
    }
  });

  // Detect common themes from categories
  const genreArray = Array.from(genres);
  const themeKeywords = ['romance', 'mystery', 'thriller', 'fantasy', 'science fiction', 'horror', 'adventure', 'drama', 'comedy', 'historical', 'contemporary', 'literary'];
  themeKeywords.forEach(theme => {
    if (genreArray.some(g => g.includes(theme))) {
      themes.add(theme);
    }
  });

  // Determine style based on genres
  let style = '';
  if (genreArray.some(g => g.includes('literary') || g.includes('classic'))) {
    style = 'Literary/Classic';
  } else if (genreArray.some(g => g.includes('thriller') || g.includes('action'))) {
    style = 'Fast-paced/Action';
  } else if (genreArray.some(g => g.includes('romance') || g.includes('drama'))) {
    style = 'Emotional/Character-driven';
  } else if (genreArray.some(g => g.includes('fantasy') || g.includes('science fiction'))) {
    style = 'Imaginative/World-building';
  }

  return {
    hasData: true,
    genres: Array.from(genres).slice(0, 5),
    authors: Array.from(authors).slice(0, 5),
    themes: Array.from(themes).slice(0, 5),
    style
  };
}

// Analyze patterns from disliked books
function analyzeDislikedBooksPatterns(dislikedBooks: Array<{title: string; author: string; categories?: string[]}>): {
  hasData: boolean;
  genres: string[];
  authors: string[];
  themes: string[];
} {
  if (!dislikedBooks || dislikedBooks.length === 0) {
    return { hasData: false, genres: [], authors: [], themes: [] };
  }

  const genres = new Set<string>();
  const authors = new Set<string>();
  const themes = new Set<string>();

  dislikedBooks.forEach(book => {
    if (book.categories) {
      book.categories.forEach(cat => genres.add(cat.toLowerCase()));
    }
    if (book.author) {
      authors.add(book.author);
    }
  });

  return {
    hasData: true,
    genres: Array.from(genres).slice(0, 5),
    authors: Array.from(authors).slice(0, 5),
    themes: Array.from(themes).slice(0, 5)
  };
}

export async function generateAIRecommendations(
  userProfile: UserProfile
): Promise<AIRecommendation[]> {
  // If no API key, return fallback immediately
  if (!API_KEY || !genAI) {
    console.warn('Gemini API key not configured, using fallback recommendations');
    return getFallbackRecommendations(userProfile);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build comprehensive profile description
    const emotionsText = userProfile.emotions && userProfile.emotions.length > 0 
      ? userProfile.emotions.join(', ') 
      : 'Not specified';
    
    const themesText = userProfile.themes && userProfile.themes.length > 0 
      ? userProfile.themes.join(', ') 
      : 'Not specified';
    
    const stylesText = userProfile.storytellingStyles && userProfile.storytellingStyles.length > 0 
      ? userProfile.storytellingStyles.join(', ') 
      : 'Not specified';

    const languageMap: Record<string, string> = {
      'en': 'English',
      'es': 'Español (Spanish)',
      'fr': 'Français (French)',
      'de': 'Deutsch (German)',
      'it': 'Italiano (Italian)',
      'pt': 'Português (Portuguese)'
    };

    const languageSearchTerms: Record<string, string> = {
      'en': '',
      'es': 'spanish OR español OR literatura española OR novela',
      'fr': 'french OR français OR littérature française',
      'de': 'german OR deutsch OR deutsche literatur',
      'it': 'italian OR italiano OR letteratura italiana',
      'pt': 'portuguese OR português OR literatura portuguesa'
    };

    const languageName = languageMap[userProfile.language] || 'English';
    const languageSearchTerm = languageSearchTerms[userProfile.language] || '';

    // Build liked/disliked books context
    const likedBooksText = userProfile.likedBooks && userProfile.likedBooks.length > 0
      ? userProfile.likedBooks.map(b => `"${b.title}" by ${b.author}${b.categories ? ` (${b.categories.join(', ')})` : ''}`).join(', ')
      : 'None yet';
    
    const dislikedBooksText = userProfile.dislikedBooks && userProfile.dislikedBooks.length > 0
      ? userProfile.dislikedBooks.map(b => `"${b.title}" by ${b.author}${b.categories ? ` (${b.categories.join(', ')})` : ''}`).join(', ')
      : 'None yet';

    // New onboarding fields
    const readingGoalsMap: Record<string, string> = {
      'escape': 'Escape from reality',
      'learn': 'Learn something new',
      'grow': 'Personal growth',
      'entertain': 'Pure entertainment',
      'inspire': 'Inspiration and motivation',
      'relax': 'Relax and disconnect',
      'challenge': 'Challenge my mind',
      'connect': 'Connect with emotions'
    };

    const readerTypeMap: Record<string, string> = {
      'explorer': 'Explorer - likes discovering new genres and authors',
      'deep': 'Deep reader - prefers to analyze and reflect',
      'fast': 'Fast reader - devours books quickly',
      'selective': 'Selective - quality over quantity',
      'mood': 'Mood reader - reads based on current feelings',
      'loyal': 'Loyal - follows favorite authors'
    };

    const storyVibesMap: Record<string, string> = {
      'hopeful': 'Hopeful stories with happy endings',
      'dark': 'Dark and morally complex stories',
      'funny': 'Humorous and light stories',
      'emotional': 'Deeply emotional stories',
      'thoughtful': 'Thought-provoking stories',
      'action': 'Fast-paced action stories'
    };

    const readingGoalsText = userProfile.readingGoals && userProfile.readingGoals.length > 0
      ? userProfile.readingGoals.map(g => readingGoalsMap[g] || g).join(', ')
      : 'Not specified';

    const readerTypeText = userProfile.readerType 
      ? readerTypeMap[userProfile.readerType] || userProfile.readerType
      : 'Not specified';

    const storyVibesText = userProfile.storyVibes && userProfile.storyVibes.length > 0
      ? userProfile.storyVibes.map(v => storyVibesMap[v] || v).join(', ')
      : 'Not specified';

    // Psychological profile mapping
    const psychProfileMap: Record<string, Record<string, string>> = {
      stress_response: {
        analyze: 'Analytical thinker - prefers logical, structured narratives',
        action: 'Action-oriented - enjoys fast-paced, decisive protagonists',
        escape: 'Escapist - seeks immersive worlds and fantasy',
        support: 'Social reader - values relationships and emotional connections'
      },
      decision_making: {
        logic: 'Logical decision maker - appreciates well-reasoned plots',
        intuition: 'Intuitive - drawn to mysterious and instinctive characters',
        advice: 'Collaborative - enjoys ensemble casts and dialogue-heavy books',
        time: 'Contemplative - prefers slow-burn, thoughtful narratives'
      },
      social_energy: {
        alone: 'Introverted - enjoys introspective, character-driven stories',
        people: 'Extroverted - likes social dynamics and group adventures',
        nature: 'Nature-connected - appreciates settings in nature, environmental themes',
        creative: 'Creative soul - drawn to artistic, unconventional narratives'
      },
      life_priority: {
        knowledge: 'Knowledge seeker - loves learning through fiction',
        relationships: 'Relationship-focused - values emotional depth and connections',
        adventure: 'Adventure seeker - craves exploration and new experiences',
        stability: 'Stability-oriented - appreciates familiar structures and comfort reads'
      },
      challenge_approach: {
        head_on: 'Bold reader - enjoys brave protagonists and direct conflict',
        strategic: 'Strategic thinker - appreciates clever plots and planning',
        creative: 'Creative problem solver - likes unconventional solutions',
        patience: 'Patient reader - enjoys slow reveals and building tension'
      }
    };

    const psychProfileText = userProfile.psychologicalProfile 
      ? Object.entries(userProfile.psychologicalProfile)
          .map(([key, value]) => psychProfileMap[key]?.[value] || '')
          .filter(Boolean)
          .join('; ')
      : 'Not specified';

    // Analyze patterns from liked books
    const likedPatternsAnalysis = analyzeLikedBooksPatterns(userProfile.likedBooks || []);
    const dislikedPatternsAnalysis = analyzeDislikedBooksPatterns(userProfile.dislikedBooks || []);

    // Calculate learning progress
    const totalInteractions = (userProfile.likedBooks?.length || 0) + (userProfile.dislikedBooks?.length || 0) + (userProfile.library?.length || 0);
    const learningLevel = totalInteractions === 0 ? 'Nuevo usuario' : 
                         totalInteractions < 5 ? 'Aprendiendo tus gustos' :
                         totalInteractions < 15 ? 'Conociendo tu perfil' :
                         totalInteractions < 30 ? 'Perfil bien establecido' :
                         'Experto en tus preferencias';

    const prompt = `Eres THOTH, el dios egipcio del conocimiento encarnado como recomendador de libros.

═══════════════════════════════════════════════════════════════
✦ FILOSOFÍA DE THOTH ✦
═══════════════════════════════════════════════════════════════

Tu objetivo NO es recomendar libros genéricamente relacionados, sino libros que despierten CURIOSIDAD, EMOCIÓN y DESEO REAL de lectura en este usuario específico.

El usuario no necesita saber qué leer. Tú ya lo sabes.

═══════════════════════════════════════════════════════════════
🧠 CONOCIMIENTO DEL USUARIO
Total de interacciones: ${totalInteractions} (${userProfile.likedBooks?.length || 0} likes, ${userProfile.dislikedBooks?.length || 0} dislikes, ${userProfile.library?.length || 0} leídos)
═══════════════════════════════════════════════════════════════

USA TODA esta información como una sola mente conectada:

${likedPatternsAnalysis.hasData ? `
📚 LIBROS QUE AMARON (${userProfile.likedBooks?.length || 0}):
${userProfile.likedBooks?.slice(0, 8).map(b => `• "${b.title}" - ${b.author}`).join('\n') || 'Ninguno'}
• Géneros que resuenan: ${likedPatternsAnalysis.genres.join(', ') || 'Explorando'}
• Autores recurrentes: ${likedPatternsAnalysis.authors.join(', ') || 'Variados'}
• Estilo narrativo preferido: ${likedPatternsAnalysis.style || 'Por descubrir'}
` : ''}

${dislikedPatternsAnalysis.hasData ? `
🚫 LIBROS QUE ABANDONARON/RECHAZARON (${userProfile.dislikedBooks?.length || 0}):
${userProfile.dislikedBooks?.slice(0, 5).map(b => `• "${b.title}" - ${b.author}`).join('\n') || 'Ninguno'}
• Géneros que evitan: ${dislikedPatternsAnalysis.genres.join(', ')}
• Señales de rechazo detectadas
` : ''}

${userProfile.library?.length > 0 ? `
📖 BIBLIOTECA PERSONAL (${userProfile.library.length} leídos):
${userProfile.library.slice(0, 5).map(b => `• "${b.title}" - ${b.author}`).join('\n')}
${userProfile.library.length > 5 ? `... y ${userProfile.library.length - 5} más` : ''}
` : ''}

═══════════════════════════════════════════════════════════════
✦ PERFIL PSICOLÓGICO Y PREFERENCIAS ✦
═══════════════════════════════════════════════════════════════

• 🌍 IDIOMA: ${languageName} - Libros DEBEN estar disponibles en este idioma
• Géneros declarados: ${userProfile.genres.join(', ') || 'No especificado'}
• Objetivos de lectura: ${readingGoalsText}
• Tipo de lector: ${readerTypeText}
• Vibras que busca: ${storyVibesText}
• Libro favorito: ${userProfile.favoriteBooks || 'No mencionado'}

${psychProfileText ? `
🧠 Perfil psicológico profundo:
${psychProfileText}
` : ''}

═══════════════════════════════════════════════════════════════
✦ REGLAS CRÍTICAS DE THOTH ✦
═══════════════════════════════════════════════════════════════

1. NUNCA recomiendes libros obvios o "clásicos seguros" solo por encajar con el perfil.

2. PRIORIZA libros que generen la reacción: "No estaba buscando esto, pero lo quiero leer."

3. Si el usuario ya leyó muchos libros similares, ROMPE EL PATRÓN con inteligencia, no con azar.

4. EVITA recomendaciones "académicas" o "correctas" si el usuario disfruta lectura emocional, narrativa o inmersiva.

5. PREFIERE libros con alto impacto emocional, narrativo o conceptual, aunque no sean los más famosos.

═══════════════════════════════════════════════════════════════
✦ PROCESO INTERNO OBLIGATORIO ✦
═══════════════════════════════════════════════════════════════

Antes de recomendar, analiza:

1. ¿Quién es esta PERSONA, no solo su perfil estadístico?
2. Detecta tensiones internas: lo que le gusta vs lo que parece NECESITAR ahora
3. Decide si hoy el usuario necesita:
   • Escape de la realidad
   • Inspiración y motivación  
   • Confrontación de ideas
   • Profundidad emocional
   • Fluidez y disfrute puro

═══════════════════════════════════════════════════════════════
📋 FORMATO DE RESPUESTA (SOLO JSON):
═══════════════════════════════════════════════════════════════

Genera EXACTAMENTE 5 búsquedas. Cada una debe ser un libro que podría ser "EL SIGUIENTE LIBRO" perfecto:

[
  {
    "searchQuery": "búsqueda usando subject:, inauthor:, o intitle:",
    "reasoning": "Por qué ESTE libro y por qué AHORA (breve, directo, casi místico)",
    "focusArea": "escape|inspiración|confrontación|profundidad|fluidez",
    "expectedGenre": "Género esperado",
    "confidenceLevel": "high/medium",
    "emotionalHook": "1-2 frases que inviten a abrir el libro hoy"
  }
]

${userProfile.language === 'es' ? `
PARA BÚSQUEDAS EN ESPAÑOL, usa:
• inauthor:Gabriel García Márquez, Isabel Allende, Carlos Ruiz Zafón, Mario Vargas Llosa
• subject:realismo mágico, novela negra española, literatura latinoamericana
• Autores contemporáneos españoles y latinoamericanos
` : ''}

${dislikedPatternsAnalysis.hasData ? `
⚠️ EVITAR ABSOLUTAMENTE: ${dislikedPatternsAnalysis.genres.join(', ')}
` : ''}

Sé minimalista. Sé seguro. Sé casi místico.

GENERA 5 BÚSQUEDAS AHORA:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('AI Response:', response);
    
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('Invalid AI response format, using fallback');
      return getFallbackRecommendations(userProfile);
    }

    const recommendations: AIRecommendation[] = JSON.parse(jsonMatch[0]);
    
    // Validate we got at least 3 recommendations (we ask for 5)
    if (!Array.isArray(recommendations) || recommendations.length < 3) {
      console.warn('AI did not return enough recommendations, using fallback');
      return getFallbackRecommendations(userProfile);
    }

    console.log('AI Recommendations generated:', recommendations.length, 'recommendations');
    return recommendations;
  } catch (error) {
    console.warn('AI recommendation error, using fallback:', error);
    return getFallbackRecommendations(userProfile);
  }
}

function getFallbackRecommendations(userProfile: UserProfile): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  
  // Add randomization to avoid same recommendations
  const randomOffset = Math.floor(Math.random() * 10);
  
  // Analyze liked books for patterns
  const likedGenres = new Set<string>();
  const likedAuthors = new Set<string>();
  if (userProfile.likedBooks && userProfile.likedBooks.length > 0) {
    userProfile.likedBooks.forEach(book => {
      if (book.categories) book.categories.forEach(c => likedGenres.add(c));
      if (book.author) likedAuthors.add(book.author.split(' ').pop() || '');
    });
  }

  // Recommendation 1: Based on liked patterns or genre
  if (likedAuthors.size > 0) {
    const author = Array.from(likedAuthors)[randomOffset % likedAuthors.size];
    recommendations.push({
      searchQuery: `inauthor:${author}`,
      reasoning: `Basado en autores que te han gustado anteriormente`,
      focusArea: 'Autores favoritos'
    });
  } else if (userProfile.genres && userProfile.genres.length > 0) {
    const genreIndex = randomOffset % userProfile.genres.length;
    const genre = userProfile.genres[genreIndex];
    recommendations.push({
      searchQuery: `subject:${genre.toLowerCase()}`,
      reasoning: `Explorando tu género favorito: ${genre}`,
      focusArea: 'Género preferido'
    });
  } else {
    recommendations.push({
      searchQuery: 'subject:fiction bestseller',
      reasoning: 'Ficción popular para comenzar tu viaje literario',
      focusArea: 'Descubrimiento'
    });
  }
  
  // Recommendation 2: Based on reading goals or story vibes
  if (userProfile.storyVibes && userProfile.storyVibes.length > 0) {
    const vibeMap: Record<string, string> = {
      'hopeful': 'subject:inspirational uplifting',
      'dark': 'subject:psychological thriller dark',
      'funny': 'subject:humor comedy',
      'emotional': 'subject:literary fiction emotional',
      'thoughtful': 'subject:philosophy literary',
      'action': 'subject:adventure action thriller'
    };
    const vibe = userProfile.storyVibes[randomOffset % userProfile.storyVibes.length];
    recommendations.push({
      searchQuery: vibeMap[vibe] || `subject:${vibe}`,
      reasoning: `Historias que coinciden con tu preferencia por lo ${vibe}`,
      focusArea: 'Vibra de historia'
    });
  } else if (userProfile.readingGoals && userProfile.readingGoals.length > 0) {
    const goalMap: Record<string, string> = {
      'escape': 'subject:fantasy adventure',
      'learn': 'subject:nonfiction science',
      'grow': 'subject:self-help personal development',
      'entertain': 'subject:thriller mystery',
      'inspire': 'subject:biography inspirational',
      'relax': 'subject:cozy mystery romance',
      'challenge': 'subject:philosophy classics',
      'connect': 'subject:literary fiction relationships'
    };
    const goal = userProfile.readingGoals[randomOffset % userProfile.readingGoals.length];
    recommendations.push({
      searchQuery: goalMap[goal] || 'subject:fiction',
      reasoning: `Perfecto para tu objetivo de lectura: ${goal}`,
      focusArea: 'Objetivo de lectura'
    });
  } else {
    recommendations.push({
      searchQuery: 'subject:contemporary fiction',
      reasoning: 'Ficción contemporánea para descubrir nuevas voces',
      focusArea: 'Exploración'
    });
  }
  
  // Recommendation 3: Based on psychological profile or second genre
  if (userProfile.psychologicalProfile) {
    const psychMap: Record<string, Record<string, string>> = {
      'stress_response': {
        'analyze': 'subject:mystery detective',
        'action': 'subject:thriller action',
        'escape': 'subject:fantasy world-building',
        'support': 'subject:family saga relationships'
      },
      'life_priority': {
        'knowledge': 'subject:science history',
        'relationships': 'subject:romance literary',
        'adventure': 'subject:travel adventure',
        'stability': 'subject:cozy mystery comfort'
      }
    };
    
    const keys = Object.keys(userProfile.psychologicalProfile);
    if (keys.length > 0) {
      const key = keys[randomOffset % keys.length];
      const value = userProfile.psychologicalProfile[key];
      const query = psychMap[key]?.[value];
      if (query) {
        recommendations.push({
          searchQuery: query,
          reasoning: `Basado en tu perfil psicológico y personalidad`,
          focusArea: 'Perfil psicológico'
        });
      }
    }
  }
  
  // Ensure we have 5 recommendations for better chances of 80%+ matches
  while (recommendations.length < 5) {
    // Use language-specific fallback queries
    const isSpanish = userProfile.language === 'es';
    const fallbackQueries = isSpanish ? [
      { query: 'inauthor:Gabriel García Márquez', reason: 'Clásico del realismo mágico', focus: 'Literatura latinoamericana' },
      { query: 'inauthor:Isabel Allende subject:novela', reason: 'Autora bestseller en español', focus: 'Autores hispanos' },
      { query: 'subject:novela española contemporánea', reason: 'Novela española actual', focus: 'Literatura española' },
      { query: 'inauthor:Carlos Ruiz Zafón', reason: 'Bestseller español', focus: 'Autores españoles' },
      { query: 'subject:literatura latinoamericana', reason: 'Lo mejor de Latinoamérica', focus: 'Literatura regional' }
    ] : [
      { query: 'subject:literary fiction award winner', reason: 'Ficción literaria premiada', focus: 'Calidad literaria' },
      { query: 'subject:contemporary bestseller popular', reason: 'Bestsellers contemporáneos', focus: 'Popular' },
      { query: 'subject:classic literature timeless', reason: 'Clásicos de la literatura', focus: 'Clásicos' },
      { query: 'subject:fiction highly rated', reason: 'Ficción altamente valorada', focus: 'Calidad' },
      { query: 'subject:novel recommended', reason: 'Novelas recomendadas', focus: 'Recomendaciones' }
    ];
    const fb = fallbackQueries[recommendations.length % fallbackQueries.length];
    recommendations.push({
      searchQuery: fb.query,
      reasoning: fb.reason,
      focusArea: fb.focus
    });
  }
  
  console.log('Fallback recommendations generated:', recommendations.length, 'recommendations');
  return recommendations;
}