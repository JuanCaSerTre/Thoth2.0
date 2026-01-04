import OpenAI from 'openai';
import { getTrendingBooksForUser, getAuthorRecommendations, type TrendingBook } from '@/services/trendingBooksService';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = API_KEY ? new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
}) : null;

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
  toReadBooks?: Array<{
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

const languageMap: Record<string, string> = {
  'en': 'English',
  'es': 'Español', 
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português'
};

const readingGoalTranslations: Record<string, string> = {
  'learn': 'Aprender y adquirir conocimiento',
  'escape': 'Escapar y desconectar de la realidad',
  'grow': 'Crecimiento personal y desarrollo',
  'entertain': 'Entretenimiento puro',
  'inspire': 'Buscar inspiración y motivación',
  'relax': 'Relajación y descompresión'
};

const readerTypeTranslations: Record<string, string> = {
  'binge': 'Lector voraz - devora libros rápidamente',
  'steady': 'Lector constante - ritmo regular',
  'mood': 'Lector por mood - según el estado de ánimo',
  'explorer': 'Explorador - siempre probando nuevos géneros',
  'deep': 'Lector profundo - análisis y reflexión',
  'casual': 'Lector casual - cuando hay tiempo'
};

const storyVibeTranslations: Record<string, string> = {
  'epic': 'Épico y grandioso',
  'intimate': 'Íntimo y personal',
  'dark': 'Oscuro y profundo',
  'light': 'Ligero y optimista',
  'complex': 'Complejo y desafiante',
  'emotional': 'Emocionalmente intenso',
  'thought-provoking': 'Intelectualmente estimulante',
  'action-packed': 'Lleno de acción'
};

/**
 * Detect reading patterns from user's library and liked books
 */
function detectReadingPatterns(allBooks: Array<{ title: string; author: string; categories?: string[] }>) {
  const patterns = {
    isSelfHelp: false,
    isBiography: false,
    isBusiness: false,
    isPsychology: false,
    isNonfiction: false,
    isFiction: false,
    detectedGenres: [] as string[],
    favoriteAuthors: [] as string[]
  };

  if (!allBooks || allBooks.length === 0) return patterns;

  const titles = allBooks.map(b => b.title.toLowerCase());
  const authors = allBooks.map(b => b.author.toLowerCase());
  const allCategories = allBooks.flatMap(b => b.categories || []).map(c => c.toLowerCase());

  // Self-Help Detection
  patterns.isSelfHelp = titles.some(t => 
    t.includes('habit') || t.includes('atomic') || t.includes('useful') ||
    t.includes('power') || t.includes('mindset') || t.includes('think') ||
    t.includes('productivity') || t.includes('success') || t.includes('effective')
  ) || allCategories.some(c => 
    c.includes('self-help') || c.includes('personal development') || c.includes('self-improvement')
  );

  // Biography Detection
  patterns.isBiography = titles.some(t => 
    t.includes('biography') || t.includes('life of') || t.includes('memoir') ||
    t.includes('elon') || t.includes('steve jobs') || t.includes('autobiography')
  ) || authors.some(a => 
    a.includes('isaacson') || a.includes('vance') || a.includes('schwarzenegger')
  ) || allCategories.some(c => 
    c.includes('biography') || c.includes('memoir') || c.includes('autobiograph')
  );

  // Business Detection
  patterns.isBusiness = titles.some(t => 
    t.includes('business') || t.includes('startup') || t.includes('entrepreneur') ||
    t.includes('company') || t.includes('money') || t.includes('invest') ||
    t.includes('market') || t.includes('strategy') || t.includes('leadership')
  ) || allCategories.some(c => 
    c.includes('business') || c.includes('economics') || c.includes('entrepreneurship')
  );

  // Psychology Detection
  patterns.isPsychology = titles.some(t => 
    t.includes('psychology') || t.includes('brain') || t.includes('mind') ||
    t.includes('thinking') || t.includes('behavior') || t.includes('emotion') ||
    t.includes('cognitive') || t.includes('sapiens')
  ) || allCategories.some(c => 
    c.includes('psychology') || c.includes('cognitive') || c.includes('behavioral')
  );

  // Non-fiction Detection
  patterns.isNonfiction = titles.some(t => 
    t.includes('history') || t.includes('science') || t.includes('how') ||
    t.includes('why') || t.includes('guide')
  ) || allCategories.some(c => 
    c.includes('nonfiction') || c.includes('non-fiction') || c.includes('science') ||
    c.includes('history') || c.includes('education')
  );

  // Fiction Detection
  patterns.isFiction = allCategories.some(c => 
    c.includes('fiction') || c.includes('novel') || c.includes('fantasy') ||
    c.includes('thriller') || c.includes('mystery') || c.includes('romance')
  );

  // Extract unique authors
  patterns.favoriteAuthors = [...new Set(allBooks.map(b => b.author))].slice(0, 10);

  // Extract detected genres from categories
  const genreCount: Record<string, number> = {};
  allCategories.forEach(cat => {
    genreCount[cat] = (genreCount[cat] || 0) + 1;
  });
  patterns.detectedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([genre]) => genre);

  return patterns;
}

