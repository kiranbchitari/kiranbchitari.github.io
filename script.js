document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const lightModeClass = 'light-mode';

    function setThemeToggleState(isLightMode) {
        if (!themeToggle) return;
        themeToggle.setAttribute('aria-pressed', String(isLightMode));
        themeToggle.setAttribute('aria-label', isLightMode ? 'Switch to dark mode' : 'Switch to light mode');
    }

    setThemeToggleState(document.body.classList.contains(lightModeClass));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLightMode = document.body.classList.toggle(lightModeClass);
            try {
                localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            } catch (e) { /* storage unavailable */ }
            setThemeToggleState(isLightMode);
        });
    }

    // 2. Typing animation
    const typingText = document.getElementById('typing-text');
    const roles = [
        'Technical Lead',
        '.NET Backend Developer',
        'AI & LLM Enthusiast',
        'System Design Engineer'
    ];

    if (typingText) {
        if (reduceMotion) {
            typingText.textContent = roles[0];
        } else {
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            const type = () => {
                const currentRole = roles[roleIndex];
                let delay;

                if (isDeleting) {
                    charIndex--;
                    delay = 40;
                } else {
                    charIndex++;
                    delay = 85;
                }
                typingText.textContent = currentRole.substring(0, charIndex);

                if (!isDeleting && charIndex === currentRole.length) {
                    isDeleting = true;
                    delay = 2000;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    delay = 450;
                }

                setTimeout(type, delay);
            };

            setTimeout(type, 700);
        }
    }

    // 3. Navbar state and active link
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let ticking = false;

    function updateOnScroll() {
        ticking = false;

        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 8);
        }

        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - window.innerHeight / 3) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', Boolean(current) && link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateOnScroll);
        }
    }, { passive: true });
    updateOnScroll();

    // 4. Scroll reveal, staggered for items that enter together
    const revealElements = document.querySelectorAll('.reveal, .reveal-delay');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            let order = 0;
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                setTimeout(() => el.classList.add('active'), order * 90);
                order++;
                observer.unobserve(el);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 5. Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    function setMenuOpen(isOpen) {
        mobileMenuBtn.classList.toggle('active', isOpen);
        navLinksContainer.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            setMenuOpen(!navLinksContainer.classList.contains('active'));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('dropdown-toggle')) {
                    setMenuOpen(false);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        });
    }

    // The "Privacy" label only opens its submenu, it is not a link
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => e.preventDefault());
    });
});
