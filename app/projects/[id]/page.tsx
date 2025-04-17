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
    return <div className="min-h-screen flex items-center justify-center bg-[#111] text-gray-100">Proje bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#111] text-gray-100 font-sans">
      <Navbar />
      <main className="flex flex-col items-center flex-1 px-4 py-8">
        <div className="bg-[#232323] rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-2xl mb-10 border border-[#222]">
          <img src={project.screenshot} alt={project.name} className="w-full h-56 object-cover rounded-xl mb-6 border border-[#181818]" />
          <h1 className="text-3xl font-extrabold mb-2 text-gray-100">{project.name}</h1>
          <p className="text-gray-400 mb-2 text-lg">{project.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-300">Yapan: <span className="font-semibold text-white">{project.author}</span></span>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Github</a>
          </div>
        </div>
        <div className="w-full max-w-2xl bg-[#181818] rounded-2xl p-8 border border-[#222] shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">README.md / Kodlar</h2>
          {loading ? (
            <div className="text-gray-400">Yükleniyor...</div>
          ) : (
            <pre className="bg-[#232323] rounded-xl p-4 text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap max-h-[500px] border border-[#222]">
              {readme}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
} 