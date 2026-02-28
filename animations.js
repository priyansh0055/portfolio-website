document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that have the .js-scroll class
    const scrollElements = document.querySelectorAll('.js-scroll');

    // Configure the observer. We want the element to trigger quite early.
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before the element hits the bottom
        threshold: 0.1 // 10% of the element must be visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            // Once the element intersects the viewport
            if (entry.isIntersecting) {
                // Apply a delay if specified in data-delay attribute
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add('scrolled');
                }, delay);

                // Stop observing the element once it has animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Attach observer to each element
    scrollElements.forEach((el) => {
        scrollObserver.observe(el);
    });

    // Subtly blur navbar background when scrolling down
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.85)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Skills Slider Logic ---
    const skillsGrid = document.getElementById('skillsGrid');
    const skillsGridWrapper = document.getElementById('skillsGridWrapper');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const sliderDots = document.getElementById('sliderDots');

    if (skillsGrid && skillsGridWrapper) {
        let currentSlide = 0;
        let slideInterval;
        let isMobile = window.innerWidth <= 768;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let cards = document.querySelectorAll('.skill-card');

        // Setup slider
        const setupSlider = () => {
            isMobile = window.innerWidth <= 768;
            if (isMobile) {
                // Approximate card width based on elements
                const cardWidth = cards[0].offsetWidth > 0 ? (cards[0].offsetWidth + 16) : 156;
                const wrapperWidth = skillsGridWrapper.clientWidth || window.innerWidth - 60;

                // Visible cards = floor of wrapper/cardWidth
                const visibleCards = Math.floor(wrapperWidth / cardWidth) || 1;
                // Maximum slide index we can go up to
                const totalSlides = Math.max(1, cards.length - visibleCards + 1);

                // Create dots
                if (sliderDots) {
                    sliderDots.innerHTML = '';
                    for (let i = 0; i < totalSlides; i++) {
                        const dot = document.createElement('div');
                        dot.classList.add('dot-indicator');
                        if (i === currentSlide) dot.classList.add('active');
                        // Use IIFE or let binding for click events
                        let slideIndex = i;
                        dot.addEventListener('click', () => {
                            currentSlide = slideIndex;
                            updateSlider();
                            resetAutoSlide();
                        });
                        sliderDots.appendChild(dot);
                    }
                }

                updateSlider();
                startAutoSlide();
            } else {
                skillsGrid.style.transform = '';
                if (sliderDots) sliderDots.innerHTML = '';
                stopAutoSlide();
            }
        };

        const updateSlider = () => {
            if (!isMobile) return;
            const cardWidth = cards[0].offsetWidth > 0 ? (cards[0].offsetWidth + 16) : 156;
            const totalSlides = sliderDots ? sliderDots.children.length : 0;

            if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
            if (currentSlide < 0) currentSlide = 0;

            const baseTranslate = -(currentSlide * cardWidth);
            skillsGrid.style.transform = `translateX(${baseTranslate}px)`;

            if (sliderDots) {
                Array.from(sliderDots.children).forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            if (prevBtn) prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
            if (nextBtn) nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        };

        const nextSlide = () => {
            const totalSlides = sliderDots ? sliderDots.children.length : 0;
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSlider();
        };

        const prevSlide = () => {
            const totalSlides = sliderDots ? sliderDots.children.length : 0;
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = totalSlides - 1;
            }
            updateSlider();
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                resetAutoSlide();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
                resetAutoSlide();
            });
        }

        // Touch gestures
        skillsGridWrapper.addEventListener('touchstart', (e) => {
            if (!isMobile) return;
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
            stopAutoSlide();
            skillsGrid.style.transition = 'none';
        }, { passive: true });

        skillsGridWrapper.addEventListener('touchmove', (e) => {
            if (!isMobile || !isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const cardWidth = cards[0].offsetWidth + 16;
            const baseTranslate = -(currentSlide * cardWidth);
            skillsGrid.style.transform = `translateX(${baseTranslate + diff}px)`;
        }, { passive: true });

        const handleTouchEnd = () => {
            if (!isMobile || !isDragging) return;
            isDragging = false;
            skillsGrid.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

            const diff = currentX - startX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                updateSlider();
            }
            startAutoSlide();
        };

        skillsGridWrapper.addEventListener('touchend', handleTouchEnd);
        skillsGridWrapper.addEventListener('touchcancel', handleTouchEnd);

        skillsGridWrapper.addEventListener('mouseenter', stopAutoSlide);
        skillsGridWrapper.addEventListener('mouseleave', () => { if (isMobile) startAutoSlide(); });

        const startAutoSlide = () => {
            stopAutoSlide();
            if (isMobile) {
                slideInterval = setInterval(nextSlide, 3000);
            }
        };

        const stopAutoSlide = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        };

        const resetAutoSlide = () => {
            startAutoSlide();
        };

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                cards = document.querySelectorAll('.skill-card'); // Refresh cards just in case
                setupSlider();
            }, 100);
        });

        // Small delay to ensure styles/layout applied
        setTimeout(setupSlider, 100);
    }
});
