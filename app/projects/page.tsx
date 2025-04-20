"use client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useLocale } from "../lib/useLocale";
import { getTranslation } from "../lib/i18n";

const projects = [
  {
    id: "1",
    name: "DevXhibit Landing",
    description: "DevXhibit ana sayfa projesi.",
    author: "Ercan Yasin Yarmacı",
    github: "https://github.com/ercanyasin/devxhibit-landing",
    screenshot: "/screenshots/devxhibit-landing.png",
  },
  {
    id: "2",
    name: "OpenAI Chatbot",
    description: "Yapay zeka destekli sohbet botu.",
    author: "Muhammet Mahmut Atasever",
    github: "https://github.com/mahmuttatasever/openai-chatbot",
    screenshot: "/screenshots/openai-chatbot.png",
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [locale] = useLocale();
  return (
    <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300 font-sans">
      <Navbar />
      <main className="flex flex-col items-center flex-1 px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center text-main">
          {getTranslation(locale, 'navbar', 'projects')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-2xl shadow-xl p-8 flex flex-col h-full border border-main transition-colors duration-300"
            >
              <img src={project.screenshot} alt={project.name} className="w-full h-40 object-cover rounded-xl mb-4 bg-main" />
              <h2 className="text-xl font-bold mb-2 text-main">{project.name}</h2>
              <p className="text-secondary mb-2">{project.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-secondary">Yapan: <span className="font-semibold text-main">{project.author}</span></span>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Github</a>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-secondary border-t border-main mt-8 bg-footer transition-colors duration-300">
        <div className="mb-2 md:mb-0">{getTranslation(locale, 'footer', 'copyright')} 2025 DevXhibit   {getTranslation(locale, 'footer', 'allRightsReserved')}</div>
        <div>devxhibit.com</div>
      </footer>
    </div>
  );
}