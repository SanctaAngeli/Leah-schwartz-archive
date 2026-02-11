import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAmbientSound } from '../../hooks/useAmbientSound';

function SettingsPanel(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { toggle: toggleTheme, isNight } = useTheme();
  const { isEnabled: soundEnabled, toggle: toggleSound, volume, setVolume } = useAmbientSound();

  return (
    <>
      {/* Settings button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full
          bg-white/80 backdrop-blur-sm shadow-lg
          flex items-center justify-center
          hover:bg-white transition-colors
          focus:outline-none focus:ring-2 focus:ring-text-primary/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open settings"
      >
        <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </motion.button>

      {/* Settings panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed bottom-0 right-0 z-50 w-full max-w-sm m-4 mb-20
                bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-heading text-lg text-text-primary">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full
                    hover:bg-gray-100 transition-colors"
                  aria-label="Close settings"
                >
                  <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Settings */}
              <div className="p-5 space-y-6">
                {/* Theme toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-text-primary font-medium">Night Mode</p>
                    <p className="font-body text-sm text-text-muted">
                      Contemplative viewing experience
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`
                      relative w-14 h-8 rounded-full transition-colors
                      ${isNight ? 'bg-indigo-500' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={isNight}
                    aria-label="Toggle night mode"
                  >
                    <motion.div
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow"
                      animate={{ x: isNight ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                    {/* Icons */}
                    <span className="absolute left-1.5 top-1.5 text-white opacity-70">
                      {isNight && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </span>
                    <span className="absolute right-1.5 top-1.5 text-gray-400">
                      {!isNight && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>

                {/* Sound toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-text-primary font-medium">UI Sounds</p>
                    <p className="font-body text-sm text-text-muted">
                      Subtle transition sounds
                    </p>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`
                      relative w-14 h-8 rounded-full transition-colors
                      ${soundEnabled ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={soundEnabled}
                    aria-label="Toggle UI sounds"
                  >
                    <motion.div
                      className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow"
                      animate={{ x: soundEnabled ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Volume slider (when sounds enabled) */}
                <AnimatePresence>
                  {soundEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-body text-sm text-text-secondary">Volume</p>
                          <p className="font-body text-sm text-text-muted">{Math.round(volume * 100)}%</p>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-4
                            [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:bg-text-primary
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:cursor-pointer"
                          aria-label="Sound volume"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Keyboard shortcuts hint */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-body text-xs text-text-muted">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">?</kbd> for keyboard shortcuts
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default SettingsPanel;
