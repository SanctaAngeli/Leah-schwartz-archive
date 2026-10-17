import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Start each new page at the top. Changing only the filters (?chapter=…) or
// jumping to a #section keeps the visitor where they are.

function ScrollToTop(): null {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default ScrollToTop;
