/**
 * EventSphere - Core Application Controller
 * Manages event filtering, searching, sorting, modals, live countdown,
 * mobile navigation, toast messages, scroll reveals, and interactive orbital ecosystem.
 */

(function () {
  'use strict';

  // Global State
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'date-asc';
  let viewMode = 'grid'; // 'grid' | 'list'
  let bookmarks = [];
  let scrollObserver = null;

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
        const compA = isEventCompleted(a);
        const compB = isEventCompleted(b);
        if (compA !== compB) {
          return compA ? 1 : -1; // Upcoming events first, completed events at the end
        }
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

  // Event Time & Completion Calculation Helpers
  function getEventCompletionTime(evt) {
    if (!evt) return 0;
    if (evt.endDate) {
      const end = new Date(evt.endDate).getTime();
      if (!isNaN(end)) return end;
    }
    const start = new Date(evt.date);
    if (isNaN(start.getTime())) return 0;
    const dateStr = typeof evt.date === 'string' ? evt.date.split('T')[0] : '';
    if (dateStr) {
      const endOfDay = new Date(`${dateStr}T23:59:59+05:30`).getTime();
      if (!isNaN(endOfDay)) return endOfDay;
    }
    return start.getTime();
  }

  function isEventCompleted(evt) {
    if (!evt) return false;
    return Date.now() >= getEventCompletionTime(evt);
  }

  function isEventLive(evt) {
    if (!evt) return false;
    const start = new Date(evt.date).getTime();
    return Date.now() >= start && !isEventCompleted(evt);
  }

  // Calculate precise countdown remaining
  function getTimeRemaining(evt) {
    if (!evt || !evt.date) {
      return { status: 'invalid', days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const now = Date.now();
    const start = new Date(evt.date).getTime();
    if (isNaN(start)) {
      return { status: 'invalid', days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const completion = getEventCompletionTime(evt);

    if (now >= completion) {
      return { status: 'completed', days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    if (now >= start) {
      return { status: 'live', days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const diff = Math.max(0, start - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { status: 'upcoming', days, hours, minutes, seconds };
  }

  // Render individual card countdown component markup
  function renderCardCountdown(evt) {
    const t = getTimeRemaining(evt);

    if (t.status === 'completed') {
      return `
        <div class="card-countdown-panel is-completed" data-countdown-id="${evt.id}">
          <i class="fa-solid fa-circle-check"></i>
          <span>EVENT COMPLETED</span>
        </div>
      `;
    }

    if (t.status === 'live') {
      return `
        <div class="card-countdown-panel is-live" data-countdown-id="${evt.id}">
          <span class="status-live-pulse"></span>
          <span>EVENT HAPPENING NOW</span>
        </div>
      `;
    }

    const dd = String(t.days).padStart(2, '0');
    const hh = String(t.hours).padStart(2, '0');
    const mm = String(t.minutes).padStart(2, '0');
    const ss = String(t.seconds).padStart(2, '0');

    return `
      <div class="card-countdown-panel" data-countdown-id="${evt.id}" role="timer" aria-label="Countdown to ${escapeHtml(evt.title)}">
        <div class="card-countdown-header">
          <i class="fa-regular fa-clock"></i>
          <span>EVENT STARTS IN</span>
        </div>
        <div class="card-countdown-timer">
          <div class="card-timer-box">
            <span class="card-timer-num timer-days">${dd}</span>
            <span class="card-timer-lbl">Days</span>
          </div>
          <span class="card-timer-colon">:</span>
          <div class="card-timer-box">
            <span class="card-timer-num timer-hours">${hh}</span>
            <span class="card-timer-lbl">Hours</span>
          </div>
          <span class="card-timer-colon">:</span>
          <div class="card-timer-box">
            <span class="card-timer-num timer-mins">${mm}</span>
            <span class="card-timer-lbl">Mins</span>
          </div>
          <span class="card-timer-colon">:</span>
          <div class="card-timer-box">
            <span class="card-timer-num timer-secs">${ss}</span>
            <span class="card-timer-lbl">Secs</span>
          </div>
        </div>
      </div>
    `;
  }

  // Central interval for updating all visible card countdowns
  let cardCountdownInterval = null;

  function updateAllCardCountdowns() {
    const panels = document.querySelectorAll('.card-countdown-panel[data-countdown-id]');
    if (!panels || panels.length === 0) return;

    panels.forEach(panel => {
      const id = panel.getAttribute('data-countdown-id');
      const evt = sampleEvents.find(e => e.id === id);
      if (!evt) return;

      const t = getTimeRemaining(evt);

      if (t.status === 'completed') {
        if (!panel.classList.contains('is-completed')) {
          panel.className = 'card-countdown-panel is-completed';
          panel.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>EVENT COMPLETED</span>`;
          // Disable register button on parent card
          const card = panel.closest('.event-card, .spotlight-card');
          if (card) {
            card.classList.add('is-event-concluded');
            const regBtn = card.querySelector('.btn-register-card');
            if (regBtn) {
              regBtn.outerHTML = `<button class="btn btn-sm btn-completed" disabled aria-disabled="true" title="Registration closed for completed event"><i class="fa-solid fa-circle-check"></i> Concluded</button>`;
            }
            const seats = card.querySelector('.seats-indicator');
            if (seats) {
              seats.innerHTML = `<i class="fa-solid fa-user-group"></i> <span>Concluded</span>`;
            }
            const badge = card.querySelector('.spotlight-badge');
            if (badge) {
              badge.className = 'spotlight-badge completed-badge';
              badge.innerHTML = '<i class="fa-solid fa-flag-checkered"></i> Concluded';
            }
          }
        }
        return;
      }

      if (t.status === 'live') {
        if (!panel.classList.contains('is-live')) {
          panel.className = 'card-countdown-panel is-live';
          panel.innerHTML = `<span class="status-live-pulse"></span> <span>EVENT HAPPENING NOW</span>`;
        }
        return;
      }

      // Upcoming countdown tick
      const daysEl = panel.querySelector('.timer-days');
      const hoursEl = panel.querySelector('.timer-hours');
      const minsEl = panel.querySelector('.timer-mins');
      const secsEl = panel.querySelector('.timer-secs');

      if (daysEl) daysEl.textContent = String(t.days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(t.hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(t.minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(t.seconds).padStart(2, '0');
    });
  }

  function startCardCountdowns() {
    if (cardCountdownInterval) {
      clearInterval(cardCountdownInterval);
      cardCountdownInterval = null;
    }
    updateAllCardCountdowns();
    cardCountdownInterval = setInterval(updateAllCardCountdowns, 1000);
  }

  // Render Event Cards
  function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    const filtered = getFilteredEvents();

    if (filtered.length === 0) {
      grid.className = 'events-grid-empty';
      grid.innerHTML = `
        <div class="no-events-box reveal-up is-revealed">
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
      const remainingPanels = document.querySelectorAll('.card-countdown-panel[data-countdown-id]');
      if (remainingPanels.length === 0 && cardCountdownInterval) {
        clearInterval(cardCountdownInterval);
        cardCountdownInterval = null;
      }
      return;
    }

    grid.className = viewMode === 'grid' ? 'events-grid' : 'events-grid list-layout';

    let html = '';
    filtered.forEach((evt, idx) => {
      const isBookmarked = bookmarks.includes(evt.id);
      const isCompleted = isEventCompleted(evt);
      const isFreeBadge = evt.isFree 
        ? '<span class="price-pill free">FREE</span>' 
        : `<span class="price-pill paid">${evt.price}</span>`;

      html += `
        <article class="event-card ${evt.featured ? 'is-featured' : ''} ${isCompleted ? 'is-event-concluded' : ''} reveal-card" data-event-id="${evt.id}" style="--stagger-index: ${idx % 6};">
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
              ${isCompleted ? '<span class="completed-badge"><i class="fa-solid fa-check"></i> Completed</span>' : ''}
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

            <!-- Individual Event Live Countdown Panel -->
            ${renderCardCountdown(evt)}

            <p class="card-desc">
              ${escapeHtml(evt.shortDescription)}
            </p>

            <div class="card-footer">
              <div class="seats-indicator">
                <i class="fa-solid fa-user-group"></i>
                <span>${isCompleted ? 'Concluded' : `<strong class="highlight-seats">${evt.seatsLeft}</strong> spots left`}</span>
              </div>
              <div class="card-actions">
                <button class="btn btn-sm btn-ghost btn-view-details" data-id="${evt.id}">
                  <i class="fa-regular fa-eye"></i> Details
                </button>
                ${isCompleted
                  ? `<button class="btn btn-sm btn-completed" disabled aria-disabled="true" title="Registration closed for completed event"><i class="fa-solid fa-circle-check"></i> Concluded</button>`
                  : `<button class="btn btn-sm btn-primary btn-register-card" data-id="${evt.id}"><i class="fa-solid fa-ticket"></i> Register</button>`
                }
              </div>
            </div>
          </div>
        </article>
      `;
    });

    grid.innerHTML = html;
    attachCardEventListeners();
    observeNewCards();
    startCardCountdowns();
  }

  // Observe newly rendered event cards for scroll reveal
  function observeNewCards() {
    const cards = document.querySelectorAll('.reveal-card, .event-card');
    if (scrollObserver) {
      cards.forEach(card => {
        if (!card.classList.contains('is-revealed')) {
          scrollObserver.observe(card);
        }
      });
    } else {
      cards.forEach(card => card.classList.add('is-revealed'));
    }
  }

  // Render Top 3 Featured Events in Spotlight Section
  function renderFeaturedSpotlight() {
    const container = document.getElementById('featuredSpotlightContainer');
    if (!container || typeof sampleEvents === 'undefined') return;

    const featuredEvents = sampleEvents.filter(e => e.featured).slice(0, 3);
    if (featuredEvents.length === 0) return;

    let html = '';
    featuredEvents.forEach((evt, idx) => {
      const isCompleted = isEventCompleted(evt);
      html += `
        <div class="spotlight-card reveal-up ${isCompleted ? 'is-event-concluded' : ''}" data-event-id="${evt.id}" style="--stagger-index: ${idx};">
          <div class="spotlight-img-wrap">
            <img src="${evt.image}" alt="${escapeHtml(evt.title)}" onerror="this.onerror=null; this.src='images/fallback-event.svg';" />
            ${isCompleted 
              ? '<span class="spotlight-badge completed-badge"><i class="fa-solid fa-flag-checkered"></i> Concluded</span>' 
              : '<span class="spotlight-badge"><i class="fa-solid fa-bolt"></i> Spotlight</span>'}
          </div>
          <div class="spotlight-content">
            <span class="spotlight-category">${evt.category}</span>
            <h3 class="spotlight-title">${escapeHtml(evt.title)}</h3>
            <p class="spotlight-date"><i class="fa-regular fa-calendar"></i> ${evt.dateDisplay}</p>
            <p class="spotlight-venue"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(evt.city)}</p>
            ${renderCardCountdown(evt)}
            <div class="spotlight-bottom">
              <span class="spotlight-price">${evt.price}</span>
              <button class="btn btn-sm btn-primary btn-view-details" data-id="${evt.id}" aria-label="Explore ${escapeHtml(evt.title)}">
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
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEventDetailsModal(btn.getAttribute('data-id'));
      });
    });

    // Card click opens modal
    container.querySelectorAll('.spotlight-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          const id = card.getAttribute('data-event-id');
          if (id) openEventDetailsModal(id);
        }
      });
    });

    if (scrollObserver) {
      container.querySelectorAll('.spotlight-card').forEach(c => scrollObserver.observe(c));
    }

    startCardCountdowns();
  }

  // Card Event Listeners for Events Grid
  function attachCardEventListeners() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    // Details Buttons
    grid.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openEventDetailsModal(id);
      });
    });

    // Register Buttons
    grid.querySelectorAll('.btn-register-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (window.EventSphereReg) {
          window.EventSphereReg.selectEventForRegistration(id);
        }
      });
    });

    // Bookmark Buttons
    grid.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleBookmark(id);
      });
    });

    // Whole card click opens details
    grid.querySelectorAll('.event-card').forEach(card => {
      card.addEventListener('click', (e) => {
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
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
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
      if (isEventCompleted(evt)) {
        registerBtn.disabled = true;
        registerBtn.className = 'btn btn-secondary btn-completed';
        registerBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Event Concluded';
        registerBtn.onclick = null;
      } else {
        registerBtn.disabled = false;
        registerBtn.className = 'btn btn-primary';
        registerBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> Register Now';
        registerBtn.onclick = () => {
          closeModal(modal);
          if (window.EventSphereReg) {
            window.EventSphereReg.selectEventForRegistration(evt.id);
          }
        };
      }
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

  // Start Card Countdowns for all individual events
  function initLiveCountdown() {
    startCardCountdowns();
  }

  // Sticky Navbar & Active Link Spy
  function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('primaryNavMenu');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }

      // Link Spy
      let currentSectionId = '';
      const scrollPos = window.scrollY + 140;

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
        if (window.scrollY > 450) {
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

      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          mobileMenuBtn.classList.remove('is-open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
      });

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
        categoryBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
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
        }, 220);
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

  // Scroll Reveal Animations System via IntersectionObserver
  function initScrollReveals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Elements to reveal (including event cards)
    const revealTargets = document.querySelectorAll(
      '.reveal-up, .reveal-stagger, .reveal-card, .event-card, .section-header, .feature-box, .testimonial-card, .contact-info-card, .contact-form-card, .reg-benefits-card, .registration-form-card, .countdown-card, .spotlight-card, .about-stat-box'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    revealTargets.forEach(el => scrollObserver.observe(el));
  }

  // Animated Statistics Numbers (Rolls up to target when entering viewport)
  function initStatCounters() {
    const statElements = document.querySelectorAll('.stat-number[data-counter]');
    if (statElements.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseFloat(el.getAttribute('data-counter')) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;

          if (prefersReducedMotion) {
            el.innerHTML = `${prefix}${targetVal.toFixed(decimals)}<span>${suffix}</span>`;
            obs.unobserve(el);
            return;
          }

          const duration = 1400; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetVal * eased;

            el.innerHTML = `${prefix}${currentVal.toFixed(decimals)}<span>${suffix}</span>`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.innerHTML = `${prefix}${targetVal.toFixed(decimals)}<span>${suffix}</span>`;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statElements.forEach(el => observer.observe(el));
  }

  // Interactive Orbital Ecosystem Badges in Hero Section
  function initOrbitalInteractions() {
    const orbitalBadges = document.querySelectorAll('.orbital-badge[data-category-target]');
    orbitalBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        const cat = badge.getAttribute('data-category-target');
        if (!cat) return;

        // If target is register
        if (cat === 'register') {
          const regSec = document.getElementById('register');
          if (regSec) regSec.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        // If target is community/testimonials
        if (cat === 'community') {
          const testSec = document.getElementById('testimonials');
          if (testSec) testSec.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        // Filter events
        const catBtn = document.querySelector(`.category-filter-btn[data-category="${cat}"]`);
        if (catBtn) {
          catBtn.click();
        } else {
          currentCategory = cat;
          renderEvents();
        }

        // Smooth scroll to events
        const eventsSec = document.getElementById('events');
        if (eventsSec) {
          eventsSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
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

  // General Modal Dismissals
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
    initScrollReveals();
    renderFeaturedSpotlight();
    renderEvents();
    initLiveCountdown();
    setupContactForm();
    setupHostEventModal();
    setupNewsletter();
    setupModalDismissals();
    setupSmoothScroll();
    initStatCounters();
    initOrbitalInteractions();
  });

  // Public Interface
  window.EventSphere = {
    showToast,
    openEventDetailsModal,
    renderEvents,
    resetFilters
  };
})();
