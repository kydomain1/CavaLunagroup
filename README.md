# CavaLunagroup Blog Website

A minimalist, comprehensive lifestyle blog featuring six categories: Fashion & Accessories, Health & Beauty, Home & Garden, Travel & Accommodation, Finance & Insurance, and Food & Beverage.

## 🌟 Features

- **Minimalist Design**: Clean lines, ample white space, limited color palette, focus on essential elements
- **6 Content Categories**: Curated content across lifestyle essentials
- **5 Featured Articles**: High-quality blog posts with product recommendations (Jan-Aug 2025)
- **Search Functionality**: Find articles quickly with real-time search
- **Category Filtering**: Filter content by specific categories
- **Pagination**: Smooth navigation through articles
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant transitions and scroll effects
- **Social Media Integration**: Connected social media icons
- **Contact Form**: Functional contact form for user engagement
- **Product Showcases**: Detailed product recommendations with reviews

## 📁 Project Structure

```
CavaLunagroup/
├── index.html              # Homepage with article grid
├── about.html              # About page
├── contact.html            # Contact page with form
├── article.html            # Article detail page template
├── privacy.html            # Privacy policy page
├── css/
│   └── style.css          # Main stylesheet with minimalist design
├── js/
│   ├── articles-data.js   # Article content database
│   ├── main.js            # Main JavaScript functionality
│   └── article-detail.js  # Article page specific scripts
└── README.md              # This file
```

## 🎨 Design Philosophy

This website embodies minimalist design principles:

- **Clean & Clear**: Uncluttered layouts that prioritize content
- **Breathing Space**: Generous white space creates visual calm
- **Limited Color Palette**: Black, white, and subtle grays for sophistication
- **Simple Lines**: Geometric precision without ornamentation
- **Focused**: Every element serves a purpose
- **Functional First**: Beauty through utility

## 📝 Content Categories

1. **Fashion & Accessories**: Sustainable fashion, style guides, brand reviews
2. **Health & Beauty**: Clean beauty, wellness, product recommendations
3. **Home & Garden**: Interior design, gardening, home improvement
4. **Travel & Accommodation**: Destination guides, travel insurance, accommodations
5. **Finance & Insurance**: Financial planning, insurance guides, investment tips
6. **Food & Beverage**: Culinary trends, product reviews, recipes

## 🚀 Getting Started

### Local Development

1. **Clone or download** this repository to your computer

2. **Open the website** in your browser:
   - Simply open `index.html` in any modern web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```

3. **Navigate the site**:
   - Browse articles on the homepage
   - Filter by category
   - Search for specific content
   - Read full articles with product recommendations
   - Visit About and Contact pages

### Deployment

This is a **static website** that can be deployed to any web hosting service:

- **GitHub Pages**: Push to GitHub and enable Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Deploy directly from repository
- **Traditional Hosting**: Upload files via FTP

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Customization

### Adding New Articles

Edit `js/articles-data.js` and add new article objects:

```javascript
{
    id: 6, // Unique ID
    title: "Your Article Title",
    slug: "url-friendly-slug",
    category: "fashion", // fashion, health, home, travel, finance, food
    categoryName: "Fashion & Accessories",
    date: "2025-09-15",
    author: "Author Name",
    excerpt: "Brief description...",
    featuredImage: "https://image-url.jpg",
    content: `
        <p>Your article content in HTML...</p>
    `
}
```

### Changing Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --color-primary: #1a1a1a;
    --color-secondary: #666;
    --color-accent: #000;
    /* Add your custom colors */
}
```

### Modifying Layout

- **Container width**: Adjust `.container` max-width in CSS
- **Articles per page**: Change `articlesPerPage` in `js/main.js`
- **Grid columns**: Modify `.articles-grid` in CSS

## 📄 Pages

### Homepage (index.html)
- Hero section with site introduction
- Search bar
- Category filters
- Article grid with pagination

### Article Detail (article.html)
- Full article content
- Featured image
- Author and date information
- Related articles section

### About (about.html)
- Brand story
- Category descriptions
- Design philosophy

### Contact (contact.html)
- Contact form
- Email addresses
- Social media links

### Privacy Policy (privacy.html)
- Data collection practices
- Cookie policy
- User rights and GDPR compliance
- Contact information for privacy inquiries

## 🖼️ Images

All images use Unsplash URLs for demonstration. For production:

1. **Replace with your own images**
2. **Optimize for web** (compress, resize)
3. **Use appropriate alt text** for accessibility
4. **Consider lazy loading** for performance

## ✨ Key Features Explained

### Search
Real-time search filters articles by title, excerpt, category, and author.

### Category Filtering
Click category buttons to show only articles from that category.

### Pagination
Articles are displayed 6 per page with elegant page navigation.

### Responsive Design
- Desktop: Multi-column grid layout
- Tablet: Adjusted grid
- Mobile: Single column, hamburger menu

### Smooth Animations
- Fade-in effects on scroll
- Hover transitions
- Page transitions

## 🔄 Future Enhancements

Potential additions for future versions:
- Newsletter subscription
- Article bookmarking
- User comments system
- RSS feed
- Dark mode toggle
- Multi-language support
- Advanced filtering options

## 📞 Support

For questions or issues with this website template:
- Email: hello@cavalunagroup.com
- Partnerships: partnerships@cavalunagroup.com

## 📜 License

This project is provided as-is for portfolio and educational purposes.

## 🙏 Credits

- **Fonts**: Inter by Rasmus Andersson
- **Icons**: SVG icons for social media
- **Images**: Unsplash (for demonstration)
- **Design Inspiration**: Minimalist web design principles

---

**Built with ❤️ for CavaLunagroup**

*Elevating everyday living through thoughtful insights*

