/* ============================================================
   babyyaa.js — For Stephanie
   ============================================================ */

/* ── PASSWORD GATE ───────────────────────────────────────── */

(function () {
  const CORRECT_PASSWORD = "stephanie"; // ← change this to your chosen password

  const gate     = document.getElementById("password-gate");
  const input    = document.getElementById("pw-input");
  const submit   = document.getElementById("pw-submit");
  const errorMsg = document.getElementById("pw-error");

  // If already unlocked this session, skip gate instantly
  if (sessionStorage.getItem("pw-unlocked") === "yes") {
    if (gate) gate.remove();
    return;
  }

  function tryPassword() {
    const val = input ? input.value.trim().toLowerCase() : "";

    if (val === CORRECT_PASSWORD.toLowerCase()) {
      sessionStorage.setItem("pw-unlocked", "yes");

      if (gate) {
        gate.classList.add("fade-out");
        setTimeout(() => gate.remove(), 900);
      }
    } else {
      if (errorMsg) {
        errorMsg.classList.remove("hidden");
        // Re-trigger shake animation
        errorMsg.style.animation = "none";
        setTimeout(() => (errorMsg.style.animation = ""), 10);
      }
      if (input) {
        input.value = "";
        input.focus();
      }
    }
  }

  if (submit) submit.addEventListener("click", tryPassword);

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") tryPassword();
      // Hide error as soon as they start typing again
      if (errorMsg) errorMsg.classList.add("hidden");
    });
  }
})();
/* ── 1. Configuration ────────────────────────────────────── */

// Change to the real date & time you first met
const MET_DATE = new Date(2025, 10, 17, 20, 30, 0);

// The quote that types itself out in the hero
const HERO_QUOTE = "Loving you was the loudest silence of my life.";

// Reasons shown on the flip card
const REASONS = [
  "Your smile — it could end any bad day I ever had.",
  "The way you laugh when something is barely even funny.",
  "How you say my name like it actually means something.",
  "Your kindness, even to people who never deserved it.",
  "The little voice notes you used to send at midnight.",
  "How safe the world felt whenever you were on the line.",
  "The way you cared about the smallest details.",
  "That you were brave enough to be soft with me.",
  "The way you listened — really listened.",
  "That you showed me love is a quiet, steady thing.",
];

// Lyrics synced to the song by timestamp (seconds)
const LYRICS = [
  { time: 0,  text: "..." },
  { time: 5,  text: "Loving can hurt, loving can hurt sometimes" },
  { time: 13, text: "But it's the only thing that I know" },
  { time: 21, text: "When it gets hard, you know it can get hard sometimes" },
  { time: 29, text: "It is the only thing that makes us feel alive" },
  { time: 40, text: "We keep this love in a photograph" },
  { time: 48, text: "We made these memories for ourselves" },
];

// Captions used on the polaroid strip
const POLAROID_CAPTIONS = [
  "us", "you", "always", "my favorite",
  "remember?", "forever", "stay", "ours",
  "golden", "soft", "mine", "yours",
];

// localStorage key
const STORAGE_KEY = "stephanie-message";


