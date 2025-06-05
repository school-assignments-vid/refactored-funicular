import { getById, qsa } from '@/lib';
import { HomePage, AboutPage, ContactPage, NewsPage, GalleryPage, NotFoundPage } from '@/pages';

// THIS IMPORT IS DEFINITLY REQUIRED
// Don't ask me why though :D
import { h } from '@/h';

// REMEMBER TO ADD EVERY PAGE
const routes: { [key: string]: () => HTMLElement } = {
  '/': HomePage,
  '/about-us': AboutPage,
  '/contact': ContactPage,
  '/news': NewsPage,
  '/gallery': GalleryPage,
};

/**
 * Handles rendering the correct page based on the URL hash and updating nav links.
 */
const handleRouteChange = () => {
  const appRoot = getById('app-root');
  if (!appRoot) {
    console.error('Application root element #app-root not found!');
    return;
  }

  const path = window.location.hash.slice(1) || '/';

  // This will probably use the fallback page if it work correctly (I really hope this shit works)
  const PageComponent = routes[path] || NotFoundPage;

  appRoot.innerHTML = ''; // This is a MUST if it's not here then the whole thing will probably break
  appRoot.appendChild(PageComponent());

  // Gotta remember to update the navigation :D
  updateNavLinks(path);
};

/**
 * Updates navigation links to highlight the currently active page.
 * @param currentPath - The current route path (e.g., '/', '/about').
 */
const updateNavLinks = (currentPath: string) => {
  const navLinks = qsa<HTMLAnchorElement>('.nav-link');
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute('href')?.slice(1) || '/';

    if (linkPath === currentPath) {
      // This adds the active state and removes the hover stuff from the link
      link.classList.add('text-foreground', 'border-b-2', 'border-base-900');
      link.classList.remove('hover:border-b-2', 'hover:border-base-600');
    } else {
      // This does the opposite of the thing before it
      link.classList.remove('text-foreground', 'border-b-2', 'border-base-900');
      link.classList.add('hover:border-b-2', 'hover:border-base-600');
    }
  });
};

/**
 * Sets up the router by adding event listeners for navigation.
 */
export const initializeRouter = () => {
  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('DOMContentLoaded', handleRouteChange);
};
