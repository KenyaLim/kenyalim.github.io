window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; initGSAP(); }, 800);
    }, 1000);
});

document.getElementById('year').textContent = new Date().getFullYear();

const cursor = document.getElementById('custom-cursor');
if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });

    const hoverElements = document.querySelectorAll('a, button, .cursor-pointer');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

const canvas = document.getElementById('garden-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const emojis = ['🍓', '🍵', '🍃', '✨', '🌸'];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, isBurst = false) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * -height;
        this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
        this.size = Math.random() * 20 + 10;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 4 - 2;
        if (isBurst) {
            this.speedY = (Math.random() - 0.5) * 10;
            this.speedX = (Math.random() - 0.5) * 10;
            this.size = Math.random() * 30 + 20;
        }
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 50) * 0.5;
        this.angle += this.spin;
        if (this.speedY < 3) this.speedY += 0.05;
        if (this.y > height + 50) {
            this.y = -50;
            this.x = Math.random() * width;
            this.speedY = Math.random() * 1 + 0.5;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.font = `${this.size}px Arial`;
        ctx.globalAlpha = 0.6;
        ctx.fillText(this.emoji, 0, 0);
        ctx.restore();
    }
}

for (let i = 0; i < 30; i++) { particles.push(new Particle()); }

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

function createBurst(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    cursor.style.transform = `translate(calc(${clientX}px - 50%), calc(${clientY}px - 50%)) scale(1.5)`;
    setTimeout(() => {
        cursor.style.transform = `translate(calc(${clientX}px - 50%), calc(${clientY}px - 50%)) scale(1)`;
    }, 100);
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(clientX, clientY, true));
    }
    if (particles.length > 100) particles.splice(0, particles.length - 30);
}
window.addEventListener('click', createBurst);
window.addEventListener('touchstart', createBurst);

function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".gsap-hero > *", { y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: "back.out(1.7)" });
    gsap.from(".gsap-fade-up > *", {
        scrollTrigger: { trigger: "#skills", start: "top 85%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1
    });
    gsap.from(".gsap-stagger > div", {
        scrollTrigger: { trigger: ".gsap-stagger", start: "top 80%" },
        y: 100, opacity: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)"
    });
    gsap.utils.toArray('.gsap-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: "top 85%" },
            y: 80, opacity: 0, duration: 1, scale: 0.95, ease: "power4.out"
        });
    });
}

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            gsap.from("#mobile-menu a", { y: 20, opacity: 0, duration: 0.4, stagger: 0.1 });
        } else {
            menu.classList.add('hidden');
        }
    });
}
