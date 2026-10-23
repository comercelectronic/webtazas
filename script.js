// ===== ANIMACIÓ D'ENTRADA =====
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;

  let alreadyPlayed = false;
  try {
    alreadyPlayed = sessionStorage.getItem('introPlayed') === '1';
  } catch (e) {
    alreadyPlayed = false;
  }

  if (alreadyPlayed) {
    intro.remove();
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('intro-active');

  let finished = false;
  function finishIntro() {
    if (finished) return;
    finished = true;
    intro.classList.add('intro--exit');
    document.body.classList.remove('intro-active');
    try {
      sessionStorage.setItem('introPlayed', '1');
    } catch (e) {
      /* la sessió no permet emmagatzematge; es tornarà a veure, sense passar res greu */
    }
    setTimeout(() => intro.remove(), 750);
  }

  if (reduceMotion) {
    finishIntro();
  } else {
    setTimeout(finishIntro, 2800);
    intro.addEventListener('click', finishIntro);
  }
})();

// ===== NAVEGACIÓ MÒBIL =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== SCROLL SUAU (ja gestionat per CSS, però reforcem per a navegadors antics) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ===== EFECTE DE MECANOGRAFIA AL TÍTOL =====
const typedTitleEl = document.getElementById('typedTitle');
const fullTitle = 'TASSES SENSE SUCRE';
let typeIndex = 0;

function typeTitle() {
  if (typeIndex <= fullTitle.length) {
    typedTitleEl.textContent = fullTitle.slice(0, typeIndex);
    typeIndex++;
    setTimeout(typeTitle, 90);
  }
}
typeTitle();

// ===== TOAST DE NOTIFICACIONS =====
const toast = document.getElementById('toast');
let toastTimeout;

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ===== CATÀLEG DE PRODUCTES =====
// Nomes per mostrar preus/noms a la interfície. El preu real i definitiu
// es valida sempre al servidor (netlify/functions/create-checkout-session.js)
// abans de crear el pagament, perquè ningú el pugui manipular des del navegador.
const PRODUCTS = {
  'fer-volar-coloms': { name: 'Fer Volar Coloms', price: 1890, image: 'images/mug-coloms.jpg' },
  'aneu-a-fer-punyetes': { name: 'Aneu a Fer Punyetes', price: 1890, image: 'images/mug-punyetes.jpg' },
  'qui-no-plora-no-mama': { name: 'Qui no plora, no mama', price: 1490, image: null },
  'cofoi': { name: 'Cofoi', price: 1550, image: null },
  'escarransit': { name: 'Escarransit', price: 1550, image: null },
  'esbojarrat': { name: 'Esbojarrat', price: 1550, image: null },
  'carallot-oficial': { name: 'Carallot Oficial', price: 1690, image: null },
  'arsenal-insults': { name: "L'Arsenal d'Insults", price: 1890, image: 'images/mug-insults-front.jpg' },
  'no-em-toquis-ovaris': { name: 'No em Toquis els Ovaris', price: 1890, image: 'images/mug-no-toquis-front.jpg' },
};

function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

// ===== CISTELLA =====
const CART_STORAGE_KEY = 'senseSucreCart';
let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => PRODUCTS[item.id]) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    /* emmagatzematge no disponible; la cistella només durarà la sessió en curs */
  }
}

function cartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + (PRODUCTS[item.id]?.price || 0) * item.qty, 0);
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty = Math.min(20, existing.qty + 1);
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
}

