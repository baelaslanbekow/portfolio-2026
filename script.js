const terminalLines = [
    "> Инициализация ядра системы...",
    "> Загрузка нейронных сетей... [УСПЕШНО]",
    "> Сканирование личного дела: Асланбеков Б.А.",
    "> Проверка протоколов безопасности... OK",
    "> Проверка гражданства: КЫРГЫЗСКАЯ РЕСПУБЛИКА",
    "> Статус объекта: Software Engineer & AI Architect",
    "> ДОСТУП РАЗРЕШЕН",
    "> Добро пожаловать, Баель Асланбекович."
];

async function runTerminal() {
    const container = document.getElementById('terminal-content');
    const overlay = document.getElementById('terminal-overlay');

    if (!container || !overlay) return;

    for (let i = 0; i < terminalLines.length; i++) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerText = terminalLines[i];
        container.appendChild(line);

        await new Promise(r => setTimeout(r, 150));
        line.classList.add('active');

        await new Promise(r => setTimeout(r, 450));
    }

    await new Promise(r => setTimeout(r, 1200));
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 1s ease-out';

    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 1000);
}

// Intersection Observer for scroll reveal
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    runTerminal();

    // Observe sections
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Profile Card Mouse Move Effect
    const bioCard = document.querySelector('.bio-card');
    if (bioCard) {
        bioCard.addEventListener('mousemove', (e) => {
            const rect = bioCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            bioCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        bioCard.addEventListener('mouseleave', () => {
            bioCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
});
