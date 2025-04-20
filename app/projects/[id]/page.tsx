"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const projects = [
  {
    id: "1",
    name: "DevXhibit Landing",
    description: "DevXhibit ana sayfa projesi.",
    author: "Ercan Yasin Yarmacı",
    github: "https://github.com/ercanyasin/devxhibit-landing",
    screenshot: "/screenshots/devxhibit-landing.png",
    repo: { owner: "ercanyasin", name: "devxhibit-landing" },
  },
  {
    id: "2",
    name: "OpenAI Chatbot",
    description: "Yapay zeka destekli sohbet botu.",
    author: "Muhammet Mahmut Atasever",
    github: "https://github.com/mahmuttatasever/openai-chatbot",
    screenshot: "/screenshots/openai-chatbot.png",
    repo: { owner: "mahmuttatasever", name: "openai-chatbot" },
  },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project?.repo) {
      setLoading(true);
      fetch(`https://api.github.com/repos/${project.repo.owner}/${project.repo.name}/readme`)
        .then((res) => res.json())
        .then((data) => {
          if (data.content) {
            setReadme(atob(data.content.replace(/\n/g, "")));
          } else {
            setReadme("README bulunamadı.");
          }
          setLoading(false);
        })
        .catch(() => {
          setReadme("README bulunamadı.");
          setLoading(false);
        });
    }
  }, [project]);

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center bg-main text-main transition-colors duration-300">Proje bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300 font-sans">
      <Navbar />
      <main className="flex flex-col items-center flex-1 px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center text-main">{project?.name || "Proje Detayı"}</h1>
        <div className="bg-card rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-2xl mb-10 border border-main">
          <img src={project.screenshot} alt={project.name} className="w-full h-56 object-cover rounded-xl mb-6 border border-main" />
          <h1 className="text-3xl font-extrabold mb-2 text-main">{project.name}</h1>
          <p className="text-secondary mb-2 text-lg">{project.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-secondary">Yapan: <span className="font-semibold text-main">{project.author}</span></span>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Github</a>
          </div>
        </div>
        <div className="w-full max-w-2xl bg-card rounded-2xl p-8 border border-main shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-main">README.md / Kodlar</h2>
          {loading ? (
            <div className="text-secondary">Yükleniyor...</div>
          ) : (
            <pre className="bg-main rounded-xl p-4 text-sm text-secondary overflow-x-auto whitespace-pre-wrap max-h-[500px] border border-main">
              {readme}
            </pre>
          )}
        </div>
      </main>
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-secondary border-t border-main mt-8 bg-footer transition-colors duration-300">
        <div className="mb-2 md:mb-0">2025 DevXhibit   Tüm hakları saklıdır</div>
        <div>devxhibit.com</div>
      </footer>
    </div>
  );
}