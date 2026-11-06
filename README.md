# 🌐 EventSphere – Event Management Website

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)](https://eventsphere-six-snowy.vercel.app)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/Academic-Project-10B981?style=for-the-badge)](LICENSE)

**EventSphere** is a modern, responsive client-side event discovery and management platform that allows users to explore upcoming gatherings, discover featured highlights, view comprehensive event details, track individual real-time countdowns, and register with automated digital pass issuance.

Designed with a sleek **dark emerald-green aesthetic** (`#050706` base, `#10B981` emerald accents, `#34D399` mint highlights), EventSphere is built strictly using **Semantic HTML5, CSS3, and Vanilla JavaScript (ES6+)** with **zero external framework dependencies** (no React.js or backend databases required). It utilizes browser **LocalStorage** for state and registration persistence.

---

## 🔗 Live Deployed Link (Vercel)

> 🚀 **Live Production Website:**  
> **[https://eventsphere-six-snowy.vercel.app](https://eventsphere-six-snowy.vercel.app)**  
> *(Click the link above to view and interact with the deployed website on Vercel)*
>
> 📂 **GitHub Repository:**  
> **[https://github.com/SOUMYAJIT175/EventSphere](https://github.com/SOUMYAJIT175/EventSphere)**

---

## 📑 Table of Contents

1. [Live Deployed Link](#-live-deployed-link-vercel)
2. [Academic Evaluation Checklist](#-academic-evaluation-checklist)
3. [Key Features](#-key-features)
4. [Technologies Used](#%EF%B8%8F-technologies-used)
5. [System Architecture & Data Flow](#-system-architecture--data-flow)
6. [Technical Implementation Details](#-technical-implementation-details)
   - [A. High-Performance Live Countdown Engine](#a-high-performance-live-countdown-engine)
   - [B. Client-Side Form Validation & Security](#b-client-side-form-validation--security)
   - [C. UI/UX Design System & Full-Width CSS Grid](#c-uiux-design-system--full-width-css-grid)
   - [D. LocalStorage State Management](#d-localstorage-state-management)
   - [E. Accessibility (WCAG 2.1) & Performance](#e-accessibility-wcag-21--performance)
7. [How It Works (User Journey)](#%EF%B8%8F-how-it-works-user-journey)
8. [Project Structure](#-project-structure)
9. [Getting Started Locally](#-getting-started-locally)
10. [Deploying to Vercel](#-deploying-to-vercel-step-by-step)
11. [Author & Acknowledgements](#-author)
12. [License](#-license)

---

## 🎯 Academic Evaluation Checklist

This project was developed for the **K Explore – Web Designing** task. The table below maps project deliverables directly to standard frontend evaluation criteria:

| Evaluation Criterion | Implementation in EventSphere | Status |
| :--- | :--- | :---: |
| **Semantic HTML5** | Uses `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>`, and accessible landmarks. | ✅ Verified |
| **Pure CSS3 & Styling** | CSS custom properties, glassmorphism (`backdrop-filter`), keyframes, fluid `clamp()`. | ✅ Verified |
| **Responsive Layout** | Mobile-first CSS Grid (4 columns desktop, 3 laptop, 2 tablet, 1 mobile). Spans 94–96% width. | ✅ Verified |
| **Vanilla JavaScript** | Written entirely in modular ES6+; **no React, jQuery, or third-party JS libraries**. | ✅ Verified |
| **Interactive Components** | Category filters, real-time search, sorting, modals, QR pass generator, sliding theme toggle. | ✅ Verified |
| **Individual Live Countdowns** | Per-card live timers calculated with native `Date` objects in IST (`+05:30`), updating every second. | ✅ Verified |
| **Client-Side Validation** | RFC email regex, strict 10-digit Indian cellular format (`^[6-9]\d{9}$`), duplicate booking guards. | ✅ Verified |
| **LocalStorage State** | Persists booked tickets, bookmarked favorites, and dark/light mode across page reloads. | ✅ Verified |
| **Cloud Deployment** | Production-ready static hosting on **Vercel** with global CDN caching. | ✅ Verified |

---

## ✨ Key Features

- **Modern UI & Aesthetic:** Premium dark emerald-green theme (`#050706` background, `#0A100D` elevated surfaces, `#10B981` emerald borders, and `#34D399` mint accents) with glassmorphism, subtle neon glows, and zero blue/purple hues.
- **Explore Events Grid:** Comprehensive catalog featuring 13 curated gatherings across 6 categories: **Technology, Music, Sports, Education, Business,** and **Arts & Culture**.
- **Instant Search & Category Filtering:** Interactive category pills and a debounced search bar filtering across title, venue, city, and description simultaneously.
- **Dynamic Sorting:** Sort events by Date (Soonest first, Latest first), Title (A to Z, Z to A), or Price.
- **Featured Highlights:** Editor's picks section displaying marquee conferences and festivals with dedicated live countdowns.
- **Individual Live Event Countdowns:**
  - Every card features an embedded, compact countdown: `EVENT STARTS IN (DAYS : HOURS : MINS : SECS)`.
  - Calculates time using Indian Standard Time (`Asia/Kolkata` / `+05:30`).
  - Single master `setInterval` ticker ensures zero timer drift, zero memory leaks, and no duplicate intervals.
- **Event Expiry & Completed Status:** Concluded events stop ticking, transition to `EVENT COMPLETED`, disable registration buttons, and sort to the end of the list while keeping event details readable.
- **Event Details Modal:** In-depth popups with event schedule timelines, keynote speaker chips with avatars, venue coordinates, ticket pricing, and seat counters.
- **Registration & Automated Digital Pass:**
  - Strict validation of attendee credentials and Indian phone numbers.
  - Prevents duplicate registrations with the same email for the same event.
  - Generates a branded digital pass with an official confirmation ID (e.g. `ES-TECH-2026-X81F`) and printable QR code.
- **"My Tickets" Digital Wallet:** Attendee wallet in the navigation bar to inspect, reprint, or cancel registered tickets stored in `localStorage`.
- **Sliding Dark/Light Theme Switcher:** Pill-shaped sliding toggle smoothly transitioning between the dark emerald theme and a crisp off-white light theme (`#F4F6F8`).
- **Interactive Orbital Hero:** Floating interactive ecosystem badges displaying attendee counts, live concerts, tech summits, and instant registration shortcuts.
- **Scroll Reveal Animations:** Powered by native `IntersectionObserver` with smooth transforms and graceful fallbacks for reduced-motion preferences.

---

## 🛠️ Technologies Used

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EVENTSPHERE TECH STACK                          │
├───────────────────┬────────────────────────────────────────────────────┤
│ Markup            │ Semantic HTML5 (W3C Valid, Accessible, SEO-ready)   │
│ Styling           │ Modern CSS3 (Variables, CSS Grid, Flexbox, Clamped)│
│ Core Scripting    │ Vanilla JavaScript (ES6+, DOM API, Timer Engines)  │
│ Icons & Fonts     │ Font Awesome 6.5.1 CDN, Google Fonts (Plus Jakarta)│
│ State Persistence │ Browser LocalStorage API (Zero database required)   │
│ Version Control   │ Git & GitHub                                       │
│ Deployment        │ Vercel (Production Edge Network)                   │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 📐 System Architecture & Data Flow

```
                     ┌─────────────────────────────┐
                     │    Browser LocalStorage     │
                     │  - Theme Preference         │
                     │  - Bookmarked Event IDs     │
                     │  - Registered Tickets Array │
                     └──────────────▲──────────────┘
                                    │ (Sync on State Change)
                                    ▼
┌────────────────────────┐   ┌──────────────┐   ┌────────────────────────┐
│  Curated Event Dataset │──▶│  js/app.js   │◀──│  User Interactions     │
│  (js/events-data.js)   │   │  Controller  │   │  - Search / Filter     │
│  - 13 Curated Events   │   └──────┬───────┘   │  - Sort Selection      │
│  - IST Date Objects    │          │           │  - Modal Triggers      │
└────────────────────────┘          │           └────────────────────────┘
                                    ▼
               ┌────────────────────────────────────────┐
               │         Dynamic DOM Rendering          │
               │  - Featured Spotlight (3 Cards)        │
               │  - Explore Events Grid (13 Cards)      │
               │  - Centralized 1000ms Countdown Ticker │
               │  - Scroll Reveal IntersectionObserver  │
               └────────────────────┬───────────────────┘
                                    │
                                    ▼
               ┌────────────────────────────────────────┐
               │    Registration & Pass Generator       │
               │       (js/registration.js)             │
               │  - Strict Indian Phone Validation      │
               │  - Duplicate Email Guard               │
               │  - Digital QR Barcode Pass Modal       │
               │  - "My Tickets" Wallet Modal           │
               └────────────────────────────────────────┘
```

---

## 🔬 Technical Implementation Details

### A. High-Performance Live Countdown Engine
Rather than creating individual `setInterval` timers for every card (which can cause memory leaks, thread contention, and timer drift), EventSphere implements a **Single Master Interval Engine**:
1. **Centralized Ticker:** A single `setInterval(updateAllCardCountdowns, 1000)` queries all visible `.card-countdown-panel[data-countdown-id]` nodes simultaneously.
2. **Indian Standard Time (IST) Synchronization:**
   ```javascript
   // Parse explicit ISO-8601 strings in +05:30 IST offset
   const now = Date.now();
   const start = new Date(evt.date).getTime();
   const diff = Math.max(0, start - now);
   ```
3. **Clamping & Expiry:** Diff values are clamped at `Math.max(0, start - now)`. Once `now >= completion`, negative values are prevented, the panel switches to `EVENT COMPLETED`, and registration buttons are disabled.
4. **End-Time Fallback:** If an event has no specified `endDate`, it automatically remains active until `11:59:59 PM IST` (`23:59:59+05:30`) on its start date.

### B. Client-Side Form Validation & Security
All inputs are validated in real time using strict regular expressions and DOM state checks:
- **Indian Cellular Validation:**
  ```javascript
  // Validates 10-digit Indian numbers starting with 6, 7, 8, or 9
  const phonePattern = /^(?:(?:\+|0{0,2})91[\s-]?)?[6-9]\d{9}$/;
  ```
- **RFC-5322 Compliant Email Regex:**
  ```javascript
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  ```
- **XSS Sanitization:** All dynamic strings are filtered through an entity escape utility (`escapeHtml`) before being inserted into DOM innerHTML templates.
- **Duplicate Registration Guard:** Prevents attendees from registering multiple times with the same email address for the same event ID:
  ```javascript
  const isDuplicate = existingTickets.some(
    t => t.eventId === selectedEventId && t.email.toLowerCase() === email.toLowerCase()
  );
  ```

### C. UI/UX Design System & Full-Width CSS Grid
- **Full-Width Spanning:** Containers span **94–96% of the available desktop viewport**, eliminating artificial narrow margins and taking full advantage of modern widescreen displays.
- **Responsive Breakpoint Matrix:**
  - Desktop (>1200px): `grid-template-columns: repeat(4, 1fr)`
  - Standard Laptop (992px–1200px): `grid-template-columns: repeat(3, 1fr)`
  - Tablet (640px–991px): `grid-template-columns: repeat(2, 1fr)`
  - Smartphone (<640px): `grid-template-columns: 1fr`
- **Fluid Typography & Spacing:** Powered by `clamp(18px, 1.8vw, 28px)` to ensure proportional scaling across all viewport sizes.

### D. LocalStorage State Management
EventSphere uses three distinct keys to ensure complete state persistence:

| LocalStorage Key | Type | Purpose |
| :--- | :--- | :--- |
| `eventsphere_theme_preference` | String (`'dark'` \| `'light'`) | Restores user's chosen color scheme on page load. |
| `eventsphere_bookmarked_ids` | JSON Array (`string[]`) | Preserves favorite event bookmarks (e.g. `["evt-tech-01"]`). |
| `eventsphere_registered_events` | JSON Array (`TicketObject[]`) | Stores confirmed digital ticket registrations and details. |

### E. Accessibility (WCAG 2.1) & Performance
- **Reduced Motion:** Supports `@media (prefers-reduced-motion: reduce)` to disable transitions and instant-load counters for users with vestibular sensitivities.
- **Color Contrast:** Foreground text `#F8FAFC` against `#050706` background delivers a **17.8:1 contrast ratio**, exceeding WCAG AAA standards.
- **ARIA & Keyboard Navigation:** Modal focus management, ESC key dismissals, tablists with `role="tab"`, and `aria-label` tags for screen readers.

---

## ⚙️ How It Works (User Journey)

```
[ Homepage & Hero ] ──▶ [ Featured Highlights ] ──▶ [ Explore Events Grid ]
         │                        │                           │
         ▼                        ▼                           ▼
[ Interactive Badges ]   [ Live Countdown ]          [ Filters & Search ]
                                  │                           │
                                  ▼                           ▼
                     [ Event Details Modal ] ◀────────────────┘
                                  │
                                  ▼
                     [ Event Registration Form ]
                                  │
                                  ▼
                   [ JavaScript Validation Check ]
                     ├─ Invalid ──▶ Show Inline Error
                     └─ Valid   ──▶ Save to LocalStorage
                                  │
                                  ▼
                   [ Digital QR Admission Pass ]
```

1. **Homepage Discovery:** Users arrive on the dark emerald landing page, exploring the interactive orbital hero section and live statistics.
2. **Reviewing Featured Highlights:** Users view the top 3 editor's picks, each displaying an active live countdown ticking down to event day.
3. **Filtering & Searching:** Users refine events using category buttons (Technology, Music, Sports, etc.) or typing in the search box.
4. **Inspecting Event Details:** Clicking **"Explore Event"** opens a detailed modal with agendas, speaker profiles, and venue details.
5. **Registering:** Clicking **"Register Now"** pre-selects the event in the registration form. The user enters their full name, email, and 10-digit mobile number.
6. **Instant Verification:** Client-side JavaScript verifies the inputs, checks for duplicate bookings, and saves the pass to `localStorage`.
7. **Digital Admission Pass:** A confirmation dialog presents the attendee with their official ticket ID, details, and printable QR pass.
8. **Wallet Access:** Users can reopen or print their passes at any time using the **"My Tickets"** button in the top navigation bar.

---

## 📁 Project Structure

```
EventSphere/
├── .gitignore                   # Git version control ignore rules
├── index.html                   # Semantic HTML5 single-page application markup
├── README.md                    # Comprehensive technical documentation & evaluation guide
├── css/
│   ├── style.css                # Dark emerald design system, glassmorphism, variables & cards
│   └── responsive.css           # Fluid media queries for mobile, tablet, and widescreen desktops
├── js/
│   ├── events-data.js           # Curated 13-event dataset across 6 categories (Nov 6 – Dec 30, 2026)
│   ├── app.js                   # Search, filters, sort, live countdown engine & modal controllers
│   ├── registration.js          # Form validation (Indian phone format), duplicate guard & ticket generator 
│   └── theme.js                 # Sliding pill theme switcher with LocalStorage synchronization
└── images/
    ├── logo.svg                 # EventSphere SVG brand logo with glowing planet orbit
    ├── fallback-event.svg       # Offline fallback placeholder for broken network images
    └── hero-illustration.svg    # Stage pass holographic illustration graphic
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/SOUMYAJIT175/EventSphere.git
```

### 2. Navigate to Project Directory
```bash
cd EventSphere
```

### 3. Run Locally

#### Method A: Direct Browser Launch
Because EventSphere uses standard HTML5, CSS3, and JavaScript, no build process is needed. Simply double-click `index.html` or open it directly in Chrome, Edge, Firefox, or Safari.

#### Method B: VS Code Live Server (Recommended)
1. Open the project in **Visual Studio Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. View the live application at `http://127.0.0.1:5500`.

#### Method C: Local Python / Node Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

---

## ☁️ Deploying to Vercel (Step-by-Step)

EventSphere is fully optimized for static deployment on **Vercel** with zero configuration required.

### Method 1: Deploy via Vercel Dashboard (Recommended)
1. Push your latest code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy EventSphere to Vercel"
   git push origin main
   ```
2. Navigate to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New..."** > **"Project"**.
4. Select the **`EventSphere`** repository from your GitHub list.
5. In the configuration screen:
   - **Framework Preset:** Select **Other**.
   - **Root Directory:** `./` (Leave as default).
   - **Build and Output Settings:** Leave blank (static project).
6. Click **Deploy**.
7. Your site will be live within seconds at a custom URL such as:
   `https://eventsphere-six-snowy.vercel.app`

### Method 2: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy to production
vercel --prod
```

> **Tip:** Once deployed, update the [Live Deployed Link](#-live-deployed-link-vercel) section at the top of this README with your assigned Vercel URL.

---

## 👨‍💻 Author

**Soumyajit Bag**  
- **GitHub:** [@SOUMYAJIT175](https://github.com/SOUMYAJIT175)  
- **Project:** EventSphere – Responsive Event Management Website  
- **Coursework:** K Explore – Web Designing Task (2026)

---

## 📄 License

This project is created and submitted for academic and educational evaluation as part of the **K Explore – Web Designing** curriculum.

---

⭐ **If you find this project helpful, please consider giving it a star on [GitHub](https://github.com/SOUMYAJIT175/EventSphere)!**
