/* ============================================
   NOIR — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ----- Loader -----
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1400);
  });

  // ----- Header scroll -----
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Theme toggle -----
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('noir-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const updateThemeIcon = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    themeToggle.querySelector('.theme-icon').textContent = isLight ? '☀' : '☾';
  };
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (next === 'dark') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', 'light');
    localStorage.setItem('noir-theme', next === 'dark' ? '' : 'light');
    updateThemeIcon();
  });

  // ----- Mobile menu -----
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav.querySelectorAll('.mobile-link, .mobile-reserve');

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ----- Reservation modal -----
  const modal = document.getElementById('reserveModal');
  const openBtns = [
    document.getElementById('openReserve'),
    document.getElementById('heroReserve'),
    document.getElementById('mobileReserve'),
    document.getElementById('barReserve'),
    document.getElementById('footerReserve')
  ].filter(Boolean);

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // reset to step 1
      document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      document.querySelector('.step[data-step="1"]').classList.add('active');
    });
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.getElementById('closeSuccess').addEventListener('click', closeModal);

  // Time slots
  const timeSlots = document.querySelectorAll('.time-slot');
  let selectedTime = '19:30';
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.dataset.time;
    });
  });

  // Date min = today
  const dateInput = document.getElementById('resDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;

  // Steps
  document.getElementById('toStep2').addEventListener('click', () => {
    if (!dateInput.value) {
      dateInput.focus();
      return;
    }
    document.querySelector('.step[data-step="1"]').classList.remove('active');
    document.querySelector('.step[data-step="2"]').classList.add('active');
  });

  document.getElementById('backStep1').addEventListener('click', () => {
    document.querySelector('.step[data-step="2"]').classList.remove('active');
    document.querySelector('.step[data-step="1"]').classList.add('active');
  });

  document.getElementById('confirmReserve').addEventListener('click', () => {
    const name = document.getElementById('resName').value.trim();
    const email = document.getElementById('resEmail').value.trim();
    if (!name || !email) {
      if (!name) document.getElementById('resName').focus();
      else document.getElementById('resEmail').focus();
      return;
    }

    const guests = document.getElementById('resGuests').value;
    const dateVal = new Date(dateInput.value + 'T12:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formatted = dateVal.toLocaleDateString('en-GB', options);

    document.getElementById('confDate').textContent = formatted;
    document.getElementById('confTime').textContent = selectedTime;
    document.getElementById('confGuests').textContent = guests + (guests === '1' ? ' guest' : ' guests');

    document.querySelector('.step[data-step="2"]').classList.remove('active');
    document.querySelector('.step[data-step="3"]').classList.add('active');
  });

  // ----- Reviews slider -----
  const reviews = document.querySelectorAll('.review');
  let currentRev = 0;
  const revCurrent = document.getElementById('revCurrent');

  const showReview = (i) => {
    reviews.forEach(r => r.classList.remove('active'));
    reviews[i].classList.add('active');
    revCurrent.textContent = String(i + 1).padStart(2, '0');
  };

  document.getElementById('revNext').addEventListener('click', () => {
    currentRev = (currentRev + 1) % reviews.length;
    showReview(currentRev);
  });

  document.getElementById('revPrev').addEventListener('click', () => {
    currentRev = (currentRev - 1 + reviews.length) % reviews.length;
    showReview(currentRev);
  });

  // Auto-advance reviews
  setInterval(() => {
    currentRev = (currentRev + 1) % reviews.length;
    showReview(currentRev);
  }, 6000);

  // ----- Gallery lightbox -----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src || item.querySelector('img').src;
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ----- Cart -----
  const cart = [];
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  const cartFab = document.getElementById('cartFab');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const updateCartUI = () => {
    cartCount.textContent = cart.length;
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      cartTotal.textContent = '€0';
      checkoutBtn.disabled = true;
      return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map((item, i) => {
      total += item.price;
      return `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">€${item.price}</div>
          </div>
          <button class="cart-item-remove" data-index="${i}">Remove</button>
        </div>
      `;
    }).join('');

    cartTotal.textContent = `€${total}`;
    checkoutBtn.disabled = false;

    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(+btn.dataset.index, 1);
        updateCartUI();
      });
    });
  };

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.push({
        name: btn.dataset.name,
        price: +btn.dataset.price
      });
      updateCartUI();
      // brief feedback
      btn.textContent = 'Added';
      setTimeout(() => btn.textContent = 'Add', 1200);
    });
  });

  cartFab.addEventListener('click', () => cartDrawer.classList.add('open'));
  document.getElementById('cartClose').addEventListener('click', () => cartDrawer.classList.remove('open'));

  checkoutBtn.addEventListener('click', () => {
    alert('Checkout is a demo. In a real project this would go to payment / order confirmation.');
    cart.length = 0;
    updateCartUI();
    cartDrawer.classList.remove('open');
  });

  // Close cart on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cartDrawer.classList.remove('open');
      modal.classList.remove('open');
      lightbox.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Smooth horizontal scroll with mouse wheel on signature
  const sigScroll = document.getElementById('signatureScroll');
  if (sigScroll) {
    sigScroll.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        sigScroll.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
});
