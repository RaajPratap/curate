import Link from 'next/link'

const Footer = () => {
  const footerLinks = {
    shop: [
      { href: '/shop', label: 'All Products' },
      { href: '/shop/new', label: 'New Arrivals' },
      { href: '/drops', label: 'Limited Drops' },
      { href: '/shop/sale', label: 'Sale' },
    ],
    impact: [
      { href: '/sustainability', label: 'Our Mission' },
      { href: '/sustainability/materials', label: 'Materials' },
      { href: '/sustainability/factories', label: 'Factories' },
      { href: '/sustainability/reports', label: 'Impact Reports' },
    ],
    help: [
      { href: '/help/contact', label: 'Contact' },
      { href: '/help/shipping', label: 'Shipping' },
      { href: '/help/returns', label: 'Returns' },
      { href: '/help/faq', label: 'FAQ' },
    ],
    social: [
      { href: 'https://instagram.com', label: 'Instagram' },
      { href: 'https://tiktok.com', label: 'TikTok' },
      { href: 'https://twitter.com', label: 'Twitter' },
      { href: 'https://discord.com', label: 'Discord' },
    ],
  }

  return (
    <footer className="py-12 bg-background-secondary">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="border border-border p-8 mb-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold tracking-tighter mb-2">
              JOIN THE MOVEMENT
            </h3>
            <p className="font-mono text-xs text-foreground-muted uppercase tracking-wider mb-6">
              Get early access to drops + sustainability updates
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="input flex-1"
              />
              <button type="submit" className="btn-brutal text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-muted mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-muted mb-4">
              Impact
            </h4>
            <ul className="space-y-2">
              {footerLinks.impact.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-muted mb-4">
              Help
            </h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-muted mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl font-bold tracking-tighter hover:text-accent transition-colors">
            CURATE
          </Link>
          <div className="font-mono text-xs text-foreground-muted">
            © {new Date().getFullYear()} CURATE. All rights reserved.
          </div>
          <div className="flex gap-4 font-mono text-xs">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
