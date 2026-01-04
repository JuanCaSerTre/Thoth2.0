import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLocalization } from '@/contexts/LocalizationContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { language } = useLocalization();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const content = {
    en: {
      verifying: 'Verifying your email...',
      success: 'Email confirmed successfully!',
      redirecting: 'Redirecting...',
      error: 'Verification failed',
      tryAgain: 'Please try again or contact support.'
    },
    es: {
      verifying: 'Verificando tu correo...',
      success: '¡Correo confirmado exitosamente!',
      redirecting: 'Redirigiendo...',
      error: 'Verificación fallida',
      tryAgain: 'Por favor intenta de nuevo o contacta soporte.'
    }
  };

  const c = content[language as keyof typeof content] || content.en;

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash params from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Also check for error in hash
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || c.tryAgain);
          return;
        }

        if (accessToken && refreshToken) {
          // Set the session manually
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setStatus('error');
            setMessage(sessionError.message);
            return;
          }

          setStatus('success');
          setMessage(c.success);

          // Wait a moment to show success message, then redirect
          setTimeout(() => {
            // Check if user has completed onboarding
            const checkOnboarding = async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const { data: prefs } = await supabase
                  .from('user_preferences')
                  .select('onboarding_completed')
                  .eq('user_id', user.id)
                  .single();

                if (prefs?.onboarding_completed) {
                  navigate('/', { replace: true });
                } else {
                  navigate('/onboarding', { replace: true });
                }
              } else {
                navigate('/login', { replace: true });
              }
            };
            checkOnboarding();
          }, 1500);
        } else {
          // No tokens in URL, might be PKCE flow - check session
          const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
          
          if (getSessionError) {
            console.error('Get session error:', getSessionError);
            setStatus('error');
            setMessage(getSessionError.message);
            return;
          }

          if (session) {
            setStatus('success');
            setMessage(c.success);
            setTimeout(() => {
              navigate('/onboarding', { replace: true });
            }, 1500);
          } else {
            // Try to exchange code for session (PKCE)
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            
            if (code) {
              const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
              if (exchangeError) {
                console.error('Code exchange error:', exchangeError);
                setStatus('error');
                setMessage(exchangeError.message);
                return;
              }
              
              setStatus('success');
              setMessage(c.success);
              setTimeout(() => {
                navigate('/onboarding', { replace: true });
              }, 1500);
            } else {
              // No auth data found
              setStatus('error');
              setMessage(c.tryAgain);
            }
          }
        }
      } catch (err) {
        console.error('Auth callback exception:', err);
        setStatus('error');
        setMessage(c.tryAgain);
      }
    };

    handleAuthCallback();
  }, [navigate, c]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="text-center p-8">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-stone-600">{c.verifying}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-green-600 font-medium">{c.success}</p>
            <p className="text-sm text-stone-500 mt-2">{c.redirecting}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-medium">{c.error}</p>
            <p className="text-sm text-stone-500 mt-2">{message}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              {language === 'es' ? 'Ir al inicio de sesión' : 'Go to login'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
