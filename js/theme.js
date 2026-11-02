/**
 * EventSphere - Theme Manager (Dark & Light Mode)
 * Handles theme toggling, LocalStorage persistence, and system preference detection.
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
    // Default to 'dark' for modern navy aesthetic as requested, or check system
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

  // Update icons and ARIA attributes on all theme toggle buttons
  function updateToggleButtons(theme) {
    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    toggleButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      const text = btn.querySelector('.theme-text');
      if (theme === 'light') {
        if (icon) {
          icon.className = 'fa-solid fa-moon';
        }
        if (text) {
          text.textContent = 'Dark Mode';
        }
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
        btn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        if (icon) {
          icon.className = 'fa-solid fa-sun';
        }
        if (text) {
          text.textContent = 'Light Mode';
        }
        btn.setAttribute('aria-label', 'Switch to Light Mode');
        btn.setAttribute('title', 'Switch to Light Mode');
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
        `Switched to ${nextTheme === 'light' ? 'Light ☀️' : 'Dark 🌙'} mode`,
        'info',
        2000
      );
    }
  }

  // Initialize theme on DOM ready
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    updateToggleButtons(initialTheme);

    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
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

  // Expose to window for external control if needed
  window.EventSphereTheme = {
    get: () => htmlElement.getAttribute('data-theme') || 'dark',
    toggle: toggleTheme,
    set: applyTheme
  };
})();
