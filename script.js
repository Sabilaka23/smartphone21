document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Toggle between menu and close icons
        const icon = this.querySelector('ion-icon');
        if (navMenu.classList.contains('active')) {
            icon.setAttribute('name', 'close-outline');
        } else {
            icon.setAttribute('name', 'menu-outline');
        }
    });
    
    // Dropdown Menu for Mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('active');
                
                // Toggle dropdown icon
                const icon = this.querySelector('ion-icon');
                if (dropdownMenu.classList.contains('active')) {
                    icon.setAttribute('name', 'chevron-up-outline');
                } else {
                    icon.setAttribute('name', 'chevron-down-outline');
                }
            }
        });
    });
    
    // Model Selection
    const modelCards = document.querySelectorAll('.model-card');
    const modelSelectBtns = document.querySelectorAll('.model-select-btn');
    const modelSelect = document.getElementById('model');
    
    modelCards.forEach(card => {
        card.addEventListener('click', function() {
            const model = this.getAttribute('data-model');
            
            // Update selected model in dropdown
            if (modelSelect) {
                modelSelect.value = model;
            }
            
            // Update UI
            modelCards.forEach(c => {
                const btn = c.querySelector('.model-select-btn');
                if (c === this) {
                    btn.classList.add('selected');
                    btn.textContent = 'Terpilih';
                } else {
                    btn.classList.remove('selected');
                    btn.textContent = 'Pilih';
                }
            });
        });
    });
    
    // Contact Form Modal
    const modal = document.getElementById('contactModal');
    const buyButtons = document.querySelectorAll('#navBuyButton, #heroOrderButton');
    const closeModal = document.querySelector('.close-modal');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Track button click
            trackEvent('button_click', {
                button_name: 'beli_sekarang'
            });
            
            // Facebook Pixel event tracking
            if (typeof fbq !== 'undefined' && typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout');
            }
        });
    });
    
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                model: document.getElementById('model').value
            };
            
            // Track conversion
            trackEvent('purchase', {
                formData: formData
            });
            
            // Facebook Pixel conversion tracking
            if (typeof fbq !== 'undefined' && typeof fbq === 'function') {
                fbq('track', 'Purchase', {
                    value: 1000,
                    currency: 'IDR',
                    content_name: formData.model
                });
            }
            
            // Redirect to thank you page
            window.location.href = 'terima-kasih.html';
        });
    }
    
    // Helper function for tracking events
    function trackEvent(eventName, eventParams) {
        // Google Tag Manager event tracking
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: eventName,
                ...eventParams
            });
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        menuToggle.querySelector('ion-icon').setAttribute('name', 'menu-outline');
                    }
                }
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards and model cards for scroll animations
    document.querySelectorAll('.feature-card, .model-card').forEach(el => {
        el.classList.remove('fade-in');
        observer.observe(el);
    });
    
    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        setInterval(() => {
            button.classList.add('pulse');
            setTimeout(() => {
                button.classList.remove('pulse');
            }, 1000);
        }, 5000);
    });
});