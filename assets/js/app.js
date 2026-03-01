// Typing effect in hero
const typingEl = document.getElementById("typing-text");
const phrases = [
  "AI & Data Science Student",
  "Python Developer",
  "ML Enthusiast",
  "Web Developer",
];
const TYPING_SPEED = 90;
const ERASING_SPEED = 60;
const PAUSE_BETWEEN = 1400;

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typingEl) return;
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting && charIndex <= currentPhrase.length) {
    typingEl.textContent = currentPhrase.substring(0, charIndex);
    charIndex++;
    setTimeout(typeLoop, TYPING_SPEED);
  } else if (isDeleting && charIndex >= 0) {
    typingEl.textContent = currentPhrase.substring(0, charIndex);
    charIndex--;
    setTimeout(typeLoop, ERASING_SPEED);
  } else if (!isDeleting && charIndex > currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, PAUSE_BETWEEN);
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 200);
  }
}

// Smooth scroll for nav links
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 72;
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetTop = rect.top + scrollTop - headerOffset;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });
}

// Scroll-triggered animations
function setupScrollAnimations() {
  const animatedEls = document.querySelectorAll("[data-animate]");
  if (!("IntersectionObserver" in window)) {
    animatedEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          if (entry.target.classList.contains("skill-group")) {
            entry.target.classList.add("animate-bars");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  animatedEls.forEach((el) => observer.observe(el));
}

// Mobile nav toggle
function setupMobileNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelectorAll(".nav-links a");

  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) =>
    link.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    })
  );
}

// Contact form validation (front-end only)
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusEl = form.querySelector(".form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameField = form.querySelector("#name");
    const emailField = form.querySelector("#email");
    const messageField = form.querySelector("#message");

    const fields = [nameField, emailField, messageField];
    let isValid = true;

    fields.forEach((field) => {
      const errorEl = field
        .closest(".form-field")
        .querySelector(".field-error");
      errorEl.textContent = "";

      if (!field.value.trim()) {
        errorEl.textContent = "This field is required.";
        isValid = false;
      } else if (
        field.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)
      ) {
        errorEl.textContent = "Please enter a valid email.";
        isValid = false;
      }
    });

    if (!isValid) {
      statusEl.textContent = "Please fix the errors and try again.";
      return;
    }

    statusEl.textContent =
      "Thanks for reaching out! This demo form doesn’t send messages yet, but you can email me directly.";
    form.reset();
  });
}

// Background particles
function setupParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth * 2);
  let height = (canvas.height = window.innerHeight * 2);
  const dpr = window.devicePixelRatio || 1;
  ctx.scale(dpr, dpr);

  const particles = [];
  const PARTICLE_COUNT = 70;

  function createParticle() {
    const isAccent = Math.random() < 0.4;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      color: isAccent ? "rgba(109, 93, 252, 0.7)" : "rgba(70, 230, 255, 0.4)",
      glow: isAccent ? "rgba(109, 93, 252, 0.4)" : "rgba(70, 230, 255, 0.3)",
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function resize() {
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // soft background glow
    const gradient = ctx.createRadialGradient(
      width * 0.2,
      height * 0.2,
      0,
      width * 0.5,
      height * 0.5,
      width * 0.8
    );
    gradient.addColorStop(0, "rgba(15, 23, 42, 0.8)");
    gradient.addColorStop(1, "rgba(2, 6, 23, 0.95)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.fillStyle = p.glow;
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // subtle connecting lines
    ctx.lineWidth = 0.4;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < (120 * 120) / dpr) {
          const opacity = 0.08 * (1 - distSq / ((120 * 120) / dpr));
          ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// Set year in footer
function setYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear().toString();
}

document.addEventListener("DOMContentLoaded", () => {
  typeLoop();
  setupSmoothScroll();
  setupScrollAnimations();
  setupMobileNav();
  setupContactForm();
  setupParticles();
  setYear();
});

