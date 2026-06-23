const CONFIG = {
    selectors: {
        terminalOverlay: '#terminal-overlay',
        terminalLines: '#terminal-lines',
        terminalText: '#terminal-text',
        hero: '#hero',
        reveal: '.reveal',
        parallaxTargets: '.hero-name, .hero-status, .ai-terminal-bar',
        magneticButtons: '.btn-primary, .btn-secondary, .contact-btn',
        tiltCards: '.project-card:not(.project-card--dist):not(.project-card--ml), .trust-card, .skill-card',
        distCard: '.project-card--dist',
        distStat: '.dist-stat-val',
        mlCard: '.project-card--ml',
        mlStream: '.ml-console-line--stream',
        anchorLinks: 'a[href^="#"]',
    },
    boot: {
        storageKey: 'bael_boot_seen',
        initialDelay: 120,
        lineDelay: 35,
        defaultPause: 140,
        successPause: 90,
        fadeOutDelay: 280,
        hideDelay: 180,
        lines: [
            { text: '> Запуск BAEL_OS v3.0...', type: '' },
            { text: '  [kernel]   neural_core.onnx        ', type: 'success', append: 'OK' },
            { text: '  [agent]    azamat_sales_agent       ', type: 'success', append: 'OK' },
            { text: '> Статус системы: ONLINE', type: 'success' },
        ],
    },
    typewriter: {
        phrases: [
            'Initializing Jarvis voice engine...  Done.',
            'Azamat Sales Agent: status ONLINE.',
            'Running neural inference... OK.',
            'Scanning project portfolio...',
            'Bael_OS ready. All systems nominal.',
        ],
        typingSpeed: 60,
        deletingSpeed: 35,
        pauseBeforeDelete: 2200,
        pauseBeforeNext: 400,
    },
    scrollReveal: {
        threshold: 0.05,
        rootMargin: '0px 0px 0px 0px',
    },
    parallax: {
        depthStep: 5,
    },
    magnetic: {
        strength: 0.3,
        scale: 1.05,
    },
    tilt: {
        perspective: 1000,
        maxRotation: 10,
        hoverScale: 1.02,
    },
};

const utils = {
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    rafThrottle(fn) {
        let scheduled = false;
        let lastArgs;
        return (...args) => {
            lastArgs = args;
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                fn(...lastArgs);
            });
        };
    },
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    canUseFinePointer() {
        return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    },
    $(sel, root = document) {
        return root.querySelector(sel);
    },
    el(tag, cls, text = '') {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text) node.textContent = text;
        return node;
    },
};

const BootSequence = {
    shouldRun() {
        if (utils.prefersReducedMotion()) return false;
        try {
            return !sessionStorage.getItem(CONFIG.boot.storageKey);
        } catch {
            return false;
        }
    },
    skip(overlay) {
        if (!overlay) return;
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        document.body.style.overflow = '';
    },
    async run() {
        const overlay = utils.$(CONFIG.selectors.terminalOverlay);
        const container = utils.$(CONFIG.selectors.terminalLines);

        App.startAnimations();

        if (!overlay || !container || !this.shouldRun()) {
            this.skip(overlay);
            return;
        }

        try {
            sessionStorage.setItem(CONFIG.boot.storageKey, '1');
        } catch {}

        document.body.style.overflow = 'hidden';
        await utils.delay(CONFIG.boot.initialDelay);
        for (const line of CONFIG.boot.lines) {
            await this.renderLine(container, line);
        }
        await this.hide(overlay);
    },
    async renderLine(container, line) {
        const cls = ['t-line', line.type].filter(Boolean).join(' ');
        const row = utils.el('div', cls);
        if (line.append) {
            row.append(
                utils.el('span', 't-label', line.text),
                utils.el('span', line.type, line.append),
            );
        } else {
            row.textContent = line.text;
        }
        container.appendChild(row);
        await utils.delay(CONFIG.boot.lineDelay);
        row.classList.add('active');
        await utils.delay(line.type === 'success' ? CONFIG.boot.successPause : CONFIG.boot.defaultPause);
    },
    async hide(overlay) {
        await utils.delay(CONFIG.boot.fadeOutDelay);
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        await utils.delay(CONFIG.boot.hideDelay);
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    },
};

const Typewriter = {
    idx: 0,
    pos: 0,
    deleting: false,
    init() {
        this.el = utils.$(CONFIG.selectors.terminalText);
        if (!this.el) return;
        this.tick();
    },
    tick() {
        const { phrases, typingSpeed, deletingSpeed, pauseBeforeDelete, pauseBeforeNext } = CONFIG.typewriter;
        const phrase = phrases[this.idx];
        this.pos += this.deleting ? -1 : 1;
        this.el.textContent = phrase.slice(0, this.pos);
        let wait = this.deleting ? deletingSpeed : typingSpeed;
        if (!this.deleting && this.pos === phrase.length) {
            wait = pauseBeforeDelete;
            this.deleting = true;
        } else if (this.deleting && this.pos === 0) {
            wait = pauseBeforeNext;
            this.deleting = false;
            this.idx = (this.idx + 1) % phrases.length;
        }
        setTimeout(() => this.tick(), wait);
    },
};

