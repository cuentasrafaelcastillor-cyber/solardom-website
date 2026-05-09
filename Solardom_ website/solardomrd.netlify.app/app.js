// Intersection Observer for reveal animations
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

document.querySelectorAll('.mobile-link, .mobile-whatsapp-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// FAQ accordion — only one open at a time
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// Savings Calculator
const billSlider = document.getElementById('bill-slider');
const billDisplay = document.getElementById('bill-display');
const propBtns = document.querySelectorAll('.prop-btn');
const monthlySavingsEl = document.getElementById('monthly-savings');
const annualSavingsEl = document.getElementById('annual-savings');
const roiPeriodEl = document.getElementById('roi-period');

let currentRate = 0.65;
let currentCostMultiplier = 28;

function formatDOP(amount) {
  return 'RD$' + Math.round(amount).toLocaleString('es-DO');
}

function flashUpdate(el) {
  el.classList.add('updating');
  setTimeout(() => el.classList.remove('updating'), 200);
}

function updateSliderTrack(slider) {
  const min = Number(slider.min);
  const max = Number(slider.max);
  const val = Number(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background =
    'linear-gradient(to right, #27cd80 0%, #27cd80 ' + pct + '%, #e0e0e0 ' + pct + '%, #e0e0e0 100%)';
}

function updateCalc() {
  const bill = Number(billSlider.value);
  const monthlySavings = bill * currentRate;
  const annualSavings = monthlySavings * 12;
  const systemCost = bill * currentCostMultiplier;
  const roiYears = systemCost / annualSavings;

  billDisplay.textContent = bill.toLocaleString('es-DO');
  [monthlySavingsEl, annualSavingsEl, roiPeriodEl].forEach(flashUpdate);

  setTimeout(() => {
    monthlySavingsEl.textContent = formatDOP(monthlySavings);
    annualSavingsEl.textContent = formatDOP(annualSavings);
    roiPeriodEl.textContent = roiYears.toFixed(1) + ' años';
  }, 150);

  updateSliderTrack(billSlider);
}

billSlider.addEventListener('input', updateCalc);

propBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    propBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRate = parseFloat(btn.dataset.rate);
    currentCostMultiplier = parseFloat(btn.dataset.cost);
    updateCalc();
  });
});

updateCalc();
