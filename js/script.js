const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const typedText = document.querySelector("#typed-text");
const year = document.querySelector("#year");
const contactForm = document.querySelector(".contact-form");

const phrases = [
  "Building premium iOS experiences.",
  "Shipping secure SwiftUI products.",
  "Scaling clean mobile architecture."
];

let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;
let countersStarted = false;

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 16);
}

function toggleMenu() {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navMenu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
}

function closeMenu() {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
}

function typeLoop() {
  if (!typedText) return;

  const phrase = phrases[phraseIndex];
  const nextText = deleting
    ? phrase.slice(0, characterIndex - 1)
    : phrase.slice(0, characterIndex + 1);

  typedText.textContent = nextText;
  characterIndex = nextText.length;

  let delay = deleting ? 38 : 74;

  if (!deleting && characterIndex === phrase.length) {
    delay = 1450;
    deleting = true;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 240;
  }

  window.setTimeout(typeLoop, delay);
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const startedAt = performance.now();

  function tick(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    counter.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("stats-grid") && !countersStarted) {
        countersStarted = true;
        counters.forEach(animateCounter);
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);

function addRipple(event) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");

  ripple.className = "ripple";
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  target.appendChild(ripple);

  ripple.addEventListener("animationend", () => ripple.remove());
}

function handleContactSubmit(event) {
  event.preventDefault();

  const status = contactForm.querySelector(".form-status");
  status.textContent = "Thanks, Rahul will get back to you soon.";
  contactForm.reset();
}

window.addEventListener("scroll", updateHeader, { passive: true });
navToggle.addEventListener("click", toggleMenu);
navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.querySelectorAll(".btn, .icon-link, .card-actions a").forEach((button) => {
  button.addEventListener("click", addRipple);
});

revealItems.forEach((item) => observer.observe(item));

if (year) {
  year.textContent = new Date().getFullYear();
}

if (contactForm) {
  contactForm.addEventListener("submit", handleContactSubmit);
}

updateHeader();
typeLoop();
