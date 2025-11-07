// UI Enhancements: Back to Top Button & Reading Progress Bar
// This script adds interactive UI elements to enhance user experience

document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    initReadingProgress();
});

// Back to Top Button
function initBackToTop() {
    // Create button element
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    document.body.appendChild(backToTopBtn);

    // Show/hide button based on scroll position
    let isVisible = false;
    window.addEventListener('scroll', () => {
        const shouldShow = window.pageYOffset > 300;
        
        if (shouldShow && !isVisible) {
            backToTopBtn.classList.add('visible');
            isVisible = true;
        } else if (!shouldShow && isVisible) {
            backToTopBtn.classList.remove('visible');
            isVisible = false;
        }
    });

    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Reading Progress Bar (for article pages)
function initReadingProgress() {
    // Only add progress bar on article pages
    if (!document.getElementById('articleBody')) {
        return;
    }

    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.id = 'readingProgress';
    progressBar.className = 'reading-progress';
    document.body.insertBefore(progressBar, document.body.firstChild);

    // Update progress bar on scroll
    window.addEventListener('scroll', updateReadingProgress);
    window.addEventListener('resize', updateReadingProgress);

    function updateReadingProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate scroll percentage
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        
        // Update progress bar width
        progressBar.style.width = Math.min(scrollPercentage, 100) + '%';
    }
}

// Smooth scroll for anchor links (optional enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Skip empty anchors
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

