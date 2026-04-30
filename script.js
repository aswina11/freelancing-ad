document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all elements with .fade-in class
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // 3. Form Handling Simulation
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Change button state
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i data-lucide="loader" class="spin"></i>';
        submitBtn.disabled = true;
        lucide.createIcons();

        // Web3Forms API call
        const formData = new FormData(contactForm);
        formData.append("access_key", "ec8ac6da-ab25-4424-b47c-9f46205899c7");
        
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonRes = await response.json();
            if (response.status == 200) {
                // Success
                formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                console.log(response);
                formStatus.textContent = jsonRes.message || "Something went wrong!";
                formStatus.className = 'form-status error';
            }
        })
        .catch(error => {
            console.log(error);
            formStatus.textContent = "Something went wrong! Please try again.";
            formStatus.className = 'form-status error';
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;
            lucide.createIcons();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.className = 'form-status';
                // Reset display property so it can show again next time
                setTimeout(() => formStatus.style.display = '', 100);
            }, 5000);
        });
    });

    // Add spin animation dynamically for the loader
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
    `;
    document.head.appendChild(style);
});
