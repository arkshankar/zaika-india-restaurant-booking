// L'Aura Bistro & Lounge - Application Engine
(function () {
  'use strict';

  const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
  const WEB3FORMS_ACCESS_KEY = '1a910617-8533-438d-8e87-ee6885ac20e0';

  // State Management
  const state = {
    currentStep: 1,
    booking: {
      date: getTomorrowDateString(),
      mealType: 'dinner',
      timeSlot: '07:30 PM',
      partySize: 2,
      zone: 'all',
      selectedTable: null,
      preorders: {}, // { itemId: quantity }
      guest: {
        name: '',
        email: '',
        phone: '',
        occasion: 'casual',
        specialRequests: '',
        dietaryRestrictions: '',
        notifications: true
      }
    },
    menuFilter: 'all',
    menuSearch: '',
    reservations: [],
    isHostMode: false,
    isSubmitting: false,
    activeConfirmedBooking: null
  };

  // Helper: Tomorrow's date string YYYY-MM-DD
  function getTomorrowDateString() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  // Helper: Format Date for Display
  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  }

  // Load and save reservations to localStorage
  function loadReservations() {
    try {
      const stored = localStorage.getItem('shamiana_reservations_inr');
      if (stored) {
        state.reservations = JSON.parse(stored);
      } else {
        // Initial sample reservations (in INR)
        state.reservations = [
          {
            id: 'RES-8921',
            createdAt: new Date().toISOString(),
            date: state.booking.date,
            timeSlot: '07:00 PM',
            mealType: 'dinner',
            partySize: 4,
            table: RESTAURANT_DATA.tables.find(t => t.id === 'T-03'),
            guest: {
              name: 'Vikramaditya Singhania',
              email: 'vikram.singhania@corp.in',
              phone: '+91 98201 44812',
              occasion: 'anniversary',
              specialRequests: 'Chilled bottle of Champagne on table upon arrival.'
            },
            preorders: { 'sh-05': 2, 'sh-19': 2 },
            totalEstimate: 7900,
            status: 'Confirmed'
          },
          {
            id: 'RES-4183',
            createdAt: new Date().toISOString(),
            date: state.booking.date,
            timeSlot: '08:00 PM',
            mealType: 'dinner',
            partySize: 6,
            table: RESTAURANT_DATA.tables.find(t => t.id === 'T-08'),
            guest: {
              name: 'Dr. Ananya Deshmukh',
              email: 'ananya.deshmukh@aiims.edu',
              phone: '+91 98711 02931',
              occasion: 'birthday',
              specialRequests: 'Quiet celebration table for our medical faculty.'
            },
            preorders: { 'sh-07': 3, 'sh-15': 3, 'sh-24': 3 },
            totalEstimate: 13500,
            status: 'Confirmed'
          }
        ];
        saveReservations();
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function saveReservations() {
    try {
      localStorage.setItem('shamiana_reservations_inr', JSON.stringify(state.reservations));
    } catch (e) {
      console.error(e);
    }
  }

  // Toast Notification System
  function showToast(message, type = 'gold') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' :
                    type === 'error' ? 'bg-rose-900/90 border-rose-500 text-rose-100' :
                    'bg-amber-950/90 border-amber-500 text-amber-100';

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 text-sm font-medium ${bgClass}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'sparkles'}" class="w-5 h-5 flex-shrink-0"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Initialize UI Elements
  function init() {
    loadReservations();
    setupEventListeners();
    renderPartySizeButtons();
    renderTimeSlots();
    renderZoneFilterTabs();
    renderFloorPlan();
    renderOccasionGrid();
    renderMenu();
    updateLiveSummary();
    renderHostDashboard();
    initDateInput();
    if (window.lucide) lucide.createIcons();
  }

  // Date input initialization
  function initDateInput() {
    const dateInput = document.getElementById('bookingDateInput');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = state.booking.date;
      dateInput.addEventListener('change', (e) => {
        state.booking.date = e.target.value;
        updateLiveSummary();
        renderFloorPlan(); // Availability might change
      });
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Navigation to booking
    document.querySelectorAll('.btn-reserve-anchor').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const section = document.getElementById('reservationWizardSection');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Meal Type Toggle (Lunch / Dinner)
    const lunchBtn = document.getElementById('mealLunchBtn');
    const dinnerBtn = document.getElementById('mealDinnerBtn');
    if (lunchBtn && dinnerBtn) {
      lunchBtn.addEventListener('click', () => {
        state.booking.mealType = 'lunch';
        lunchBtn.classList.add('bg-amber-500', 'text-stone-950', 'font-semibold');
        lunchBtn.classList.remove('text-stone-300', 'hover:bg-stone-800');
        dinnerBtn.classList.remove('bg-amber-500', 'text-stone-950', 'font-semibold');
        dinnerBtn.classList.add('text-stone-300', 'hover:bg-stone-800');
        state.booking.timeSlot = RESTAURANT_DATA.timeSlots.lunch[0];
        renderTimeSlots();
        updateLiveSummary();
      });

      dinnerBtn.addEventListener('click', () => {
        state.booking.mealType = 'dinner';
        dinnerBtn.classList.add('bg-amber-500', 'text-stone-950', 'font-semibold');
        dinnerBtn.classList.remove('text-stone-300', 'hover:bg-stone-800');
        lunchBtn.classList.remove('bg-amber-500', 'text-stone-950', 'font-semibold');
        lunchBtn.classList.add('text-stone-300', 'hover:bg-stone-800');
        state.booking.timeSlot = RESTAURANT_DATA.timeSlots.dinner[3] || RESTAURANT_DATA.timeSlots.dinner[0];
        renderTimeSlots();
        updateLiveSummary();
      });
    }

    // Step Wizard Navigation Buttons
    const btnNextStep = document.getElementById('btnNextStep');
    const btnPrevStep = document.getElementById('btnPrevStep');

    if (btnNextStep) {
      btnNextStep.addEventListener('click', () => {
        handleNextStep();
      });
    }

    if (btnPrevStep) {
      btnPrevStep.addEventListener('click', () => {
        if (state.currentStep > 1) {
          goToStep(state.currentStep - 1);
        }
      });
    }

    // Step indicators clickable
    document.querySelectorAll('.wizard-step-indicator').forEach(stepEl => {
      stepEl.addEventListener('click', () => {
        const targetStep = parseInt(stepEl.getAttribute('data-step'), 10);
        if (targetStep < state.currentStep) {
          goToStep(targetStep);
        } else if (targetStep === state.currentStep + 1 && canProceedToStep(targetStep)) {
          goToStep(targetStep);
        }
      });
    });

    // Menu category filter buttons in step 3 and public menu
    setupMenuFilterButtons();

    // Guest Details Form Inputs
    const formFields = ['guestFullName', 'guestEmail', 'guestPhone', 'guestSpecialRequests', 'guestDietaryRestrictions'];
    formFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const map = {
            guestFullName: 'name',
            guestEmail: 'email',
            guestPhone: 'phone',
            guestSpecialRequests: 'specialRequests',
            guestDietaryRestrictions: 'dietaryRestrictions'
          };
          state.booking.guest[map[id]] = e.target.value.trim();
          updateLiveSummary();
        });
      }
    });

    // Lookup Reservation Modal Trigger
    const lookupBtn = document.getElementById('btnOpenLookupModal');
    const lookupModal = document.getElementById('lookupReservationModal');
    const closeLookupBtn = document.getElementById('btnCloseLookupModal');

    if (lookupBtn && lookupModal) {
      lookupBtn.addEventListener('click', () => {
        lookupModal.classList.remove('hidden');
        renderMyReservations();
      });
    }
    if (closeLookupBtn && lookupModal) {
      closeLookupBtn.addEventListener('click', () => {
        lookupModal.classList.add('hidden');
      });
    }

    // Lookup Search Form
    const lookupSearchInput = document.getElementById('lookupSearchInput');
    if (lookupSearchInput) {
      lookupSearchInput.addEventListener('input', (e) => {
        renderMyReservations(e.target.value.trim().toLowerCase());
      });
    }

    // Host Dashboard Toggle
    const hostToggleBtn = document.getElementById('btnToggleHostMode');
    if (hostToggleBtn) {
      hostToggleBtn.addEventListener('click', () => {
        state.isHostMode = !state.isHostMode;
        const hostPanel = document.getElementById('hostDashboardModal');
        if (state.isHostMode) {
          hostPanel.classList.remove('hidden');
          renderHostDashboard();
          showToast('Staff & Host Command View activated', 'gold');
        } else {
          hostPanel.classList.add('hidden');
        }
      });
    }

    const closeHostBtn = document.getElementById('btnCloseHostModal');
    if (closeHostBtn) {
      closeHostBtn.addEventListener('click', () => {
        state.isHostMode = false;
        document.getElementById('hostDashboardModal').classList.add('hidden');
      });
    }

    // Modal Close - Booking Confirmation
    const closeConfirmBtn = document.getElementById('btnCloseConfirmModal');
    const confirmModal = document.getElementById('bookingConfirmationModal');
    if (closeConfirmBtn && confirmModal) {
      closeConfirmBtn.addEventListener('click', () => {
        confirmModal.classList.add('hidden');
      });
    }

    // Print Pass Button
    const printBtn = document.getElementById('btnPrintBookingPass');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Reset Booking Button
    const resetBtn = document.getElementById('btnResetBooking');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetBookingForm();
      });
    }

    // Digital Restaurant Menu QR Modal Handlers
    const openQrBtn = document.getElementById('btnOpenQrModal');
    const qrModal = document.getElementById('tableQrCodeModal');
    const closeQrBtn = document.getElementById('btnCloseQrModal');

    if (openQrBtn && qrModal) {
      openQrBtn.addEventListener('click', () => {
        updateModalQrCode();
        qrModal.classList.remove('hidden');
      });
    }

    if (closeQrBtn && qrModal) {
      closeQrBtn.addEventListener('click', () => {
        qrModal.classList.add('hidden');
      });
    }

    // Close modal when clicking backdrop
    if (qrModal) {
      qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) qrModal.classList.add('hidden');
      });
    }

  }

  // The QR code always points to the public GitHub Pages menu.
  function getScannableMenuUrl() {
    return 'https://arkshankar.github.io/zaika-india-restaurant-booking/menu';
  }

  function renderQrCode(container) {
    if (!container) return;

    container.innerHTML = '<img src="menu-qr.png" alt="QR code for Zaika India menu" class="w-full h-full rounded-md">';
  }

  function updateModalQrCode() {
    const directLink = document.getElementById('btnDirectOpenQrMenu');
    const qrContainer = document.getElementById('modalQrCodeContainer');
    const targetUrl = getScannableMenuUrl();

    if (directLink) directLink.href = targetUrl;
    renderQrCode(qrContainer);
  }

  // Wizard Logic & Step Transitions
  function canProceedToStep(nextStep) {
    if (nextStep === 2) {
      if (!state.booking.date) {
        showToast('Please select a reservation date', 'error');
        return false;
      }
      if (!state.booking.timeSlot) {
        showToast('Please select an available time slot', 'error');
        return false;
      }
      return true;
    }
    if (nextStep === 3) {
      if (!state.booking.selectedTable) {
        showToast('Please click on a table on the floor plan to select your seat', 'error');
        return false;
      }
      // Check capacity
      if (state.booking.partySize > state.booking.selectedTable.capacity) {
        showToast(`Table capacity (${state.booking.selectedTable.capacity} guests) is less than your party size (${state.booking.partySize}). Please select a larger table.`, 'error');
        return false;
      }
      return true;
    }
    if (nextStep === 4) {
      return true; // Pre-orders are optional
    }
    return true;
  }

  function handleNextStep() {
    if (state.currentStep === 4) {
      // Finalize and submit reservation
      submitReservation();
      return;
    }

    const nextStep = state.currentStep + 1;
    if (canProceedToStep(nextStep)) {
      goToStep(nextStep);
    }
  }

  function goToStep(stepNumber) {
    state.currentStep = stepNumber;

    // Update Step Indicator UI
    document.querySelectorAll('.wizard-step-indicator').forEach(indicator => {
      const step = parseInt(indicator.getAttribute('data-step'), 10);
      const circle = indicator.querySelector('.step-circle');
      const label = indicator.querySelector('.step-label');

      if (step === stepNumber) {
        indicator.classList.add('step-active');
        indicator.classList.remove('step-completed');
        circle.className = 'step-circle w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-amber-500 text-stone-950 ring-4 ring-amber-500/30';
        label.classList.add('text-amber-400', 'font-semibold');
        label.classList.remove('text-stone-400');
      } else if (step < stepNumber) {
        indicator.classList.remove('step-active');
        indicator.classList.add('step-completed');
        circle.className = 'step-circle w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-500 text-white';
        circle.innerHTML = '✓';
        label.classList.remove('text-amber-400');
        label.classList.add('text-stone-300');
      } else {
        indicator.classList.remove('step-active', 'step-completed');
        circle.className = 'step-circle w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-stone-800 text-stone-400 border border-stone-700';
        circle.innerHTML = `${step}`;
        label.classList.remove('text-amber-400', 'font-semibold');
        label.classList.add('text-stone-400');
      }
    });

    // Toggle Step Panels
    for (let i = 1; i <= 4; i++) {
      const panel = document.getElementById(`wizardStep${i}`);
      if (panel) {
        if (i === stepNumber) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    }

    // Button states
    const btnPrev = document.getElementById('btnPrevStep');
    const btnNext = document.getElementById('btnNextStep');

    if (btnPrev) {
      if (stepNumber === 1) {
        btnPrev.classList.add('invisible');
      } else {
        btnPrev.classList.remove('invisible');
      }
    }

    if (btnNext) {
      if (stepNumber === 4) {
        btnNext.innerHTML = `<span>Confirm Reservation</span> <i data-lucide="check" class="w-4 h-4"></i>`;
        btnNext.className = 'px-6 py-3 rounded-xl gold-gradient-btn flex items-center gap-2 shadow-xl';
      } else if (stepNumber === 3) {
        btnNext.innerHTML = `<span>Proceed to Details</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        btnNext.className = 'px-6 py-3 rounded-xl gold-gradient-btn flex items-center gap-2';
      } else {
        btnNext.innerHTML = `<span>Continue</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        btnNext.className = 'px-6 py-3 rounded-xl gold-gradient-btn flex items-center gap-2';
      }
    }

    updateLiveSummary();
    if (window.lucide) lucide.createIcons();

    // Smooth scroll inside booking card on small screens
    const wizardCard = document.getElementById('reservationWizardContainer');
    if (wizardCard && window.innerWidth < 768) {
      wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Render Party Size Options
  function renderPartySizeButtons() {
    const container = document.getElementById('partySizeButtonsContainer');
    if (!container) return;

    const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
    container.innerHTML = sizes.map(size => {
      const isSelected = state.booking.partySize === size;
      const activeClass = isSelected
        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
        : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border-stone-800';

      return `
        <button type="button" data-size="${size}" class="party-size-btn flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${activeClass}">
          <span class="text-lg font-bold">${size}</span>
          <span class="text-[10px] uppercase tracking-wider text-stone-400">${size === 1 ? 'Guest' : 'Guests'}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.party-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.booking.partySize = parseInt(btn.getAttribute('data-size'), 10);
        renderPartySizeButtons();
        updateLiveSummary();
        renderFloorPlan(); // Adjust visual table recommendations
      });
    });
  }

  // Render Time Slots
  function renderTimeSlots() {
    const container = document.getElementById('timeSlotsContainer');
    if (!container) return;

    const slots = RESTAURANT_DATA.timeSlots[state.booking.mealType] || [];
    container.innerHTML = slots.map(time => {
      const isSelected = state.booking.timeSlot === time;
      const isPopular = time === '07:30 PM' || time === '08:00 PM' || time === '01:00 PM';
      const activeClass = isSelected
        ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-500/30'
        : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border-stone-800/80';

      return `
        <button type="button" data-time="${time}" class="time-slot-btn relative px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center ${activeClass}">
          ${time}
          ${isPopular ? '<span class="absolute -top-2 -right-1 text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full shadow">Hot</span>' : ''}
        </button>
      `;
    }).join('');

    container.querySelectorAll('.time-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.booking.timeSlot = btn.getAttribute('data-time');
        renderTimeSlots();
        updateLiveSummary();
      });
    });
  }

  // Render Occasion Grid
  function renderOccasionGrid() {
    const container = document.getElementById('occasionGridContainer');
    if (!container) return;

    container.innerHTML = RESTAURANT_DATA.occasions.map(occ => {
      const isSelected = state.booking.guest.occasion === occ.id;
      const activeClass = isSelected
        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold ring-1 ring-amber-500/50'
        : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800/80';

      return `
        <button type="button" data-occ="${occ.id}" class="occasion-btn flex items-center gap-3 p-3 rounded-xl border text-sm transition-all text-left ${activeClass}">
          <div class="w-8 h-8 rounded-lg ${isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'} flex items-center justify-center flex-shrink-0">
            <i data-lucide="${occ.icon}" class="w-4 h-4"></i>
          </div>
          <span>${occ.label}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.occasion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.booking.guest.occasion = btn.getAttribute('data-occ');
        renderOccasionGrid();
        updateLiveSummary();
      });
    });
    if (window.lucide) lucide.createIcons();
  }

  // Render Zone Filter Tabs in Floor Plan Step
  function renderZoneFilterTabs() {
    const container = document.getElementById('floorPlanZoneFilters');
    if (!container) return;

    container.innerHTML = RESTAURANT_DATA.zones.map(z => {
      const isSelected = state.booking.zone === z.id;
      const activeClass = isSelected
        ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
        : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800';

      return `
        <button type="button" data-zone="${z.id}" class="zone-tab-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${activeClass}">
          <i data-lucide="${z.icon}" class="w-3.5 h-3.5"></i>
          <span>${z.name}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.zone-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.booking.zone = btn.getAttribute('data-zone');
        renderZoneFilterTabs();
        renderFloorPlan();
      });
    });
    if (window.lucide) lucide.createIcons();
  }

  // Render Floor Plan & Table Nodes
  function renderFloorPlan() {
    const canvas = document.getElementById('floorPlanCanvas');
    if (!canvas) return;

    // Filter tables based on active zone
    const filteredTables = RESTAURANT_DATA.tables.filter(t => {
      if (state.booking.zone !== 'all' && t.zone !== state.booking.zone) {
        return false;
      }
      return true;
    });

    canvas.innerHTML = `
      <!-- Zone Background Labels -->
      <div class="zone-marker top-3 left-4">Window Alcove</div>
      <div class="zone-marker top-3 left-[36%]">Grand Dining Hall</div>
      <div class="zone-marker top-3 left-[62%]">Private Booths</div>
      <div class="zone-marker top-3 right-4">Garden Patio & VIP</div>
      <div class="zone-marker bottom-3 left-4 text-emerald-400/80">Glass Windows overlooking Waterfront</div>
      <div class="zone-marker bottom-3 right-4 text-amber-400/80">Kitchen & Sommelier Bar Pass</div>
    `;

    filteredTables.forEach(table => {
      const isSelected = state.booking.selectedTable && state.booking.selectedTable.id === table.id;
      const isReserved = table.status === 'reserved';
      const isOccupied = table.status === 'occupied';
      const fitsParty = table.capacity >= state.booking.partySize;

      let statusClass = 'status-available';
      if (isReserved) statusClass = 'status-reserved';
      else if (isOccupied) statusClass = 'status-occupied';
      else if (isSelected) statusClass = 'status-selected';

      // Shape class
      const shapeClass = `table-shape-${table.shape}`;

      const tableNode = document.createElement('div');
      tableNode.className = `table-node ${statusClass}`;
      tableNode.style.left = `${table.x}%`;
      tableNode.style.top = `${table.y}%`;
      tableNode.setAttribute('data-table-id', table.id);

      tableNode.innerHTML = `
        <div class="table-surface ${shapeClass}">
          <span class="leading-tight">${table.name}</span>
          <span class="text-[10px] opacity-80">${table.capacity}p</span>
        </div>
        ${!fitsParty && !isReserved && !isOccupied ? `
          <span class="absolute -top-3 text-[9px] bg-amber-500/90 text-stone-950 font-bold px-1 rounded-sm">Cap ${table.capacity}</span>
        ` : ''}
      `;

      if (!isReserved && !isOccupied) {
        tableNode.addEventListener('click', () => {
          selectTable(table);
        });
      }

      canvas.appendChild(tableNode);
    });

    renderSelectedTableDetail();
  }

  function selectTable(table) {
    if (table.capacity < state.booking.partySize) {
      showToast(`Notice: Table ${table.name} accommodates up to ${table.capacity} guests (your party is ${state.booking.partySize}). Consider a larger table.`, 'error');
    }
    state.booking.selectedTable = table;
    renderFloorPlan();
    updateLiveSummary();
    showToast(`Selected ${table.name} (${table.features[0]})`, 'success');
  }

  function renderSelectedTableDetail() {
    const detailBox = document.getElementById('selectedTableDetailCard');
    if (!detailBox) return;

    const table = state.booking.selectedTable;
    if (!table) {
      detailBox.innerHTML = `
        <div class="p-4 rounded-xl bg-stone-900/70 border border-stone-800 text-stone-400 text-sm flex items-center gap-3">
          <i data-lucide="info" class="w-5 h-5 text-amber-400 flex-shrink-0"></i>
          <span>Click any available green table on the visual map to select your dining spot.</span>
        </div>
      `;
    } else {
      detailBox.innerHTML = `
        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-bold text-lg">${table.name}</span>
              <span class="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 font-medium uppercase">${table.zone} area</span>
              <span class="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300 font-medium">Up to ${table.capacity} Guests</span>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              ${table.features.map(f => `<span class="text-xs text-stone-300 bg-stone-800/80 px-2 py-0.5 rounded-full border border-stone-700/60">• ${f}</span>`).join('')}
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <i data-lucide="check-circle" class="w-4 h-4"></i> Ready for Reservation
            </span>
          </div>
        </div>
      `;
    }
    if (window.lucide) lucide.createIcons();
  }

  // Pre-ordering Menu Rendering & Handlers
  function setupMenuFilterButtons() {
    document.querySelectorAll('.menu-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.menu-category-btn').forEach(b => {
          b.classList.remove('bg-amber-500', 'text-stone-950', 'font-semibold');
          b.classList.add('bg-stone-900', 'text-stone-300');
        });
        btn.classList.add('bg-amber-500', 'text-stone-950', 'font-semibold');
        btn.classList.remove('bg-stone-900', 'text-stone-300');

        state.menuFilter = btn.getAttribute('data-category');
        renderMenu();
      });
    });

    const searchInput = document.getElementById('menuSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.menuSearch = e.target.value.toLowerCase().trim();
        renderMenu();
      });
    }
  }

  function renderMenu() {
    // Render in Step 3 Preorder Container
    const preorderContainer = document.getElementById('preorderMenuGrid');
    // Also render in Public Menu Section
    const publicMenuContainer = document.getElementById('publicMenuGrid');

    const filtered = RESTAURANT_DATA.menuItems.filter(item => {
      const matchesCategory = state.menuFilter === 'all' || item.category === state.menuFilter;
      const matchesSearch = !state.menuSearch || 
        item.name.toLowerCase().includes(state.menuSearch) ||
        item.description.toLowerCase().includes(state.menuSearch);
      return matchesCategory && matchesSearch;
    });

    if (preorderContainer) {
      preorderContainer.innerHTML = filtered.map(item => {
        const qty = state.booking.preorders[item.id] || 0;
        return `
          <div class="flex gap-4 p-3 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-all">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" loading="lazy" />
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-1">
                  <div class="flex items-center gap-1.5 truncate">
                    ${item.isVeg ? `
                      <span class="w-3.5 h-3.5 border-2 border-emerald-500 flex items-center justify-center p-0.5 rounded-sm flex-shrink-0" title="Veg">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </span>
                    ` : `
                      <span class="w-3.5 h-3.5 border-2 border-rose-500 flex items-center justify-center p-0.5 rounded-sm flex-shrink-0" title="Non-Veg">
                        <span class="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500"></span>
                      </span>
                    `}
                    <h4 class="font-bold text-sm text-stone-100 truncate">${item.name}</h4>
                  </div>
                  <span class="text-amber-400 font-bold text-sm">₹${item.price}</span>
                </div>
                <p class="text-stone-400 text-xs line-clamp-2 mt-0.5">${item.description}</p>
                <div class="flex flex-wrap gap-1.5 mt-1.5">
                  ${item.portion ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">⚖️ ${item.portion}</span>` : ''}
                  ${item.calories ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">⚡ ${item.calories}</span>` : ''}
                  ${item.dietary.map(d => `<span class="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-300/80">${d}</span>`).join('')}
                </div>
              </div>
              <div class="flex items-center justify-end gap-2 mt-2">
                ${qty > 0 ? `
                  <button type="button" class="btn-preorder-dec w-7 h-7 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 flex items-center justify-center font-bold text-sm" data-id="${item.id}">-</button>
                  <span class="font-bold text-amber-400 text-sm px-1">${qty}</span>
                ` : ''}
                <button type="button" class="btn-preorder-inc ${qty > 0 ? 'w-7 h-7' : 'px-3 py-1'} rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 flex items-center justify-center font-bold text-xs" data-id="${item.id}">
                  ${qty > 0 ? '+' : '+ Add to Table'}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      preorderContainer.querySelectorAll('.btn-preorder-inc').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          state.booking.preorders[id] = (state.booking.preorders[id] || 0) + 1;
          renderMenu();
          updateLiveSummary();
        });
      });

      preorderContainer.querySelectorAll('.btn-preorder-dec').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (state.booking.preorders[id] > 1) {
            state.booking.preorders[id]--;
          } else {
            delete state.booking.preorders[id];
          }
          renderMenu();
          updateLiveSummary();
        });
      });
    }

    if (publicMenuContainer) {
      publicMenuContainer.innerHTML = filtered.map(item => `
        <div class="glass-panel p-5 rounded-2xl border border-stone-800/80 hover:border-amber-500/40 transition-all duration-300 group flex flex-col justify-between">
          <div>
            <div class="relative overflow-hidden rounded-xl mb-4 aspect-video">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div class="absolute top-2 right-2 bg-stone-950/85 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30">
                ₹${item.price.toLocaleString()}
              </div>
              <div class="absolute bottom-2 left-2 flex items-center gap-1.5 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] text-stone-200">
                ${item.isVeg ? `
                  <span class="w-3.5 h-3.5 border-2 border-emerald-500 flex items-center justify-center p-0.5 rounded-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <span class="text-emerald-400 text-[10px] font-bold">Veg</span>
                ` : `
                  <span class="w-3.5 h-3.5 border-2 border-rose-500 flex items-center justify-center p-0.5 rounded-sm">
                    <span class="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500"></span>
                  </span>
                  <span class="text-rose-400 text-[10px] font-bold">Non-Veg</span>
                `}
              </div>
            </div>
            <div class="flex flex-wrap gap-1 mb-2">
              ${item.portion ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">⚖️ ${item.portion}</span>` : ''}
              ${item.calories ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">⚡ ${item.calories}</span>` : ''}
              ${item.dietary.map(d => `<span class="text-[10px] px-2 py-0.5 rounded-full bg-stone-800/80 text-stone-400">${d}</span>`).join('')}
            </div>
            <h3 class="font-serif text-lg font-bold text-stone-100 mb-1">${item.name}</h3>
            <p class="text-stone-400 text-xs leading-relaxed">${item.description}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
            <span class="text-[11px] text-stone-500 uppercase tracking-wider">${item.category}</span>
            <button type="button" class="btn-menu-order text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1" data-id="${item.id}">
              Pre-order with Table &rarr;
            </button>
          </div>
        </div>
      `).join('');

      publicMenuContainer.querySelectorAll('.btn-menu-order').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          state.booking.preorders[id] = (state.booking.preorders[id] || 0) + 1;
          showToast(`Added to your reservation pre-orders!`, 'success');
          updateLiveSummary();
          const wizardSection = document.getElementById('reservationWizardSection');
          if (wizardSection) wizardSection.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  }

  // Update Live Booking Summary Sidebar
  function updateLiveSummary() {
    // Date & Time
    const sumDate = document.getElementById('summaryDate');
    const sumTime = document.getElementById('summaryTime');
    const sumGuests = document.getElementById('summaryGuests');
    const sumTable = document.getElementById('summaryTable');
    const sumOccasion = document.getElementById('summaryOccasion');
    const sumPreordersContainer = document.getElementById('summaryPreordersContainer');
    const sumTotalEst = document.getElementById('summaryTotalEstimate');

    if (sumDate) sumDate.textContent = formatDateDisplay(state.booking.date);
    if (sumTime) sumTime.textContent = `${state.booking.timeSlot} (${state.booking.mealType.toUpperCase()})`;
    if (sumGuests) sumGuests.textContent = `${state.booking.partySize} ${state.booking.partySize === 1 ? 'Guest' : 'Guests'}`;

    if (sumTable) {
      if (state.booking.selectedTable) {
        sumTable.textContent = `${state.booking.selectedTable.name} (${state.booking.selectedTable.features[0]})`;
        sumTable.className = 'font-semibold text-amber-400';
      } else {
        sumTable.textContent = 'Not selected yet';
        sumTable.className = 'text-stone-500 italic';
      }
    }

    if (sumOccasion) {
      const occObj = RESTAURANT_DATA.occasions.find(o => o.id === state.booking.guest.occasion);
      sumOccasion.textContent = occObj ? occObj.label : 'Casual Dining';
    }

    // Preorder Items in Summary
    let totalPreorder = 0;
    const preorderKeys = Object.keys(state.booking.preorders);

    if (sumPreordersContainer) {
      if (preorderKeys.length === 0) {
        sumPreordersContainer.innerHTML = `<span class="text-xs text-stone-500 italic">No food pre-orders yet. Can be ordered on arrival.</span>`;
      } else {
        sumPreordersContainer.innerHTML = preorderKeys.map(id => {
          const item = RESTAURANT_DATA.menuItems.find(m => m.id === id);
          if (!item) return '';
          const qty = state.booking.preorders[id];
          const subtotal = item.price * qty;
          totalPreorder += subtotal;
          return `
            <div class="flex items-center justify-between text-xs py-1 border-b border-stone-800/60 last:border-none">
              <span class="text-stone-300 truncate max-w-[170px]">${item.name} <strong class="text-amber-400">×${qty}</strong></span>
              <span class="text-stone-300 font-medium">₹${subtotal.toLocaleString()}</span>
            </div>
          `;
        }).join('');
      }
    }

    if (sumTotalEst) {
      sumTotalEst.textContent = totalPreorder > 0 ? `₹${totalPreorder.toLocaleString()}` : 'Free Reservation';
    }
  }

  function sendBookingDetails(booking) {
    const preorderLines = Object.entries(booking.preorders).map(([id, qty]) => {
      const item = RESTAURANT_DATA.menuItems.find(menuItem => menuItem.id === id);
      return item ? `${item.name} x ${qty} = ₹${(item.price * qty).toLocaleString()}` : '';
    }).filter(Boolean);

    const formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', `New Zaika India booking - ${booking.id}`);
    formData.append('from_name', 'Zaika India Website');
    formData.append('name', booking.guest.name);
    formData.append('email', booking.guest.email || 'No email provided');
    formData.append('phone', booking.guest.phone);
    formData.append('message', [
      `Booking ID: ${booking.id}`,
      `Date: ${formatDateDisplay(booking.date)}`,
      `Time: ${booking.timeSlot} (${booking.mealType})`,
      `Guests: ${booking.partySize}`,
      `Table: ${booking.table.name} (${booking.table.zone})`,
      `Occasion: ${booking.guest.occasion}`,
      `Dietary restrictions: ${booking.guest.dietaryRestrictions || 'None'}`,
      `Special requests: ${booking.guest.specialRequests || 'None'}`,
      `Pre-orders: ${preorderLines.length ? preorderLines.join('; ') : 'None'}`,
      `Total estimate: ₹${booking.totalEstimate.toLocaleString()}`
    ].join('\n'));

    return fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
    })
      .then(response => response.json().then(result => response.ok && result.success !== false))
      .catch(error => {
        console.warn('Web3Forms error:', error);
        return false;
      });
  }

  // Submit Reservation
  function submitReservation() {
    if (state.isSubmitting) return;

    const guest = state.booking.guest;
    if (!guest.name) {
      showToast('Please enter your full name', 'error');
      document.getElementById('guestFullName')?.focus();
      return;
    }

    state.isSubmitting = true;
    const submitButton = document.getElementById('btnNextStep');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('opacity-60', 'cursor-wait');
    }
    if (!guest.phone) {
      showToast('Please enter a contact phone number', 'error');
      document.getElementById('guestPhone')?.focus();
      return;
    }

    // Calculate total
    let totalEstimate = 0;
    Object.entries(state.booking.preorders).forEach(([id, qty]) => {
      const m = RESTAURANT_DATA.menuItems.find(item => item.id === id);
      if (m) totalEstimate += m.price * qty;
    });

    const newReservation = {
      id: 'RES-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      date: state.booking.date,
      timeSlot: state.booking.timeSlot,
      mealType: state.booking.mealType,
      partySize: state.booking.partySize,
      table: state.booking.selectedTable,
      guest: { ...guest },
      preorders: { ...state.booking.preorders },
      totalEstimate: totalEstimate,
      status: 'Confirmed'
    };

    // Save
    state.reservations.unshift(newReservation);
    saveReservations();

    // Mark table reserved in current session
    if (state.booking.selectedTable) {
      const tbl = RESTAURANT_DATA.tables.find(t => t.id === state.booking.selectedTable.id);
      if (tbl) tbl.status = 'reserved';
    }

    state.activeConfirmedBooking = newReservation;
    showToast(`Booking ${newReservation.id} confirmed. Sending details...`, 'gold');

    // Show Confirmation Modal Pass
    renderConfirmationModal(newReservation);
    renderHostDashboard();
    renderFloorPlan();

    sendBookingDetails(newReservation).then(emailSent => {
      showToast(
        emailSent ? 'Booking details sent successfully.' : 'Booking saved, but email delivery failed.',
        emailSent ? 'success' : 'error'
      );
    }).finally(() => {
      state.isSubmitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-60', 'cursor-wait');
      }
    });
  }

  // Render Confirmation Pass Modal
  function renderConfirmationModal(booking) {
    const modal = document.getElementById('bookingConfirmationModal');
    if (!modal) return;

    document.getElementById('confPassCode').textContent = booking.id;
    document.getElementById('confPassGuestName').textContent = booking.guest.name;
    document.getElementById('confPassDate').textContent = formatDateDisplay(booking.date);
    document.getElementById('confPassTime').textContent = booking.timeSlot;
    document.getElementById('confPassGuests').textContent = `${booking.partySize} Person(s)`;
    document.getElementById('confPassTable').textContent = `${booking.table.name} (${booking.table.zone.toUpperCase()})`;
    document.getElementById('confPassOccasion').textContent = booking.guest.occasion.toUpperCase();

    // Pre-orders summary on pass
    const preordersPassList = document.getElementById('confPassPreorders');
    if (preordersPassList) {
      const items = Object.entries(booking.preorders);
      if (items.length === 0) {
        preordersPassList.innerHTML = `<li class="text-stone-400">None (Order a la carte upon arrival)</li>`;
      } else {
        preordersPassList.innerHTML = items.map(([id, qty]) => {
          const m = RESTAURANT_DATA.menuItems.find(x => x.id === id);
          return `<li class="flex justify-between text-xs"><span>${m?.name} × ${qty}</span> <span>₹${((m?.price || 0) * qty).toLocaleString()}</span></li>`;
        }).join('');
      }
    }

    const qrContainer = document.getElementById('confPassQrCode');
    renderQrCode(qrContainer);

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  // Reset Booking Form
  function resetBookingForm() {
    state.booking.selectedTable = null;
    state.booking.preorders = {};
    state.booking.guest = {
      name: '',
      email: '',
      phone: '',
      occasion: 'casual',
      specialRequests: '',
      dietaryRestrictions: '',
      notifications: true
    };
    const formFields = ['guestFullName', 'guestEmail', 'guestPhone', 'guestSpecialRequests', 'guestDietaryRestrictions'];
    formFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    goToStep(1);
    renderFloorPlan();
    renderMenu();
    updateLiveSummary();
    document.getElementById('bookingConfirmationModal').classList.add('hidden');
    showToast('Ready for a new reservation', 'gold');
  }

  // Lookup / My Reservations
  function renderMyReservations(query = '') {
    const list = document.getElementById('myReservationsList');
    if (!list) return;

    let items = state.reservations;
    if (query) {
      items = items.filter(r => 
        r.id.toLowerCase().includes(query) ||
        r.guest.phone.toLowerCase().includes(query) ||
        r.guest.name.toLowerCase().includes(query)
      );
    }

    if (items.length === 0) {
      list.innerHTML = `
        <div class="p-8 text-center text-stone-400">
          <i data-lucide="calendar-x" class="w-10 h-10 mx-auto text-stone-600 mb-2"></i>
          <p class="font-semibold text-stone-300">No reservations found</p>
          <p class="text-xs text-stone-500 mt-1">Try searching by your booking code (e.g. RES-8921) or phone number.</p>
        </div>
      `;
    } else {
      list.innerHTML = items.map(res => `
        <div class="p-4 rounded-xl bg-stone-900/90 border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-mono font-bold">${res.id}</span>
              <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">${res.status}</span>
              <span class="text-xs text-stone-400">• ${res.guest.occasion}</span>
            </div>
            <div class="mt-1 text-sm font-semibold text-stone-200">
              ${formatDateDisplay(res.date)} at ${res.timeSlot}
            </div>
            <div class="text-xs text-stone-400 mt-0.5">
              Guest: ${res.guest.name} (${res.partySize} people) • Table: ${res.table.name}
            </div>
            ${res.guest.specialRequests ? `<div class="text-[11px] text-amber-300/80 mt-1">Note: "${res.guest.specialRequests}"</div>` : ''}
          </div>
          <div class="flex items-center gap-2 w-full md:w-auto justify-end">
            <button type="button" class="btn-view-pass px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold" data-id="${res.id}">
              Digital Pass
            </button>
            <button type="button" class="btn-cancel-res px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 border border-rose-800/40 text-xs font-semibold" data-id="${res.id}">
              Cancel
            </button>
          </div>
        </div>
      `).join('');

      // Pass click handler
      list.querySelectorAll('.btn-view-pass').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const found = state.reservations.find(r => r.id === id);
          if (found) {
            document.getElementById('lookupReservationModal')?.classList.add('hidden');
            renderConfirmationModal(found);
          }
        });
      });

      // Cancel handler
      list.querySelectorAll('.btn-cancel-res').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (confirm(`Are you sure you want to cancel reservation ${id}?`)) {
            state.reservations = state.reservations.filter(r => r.id !== id);
            saveReservations();
            renderMyReservations(query);
            renderHostDashboard();
            showToast(`Reservation ${id} has been cancelled.`, 'error');
          }
        });
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  // Host / Staff Dashboard View
  function renderHostDashboard() {
    const totalBookingsEl = document.getElementById('hostTotalBookings');
    const totalCoversEl = document.getElementById('hostTotalCovers');
    const availableTablesEl = document.getElementById('hostAvailableTables');
    const hostTableList = document.getElementById('hostTableStatusList');
    const hostReservationList = document.getElementById('hostUpcomingList');

    if (!totalBookingsEl) return;

    // Metrics
    const totalBookings = state.reservations.length;
    const totalCovers = state.reservations.reduce((acc, r) => acc + (r.partySize || 0), 0);
    const availableTablesCount = RESTAURANT_DATA.tables.filter(t => t.status === 'available').length;

    totalBookingsEl.textContent = totalBookings;
    totalCoversEl.textContent = totalCovers;
    if (availableTablesEl) availableTablesEl.textContent = `${availableTablesCount} / ${RESTAURANT_DATA.tables.length}`;

    // Table Status Manager
    if (hostTableList) {
      hostTableList.innerHTML = RESTAURANT_DATA.tables.map(table => {
        const isReserved = table.status === 'reserved';
        const isOccupied = table.status === 'occupied';

        return `
          <div class="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div>
              <div class="font-bold text-sm text-stone-200">${table.name}</div>
              <div class="text-[11px] text-stone-400 capitalize">${table.zone} • ${table.capacity} Seats</div>
            </div>
            <select class="host-table-status-select bg-stone-950 text-xs px-2.5 py-1.5 rounded-lg border border-stone-700 text-stone-200" data-table-id="${table.id}">
              <option value="available" ${table.status === 'available' ? 'selected' : ''}>Available (Green)</option>
              <option value="reserved" ${table.status === 'reserved' ? 'selected' : ''}>Reserved (Red)</option>
              <option value="occupied" ${table.status === 'occupied' ? 'selected' : ''}>Occupied (Amber)</option>
            </select>
          </div>
        `;
      }).join('');

      hostTableList.querySelectorAll('.host-table-status-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
          const tableId = sel.getAttribute('data-table-id');
          const targetTable = RESTAURANT_DATA.tables.find(t => t.id === tableId);
          if (targetTable) {
            targetTable.status = e.target.value;
            renderFloorPlan();
            renderHostDashboard();
            showToast(`${targetTable.name} marked as ${e.target.value}`, 'gold');
          }
        });
      });
    }

    // Upcoming Bookings in Host View
    if (hostReservationList) {
      hostReservationList.innerHTML = state.reservations.map(res => `
        <div class="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-amber-400">${res.id} • ${res.guest.name} (${res.partySize} pax)</div>
            <div class="text-stone-400">${res.timeSlot} • Table ${res.table.name} • ${res.guest.phone}</div>
          </div>
          <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">${res.status}</span>
        </div>
      `).join('');
    }
  }

  // Bootstrapping on DOM Load
  document.addEventListener('DOMContentLoaded', init);

})();

