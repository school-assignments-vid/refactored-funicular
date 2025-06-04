import '@/styles/globals.css';
import { getById } from './lib';

document.addEventListener('DOMContentLoaded', () => {
  const yearElement = getById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
});
