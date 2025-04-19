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
import Navbar from "./components/Navbar";

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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [neonColors, setNeonColors] = useState<string[]>([]);

  useEffect(() => {
    setNeonColors(Array(projects.length * 2).fill(0).map(() => randomNeon()));
  }, [projects.length]);

  useEffect(() => {
    let running = true;
    let last = performance.now();
    function animate(now: number) {
      if (!running) return;
      if (hoveredIdx === null) {
        const delta = (now - last) / 16.67;
        last = now;
        setOffset((prev) => {
          let next = prev + (direction === "left" ? -speed : speed) * delta;
          if (Math.abs(next) > 320 * projects.length) return 0;
          return next;
        });
      } else {
        last = now;
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, [direction, speed, projects.length, hoveredIdx]);

  function randomNeon() {
    const colors = [
      '#39ff14', // neon green
      '#00ffff', // neon cyan
      '#ff073a', // neon red
      '#faff00', // neon yellow
      '#ff00ea', // neon pink
      '#00ffea', // neon blue
      '#ff8c00', // neon orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

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
          <div
            key={i}
            className={`bg-[#232323] rounded-xl shadow p-3 flex flex-col items-center min-w-[300px] max-w-[300px] border border-[#222] ${rowIdx === 1 ? "scale-110" : "opacity-80"}`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={
              hoveredIdx === i
                ? {
                    background: neonColors[i],
                    boxShadow: `0 0 24px 6px ${neonColors[i]}, 0 0 48px 12px ${neonColors[i]}77`,
                    borderColor: neonColors[i],
                    transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
                  }
                : { transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s' }
            }
          >
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
      <div className="w-8 h-16 rounded-full border-4 border-gray-400 flex items-start justify-center relative animate-bounce">
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
      <Navbar />
      <div ref={anaSayfaRef} className="flex flex-col flex-1">
        {/* Removed duplicate header here; Navbar handles all navigation and branding */}
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
            <div className="flex flex-col items-center bg-[#222] rounded-lg p-6 cursor-pointer hover:bg-[#2a2a2a] transition-colors" onClick={() => router.push('/deploy')}>
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
      </div>
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
        <div className="mb-2 md:mb-0">2025 DevXhibit   Tüm hakları saklıdır</div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Kullanım Şartları</a>
          <a href="#" className="hover:underline">Gizlilik Politikası</a>
        </div>
      </footer>
    </div>
  );
}
