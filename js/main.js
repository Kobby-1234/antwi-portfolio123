/* ============================================================
   PORTFOLIO BEHAVIOUR  ·  js/main.js
   ------------------------------------------------------------
   Four small features, each in its own block:
     1. Mobile navigation toggle (hamburger)
     2. Animated skill progress bars (animate when scrolled into view)
     3. Project carousel (prev / next / dots / autoplay)
     4. Footer year (fills in automatically)

   This is plain "vanilla" JavaScript — no libraries — so it runs
   anywhere and deploys to Vercel with zero setup.
   ============================================================ */

/* Wait until the HTML is fully parsed before touching elements. */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. MOBILE NAV TOGGLE
     Clicking the hamburger opens/closes the menu and flips the
     aria-expanded value (which also animates it into an X via CSS).
     ========================================================= */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the menu after a link is tapped (nice on phones)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });


  /* =========================================================
     2. ANIMATED PROGRESS BARS
     We DON'T animate on page load — we wait until each bar is
     visible, so the viewer actually watches it fill up.
     The IntersectionObserver tells us when an element enters
     the screen. When it does, we set the fill's width to the
     number stored in its  data-width  attribute, and CSS
     handles the smooth animation (see .bar-fill transition).
     ========================================================= */
  const bars = document.querySelectorAll(".bar-fill");

  const barObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width + "%";   // e.g. "90%"
        observer.unobserve(fill);                      // animate once only
      }
    });
  }, { threshold: 0.4 });   // fire when 40% of the bar is on screen

  bars.forEach((bar) => barObserver.observe(bar));


  /* =========================================================
     3. CAROUSEL
     The track holds all slides side by side. To show slide N
     we slide the track left by (N × 100%). Dots are generated
     from the number of slides. Autoplay advances every 5s and
     pauses while the mouse is over the carousel.
     ========================================================= */
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsBox = document.getElementById("carouselDots");
  const carousel = document.getElementById("carousel");

  let index = 0;

  // Build one dot per slide
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = Array.from(dotsBox.children);

  function goTo(n) {
    // Wrap around: after the last slide go back to the first, and vice-versa
    index = (n + slides.length) % slides.length;
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  nextBtn.addEventListener("click", () => goTo(index + 1));
  prevBtn.addEventListener("click", () => goTo(index - 1));

  // Autoplay
  let timer = setInterval(() => goTo(index + 1), 5000);
  function stopAuto() { clearInterval(timer); }
  function startAuto() { stopAuto(); timer = setInterval(() => goTo(index + 1), 5000); }
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  // Touch swipe (phones)
  let startX = 0;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50) goTo(index + 1);   // swiped left
    if (diff > 50) goTo(index - 1);    // swiped right
    startAuto();
  });


  /* =========================================================
     4. FOOTER YEAR
     ========================================================= */
  document.getElementById("year").textContent = new Date().getFullYear();
});
