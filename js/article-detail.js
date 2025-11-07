// Article Detail Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
});

function loadArticle() {
    // Get article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));

    // Find article in data
    const article = articlesData.find(a => a.id === articleId);

    if (!article) {
        // Article not found, redirect to home
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = `${article.title} - CavaLunagroup`;

    // Update Open Graph meta tags for social sharing
    updateMetaTags(article);

    // Populate article content
    document.getElementById('articleCategory').textContent = article.categoryName;
    document.getElementById('articleDate').textContent = formatDate(article.date);
    document.getElementById('articleAuthor').textContent = article.author;
    document.getElementById('articleTitle').textContent = article.title;

    // Featured image
    const featuredImageContainer = document.getElementById('articleFeaturedImage');
    featuredImageContainer.innerHTML = `
        <img src="${article.featuredImage}" alt="${article.title}" loading="lazy">
    `;

    // Article body
    const articleBody = document.getElementById('articleBody');
    articleBody.innerHTML = article.content;

    // Optimize images in article content
    optimizeArticleImages(articleBody);

    // Load related articles
    loadRelatedArticles(article);

    // Animate content on load
    animateContent();
}

// Optimize images in article content
function optimizeArticleImages(container) {
    const images = container.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading attribute if not present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling with CSS fallback
        img.addEventListener('error', function() {
            // Only apply fallback once
            if (!this.hasAttribute('data-fallback-applied')) {
                this.setAttribute('data-fallback-applied', 'true');
                
                console.warn('Image failed to load, using CSS fallback:', this.src.substring(0, 100));
                
                // Determine product name from alt text
                let productName = this.alt || 'Product Image';
                if (productName.length > 30) {
                    productName = 'Product Image';
                }
                
                // Remove the image and replace with styled div
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'image-fallback';
                fallbackDiv.style.cssText = `
                    width: 100%;
                    height: 400px;
                    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    font-size: 20px;
                    color: #666;
                    font-weight: 500;
                    border-radius: 4px;
                    padding: 20px;
                `;
                fallbackDiv.textContent = productName;
                
                // Replace image with fallback div
                this.parentNode.replaceChild(fallbackDiv, this);
            }
        });
        
        // Add load animation
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

function loadRelatedArticles(currentArticle) {
    // Get articles from the same category, excluding current article
    let relatedArticles = articlesData.filter(article => 
        article.category === currentArticle.category && article.id !== currentArticle.id
    );

    // If not enough articles in same category, add from other categories
    if (relatedArticles.length < 3) {
        const otherArticles = articlesData.filter(article => 
            article.category !== currentArticle.category && article.id !== currentArticle.id
        );
        relatedArticles = [...relatedArticles, ...otherArticles];
    }

    // Limit to 3 articles
    relatedArticles = relatedArticles.slice(0, 3);

    // Render related articles
    const relatedContainer = document.getElementById('relatedArticles');
    relatedContainer.innerHTML = '';

    relatedArticles.forEach((article, index) => {
        const card = createRelatedArticleCard(article);
        card.style.animationDelay = `${index * 0.1}s`;
        relatedContainer.appendChild(card);
    });
}

function createRelatedArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';
    
    const formattedDate = formatDate(article.date);
    
    card.innerHTML = `
        <a href="article.html?id=${article.id}" class="article-link">
            <div class="article-image">
                <img src="${article.featuredImage}" alt="${article.title}" loading="lazy">
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.categoryName}</span>
                    <span>•</span>
                    <span class="article-date">${formattedDate}</span>
                </div>
                <h2 class="article-title">${article.title}</h2>
                <p class="article-excerpt">${article.excerpt}</p>
                <span class="read-more">Read More</span>
            </div>
        </a>
    `;
    
    return card;
}

function animateContent() {
    // Animate elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe article body elements
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
        const elements = articleBody.querySelectorAll('h2, h3, p, img, .product-card');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(el);
        });
    }
}

// Update Open Graph and Twitter Card meta tags
function updateMetaTags(article) {
    const currentUrl = window.location.href;
    const description = article.excerpt || `${article.title} - Expert insights on ${article.categoryName}`;
    
    // Update basic meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph tags
    const ogUrl = document.getElementById('og-url');
    const ogTitle = document.getElementById('og-title');
    const ogDescription = document.getElementById('og-description');
    const articlePublished = document.getElementById('article-published');
    
    if (ogUrl) ogUrl.setAttribute('content', currentUrl);
    if (ogTitle) ogTitle.setAttribute('content', article.title);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (articlePublished) articlePublished.setAttribute('content', article.date);
    
    // Update Twitter Card tags
    const twitterTitle = document.getElementById('twitter-title');
    const twitterDescription = document.getElementById('twitter-description');
    
    if (twitterTitle) twitterTitle.setAttribute('content', article.title);
    if (twitterDescription) twitterDescription.setAttribute('content', description);
    
    // Add featured image to OG tags if available
    if (article.featuredImage) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', article.featuredImage);
        
        let twitterImage = document.querySelector('meta[property="twitter:image"]');
        if (!twitterImage) {
            twitterImage = document.createElement('meta');
            twitterImage.setAttribute('property', 'twitter:image');
            document.head.appendChild(twitterImage);
        }
        twitterImage.setAttribute('content', article.featuredImage);
    }
}

// Share functionality (optional enhancement)
function shareArticle() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('articleTitle').textContent,
            text: document.querySelector('.article-excerpt')?.textContent || '',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Could not copy text: ', err));
    }
}



