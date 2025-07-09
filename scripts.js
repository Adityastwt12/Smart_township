// ===========================
// 1. Mobile Menu Toggle
// ===========================
document.querySelector('.mobile-menu')?.addEventListener('click', function () {
    const nav = document.querySelector('.main-nav ul');
    if (nav) {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    }
});

// ===========================
// 2. Smooth Scrolling for Anchor Links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===========================
// 3. Sticky Header on Scroll
// ===========================
window.addEventListener('scroll', function () {
    const header = document.querySelector('.main-header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 0);
    }
});

// ===========================
// 4. Current Year in Footer
// ===========================
const copyright =
    document.querySelector('.copyright p');
if (copyright) {
    copyright.innerHTML = `&copy; ${new Date().getFullYear()} Sunabeda.com. All rights reserved.`;
}

// ===========================
// 5. Predictive Maintenance Form Logic
// ===========================
document.getElementById('predictForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const temperature = parseFloat(document.getElementById('temperature')?.value || 0);
    const vibration = parseFloat(document.getElementById('vibration')?.value || 0);
    const usageHours = parseFloat(document.getElementById('usage-hours')?.value || 0);

    let prediction = "No fault predicted";

    if (temperature > 45 || vibration > 70 || usageHours > 8000) {
        prediction = "Seal Leakage predicted (High Priority)";
    } else if (temperature > 40 || vibration > 60 || usageHours > 7000) {
        prediction = "Component Wear predicted (Medium Priority)";
    } else if (temperature > 35 || vibration > 50 || usageHours > 6000) {
        prediction = "Minor Maintenance Needed (Low Priority)";
    }

    document.getElementById('predictionOutput').textContent = prediction;
});

// ===========================
// 6. Form Validation (Generic)
// ===========================
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
        let isValid = true;

        this.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields.');
        } else {
            // For demo/test purpose only
            if (this.id === 'issueForm') {
                e.preventDefault();
                alert('Issue reported successfully! Our team will address it soon.');
                this.reset();
            }
        }
    });
});

// ===========================
// 7. Mobile Number Validation (10 digits only)
// ===========================
document.getElementById('mobile')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').substring(0, 10);
});
