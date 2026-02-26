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
});
