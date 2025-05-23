"use client";
import React, { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import Navbar from "../components/Navbar";
import { useLocale } from "../lib/useLocale";
import { getTranslation } from "../lib/i18n";

const MIN_SCALE = 2.5;
const MAX_SCALE = 8;

function PhoneModel({ autoRotate, scale }: { autoRotate: boolean; scale: number }) {
  const group = useRef<any>();
  const { scene } = useGLTF("/models/landline_phone.glb");
  useFrame((state, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.5;
    }
  });
  return <primitive ref={group} object={scene} scale={scale} />;
}

const team = [
  {
    name: "Ercan Yasin Yarmacı",
    email: "ercanyasin.yarmaci@gmail.com",
    img: "/creators/yasinfoto.png",
    bg: "bg-main",
  },
  {
    name: "Muhammet Mahmut Atasever",
    email: "mahmutt.atasever@gmail.com",
    img: "/creators/muhammetfoto.png",
    bg: "bg-main",
  },
  {
    name: "Nihat Tunalı",
    email: "nihat.tunali@ege.edu.tr",
    img: "/creators/nihathocafoto.png",
    bg: "bg-main",
  },
];

function TeamCard({ name, email, img, bg }: { name: string; email: string; img: string; bg: string }) {
  return (
    <div className={`group relative w-48 h-64 rounded-xl overflow-hidden shadow-xl ${bg} flex items-center justify-center transition-transform hover:scale-105 cursor-pointer`}>
      <img
        src={img}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover rounded-xl z-10 transition-opacity duration-300 group-hover:opacity-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://img.icons8.com/ios-filled/100/000000/image.png';
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-main/60 z-20">
        <span className="text-lg font-bold text-main mb-2 text-center px-2">{name}</span>
        <span className="text-sm text-secondary text-center px-2">{email}</span>
      </div>
    </div>
  );
}

export default function Contact() {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [mouseOn, setMouseOn] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(4.5);
  const [locale] = useLocale();

  // Scroll ile zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!mouseOn) return;
      e.preventDefault();
      setScale((prev) => {
        let next = prev - e.deltaY * 0.01;
        if (next < MIN_SCALE) next = MIN_SCALE;
        if (next > MAX_SCALE) next = MAX_SCALE;
        return next;
      });
    },
    [mouseOn]
  );

  return (
    <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300 font-sans">
      <Navbar />

      {/* 3D Telefon Modeli */}
      <div className="flex flex-col items-center justify-center w-full py-8">
        <div
          className="relative rounded-xl shadow-2xl p-4"
          style={{ width: 520, height: 420, margin: "0 auto", background: "transparent", boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)" }}
          onWheel={handleWheel}
        >
          {/* Mouse On Toggle */}
          <button
            className={`absolute top-3 right-3 z-30 px-4 py-1 rounded-full text-sm font-semibold transition bg-main border border-main shadow ${mouseOn ? "text-green-400" : "text-secondary"}`}
            onClick={() => setMouseOn((v) => !v)}
          >
            Mouse {mouseOn ? "Açık" : "Kapalı"}
          </button>
          <Canvas camera={{ position: [0, 0, 3] }} style={{ background: "transparent" }} shadows>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <Suspense fallback={null}>
              <Stage environment={null} intensity={0.6} shadows={false} preset={undefined} adjustCamera={false}>
                <PhoneModel autoRotate={autoRotate} scale={scale} />
              </Stage>
              <OrbitControls
                enablePan={false}
                enableZoom={mouseOn}
                enableRotate={mouseOn}
                autoRotate={autoRotate}
                onStart={() => setAutoRotate(false)}
                onEnd={() => setAutoRotate(false)}
                enableDamping
                dampingFactor={0.1}
                rotateSpeed={0.7}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Orta Alan */}
      <main className="flex flex-col items-center flex-1 justify-center px-4 py-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-main">
          {getTranslation(locale, 'contact', 'heading')}
        </h1>
        {/* Yapanlar Card Grid */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {team.map((person) => (
            <TeamCard key={person.email} {...person} />
          ))}
        </div>
        <div className="bg-main rounded-lg p-6 max-w-2xl w-full mb-8 text-left mx-auto flex flex-col items-center">
          <img src="/egelogo.png" alt="Ege Üniversitesi Logo" className="w-32 h-32 mb-4 object-contain" />
          <p className="mb-2"><span className="font-bold text-main">{getTranslation(locale, 'contact', 'institution')}</span> Ege Üniversitesi Bergama Meslek Yüksekokulu</p>
          <p className="mb-2"><span className="font-bold text-main">{getTranslation(locale, 'contact', 'contactInfo')}</span> Nihat Tunalı (Öğretim Görevlisi)</p>
        </div>
        <form className="bg-main rounded-lg p-6 max-w-2xl w-full flex flex-col gap-4 mx-auto" method="POST" action="mailto:nihat.tunali@ege.edu.tr">
          <label className="text-left font-semibold">{getTranslation(locale, 'contact', 'name')}
            <input type="text" name="name" required className="mt-1 w-full p-2 rounded bg-main/50 border border-main text-main focus:outline-none focus:border-blue-500" />
          </label>
          <label className="text-left font-semibold">{getTranslation(locale, 'contact', 'email')}
            <input type="email" name="email" required className="mt-1 w-full p-2 rounded bg-main/50 border border-main text-main focus:outline-none focus:border-blue-500" />
          </label>
          <label className="text-left font-semibold">{getTranslation(locale, 'contact', 'message')}
            <textarea name="message" required rows={5} className="mt-1 w-full p-2 rounded bg-main/50 border border-main text-main focus:outline-none focus:border-blue-500" />
          </label>
          <button type="submit" className="mt-2 px-8 py-3 rounded bg-gray-700 hover:bg-gray-600 text-lg font-semibold transition">{getTranslation(locale, 'contact', 'send')}</button>
        </form>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-secondary border-t border-main mt-8 bg-footer transition-colors duration-300">
        <div className="mb-2 md:mb-0">{getTranslation(locale, 'footer', 'copyright')} 2025 DevXhibit</div>
        <div>devxhibit.com</div>
      </footer>
    </div>
  );
}

// GLTF loader için gerekli
// yarn add three @react-three/fiber @react-three/drei
// veya npm install three @react-three/fiber @react-three/drei

// GLTF loader için gerekli
// yarn add three @react-three/fiber @react-three/drei
// veya npm install three @react-three/fiber @react-three/drei 