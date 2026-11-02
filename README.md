# EventSphere – Responsive Event Management Website

![EventSphere Banner](images/hero-illustration.svg)

> **EventSphere** is a modern, responsive, client-side event discovery and registration platform designed and developed for a college web designing project. It delivers an intuitive, commercial-grade user experience with real-time category filtering, debounced search, live countdown timers, interactive digital passes with QR code previews, and persistent browser storage.

---

## 🚀 Live Demo & Quick Launch

- **Zero Build Tools Required:** Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
- **VS Code Live Server:** Right-click `index.html` and click **"Open with Live Server"**.
- **Python Local Server:** Run `python -m http.server 8080` in the project root directory and navigate to `http://localhost:8080`.

---

## 🌟 Key Features

### 1. Modern UI/UX Design System
- **Dark Navy & Purple Aesthetic:** Premium dark theme (`#0a0e1a` base with deep navy `#121829` and purple/indigo gradients) paired with vibrant orange and pink highlights.
- **Glassmorphism & Depth:** Backdrop blur surfaces, soft glowing shadows, and micro-interactions.
- **Smooth Typography:** Rendered with Google Fonts (*Plus Jakarta Sans* and *Poppins*).
- **Responsive Layout:** Engineered with CSS Grid, Flexbox, and fluid media queries across smartphones, tablets, laptops, and ultra-wide displays.

### 2. Event Discovery & Live Interactivity
- **Dynamic Event Cards:** Displays at least 12 rich events covering **Technology, Music, Sports, Education, Business,** and **Arts & Culture**.
- **Combined Filtering & Search:** Category filter pills and live debounced search work seamlessly together.
- **Sorting Options:** Sort events by Date (Soonest first, Latest first), Title (A–Z, Z–A), or Price.
- **Grid & List Layout Views:** Switch between responsive 3-column cards and detailed horizontal list layouts.
- **Empty State Recovery:** If no events match a query, an empty state displays with a quick one-click "Reset Search & Filters" button.
- **Favorites / Bookmarking:** Heart icon lets attendees save favorite events to LocalStorage.

### 3. Event Details Modal
- Opens a dedicated modal dialog without leaving the page.
- Displays high-resolution event banners, category badges, pricing, full agenda, schedule timeline, keynote speakers with avatars, venue coordinates, and remaining seat counts.
- Seamlessly transfers the chosen event into the registration form with one click.
- Native Web Share API integration with automatic fallback to clipboard copy.

### 4. Interactive Registration & Digital Pass
- **Form Fields:** Full Name, Email Address, 10-digit Indian Mobile Number, Selected Event dropdown, Pass Tier, Ticket Count, Dietary/Accessibility notes, and Terms agreement.
- **Strict Client-Side Validation:**
  - Full name length & character checks.
  - RFC 5322 compliant email regex.
  - Valid Indian mobile number validation (`^[6-9]\d{9}$`, accepting optional `+91` / `0` prefixes).
  - Mandatory event selection and checkbox confirmation.
  - Inline error highlights, field shaking, and error messaging.
- **Duplicate Prevention:** Prevents the same email address from registering multiple times for the same event.
- **Unique Ticket ID Generation:** Auto-generates branded ticket identifiers (e.g., `ES-TECH-4819-A8F2`).
- **Digital QR Pass Modal:** Renders an official pass with a simulated QR barcode, attendee information, event summary, and a built-in "Print / Save PDF" feature.

### 5. "My Tickets" Personal Wallet
- Attendees can click **"My Tickets"** in the navigation bar to see all their registered events.
- Shows total ticket count badges in real time.
- Allows attendees to reprint passes or cancel registrations directly from LocalStorage.

### 6. Bonus Features
- **Dark / Light Mode Toggle:** Smooth theme switcher persisting user choice across page refreshes via LocalStorage.
- **Live Event Countdown:** Real-time ticking countdown timer (Days, Hours, Minutes, Seconds) for the premier upcoming conference.
- **Host an Event Proposal Modal:** Dedicated form for organizers to propose new gatherings for curation.
- **Contact Us & Newsletter Forms:** Client-side validated forms with interactive toast alerts.
- **Floating Controls:** Toast notification queue and smooth Back-to-Top button.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Markup** | Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`, `dialog`/`role="dialog"`) |
| **Styling** | Modern CSS3 (Custom Properties/Variables, Flexbox, CSS Grid, Glassmorphism, Keyframe Animations) |
| **Scripting** | Vanilla JavaScript (ES6+ Modules, DOM APIs, Intersection Observer, LocalStorage) |
| **Icons & Fonts** | Font Awesome 6.5.1 CDN, Google Fonts (*Plus Jakarta Sans* & *Poppins*) |
| **Storage** | Browser `localStorage` (No server or database installation required) |

---

## 📁 Folder Structure

```
Event_management/
├── index.html               # Main landing & application page
├── README.md                # Comprehensive project documentation
├── css/
│   ├── style.css            # Design tokens, themes, layout & components
│   └── responsive.css       # Breakpoints for mobile, tablet, and desktop
├── js/
│   ├── events-data.js       # Curated 12-event dataset across 6 categories
│   ├── theme.js             # Dark/Light mode switcher with LocalStorage
│   ├── registration.js      # Form validation, duplicate guard & ticket generator
│   └── app.js               # Search, filters, sort, countdown & modals
└── images/
    ├── logo.svg             # Vector brand logo for EventSphere
    ├── fallback-event.svg   # Offline/error fallback banner SVG
    └── hero-illustration.svg# Hero graphic with floating interactive badges
