import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Navigation(): JSX.Element {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/locations', label: 'Locations' },
    { path: '/themes', label: 'Themes' },
    { path: '/tour', label: 'Guided Tour' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-pill px-2 py-2 flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ease-smooth ${
                isActive
                  ? 'bg-text-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}

export default Navigation;
