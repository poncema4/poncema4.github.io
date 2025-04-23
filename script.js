// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website functionality
    initNavigation();
    initScrollToTop();
    initProjectsFilter();
    initFormValidation();
    initAnimations();
    initDarkMode();
});

// Sticky Navigation & Scroll Spy
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Projects Filter
function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form Validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (name === '' || email === '' || subject === '' || message === '') {
                showFormError('Please fill out all fields');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showFormError('Please enter a valid email address');
                return;
            }
            
            // If all validation passes, you would normally send the form data to a server
            // For now, we'll just show a success message
            showFormSuccess('Your message has been sent!');
            
            // Reset the form
            contactForm.reset();
        });
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showFormError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        
        // Check if error message already exists
        const existingError = contactForm.querySelector('.form-error');
        if (existingError) {
            contactForm.removeChild(existingError);
        }
        
        contactForm.appendChild(errorDiv);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.parentElement.removeChild(errorDiv);
            }
        }, 3000);
    }
    
    function showFormSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = message;
        
        // Check if success message already exists
        const existingSuccess = contactForm.querySelector('.form-success');
        if (existingSuccess) {
            contactForm.removeChild(existingSuccess);
        }
        
        contactForm.appendChild(successDiv);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.parentElement.removeChild(successDiv);
            }
        }, 3000);
    }
}

// Scroll Animations
function initAnimations() {
    // Select all elements to animate
    const animateElements = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .contact-item');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                // Unobserve the element after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe each element
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Dark Mode Toggle
function initDarkMode() {
    const body = document.body;
    
    // Create dark mode toggle button if it doesn't exist
    if (!document.querySelector('.dark-mode-toggle')) {
        const darkModeToggle = document.createElement('div');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        document.body.appendChild(darkModeToggle);
        
        // Check for saved user preference
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Toggle dark mode on click
        darkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('darkMode', 'disabled');
            } else {
                body.classList.add('dark-mode');
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('darkMode', 'enabled');
            }
        });
    }
}

// Dynamic typing effect for header
function typeEffect() {
    const element = document.querySelector('.header-text p');
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 100);
}

// Call typing effect after a short delay
setTimeout(typeEffect, 1000);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Project hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.project-info').style.height = 'auto';
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('.project-info').style.height = null;
    });
});

// Add CSS classes for form success/error styling
const style = document.createElement('style');
style.textContent = `
    .form-error {
        background-color: #ff5757;
        color: white;
        padding: 0.8rem;
        border-radius: 4px;
        margin-top: 1rem;
        animation: fadeIn 0.3s ease-in-out;
    }
    
    .form-success {
        background-color: #28a745;
        color: white;
        padding: 0.8rem;
        border-radius: 4px;
        margin-top: 1rem;
        animation: fadeIn 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);