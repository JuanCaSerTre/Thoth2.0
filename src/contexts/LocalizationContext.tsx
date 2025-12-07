import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  detectUserCountry, 
  detectUserLanguage, 
  getLanguageFromCountry,
  t as translate,
  generateAmazonLink,
  generateKindleLink,
  isValidISBN,
  getSupportedLanguages,
  AMAZON_DOMAINS
} from '@/lib/localization';

interface LocalizationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  country: string;
  setCountry: (country: string) => void;
  t: (key: string) => string;
  getAmazonLink: (isbn: string | undefined, title: string, author: string) => string;
  getKindleLink: (isbn: string | undefined, title: string, author: string) => string;
  hasValidISBN: (isbn: string | undefined) => boolean;
  supportedLanguages: { code: string; name: string }[];
  supportedCountries: { code: string; name: string }[];
  isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('en');
  const [country, setCountryState] = useState<string>('US');
  const [isLoading, setIsLoading] = useState(true);

  // Detect country on mount
  useEffect(() => {
    const initLocalization = async () => {
      try {
        const detectedCountry = await detectUserCountry();
        setCountryState(detectedCountry);
        console.log('Detected country:', detectedCountry);
        
        // Check if user manually set language (different from auto-detected)
        const savedLang = localStorage.getItem('userLanguage');
        const manuallySet = localStorage.getItem('languageManuallySet');
        
        if (savedLang && manuallySet === 'true') {
          // User manually changed language, keep their preference
          setLanguageState(savedLang);
          console.log('Using manually set language:', savedLang);
        } else {
          // Auto-detect language from country
          const countryLang = getLanguageFromCountry(detectedCountry);
          setLanguageState(countryLang);
          localStorage.setItem('userLanguage', countryLang);
          console.log('Auto-detected language from country:', countryLang);
        }
      } catch (error) {
        console.error('Error detecting localization:', error);
        // Fallback to browser language
        const browserLang = detectUserLanguage();
        setLanguageState(browserLang);
      } finally {
        setIsLoading(false);
      }
    };

    initLocalization();
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('userLanguage', lang);
    localStorage.setItem('languageManuallySet', 'true');
  };

  const setCountry = (countryCode: string) => {
    setCountryState(countryCode);
    localStorage.setItem('userCountry', countryCode);
  };

  const t = (key: string): string => {
    return translate(key, language);
  };

  const getAmazonLink = (isbn: string | undefined, title: string, author: string): string => {
    return generateAmazonLink(isbn, title, author, country);
  };

  const getKindleLink = (isbn: string | undefined, title: string, author: string): string => {
    return generateKindleLink(isbn, title, author, country);
  };

  const hasValidISBN = (isbn: string | undefined): boolean => {
    return isValidISBN(isbn);
  };

  const supportedLanguages = getSupportedLanguages();
  
  const supportedCountries = Object.entries(AMAZON_DOMAINS).map(([code, data]) => ({
    code,
    name: data.name
  }));

  return (
    <LocalizationContext.Provider
      value={{
        language,
        setLanguage,
        country,
        setCountry,
        t,
        getAmazonLink,
        getKindleLink,
        hasValidISBN,
        supportedLanguages,
        supportedCountries,
        isLoading
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
