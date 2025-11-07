// Performance Monitor for CavaLunagroup Blog

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            domContentLoaded: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            timeToInteractive: 0
        };
        
        this.init();
    }

    init() {
        // Wait for page to fully load
        if (document.readyState === 'complete') {
            this.collectMetrics();
        } else {
            window.addEventListener('load', () => this.collectMetrics());
        }

        // Monitor performance continuously
        this.observePerformance();
    }

    collectMetrics() {
        // Get Navigation Timing metrics
        if (performance && performance.timing) {
            const timing = performance.timing;
            
            this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
            this.metrics.timeToInteractive = timing.domInteractive - timing.navigationStart;
        }

        // Get Paint Timing metrics
        if (performance && performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                }
            });

            // Get Largest Contentful Paint
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
            });
            
            try {
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // LCP not supported
            }

            // Get First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                });
            });
            
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                // FID not supported
            }

            // Get Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        this.metrics.cumulativeLayoutShift = clsValue;
                    }
                }
            });
            
            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                // CLS not supported
            }
        }

        // Log metrics after 3 seconds
        setTimeout(() => {
            this.logMetrics();
        }, 3000);
    }

    observePerformance() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry.duration + 'ms');
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Long tasks not supported
            }
        }

        // Monitor resource loading
        this.monitorResources();
    }

    monitorResources() {
        if (performance && performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            
            const imageResources = resources.filter(r => r.initiatorType === 'img');
            const slowImages = imageResources.filter(r => r.duration > 1000);
            
            if (slowImages.length > 0) {
                console.warn('Slow loading images:', slowImages.length);
                slowImages.forEach(img => {
                    console.warn('- ' + img.name + ': ' + Math.round(img.duration) + 'ms');
                });
            }

            // Calculate total image size
            const totalImageSize = imageResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
            console.log('Total image data transferred:', this.formatBytes(totalImageSize));
        }
    }

    logMetrics() {
        console.group('📊 Performance Metrics');
        console.log('Page Load Time:', this.formatTime(this.metrics.pageLoadTime));
        console.log('DOM Content Loaded:', this.formatTime(this.metrics.domContentLoaded));
        console.log('Time to Interactive:', this.formatTime(this.metrics.timeToInteractive));
        
        if (this.metrics.firstContentfulPaint > 0) {
            console.log('First Contentful Paint:', this.formatTime(this.metrics.firstContentfulPaint));
        }
        
        if (this.metrics.largestContentfulPaint > 0) {
            console.log('Largest Contentful Paint:', this.formatTime(this.metrics.largestContentfulPaint));
            this.evaluateLCP();
        }
        
        if (this.metrics.firstInputDelay > 0) {
            console.log('First Input Delay:', this.formatTime(this.metrics.firstInputDelay));
            this.evaluateFID();
        }
        
        if (this.metrics.cumulativeLayoutShift > 0) {
            console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift.toFixed(3));
            this.evaluateCLS();
        }
        
        console.groupEnd();

        // Show performance score
        this.calculateScore();
    }

    evaluateLCP() {
        const lcp = this.metrics.largestContentfulPaint;
        if (lcp <= 2500) {
            console.log('✅ LCP: Good');
        } else if (lcp <= 4000) {
            console.log('⚠️ LCP: Needs Improvement');
        } else {
            console.log('❌ LCP: Poor');
        }
    }

    evaluateFID() {
        const fid = this.metrics.firstInputDelay;
        if (fid <= 100) {
            console.log('✅ FID: Good');
        } else if (fid <= 300) {
            console.log('⚠️ FID: Needs Improvement');
        } else {
            console.log('❌ FID: Poor');
        }
    }

    evaluateCLS() {
        const cls = this.metrics.cumulativeLayoutShift;
        if (cls <= 0.1) {
            console.log('✅ CLS: Good');
        } else if (cls <= 0.25) {
            console.log('⚠️ CLS: Needs Improvement');
        } else {
            console.log('❌ CLS: Poor');
        }
    }

    calculateScore() {
        let score = 100;
        
        // LCP scoring
        const lcp = this.metrics.largestContentfulPaint;
        if (lcp > 4000) score -= 30;
        else if (lcp > 2500) score -= 15;
        
        // FID scoring
        const fid = this.metrics.firstInputDelay;
        if (fid > 300) score -= 20;
        else if (fid > 100) score -= 10;
        
        // CLS scoring
        const cls = this.metrics.cumulativeLayoutShift;
        if (cls > 0.25) score -= 20;
        else if (cls > 0.1) score -= 10;
        
        // Page load time scoring
        if (this.metrics.pageLoadTime > 5000) score -= 20;
        else if (this.metrics.pageLoadTime > 3000) score -= 10;

        console.log(`\n🎯 Performance Score: ${score}/100`);
        
        if (score >= 90) {
            console.log('🎉 Excellent performance!');
        } else if (score >= 70) {
            console.log('👍 Good performance');
        } else if (score >= 50) {
            console.log('⚠️ Performance needs improvement');
        } else {
            console.log('❌ Poor performance - optimization needed');
        }
    }

    formatTime(ms) {
        if (ms < 1000) {
            return ms.toFixed(0) + 'ms';
        }
        return (ms / 1000).toFixed(2) + 's';
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize performance monitor
const perfMonitor = new PerformanceMonitor();

