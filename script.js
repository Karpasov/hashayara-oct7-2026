const header = document.querySelector(".site-header");
const soundToggle = document.querySelector(".sound-toggle");
const revealEls = document.querySelectorAll(".reveal");
const quoteCards = document.querySelectorAll(".voice-card");
const scheduleRows = document.querySelectorAll(".schedule-row");

let soundEnabled = false;
let chimePlayed = false;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const playChime = () => {
  if (!soundEnabled || chimePlayed) return;
  chimePlayed = true;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const gain = context.createGain();
  const first = context.createOscillator();
  const second = context.createOscillator();

  first.type = "sine";
  second.type = "triangle";
  first.frequency.value = 587.33;
  second.frequency.value = 880;

  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.15);

  first.connect(gain);
  second.connect(gain);
  gain.connect(context.destination);

  first.start();
  second.start(context.currentTime + 0.12);
  first.stop(context.currentTime + 1);
  second.stop(context.currentTime + 1.1);
};

window.addEventListener("scroll", () => {
  updateHeader();
  playChime();
});

soundToggle.addEventListener("click", async () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
});

quoteCards.forEach((card) => {
  const quote = card.querySelector("blockquote");
  const fullText = quote.dataset.quote;
  let timer;

  const typeQuote = () => {
    clearInterval(timer);
    quote.textContent = "";
    let index = 0;
    timer = setInterval(() => {
      quote.textContent += fullText.charAt(index);
      index += 1;
      if (index >= fullText.length) clearInterval(timer);
    }, 24);
  };

  const resetQuote = () => {
    clearInterval(timer);
    quote.textContent = fullText;
  };

  card.addEventListener("mouseenter", typeQuote);
  card.addEventListener("focusin", typeQuote);
  card.addEventListener("mouseleave", resetQuote);
  card.addEventListener("focusout", resetQuote);
});

scheduleRows.forEach((row) => {
  const detail = row.nextElementSibling;

  row.addEventListener("click", () => {
    const isOpen = row.getAttribute("aria-expanded") === "true";
    row.setAttribute("aria-expanded", String(!isOpen));
    detail.classList.toggle("is-open", !isOpen);
  });
});

const bookingForm = document.querySelector(".booking-form");

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);
  const lines = [
    "Hello Gilad,",
    "",
    "I would like to receive booking information for Hashayara / From Sorrow to Song.",
    "",
    `Name: ${data.get("name") || ""}`,
    `Email: ${data.get("email") || ""}`,
    `Organization / Community: ${data.get("organization") || ""}`,
    `City / Country: ${data.get("city_country") || ""}`,
    `Preferred date or window: ${data.get("date") || ""}`,
    `Preferred format: ${data.get("format") || ""}`,
    "",
    "Audience, venue, and goals:",
    data.get("message") || "",
  ];

  const subject = encodeURIComponent("Hashayara booking inquiry");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:giladperry@gmail.com?subject=${subject}&body=${body}`;
});

updateHeader();