/* ── 2. Wait for DOM ─────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

  /* ── DOM References ──────────────────────────────────────── */
  const overlay         = document.getElementById("start-overlay");
  const startBtn        = document.getElementById("start-btn");
  const music           = document.getElementById("bg-music");
  const musicToggle     = document.getElementById("music-toggle");
  const lyricsCard      = document.getElementById("lyrics-card");
  const lyricsLine      = document.getElementById("lyrics-line");
  const heartsBg        = document.getElementById("hearts-bg");
  const petalsBg        = document.getElementById("petals-bg");
  const lightbox        = document.getElementById("lightbox");
  const lbImg           = document.getElementById("lb-img");
  const lbClose         = document.querySelector(".lb-close");
  const typeEl          = document.getElementById("typewriter");
  const reasonCard      = document.getElementById("reason-card");
  const reasonInner     = document.getElementById("reason-inner");
  const reasonFront     = document.getElementById("reason-text");
  const reasonBack      = document.getElementById("reason-text-back");
  const polaroidStrip   = document.getElementById("polaroid-strip");
  const replyInput      = document.getElementById("reply-input");
  const replyStatus     = document.getElementById("reply-status");
  const replySaved      = document.getElementById("reply-saved");
  const replySavedLabel = document.getElementById("reply-saved-label");
  const secretHeart     = document.getElementById("secret-heart");
  const secretMessage   = document.getElementById("secret-message");
  const secretCount     = document.getElementById("secret-count");
  const cuDays          = document.getElementById("cu-days");
  const cuHours         = document.getElementById("cu-hours");
  const cuMins          = document.getElementById("cu-mins");
  const cuSecs          = document.getElementById("cu-secs");
  const messageForm     = document.getElementById("message-form");


  /* ══════════════════════════════════════════════════════════
     3. START OVERLAY + MUSIC
     Browsers block autoplay until the user interacts.
     Music starts on "Begin" tap, overlay fades out.
  ══════════════════════════════════════════════════════════ */

  startBtn.addEventListener("click", () => {
    music.volume = 0.6;

    music.play().catch(() => {
      console.log("[music] Could not start — file missing or blocked.");
    });

    overlay.classList.add("fade-out");
    musicToggle.classList.remove("hidden");
    musicToggle.classList.add("playing");

    if (lyricsCard) lyricsCard.classList.remove("hidden");

    startTypewriter();
    buildStars();

    // Remove overlay from DOM after transition
    setTimeout(() => {
      if (overlay) overlay.remove();
    }, 1100);
  });


  /* ══════════════════════════════════════════════════════════
     4. MUSIC ENDS — no loop, show farewell message
  ══════════════════════════════════════════════════════════ */

  music.addEventListener("ended", () => {
    musicToggle.classList.remove("playing");
    musicToggle.classList.add("muted");

    if (!lyricsCard || !lyricsLine) return;

    lyricsLine.style.opacity = "0";
    setTimeout(() => {
      lyricsLine.textContent   = "The song has ended — but never the feeling.";
      lyricsLine.style.opacity = "1";
    }, 400);

    // Fade out lyrics card after showing the farewell
    setTimeout(() => {
      lyricsCard.classList.add("ended");
    }, 4500);
  });


  /* ══════════════════════════════════════════════════════════
     5. MUSIC TOGGLE (mute / unmute)
  ══════════════════════════════════════════════════════════ */

  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch(() => {});
      musicToggle.classList.add("playing");
      musicToggle.classList.remove("muted");
      if (lyricsCard) lyricsCard.classList.remove("ended");
    } else {
      music.pause();
      musicToggle.classList.remove("playing");
      musicToggle.classList.add("muted");
    }
  });


  /* ══════════════════════════════════════════════════════════
     6. FLOATING HEARTS
  ══════════════════════════════════════════════════════════ */

  function spawnHeart() {
    if (!heartsBg) return;

    const heart    = document.createElement("i");
    const size     = Math.random() * 14 + 8;
    const duration = Math.random() * 6 + 9;

    heart.className               = "fa-solid fa-heart heart";
    heart.style.left              = `${Math.random() * 100}vw`;
    heart.style.fontSize          = `${size}px`;
    heart.style.opacity           = String(Math.random() * 0.35 + 0.2);
    heart.style.animationDuration = `${duration}s`;

    heartsBg.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
  }

  setInterval(spawnHeart, 1600);


  /* ══════════════════════════════════════════════════════════
     7. STAR FIELD (hero background)
  ══════════════════════════════════════════════════════════ */

  function buildStars() {
    const starsBg = document.getElementById("stars-bg");
    if (!starsBg) return;

    for (let i = 0; i < 120; i++) {
      const star     = document.createElement("div");
      const size     = Math.random() * 2.5 + 0.5;
      const duration = Math.random() * 4 + 2;
      const delay    = Math.random() * 6;

      star.className               = "star";
      star.style.left              = `${Math.random() * 100}vw`;
      star.style.top               = `${Math.random() * 100}vh`;
      star.style.width             = `${size}px`;
      star.style.height            = `${size}px`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay    = `${delay}s`;

      starsBg.appendChild(star);
    }
  }


  /* ══════════════════════════════════════════════════════════
     8. GALLERY LIGHTBOX
  ══════════════════════════════════════════════════════════ */

  function openLightbox(src, alt) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lbImg) return;
    lightbox.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".g-item img").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.alt || ""));
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });


  /* ══════════════════════════════════════════════════════════
     9. SCROLL REVEAL
     Elements fade & rise into view once, then stay visible.
  ══════════════════════════════════════════════════════════ */

  const REVEAL_SELECTORS = [
    ".section-head",
    ".g-item",
    ".v-item",
    ".t-item",
    ".letter-card",
    ".reply-card",
    ".reason-wrap",
    ".promise-item",
    ".poem-card",
    ".secret-center",
  ].join(", ");

  const revealTargets = document.querySelectorAll(REVEAL_SELECTORS);
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));


  /* ══════════════════════════════════════════════════════════
     10. POEM LINE REVEAL
     Each line fades in one after another as the card scrolls in.
  ══════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════
   10. POEM LINE REVEAL
   Lines appear one by one, staggered, as the card scrolls in.
══════════════════════════════════════════════════════════ */

const poemCard = document.querySelector(".poem-card");

