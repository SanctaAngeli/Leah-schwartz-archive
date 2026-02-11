import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface IntroContextType {
  hasCompletedIntro: boolean;
  markIntroComplete: () => void;
  resetIntro: () => void;
}

const IntroContext = createContext<IntroContextType | null>(null);

export function IntroProvider({ children }: { children: ReactNode }): JSX.Element {
  const [hasCompletedIntro, setHasCompletedIntro] = useState(() => {
    // Check if user has already completed intro in this session
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('intro-complete') === 'true';
    }
    return false;
  });

  const markIntroComplete = useCallback(() => {
    setHasCompletedIntro(true);
    sessionStorage.setItem('intro-complete', 'true');
  }, []);

  const resetIntro = useCallback(() => {
    setHasCompletedIntro(false);
    sessionStorage.removeItem('intro-complete');
  }, []);

  return (
    <IntroContext.Provider value={{ hasCompletedIntro, markIntroComplete, resetIntro }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntroComplete(): IntroContextType {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntroComplete must be used within an IntroProvider');
  }
  return context;
}