```

---

## 💾 How LocalStorage Works

EventSphere uses the browser's `localStorage` API to ensure that preferences and ticket bookings persist even after closing or refreshing the browser.

### Keys Used:
1. `eventsphere_theme_preference`: Stores `'dark'` or `'light'`. If not set, it detects the user's OS system preference.
2. `eventsphere_registered_events`: JSON array of registered ticket objects:
   ```json
   [
     {
       "id": "ES-TECH-8472-3K9X",
       "fullName": "Rahul Sharma",
       "email": "rahul.sharma@example.com",
       "phone": "9876543210",
       "eventId": "evt-tech-01",
       "eventTitle": "Global Tech Innovators Summit 2026",
       "eventCategory": "Technology",
       "eventDate": "Nov 15, 2026 • 09:30 AM IST",
       "eventVenue": "Silicon Hall, Tech Park, Bangalore, Karnataka",
       "eventPrice": "₹1,499",
       "ticketType": "VIP Access Pass",
       "ticketsCount": 1,
       "registeredAt": "2026-11-02T12:00:00.000Z"
     }
   ]
   ```
3. `eventsphere_bookmarked_ids`: JSON array of bookmarked event IDs (e.g. `["evt-tech-01", "evt-music-02"]`).

---

## 📋 Client-Side Form Validation Rules

- **Full Name:** Minimum 3 characters; allows letters, spaces, hyphens, and apostrophes.
- **Email Address:** RFC-compliant regex pattern verifying the `@` symbol and valid top-level domain.
- **Mobile Number:** Validated against Indian telecom formats:
  - Supports 10 digits starting with `6`, `7`, `8`, or `9`.
  - Supports optional country code `+91` or leading `0`.
- **Event Selection:** Ensures a valid event is selected from the dropdown.
- **Terms Checkbox:** Must be explicitly checked before submission.
- **Duplicate Registration Check:** Prevents duplicate bookings by verifying if an entry with matching email and event ID already exists in `localStorage`.

---

## 🖥️ Screenshots & Visual Layout

### 1. Dark Mode Hero & Live Countdown
```
+-------------------------------------------------------------------------+
| [EventSphere Logo]   Home  Explore  About  WhyUs  Contact   [☀️] [Tickets] |
+-------------------------------------------------------------------------+
|                                                                         |
|   ✨ Next-Gen Event Experience Platform                                 |
|   Discover Events. Create Memories.               [ Interactive Mockup ]|
|   Connect with conferences, festivals & sports.   [ 85% Seats Reserved ]|
|   [ Explore Events ]  [ Host an Event ]                                 |
|                                                                         |
|   500+ Events | 120k+ Attendees | 6 Categories | 99.4% Rating           |
|                                                                         |
+-------------------------------------------------------------------------+
| [LIVE COUNTDOWN] Global Tech Summit 2026   [12d : 08h : 42m : 19s] [Pass] |
+-------------------------------------------------------------------------+
```

### 2. Explore Events with Real-Time Search & Category Pills
```
+-------------------------------------------------------------------------+
|  [ 🔍 Search events by name, city, or venue...      ] [ Sort By: Date ▾ ]|
|  [ All ] [ Technology ] [ Music ] [ Sports ] [ Education ] [ Business ]  |
+-------------------------------------------------------------------------+
| [ Tech Summit Card ]   [ Indie Fest Card ]   [ Marathon 2026 Card ]     |
| - Nov 15 • Bangalore   - Nov 21 • Pune       - Nov 28 • Mumbai          |
| - ₹1,499 [Details]     - ₹899 [Details]      - FREE [Details]           |
| - [ Register Now ]     - [ Register Now ]    - [ Register Now ]         |
+-------------------------------------------------------------------------+
```

### 3. Digital QR Admission Pass
```
+----------------------------------------------------+
|        EventSphere • OFFICIAL ADMISSION PASS       |
|  CONFIRMATION ID: ES-TECH-2026-X81F                |
|  Event: Global Tech Innovators Summit 2026         |
|  Attendee: Rahul Sharma | Phone: +91 9876543210    |
|  Venue: Silicon Hall, Bangalore                    |
|  [ ■■■■■■ QR BARCODE ■■■■■■ ]                     |
|  [ Print / Save PDF ]              [ Done ]        |
+----------------------------------------------------+
```

---

## 🔮 Future Enhancements
- Integration with razorpay/stripe test payment gateway.
- Export to Google Calendar / iCal file downloads.
- Real-time seat map selection with interactive SVG seating charts.
- Progressive Web App (PWA) manifest for offline smartphone installation.

---

## 👨‍💻 Project Information & Authorship

- **Project Name:** EventSphere – Responsive Event Management Website
- **Purpose:** College Web Designing Coursework / Frontend Portfolio Project
- **Lead Developer & Designer:** Frontend Engineering Student
- **Year:** 2026
- **License:** MIT License (Free for academic and educational learning)
