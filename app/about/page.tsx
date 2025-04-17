import React from "react";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#111] text-gray-100 font-sans">
      <Navbar />

      {/* Orta Alan */}
      <main className="flex flex-col items-center flex-1 justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-gray-200">Projelerini Dünyayla Paylaş!</h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
          <span className="font-bold text-white">DevXhibit</span>, geliştiricilerin kendi projelerini kolayca <span className="text-blue-400">Github</span> üzerinden çekip sergileyebileceği, toplulukla paylaşabileceği modern bir platformdur. Kendi projeni ekle, başkalarının projelerini keşfet, ilham al ve yazılım topluluğunun bir parçası ol!
        </p>
        <div className="bg-[#222] rounded-lg p-6 max-w-2xl mb-8">
          <span className="text-xl font-semibold text-green-400">Sadece bir tıkla Github hesabını bağla, projelerin otomatik olarak galeride yerini alsın!</span>
        </div>
        <button className="px-8 py-3 rounded bg-gray-700 hover:bg-gray-600 text-lg font-semibold transition">Projeni Hemen Sergile</button>
      </main>

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