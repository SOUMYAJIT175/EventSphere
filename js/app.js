/**
 * EventSphere - Core Application Controller
 * Manages event filtering, searching, sorting, modals, live countdown,
 * mobile navigation, toast messages, and interactive features.
 */

(function () {
  'use strict';

  // Global State
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'date-asc';
  let viewMode = 'grid'; // 'grid' | 'list'
  let bookmarks = [];

  // Bookmarks Storage Key
  const BOOKMARKS_KEY = 'eventsphere_bookmarked_ids';

  function loadBookmarks() {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      bookmarks = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(bookmarks)) bookmarks = [];
    } catch {
      bookmarks = [];
    }
  }

  function toggleBookmark(eventId) {
    if (bookmarks.includes(eventId)) {
      bookmarks = bookmarks.filter(id => id !== eventId);
      showToast('Event removed from your saved list', 'info');
    } else {
      bookmarks.push(eventId);
      showToast('Event added to your saved list ❤️', 'success');
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    renderEvents();
  }

  // Toast Notification System
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `
      <div class="toast-content">
        <i class="${iconClass}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger entrance animation
    setTimeout(() => toast.classList.add('show'), 10);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    const timeoutId = setTimeout(() => removeToast(toast), duration);

    function removeToast(el) {
      clearTimeout(timeoutId);
      el.classList.remove('show');
      el.classList.add('hide');
      setTimeout(() => el.remove(), 300);
    }
  }

  // Filter, Search, and Sort events
  function getFilteredEvents() {
    if (typeof sampleEvents === 'undefined' || !Array.isArray(sampleEvents)) {
      return [];
    }

    let filtered = sampleEvents.filter(evt => {
      // 1. Category Filter
      const matchesCategory = (currentCategory === 'all') || 
        (evt.category.toLowerCase() === currentCategory.toLowerCase());

      // 2. Search Query Filter (Searches Title, City, Venue, Category, and Description)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        evt.title.toLowerCase().includes(q) ||
        evt.city.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        evt.category.toLowerCase().includes(q) ||
        evt.shortDescription.toLowerCase().includes(q)
      );

      return matchesCategory && matchesSearch;
    });

    // 3. Sorting
    filtered.sort((a, b) => {
      if (currentSort === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (currentSort === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (currentSort === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (currentSort === 'title-desc') {
        return b.title.localeCompare(a.title);
      } else if (currentSort === 'price-low') {
        const pA = a.isFree ? 0 : parseInt(a.price.replace(/[^0-9]/g, '')) || 9999;
        const pB = b.isFree ? 0 : parseInt(b.price.replace(/[^0-9]/g, '')) || 9999;
        return pA - pB;
      }
      return 0;
    });

    return filtered;
  }

  // Render Event Cards
  function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    const countEl = document.getElementById('eventsCountBadge');
    if (!grid) return;

    const filtered = getFilteredEvents();

    if (countEl) {
      countEl.textContent = `${filtered.length} of ${sampleEvents.length} Events`;
    }

    if (filtered.length === 0) {
      grid.className = 'events-grid-empty';
      grid.innerHTML = `
        <div class="no-events-box">
          <div class="no-events-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
          <h3>No Matching Events Found</h3>
          <p>We couldn't find any events matching "<strong>${escapeHtml(searchQuery)}</strong>" in <strong>${escapeHtml(currentCategory)}</strong>.</p>
          <button id="resetFiltersBtn" class="btn btn-outline">
            <i class="fa-solid fa-rotate-left"></i> Reset Search &amp; Filters
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
      }
      return;
    }

    grid.className = viewMode === 'grid' ? 'events-grid' : 'events-grid list-layout';

    let html = '';
    filtered.forEach(evt => {
      const isBookmarked = bookmarks.includes(evt.id);
      const isFreeBadge = evt.isFree 
        ? '<span class="price-pill free">FREE</span>' 
        : `<span class="price-pill paid">${evt.price}</span>`;

      html += `
        <article class="event-card ${evt.featured ? 'is-featured' : ''}" data-event-id="${evt.id}">
          <div class="card-media">
            <img 
              src="${evt.image}" 
              alt="${escapeHtml(evt.title)}" 
              loading="lazy" 
              onerror="this.onerror=null; this.src='images/fallback-event.svg';"
            />
            <div class="media-overlay"></div>
            <div class="card-badges">
              <span class="category-badge category-${evt.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
                ${evt.category}
              </span>
              ${evt.featured ? '<span class="featured-badge"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
            </div>
            <button 
              class="bookmark-btn ${isBookmarked ? 'active' : ''}" 
              data-id="${evt.id}" 
              title="${isBookmarked ? 'Remove from Saved' : 'Save Event'}" 
              aria-label="Bookmark event"
            >
              <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <div class="card-price-tag">
              ${isFreeBadge}
            </div>
          </div>

          <div class="card-body">
            <div class="card-meta">
              <span class="meta-item date">
                <i class="fa-regular fa-calendar-days"></i> ${evt.dateDisplay}
              </span>
            </div>

            <h3 class="card-title" title="${escapeHtml(evt.title)}">
              ${escapeHtml(evt.title)}
            </h3>

            <div class="meta-item venue">
              <i class="fa-solid fa-location-dot"></i>
              <span>${escapeHtml(evt.venue)}, ${escapeHtml(evt.city)}</span>
            </div>

            <p class="card-desc">
              ${escapeHtml(evt.shortDescription)}
            </p>

            <div class="card-footer">
              <div class="seats-indicator">
                <i class="fa-solid fa-user-group"></i>
                <span><strong class="highlight-seats">${evt.seatsLeft}</strong> spots left</span>
              </div>
              <div class="card-actions">
                <button class="btn btn-sm btn-ghost btn-view-details" data-id="${evt.id}">
                  <i class="fa-regular fa-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary btn-register-card" data-id="${evt.id}">
                  <i class="fa-solid fa-ticket"></i> Register
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    });

    grid.innerHTML = html;
    attachCardEventListeners();
  }

  // Render Top 3 Featured Events in Spotlight Section
  function renderFeaturedSpotlight() {
    const container = document.getElementById('featuredSpotlightContainer');
    if (!container || typeof sampleEvents === 'undefined') return;

    const featuredEvents = sampleEvents.filter(e => e.featured).slice(0, 3);
    if (featuredEvents.length === 0) return;

    let html = '';
    featuredEvents.forEach(evt => {
      html += `
        <div class="spotlight-card">
          <div class="spotlight-img-wrap">
            <img src="${evt.image}" alt="${escapeHtml(evt.title)}" onerror="this.onerror=null; this.src='images/fallback-event.svg';" />
            <span class="spotlight-badge"><i class="fa-solid fa-bolt"></i> Spotlight</span>
          </div>
          <div class="spotlight-content">
            <span class="spotlight-category">${evt.category}</span>
            <h3 class="spotlight-title">${escapeHtml(evt.title)}</h3>
            <p class="spotlight-date"><i class="fa-regular fa-calendar"></i> ${evt.dateDisplay}</p>
            <p class="spotlight-venue"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(evt.city)}</p>
            <div class="spotlight-bottom">
              <span class="spotlight-price">${evt.price}</span>
              <button class="btn btn-sm btn-primary btn-view-details" data-id="${evt.id}">
                Explore Event <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    // Attach listener to spotlight buttons
    container.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', () => {
        openEventDetailsModal(btn.getAttribute('data-id'));
      });
    });
  }

  // Card Event Listeners
  function attachCardEventListeners() {
    // Details Buttons
    document.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openEventDetailsModal(id);
      });
    });

    // Register Buttons
    document.querySelectorAll('.btn-register-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (window.EventSphereReg) {
          window.EventSphereReg.selectEventForRegistration(id);
        }
      });
    });

    // Bookmark Buttons
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleBookmark(id);
      });
    });

    // Whole card click opens details
    document.querySelectorAll('.event-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Only if user didn't click inside a button
        if (!e.target.closest('button')) {
          const id = card.getAttribute('data-event-id');
          openEventDetailsModal(id);
        }
      });
    });
  }

  // Reset Filters Helper
  function resetFilters() {
    currentCategory = 'all';
    searchQuery = '';
    currentSort = 'date-asc';

    const searchInput = document.getElementById('eventSearchInput');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('eventSortSelect');
    if (sortSelect) sortSelect.value = 'date-asc';

    document.querySelectorAll('.category-filter-btn').forEach(btn => {
      if (btn.getAttribute('data-category') === 'all') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderEvents();
  }

  // Event Details Modal
  function openEventDetailsModal(eventId) {
    const modal = document.getElementById('eventDetailsModal');
    if (!modal) return;

    const evt = sampleEvents.find(e => e.id === eventId);
    if (!evt) return;

    // Fill modal fields
    const banner = document.getElementById('modalBannerImg');
    const title = document.getElementById('modalTitle');
    const categoryBadge = document.getElementById('modalCategory');
    const priceBadge = document.getElementById('modalPrice');
    const date = document.getElementById('modalDate');
    const venue = document.getElementById('modalVenue');
    const desc = document.getElementById('modalDesc');
    const highlightsContainer = document.getElementById('modalHighlightsList');
    const scheduleContainer = document.getElementById('modalScheduleList');
    const speakersContainer = document.getElementById('modalSpeakersList');
    const organizerName = document.getElementById('modalOrganizer');
    const spotsLeft = document.getElementById('modalSpotsLeft');
    const registerBtn = document.getElementById('modalRegisterBtn');
    const shareBtn = document.getElementById('modalShareBtn');

    if (banner) {
      banner.src = evt.image;
      banner.alt = evt.title;
      banner.onerror = function() {
        this.onerror = null;
        this.src = 'images/fallback-event.svg';
      };
    }
    if (title) title.textContent = evt.title;
    if (categoryBadge) categoryBadge.textContent = evt.category;
    if (priceBadge) priceBadge.textContent = evt.price;
    if (date) date.innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${evt.dateDisplay}`;
    if (venue) venue.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${evt.venue}, ${evt.city}`;
    if (desc) desc.textContent = evt.fullDescription || evt.shortDescription;
    if (organizerName) organizerName.textContent = evt.organizer || 'EventSphere Official Partner';
    if (spotsLeft) spotsLeft.textContent = `${evt.seatsLeft} of ${evt.totalSeats} seats remaining`;

    // Highlights
    if (highlightsContainer) {
      if (evt.highlights && evt.highlights.length > 0) {
        highlightsContainer.innerHTML = evt.highlights
          .map(h => `<li><i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(h)}</span></li>`)
          .join('');
      } else {
        highlightsContainer.innerHTML = '<li><i class="fa-solid fa-circle-check"></i> Standard admission & verified certificate.</li>';
      }
    }

    // Schedule
    if (scheduleContainer) {
      if (evt.schedule && evt.schedule.length > 0) {
        scheduleContainer.innerHTML = evt.schedule
          .map(s => `
            <div class="schedule-timeline-item">
              <span class="schedule-time">${escapeHtml(s.time)}</span>
              <span class="schedule-name">${escapeHtml(s.title)}</span>
            </div>
          `).join('');
      } else {
        scheduleContainer.innerHTML = '<p class="text-muted">Full schedule will be sent to registered attendees.</p>';
      }
    }

    // Speakers
    if (speakersContainer) {
      if (evt.speakers && evt.speakers.length > 0) {
        speakersContainer.innerHTML = evt.speakers
          .map(sp => `
            <div class="speaker-chip">
              <img src="${sp.avatar}" alt="${escapeHtml(sp.name)}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';" />
              <div>
                <strong>${escapeHtml(sp.name)}</strong>
                <span>${escapeHtml(sp.role)}</span>
              </div>
            </div>
          `).join('');
      } else {
        speakersContainer.innerHTML = '<p class="text-muted">Keynote speakers will be announced soon.</p>';
      }
    }

    // Register button from modal
    if (registerBtn) {
      registerBtn.onclick = () => {
        closeModal(modal);
        if (window.EventSphereReg) {
          window.EventSphereReg.selectEventForRegistration(evt.id);
        }
      };
    }

    // Share button
    if (shareBtn) {
      shareBtn.onclick = () => {
        const shareData = {
          title: evt.title,
          text: `Check out ${evt.title} on EventSphere!`,
          url: window.location.href.split('#')[0] + `#event-${evt.id}`
        };
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          navigator.share(shareData).catch(() => {});
        } else {
          // Copy to clipboard
          navigator.clipboard.writeText(shareData.url).then(() => {
            showToast('Event link copied to clipboard! 📋', 'success');
          }).catch(() => {
            showToast('Event URL: ' + shareData.url, 'info');
          });
        }
      };
    }

    // Show modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  // Live Countdown Timer for Premier Featured Event
  function initLiveCountdown() {
    const premierEvent = sampleEvents[0]; // Global Tech Innovators Summit 2026
    const targetDate = new Date(premierEvent.date).getTime();

    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');
    const countdownStatus = document.getElementById('countdownStatusText');
    const countdownTitle = document.getElementById('countdownEventTitle');

    if (countdownTitle) {
      countdownTitle.textContent = premierEvent.title;
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        if (countdownStatus) {
          countdownStatus.innerHTML = '<span class="status-live-pulse"></span> EVENT IS CURRENTLY LIVE!';
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Sticky Navbar & Active Link Spy
  function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('primaryNavMenu');

    // Sticky shadow & backdrop on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }

      // Link Spy
      let currentSectionId = '';
      const scrollPos = window.scrollY + 120;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });

      // Back to Top button visibility
      const backToTopBtn = document.getElementById('backToTopBtn');
      if (backToTopBtn) {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    });

    // Mobile Hamburger Menu Toggle
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('is-open', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close mobile menu when clicking any nav link
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          mobileMenuBtn.classList.remove('is-open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
          navMenu.classList.remove('active');
          mobileMenuBtn.classList.remove('is-open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Back to Top button click
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // Filter Buttons & Search input wiring
  function setupFilterAndSearchControls() {
    // 1. Category Filter Buttons
    const categoryBtns = document.querySelectorAll('.category-filter-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category') || 'all';
        renderEvents();
      });
    });

    // 2. Search Input (Debounced)
    const searchInput = document.getElementById('eventSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchQuery = searchInput.value;
          if (clearSearchBtn) {
            clearSearchBtn.style.display = searchQuery ? 'inline-flex' : 'none';
          }
          renderEvents();
        }, 250);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          clearSearchBtn.style.display = 'none';
          renderEvents();
          searchInput.focus();
        }
      });
    }

    // 3. Sort Select
    const sortSelect = document.getElementById('eventSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderEvents();
      });
    }

    // 4. Grid / List View Toggle
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewListBtn = document.getElementById('viewListBtn');

    if (viewGridBtn && viewListBtn) {
      viewGridBtn.addEventListener('click', () => {
        viewMode = 'grid';
        viewGridBtn.classList.add('active');
        viewListBtn.classList.remove('active');
        renderEvents();
      });

      viewListBtn.addEventListener('click', () => {
        viewMode = 'list';
        viewListBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
        renderEvents();
      });
    }
  }

  // Contact Form Validation & Submission
  function setupContactForm() {
    const contactForm = document.getElementById('contactUsForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showFormError('contactName', 'Please enter your name (minimum 2 characters).');
        isValid = false;
      } else {
        clearFormError('contactName');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showFormError('contactEmail', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFormError('contactEmail');
      }

      // Validate subject
      if (!subjectInput.value.trim()) {
        showFormError('contactSubject', 'Please enter a subject.');
        isValid = false;
      } else {
        clearFormError('contactSubject');
      }

      // Validate message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        showFormError('contactMessage', 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        clearFormError('contactMessage');
      }

      if (!isValid) return;

      // Submit Success
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Show confirmation modal or toast
        showToast('Thank you! Your message has been sent. We will respond within 24 hours.', 'success', 5000);
      }, 1000);
    });

    function showFormError(id, msg) {
      const input = document.getElementById(id);
      const err = document.getElementById(`${id}Error`);
      if (input) input.classList.add('is-invalid');
      if (err) {
        err.textContent = msg;
        err.style.display = 'block';
      }
    }

    function clearFormError(id) {
      const input = document.getElementById(id);
      const err = document.getElementById(`${id}Error`);
      if (input) input.classList.remove('is-invalid');
      if (err) {
        err.textContent = '';
        err.style.display = 'none';
      }
    }
  }

  // Host an Event Modal Form
  function setupHostEventModal() {
    const hostModal = document.getElementById('hostEventModal');
    const openBtns = document.querySelectorAll('.btn-open-host-modal');
    const closeBtns = document.querySelectorAll('.close-host-modal');
    const form = document.getElementById('hostEventForm');

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (hostModal) {
          hostModal.classList.add('active');
          document.body.classList.add('modal-open');
        }
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(hostModal);
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('hostTitle');
        const orgInput = document.getElementById('hostOrganizer');
        const emailInput = document.getElementById('hostEmail');

        if (!titleInput.value.trim() || !orgInput.value.trim() || !emailInput.value.trim()) {
          showToast('Please fill all required fields in the proposal.', 'warning');
          return;
        }

        closeModal(hostModal);
        form.reset();
        showToast('Event proposal submitted! Our curation team will review it within 48 hours.', 'success', 5000);
      });
    }
  }

  // Newsletter Subscription
  function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address for subscription.', 'warning');
        return;
      }

      showToast('🎉 You are now subscribed to the EventSphere Weekly Digest!', 'success');
      form.reset();
    });
  }

  // General Modal Backdrop Click & ESC Key
  function setupModalDismissals() {
    const modals = document.querySelectorAll('.es-modal');
    modals.forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          closeModal(m);
        }
      });

      const closeCross = m.querySelector('.modal-close-cross');
      if (closeCross) {
        closeCross.addEventListener('click', () => closeModal(m));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.es-modal.active');
        if (activeModal) closeModal(activeModal);
      }
    });
  }

  // Smooth Scrolling for all hash anchor links
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#!') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // HTML Sanitizer
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize all app modules
  document.addEventListener('DOMContentLoaded', () => {
    loadBookmarks();
    setupNavigation();
    setupFilterAndSearchControls();
    renderFeaturedSpotlight();
    renderEvents();
    initLiveCountdown();
    setupContactForm();
    setupHostEventModal();
    setupNewsletter();
    setupModalDismissals();
    setupSmoothScroll();
  });

  // Public Interface
  window.EventSphere = {
    showToast,
    openEventDetailsModal,
    renderEvents,
    resetFilters
  };
})();
