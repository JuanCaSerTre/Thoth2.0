import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, Moon, Sun, Menu, X, Sparkles, User, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, country, setCountry, supportedLanguages, supportedCountries } = useLocalization();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">THOTH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/about"
              className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-full ${
                isActive('/about')
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {t('nav.about')}
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 px-4 py-2 rounded-full ${
                    isActive('/profile')
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {t('nav.profile')}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 hover:bg-muted rounded-full text-muted-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button 
                  size="sm" 
                  className="rounded-full px-6 bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  {t('nav.login')}
                </Button>
              </Link>
            )}

            {/* Language/Country Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-9 h-9 p-0 hover:bg-muted"
                >
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t('profile.language')}</DropdownMenuLabel>
                {supportedLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? 'bg-muted' : ''}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Amazon Region</DropdownMenuLabel>
                {supportedCountries.slice(0, 10).map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setCountry(c.code)}
                    className={country === c.code ? 'bg-muted' : ''}
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 p-0 hover:bg-muted"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 p-0"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full w-9 h-9 p-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2 border-t border-border pt-3">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive('/about')
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {t('nav.about')}
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  size="sm" 
                  className="rounded-full w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {t('nav.login')}
                </Button>
              </Link>
            )}

            {/* Mobile Language Selector */}
            <div className="px-4 py-2.5 space-y-2">
              <p className="text-xs text-muted-foreground font-medium">{t('profile.language')}</p>
              <div className="flex flex-wrap gap-2">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}