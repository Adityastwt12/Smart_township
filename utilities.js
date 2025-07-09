
// scripts/utilities.js
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Make phone numbers clickable
    document.querySelectorAll('.phone').forEach(phone => {
        phone.addEventListener('click', function() {
            const phoneNumber = this.textContent.replace(/\D/g, '');
            if (phoneNumber) {
                window.open(`tel:${phoneNumber}`);
            }
        });
        phone.style.cursor = 'pointer';
        phone.title = 'Click to call';
    });

    // Mobile Menu Toggle
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        const nav = document.querySelector('.main-nav ul');
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
});