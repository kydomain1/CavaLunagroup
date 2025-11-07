// Search Results Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    performSearch();
});

function performSearch() {
    // Get search query from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    if (!searchQuery) {
        displayNoQuery();
        return;
    }

    // Update page title and search query display
    document.title = `Search: ${searchQuery} - CavaLunagroup`;
    document.getElementById('searchQuery').textContent = `Searching for: "${searchQuery}"`;
    document.getElementById('searchInput').value = searchQuery;

    // Perform search
    const results = searchArticles(searchQuery);

    // Display results
    displayResults(results, searchQuery);
}

function searchArticles(query) {
    const searchQuery = query.toLowerCase();
    
    return articlesData.filter(article => {
        const searchableText = `
            ${article.title} 
            ${article.excerpt} 
            ${article.categoryName}
            ${article.author}
        `.toLowerCase();
        
        return searchableText.includes(searchQuery);
    });
}

function displayResults(results, query) {
    const grid = document.getElementById('articlesGrid');
    const info = document.getElementById('searchResultsInfo');

    // Display results count
    if (results.length === 0) {
        info.innerHTML = `<p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>`;
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: #666;">
                <p style="font-size: 1.125rem;">No articles found matching your search.</p>
                <p style="margin-top: 1rem;">Try different keywords or <a href="index.html" style="color: #000; text-decoration: underline;">browse all articles</a>.</p>
            </div>
        `;
        return;
    }

    if (results.length === 1) {
        info.innerHTML = `<p>Found <strong>1</strong> result for "<strong>${escapeHtml(query)}</strong>"</p>`;
    } else {
        info.innerHTML = `<p>Found <strong>${results.length}</strong> results for "<strong>${escapeHtml(query)}</strong>"</p>`;
    }

    // Clear grid
    grid.innerHTML = '';

    // Render article cards
    results.forEach((article, index) => {
        const card = createArticleCard(article);
        card.style.animationDelay = `${index * 0.02}s`;
        grid.appendChild(card);
    });
}

function displayNoQuery() {
    const grid = document.getElementById('articlesGrid');
    const info = document.getElementById('searchResultsInfo');
    
    document.getElementById('searchQuery').textContent = 'Please enter a search term';
    
    info.innerHTML = '<p>Enter a keyword to search our articles</p>';
    
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: #666;">
            <p style="font-size: 1.125rem;">Use the search box above to find articles.</p>
            <p style="margin-top: 1rem;"><a href="index.html" style="color: #000; text-decoration: underline;">Browse all articles</a></p>
        </div>
    `;
}

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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}



