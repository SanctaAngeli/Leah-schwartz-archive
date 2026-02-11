import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyboardShortcutsModal from '../components/ui/KeyboardShortcutsModal';
import { getRandomArtwork } from './useRandomArtwork';

interface KeyboardShortcutsContextType {
  showHelp: () => void;
  hideHelp: () => void;
  isHelpOpen: boolean;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();
  const pendingKey = useRef<string | null>(null);
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showHelp = useCallback(() => setIsHelpOpen(true), []);
  const hideHelp = useCallback(() => setIsHelpOpen(false), []);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Don't intercept if modal is open
      if (isHelpOpen) return;

      // ? - Show help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        showHelp();
        return;
      }

      // R - Random artwork
      if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const artwork = getRandomArtwork();
        navigate(`/artwork/${artwork.id}`);
        return;
      }

      // G + [letter] navigation sequences
      if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        pendingKey.current = 'g';

        // Clear any existing timeout
        if (pendingTimeout.current) {
          clearTimeout(pendingTimeout.current);
        }

        // Reset pending key after 1 second
        pendingTimeout.current = setTimeout(() => {
          pendingKey.current = null;
        }, 1000);
        return;
      }

      // If we have a pending 'g' key, check for navigation
      if (pendingKey.current === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        pendingKey.current = null;

        if (pendingTimeout.current) {
          clearTimeout(pendingTimeout.current);
        }

        const key = e.key.toLowerCase();
        switch (key) {
          case 'h':
            navigate('/');
            break;
          case 'g':
            navigate('/gallery');
            break;
          case 't':
            navigate('/timeline');
            break;
          case 'l':
            navigate('/locations');
            break;
          case 'm':
            navigate('/themes');
            break;
          case 'o':
            navigate('/tour');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (pendingTimeout.current) {
        clearTimeout(pendingTimeout.current);
      }
    };
  }, [navigate, isHelpOpen, showHelp]);

  return (
    <KeyboardShortcutsContext.Provider value={{ showHelp, hideHelp, isHelpOpen }}>
      {children}
      <KeyboardShortcutsModal isOpen={isHelpOpen} onClose={hideHelp} />
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts(): KeyboardShortcutsContextType {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
}
