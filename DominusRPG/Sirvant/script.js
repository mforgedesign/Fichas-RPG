/**
 * SIRVANT - Character Sheet
 * Interactive JavaScript
 */

(function () {
    'use strict';

    // ========================================
    // Anatomy Slider
    // ========================================

    class AnatomySlider {
        constructor(container) {
            this.container = container;
            this.handle = container.querySelector('#anatomyHandle');
            this.frontImage = container.querySelector('#anatomyFront');
            this.isDragging = false;
            this.position = 50; // percentage

            this.init();
        }

        init() {
            // Mouse events
            this.handle.addEventListener('mousedown', (e) => this.startDrag(e));
            this.container.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.endDrag());

            // Touch events
            this.handle.addEventListener('touchstart', (e) => this.startDrag(e));
            this.container.addEventListener('touchstart', (e) => this.startDrag(e));
            document.addEventListener('touchmove', (e) => this.drag(e));
            document.addEventListener('touchend', () => this.endDrag());

            // Set initial position
            this.updatePosition(50);
        }

        startDrag(e) {
            e.preventDefault();
            this.isDragging = true;
            this.container.style.cursor = 'grabbing';

            // Immediately update position on click/touch
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            this.calculatePosition(clientX);
        }

        drag(e) {
            if (!this.isDragging) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            this.calculatePosition(clientX);
        }

        calculatePosition(clientX) {
            const rect = this.container.getBoundingClientRect();
            let percentage = ((clientX - rect.left) / rect.width) * 100;

            // Clamp between 5 and 95
            percentage = Math.max(5, Math.min(95, percentage));

            this.updatePosition(percentage);
        }

        updatePosition(percentage) {
            this.position = percentage;
            this.handle.style.left = `${percentage}%`;
            this.frontImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        }

        endDrag() {
            this.isDragging = false;
            this.container.style.cursor = 'ew-resize';
        }
    }

    // ========================================
    // Scroll Animations
    // ========================================

    class ScrollAnimator {
        constructor() {
            this.elements = document.querySelectorAll('.animate-on-scroll');
            this.init();
        }

        init() {
            // Use Intersection Observer for performance
            const options = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, options);

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // Navigation Index
    // ========================================

    class NavigationIndex {
        constructor() {
            this.nav = document.querySelector('.nav-index');
            if (!this.nav) return;

            this.items = this.nav.querySelectorAll('.nav-index__item');
            this.sections = [];

            // Map nav items to sections
            this.items.forEach(item => {
                const sectionId = item.dataset.section;
                const section = document.getElementById(sectionId);
                if (section) {
                    this.sections.push({ item, section });
                }
            });

            this.init();
        }

        init() {
            // Click handlers
            this.items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const sectionId = item.dataset.section;
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Scroll spy
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const navItem = this.nav.querySelector(`[data-section="${entry.target.id}"]`);
                    if (navItem) {
                        if (entry.isIntersecting) {
                            this.items.forEach(item => item.classList.remove('active'));
                            navItem.classList.add('active');
                        }
                    }
                });
            }, {
                root: null,
                rootMargin: '-40% 0px -40% 0px',
                threshold: 0
            });

            this.sections.forEach(({ section }) => observer.observe(section));
        }
    }

    // ========================================
    // Header Scroll Effect
    // ========================================

    class HeaderScroll {
        constructor() {
            this.header = document.querySelector('.header');
            this.lastScroll = 0;

            if (this.header) {
                this.init();
            }
        }

        init() {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    this.header.style.background = 'rgba(248, 248, 248, 0.95)';
                    this.header.style.backdropFilter = 'blur(10px)';
                } else {
                    this.header.style.background = 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%)';
                    this.header.style.backdropFilter = 'none';
                }

                this.lastScroll = currentScroll;
            });
        }
    }

    // ========================================
    // Glitch Effect for Title (subtle)
    // ========================================

    class GlitchEffect {
        constructor(element) {
            this.element = element;
            if (!this.element) return;

            this.originalText = this.element.textContent;
            this.init();
        }

        init() {
            // Occasional subtle glitch
            setInterval(() => {
                if (Math.random() > 0.97) {
                    this.glitch();
                }
            }, 100);
        }

        glitch() {
            const glitchChars = '░▒▓█▄▀■□';
            const text = this.originalText.split('');
            const pos = Math.floor(Math.random() * text.length);
            const originalChar = text[pos];

            text[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            this.element.textContent = text.join('');

            setTimeout(() => {
                this.element.textContent = this.originalText;
            }, 50);
        }
    }

    // ========================================
    // Parallax for Hero Image (subtle)
    // ========================================

    class ParallaxEffect {
        constructor() {
            this.heroImage = document.querySelector('.hero__image-frame img');
            if (!this.heroImage) return;

            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.hero');

                if (heroSection && scrolled < window.innerHeight) {
                    const parallax = scrolled * 0.15;
                    this.heroImage.style.transform = `translateY(${parallax}px) scale(1.02)`;
                }
            });
        }
    }

    // ========================================
    // Line Drawing Animation for Decorative Lines
    // ========================================

    class LineDrawing {
        constructor() {
            this.lines = document.querySelectorAll('.deco-line line');
            this.init();
        }

        init() {
            this.lines.forEach(line => {
                const length = line.getTotalLength ? line.getTotalLength() : 1000;
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
                line.style.transition = 'stroke-dashoffset 2s ease-out';
            });

            // Trigger after page load
            setTimeout(() => {
                this.lines.forEach(line => {
                    line.style.strokeDashoffset = '0';
                });
            }, 300);
        }
    }

    // ========================================
    // Initialize Everything
    // ========================================

    document.addEventListener('DOMContentLoaded', () => {
        // Anatomy Slider
        const sliderContainer = document.getElementById('anatomySlider');
        if (sliderContainer) {
            new AnatomySlider(sliderContainer);
        }

        // Scroll Animations
        new ScrollAnimator();

        // Navigation Index
        new NavigationIndex();

        // Header Scroll Effect
        new HeaderScroll();

        // Glitch Effect
        const titleMain = document.querySelector('.hero__title-main');
        if (titleMain) {
            new GlitchEffect(titleMain);
        }

        // Parallax
        new ParallaxEffect();

        // Line Drawing
        new LineDrawing();

        // Mark hero elements as visible immediately
        document.querySelectorAll('.hero .animate-on-scroll').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 150);
        });

        console.log('✦ SIRVANT Character Sheet initialized');
    });

})();
