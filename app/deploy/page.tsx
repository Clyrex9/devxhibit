"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Head from "next/head";

// Dummy language/framework detection (to be replaced with real logic)
function detectLanguage(repo: any) {
  // Example: return "Next.js" or "Node.js"
  if (!repo) return "";
  if (repo.language === "JavaScript" || repo.language === "TypeScript") {
    if (repo.topics?.includes("nextjs")) return "Next.js";
    if (repo.topics?.includes("react")) return "React";
    return "Node.js";
  }
  return repo.language || "Unknown";
}

const SERVER_REGIONS = [
  { code: "eu", label: "Europe" },
  { code: "us", label: "United States" },
  { code: "asia", label: "Asia" },
  { code: "tr", label: "Türkiye" },
];

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-8 h-2 rounded-full transition-all duration-300 ${
            i < step ? "bg-blue-600" : "bg-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

function LoadingDeploy() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg className="animate-spin h-16 w-16 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-xl text-gray-300 font-bold">Deploying your project...</p>
    </div>
  );
}

function FinalDashboard({ projectName, projectUrl, screenshotUrl, onMenuSelect, selectedMenu }: any) {
  const menu = [
    { key: "logs", label: "Logs" },
    { key: "deployment", label: "Deployment" },
    { key: "build", label: "Build" },
    { key: "environment", label: "Environment" },
  ];
  return (
    <div className="flex w-full">
      <aside className="w-48 min-h-[400px] bg-[#181818] rounded-2xl shadow-xl p-6 flex flex-col gap-4 mr-8">
        {menu.map((item) => (
          <button
            key={item.key}
            className={`text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${selectedMenu === item.key ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-blue-700 hover:text-white"}`}
            onClick={() => onMenuSelect(item.key)}
          >
            {item.label}
          </button>
        ))}
      </aside>
      <main className="flex-1 bg-[#232323] rounded-2xl p-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Deployment Complete!</h2>
        <a href={projectUrl} target="_blank" rel="noopener" className="text-blue-400 text-xl font-semibold mb-6 underline">{projectName}.xhibit.dev</a>
        <img src={screenshotUrl} alt="Project Screenshot" className="rounded-xl shadow-lg mb-8 w-full max-w-md" />
        <div className="text-gray-300 text-lg">Select a menu item on the left to view details.</div>
      </main>
    </div>
  );
}

