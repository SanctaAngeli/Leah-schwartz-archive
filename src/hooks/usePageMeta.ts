// Lightweight per-page document title + description manager.
// Avoids pulling in react-helmet · one useEffect per page.

import { useEffect } from 'react';

const SITE = 'Leah Schwartz Archive';

export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : SITE;
    if (description) {
      let el = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!el) {
        el = document.createElement('meta');
        el.name = 'description';
        document.head.appendChild(el);
      }
      el.setAttribute('content', description);
    }
    // Also update og:title
    let og = document.head.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (og) og.setAttribute('content', title ? `${title} · ${SITE}` : SITE);
    let tw = document.head.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    if (tw) tw.setAttribute('content', title ? `${title} · ${SITE}` : SITE);
  }, [title, description]);
}
