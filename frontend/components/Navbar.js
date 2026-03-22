import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface-0/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center glow-brand transition-all group-hover:scale-110">
              <span className="text-white font-display font-bold text-sm">AI</span>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              AI<span className="text-gradient">Deck</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" label="Explore" active={router.pathname === '/'} />
            {user && <NavLink href="/favorites" label="Favorites" active={router.pathname === '/favorites'} />}
            <NavLink href="/submit" label="Submit Tool" active={router.pathname === '/submit'} />
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
                  <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-white/70 font-body">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm text-white/60 hover:text-white/90 transition-colors font-body"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 text-sm text-white/60 hover:text-white/90 transition-colors font-body"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-brand-600/30 font-body"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-surface-1 px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="text-white/70 hover:text-white text-sm font-body py-1" onClick={() => setMenuOpen(false)}>Explore</Link>
          {user && <Link href="/favorites" className="text-white/70 hover:text-white text-sm font-body py-1" onClick={() => setMenuOpen(false)}>Favorites</Link>}
          <Link href="/submit" className="text-white/70 hover:text-white text-sm font-body py-1" onClick={() => setMenuOpen(false)}>Submit Tool</Link>
          <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
            {user ? (
              <button onClick={handleLogout} className="text-left text-sm text-white/50 hover:text-white font-body">Sign out</button>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-white/70 hover:text-white font-body" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link href="/auth/signup" className="text-sm text-brand-400 hover:text-brand-300 font-body" onClick={() => setMenuOpen(false)}>Get Started →</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-sm font-body transition-colors ${
        active
          ? 'text-white bg-white/8'
          : 'text-white/55 hover:text-white/85 hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  );
}
