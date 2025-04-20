"use client";
import Image from "next/image";
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("./components/Navbar"), { ssr: false });
import { getTranslation } from "./lib/i18n";
import { useLocale } from './lib/useLocale';
import type { Locale } from '../locales/types';

export default function Home() {
  const [locale] = useLocale();
  const router = useRouter();

  // ...existing hooks remain unchanged
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const buttonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ...rest of Home logic

  // Custom handler for button press animation
  function handleButtonPress(key: string, action: () => void) {
    setActiveButton(key);
    action();
    if (buttonTimeoutRef.current) clearTimeout(buttonTimeoutRef.current);
    buttonTimeoutRef.current = setTimeout(() => setActiveButton(null), 320);
  }

  // ---- RESTORE FULL HOMEPAGE CONTENT ----
  return (
    <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300">
      <Navbar />
      <div className="flex flex-col flex-1">
        <main className="flex flex-col items-center flex-1 justify-center text-center px-4 relative min-h-[100vh]">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-main">
            {getTranslation(locale, 'navbar', 'develop')}
          </h1>
          <p className="text-lg md:text-xl text-secondary mb-8">
            {getTranslation(locale, 'home', 'personal_or_community_projects')}
          </p>
          <button
            className="px-8 py-3 rounded bg-card hover:bg-main text-lg font-semibold mb-12 transition z-10"
            onClick={() => router.push('/projects')}
          >
            {getTranslation(locale, 'home', 'explore_projects')}
          </button>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl mt-8">
            {[
              { key: 'deploy', icon: <TerminalRoundedIcon className="mb-2" style={{ fontSize: 44 }} />, label: getTranslation(locale, 'navbar', 'deploy'), onClick: () => router.push('/deploy') },
              { key: 'update', icon: <BuildRoundedIcon className="mb-2" style={{ fontSize: 44 }} />, label: getTranslation(locale, 'home', 'update'), onClick: () => router.push('/update') },
              { key: 'statistics', icon: <BarChartRoundedIcon className="mb-2" style={{ fontSize: 44 }} />, label: getTranslation(locale, 'home', 'statistics'), onClick: () => {} },
              { key: 'marketplace', icon: <StorefrontRoundedIcon className="mb-2" style={{ fontSize: 44 }} />, label: getTranslation(locale, 'home', 'marketplace'), onClick: () => {} },
            ].map(btn => (
              <div
                key={btn.key}
                className={`flex flex-col items-center bg-card rounded-lg p-6 cursor-pointer transition-all duration-200 relative overflow-hidden \
                  ${activeButton === btn.key ? 'shadow-lg bg-main/70 after:animate-btnRipple' : 'hover:bg-main/80 hover:shadow-lg'}\
                `}
                onClick={() => handleButtonPress(btn.key, btn.onClick)}
                style={{ position: 'relative' }}
              >
                {btn.icon}
                <span className="font-semibold text-main">
                  {btn.label.charAt(0).toUpperCase() + btn.label.slice(1)}
                </span>
              </div>
            ))}
          </div>
          {/* Ripple Animation Style */}
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
        </main>
      </div>
      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-secondary border-t border-main mt-8 bg-footer transition-colors duration-300">
        <div className="mb-2 md:mb-0">
          {getTranslation(locale, 'footer', 'copyright')} 2025 DevXhibit
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">
            {getTranslation(locale, 'footer', 'terms_of_service')}
          </a>
          <a href="#" className="hover:underline">
            {getTranslation(locale, 'footer', 'privacy_policy')}
          </a>
        </div>
      </footer>
    </div>
  );
}

// ...rest of the file remains unchanged
