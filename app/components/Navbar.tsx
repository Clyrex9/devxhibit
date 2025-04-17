"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/projects", label: "Projeler" },
  { href: "/about", label: "Hakkında" },
  { href: "/contact", label: "İletişim" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [logoHover, setLogoHover] = useState(false);

  return (
    <header className="flex justify-between items-center px-8 py-6">
      <div className="flex items-center gap-2">
        <a href="/" className="bg-[#222] rounded-lg p-2 transition" onMouseEnter={() => setLogoHover(true)} onMouseLeave={() => setLogoHover(false)}>
          <span className="text-2xl transition-all duration-200 select-none">{logoHover ? "{X}" : "{}"}</span>
        </a>
        <span className="text-xl font-bold">DevXhibit</span>
      </div>
      <nav className="flex gap-8 items-center text-base font-medium">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={
              "hover:text-white transition" +
              (pathname === link.href ? " font-bold underline underline-offset-4" : "")
            }
          >
            {link.label}
          </a>
        ))}
        {session ? (
          <button
            className="ml-4 flex items-center gap-2 px-3 py-1 rounded bg-[#181818] hover:bg-[#222] border border-[#222] font-semibold transition"
            onClick={() => router.push("/profile")}
          >
            <img src={session.user?.image || "https://github.com/identicons/github.png"} alt="Profil" className="w-8 h-8 rounded-full" />
            <span className="hidden sm:block">{session.user?.name}</span>
          </button>
        ) : (
          <button
            className="ml-4 px-5 py-2 rounded bg-[#181818] hover:bg-[#222] border border-[#222] font-semibold transition flex items-center gap-2"
            onClick={() => signIn("github")}
          >
            <span className="animate-spin-slow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 5.06 20.17 9.26 21.5C9.86 21.59 10.08 21.27 10.08 21V19.13C6.73 19.91 6.14 17.73 6.14 17.73C5.59 16.36 4.81 16 4.81 16C3.69 15.22 4.89 15.24 4.89 15.24C6.11 15.33 6.74 16.5 6.74 16.5C7.81 18.32 9.61 17.81 10.28 17.54C10.37 16.77 10.68 16.27 11.03 15.98C8.41 15.69 5.64 14.74 5.64 10.5C5.64 9.32 6.08 8.36 6.8 7.61C6.69 7.32 6.32 6.18 6.89 4.65C6.89 4.65 7.78 4.34 10.08 5.78C10.93 5.54 11.84 5.42 12.75 5.42C13.66 5.42 14.57 5.54 15.42 5.78C17.72 4.34 18.61 4.65 18.61 4.65C19.18 6.18 18.81 7.32 18.7 7.61C19.42 8.36 19.86 9.32 19.86 10.5C19.86 14.75 17.08 15.68 14.45 15.97C14.91 16.34 15.31 17.09 15.31 18.18V21C15.31 21.27 15.53 21.6 16.13 21.5C20.33 20.17 23.39 16.42 23.39 12C23.39 6.48 18.91 2 12 2Z" fill="#fff"/>
              </svg>
            </span>
            <span className="hidden sm:block">Github ile Giriş</span>
          </button>
        )}
      </nav>
    </header>
  );
} 