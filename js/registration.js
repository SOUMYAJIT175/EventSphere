/**
 * EventSphere - Event Registration & LocalStorage Management
 * Handles form validation, Indian phone validation, duplicate prevention,
 * unique ticket generation, LocalStorage persistence, and Digital Pass rendering.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'eventsphere_registered_events';

  // State
  let registrations = [];

  // Load from LocalStorage
  function loadRegistrations() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      registrations = data ? JSON.parse(data) : [];
      if (!Array.isArray(registrations)) {
        registrations = [];
      }
    } catch (err) {
      console.error('Error loading registrations from LocalStorage:', err);
      registrations = [];
    }
    updateMyTicketsBadge();
    return registrations;
  }

  // Save to LocalStorage
  function saveRegistrations() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
      updateMyTicketsBadge();
    } catch (err) {
      console.error('Error saving registrations to LocalStorage:', err);
    }
  }

  // Generate Unique Registration ID: ES-YEAR-RANDOMHEX
  function generateRegistrationId(category = 'GEN') {
    const prefix = category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'EVT');
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `ES-${prefix}-${timestamp}-${randomHex}`;
  }

  // Update navigation badge for tickets count
  function updateMyTicketsBadge() {
    const badgeElements = document.querySelectorAll('.my-tickets-badge');
    const count = registrations.length;
    badgeElements.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  // Indian Phone Number Validator:
  // Allows optional +91, 91, or 0, followed by 10 digits starting with 6, 7, 8, or 9
  function isValidIndianPhone(phone) {
    if (!phone) return false;
    // Strip all spaces, dashes, parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const indianPhoneRegex = /^(?:(?:\+|00)91|0)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(cleaned);
  }

  // Email format validator
  function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email.trim());
  }

  // Populate event dropdown in form
  function populateEventDropdown(selectedEventId = '') {
    const eventSelect = document.getElementById('regEventSelect');
    if (!eventSelect) return;

    // Clear existing options except placeholder
    eventSelect.innerHTML = '<option value="" disabled selected>-- Select an Event to Attend --</option>';

    if (typeof sampleEvents !== 'undefined' && Array.isArray(sampleEvents)) {
      sampleEvents.forEach(evt => {
        const option = document.createElement('option');
        option.value = evt.id;
        option.textContent = `${evt.title} (${evt.category} • ${evt.price})`;
        if (selectedEventId && evt.id === selectedEventId) {
          option.selected = true;
        }
        eventSelect.appendChild(option);
      });
    }

    // If an ID was given, set it
    if (selectedEventId) {
      eventSelect.value = selectedEventId;
    }
  }

  // Real-time Field Validation Helpers
  function setFieldError(fieldId, errorMsg) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (field) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.style.display = 'block';
    }
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (field) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  function resetAllFormErrors() {
    ['regFullName', 'regEmail', 'regPhone', 'regEventSelect', 'regTerms'].forEach(id => {
      const field = document.getElementById(id);
      const errorEl = document.getElementById(`${id}Error`);
      if (field) {
        field.classList.remove('is-invalid');
        field.classList.remove('is-valid');
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    });
  }

  // Validate entire registration form
  function validateRegistrationForm() {
    let isValid = true;

    // 1. Full Name
    const nameInput = document.getElementById('regFullName');
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      setFieldError('regFullName', 'Full Name is required.');
      isValid = false;
    } else if (nameVal.length < 3) {
      setFieldError('regFullName', 'Name must be at least 3 characters long.');
      isValid = false;
    } else if (!/^[a-zA-Z\s.'-]+$/.test(nameVal)) {
      setFieldError('regFullName', 'Name should contain letters only.');
      isValid = false;
    } else {
      clearFieldError('regFullName');
    }

    // 2. Email
    const emailInput = document.getElementById('regEmail');
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      setFieldError('regEmail', 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      setFieldError('regEmail', 'Please enter a valid email address (e.g. name@example.com).');
      isValid = false;
    } else {
      clearFieldError('regEmail');
    }

    // 3. Indian Phone
    const phoneInput = document.getElementById('regPhone');
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (!phoneVal) {
      setFieldError('regPhone', 'Mobile number is required.');
      isValid = false;
    } else if (!isValidIndianPhone(phoneVal)) {
      setFieldError('regPhone', 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      isValid = false;
    } else {
      clearFieldError('regPhone');
    }

    // 4. Selected Event
    const eventSelect = document.getElementById('regEventSelect');
    const eventVal = eventSelect ? eventSelect.value : '';
    if (!eventVal) {
      setFieldError('regEventSelect', 'Please select an event to attend.');
      isValid = false;
    } else {
      clearFieldError('regEventSelect');
    }

    // 5. Terms Checkbox
    const termsCheck = document.getElementById('regTerms');
    if (!termsCheck || !termsCheck.checked) {
      setFieldError('regTerms', 'You must agree to the Terms & Conditions.');
      isValid = false;
    } else {
      clearFieldError('regTerms');
    }

    return isValid;
  }

  // Check Duplicate Registration: same email + same event ID
  function isDuplicateRegistration(email, eventId) {
    const normalizedEmail = email.trim().toLowerCase();
    return registrations.some(reg => 
      reg.email.toLowerCase() === normalizedEmail && reg.eventId === eventId
    );
  }

  // Handle Form Submission
  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateRegistrationForm()) {
      // Shake form slightly
      const formEl = document.getElementById('eventRegistrationForm');
      if (formEl) {
        formEl.classList.remove('form-shake');
        void formEl.offsetWidth; // trigger reflow
        formEl.classList.add('form-shake');
      }
      return;
    }

    const nameInput = document.getElementById('regFullName');
    const emailInput = document.getElementById('regEmail');
    const phoneInput = document.getElementById('regPhone');
    const eventSelect = document.getElementById('regEventSelect');
    const ticketTypeSelect = document.getElementById('regTicketType');
    const ticketsCountSelect = document.getElementById('regTicketsCount');
    const notesInput = document.getElementById('regNotes');

    const email = emailInput.value.trim();
    const eventId = eventSelect.value;
    const eventObj = (typeof sampleEvents !== 'undefined') 
      ? sampleEvents.find(ev => ev.id === eventId) 
      : null;

    // Duplicate Check
    if (isDuplicateRegistration(email, eventId)) {
      const eventTitle = eventObj ? eventObj.title : 'this event';
      if (window.EventSphere && window.EventSphere.showToast) {
        window.EventSphere.showToast(
          `Already Registered! The email "${email}" is already registered for "${eventTitle}".`,
          'warning',
          5000
        );
      }
      setFieldError('regEmail', 'This email is already registered for this event.');
      return;
    }

    // Generate Registration Record
    const regId = generateRegistrationId(eventObj ? eventObj.category : 'GEN');
    const registrationRecord = {
      id: regId,
      fullName: nameInput.value.trim(),
      email: email,
      phone: phoneInput.value.trim(),
      eventId: eventId,
      eventTitle: eventObj ? eventObj.title : 'Featured Event',
      eventCategory: eventObj ? eventObj.category : 'General',
      eventDate: eventObj ? eventObj.dateDisplay : 'To be announced',
      eventVenue: eventObj ? `${eventObj.venue}, ${eventObj.city}` : 'Venue details sent via email',
      eventPrice: eventObj ? eventObj.price : 'Free',
      ticketType: ticketTypeSelect ? ticketTypeSelect.value : 'General Admission',
      ticketsCount: ticketsCountSelect ? parseInt(ticketsCountSelect.value, 10) || 1 : 1,
      notes: notesInput ? notesInput.value.trim() : '',
      registeredAt: new Date().toISOString()
    };

    // Save record
    registrations.unshift(registrationRecord);
    saveRegistrations();

    // Reset Form
    const form = document.getElementById('eventRegistrationForm');
    if (form) form.reset();
    resetAllFormErrors();

    // Show Success Modal with Digital Ticket Pass
    showConfirmationModal(registrationRecord);

    // Show Toast
    if (window.EventSphere && window.EventSphere.showToast) {
      window.EventSphere.showToast('Registration successful! Your digital ticket is ready.', 'success', 4000);
    }
  }

  // Display Confirmation Modal with Digital Pass
  function showConfirmationModal(record) {
    const modal = document.getElementById('registrationSuccessModal');
    if (!modal) return;

    // Fill details
    const regIdEl = document.getElementById('confRegId');
    const nameEl = document.getElementById('confName');
    const emailEl = document.getElementById('confEmail');
    const phoneEl = document.getElementById('confPhone');
    const eventEl = document.getElementById('confEvent');
    const dateEl = document.getElementById('confDate');
    const venueEl = document.getElementById('confVenue');
    const ticketTypeEl = document.getElementById('confTicketType');
    const countEl = document.getElementById('confTicketCount');

    if (regIdEl) regIdEl.textContent = record.id;
    if (nameEl) nameEl.textContent = record.fullName;
    if (emailEl) emailEl.textContent = record.email;
    if (phoneEl) phoneEl.textContent = record.phone;
    if (eventEl) eventEl.textContent = record.eventTitle;
    if (dateEl) dateEl.textContent = record.eventDate;
    if (venueEl) venueEl.textContent = record.eventVenue;
    if (ticketTypeEl) ticketTypeEl.textContent = record.ticketType;
    if (countEl) countEl.textContent = `${record.ticketsCount} Ticket(s)`;

    // Open modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  // Setup Real-time input listeners
  function setupInputValidationListeners() {
    const nameInput = document.getElementById('regFullName');
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        if (!nameInput.value.trim()) {
          setFieldError('regFullName', 'Full Name is required.');
        } else if (nameInput.value.trim().length < 3) {
          setFieldError('regFullName', 'Name must be at least 3 characters.');
        } else {
          clearFieldError('regFullName');
        }
      });
      nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('is-invalid') && nameInput.value.trim().length >= 3) {
          clearFieldError('regFullName');
        }
      });
    }

    const emailInput = document.getElementById('regEmail');
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        if (!emailInput.value.trim()) {
          setFieldError('regEmail', 'Email is required.');
        } else if (!isValidEmail(emailInput.value.trim())) {
          setFieldError('regEmail', 'Please enter a valid email format.');
        } else {
          clearFieldError('regEmail');
        }
      });
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('is-invalid') && isValidEmail(emailInput.value.trim())) {
          clearFieldError('regEmail');
        }
      });
    }

    const phoneInput = document.getElementById('regPhone');
    if (phoneInput) {
      phoneInput.addEventListener('blur', () => {
        if (!phoneInput.value.trim()) {
          setFieldError('regPhone', 'Mobile number is required.');
        } else if (!isValidIndianPhone(phoneInput.value.trim())) {
          setFieldError('regPhone', 'Enter a valid 10-digit Indian mobile number.');
        } else {
          clearFieldError('regPhone');
        }
      });
      phoneInput.addEventListener('input', () => {
        if (phoneInput.classList.contains('is-invalid') && isValidIndianPhone(phoneInput.value.trim())) {
          clearFieldError('regPhone');
        }
      });
    }

    const eventSelect = document.getElementById('regEventSelect');
    if (eventSelect) {
      eventSelect.addEventListener('change', () => {
        if (eventSelect.value) {
          clearFieldError('regEventSelect');
        }
      });
    }

    const termsCheck = document.getElementById('regTerms');
    if (termsCheck) {
      termsCheck.addEventListener('change', () => {
        if (termsCheck.checked) {
          clearFieldError('regTerms');
        }
      });
    }
  }

  // Pre-select an event and scroll smoothly to the registration form
  function selectEventForRegistration(eventId) {
    populateEventDropdown(eventId);
    const regSection = document.getElementById('register');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus on the name input
      setTimeout(() => {
        const nameInput = document.getElementById('regFullName');
        if (nameInput) nameInput.focus();
      }, 600);
    }
  }

  // Render "My Tickets" Modal List
  function renderMyTicketsModal() {
    const container = document.getElementById('myTicketsContainer');
    if (!container) return;

    if (registrations.length === 0) {
      container.innerHTML = `
        <div class="empty-tickets-state">
          <div class="empty-icon"><i class="fa-solid fa-ticket-simple"></i></div>
          <h3>No Registrations Found</h3>
          <p>You haven't registered for any events yet. Explore our curated events and secure your spot today!</p>
          <a href="#events" class="btn btn-primary close-modal-action">
            <i class="fa-solid fa-compass"></i> Explore Events
          </a>
        </div>
      `;
      return;
    }

    let html = '<div class="tickets-grid">';
    registrations.forEach(ticket => {
      html += `
        <div class="ticket-card-item" data-ticket-id="${ticket.id}">
          <div class="ticket-stub-left">
            <span class="ticket-badge">${ticket.eventCategory}</span>
            <h4 class="ticket-title">${ticket.eventTitle}</h4>
            <div class="ticket-meta">
              <div><i class="fa-regular fa-calendar"></i> ${ticket.eventDate}</div>
              <div><i class="fa-solid fa-location-dot"></i> ${ticket.eventVenue}</div>
              <div><i class="fa-regular fa-user"></i> ${ticket.fullName} &bull; ${ticket.ticketType} (${ticket.ticketsCount} pass)</div>
            </div>
            <div class="ticket-code">Ticket ID: <strong>${ticket.id}</strong></div>
          </div>
          <div class="ticket-stub-right">
            <div class="ticket-qr-box">
              <i class="fa-solid fa-qrcode"></i>
              <span>VERIFIED PASS</span>
            </div>
            <div class="ticket-actions">
              <button class="btn-ticket-print" onclick="window.EventSphereReg.printTicket('${ticket.id}')" title="Print Pass">
                <i class="fa-solid fa-print"></i> Print
              </button>
              <button class="btn-ticket-cancel" onclick="window.EventSphereReg.cancelRegistration('${ticket.id}')" title="Cancel Booking">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // Cancel / Delete a registration
  function cancelRegistration(ticketId) {
    if (!confirm('Are you sure you want to cancel this event registration?')) {
      return;
    }
    registrations = registrations.filter(r => r.id !== ticketId);
    saveRegistrations();
    renderMyTicketsModal();
    if (window.EventSphere && window.EventSphere.showToast) {
      window.EventSphere.showToast('Registration cancelled successfully.', 'info', 3000);
    }
  }

  // Print single ticket
  function printTicket(ticketId) {
    const ticket = registrations.find(r => r.id === ticketId);
    if (!ticket) return;

    const printWindow = window.open('', '_blank', 'width=700,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket Pass - ${ticket.eventTitle}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
          .pass-box { border: 2px dashed #6366f1; border-radius: 16px; padding: 30px; background: #fff; max-width: 550px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
          .brand { font-size: 24px; font-weight: 800; color: #4f46e5; margin-bottom: 8px; }
          .tag { display: inline-block; padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
          h2 { margin: 8px 0 16px; color: #0f172a; font-size: 20px; }
          .info-row { margin: 8px 0; font-size: 14px; }
          .id-box { margin-top: 20px; padding: 12px; background: #f1f5f9; border-radius: 8px; font-family: monospace; font-size: 16px; font-weight: bold; text-align: center; }
          .footer-note { font-size: 12px; color: #64748b; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="pass-box">
          <div class="brand">EventSphere • OFFICIAL ADMISSION PASS</div>
          <span class="tag">${ticket.eventCategory}</span>
          <h2>${ticket.eventTitle}</h2>
          <div class="info-row"><strong>Attendee:</strong> ${ticket.fullName}</div>
          <div class="info-row"><strong>Email:</strong> ${ticket.email}</div>
          <div class="info-row"><strong>Phone:</strong> ${ticket.phone}</div>
          <div class="info-row"><strong>Date & Time:</strong> ${ticket.eventDate}</div>
          <div class="info-row"><strong>Venue:</strong> ${ticket.eventVenue}</div>
          <div class="info-row"><strong>Tier:</strong> ${ticket.ticketType} (${ticket.ticketsCount} Ticket)</div>
          <div class="id-box">TICKET ID: ${ticket.id}</div>
          <p class="footer-note">Please present this pass along with a valid photo ID at the registration desk.</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadRegistrations();
    populateEventDropdown();
    setupInputValidationListeners();

    const form = document.getElementById('eventRegistrationForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-confirmation-modal');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('registrationSuccessModal');
        if (modal) modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      });
    });

    // "My Tickets" button click
    const myTicketsBtns = document.querySelectorAll('.btn-my-tickets');
    myTicketsBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        renderMyTicketsModal();
        const ticketsModal = document.getElementById('myTicketsModal');
        if (ticketsModal) {
          ticketsModal.classList.add('active');
          document.body.classList.add('modal-open');
        }
      });
    });

    // Close My Tickets Modal
    const closeTicketsModalBtns = document.querySelectorAll('.close-tickets-modal');
    closeTicketsModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('myTicketsModal');
        if (modal) modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      });
    });

    // Print confirmation pass button
    const printConfBtn = document.getElementById('confPrintBtn');
    if (printConfBtn) {
      printConfBtn.addEventListener('click', () => {
        const regIdEl = document.getElementById('confRegId');
        if (regIdEl && regIdEl.textContent) {
          printTicket(regIdEl.textContent);
        }
      });
    }
  });

  // Public Interface
  window.EventSphereReg = {
    loadRegistrations,
    getRegistrations: () => registrations,
    selectEventForRegistration,
    populateEventDropdown,
    renderMyTicketsModal,
    cancelRegistration,
    printTicket
  };
})();
