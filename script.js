document.addEventListener('DOMContentLoaded', () => {
    // Logo scrolling
    const logoContainer = document.querySelector('.logo-container');
    const logoScrollLeftBtn = document.querySelector('.logo-scroll .left');
    const logoScrollRightBtn = document.querySelector('.logo-scroll .right');
    
    if (logoScrollLeftBtn && logoScrollRightBtn && logoContainer) {
        // Make sure the container is scrollable
        logoContainer.style.overflowX = 'scroll';
        logoContainer.style.scrollBehavior = 'smooth';
        
        // Hide scrollbar but keep functionality
        logoContainer.style.scrollbarWidth = 'none'; // Firefox
        logoContainer.style.msOverflowStyle = 'none'; // IE and Edge
        logoContainer.style.webkitOverflowScrolling = 'touch'; // iOS
        logoContainer.style.overflowY = 'hidden'; // Hide vertical scrollbar
        
        // Hide scrollbar in webkit browsers
        logoContainer.style.cssText += `
            &::-webkit-scrollbar {
                display: none;
            }
        `;

        logoScrollLeftBtn.addEventListener('click', () => {
            logoContainer.scrollLeft -= 300; // Use scrollLeft instead of scrollBy
        });
        
        logoScrollRightBtn.addEventListener('click', () => {
            logoContainer.scrollLeft += 300; // Use scrollLeft instead of scrollBy
        });

        // Show/hide scroll buttons based on scroll position
        logoContainer.addEventListener('scroll', () => {
            logoScrollLeftBtn.style.display = logoContainer.scrollLeft > 0 ? 'block' : 'none';
            logoScrollRightBtn.style.display = 
                logoContainer.scrollLeft < logoContainer.scrollWidth - logoContainer.clientWidth ? 'block' : 'none';
        });

        // Initial check for button visibility
        logoScrollLeftBtn.style.display = 'none';
        logoScrollRightBtn.style.display = 
            logoContainer.scrollWidth > logoContainer.clientWidth ? 'block' : 'none';
    }

    // Testimonial functionality
    let testimonials = [];
    let currentTestimonialIndex = 0;
    let maxHeight = 0;
    const testimonialContent = document.querySelector('.testimonial-content');
    const testimonialLeftBtn = document.querySelector('.testimonial .left');
    const testimonialRightBtn = document.querySelector('.testimonial .right');

    function loadTestimonials() {
        fetch('testimonials.json')
            .then(response => response.json())
            .then(data => {
                testimonials = data;
                calculateMaxHeight();
                displayTestimonial(currentTestimonialIndex);
            })
            .catch(error => console.error('Error loading testimonials:', error));
    }

    function calculateMaxHeight() {
        if (!testimonialContent) return;

        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
            visibility: hidden;
            position: absolute;
            width: ${testimonialContent.offsetWidth}px;
            padding: 20px;
            box-sizing: border-box;
        `;
        document.body.appendChild(tempDiv);

        testimonials.forEach(testimonial => {
            tempDiv.innerHTML = `
                <p>"${testimonial.content}"</p>
                <h3>${testimonial.name}</h3>
                <p>${testimonial.organization}</p>
                <p>${testimonial.location}</p>
            `;
            const height = tempDiv.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });

        document.body.removeChild(tempDiv);
        testimonialContent.style.height = `${maxHeight}px`;
    }

    function displayTestimonial(index) {
        if (!testimonialContent) return;

        const testimonial = testimonials[index];
        testimonialContent.innerHTML = `
            <p>"${testimonial.content}"</p>
            <h3>${testimonial.name}</h3>
            <p>${testimonial.organization}</p>
            <p>${testimonial.location}</p>
        `;
    }

    if (testimonialLeftBtn && testimonialRightBtn) {
        testimonialLeftBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            displayTestimonial(currentTestimonialIndex);
        });

        testimonialRightBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            displayTestimonial(currentTestimonialIndex);
        });
    }

    if (testimonialContent) {
        loadTestimonials();
        window.addEventListener('resize', calculateMaxHeight);
    }

    // Burger Menu Functionality
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('open');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burgerMenu.classList.remove('open');
            });
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('nav')) {
                navLinks.classList.remove('active');
                burgerMenu.classList.remove('open');
            }
        });
    }
});
