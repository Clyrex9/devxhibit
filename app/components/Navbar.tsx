"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLocale } from '../lib/useLocale';
import { getTranslation } from '../lib/i18n';
import type { Locale } from '../../locales/types';

const navLinks = [
  { href: "/deploy", labelKey: "develop" },
  { href: "/projects", labelKey: "projects" },
  { href: "/about", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [logoHover, setLogoHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // SSR-safe theme state
  const [theme, setTheme] = useState<'dark' | 'light' | undefined>(undefined);
  // Language state
  const [locale, setLocale] = useLocale();
  // Nav animation state (must be at top)
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const navButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedTheme = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    setTheme(storedTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(storedTheme);
    localStorage.setItem('theme', storedTheme);
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Avoid hydration mismatch: don't render until theme is set
  if (!theme) return null;

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  function handleNavButtonClick(href: string) {
    setActiveNav(href);
    handleNavClick(href);
    if (navButtonTimeoutRef.current) clearTimeout(navButtonTimeoutRef.current);
    navButtonTimeoutRef.current = setTimeout(() => setActiveNav(null), 320);
  }

  // Language selector dropdown
  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-navbar shadow-md border-b border-main">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-3 min-w-[170px]">
            <div
              onMouseEnter={() => setLogoHover(true)}
              onMouseLeave={() => setLogoHover(false)}
              onClick={() => router.push("/")}
              className={`relative flex items-center justify-center rounded-lg cursor-pointer transition-all duration-400 bg-navbar-logo${logoHover ? ' logo-glitch-bg' : ''}`}
              style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <span className={`absolute left-0 top-0 w-full h-full flex items-center justify-center text-3xl font-extrabold transition-all duration-300 ease-in-out select-none
                ${theme === 'dark' ? 'text-white' : logoHover ? 'text-white' : 'text-black'}
                ${logoHover ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
              `} style={{transitionProperty:'opacity, transform', userSelect: 'none'}}>
                {'{}'}
              </span>
              <span className={`absolute left-0 top-0 w-full h-full flex items-center justify-center text-3xl font-extrabold transition-all duration-300 ease-in-out select-none
                text-white
                ${logoHover ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-105 -translate-y-2'}
              `} style={{transitionProperty:'opacity, transform', userSelect: 'none'}}>
                {'{X}'}
              </span>
              <span className="invisible select-none">{'{X}'}</span>
            </div>
            <span className="text-xl font-bold select-none text-navbar-title tracking-tight">DevXhibit</span>
          </div>
          {/* Hamburger/X for mobile and tablet */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none relative z-50 ml-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(m => !m)}
          >
            <span className={`block w-7 h-0.5 bg-navbar-link rounded transition-all duration-300 mb-1 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-7 h-0.5 bg-navbar-link rounded transition-all duration-300 mb-1 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-7 h-0.5 bg-navbar-link rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
          {/* Center: Navigation Links (desktop) */}
          <div className="hidden lg:flex gap-2 lg:gap-5 items-center flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavButtonClick(link.href)}
                className={`px-4 py-2 rounded font-semibold transition-all duration-200 relative overflow-hidden
                  ${pathname === link.href ? 'text-navbar-link-active underline underline-offset-4' : 'text-navbar-link'}
                  ${activeNav === link.href ? 'shadow-lg bg-main/70 after:animate-btnRipple' : 'hover:bg-main/80 hover:shadow-lg'}
                `}
                style={{ position: 'relative', minWidth: 100 }}
              >
                {getTranslation(locale, 'navbar', link.labelKey)}
              </button>
            ))}
          </div>
          {/* Right: Language, Theme, Auth/Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Selector */}
            <select
              value={locale}
              onChange={e => setLocale(e.target.value as Locale)}
              className="px-2 py-1 rounded border border-main bg-navbar text-navbar-link text-sm focus:outline-none focus:ring-2 focus:ring-main/60"
              style={{minWidth:'80px'}}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.label}</option>
              ))}
            </select>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded p-2 text-navbar-link hover:bg-main/10 transition border border-transparent hover:border-main"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 0112.21 3a7 7 0 100 14A8.94 8.94 0 0021 12.79z" fill="currentColor"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" strokeWidth="2"><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></g></svg>
              )}
            </button>
            {/* Auth/Profile */}
            {session ? (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded bg-main/10 text-navbar-link font-semibold hover:bg-main/20 border border-main/30 transition"
                onClick={() => handleNavClick("/profile")}
              >
                <img src={session.user?.image || "https://github.com/identicons/github.png"} alt="Profil" className="w-8 h-8 rounded-full border border-main" />
                <span className="hidden sm:block max-w-[120px] truncate">{session.user?.name}</span>
              </button>
            ) : (
              <button
                className="ml-2 px-5 py-2 rounded bg-[#222] hover:bg-[#333] text-white border border-[#333] font-semibold transition flex items-center gap-2"
                onClick={() => signIn("github")}
              >
                <span className="animate-spin-slow">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 5.06 20.17 9.26 21.5C9.86 21.59 10.08 21.27 10.08 21V19.13C6.73 19.91 6.14 17.73 6.14 17.73C5.59 16.36 4.81 16 4.81 16C3.69 15.22 4.89 15.24 4.89 15.24C6.11 15.33 6.74 16.5 6.74 16.5C7.81 18.32 9.61 17.81 10.28 17.54C10.37 16.77 10.68 16.27 11.03 15.98C8.41 15.69 5.64 14.74 5.64 10.5C5.64 9.32 6.08 8.36 6.8 7.61C6.69 7.32 6.32 6.18 6.89 4.65C6.89 4.65 7.78 4.34 10.08 5.78C10.93 5.54 11.84 5.42 12.75 5.42C13.66 5.42 14.57 5.54 15.42 5.78C17.72 4.34 18.61 4.65 18.61 4.65C19.18 6.18 18.81 7.32 18.7 7.61C19.42 8.36 19.86 9.32 19.86 10.5C19.86 14.75 17.08 15.68 14.45 15.97C14.91 16.34 15.31 17.09 15.31 18.18V21C15.31 21.27 15.53 21.6 16.13 21.5C20.33 20.17 23.39 16.42 23.39 12C23.39 6.48 18.91 2 12 2Z" fill="#fff"/></svg>
                </span>
                <span className="hidden sm:block">Github ile Giriş</span>
              </button>
            )}
          </div>
        </nav>
        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-80 flex flex-col items-center justify-start pt-24 lg:hidden transition-all">
            <nav className="flex flex-col gap-8 items-center text-lg font-medium w-full">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={
                    "w-full text-left px-8 py-3 text-navbar-link hover:text-navbar-link-active transition" +
                    (pathname === link.href ? " text-navbar-link-active underline underline-offset-4" : "")
                  }
                >
                  {getTranslation(locale, 'navbar', link.labelKey)}
                </button>
              ))}
              {session ? (
                <button
                  className="w-full flex items-center gap-2 px-8 py-3 rounded bg-main/10 text-navbar-link font-semibold hover:bg-main/20 border border-main/30 transition"
                  onClick={() => handleNavClick("/profile")}
                >
                  <img src={session.user?.image || "https://github.com/identicons/github.png"} alt="Profil" className="w-8 h-8 rounded-full border border-main" />
                  <span>{session.user?.name}</span>
                </button>
              ) : (
                <button
                  className="w-full px-8 py-3 rounded bg-[#222] hover:bg-[#333] text-white border border-[#333] font-semibold transition flex items-center gap-2"
                  onClick={() => { setMenuOpen(false); signIn("github"); }}
                >
                  <span className="animate-spin-slow">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 5.06 20.17 9.26 21.5C9.86 21.59 10.08 21.27 10.08 21V19.13C6.73 19.91 6.14 17.73 6.14 17.73C5.59 16.36 4.81 16 4.81 16C3.69 15.22 4.89 15.24 4.89 15.24C6.11 15.33 6.74 16.5 6.74 16.5C7.81 18.32 9.61 17.81 10.28 17.54C10.37 16.77 10.68 16.27 11.03 15.98C8.41 15.69 5.64 14.74 5.64 10.5C5.64 9.32 6.08 8.36 6.8 7.61C6.69 7.32 6.32 6.18 6.89 4.65C6.89 4.65 7.78 4.34 10.08 5.78C10.93 5.54 11.84 5.42 12.75 5.42C13.66 5.42 14.57 5.54 15.42 5.78C17.72 4.34 18.61 4.65 18.61 4.65C19.18 6.18 18.81 7.32 18.7 7.61C19.42 8.36 19.86 9.32 19.86 10.5C19.86 14.75 17.08 15.68 14.45 15.97C14.91 16.34 15.31 17.09 15.31 18.18V21C15.31 21.27 15.53 21.6 16.13 21.5C20.33 20.17 23.39 16.42 23.39 12C23.39 6.48 18.91 2 12 2Z" fill="#fff"/></svg>
                  </span>
                  <span>Github ile Giriş</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
      <style jsx global>{`
        .after:after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 200%;
          height: 200%;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
        }
        .animate-btnRipple:after {
          animation: btnRippleAnim 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes btnRippleAnim {
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}