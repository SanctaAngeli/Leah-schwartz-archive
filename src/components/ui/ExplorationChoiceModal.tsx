import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIntroComplete } from '../../hooks/useIntroComplete';

interface ExplorationChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExploreOption {
  title: string;
  description: string;
  path: string;
  icon: JSX.Element;
  color: string;
}

function ExplorationChoiceModal({ isOpen, onClose }: ExplorationChoiceModalProps): JSX.Element | null {
  const navigate = useNavigate();
  const { markIntroComplete } = useIntroComplete();

  const handleChoice = (path: string): void => {
    markIntroComplete();
    onClose();
    navigate(path);
  };

  const options: ExploreOption[] = [
    {
      title: 'Browse Freely',
      description: 'Explore the collection at your own pace',
      path: '/gallery',
      color: '#8B7355',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Journey Through Time',
      description: 'Experience four decades of artistic evolution',
      path: '/timeline',
      color: '#6B8E9F',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Discover Places',
      description: 'Explore the landscapes that inspired her work',
      path: '/locations',
      color: '#9B8B7A',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Explore Themes',
      description: 'Discover works grouped by subject and style',
      path: '/themes',
      color: '#A8C090',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: 'Curated Collection',
      description: 'View a selection of her finest works',
      path: '/curated',
      color: '#C4A882',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="text-center pt-12 pb-8 px-6">
              <motion.p
                className="font-body text-text-muted text-sm tracking-[0.3em] uppercase mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Journey Begins
              </motion.p>
              <motion.h2
                className="font-heading text-[clamp(28px,5vw,44px)] text-text-primary leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                How would you like to explore<br />Leah's art?
              </motion.h2>
            </div>

            {/* Options grid */}
            <div className="px-6 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {options.map((option, index) => (
                  <motion.button
                    key={option.path}
                    className="group relative p-6 rounded-2xl border border-gray-100 hover:border-gray-200
                      bg-white hover:bg-gray-50/50 transition-all duration-300 text-left"
                    onClick={() => handleChoice(option.path)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Color accent */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white
                        group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>

                    <h3 className="font-heading text-lg text-text-primary mb-1 group-hover:text-black transition-colors">
                      {option.title}
                    </h3>
                    <p className="font-body text-sm text-text-muted">
                      {option.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer with skip option */}
            <div className="border-t border-gray-100 px-6 py-4 flex justify-center">
              <button
                onClick={onClose}
                className="font-body text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                Continue scrolling instead
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ExplorationChoiceModal;
