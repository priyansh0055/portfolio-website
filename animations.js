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
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (skillsGrid && prevBtn && nextBtn) {
        const updateButtons = () => {
            if (window.innerWidth > 768) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                return;
            }

            // Hide left button if at start
            if (skillsGrid.scrollLeft <= 5) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
            }

            // Hide right button if at end (allow small margin of error)
            if (skillsGrid.scrollLeft + skillsGrid.clientWidth >= skillsGrid.scrollWidth - 5) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'flex';
            }
        };

        const getCardWidth = () => {
            const firstCard = skillsGrid.querySelector('.skill-card');
            if (firstCard) {
                // Return card width including gap (approx 16px)
                return firstCard.offsetWidth + 16;
            }
            return 166; // Fallback
        };

        prevBtn.addEventListener('click', () => {
            skillsGrid.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            skillsGrid.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        // Update button visibility on scroll and resize
        skillsGrid.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);

        // Initial check after a slight delay to ensure layout is computed
        setTimeout(updateButtons, 100);
    }
});