function setQty(id, qty) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  } else {
    item.qty = Math.min(20, qty);
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartDrawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
const checkoutBtn = document.getElementById('checkoutBtn');

function renderCart() {
  cartCountEl.textContent = cartItemCount();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">La cistella és més buida que una excusa de dilluns.<br>Encara no hi has afegit cap tassa.</p>';
    checkoutBtn.disabled = true;
  } else {
    cartItemsEl.innerHTML = cart.map(item => {
      const product = PRODUCTS[item.id];
      if (!product) return '';
      const thumb = product.image
        ? `<img src="${product.image}" alt="" class="cart-item-thumb">`
        : `<span class="cart-item-thumb cart-item-thumb--icon"><svg class="icon"><use href="#icon-mug"/></svg></span>`;
      return `
        <div class="cart-item" data-id="${item.id}">
          ${thumb}
          <div class="cart-item-info">
            <strong>${product.name}</strong>
            <span class="cart-item-price">${formatPrice(product.price)}</span>
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="decrease" aria-label="Treu-ne una unitat"><svg class="icon"><use href="#icon-minus"/></svg></button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-action="increase" aria-label="Afegeix-ne una unitat"><svg class="icon"><use href="#icon-plus"/></svg></button>
            </div>
          </div>
          <button class="cart-item-remove" data-action="remove" aria-label="Elimina ${product.name} de la cistella">
            <svg class="icon"><use href="#icon-trash"/></svg>
          </button>
        </div>
      `;
    }).join('');
    checkoutBtn.disabled = false;
  }

  cartTotalEl.textContent = formatPrice(cartSubtotal());
}

function openCart() {
  cartDrawer.classList.add('open');
  cartBackdrop.classList.add('open');
  document.body.classList.add('cart-open');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartBackdrop.classList.remove('open');
  document.body.classList.remove('cart-open');
}

document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    createRipple(e, btn);
    const id = btn.getAttribute('data-id');
    const product = PRODUCTS[id];
    if (!product) return;
    addToCart(id);
    showToast(`"${product.name}" ja és teva. A gaudir-la ben clara, sense sucre!`);
  });
});

document.getElementById('cartIcon').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

cartItemsEl.addEventListener('click', (e) => {
  const itemEl = e.target.closest('.cart-item');
  if (!itemEl) return;
  const id = itemEl.getAttribute('data-id');
  const item = cart.find(i => i.id === id);
  if (!item) return;

  const action = e.target.closest('[data-action]')?.getAttribute('data-action');
  if (action === 'increase') setQty(id, item.qty + 1);
  if (action === 'decrease') setQty(id, item.qty - 1);
  if (action === 'remove') removeFromCart(id);
});

checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) return;

  checkoutBtn.disabled = true;
  const originalText = checkoutBtn.textContent;
  checkoutBtn.textContent = 'Redirigint al pagament...';

  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    if (!response.ok) {
      throw new Error('checkout-failed');
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('no-url');
    }
  } catch (err) {
    showToast('No hem pogut connectar amb el pagament. Si estàs veient una còpia de la web sense Netlify, el pagament real només funciona al domini publicat.');
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = originalText;
  }
});

renderCart();

// ===== EFECTE RIPPLE ALS BOTONS =====
function createRipple(event, element) {
  const circle = document.createElement('span');
  const diameter = Math.max(element.clientWidth, element.clientHeight);
  const radius = diameter / 2;
  const rect = element.getBoundingClientRect();

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');

  const existingRipple = element.querySelector('.ripple');
  if (existingRipple) existingRipple.remove();

  element.style.position = element.style.position || 'relative';
  element.appendChild(circle);

  setTimeout(() => circle.remove(), 600);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => createRipple(e, btn));
});

// ===== FILTRE DE PRODUCTES =====
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'totes' || filter === category) {
        card.classList.remove('hidden-filter');
      } else {
        card.classList.add('hidden-filter');
      }
    });
  });
});

// ===== OBSERVADOR D'INTERSECCIÓ PER A ANIMACIONS =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .product-card, .testimonial-card').forEach(el => {
  revealObserver.observe(el);
});

// ===== VALIDACIÓ DEL FORMULARI DE CONTACTE =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  let isValid = true;

  [name, email, message].forEach(field => field.classList.remove('error'));

  if (name.value.trim().length < 2) {
    name.classList.add('error');
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    email.classList.add('error');
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    message.classList.add('error');
    isValid = false;
  }

  if (!isValid) {
    showToast('Falta algun camp o l\'has omplert de qualsevol manera. Revisa\'l!');
    return;
  }

  showToast(`Gràcies, ${name.value.trim().split(' ')[0]}! Ja tenim el teu missatge. T'escrivim aviat.`);
  contactForm.reset();
});

// ===== HEADER AMB OMBRA EN FER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 4px 20px rgba(44, 62, 80, 0.15)';
  } else {
    header.style.boxShadow = '0 2px 8px rgba(44, 62, 80, 0.08)';
  }
});
