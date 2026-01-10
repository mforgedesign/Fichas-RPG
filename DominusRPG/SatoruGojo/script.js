/**
 * SATORU GOJO - Character Sheet
 * Interactive JavaScript
 */

(function () {
    'use strict';

    // ========================================
    // Image Carousel with Ethereal Circle
    // ========================================

    class Carousel {
        constructor() {
            this.carousel = document.getElementById('carousel');
            this.control = document.getElementById('carouselControl');
            if (!this.carousel || !this.control) return;

            this.slides = this.carousel.querySelectorAll('.carousel__slide');
            this.dots = this.control.querySelectorAll('.carousel__dot');
            this.progress = this.control.querySelector('.carousel__circle-progress');
            this.currentIndex = 0;
            this.interval = null;
            this.duration = 5000; // 5 seconds per slide
            this.circumference = 2 * Math.PI * 45; // radius = 45

            this.init();
        }

        init() {
            if (this.slides.length === 0) return;

            // Set up progress circle
            if (this.progress) {
                this.progress.style.strokeDasharray = this.circumference;
                this.progress.style.strokeDashoffset = this.circumference;
            }

            // Start auto-play
            this.startAutoPlay();

            // Click to advance
            this.control.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });

            // Touch support
            let touchStartX = 0;
            this.carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            this.carousel.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                    this.resetAutoPlay();
                }
            }, { passive: true });
        }

        goTo(index) {
            // Remove active from current
            this.slides[this.currentIndex].classList.remove('active');
            this.dots[this.currentIndex].classList.remove('active');

            // Update index
            this.currentIndex = index;
            if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
            if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;

            // Add active to new
            this.slides[this.currentIndex].classList.add('active');
            this.dots[this.currentIndex].classList.add('active');

            // Reset progress
            this.animateProgress();
        }

        next() {
            this.goTo(this.currentIndex + 1);
        }

        prev() {
            this.goTo(this.currentIndex - 1);
        }

        animateProgress() {
            if (!this.progress) return;

            // Reset
            this.progress.style.transition = 'none';
            this.progress.style.strokeDashoffset = this.circumference;

            // Force reflow
            this.progress.getBoundingClientRect();

            // Animate
            this.progress.style.transition = `stroke-dashoffset ${this.duration}ms linear`;
            this.progress.style.strokeDashoffset = '0';
        }

        startAutoPlay() {
            this.animateProgress();
            this.interval = setInterval(() => {
                this.next();
            }, this.duration);
        }

        resetAutoPlay() {
            clearInterval(this.interval);
            this.startAutoPlay();
        }
    }

    // ========================================
    // Sidebar Navigation
    // ========================================

    class Sidebar {
        constructor() {
            this.sidebar = document.getElementById('sidebar');
            if (!this.sidebar) return;

            this.items = this.sidebar.querySelectorAll('.sidebar__item');
            this.sections = [];
            this.hideTimeout = null;
            this.isVisible = false;
            this.lastScrollY = 0;
            this.hasScrolled = false;

            // Map items to sections
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
            // Show on scroll, hide after inactivity
            window.addEventListener('scroll', () => {
                const currentScrollY = window.pageYOffset;

                // Only show after first scroll past threshold
                if (currentScrollY > 100) {
                    this.show();
                    this.resetHideTimer();
                    this.hasScrolled = true;
                } else if (!this.hasScrolled) {
                    this.hide();
                }

                this.lastScrollY = currentScrollY;
            });

            // Keep visible on hover
            this.sidebar.addEventListener('mouseenter', () => {
                clearTimeout(this.hideTimeout);
            });

            this.sidebar.addEventListener('mouseleave', () => {
                this.resetHideTimer();
            });

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
            this.setupScrollSpy();
        }

        show() {
            this.sidebar.classList.add('visible');
            this.isVisible = true;
        }

        hide() {
            this.sidebar.classList.remove('visible');
            this.isVisible = false;
        }

        resetHideTimer() {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, 3000); // Hide after 3 seconds of no scrolling
        }

        setupScrollSpy() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const navItem = this.sidebar.querySelector(`[data-section="${entry.target.id}"]`);
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
    // Glitch Effect
    // ========================================

    class GlitchEffect {
        constructor() {
            this.elements = document.querySelectorAll('.glitch-text');
            this.glitchChars = '0123456789ABCDEF_-';

            this.elements.forEach(el => {
                this.setupGlitch(el);
            });
        }

        setupGlitch(element) {
            const originalText = element.textContent;

            setInterval(() => {
                if (Math.random() > 0.97) {
                    this.applyGlitch(element, originalText);
                }
            }, 100);
        }

        applyGlitch(element, originalText) {
            const text = originalText.split('');
            const numGlitches = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < numGlitches; i++) {
                const pos = Math.floor(Math.random() * text.length);
                if (text[pos] !== ' ') {
                    text[pos] = this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                }
            }

            element.textContent = text.join('');

            setTimeout(() => {
                element.textContent = originalText;
            }, 50);
        }
    }

    // ========================================
    // Scroll Animations
    // ========================================

    class ScrollAnimator {
        constructor() {
            // Add animation class to elements
            const selectors = [
                '.section__header',
                '.data-card',
                '.anatomy-block',
                '.anatomy-details',
                '.anatomy-warning',
                '.energy-block',
                '.energy-property',
                '.eyes-intro',
                '.eyes-capability',
                '.eyes-warning',
                '.gimmick-card',
                '.domain-section',
                '.weakness',
                '.history-fragment',
                '.history-block',
                '.history-quote',
                '.history-seal'
            ];

            const elements = document.querySelectorAll(selectors.join(', '));
            elements.forEach(el => el.classList.add('animate-on-scroll'));

            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Stagger animation
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 50);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            });

            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // Header Scroll Effect
    // ========================================

    class HeaderScroll {
        constructor() {
            this.header = document.querySelector('.header');
            if (!this.header) return;

            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    this.header.style.background = 'rgba(5, 5, 5, 0.95)';
                    this.header.style.backdropFilter = 'blur(10px)';
                } else {
                    this.header.style.background = 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%)';
                    this.header.style.backdropFilter = 'none';
                }
            });
        }
    }

    // ========================================
    // Line Drawing Animation
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
        // Carousel
        new Carousel();

        // Sidebar
        new Sidebar();

        // Glitch Effect
        new GlitchEffect();

        // Scroll Animations
        new ScrollAnimator();

        // Header Scroll
        new HeaderScroll();

        // Line Drawing
        new LineDrawing();

        console.log('SATORU GOJO Character Sheet initialized');
    });

})();
