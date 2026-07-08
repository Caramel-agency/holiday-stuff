const navToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".faq-button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.querySelector(".faq-icon").textContent = isOpen ? "-" : "+";
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    if (!lightbox || !lightboxImage || !img) return;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("is-open");
  });
});

if (lightbox) {
  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("is-open");
    if (lightboxImage) lightboxImage.src = "";
  });
}

document.querySelectorAll("[data-whatsapp-package]").forEach((link) => {
  const packageName = link.getAttribute("data-whatsapp-package");
  const text = encodeURIComponent(`Hello Breeza Tour & Travels, I am interested in ${packageName}. Please share details.`);
  link.href = `https://api.whatsapp.com/send?phone=919596999994&text=${text}`;
});

const form = document.querySelector(".form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "Guest";
    const packageName = data.get("package") || "a custom trip";
    const message = data.get("message") || "Please contact me with details.";
    const text = encodeURIComponent(`Hello Breeza Tour & Travels, I am ${name}. I am interested in ${packageName}. ${message}`);
    window.open(`https://api.whatsapp.com/send?phone=919596999994&text=${text}`, "_blank", "noopener,noreferrer");
  });
}
