/**
 * Trending/Popular Books Service
 * Fetches bestsellers and trending books from multiple sources
 */

// Curated list of bestsellers and highly-rated books by category
// Based on NYT Bestsellers, Goodreads yearly lists, and award winners

export interface TrendingBook {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  source: string;
  rating?: number;
  description?: string;
}

// Self-Help / Personal Development - Current bestsellers and classics
const SELF_HELP_BESTSELLERS: TrendingBook[] = [
  { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", category: "Self-Help", source: "NYT Bestseller", rating: 4.38 },
  { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", isbn: "9781982137274", category: "Self-Help", source: "Classic", rating: 4.17 },
  { title: "Deep Work", author: "Cal Newport", isbn: "9781455586691", category: "Productivity", source: "NYT Bestseller", rating: 4.20 },
  { title: "The Power of Now", author: "Eckhart Tolle", isbn: "9781577314806", category: "Self-Help", source: "Classic", rating: 4.13 },
  { title: "Can't Hurt Me", author: "David Goggins", isbn: "9781544512273", category: "Self-Help", source: "Goodreads Choice", rating: 4.38 },
  { title: "Think Again", author: "Adam Grant", isbn: "9781984878106", category: "Self-Help", source: "NYT Bestseller", rating: 4.18 },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", isbn: "9780062457714", category: "Self-Help", source: "NYT Bestseller", rating: 3.91 },
  { title: "Mindset", author: "Carol S. Dweck", isbn: "9780345472328", category: "Psychology", source: "Classic", rating: 4.07 },
  { title: "Make Your Bed", author: "William H. McRaven", isbn: "9781455570249", category: "Self-Help", source: "NYT Bestseller", rating: 4.03 },
  { title: "The 5 AM Club", author: "Robin Sharma", isbn: "9781443456623", category: "Self-Help", source: "Bestseller", rating: 3.89 },
  { title: "Essentialism", author: "Greg McKeown", isbn: "9780804137386", category: "Productivity", source: "Bestseller", rating: 4.04 },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", isbn: "9781544514215", category: "Self-Help", source: "Goodreads", rating: 4.39 },
  { title: "12 Rules for Life", author: "Jordan B. Peterson", isbn: "9780345816023", category: "Self-Help", source: "NYT Bestseller", rating: 3.99 },
  { title: "Grit", author: "Angela Duckworth", isbn: "9781501111112", category: "Psychology", source: "NYT Bestseller", rating: 3.98 },
  { title: "The Mountain Is You", author: "Brianna Wiest", isbn: "9781949759228", category: "Self-Help", source: "Goodreads", rating: 4.16 },
  { title: "Four Thousand Weeks", author: "Oliver Burkeman", isbn: "9780374159122", category: "Productivity", source: "NYT Bestseller", rating: 3.97 },
  { title: "Die With Zero", author: "Bill Perkins", isbn: "9780358099765", category: "Self-Help", source: "Goodreads", rating: 3.94 },
  { title: "Never Split the Difference", author: "Chris Voss", isbn: "9780062407801", category: "Business", source: "NYT Bestseller", rating: 4.36 },
  { title: "Outliers", author: "Malcolm Gladwell", isbn: "9780316017930", category: "Psychology", source: "Classic", rating: 4.18 },
  { title: "Be Useful", author: "Arnold Schwarzenegger", isbn: "9780593655955", category: "Self-Help", source: "NYT Bestseller 2023", rating: 4.31 },
];

// Biography / Memoir - Current bestsellers
const BIOGRAPHY_BESTSELLERS: TrendingBook[] = [
  { title: "Elon Musk", author: "Walter Isaacson", isbn: "9781982181284", category: "Biography", source: "NYT Bestseller 2023", rating: 4.12 },
  { title: "Steve Jobs", author: "Walter Isaacson", isbn: "9781451648539", category: "Biography", source: "Classic", rating: 4.17 },
  { title: "Shoe Dog", author: "Phil Knight", isbn: "9781501135927", category: "Memoir", source: "NYT Bestseller", rating: 4.46 },
  { title: "The Diary of a CEO", author: "Steven Bartlett", isbn: "9781785043710", category: "Biography", source: "NYT Bestseller 2023", rating: 4.25 },
  { title: "Greenlights", author: "Matthew McConaughey", isbn: "9780593139134", category: "Memoir", source: "NYT Bestseller", rating: 4.02 },
  { title: "Born a Crime", author: "Trevor Noah", isbn: "9780399588198", category: "Memoir", source: "Goodreads Choice", rating: 4.48 },
  { title: "Becoming", author: "Michelle Obama", isbn: "9781524763138", category: "Memoir", source: "NYT Bestseller", rating: 4.42 },
  { title: "Leonardo da Vinci", author: "Walter Isaacson", isbn: "9781501139154", category: "Biography", source: "NYT Bestseller", rating: 4.22 },
  { title: "The Ride of a Lifetime", author: "Robert Iger", isbn: "9780399592096", category: "Business Memoir", source: "NYT Bestseller", rating: 4.22 },
  { title: "A Promised Land", author: "Barack Obama", isbn: "9781524763169", category: "Memoir", source: "NYT Bestseller", rating: 4.33 },
  { title: "Open", author: "Andre Agassi", isbn: "9780307388407", category: "Memoir", source: "Classic", rating: 4.17 },
  { title: "The Last Lecture", author: "Randy Pausch", isbn: "9781401323257", category: "Memoir", source: "Classic", rating: 4.26 },
  { title: "Total Recall", author: "Arnold Schwarzenegger", isbn: "9781451662436", category: "Memoir", source: "NYT Bestseller", rating: 4.09 },
  { title: "I Am Malala", author: "Malala Yousafzai", isbn: "9780316322423", category: "Memoir", source: "NYT Bestseller", rating: 4.14 },
  { title: "Principles", author: "Ray Dalio", isbn: "9781501124020", category: "Business Memoir", source: "NYT Bestseller", rating: 4.14 },
];

// Business / Entrepreneurship
const BUSINESS_BESTSELLERS: TrendingBook[] = [
  { title: "Zero to One", author: "Peter Thiel", isbn: "9780804139298", category: "Business", source: "Classic", rating: 4.17 },
  { title: "The Lean Startup", author: "Eric Ries", isbn: "9780307887894", category: "Business", source: "Classic", rating: 4.10 },
  { title: "Good to Great", author: "Jim Collins", isbn: "9780066620992", category: "Business", source: "Classic", rating: 4.11 },
  { title: "Start with Why", author: "Simon Sinek", isbn: "9781591846444", category: "Business", source: "NYT Bestseller", rating: 4.09 },
  { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", isbn: "9780062273208", category: "Business", source: "Bestseller", rating: 4.21 },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "9780374533557", category: "Psychology", source: "Classic", rating: 4.18 },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", isbn: "9781612680194", category: "Finance", source: "Classic", rating: 4.10 },
  { title: "The Psychology of Money", author: "Morgan Housel", isbn: "9780857197689", category: "Finance", source: "NYT Bestseller", rating: 4.34 },
  { title: "Rework", author: "Jason Fried", isbn: "9780307463746", category: "Business", source: "NYT Bestseller", rating: 3.97 },
  { title: "The $100 Startup", author: "Chris Guillebeau", isbn: "9780307951526", category: "Business", source: "NYT Bestseller", rating: 3.85 },
  { title: "Blue Ocean Strategy", author: "W. Chan Kim", isbn: "9781625274496", category: "Business", source: "Classic", rating: 3.92 },
  { title: "The Innovator's Dilemma", author: "Clayton M. Christensen", isbn: "9780062060242", category: "Business", source: "Classic", rating: 3.99 },
  { title: "Built to Last", author: "Jim Collins", isbn: "9780060516406", category: "Business", source: "Classic", rating: 4.03 },
  { title: "Measure What Matters", author: "John Doerr", isbn: "9780525536222", category: "Business", source: "NYT Bestseller", rating: 4.04 },
  { title: "The Mom Test", author: "Rob Fitzpatrick", isbn: "9781492180746", category: "Business", source: "Startup Essential", rating: 4.26 },
];

// Psychology / Behavior
const PSYCHOLOGY_BESTSELLERS: TrendingBook[] = [
  { title: "Influence", author: "Robert B. Cialdini", isbn: "9780062937650", category: "Psychology", source: "Classic", rating: 4.22 },
  { title: "Predictably Irrational", author: "Dan Ariely", isbn: "9780061353246", category: "Psychology", source: "NYT Bestseller", rating: 4.13 },
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316097", category: "Non-Fiction", source: "Classic", rating: 4.38 },
  { title: "Homo Deus", author: "Yuval Noah Harari", isbn: "9780062464316", category: "Non-Fiction", source: "NYT Bestseller", rating: 4.19 },
  { title: "21 Lessons for the 21st Century", author: "Yuval Noah Harari", isbn: "9780525512196", category: "Non-Fiction", source: "NYT Bestseller", rating: 3.96 },
  { title: "The Power of Habit", author: "Charles Duhigg", isbn: "9780812981605", category: "Psychology", source: "NYT Bestseller", rating: 4.13 },
  { title: "Blink", author: "Malcolm Gladwell", isbn: "9780316010665", category: "Psychology", source: "Classic", rating: 3.94 },
  { title: "Emotional Intelligence", author: "Daniel Goleman", isbn: "9780553383713", category: "Psychology", source: "Classic", rating: 3.85 },
  { title: "The Body Keeps the Score", author: "Bessel van der Kolk", isbn: "9780143127741", category: "Psychology", source: "NYT Bestseller", rating: 4.40 },
  { title: "Attached", author: "Amir Levine", isbn: "9781585429134", category: "Psychology", source: "Bestseller", rating: 4.12 },
  { title: "Quiet", author: "Susan Cain", isbn: "9780307352156", category: "Psychology", source: "NYT Bestseller", rating: 4.06 },
  { title: "The Social Animal", author: "David Brooks", isbn: "9780812979374", category: "Psychology", source: "NYT Bestseller", rating: 3.85 },
  { title: "Stumbling on Happiness", author: "Daniel Gilbert", isbn: "9781400077427", category: "Psychology", source: "Classic", rating: 3.78 },
  { title: "Man's Search for Meaning", author: "Viktor E. Frankl", isbn: "9780807014295", category: "Psychology", source: "Classic", rating: 4.37 },
  { title: "How to Win Friends and Influence People", author: "Dale Carnegie", isbn: "9780671027032", category: "Self-Help", source: "Classic", rating: 4.22 },
];

// Non-Fiction / Science / History
const NONFICTION_BESTSELLERS: TrendingBook[] = [
  { title: "A Short History of Nearly Everything", author: "Bill Bryson", isbn: "9780767908184", category: "Science", source: "Classic", rating: 4.21 },
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9780393354324", category: "History", source: "Pulitzer Prize", rating: 4.03 },
  { title: "The Gene", author: "Siddhartha Mukherjee", isbn: "9781476733524", category: "Science", source: "Pulitzer Prize", rating: 4.19 },
  { title: "Factfulness", author: "Hans Rosling", isbn: "9781250107817", category: "Non-Fiction", source: "NYT Bestseller", rating: 4.36 },
  { title: "Why We Sleep", author: "Matthew Walker", isbn: "9781501144318", category: "Science", source: "NYT Bestseller", rating: 4.36 },
  { title: "The Code Breaker", author: "Walter Isaacson", isbn: "9781982115852", category: "Science", source: "NYT Bestseller", rating: 4.16 },
  { title: "Breath", author: "James Nestor", isbn: "9780735213616", category: "Science", source: "NYT Bestseller", rating: 4.16 },
  { title: "Range", author: "David Epstein", isbn: "9780735214484", category: "Non-Fiction", source: "NYT Bestseller", rating: 4.06 },
  { title: "The Sixth Extinction", author: "Elizabeth Kolbert", isbn: "9781250062185", category: "Science", source: "Pulitzer Prize", rating: 4.15 },
  { title: "Educated", author: "Tara Westover", isbn: "9780399590504", category: "Memoir", source: "NYT Bestseller", rating: 4.46 },
  { title: "When Breath Becomes Air", author: "Paul Kalanithi", isbn: "9780812988406", category: "Memoir", source: "NYT Bestseller", rating: 4.38 },
  { title: "The Emperor of All Maladies", author: "Siddhartha Mukherjee", isbn: "9781439170915", category: "Science", source: "Pulitzer Prize", rating: 4.33 },
  { title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", isbn: "9780393609394", category: "Science", source: "NYT Bestseller", rating: 3.96 },
  { title: "Brief Answers to the Big Questions", author: "Stephen Hawking", isbn: "9781984819192", category: "Science", source: "Posthumous", rating: 4.16 },
  { title: "An Immense World", author: "Ed Yong", isbn: "9780593133231", category: "Science", source: "Pulitzer Prize 2023", rating: 4.35 },
];

// Fiction Bestsellers (for users who like fiction)
const FICTION_BESTSELLERS: TrendingBook[] = [
  { title: "Fourth Wing", author: "Rebecca Yarros", isbn: "9781649374042", category: "Fantasy", source: "NYT Bestseller 2023", rating: 4.29 },
  { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", isbn: "9780593321201", category: "Fiction", source: "Goodreads Choice 2022", rating: 4.21 },
  { title: "Lessons in Chemistry", author: "Bonnie Garmus", isbn: "9780385547345", category: "Fiction", source: "Goodreads Choice", rating: 4.35 },
  { title: "Project Hail Mary", author: "Andy Weir", isbn: "9780593135204", category: "Sci-Fi", source: "Goodreads Choice", rating: 4.52 },
  { title: "The Midnight Library", author: "Matt Haig", isbn: "9780525559474", category: "Fiction", source: "Goodreads Choice", rating: 3.97 },
  { title: "Atomic Anna", author: "Rachel Barenbaum", isbn: "9781538734605", category: "Fiction", source: "Featured", rating: 3.68 },
  { title: "The House in the Cerulean Sea", author: "TJ Klune", isbn: "9781250217318", category: "Fantasy", source: "Goodreads Choice", rating: 4.38 },
  { title: "Anxious People", author: "Fredrik Backman", isbn: "9781501160837", category: "Fiction", source: "NYT Bestseller", rating: 4.14 },
  { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", isbn: "9781501161933", category: "Fiction", source: "BookTok", rating: 4.47 },
  { title: "A Man Called Ove", author: "Fredrik Backman", isbn: "9781476738024", category: "Fiction", source: "NYT Bestseller", rating: 4.37 },
  { title: "Where the Crawdads Sing", author: "Delia Owens", isbn: "9780735219106", category: "Fiction", source: "NYT Bestseller", rating: 4.46 },
  { title: "The Kite Runner", author: "Khaled Hosseini", isbn: "9781594631931", category: "Fiction", source: "Classic", rating: 4.32 },
  { title: "All the Light We Cannot See", author: "Anthony Doerr", isbn: "9781501173219", category: "Fiction", source: "Pulitzer Prize", rating: 4.34 },
  { title: "The Song of Achilles", author: "Madeline Miller", isbn: "9780062060624", category: "Fiction", source: "Goodreads Choice", rating: 4.36 },
  { title: "Circe", author: "Madeline Miller", isbn: "9780316556347", category: "Fiction", source: "Goodreads Choice", rating: 4.28 },
];

// Spanish Language Bestsellers
const SPANISH_BESTSELLERS: TrendingBook[] = [
  { title: "Cien años de soledad", author: "Gabriel García Márquez", isbn: "9780307474728", category: "Fiction", source: "Nobel Prize", rating: 4.08 },
  { title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez", isbn: "9780307387264", category: "Fiction", source: "Classic", rating: 3.93 },
  { title: "La casa de los espíritus", author: "Isabel Allende", isbn: "9780525433477", category: "Fiction", source: "Classic", rating: 4.26 },
  { title: "La sombra del viento", author: "Carlos Ruiz Zafón", isbn: "9780143034902", category: "Fiction", source: "NYT Bestseller", rating: 4.28 },
  { title: "Como agua para chocolate", author: "Laura Esquivel", isbn: "9780385721233", category: "Fiction", source: "Classic", rating: 3.90 },
  { title: "El laberinto de los espíritus", author: "Carlos Ruiz Zafón", isbn: "9780525433484", category: "Fiction", source: "Bestseller", rating: 4.38 },
  { title: "Los cuatro acuerdos", author: "Don Miguel Ruiz", isbn: "9781878424310", category: "Self-Help", source: "NYT Bestseller", rating: 4.16 },
  { title: "El poder del ahora", author: "Eckhart Tolle", isbn: "9788484452065", category: "Self-Help", source: "Classic", rating: 4.13 },
  { title: "Hábitos atómicos", author: "James Clear", isbn: "9786073807531", category: "Self-Help", source: "Bestseller", rating: 4.38 },
  { title: "Piense y hágase rico", author: "Napoleon Hill", isbn: "9781640950496", category: "Self-Help", source: "Classic", rating: 4.17 },
  { title: "El hombre en busca de sentido", author: "Viktor Frankl", isbn: "9788425432033", category: "Psychology", source: "Classic", rating: 4.37 },
  { title: "Padre rico, padre pobre", author: "Robert Kiyosaki", isbn: "9786073137751", category: "Finance", source: "Bestseller", rating: 4.10 },
  { title: "El código de la manifestación", author: "Raimon Samsó", isbn: "9788416622467", category: "Self-Help", source: "Bestseller", rating: 4.05 },
  { title: "Cómo ganar amigos e influir sobre las personas", author: "Dale Carnegie", isbn: "9788417568122", category: "Self-Help", source: "Classic", rating: 4.22 },
  { title: "El poder de confiar en ti", author: "Curro Cañete", isbn: "9788466666145", category: "Self-Help", source: "Spanish Bestseller", rating: 4.15 },
];

// All trending books combined
export const ALL_TRENDING_BOOKS: TrendingBook[] = [
  ...SELF_HELP_BESTSELLERS,
  ...BIOGRAPHY_BESTSELLERS,
  ...BUSINESS_BESTSELLERS,
  ...PSYCHOLOGY_BESTSELLERS,
  ...NONFICTION_BESTSELLERS,
  ...FICTION_BESTSELLERS,
  ...SPANISH_BESTSELLERS,
];

/**
 * Get trending books filtered by user patterns
 */
export function getTrendingBooksForUser(patterns: {
  isSelfHelp: boolean;
  isBiography: boolean;
  isBusiness: boolean;
  isPsychology: boolean;
  isNonfiction: boolean;
  isFiction: boolean;
}, language: string = 'en', limit: number = 30): TrendingBook[] {
  let relevantBooks: TrendingBook[] = [];

  // Add books based on detected patterns
  if (patterns.isSelfHelp) {
    relevantBooks.push(...SELF_HELP_BESTSELLERS);
  }
  if (patterns.isBiography) {
    relevantBooks.push(...BIOGRAPHY_BESTSELLERS);
  }
  if (patterns.isBusiness) {
    relevantBooks.push(...BUSINESS_BESTSELLERS);
  }
  if (patterns.isPsychology) {
    relevantBooks.push(...PSYCHOLOGY_BESTSELLERS);
  }
  if (patterns.isNonfiction) {
    relevantBooks.push(...NONFICTION_BESTSELLERS);
  }
  if (patterns.isFiction) {
    relevantBooks.push(...FICTION_BESTSELLERS);
  }

  // Add Spanish books if language is Spanish
  if (language === 'es') {
    relevantBooks.push(...SPANISH_BESTSELLERS);
  }

  // If no patterns detected, include self-help and nonfiction (most popular)
  if (relevantBooks.length === 0) {
    relevantBooks = [...SELF_HELP_BESTSELLERS, ...BIOGRAPHY_BESTSELLERS, ...NONFICTION_BESTSELLERS];
  }

  // Remove duplicates
  const seen = new Set<string>();
  relevantBooks = relevantBooks.filter(book => {
    const key = `${book.title.toLowerCase()}-${book.author.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by rating
  relevantBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return relevantBooks.slice(0, limit);
}

/**
 * Get books similar to what user has read
 */
export function getSimilarBooksFromTrending(
  readBooks: { title: string; author: string }[],
  language: string = 'en'
): TrendingBook[] {
  const readTitles = new Set(readBooks.map(b => b.title.toLowerCase()));
  const readAuthors = new Set(readBooks.map(b => b.author.toLowerCase()));

  // Find books by same authors or similar categories
  return ALL_TRENDING_BOOKS.filter(book => {
    // Don't recommend books user already read
    if (readTitles.has(book.title.toLowerCase())) return false;
    
    // Prioritize same author
    if (readAuthors.has(book.author.toLowerCase())) return true;
    
    return true;
  }).slice(0, 20);
}

/**
 * Get specific author recommendations based on what user has read
 */
export function getAuthorRecommendations(likedAuthors: string[]): string[] {
  const authorMap: Record<string, string[]> = {
    'james clear': ['Cal Newport', 'BJ Fogg', 'Charles Duhigg', 'Nir Eyal'],
    'cal newport': ['James Clear', 'Greg McKeown', 'Oliver Burkeman', 'Ryder Carroll'],
    'walter isaacson': ['David McCullough', 'Ron Chernow', 'Doris Kearns Goodwin'],
    'yuval noah harari': ['Jared Diamond', 'Steven Pinker', 'Robert Sapolsky'],
    'malcolm gladwell': ['Daniel Kahneman', 'Dan Ariely', 'Adam Grant', 'Chip Heath'],
    'daniel kahneman': ['Dan Ariely', 'Richard Thaler', 'Nassim Nicholas Taleb'],
    'simon sinek': ['Adam Grant', 'Patrick Lencioni', 'Jim Collins', 'Brené Brown'],
    'arnold schwarzenegger': ['David Goggins', 'Jocko Willink', 'Matthew McConaughey'],
    'david goggins': ['Jocko Willink', 'Cameron Hanes', 'Jesse Itzler'],
    'jordan b. peterson': ['Jonathan Haidt', 'Steven Pinker', 'Sam Harris'],
    'brené brown': ['Adam Grant', 'Susan Cain', 'Angela Duckworth'],
    'adam grant': ['Malcolm Gladwell', 'Daniel Pink', 'Brené Brown', 'Carol Dweck'],
  };

  const recommendations: string[] = [];
  
  for (const author of likedAuthors) {
    const authorLower = author.toLowerCase();
    if (authorMap[authorLower]) {
      recommendations.push(...authorMap[authorLower]);
    }
  }

  // Remove duplicates
  return [...new Set(recommendations)];
}
