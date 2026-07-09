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
  link.href = `https://api.whatsapp.com/send?phone=916005984629&text=${text}`;
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
    window.open(`https://api.whatsapp.com/send?phone=916005984629&text=${text}`, "_blank", "noopener,noreferrer");
  });
}

const customBuilder = document.querySelector("[data-custom-builder]");

if (customBuilder) {
  const steps = Array.from(customBuilder.querySelectorAll(".custom-step"));
  const progress = Array.from(customBuilder.querySelectorAll(".custom-progress span"));
  const guestInput = customBuilder.querySelector('input[name="guests"]');
  const vehicleSuggestion = customBuilder.querySelector("[data-vehicle-suggestion]");
  const vehicleNote = customBuilder.querySelector("[data-vehicle-note]");
  const acNote = customBuilder.querySelector("[data-ac-note]");
  const summary = customBuilder.querySelector("[data-custom-summary]");
  const whatsappLink = customBuilder.querySelector("[data-custom-whatsapp]");
  let activeStep = 0;

  const vehicleRules = [
    { max: 4, vehicle: "Sedan", note: "Sedan for 1 to 4 guests." },
    { max: 6, vehicle: "Ertiga", note: "Comfortable for 5 to 6 guests." },
    { max: 7, vehicle: "Innova", note: "Premium comfort for up to 7 guests." },
    { max: 9, vehicle: "Urbaniya", note: "Premium van for a larger private group." },
    { max: 16, vehicle: "Tempo Traveller", note: "Best for 7 to 16 guests." },
    { max: 80, vehicle: "Bus", note: "Best for large groups and tours." },
  ];

  const acCosts = {
    Sedan: 300,
    Ertiga: 300,
    Innova: 300,
    Urbaniya: 300,
    "Tempo Traveller": 500,
    Bus: 1000,
  };

  const getGuestCount = () => {
    const rawGuests = Number(guestInput?.value || 1);
    const guests = Math.min(80, Math.max(1, Number.isFinite(rawGuests) ? rawGuests : 1));
    if (guestInput && Number(guestInput.value) !== guests) guestInput.value = String(guests);
    return guests;
  };

  const getSuggestedVehicle = () => {
    const guests = getGuestCount();
    return vehicleRules.find((rule) => guests <= rule.max) || vehicleRules[vehicleRules.length - 1];
  };

  const setVehicle = (vehicle) => {
    const input = customBuilder.querySelector(`input[name="vehicle"][value="${vehicle}"]`);
    if (input) input.checked = true;
  };

  const getCheckedValue = (name) => {
    const selected = customBuilder.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
  };

  const getPlaces = () => {
    const checked = Array.from(customBuilder.querySelectorAll('input[name="places"]:checked')).map((input) => input.value);
    const customPlace = customBuilder.querySelector('textarea[name="customPlace"]')?.value.trim();
    if (customPlace) checked.push(customPlace);
    return checked.length ? checked.join(", ") : "Custom route";
  };

  const updateVehicleSuggestion = (syncChoice = true) => {
    const suggestion = getSuggestedVehicle();
    if (vehicleSuggestion) vehicleSuggestion.textContent = suggestion.vehicle;
    if (vehicleNote) vehicleNote.textContent = suggestion.note;
    if (syncChoice) setVehicle(suggestion.vehicle);
    updateAcNote();
  };

  const updateAcNote = () => {
    const vehicle = getCheckedValue("vehicle") || getSuggestedVehicle().vehicle;
    const cost = acCosts[vehicle] || 300;
    const label = vehicle === "Tempo Traveller" ? "tempo" : vehicle.toLowerCase();
    if (acNote) acNote.textContent = `AC add-on: Rs. ${cost}/day for ${label}. Non AC has no add-on.`;
  };

  const renderSummary = () => {
    const vehicle = getCheckedValue("vehicle") || getSuggestedVehicle().vehicle;
    const ac = getCheckedValue("ac") || "AC";
    const hotel = getCheckedValue("hotel") || "Standard Valley Stay";
    const meal = getCheckedValue("meal") || "With breakfast";
    const places = getPlaces();
    const guests = getGuestCount();
    const acCost = ac === "AC" ? `Rs. ${acCosts[vehicle] || 300}/day add-on` : "No AC add-on";

    const rows = [
      ["Places", places],
      ["Guests", String(guests)],
      ["Vehicle", vehicle],
      ["Comfort", `${ac} (${acCost})`],
      ["Hotel", hotel],
      ["Meals", meal],
    ];

    if (summary) {
      summary.innerHTML = rows
        .map(([label, value]) => `<div class="summary-row"><span>${label}</span><strong>${value}</strong></div>`)
        .join("");
    }

    if (whatsappLink) {
      const message = encodeURIComponent(
        `Hello Breeza Tour & Travels, I want a customized itinerary.\nPlaces: ${places}\nGuests: ${guests}\nVehicle: ${vehicle}\nComfort: ${ac} (${acCost})\nHotel: ${hotel}\nMeals: ${meal}`
      );
      whatsappLink.href = `https://api.whatsapp.com/send?phone=916005984629&text=${message}`;
    }
  };

  const showStep = (index) => {
    activeStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === activeStep));
    progress.forEach((item, progressIndex) => item.classList.toggle("is-active", progressIndex <= activeStep));
    if (activeStep === 3) renderSummary();
  };

  customBuilder.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => showStep(activeStep + 1));
  });

  customBuilder.querySelectorAll("[data-prev]").forEach((button) => {
    button.addEventListener("click", () => showStep(activeStep - 1));
  });

  guestInput?.addEventListener("input", () => updateVehicleSuggestion(true));
  customBuilder.querySelectorAll('input[name="vehicle"]').forEach((input) => {
    input.addEventListener("change", updateAcNote);
  });
  customBuilder.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", renderSummary);
    input.addEventListener("change", renderSummary);
  });

  updateVehicleSuggestion(true);
  renderSummary();
}
