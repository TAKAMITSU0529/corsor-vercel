// Modern JavaScript for RIVET Website
// Professional-grade interactions and animations

class RivetWebsite {
    constructor() {
        this.init();
        this.bindEvents();
        this.initAnimations();
    }

    init() {
        this.nav = document.getElementById('nav-main');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.solutionTabs = document.querySelectorAll('.solution-tab');
        this.solutionItems = document.querySelectorAll('.solution-item');
        this.contactForm = document.getElementById('contact-form');
        this.isMenuOpen = false;
        this.currentSolution = 'ai';
    }

    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Navigation events
        this.navToggle?.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.smoothScroll.bind(this));
        });

        // Solution tabs
        this.solutionTabs.forEach(tab => {
            tab.addEventListener('click', this.switchSolution.bind(this));
        });

        // Contact form
        this.contactForm?.addEventListener('submit', this.handleFormSubmit.bind(this));

        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));

        // Intersection Observer for animations
        this.initIntersectionObserver();
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Navigation background effect
        if (scrollY > 50) {
            this.nav?.classList.add('scrolled');
        } else {
            this.nav?.classList.remove('scrolled');
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroPattern = hero.querySelector('.hero-pattern');
            if (heroPattern) {
                const speed = scrollY * 0.5;
                heroPattern.style.transform = `translateY(${speed}px)`;
            }
        }

        // Active navigation link highlighting
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.navMenu?.classList.add('active');
            this.navToggle?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.navMenu?.classList.remove('active');
            this.navToggle?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    smoothScroll(e) {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(target);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (this.isMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    switchSolution(e) {
        const targetSolution = e.currentTarget.getAttribute('data-target');
        
        if (targetSolution === this.currentSolution) return;

        // Update tabs
        this.solutionTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        // Update solution items with fade effect
        this.solutionItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add slight delay for smooth transition
        setTimeout(() => {
            const targetItem = document.querySelector(`[data-solution="${targetSolution}"]`);
            if (targetItem) {
                targetItem.classList.add('active');
            }
        }, 150);

        this.currentSolution = targetSolution;

        // Add visual feedback
        this.addRippleEffect(e.currentTarget, e);
    }

    addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 122, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = this.contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>送信中...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            this.showSuccessMessage();
            this.contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    validateForm(data) {
        const requiredFields = ['company', 'name', 'email', 'message'];
        const errors = [];

        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`${this.getFieldLabel(field)}は必須です`);
            }
        });

        // Email validation
        if (data.email && !this.isValidEmail(data.email)) {
            errors.push('有効なメールアドレスを入力してください');
        }

        if (errors.length > 0) {
            this.showErrorMessage(errors.join('\n'));
            return false;
        }

        return true;
    }

    getFieldLabel(field) {
        const labels = {
            company: '会社名',
            name: 'お名前',
            email: 'メールアドレス',
            message: 'お問い合わせ内容'
        };
        return labels[field] || field;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccessMessage() {
        this.showNotification('お問い合わせを送信いたしました。\n担当者より2営業日以内にご連絡いたします。', 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="notification-message">${message.replace(/\n/g, '<br>')}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#34C759' : '#FF3B30'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(450px);
            transition: transform 0.3s ease;
            font-family: var(--font-family-japanese);
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(450px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.service-card, .case-card, .solution-item, .value-item'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    initAnimations() {
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                margin-left: 12px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }

            .notification-close:hover {
                opacity: 1;
            }

            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .service-card,
            .case-card,
            .solution-item,
            .value-item {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }

            .service-card.animate-in,
            .case-card.animate-in,
            .solution-item.animate-in,
            .value-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .nav-menu.active {
                display: flex !important;
                position: fixed;
                top: 72px;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2rem;
                z-index: 999;
                animation: fadeIn 0.3s ease;
            }

            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .nav-link.active {
                color: var(--primary-color);
            }

            .nav-link.active::after {
                width: 100%;
            }

            /* Enhanced floating animations */
            .floating-card {
                animation-duration: 8s;
                animation-timing-function: ease-in-out;
                animation-iteration-count: infinite;
            }

            .floating-card:hover {
                animation-play-state: paused;
                transform: translateY(-10px) scale(1.05);
            }

            /* Hero stats counter animation */
            .hero-stats.animate-in .stat-number {
                animation: countUp 2s ease-out;
            }

            @keyframes countUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Gradient text animation */
            .gradient-text {
                background-size: 200% 200%;
                animation: gradientShift 3s ease-in-out infinite;
            }

            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
        `;
        document.head.appendChild(style);

        // Initialize hero stats animation
        this.initStatsAnimation();
        
        // Initialize floating cards enhanced animation
        this.initFloatingCards();
    }

    initStatsAnimation() {
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isPercentage = finalValue.includes('%');
            const isPlus = finalValue.includes('+');
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            let currentValue = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(currentValue);
                if (isPercentage) displayValue += '%';
                if (isPlus) displayValue += '+';
                
                stat.textContent = displayValue;
            }, 40);
        });
    }

    initFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.animationPlayState = 'paused';
                card.style.transform = 'translateY(-10px) scale(1.05)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.animationPlayState = 'running';
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    // Utility method to debounce function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the website class
    new RivetWebsite();
    
    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Initialize any heavy animations after load
        setTimeout(() => {
            document.querySelectorAll('.hero-stats').forEach(el => {
                el.classList.add('ready');
            });
        }, 500);
    });
});

// Add CSS for page loading state
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body:not(.loaded) .hero-content {
        opacity: 0;
        transform: translateY(30px);
    }
    
    body.loaded .hero-content {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s ease-out;
    }
    
    .hero-stats:not(.ready) .stat-number {
        opacity: 0;
    }
    
    .hero-stats.ready .stat-number {
        opacity: 1;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(loadingStyles);

// Export for potential external use
window.RivetWebsite = RivetWebsite;