export default function DeployPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1, 2, 3
  const [selectedRepo, setSelectedRepo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [detectedLang, setDetectedLang] = useState("");
  const [commands, setCommands] = useState({ install: "", build: "", start: "" });
  const [serverRegion, setServerRegion] = useState("eu");
  const [deploying, setDeploying] = useState(false);
  const [deployDone, setDeployDone] = useState(false);
  const [projectUrl, setProjectUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("https://placehold.co/600x400?text=Project+Screenshot");
  const [selectedMenu, setSelectedMenu] = useState("logs");
  const [warning, setWarning] = useState("");

  // Fetch repos
  useEffect(() => {
    if (session?.user) {
      setLoadingRepos(true);
      fetch("/api/github/repos")
        .then((res) => res.json())
        .then((data) => setRepos(Array.isArray(data) ? data : []))
        .finally(() => setLoadingRepos(false));
    }
  }, [session]);

  // Step 1: Choose repo & project name
  const step1 = (
    <div className="max-w-xl w-full mx-auto bg-[#181818] rounded-3xl shadow-2xl p-10 border border-[#232323] flex flex-col items-center">
      <StepIndicator step={1} total={3} />
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-100 tracking-tight leading-tight">Select Repository</h1>
      {warning && <div className="w-full mb-4"><div className="bg-red-700 text-white rounded-lg px-4 py-3 text-center font-bold">{warning}</div></div>}
      <label className="block w-full mb-6">
        <span className="text-lg text-gray-300 font-semibold">GitHub Repository</span>
        <select
          value={selectedRepo}
          onChange={(e) => {
            setSelectedRepo(e.target.value);
            setWarning("");
            const repo = repos.find((r) => r.full_name === e.target.value);
            setDetectedLang(detectLanguage(repo));
            setCommands({
              install: repo?.language === "Node.js" || repo?.language === "JavaScript" ? "npm install" : "",
              build: repo?.language === "Node.js" || repo?.language === "JavaScript" ? "npm run build" : "",
              start: repo?.language === "Node.js" || repo?.language === "JavaScript" ? "npm start" : "",
            });
          }}
          className="mt-2 block w-full rounded-2xl bg-[#232323] border border-[#333] text-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg px-5 py-4"
          required
        >
          <option value="">Select a repository</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.full_name} className="truncate">
              {repo.full_name}
            </option>
          ))}
        </select>
      </label>
      <label className="block w-full mb-8">
        <span className="text-lg text-gray-300 font-semibold">Project Name</span>
        <input
          type="text"
          value={projectName}
          onChange={(e) => { setProjectName(e.target.value); setWarning(""); }}
          className="mt-2 block w-full rounded-2xl bg-[#232323] border border-[#333] text-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg px-5 py-4"
          placeholder="Enter project name"
          required
        />
      </label>
      <button
        className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold transition duration-200 flex items-center justify-center gap-2 shadow-lg mt-4"
        onClick={() => {
          if (!selectedRepo) {
            setWarning("Please select a repository.");
            return;
          }
          if (!projectName) {
            setWarning("Please enter a project name.");
            return;
          }
          setWarning("");
          setStep(2);
        }}
      >
        Next
      </button>
    </div>
  );

  // Step 2: Detect language, commands, server region
  const step2 = (
    <div className="max-w-xl w-full mx-auto bg-[#181818] rounded-3xl shadow-2xl p-10 border border-[#232323] flex flex-col items-center">
      <StepIndicator step={2} total={3} />
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-100 tracking-tight leading-tight">Configure Build</h1>
      {warning && <div className="w-full mb-4"><div className="bg-red-700 text-white rounded-lg px-4 py-3 text-center font-bold">{warning}</div></div>}
      <div className="w-full mb-6">
        <span className="text-lg text-gray-300 font-semibold">Detected Language/Framework:</span>
        <span className="ml-2 text-blue-400 font-bold">{detectedLang}</span>
      </div>
      <label className="block w-full mb-4">
        <span className="text-lg text-gray-300 font-semibold">Install Command</span>
        <input
          type="text"
          value={commands.install}
          onChange={(e) => { setCommands({ ...commands, install: e.target.value }); setWarning(""); }}
          className="mt-2 block w-full rounded-2xl bg-[#232323] border border-[#333] text-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg px-5 py-4"
          placeholder="npm install"
        />
      </label>
      <label className="block w-full mb-4">
        <span className="text-lg text-gray-300 font-semibold">Build Command</span>
        <input
          type="text"
          value={commands.build}
          onChange={(e) => { setCommands({ ...commands, build: e.target.value }); setWarning(""); }}
          className="mt-2 block w-full rounded-2xl bg-[#232323] border border-[#333] text-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg px-5 py-4"
          placeholder="npm run build"
        />
      </label>
      <label className="block w-full mb-8">
        <span className="text-lg text-gray-300 font-semibold">Start Command</span>
        <input
          type="text"
          value={commands.start}
          onChange={(e) => { setCommands({ ...commands, start: e.target.value }); setWarning(""); }}
          className="mt-2 block w-full rounded-2xl bg-[#232323] border border-[#333] text-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg px-5 py-4"
          placeholder="npm start"
        />
      </label>
      <label className="block w-full mb-8">
        <span className="text-lg text-gray-300 font-semibold">Server Region</span>
        <select
          value={serverRegion}
          onChange={(e) => { setServerRegion(e.target.value); setWarning(""); }}
          className="mt-2 block w-full rounded-2xl bg-[#232323] border border-[#333] text-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg px-5 py-4"
        >
          {SERVER_REGIONS.map((region) => (
            <option key={region.code} value={region.code}>{region.label}</option>
          ))}
        </select>
      </label>
      <div className="flex w-full justify-between mt-4">
        <button
          className="py-3 px-8 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold transition duration-200 shadow-lg"
          onClick={() => { setWarning(""); setStep(1); }}
        >
          Back
        </button>
        <button
          className="py-3 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold transition duration-200 shadow-lg"
          onClick={() => {
            if (!commands.install || !commands.build || !commands.start) {
              setWarning("Please fill all command fields.");
              return;
            }
            setWarning("");
            setDeploying(true);
            setStep(3);
            setTimeout(() => {
              setDeploying(false);
              setDeployDone(true);
              setProjectUrl(`${projectName}.xhibit.dev`);
            }, 3000);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 3: Deploy & show results
  const step3 = deploying ? (
    <div className="max-w-xl w-full mx-auto bg-[#181818] rounded-3xl shadow-2xl p-10 border border-[#232323] flex flex-col items-center">
      <StepIndicator step={3} total={3} />
      <LoadingDeploy />
    </div>
  ) : (
    <FinalDashboard
      projectName={projectName}
      projectUrl={`https://${projectName}.xhibit.dev`}
      screenshotUrl={screenshotUrl}
      onMenuSelect={setSelectedMenu}
      selectedMenu={selectedMenu}
    />
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-[#111] flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 w-full">
          <div className="max-w-3xl w-full space-y-12 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-100 mb-6 tracking-tight leading-tight">Sign in to Deploy</h1>
            <button
              className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-2xl shadow-lg transition duration-200"
              onClick={() => router.push("/api/auth/signin/github")}
            >
              Sign in with GitHub
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-0">
        {step === 1 && step1}
        {step === 2 && step2}
        {step === 3 && step3}
      </main>
    </div>
  );
}