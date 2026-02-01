'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import { CartDrawer } from '@/components/cart'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { openCart } from '@/store/slices/cartSlice'
import { useAuth } from '@/lib/auth'

interface HeaderProps {
  cartCount?: number
}

const Header = ({ cartCount = 0 }: HeaderProps) => {
  const dispatch = useAppDispatch()
  const isCartOpen = useAppSelector((state) => state.cart.isOpen)
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/drops', label: 'Drops' },
    { href: '/sustainability', label: 'Impact' },
    { href: '/about', label: 'About' },
  ]

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-accent text-black py-2 overflow-hidden">
        <div className="marquee">
          <span className="marquee-content font-mono text-xs tracking-widest uppercase">
            FREE SHIPPING ON ORDERS OVER ₹2,999 — SUSTAINABLE FASHION FOR THE CONSCIOUS — 
            FREE SHIPPING ON ORDERS OVER ₹2,999 — SUSTAINABLE FASHION FOR THE CONSCIOUS — 
          </span>
        </div>
      </div>

      {/* Navigation */}
      <header className="border-b border-border sticky top-0 bg-background z-40">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-bold tracking-tighter hover:text-accent transition-colors">
            CURATE
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Account */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors"
                  >
                    <div className="w-8 h-8 bg-accent text-black flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border z-50">
                      <div className="p-3 border-b border-border">
                        <p className="font-mono text-sm font-semibold truncate">{user?.name}</p>
                        <p className="font-mono text-xs text-foreground-muted truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 font-mono text-sm hover:bg-background-secondary hover:text-accent transition-colors"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 font-mono text-sm hover:bg-background-secondary hover:text-accent transition-colors"
                        >
                          Orders
                        </Link>
                        <Link
                          href="/account?tab=impact"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 font-mono text-sm hover:bg-background-secondary hover:text-accent transition-colors"
                        >
                          My Impact
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 font-mono text-sm text-error hover:bg-background-secondary transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => dispatch(openCart())}
              className="font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-black text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="square" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200 border-t border-border',
            mobileMenuOpen ? 'max-h-96' : 'max-h-0 border-t-0'
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent text-black flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold">{user?.name}</p>
                      <p className="font-mono text-xs text-foreground-muted">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-mono text-sm uppercase tracking-wider hover:text-accent transition-colors mb-2"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="font-mono text-sm uppercase tracking-wider text-error hover:text-error/80 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button variant="brutal" size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                className="input text-lg py-4"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-4 font-mono text-xs text-foreground-muted uppercase tracking-wider text-center">
              Press ESC to close
            </p>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} />
    </>
  )
}

export { Header }
