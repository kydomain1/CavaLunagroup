// Advanced Image Loader with Performance Optimizations

class ImageLoader {
    constructor() {
        this.observer = null;
        this.imageCache = new Map();
        this.initIntersectionObserver();
    }

    // Initialize Intersection Observer for lazy loading
    initIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px', // Start loading 50px before image enters viewport
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    // Optimize image URL with proper parameters
    optimizeImageUrl(url, width = 800, quality = 80) {
        if (!url) return '';
        
        // If it's an Unsplash image, add optimization parameters
        if (url.includes('unsplash.com')) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('w', width);
            urlObj.searchParams.set('q', quality);
            urlObj.searchParams.set('fm', 'webp'); // Use WebP format when supported
            urlObj.searchParams.set('fit', 'crop');
            urlObj.searchParams.set('auto', 'format'); // Automatic format selection
            return urlObj.toString();
        }
        
        return url;
    }

    // Create optimized image element with loading placeholder
    createOptimizedImage(src, alt, width = 800, lazy = true) {
        const container = document.createElement('div');
        container.className = 'image-container loading';
        
        const img = document.createElement('img');
        const optimizedSrc = this.optimizeImageUrl(src, width);
        
        if (lazy) {
            // Use data-src for lazy loading
            img.dataset.src = optimizedSrc;
            img.src = this.createPlaceholder(width, width * 0.6);
            img.className = 'lazy-image';
            
            // Add to intersection observer
            this.observer.observe(img);
        } else {
            img.src = optimizedSrc;
        }
        
        img.alt = alt;
        img.loading = 'lazy'; // Native lazy loading as fallback
        
        // Remove loading class when image loads
        img.addEventListener('load', () => {
            container.classList.remove('loading');
            container.classList.add('loaded');
        });
        
        // Handle load errors
        img.addEventListener('error', () => {
            container.classList.remove('loading');
            container.classList.add('error');
            img.alt = 'Image failed to load';
        });
        
        container.appendChild(img);
        return container;
    }

    // Load image from data-src
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Check cache first
        if (this.imageCache.has(src)) {
            img.src = src;
            return;
        }

        // Create a new image to preload
        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = src;
            this.imageCache.set(src, true);
            img.classList.add('loaded');
        };
        tempImage.onerror = () => {
            img.classList.add('error');
        };
        tempImage.src = src;
    }

    // Create SVG placeholder
    createPlaceholder(width, height) {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    // Preload critical images
    preloadImages(urls) {
        urls.forEach(url => {
            if (this.imageCache.has(url)) return;
            
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.optimizeImageUrl(url);
            document.head.appendChild(link);
            
            this.imageCache.set(url, true);
        });
    }

    // Disconnect observer (cleanup)
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.imageCache.clear();
    }
}

// Create global instance
const imageLoader = new ImageLoader();