if (poemCard) {
  // Convert any <br> tags into spacer spans so they don't break the stagger
  poemCard.querySelectorAll("br").forEach((br) => {
    const spacer = document.createElement("span");
    spacer.className = "poem-spacer";
    br.replaceWith(spacer);
  });

  const poemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {

          // Grab every line and the author credit
          const lines = entry.target.querySelectorAll(".poem-lines p, .poem-author");

          lines.forEach((line, i) => {
            // Stagger: each line waits a bit longer than the previous
            setTimeout(() => {
              line.classList.add("poem-visible");
            }, i * 50); // 50s between each line
          });

          poemObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 } // trigger when 15% of the card is visible
  );

  poemObserver.observe(poemCard);
}

  /* ══════════════════════════════════════════════════════════
     11. COUNT-UP TIMER
  ══════════════════════════════════════════════════════════ */

  function updateCountup() {
    let diff = Math.max(0, Date.now() - MET_DATE.getTime());

    const days  = Math.floor(diff / 86400000); diff -= days  * 86400000;
    const hours = Math.floor(diff / 3600000);  diff -= hours * 3600000;
    const mins  = Math.floor(diff / 60000);    diff -= mins  * 60000;
    const secs  = Math.floor(diff / 1000);

    if (cuDays)  cuDays.textContent  = days;
    if (cuHours) cuHours.textContent = String(hours).padStart(2, "0");
    if (cuMins)  cuMins.textContent  = String(mins).padStart(2, "0");
    if (cuSecs)  cuSecs.textContent  = String(secs).padStart(2, "0");
  }

  updateCountup();
  setInterval(updateCountup, 1000);


  /* ══════════════════════════════════════════════════════════
     12. TYPEWRITER (hero subtitle)
  ══════════════════════════════════════════════════════════ */

  let typeStarted = false;

  function startTypewriter() {
    if (typeStarted || !typeEl) return;
    typeStarted = true;

    let i = 0;
    (function type() {
      if (i <= HERO_QUOTE.length) {
        typeEl.textContent = HERO_QUOTE.slice(0, i);
        i++;
        setTimeout(type, 52);
      }
    })();
  }

  // Fallback: start after 4s if overlay is never clicked
  setTimeout(startTypewriter, 4000);


  /* ══════════════════════════════════════════════════════════
     13. FLIP CARD (Things I Love)
  ══════════════════════════════════════════════════════════ */

  let reasonIndex  = 0;
  let showingFront = true;

  if (reasonCard) {
    reasonCard.addEventListener("click", () => {
      reasonIndex = (reasonIndex + 1) % REASONS.length;

      if (showingFront) {
        if (reasonBack)  reasonBack.textContent  = REASONS[reasonIndex];
        if (reasonInner) reasonInner.classList.add("flipped");
      } else {
        if (reasonFront) reasonFront.textContent = REASONS[reasonIndex];
        if (reasonInner) reasonInner.classList.remove("flipped");
      }

      showingFront = !showingFront;
    });
  }


  /* ══════════════════════════════════════════════════════════
     14. POLAROID DRIFTING STRIP
  ══════════════════════════════════════════════════════════ */

  const galleryImgs = Array.from(document.querySelectorAll(".g-item img"));

  function buildPolaroid(img, index) {
    const baseAngle = index % 2 === 0 ? -3 : 3;
    const tilt      = (baseAngle + (Math.random() * 2 - 1)).toFixed(1) + "deg";
    const caption   = POLAROID_CAPTIONS[index % POLAROID_CAPTIONS.length];

    const wrapper   = document.createElement("div");
    wrapper.className = "polaroid";
    wrapper.style.setProperty("--tilt", tilt);

    const image     = document.createElement("img");
    image.src       = img.src;
    image.alt       = "memory";
    image.loading   = "lazy";

    const cap       = document.createElement("span");
    cap.textContent = caption;

    wrapper.appendChild(image);
    wrapper.appendChild(cap);
    return wrapper;
  }

  if (polaroidStrip && galleryImgs.length > 0) {
    galleryImgs.forEach((img, i) => polaroidStrip.appendChild(buildPolaroid(img, i)));
    galleryImgs.forEach((img, i) => polaroidStrip.appendChild(buildPolaroid(img, i)));
  }


  /* ══════════════════════════════════════════════════════════
     15. LEAVE A MESSAGE
     If Formspree is set up: emails message to you.
     Always saves to localStorage as a backup.
  ══════════════════════════════════════════════════════════ */

  function showSavedMessage(text) {
    if (!text || !text.trim()) return;
    if (replySaved)      replySaved.textContent = text;
    if (replySaved)      replySaved.classList.remove("hidden");
    if (replySavedLabel) replySavedLabel.classList.remove("hidden");
  }

  // Load any previously saved message
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing && replyInput) {
    replyInput.value = existing;
    showSavedMessage(existing);
  }

  if (messageForm) {
    // Formspree form — sends email to you + saves locally
    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = replyInput ? replyInput.value.trim() : "";
      if (!text) return;

      if (replyStatus) replyStatus.textContent = "Sending…";

      try {
        const res = await fetch(messageForm.action, {
          method:  "POST",
          body:    new FormData(messageForm),
          headers: { Accept: "application/json" },
        });

        localStorage.setItem(STORAGE_KEY, text);
        showSavedMessage(text);

        if (res.ok) {
          if (replyStatus) replyStatus.textContent = "Sent with love. ♥";
        } else {
          if (replyStatus) replyStatus.textContent = "Saved locally.";
        }
      } catch {
        localStorage.setItem(STORAGE_KEY, text);
        showSavedMessage(text);
        if (replyStatus) replyStatus.textContent = "Saved locally.";
      }

      setTimeout(() => {
        if (replyStatus) replyStatus.textContent = "";
      }, 3000);
    });

  } else {
    // Fallback: no form, just a save button
    const replySave = document.getElementById("reply-save");
    if (replySave) {
      replySave.addEventListener("click", () => {
        const text = replyInput ? replyInput.value.trim() : "";
        if (!text) return;
        localStorage.setItem(STORAGE_KEY, text);
        showSavedMessage(text);
        if (replyStatus) replyStatus.textContent = "Saved with love. ♥";
        setTimeout(() => {
          if (replyStatus) replyStatus.textContent = "";
        }, 2500);
      });
    }
  }


  /* ══════════════════════════════════════════════════════════
     16. SECRET HEART UNLOCK
     Click heart 5 times to reveal the hidden message.
  ══════════════════════════════════════════════════════════ */
