import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-8 bg-bg-gallery"
    >
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <span className="font-heading text-[120px] leading-none text-text-primary/10">
            404
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-3xl text-text-primary mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-secondary mb-8"
        >
          The artwork you're looking for may have been moved to a different gallery,
          or the path you followed doesn't exist.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="glass-pill px-6 py-3 text-text-primary font-medium
              hover:bg-white/90 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-text-primary/20"
          >
            Return Home
          </Link>
          <Link
            to="/gallery"
            className="glass-pill px-6 py-3 text-text-primary font-medium
              hover:bg-white/90 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-text-primary/20"
          >
            View Gallery
          </Link>
        </motion.div>

        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-40 rounded-lg opacity-5"
              style={{
                backgroundColor: ['#8B7355', '#6B8E9F', '#9B8B7A', '#A8C090', '#C4A882'][i],
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [-2 + i, 2 + i, -2 + i],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.main>
  );
}

export default NotFoundPage;
