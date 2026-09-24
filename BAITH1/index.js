// 1. Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// 2. Dark/Light mode toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const isLight = document.body.getAttribute('data-theme') === 'light';
  document.body.setAttribute('data-theme', isLight ? 'dark' : 'light');
  themeToggle.textContent = isLight ? '🌙' : '☀️';
});

// 3. Smooth scroll (also set via CSS scroll-behavior; JS ensures older browsers work)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// 4. Scroll reveal effect
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// 5. Character counter for message field
const message = document.getElementById('message');
const charCount = document.getElementById('charCount');
message.addEventListener('input', () => {
  charCount.textContent = message.value.length;
});

// 6. Project filter/search by keyword and tag
const searchInput = document.getElementById('searchInput');
const tagButtons = document.querySelectorAll('.tag-btn');
const projectCards = document.querySelectorAll('.project-card');
let activeTag = 'all';

function applyFilter() {
  const keyword = searchInput.value.trim().toLowerCase();
  projectCards.forEach(card => {
    const matchesTag = activeTag === 'all' || card.dataset.tags.includes(activeTag);
    const matchesKeyword = card.dataset.name.includes(keyword) ||
      card.textContent.toLowerCase().includes(keyword);
    card.classList.toggle('hidden', !(matchesTag && matchesKeyword));
  });
}
searchInput.addEventListener('input', applyFilter);
tagButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tagButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTag = btn.dataset.tag;
    applyFilter();
  });
});

// 7. Contact form validation (multiple conditions) + current year in footer
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function setError(id, msg) {
  document.getElementById(id).textContent = msg;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = message.value.trim();

  setError('nameError', ''); setError('emailError', ''); setError('messageError', '');

  if (name.length < 2) {
    setError('nameError', 'Họ tên phải có ít nhất 2 ký tự.');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('emailError', 'Email không hợp lệ.');
    valid = false;
  }

  if (msg.length < 10) {
    setError('messageError', 'Lời nhắn cần ít nhất 10 ký tự.');
    valid = false;
  } else if (msg.length > 300) {
    setError('messageError', 'Lời nhắn không được vượt quá 300 ký tự.');
    valid = false;
  }

  if (valid) {
    formStatus.textContent = 'Gửi thành công! Mình sẽ phản hồi sớm nhất có thể.';
    formStatus.classList.add('success');
    form.reset();
    charCount.textContent = '0';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();