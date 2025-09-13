// Mobile Navigation
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});

// Image Carousel Class
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.slides = element.querySelectorAll('.carousel-slide');
        this.dots = element.querySelectorAll('.carousel-dot');
        this.currentSlide = 0;
        this.autoPlayInterval = null;

        this.initCarousel();
    }

    initCarousel() {
        // Add click events to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Add swipe events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Start autoplay
        this.startAutoPlay();

        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        this.currentSlide = index;

        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }

    previousSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// Initialize carousels when page loads
// Product Gallery
class ProductGallery {
    constructor() {
        this.mainImage = document.getElementById('main-image');
        this.thumbnails = document.querySelectorAll('.thumb');
        this.zoomOverlay = document.querySelector('.zoom-overlay');
        
        if (this.mainImage && this.thumbnails.length > 0) {
            this.initGallery();
        }
    }

    initGallery() {
        // Thumbnail click handling
        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                this.mainImage.src = thumb.getAttribute('data-image');
                this.mainImage.classList.add('fade');
                setTimeout(() => this.mainImage.classList.remove('fade'), 300);
            });
        });

        // Zoom functionality
        if (this.zoomOverlay) {
            this.mainImage.addEventListener('mousemove', (e) => this.handleZoom(e));
            this.mainImage.addEventListener('mouseleave', () => this.resetZoom());
        }
    }

    handleZoom(e) {
        const { left, top, width, height } = this.mainImage.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        
        this.mainImage.style.transformOrigin = `${x}% ${y}%`;
        this.mainImage.style.transform = 'scale(2)';
    }

    resetZoom() {
        this.mainImage.style.transformOrigin = 'center';
        this.mainImage.style.transform = 'scale(1)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));
    
    // Initialize product gallery if on product detail page
    new ProductGallery();

    // Initialize stats counter animation
    const stats = document.querySelectorAll('.stat-item h3');
    if (stats.length > 0) {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const value = parseInt(target.getAttribute('data-value')) || 0;
                    animateValue(target, 0, value, 2000);
                    observer.unobserve(target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.5
        });

        stats.forEach(stat => observer.observe(stat));
    }
});

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.getAttribute('data-suffix') || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            document.querySelector('.nav-links')?.classList.remove('active');
            document.querySelector('.hamburger')?.classList.remove('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
});