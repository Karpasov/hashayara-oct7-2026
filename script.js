const header = document.querySelector(".site-header");
const soundToggle = document.querySelector(".sound-toggle");
const siteAudio = document.querySelector(".site-audio");
const revealEls = document.querySelectorAll(".reveal");
const quoteCards = document.querySelectorAll(".voice-card");
const scheduleRows = document.querySelectorAll(".schedule-row");

let soundEnabled = false;

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

window.addEventListener("scroll", () => {
  updateHeader();
});

const updateSoundToggle = () => {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Pause site music" : "Play site music");
  const label = soundToggle.querySelector("span:last-child");
  if (label) label.textContent = soundEnabled ? "Sound On" : "Sound";
};

if (siteAudio) {
  siteAudio.volume = 0.42;
}

soundToggle.addEventListener("click", async () => {
  if (!siteAudio) return;

  soundEnabled = !soundEnabled;
  updateSoundToggle();

  if (!soundEnabled) {
    siteAudio.pause();
    return;
  }

  try {
    await siteAudio.play();
  } catch (error) {
    soundEnabled = false;
    updateSoundToggle();
  }
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
