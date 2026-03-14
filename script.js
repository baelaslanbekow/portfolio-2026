/* ============================
   Bael OS — JavaScript Engine
   ============================ */

// ── 1. TERMINAL LOADER ──────────────────────────
const bootLines = [
    { text: "> Запуск BAEL_OS v3.0 [LUXE]...", type: "" },
    { text: "> Загрузка нейронных модулей...", type: "" },
    { text: '  [kernel]   neural_core.onnx        ', type: "success", append: "OK" },
    { text: '  [module]   jarvis_voice_engine      ', type: "success", append: "OK" },
    { text: '  [agent]    azamat_sales_agent       ', type: "success", append: "OK" },
    { text: "> Проверка личности: Асланбеков Б.А.", type: "" },
    { text: "> Статус системы: ONLINE", type: "success" },
    { text: "> Добро пожаловать, сэр.", type: "success" },
];

async function runBootSequence() {
    document.body.style.overflow = "hidden";
    const container = document.getElementById("terminal-lines");
    const overlay = document.getElementById("terminal-overlay");

    await delay(400);

    for (const item of bootLines) {
        const el = document.createElement("div");
        el.className = `t-line ${item.type}`;
        el.innerHTML = item.append
            ? `<span class="t-label">${item.text}</span><span class="${item.type}">${item.append}</span>`
            : item.text;
        container.appendChild(el);

        await delay(80);
        el.classList.add("active");
        await delay(item.type === "success" ? 350 : 500);
    }

    await delay(900);
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";

    setTimeout(() => {
        overlay.style.display = "none";
        document.body.style.overflow = "";
        initAnimations();
    }, 800);
}

// ── 2. AI TERMINAL BAR TYPEWRITER ────────────────
const phrases = [
    "Initializing Jarvis voice engine...  Done.",
    "Azamat Sales Agent: status ONLINE.",
    "Running neural inference... OK.",
    "Scanning project portfolio...",
    "Bael_OS ready. All systems nominal.",
];

let phraseIdx = 0, charIdx = 0, isDeleting = false;
const termEl = document.getElementById("terminal-text");

function typeLoop() {
    const phrase = phrases[phraseIdx];
    if (!isDeleting) {
        charIdx++;
    } else {
        charIdx--;
    }
    if (termEl) termEl.textContent = phrase.slice(0, charIdx);

    let speed = isDeleting ? 35 : 60;

    if (!isDeleting && charIdx === phrase.length) {
        speed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
    }

    setTimeout(typeLoop, speed);
}

// ── 3. SCROLL REVEAL ─────────────────────────────
function initScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach((el) => obs.observe(el));
}

// ── 4. MOUSE PARALLAX ────────────────────────────
function initParallax() {
    const hero = document.getElementById("hero");
    if (!hero) return;

    document.addEventListener("mousemove", (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        const floatEls = document.querySelectorAll(".hero-name, .hero-status, .ai-terminal-bar");
        floatEls.forEach((el, i) => {
            const depth = (i + 1) * 6;
            el.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
        });
    });
}

// ── 5. MAGNETIC BUTTONS (Wow-effect) ─────────────
function initMagneticButtons() {
    document.querySelectorAll(".btn-primary, .btn-secondary, .contact-btn").forEach((btn) => {
        // Add magnetic wrapper if missing
        if (!btn.parentElement.classList.contains('magnetic-wrap')) {
            const wrap = document.createElement("div");
            wrap.className = "magnetic-wrap";
            btn.parentNode.insertBefore(wrap, btn);
            wrap.appendChild(btn);
        }

        const wrap = btn.parentElement;

        wrap.addEventListener("mousemove", (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });

        wrap.addEventListener("mouseleave", () => {
            btn.style.transform = `translate(0px, 0px) scale(1)`;
        });
    });
}

// ── 6. CARD TILT (Bento motion) ──────────────────
function initCardTilt() {
    document.querySelectorAll(".project-card, .trust-card, .skill-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
            card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

// ── 7. SMOOTH ANCHOR SCROLL ──────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const target = document.querySelector(a.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

// ── HELPERS ──────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function initAnimations() {
    initScrollReveal();
    initParallax();
    initMagneticButtons();
    initCardTilt();
    initSmoothScroll();
    typeLoop();
}

// ── BOOT ─────────────────────────────────────────
window.addEventListener("DOMContentLoaded", runBootSequence);
