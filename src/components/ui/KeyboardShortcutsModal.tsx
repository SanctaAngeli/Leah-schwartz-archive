import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['⌘', 'K'], description: 'Open search' },
    { keys: ['G', 'H'], description: 'Go to Home' },
    { keys: ['G', 'G'], description: 'Go to Gallery' },
    { keys: ['G', 'T'], description: 'Go to Timeline' },
    { keys: ['G', 'L'], description: 'Go to Locations' },
    { keys: ['G', 'M'], description: 'Go to Themes' },
    { keys: ['G', 'O'], description: 'Go to Guided Tour' },
  ]},
  { category: 'Artwork Modal', items: [
    { keys: ['←'], description: 'Previous artwork' },
    { keys: ['→'], description: 'Next artwork' },
    { keys: ['Esc'], description: 'Close modal' },
  ]},
  { category: 'Timeline', items: [
    { keys: ['←', '→'], description: 'Navigate years' },
    { keys: ['PgUp', 'PgDn'], description: 'Jump decades' },
  ]},
  { category: 'General', items: [
    { keys: ['R'], description: 'Random artwork' },
    { keys: ['?'], description: 'Show this help' },
    { keys: ['Esc'], description: 'Close dialogs' },
  ]},
];

function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps): JSX.Element | null {
  // Lock body scroll and handle escape
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 id="shortcuts-title" className="font-heading text-xl text-text-primary">
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full
                hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortcuts.map((section) => (
                <div key={section.category}>
                  <h3 className="font-body text-sm font-medium text-text-muted uppercase tracking-wider mb-3">
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((shortcut, index) => (
                      <li key={index} className="flex items-center justify-between gap-4">
                        <span className="font-body text-sm text-text-secondary">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex}>
                              <kbd className="inline-flex items-center justify-center min-w-[24px] px-1.5 py-0.5
                                text-xs font-medium text-text-primary bg-gray-100 border border-gray-200 rounded">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="mx-0.5 text-text-muted text-xs">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-text-muted text-center">
              Press <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-xs">?</kbd> anytime to show this help
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default KeyboardShortcutsModal;