let secretClicks = 0;
if (secretHeart) {
  secretHeart.addEventListener("click", () => {
    secretClicks++;
    const remaining = 5 - secretClicks;
    // Bounce animation on each click
    secretHeart.style.transform = "scale(1.5)";
    setTimeout(() => (secretHeart.style.transform = ""), 200);
    if (secretClicks >= 5) {
      // Force show regardless of any class or style conflicts
      if (secretMessage) {
        secretMessage.classList.remove("hidden");
        secretMessage.style.display = "block";
        secretMessage.style.opacity = "1";
      }
      if (secretCount) secretCount.textContent = "";
      // Burst of hearts when unlocked
      for (let i = 0; i < 8; i++) {
        setTimeout(spawnHeart, i * 120);
      }
    } else {
      if (secretCount) {
        secretCount.textContent = `${remaining} more click${remaining !== 1 ? "s" : ""}…`;
      }
    }
  });
}


  /* ══════════════════════════════════════════════════════════
     17. ROSE PETALS
     Fall when footer scrolls into view, stop when it leaves.
  ══════════════════════════════════════════════════════════ */

  let petalsActive = false;
  let petalTimer   = null;

  function spawnPetal() {
    if (!petalsBg) return;

    const petal    = document.createElement("span");
    const size     = Math.random() * 10 + 12;
    const duration = Math.random() * 4 + 5;

    petal.className               = "petal";
    petal.style.left              = `${Math.random() * 100}vw`;
    petal.style.width             = `${size}px`;
    petal.style.height            = `${size}px`;
    petal.style.animationDuration = `${duration}s`;

    petalsBg.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000);
  }

  const footer = document.querySelector(".footer");

  if (footer && petalsBg) {
    const petalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !petalsActive) {
            petalsActive = true;
            petalTimer   = setInterval(spawnPetal, 300);
          } else if (!entry.isIntersecting && petalsActive) {
            petalsActive = false;
            clearInterval(petalTimer);
          }
        });
      },
      { threshold: 0.15 }
    );

    petalObserver.observe(footer);
  }


  /* ══════════════════════════════════════════════════════════
     18. SONG / LYRICS SYNC
     Reads song's currentTime and cross-fades to the matching lyric.
  ══════════════════════════════════════════════════════════ */

  let lastLyric = "";

  music.addEventListener("timeupdate", () => {
    if (!lyricsLine) return;

    const currentTime = music.currentTime;
    let currentLyric  = LYRICS[0].text;

    for (const line of LYRICS) {
      if (currentTime >= line.time) currentLyric = line.text;
    }

    if (currentLyric !== lastLyric) {
      lastLyric = currentLyric;

      lyricsLine.style.opacity = "0";
      setTimeout(() => {
        lyricsLine.textContent   = currentLyric;
        lyricsLine.style.opacity = "1";
      }, 250);
    }
  });


}); // end DOMContentLoaded