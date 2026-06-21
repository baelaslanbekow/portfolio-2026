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
        initialDelay: 400,
        lineDelay: 80,
        defaultPause: 500,
        successPause: 350,
        fadeOutDelay: 900,
        hideDelay: 800,
        lines: [
            { text: '> Запуск BAEL_OS v3.0 [LUXE]...', type: '' },
            { text: '> Загрузка нейронных модулей...', type: '' },
            { text: '  [kernel]   neural_core.onnx        ', type: 'success', append: 'OK' },
            { text: '  [module]   jarvis_voice_engine      ', type: 'success', append: 'OK' },
            { text: '  [agent]    azamat_sales_agent       ', type: 'success', append: 'OK' },
            { text: '> Проверка личности: Асланбеков Б.А.', type: '' },
            { text: '> Статус системы: ONLINE', type: 'success' },
            { text: '> Добро пожаловать, сэр.', type: 'success' },
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
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
    },
    parallax: {
        depthStep: 6,
        throttleMs: 16,
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
    throttle(fn, ms) {
        let t = 0;
        return (...args) => {
            const now = Date.now();
            if (now - t >= ms) {
                t = now;
                fn(...args);
            }
        };
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
    async run() {
        const overlay = utils.$(CONFIG.selectors.terminalOverlay);
        const container = utils.$(CONFIG.selectors.terminalLines);
        if (!overlay || !container) return;
        document.body.style.overflow = 'hidden';
        await utils.delay(CONFIG.boot.initialDelay);
        for (const line of CONFIG.boot.lines) {
            await this.renderLine(container, line);
        }
        await this.hide(overlay);
        App.startAnimations();
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
    init() {
        const items = document.querySelectorAll(CONFIG.selectors.reveal);
        if (!items.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            });
        }, CONFIG.scrollReveal);
        items.forEach((el) => obs.observe(el));
    },
};

const Parallax = {
    init() {
        if (!utils.$(CONFIG.selectors.hero)) return;
        const targets = [...document.querySelectorAll(CONFIG.selectors.parallaxTargets)];
        if (!targets.length) return;
        document.addEventListener('mousemove', utils.throttle((e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            targets.forEach((el, i) => {
                const d = (i + 1) * CONFIG.parallax.depthStep;
                el.style.transform = `translate(${dx * d}px, ${dy * d}px)`;
            });
        }, CONFIG.parallax.throttleMs));
    },
};

const MagneticButtons = {
    init() {
        const { strength, scale } = CONFIG.magnetic;
        document.querySelectorAll(CONFIG.selectors.magneticButtons).forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(${scale})`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    },
};

const CardTilt = {
    init() {
        const { perspective, maxRotation, hoverScale } = CONFIG.tilt;
        document.querySelectorAll(CONFIG.selectors.tiltCards).forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const ry = ((e.clientX - r.left) / r.width - 0.5) * maxRotation;
                const rx = ((e.clientY - r.top) / r.height - 0.5) * -maxRotation;
                card.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${hoverScale})`;
            });
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
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                stats.forEach((el) => this.count(el));
                obs.disconnect();
            });
        }, { threshold: 0.4 });
        obs.observe(card);
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            card.style.setProperty('--mx', `${x}%`);
            card.style.setProperty('--my', `${y}%`);
        });
    },
    count(el) {
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
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
            card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
        });
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
    init() {
        BootSequence.run();
    },
    startAnimations() {
        ScrollReveal.init();
        Parallax.init();
        MagneticButtons.init();
        CardTilt.init();
        SmoothScroll.init();
        DistProject.init();
        MlProject.init();
        Typewriter.init();
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());