export async function generateAIRecommendations(
  userProfile: UserProfile
): Promise<AIRecommendation[]> {
  if (!API_KEY || !openai) {
    console.warn('OpenAI API key not configured');
    return [];
  }

  // Prepare user data outside try block so it's available in catch
  const libraryBooks = userProfile.library || [];
  const likedBooks = userProfile.likedBooks || [];
  const toReadBooks = userProfile.toReadBooks || [];
  const dislikedBooks = userProfile.dislikedBooks || [];
  const readingHistory = userProfile.readingHistory || [];
  
  // Combine ALL books for pattern analysis
  const allUserBooks = [
    ...libraryBooks,
    ...likedBooks,
    ...readingHistory.map(b => ({ ...b, categories: [] }))
  ];
  
  // Detect patterns from all user data - declared outside try so available in catch
  const patterns = detectReadingPatterns(allUserBooks as any);

  try {
    // ═══════════════════════════════════════════════════════════════
    // 🧠 COMPLETE USER DATA AGGREGATION
    // ═══════════════════════════════════════════════════════════════
    
    // Get trending books based on patterns
    const trendingBooksForUser = getTrendingBooksForUser(
      patterns, 
      userProfile.language,
      30
    );
    
    // Get similar author recommendations
    const authorRecommendations = getAuthorRecommendations(patterns.favoriteAuthors);
    
    // ═══════════════════════════════════════════════════════════════
    // 📊 FORMAT DATA FOR AI
    // ═══════════════════════════════════════════════════════════════
    
    // Library details
    const libraryText = libraryBooks.length > 0
      ? libraryBooks.slice(0, 15).map(b => `• "${b.title}" - ${b.author}`).join('\n')
      : 'Sin libros en biblioteca';
    
    // Liked books with categories
    const likedText = likedBooks.length > 0
      ? likedBooks.slice(0, 15).map(b => 
          `• "${b.title}" - ${b.author}${b.categories?.length ? ` [${b.categories.slice(0, 2).join(', ')}]` : ''}`
        ).join('\n')
      : 'Sin libros guardados';
    
    // To-Read list
    const toReadText = toReadBooks.length > 0
      ? toReadBooks.slice(0, 10).map(b => `• "${b.title}" - ${b.author}`).join('\n')
      : 'Sin lista de pendientes';
    
    // Disliked books
    const dislikedText = dislikedBooks.length > 0
      ? dislikedBooks.slice(0, 10).map(b => 
          `• "${b.title}" - ${b.author}${b.categories?.length ? ` [${b.categories.slice(0, 2).join(', ')}]` : ''}`
        ).join('\n')
      : 'Sin libros rechazados';
    
    // Trending books for this user
    const trendingText = trendingBooksForUser.slice(0, 20).map(b => 
      `• "${b.title}" - ${b.author} (${b.source}, ★${b.rating || 'N/A'})`
    ).join('\n');
    
    // Liked categories
    const likedCategories = [...new Set(likedBooks.flatMap(b => b.categories || []))];
    const dislikedCategories = [...new Set(dislikedBooks.flatMap(b => b.categories || []))];
    
    // All authors user likes
    const allAuthors = [...new Set([
      ...libraryBooks.map(b => b.author),
      ...likedBooks.map(b => b.author)
    ])];
    
    // Total interactions
    const totalInteractions = libraryBooks.length + likedBooks.length + dislikedBooks.length + toReadBooks.length;
    
    // Psychological profile
    const psychProfile = userProfile.psychologicalProfile || {};
    const psychText = Object.entries(psychProfile)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n• ');
    
    // Reading goals
    const readingGoals = (userProfile.readingGoals || [])
      .map(g => readingGoalTranslations[g] || g).join(', ');
    
    // Reader type
    const readerType = readerTypeTranslations[userProfile.readerType || ''] || userProfile.readerType || 'No especificado';
    
    // Story vibes
    const storyVibes = (userProfile.storyVibes || [])
      .map(v => storyVibeTranslations[v] || v).join(', ');

    // ═══════════════════════════════════════════════════════════════
    // 🔮 THOTH MEGA-PROMPT
    // ═══════════════════════════════════════════════════════════════
    
    const prompt = `Eres THOTH, el dios egipcio del conocimiento, el recomendador de libros MÁS INTELIGENTE del mundo.

════════════════════════════════════════════════════════════════
⚠️ SERVICIO PREMIUM - RECOMENDACIONES DE ALTA CALIDAD ⚠️
════════════════════════════════════════════════════════════════

Este es un SERVICIO DE PAGO. Las recomendaciones DEBEN ser:
• EXTREMADAMENTE PERSONALIZADAS para este usuario específico
• BASADAS en TODO su historial de lectura
• ALINEADAS con los bestsellers y libros populares de Goodreads/NYT
• NUNCA genéricas, obvias, o fuera de sus intereses demostrados

════════════════════════════════════════════════════════════════
👤 DATOS COMPLETOS DEL USUARIO
════════════════════════════════════════════════════════════════

📊 NIVEL DE DATOS: ${totalInteractions} interacciones totales
• Biblioteca: ${libraryBooks.length} libros leídos
• Guardados: ${likedBooks.length} libros que amó
• Por leer: ${toReadBooks.length} libros en cola
• Rechazados: ${dislikedBooks.length} libros que no le gustaron

🌍 IDIOMA: ${languageMap[userProfile.language] || 'English'}
🎯 GÉNEROS FAVORITOS: ${userProfile.genres?.join(', ') || 'No especificado'}
❤️ LIBRO FAVORITO: ${userProfile.favoriteBooks || 'No mencionado'}

════════════════════════════════════════════════════════════════
📚 BIBLIOTECA PERSONAL - LIBROS YA LEÍDOS (${libraryBooks.length})
════════════════════════════════════════════════════════════════
${libraryText}

════════════════════════════════════════════════════════════════
💚 LIBROS QUE AMÓ / GUARDÓ (${likedBooks.length}) - PRIORIDAD ALTA
════════════════════════════════════════════════════════════════
${likedText}

🏷️ CATEGORÍAS QUE LE GUSTAN: ${likedCategories.slice(0, 10).join(', ') || 'Por determinar'}
✍️ AUTORES FAVORITOS: ${allAuthors.slice(0, 8).join(', ') || 'Por determinar'}

════════════════════════════════════════════════════════════════
📖 LISTA DE PENDIENTES / POR LEER (${toReadBooks.length}) - ⛔ NO RECOMENDAR ESTOS
════════════════════════════════════════════════════════════════
${toReadText}

⚠️ IMPORTANTE: Los libros de arriba YA están en su lista de pendientes. NO los recomiendes.

════════════════════════════════════════════════════════════════
❌ LIBROS QUE RECHAZÓ - EVITAR SIMILARES (${dislikedBooks.length})
════════════════════════════════════════════════════════════════
${dislikedText}

⛔ CATEGORÍAS A EVITAR: ${dislikedCategories.join(', ') || 'Ninguna específica'}

════════════════════════════════════════════════════════════════
🎯 PATRONES DE LECTURA DETECTADOS
════════════════════════════════════════════════════════════════
${patterns.isSelfHelp ? '✅ LEE: Self-Help / Desarrollo Personal / Productividad' : ''}
${patterns.isBiography ? '✅ LEE: Biografías / Memorias / Vidas de figuras exitosas' : ''}
${patterns.isBusiness ? '✅ LEE: Business / Emprendimiento / Finanzas' : ''}
${patterns.isPsychology ? '✅ LEE: Psicología / Comportamiento / Neurociencia' : ''}
${patterns.isNonfiction ? '✅ LEE: Non-Fiction / Divulgación / Ciencia' : ''}
${patterns.isFiction ? '✅ LEE: Ficción / Novelas' : ''}
${!patterns.isSelfHelp && !patterns.isBiography && !patterns.isBusiness && !patterns.isPsychology && !patterns.isNonfiction && !patterns.isFiction ? '⚠️ Sin patrones claros - usar géneros declarados' : ''}

📊 Géneros detectados en lecturas: ${patterns.detectedGenres.slice(0, 8).join(', ') || 'Ninguno'}

════════════════════════════════════════════════════════════════
🔥 BESTSELLERS Y TENDENCIAS RELEVANTES (Goodreads/NYT)
════════════════════════════════════════════════════════════════
Basado en sus patrones, estos bestsellers serían perfectos:

${trendingText}

${authorRecommendations.length > 0 ? `
📚 AUTORES SIMILARES A SUS FAVORITOS:
${authorRecommendations.slice(0, 8).join(', ')}
` : ''}

════════════════════════════════════════════════════════════════
🧠 PERFIL PSICOLÓGICO Y PREFERENCIAS
════════════════════════════════════════════════════════════════

▸ OBJETIVOS DE LECTURA: ${readingGoals || 'No especificado'}
▸ TIPO DE LECTOR: ${readerType}
▸ VIBRAS QUE BUSCA: ${storyVibes || 'No especificado'}
▸ PREFERENCIA DE FINALES: ${userProfile.endingPreference || 'No especificado'}
▸ META PRÓXIMO LIBRO: ${userProfile.nextBookGoal || 'No especificado'}

${psychText ? `▸ ANÁLISIS PSICOLÓGICO:\n• ${psychText}` : ''}

════════════════════════════════════════════════════════════════
📋 INSTRUCCIONES DE BÚSQUEDA
════════════════════════════════════════════════════════════════

GENERA 5 BÚSQUEDAS para Google Books API:

REGLAS CRÍTICAS:
1. ${patterns.isSelfHelp && !patterns.isFiction ? 'SOLO NON-FICTION - PROHIBIDO recomendar novelas o ficción' : ''}
2. PRIORIZA libros de la lista de BESTSELLERS que compartí arriba
3. USA los autores similares: ${authorRecommendations.slice(0, 5).join(', ') || 'explorar autores top'}
4. ${dislikedCategories.length > 0 ? `EVITA absolutamente: ${dislikedCategories.join(', ')}` : ''}
5. Busca libros con alta calificación (4.0+) en Goodreads
6. ⛔ NO RECOMIENDES libros que ya están en su lista "Por Leer": ${toReadBooks.slice(0, 10).map(b => b.title).join(', ') || 'ninguno'}
7. ⛔ NO RECOMIENDES libros ya leídos: ${libraryBooks.slice(0, 10).map(b => b.title).join(', ') || 'ninguno'}
8. ⛔ NO RECOMIENDES libros guardados: ${likedBooks.slice(0, 10).map(b => b.title).join(', ') || 'ninguno'}

FORMATO BÚSQUEDA (Google Books API):
- SIMPLE ES MEJOR: usa solo 1-2 palabras clave
- intitle:TítuloExacto → para libros específicos
- "Nombre Autor" → buscar autor (sin inauthor:)
- NO combines inauthor: con subject: (Google Books no lo soporta bien)

EJEMPLOS QUE FUNCIONAN:
${patterns.isSelfHelp ? `
• James Clear habits
• Cal Newport focus
• Deep Work
• Atomic Habits` : ''}
${patterns.isBiography ? `
• Walter Isaacson biography
• Shoe Dog
• Steve Jobs biography` : ''}
${patterns.isBusiness ? `
• Simon Sinek leadership
• Seth Godin marketing
• Zero to One Thiel` : ''}
${patterns.isPsychology ? `
• Daniel Kahneman
• Thinking Fast Slow
• behavioral economics` : ''}

════════════════════════════════════════════════════════════════
📤 FORMATO DE RESPUESTA (SOLO JSON)
════════════════════════════════════════════════════════════════

[
  {
    "searchQuery": "2-4 palabras clave simples (ej: 'Cal Newport productivity', 'Deep Work', 'atomic habits')",
    "reasoning": "EXPLICACIÓN ESPECÍFICA de 80-120 caracteres conectando con SU historial",
    "focusArea": "Qué necesidad del usuario satisface",
    "expectedGenre": "Género esperado",
    "confidenceLevel": "high/medium",
    "emotionalHook": "1-2 frases evocadoras que le hagan querer leer AHORA"
  }
]

IMPORTANTE: searchQuery debe ser SIMPLE (2-4 palabras). Google Books NO funciona bien con búsquedas complejas.

EJEMPLOS DE BÚSQUEDAS BUENAS:
✅ "Cal Newport productivity"
✅ "atomic habits"
✅ "Sapiens Harari"
✅ "psychology decision making"

❌ MALO: "inauthor:Cal Newport subject:productivity" (NO FUNCIONA)
❌ MALO: consultas muy largas o complejas

El "reasoning" DEBE mencionar libros que YA LEYÓ o autores que le gustan.

GENERA 5 BÚSQUEDAS AHORA:`;

    console.log('🔮 THOTH MEGA-PROMPT Generated (OpenAI)');
    console.log('📊 User data summary:', {
      library: libraryBooks.length,
      liked: likedBooks.length,
      toRead: toReadBooks.length,
      disliked: dislikedBooks.length,
      patterns,
      trendingBooksCount: trendingBooksForUser.length,
      recommendedAuthors: authorRecommendations.slice(0, 5)
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are THOTH, the Egyptian god of knowledge, the MOST INTELLIGENT book recommender in the world. You always respond with valid JSON arrays only, no markdown, no extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const text = completion.choices[0]?.message?.content || '';
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in THOTH response');
      console.log('Raw response:', text);
      // Return fallback recommendations
      return getFallbackRecommendations(patterns, userProfile.language);
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    console.log('🔮 THOTH recommendations (OpenAI):', recommendations);
    
    if (!recommendations || recommendations.length === 0) {
      console.warn('Empty recommendations from AI, using fallback');
      return getFallbackRecommendations(patterns, userProfile.language);
    }
    
    return recommendations;

  } catch (error: any) {
    console.error('Error generating AI recommendations:', error);
    
    // Check if it's a rate limit error (429) or quota error
    if (error?.message?.includes('429') || error?.message?.includes('rate') || error?.message?.includes('quota')) {
      console.warn('⚠️ OpenAI API quota/rate limit exceeded - using intelligent fallback recommendations');
      console.log('💡 Tip: Add credits at https://platform.openai.com/settings/organization/billing');
    }
    
    // Return fallback recommendations on error
    return getFallbackRecommendations(patterns, userProfile.language);
  }
}

/**
 * Fallback recommendations when AI fails
 */
function getFallbackRecommendations(patterns: ReturnType<typeof detectReadingPatterns>, language: string): AIRecommendation[] {
  const fallback: AIRecommendation[] = [];
  
  if (patterns.isSelfHelp) {
    fallback.push(
      {
        searchQuery: 'James Clear atomic habits',
        reasoning: 'Autores top de productividad y desarrollo personal',
        focusArea: 'Hábitos y productividad',
        expectedGenre: 'Self-Help',
        confidenceLevel: 'high',
        emotionalHook: 'Transforma tu vida con sistemas probados'
      },
      {
        searchQuery: 'Cal Newport deep work',
        reasoning: 'Libros de hábitos más vendidos',
        focusArea: 'Desarrollo personal',
        expectedGenre: 'Self-Help',
        confidenceLevel: 'high',
        emotionalHook: 'Mejora 1% cada día'
      }
    );
  }
  
  if (patterns.isBiography) {
    fallback.push(
      {
        searchQuery: 'Walter Isaacson biography',
        reasoning: 'Biógrafo de Steve Jobs, Einstein, Elon Musk',
        focusArea: 'Biografías de genios',
        expectedGenre: 'Biography',
        confidenceLevel: 'high',
        emotionalHook: 'Descubre las mentes que cambiaron el mundo'
      },
      {
        searchQuery: 'Shoe Dog Phil Knight',
        reasoning: 'Historias de emprendedores exitosos',
        focusArea: 'Biografías inspiradoras',
        expectedGenre: 'Biography',
        confidenceLevel: 'high',
        emotionalHook: 'Aprende de los que lo lograron'
      }
    );
  }
  
  if (patterns.isBusiness) {
    fallback.push(
      {
        searchQuery: 'Simon Sinek leadership',
        reasoning: 'Líderes de pensamiento en negocios',
        focusArea: 'Liderazgo y marketing',
        expectedGenre: 'Business',
        confidenceLevel: 'high',
        emotionalHook: 'Inspira a otros y lidera con propósito'
      }
    );
  }
  
  if (patterns.isPsychology) {
    fallback.push(
      {
        searchQuery: 'Daniel Kahneman thinking',
        reasoning: 'Expertos en psicología del comportamiento',
        focusArea: 'Psicología y decisiones',
        expectedGenre: 'Psychology',
        confidenceLevel: 'high',
        emotionalHook: 'Entiende por qué haces lo que haces'
      }
    );
  }
  
  if (patterns.isNonfiction) {
    fallback.push(
      {
        searchQuery: 'Yuval Noah Harari sapiens',
        reasoning: 'Pensadores que explican la humanidad',
        focusArea: 'Historia y sociedad',
        expectedGenre: 'Non-Fiction',
        confidenceLevel: 'high',
        emotionalHook: 'Comprende el mundo de forma diferente'
      }
    );
  }
  
  // Add language-specific Spanish recommendations
  if (language === 'es') {
    fallback.push(
      {
        searchQuery: 'desarrollo personal autoayuda',
        reasoning: 'Mejores libros de autoayuda en español',
        focusArea: 'Desarrollo personal',
        expectedGenre: 'Self-Help',
        confidenceLevel: 'medium',
        emotionalHook: 'Tu mejor versión te espera'
      }
    );
  }
  
  // If no patterns detected, add generic popular recommendations
  if (fallback.length === 0) {
    // Randomize the order of fallback recommendations for variety
    const genericRecommendations: AIRecommendation[] = [
      {
        searchQuery: 'intitle:Atomic Habits',
        reasoning: 'El libro #1 sobre hábitos - 15M+ copias vendidas',
        focusArea: 'Hábitos',
        expectedGenre: 'Self-Help',
        confidenceLevel: 'high',
        emotionalHook: 'Pequeños cambios, resultados extraordinarios'
      },
      {
        searchQuery: 'intitle:Deep Work Cal Newport',
        reasoning: 'La guía definitiva para el trabajo enfocado',
        focusArea: 'Productividad',
        expectedGenre: 'Self-Help',
        confidenceLevel: 'high',
        emotionalHook: 'Domina el enfoque en un mundo distraído'
      },
      {
        searchQuery: 'inauthor:Walter Isaacson Steve Jobs',
        reasoning: 'La biografía definitiva del visionario de Apple',
        focusArea: 'Biografía',
        expectedGenre: 'Biography',
        confidenceLevel: 'high',
        emotionalHook: 'La mente detrás de la revolución tecnológica'
      },
      {
        searchQuery: 'intitle:Thinking Fast and Slow',
        reasoning: 'Daniel Kahneman - Nobel de Economía',
        focusArea: 'Psicología',
        expectedGenre: 'Psychology',
        confidenceLevel: 'high',
        emotionalHook: 'Descubre cómo realmente tomas decisiones'
      },
      {
        searchQuery: 'intitle:The Psychology of Money',
        reasoning: 'El bestseller sobre comportamiento financiero',
        focusArea: 'Finanzas',
        expectedGenre: 'Business',
        confidenceLevel: 'high',
        emotionalHook: 'El dinero es más psicología que matemáticas'
      },
      {
        searchQuery: 'intitle:Sapiens Yuval Noah Harari',
        reasoning: 'La historia de la humanidad que cautivó millones',
        focusArea: 'Historia',
        expectedGenre: 'Non-Fiction',
        confidenceLevel: 'high',
        emotionalHook: 'Entiende de dónde venimos para saber a dónde vamos'
      },
      {
        searchQuery: 'intitle:Start With Why Simon Sinek',
        reasoning: 'El libro que revolucionó el liderazgo',
        focusArea: 'Liderazgo',
        expectedGenre: 'Business',
        confidenceLevel: 'high',
        emotionalHook: 'Los grandes líderes inspiran acción'
      },
      {
        searchQuery: 'intitle:Mindset Carol Dweck',
        reasoning: 'La ciencia de la mentalidad de crecimiento',
        focusArea: 'Mentalidad',
        expectedGenre: 'Psychology',
        confidenceLevel: 'high',
        emotionalHook: 'Tu potencial es ilimitado con la mentalidad correcta'
      },
      {
        searchQuery: 'intitle:Rich Dad Poor Dad',
        reasoning: 'El clásico de educación financiera',
        focusArea: 'Finanzas personales',
        expectedGenre: 'Business',
        confidenceLevel: 'high',
        emotionalHook: 'Lo que los ricos enseñan a sus hijos'
      },
      {
        searchQuery: 'intitle:The 7 Habits of Highly Effective People',
        reasoning: 'El libro de desarrollo personal más influyente',
        focusArea: 'Efectividad',
        expectedGenre: 'Self-Help',
        confidenceLevel: 'high',
        emotionalHook: '30+ años transformando vidas'
      }
    ];
    
    // Shuffle array to get random recommendations each time
    const shuffled = genericRecommendations.sort(() => Math.random() - 0.5);
    fallback.push(...shuffled.slice(0, 5));
  }
  
  // Ensure we have at least 5 recommendations
  const additionalRecs: AIRecommendation[] = [
    {
      searchQuery: 'intitle:Outliers Malcolm Gladwell',
      reasoning: 'Por qué algunas personas tienen éxito',
      focusArea: 'Éxito',
      expectedGenre: 'Non-Fiction',
      confidenceLevel: 'high',
      emotionalHook: 'La historia detrás del éxito extraordinario'
    },
    {
      searchQuery: 'intitle:Influence Robert Cialdini',
      reasoning: 'La ciencia de la persuasión',
      focusArea: 'Psicología social',
      expectedGenre: 'Psychology',
      confidenceLevel: 'high',
      emotionalHook: 'Domina el arte de la persuasión ética'
    },
    {
      searchQuery: 'intitle:The Lean Startup',
      reasoning: 'La biblia del emprendimiento moderno',
      focusArea: 'Emprendimiento',
      expectedGenre: 'Business',
      confidenceLevel: 'high',
      emotionalHook: 'Construye un negocio que funcione'
    }
  ];
  
  while (fallback.length < 5) {
    const idx = fallback.length % additionalRecs.length;
    fallback.push(additionalRecs[idx]);
  }
  
  console.log('📚 Using fallback recommendations:', fallback.map(f => f.searchQuery));
  return fallback.slice(0, 5);
}
