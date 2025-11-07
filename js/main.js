// CavaLunagroup Blog - Main JavaScript

// State Management
const state = {
    currentCategory: 'all',
    filteredArticles: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Initialize articles if on home page
    if (document.getElementById('articlesGrid')) {
        state.filteredArticles = articlesData;
        renderArticles();
        setupEventListeners();
    }

    // Initialize contact form if on contact page
    if (document.getElementById('contactForm')) {
        setupContactForm();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Category filter buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            filterByCategory(category);
            
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

// Filter by Category
function filterByCategory(category) {
    state.currentCategory = category;
    applyFilters();
}

// Apply All Filters
function applyFilters() {
    let filtered = [...articlesData];

    // Apply category filter
    if (state.currentCategory !== 'all') {
        filtered = filtered.filter(article => article.category === state.currentCategory);
    }

    state.filteredArticles = filtered;
    renderArticles();
}

// Render Articles with Performance Optimization
function renderArticles() {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    // Show loading indicator
    showLoadingIndicator(grid);

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
        // Clear grid
        grid.innerHTML = '';

        // Show message if no articles found
        if (state.filteredArticles.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: #666;">
                    <p style="font-size: 1.125rem;">No articles found matching your criteria.</p>
                    <p style="margin-top: 1rem;">Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }

        // Render articles in batches for better performance
        renderArticlesInBatches(state.filteredArticles, grid);
    });
}

// Render articles in batches to prevent blocking
function renderArticlesInBatches(articles, container, batchSize = 3) {
    let currentIndex = 0;

    function renderBatch() {
        const batch = articles.slice(currentIndex, currentIndex + batchSize);
        
        batch.forEach((article, index) => {
            const card = createArticleCard(article);
            const globalIndex = currentIndex + index;
            card.style.animationDelay = `${globalIndex * 0.02}s`;
            container.appendChild(card);
        });

        currentIndex += batchSize;

        // Continue rendering if there are more articles
        if (currentIndex < articles.length) {
            requestAnimationFrame(renderBatch);
        }
    }

    renderBatch();
}

// Show loading indicator
function showLoadingIndicator(container) {
    const loader = document.createElement('div');
    loader.className = 'articles-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Loading articles...</p>
    `;
    container.innerHTML = '';
    container.appendChild(loader);
}

// Create Article Card with Optimized Images
function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';
    
    const formattedDate = formatDate(article.date);
    
    // Create the card structure
    const link = document.createElement('a');
    link.href = `article.html?id=${article.id}`;
    link.className = 'article-link';
    
    // Create image container with optimized lazy loading
    const imageDiv = document.createElement('div');
    imageDiv.className = 'article-image';
    
    // Use optimized image if imageLoader is available
    if (typeof imageLoader !== 'undefined') {
        const optimizedImage = imageLoader.createOptimizedImage(
            article.featuredImage,
            article.title,
            800,
            true
        );
        imageDiv.appendChild(optimizedImage);
    } else {
        // Fallback to regular image
        const img = document.createElement('img');
        img.dataset.src = article.featuredImage;
        img.alt = article.title;
        img.loading = 'lazy';
        img.className = 'lazy-image';
        imageDiv.appendChild(img);
    }
    
    // Create content div
    const contentDiv = document.createElement('div');
    contentDiv.className = 'article-content';
    contentDiv.innerHTML = `
        <div class="article-meta">
            <span class="article-category">${escapeHtml(article.categoryName)}</span>
            <span>•</span>
            <span class="article-date">${formattedDate}</span>
        </div>
        <h2 class="article-title">${escapeHtml(article.title)}</h2>
        <p class="article-excerpt">${escapeHtml(article.excerpt)}</p>
        <span class="read-more">Read More</span>
    `;
    
    link.appendChild(imageDiv);
    link.appendChild(contentDiv);
    card.appendChild(link);
    
    return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Contact Form Setup
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Simulate form submission (since this is static)
        formMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
        formMessage.className = 'form-message success';
        
        // Reset form
        form.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }, 5000);

        // In a real application, you would send this data to a server
        console.log('Form submitted:', formData);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
    
    lastScroll = currentScroll;
});

