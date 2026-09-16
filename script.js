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
const fullTitle = 'TASSES AMB MALA LLET';
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

// ===== CISTELLA SIMULADA =====
const cartCountEl = document.getElementById('cartCount');
let cartCount = 0;

document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    createRipple(e, btn);
    const name = btn.getAttribute('data-name');
    cartCount++;
    cartCountEl.textContent = cartCount;
    showToast(`"${name}" ja és teva. Que la gaudeixis amb mala bava!`);
  });
});

const cartIcon = document.getElementById('cartIcon');
cartIcon.addEventListener('click', () => {
  if (cartCount === 0) {
    showToast('La cistella és més buida que una excusa de dilluns.');
  } else {
    showToast(`Tens ${cartCount} tassa(es) esperant per amanir el teu cafè.`);
  }
});

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
