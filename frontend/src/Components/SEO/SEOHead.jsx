import { useEffect } from 'react';

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  robots = 'index, follow',
  author = 'Curate',
  publishedTime,
  modifiedTime,
  tags,
  canonicalUrl,
  noIndex = false,
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://curate.com';
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const defaultDescription = 'Curate - Premium sustainable apparel with limited stock releases. Discover curated fashion that makes a statement.';
  const defaultTitle = 'Curate | Limited-Stock Sustainable Apparel';

  const pageTitle = title ? `${title} | Curate` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const pageCanonical = canonicalUrl || pageUrl;

  const robotsContent = noIndex ? 'noindex, nofollow' : robots;

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Update document title
    document.title = pageTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.head.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic Meta Tags
    updateMetaTag('description', pageDescription);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', robotsContent);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Canonical URL
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageCanonical);

    // Open Graph
    updateMetaTag('og:title', title || defaultTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:image', pageImage, true);
    updateMetaTag('og:url', pageUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Curate', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || defaultTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', pageImage);
    updateMetaTag('twitter:site', '@curate');
    updateMetaTag('twitter:creator', '@curate');

    // Theme Color
    updateMetaTag('theme-color', '#18181b');
    updateMetaTag('msapplication-TileColor', '#18181b');

    // Additional
    updateMetaTag('format-detection', 'telephone=no');

    // Preconnect
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    preconnects.forEach(href => {
      let link = document.head.querySelector(`link[rel="preconnect"][href="${href}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'preconnect');
        link.setAttribute('href', href);
        if (href.includes('gstatic.com')) {
          link.setAttribute('crossorigin', 'anonymous');
        }
        document.head.appendChild(link);
      }
    });

  }, [pageTitle, pageDescription, pageImage, pageUrl, pageCanonical, keywords, author, robotsContent, title, defaultTitle, type]);

  // Return null - this component doesn't render anything visible
  return null;
};

export default SEOHead;