const ScrollReveal = {
    reveal(el, obs) {
        if (el.classList.contains('visible')) return;
        el.classList.add('visible');
        if (obs) obs.unobserve(el);
    },
    inViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.94 && rect.bottom > 0;
    },
    init() {
        const items = document.querySelectorAll(CONFIG.selectors.reveal);
        if (!items.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) this.reveal(e.target, obs);
            });
        }, CONFIG.scrollReveal);
        items.forEach((el) => {
            obs.observe(el);
            if (this.inViewport(el)) this.reveal(el, obs);
        });
        window.addEventListener('load', () => {
            items.forEach((el) => {
                if (this.inViewport(el)) this.reveal(el, obs);
            });
        }, { once: true });
    },
};

const Parallax = {
    init() {
        if (!utils.canUseFinePointer() || utils.prefersReducedMotion()) return;
        if (!utils.$(CONFIG.selectors.hero)) return;
        const targets = [...document.querySelectorAll(CONFIG.selectors.parallaxTargets)];
        if (!targets.length) return;
        document.addEventListener('mousemove', utils.rafThrottle((e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            targets.forEach((el, i) => {
                const d = (i + 1) * CONFIG.parallax.depthStep;
                el.style.transform = `translate3d(${dx * d}px, ${dy * d}px, 0)`;
            });
        }), { passive: true });
    },
};

const MagneticButtons = {
    init() {
        if (!utils.canUseFinePointer() || utils.prefersReducedMotion()) return;
        const { strength, scale } = CONFIG.magnetic;
        document.querySelectorAll(CONFIG.selectors.magneticButtons).forEach((btn) => {
            const move = utils.rafThrottle((e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0) scale(${scale})`;
            });
            btn.addEventListener('mousemove', move, { passive: true });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    },
};

const CardTilt = {
    init() {
        if (!utils.canUseFinePointer() || utils.prefersReducedMotion()) return;
        const { perspective, maxRotation, hoverScale } = CONFIG.tilt;
        document.querySelectorAll(CONFIG.selectors.tiltCards).forEach((card) => {
            const move = utils.rafThrottle((e) => {
                const r = card.getBoundingClientRect();
                const ry = ((e.clientX - r.left) / r.width - 0.5) * maxRotation;
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -maxRotation;
                card.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${hoverScale})`;
            });
            card.addEventListener('mousemove', move, { passive: true });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    },
};

const DistProject = {
    init() {
        const card = utils.$(CONFIG.selectors.distCard);
        if (!card) return;
        const stats = card.querySelectorAll(CONFIG.selectors.distStat);
        if (!stats.length) return;
        const runStats = () => stats.forEach((el) => this.count(el));
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                runStats();
                obs.disconnect();
            });
        }, { threshold: 0.15, rootMargin: '0px 0px 10% 0px' });
        obs.observe(card);
        requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) runStats();
        });
        setTimeout(() => {
            stats.forEach((el) => {
                if (el.dataset.done) return;
                el.textContent = (+el.dataset.target).toLocaleString('ru-RU');
            });
        }, 2200);
        if (!utils.canUseFinePointer()) return;
        const move = utils.rafThrottle((e) => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            card.style.setProperty('--mx', `${x}%`);
            card.style.setProperty('--my', `${y}%`);
        });
        card.addEventListener('mousemove', move, { passive: true });
    },
    count(el) {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const target = +el.dataset.target;
        const dur = 1400;
        const t0 = performance.now();
        const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * ease).toLocaleString('ru-RU');
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    },
};

const MlProject = {
    tokens: [
        'streaming tokens...',
        'context retrieved ✓',
        'generating response...',
        'latency <200ms',
    ],
    idx: 0,
    init() {
        const card = utils.$(CONFIG.selectors.mlCard);
        const stream = utils.$(CONFIG.selectors.mlStream);
        if (!card || !stream) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                this.type(stream);
                obs.disconnect();
            });
        }, { threshold: 0.35 });
        obs.observe(card);
        if (!utils.canUseFinePointer()) return;
        const move = utils.rafThrottle((e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
            card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
        });
        card.addEventListener('mousemove', move, { passive: true });
    },
    type(el) {
        const text = this.tokens[this.idx];
        let i = 0;
        el.textContent = '';
        const step = () => {
            if (i <= text.length) {
                el.textContent = text.slice(0, i++);
                setTimeout(step, 45);
            } else {
                setTimeout(() => {
                    this.idx = (this.idx + 1) % this.tokens.length;
                    this.type(el);
                }, 1800);
            }
        };
        step();
    },
};

const SmoothScroll = {
    init() {
        document.querySelectorAll(CONFIG.selectors.anchorLinks).forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = utils.$(link.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    },
};

const App = {
    started: false,
    init() {
        BootSequence.run();
    },
    startAnimations() {
        if (this.started) return;
        this.started = true;
        ScrollReveal.init();
        SmoothScroll.init();
        DistProject.init();
        MlProject.init();
        Typewriter.init();
        requestAnimationFrame(() => {
            Parallax.init();
            MagneticButtons.init();
            CardTilt.init();
        });
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());