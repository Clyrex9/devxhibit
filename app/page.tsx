"use client";

import Image from "next/image";
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import React from "react";

const animatedProjects = [
  { name: "DevXhibit Landing", img: "/screenshots/devxhibit-landing.png" },
  { name: "OpenAI Chatbot", img: "/screenshots/openai-chatbot.png" },
  { name: "Portfolio", img: "/screenshots/portfolio.png" },
  { name: "Blog Platform", img: "/screenshots/blog.png" },
  { name: "E-Ticaret", img: "/screenshots/ecommerce.png" },
  { name: "Weather App", img: "/screenshots/weather.png" },
];

// Scroll bar gizleme için global CSS
if (typeof window !== "undefined") {
  const styleId = "hide-scrollbar-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      body.hide-scrollbar::-webkit-scrollbar { display: none !important; }
      body.hide-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
    `;
    document.head.appendChild(style);
  }
}

function Rocket({ launch, direction, onProgress, onFinish }: { launch: boolean, direction: "up" | "down", onProgress: (y: number) => void, onFinish: () => void }) {
  const group = useRef<any>(null);
  const [yPos, setYPos] = useState(direction === "up" ? -4 : 10);
  useFrame((state, delta) => {
    if (launch && group.current) {
      let nextY = direction === "up"
        ? group.current.position.y + delta * 6
        : group.current.position.y - delta * 6;
      group.current.position.y = nextY;
      setYPos(nextY);
      onProgress(nextY);
      if (direction === "up" && nextY > 8) {
        onFinish();
      }
      if (direction === "down" && nextY < -4) {
        onFinish();
      }
    } else if (group.current) {
      group.current.position.y = direction === "up" ? -4 : 10;
      setYPos(group.current.position.y);
      onProgress(group.current.position.y);
    }
  });
  const { scene } = useGLTF("/models/rockets.glb");
  return <primitive ref={group} object={scene} scale={2.5} position={[0, direction === "up" ? -4 : 10, 0]} />;
}

function AnimatedRow({ direction, projects, speed, rowIdx }: { direction: "left" | "right"; projects: any[]; speed: number; rowIdx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let running = true;
    let last = performance.now();
    function animate(now: number) {
      if (!running) return;
      const delta = (now - last) / 16.67;
      last = now;
      setOffset((prev) => {
        let next = prev + (direction === "left" ? -speed : speed) * delta;
        if (Math.abs(next) > 320 * projects.length) return 0;
        return next;
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, [direction, speed, projects.length]);
  return (
    <div className="overflow-hidden w-full" style={{ height: 120 }}>
      <div
        ref={ref}
        className="flex gap-6"
        style={{
          transform: `translateX(${offset}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        {[...projects, ...projects].map((p, i) => (
          <div key={i} className={`bg-[#232323] rounded-xl shadow p-3 flex flex-col items-center min-w-[300px] max-w-[300px] border border-[#222] ${rowIdx === 1 ? "scale-110" : "opacity-80"}`}>
            <img src={p.img} alt={p.name} className="w-full h-16 object-cover rounded mb-2" />
            <span className="text-sm text-gray-100 font-semibold">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExampleProjects() {
  return (
    <section className="w-full min-h-[100vh] flex flex-col items-center justify-start bg-[#181818] pt-12 relative" id="example-projects">
      <div className="w-full flex flex-col gap-4 mt-32 mb-8 z-10">
        <AnimatedRow direction="left" projects={animatedProjects} speed={1.2} rowIdx={0} />
        <AnimatedRow direction="right" projects={animatedProjects} speed={1.5} rowIdx={1} />
        <AnimatedRow direction="left" projects={animatedProjects} speed={1.1} rowIdx={2} />
      </div>
    </section>
  );
}

// Animasyonlu Mouse İkonu
function AnimatedMouse({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center group"
      style={{ outline: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
      aria-label="Yukarı çık"
    >
      <div className="w-10 h-32 rounded-full border-4 border-gray-400 flex items-start justify-center relative animate-bounce">
        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 animate-mouse-scroll"></div>
      </div>
      <style>{`
        @keyframes mouse-scroll {
          0% { transform: translateY(0); opacity: 1; }
          70% { transform: translateY(20px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-mouse-scroll {
          animation: mouse-scroll 1.2s infinite;
        }
      `}</style>
    </button>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [logoHover, setLogoHover] = useState(false);
  const [rocketLaunch, setRocketLaunch] = useState(false);
  const [rocketDirection, setRocketDirection] = useState<"up" | "down">("up");
  const [showExamples, setShowExamples] = useState(false);
  const [rocketVisible, setRocketVisible] = useState(false);
  const [rocketProgress, setRocketProgress] = useState(-4);
  const [rocketFinished, setRocketFinished] = useState(false);
  const anaSayfaRef = useRef<HTMLDivElement>(null);
  const exampleRef = useRef<HTMLDivElement>(null);

  // Scroll tamamen engelleme
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!showExamples) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showExamples]);

  // Projeleri Keşfet butonu
  const scrollToExamples = () => {
    setRocketDirection("up");
    setRocketVisible(true);
    setRocketLaunch(true);
    setRocketFinished(false);
  };

  // Roket yukarı çıkıp kaybolunca örnek projeleri göster
  const handleRocketFinish = () => {
    setRocketVisible(false);
    setRocketFinished(true);
    setTimeout(() => {
      setShowExamples(true);
      setTimeout(() => {
        exampleRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }, 200);
  };

  // Roket yükselme ilerlemesiyle örnek projeleri göster
  useEffect(() => {
    if (rocketDirection === "up" && rocketProgress > 2) {
      setShowExamples(true);
    }
  }, [rocketProgress, rocketDirection]);

  // Üste Çık butonu
  const scrollToTop = () => {
    setShowExamples(false);
    setRocketDirection("down");
    setRocketVisible(true);
    setRocketLaunch(true);
    setRocketFinished(false);
    setTimeout(() => {
      anaSayfaRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // Roket aşağı inince ana sayfa görünümüne dön
  const handleRocketDownFinish = () => {
    setRocketVisible(false);
    setRocketFinished(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111] text-gray-100 font-sans relative overflow-x-hidden">
      {/* Ana Sayfa */}
      <section ref={anaSayfaRef} className="min-h-[100vh] flex flex-col">
        <header className="flex justify-between items-center px-8 py-6 z-20 relative">
          <div className="flex items-center gap-2">
            <a href="/" className="bg-[#222] rounded-lg p-2 transition" onMouseEnter={() => setLogoHover(true)} onMouseLeave={() => setLogoHover(false)}>
              <span className="text-2xl transition-all duration-200 select-none">{logoHover ? "{X}" : "{}"}</span>
            </a>
            <span className="text-xl font-bold">DevXhibit</span>
          </div>
          <nav className="flex gap-8 items-center text-base font-medium">
            <a href="/projects" className="hover:text-white transition">Projeler</a>
            <a href="/about" className="hover:text-white transition">Hakkında</a>
            <a href="/contact" className="hover:text-white transition">İletişim</a>
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
        <main className="flex flex-col items-center flex-1 justify-center text-center px-4 relative min-h-[100vh]">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-gray-200">Geliştiriciler Fikirlerini Sergiler</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8">Kişisel veya topluluk projelerini sergilemek için bir galeri</p>
          <button
            className="px-8 py-3 rounded bg-gray-700 hover:bg-gray-600 text-lg font-semibold mb-12 transition z-10"
            onClick={scrollToExamples}
            disabled={rocketVisible || showExamples}
          >
            Projeleri Keşfet
          </button>
          {/* Roket Animasyonu */}
          {rocketVisible && !rocketFinished && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[300px] h-[600px] pointer-events-none z-0">
              <Canvas style={{ background: "transparent", zIndex: 0 }} camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <Rocket
                  launch={rocketLaunch}
                  direction={rocketDirection}
                  onProgress={setRocketProgress}
                  onFinish={rocketDirection === "up" ? handleRocketFinish : handleRocketDownFinish}
                />
                <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
              </Canvas>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl mt-8">
            <div className="flex flex-col items-center bg-[#222] rounded-lg p-6">
              <TerminalRoundedIcon className="mb-2" style={{ fontSize: 44 }} />
              <span className="font-semibold">Geliştir</span>
            </div>
            <div className="flex flex-col items-center bg-[#222] rounded-lg p-6">
              <BuildRoundedIcon className="mb-2" style={{ fontSize: 44 }} />
              <span className="font-semibold">Güncelle</span>
            </div>
            <div className="flex flex-col items-center bg-[#222] rounded-lg p-6">
              <BarChartRoundedIcon className="mb-2" style={{ fontSize: 44 }} />
              <span className="font-semibold">İstatistik</span>
            </div>
            <div className="flex flex-col items-center bg-[#222] rounded-lg p-6">
              <StorefrontRoundedIcon className="mb-2" style={{ fontSize: 44 }} />
              <span className="font-semibold">Pazar Yeri</span>
            </div>
          </div>
        </main>
      </section>
      {/* Örnek Projeler Componenti */}
      <section
        ref={exampleRef}
        className="w-full min-h-[100vh] bg-[#181818] flex flex-col items-center justify-start relative"
        style={{
          opacity: rocketDirection === "up" && rocketProgress > -4 ? Math.min(1, (rocketProgress + 4) / 6) : showExamples ? 1 : 0,
          transform: rocketDirection === "up" && rocketProgress > -4 ? `translateY(${100 - Math.min(100, (rocketProgress + 4) * 20)}px)` : '100px',
          pointerEvents: showExamples ? 'auto' : 'none',
          transition: 'opacity 0.6s, transform 0.6s',
        }}
      >
        {showExamples && (
          <>
            <AnimatedMouse onClick={scrollToTop} />
            <ExampleProjects />
          </>
        )}
      </section>
      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-gray-500 border-t border-[#222] mt-8">
        <div className="mb-2 md:mb-0">©2025 DevXhibit   Tüm hakları saklıdır</div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Kullanım Şartları</a>
          <a href="#" className="hover:underline">Gizlilik Politikası</a>
        </div>
      </footer>
    </div>
  );
}
