"use client";
import React from "react";
import Navbar from "../components/Navbar";
import { useLocale } from "../lib/useLocale";
import { getTranslation } from "../lib/i18n";

export default function About() {
  const [locale] = useLocale();
  return (
    <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300 font-sans">
      <Navbar />

      {/* Orta Alan */}
      <main className="flex flex-col items-center flex-1 justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-main">
          {getTranslation(locale, 'navbar', 'about')}
        </h1>
        <p className="text-lg md:text-xl text-secondary mb-8 max-w-2xl">
          <span className="font-bold text-main">{getTranslation(locale, 'about', 'devxhibit')}</span>, {getTranslation(locale, 'about', 'description')} <span className="text-blue-400">{getTranslation(locale, 'about', 'github')}</span> {getTranslation(locale, 'about', 'description2')} {getTranslation(locale, 'about', 'callToAction')}!
        </p>
        <div className="bg-main rounded-lg p-6 max-w-2xl mb-8">
          <span className="text-xl font-semibold text-green-400">{getTranslation(locale, 'about', 'githubConnect')}</span>
        </div>
        <button className="px-8 py-3 rounded bg-main hover:bg-main transition duration-200 text-lg font-semibold text-main">{getTranslation(locale, 'about', ' sergile')}</button>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-secondary border-t border-main mt-8 bg-footer transition-colors duration-300">
        <div className="mb-2 md:mb-0">{getTranslation(locale, 'footer', 'copyright')}  DevXhibit   {getTranslation(locale, 'footer', 'rightsReserved')}</div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">{getTranslation(locale, 'footer', 'termsOfUse')}</a>
          <a href="#" className="hover:underline">{getTranslation(locale, 'footer', 'privacyPolicy')}</a>
        </div>
      </footer>
    </div>
  );
} 