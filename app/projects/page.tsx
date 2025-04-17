"use client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

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
  return (
    <div className="min-h-screen flex flex-col bg-[#111] text-gray-100 font-sans">
      <Navbar />
      <main className="flex flex-col items-center flex-1 px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-center">Projeler Sergisi</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#232323] rounded-2xl shadow-xl p-4 flex flex-col cursor-pointer hover:scale-105 transition border border-[#222] group"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <img src={project.screenshot} alt={project.name} className="w-full h-40 object-cover rounded-xl mb-4 border border-[#181818] group-hover:opacity-90" />
              <h2 className="text-2xl font-bold mb-2 text-gray-100">{project.name}</h2>
              <p className="text-gray-400 mb-2">{project.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-gray-300">Yapan: <span className="font-semibold text-white">{project.author}</span></span>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Github</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 