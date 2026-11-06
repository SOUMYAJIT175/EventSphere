/**
 * EventSphere - Theme Manager (Dark & Light Mode)
 * Handles modern pill-shaped toggle, LocalStorage persistence,
 * smooth sliding transitions, and system preference detection.
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'eventsphere_theme_preference';
  const htmlElement = document.documentElement;

  // Retrieve saved theme or fallback to system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default to 'dark' for the signature dark emerald-green aesthetic
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  // Apply theme to <html> tag and update toggle buttons
  function applyTheme(theme) {
    if (theme === 'light') {
      htmlElement.setAttribute('data-theme', 'light');
      htmlElement.classList.add('light-theme');
      htmlElement.classList.remove('dark-theme');
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      htmlElement.classList.add('dark-theme');
      htmlElement.classList.remove('light-theme');
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateToggleButtons(theme);
  }

  // Update icons and state on all theme toggle controls
  function updateToggleButtons(theme) {
    // 1. Modern pill toggles
    const pillToggles = document.querySelectorAll('.theme-toggle-pill, .theme-toggle-btn');
    pillToggles.forEach(toggle => {
      if (theme === 'light') {
        toggle.classList.add('is-light');
        toggle.classList.remove('is-dark');
        toggle.setAttribute('aria-label', 'Switch to Dark Mode');
        toggle.setAttribute('title', 'Switch to Dark Mode');
        toggle.setAttribute('aria-checked', 'false');

        // Update thumb icon if present
        const thumbIcon = toggle.querySelector('.thumb-icon');
        if (thumbIcon) {
          thumbIcon.className = 'fa-solid fa-sun thumb-icon';
        }
        const text = toggle.querySelector('.theme-text');
        if (text) {
          text.textContent = 'Dark Mode';
        }
      } else {
        toggle.classList.add('is-dark');
        toggle.classList.remove('is-light');
        toggle.setAttribute('aria-label', 'Switch to Light Mode');
        toggle.setAttribute('title', 'Switch to Light Mode');
        toggle.setAttribute('aria-checked', 'true');

        // Update thumb icon if present
        const thumbIcon = toggle.querySelector('.thumb-icon');
        if (thumbIcon) {
          thumbIcon.className = 'fa-solid fa-moon thumb-icon';
        }
        const text = toggle.querySelector('.theme-text');
        if (text) {
          text.textContent = 'Light Mode';
        }
      }
    });
  }

  // Toggle between dark and light
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);

    // Optional toast notification
    if (window.EventSphere && window.EventSphere.showToast) {
      window.EventSphere.showToast(
        `Switched to ${nextTheme === 'light' ? 'Light Theme ☀️' : 'Dark Theme 🌙'}`,
        'info',
        2200
      );
    }
  }

  // Initialize theme on DOM ready
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleButtons(initialTheme);

    const toggleButtons = document.querySelectorAll('.theme-toggle-pill, .theme-toggle-btn');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });

    // Listen for OS theme changes if user hasn't explicitly set one
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  });

  // Expose to window for external control
  window.EventSphereTheme = {
    get: () => htmlElement.getAttribute('data-theme') || 'dark',
    toggle: toggleTheme,
    set: applyTheme
  };
})();
