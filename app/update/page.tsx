"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Octokit } from "octokit";
import Navbar from "../components/Navbar";
import InfoBox from "../components/InfoBox";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useLocale } from "../lib/useLocale";
import { getTranslation } from "../lib/i18n";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function UpdatePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [repoTree, setRepoTree] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [githubToken, setGithubToken] = useState<string>("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [locale] = useLocale();
  const theme = 'dark'; // Add this line

  // Fetch deployed projects (replace this with your actual logic)
  useEffect(() => {
    async function fetchProjects() {
      // TODO: Replace with your API call or logic
      setProjects([
        { name: "Example Project", repo: "username/example-repo" }
      ]);
    }
    fetchProjects();
  }, []);

  // Fetch repo tree from GitHub
  async function fetchRepoTree(repo: string) {
    setLoading(true);
    setError("");
    try {
      const octokit = new Octokit({ auth: githubToken });
      const [owner, repoName] = repo.split("/");
      const res = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
        owner,
        repo: repoName,
        tree_sha: "main",
        recursive: "true"
      });
      setRepoTree(res.data.tree.filter((item: any) => item.type === "blob"));
    } catch (e: any) {
      setError("Couldn't fetch repo tree. Check your GitHub token and repo name.");
      setRepoTree([]);
    }
    setLoading(false);
  }

  // Fetch file content from GitHub
  async function fetchFileContent(repo: string, path: string) {
    setLoading(true);
    setError("");
    try {
      const octokit = new Octokit({ auth: githubToken });
      const [owner, repoName] = repo.split("/");
      const res = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo: repoName,
        path
      });
      let content = '';
      if (!Array.isArray(res.data) && res.data.type === 'file' && 'content' in res.data) {
        content = atob((res.data.content || '').replace(/\n/g, ""));
      }
      setFileContent(content);
    } catch (e: any) {
      setError("Couldn't fetch file content. Check your GitHub token and repo name.");
      setFileContent("");
    }
    setLoading(false);
  }

  // Save file content to GitHub
  async function saveFileContent(repo: string, path: string, content: string) {
    setSaving(true);
    setError("");
    try {
      const octokit = new Octokit({ auth: githubToken });
      const [owner, repoName] = repo.split("/");
      // Get the SHA of the file
      const res = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo: repoName,
        path
      });
      const sha = Array.isArray(res.data) ? '' : res.data.sha;
      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo: repoName,
        path,
        message: `Update ${path} via DevXhibit`,
        content: btoa(unescape(encodeURIComponent(content))),
        sha
      });
      // Optionally show a success info box
    } catch (e: any) {
      setError("Couldn't update file. Check your GitHub token and repo permissions.");
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300">
      <Navbar />
      <main className="flex flex-col items-center flex-1 justify-center text-center px-2 sm:px-4 relative w-full">
        <h1 className="text-3xl font-bold mb-6 mt-8">{getTranslation(locale, 'update', 'update_deployed_project')}</h1>
        {/* Error InfoBox */}
        {error && <InfoBox message={error} type="error" />}
        {/* Show temporary page for non-logined users */}
        {status === "loading" ? (
          <div className="text-lg text-gray-300 mt-12">{getTranslation(locale, 'update', 'loading')}</div>
        ) : !session ? (
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto bg-card rounded-lg p-8 shadow-lg mt-10 mb-10 animate-fade-in text-main">
            <h2 className="text-2xl font-bold mb-4">{getTranslation(locale, 'update', 'login_required')}</h2>
            <p className="mb-6 text-secondary">{getTranslation(locale, 'update', 'login_to_update')}</p>
            <button
              className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold text-white text-lg"
              onClick={() => signIn("github")}
            >
              {getTranslation(locale, 'update', 'login_with_github')}
            </button>
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md mx-auto bg-card rounded-lg p-6 flex flex-col items-center shadow-lg text-main"
            >
              <h2 className="text-xl font-semibold mb-4">{getTranslation(locale, 'update', 'deployed_projects')}</h2>
              <ul className="w-full">
                {projects.map((proj, idx) => (
                  <li
                    key={proj.repo}
                    className={`p-3 rounded cursor-pointer hover:bg-[#333] mb-2 transition ${selectedProject?.repo === proj.repo ? 'bg-[#333] font-bold' : ''}`}
                    onClick={() => {
                      setSelectedProject(proj);
                      fetchRepoTree(proj.repo);
                      setSelectedFile("");
                      setFileContent("");
                      setStep(2);
                    }}
                  >
                    {proj.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex w-full max-w-6xl h-[600px] bg-card rounded-lg overflow-hidden shadow-lg text-main"
            >
              <div className="w-2/5 sm:w-1/5 bg-navbar border-r border-main p-4 overflow-y-auto min-w-[120px] max-w-[220px]">
                <button className="mb-4 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm font-semibold" onClick={() => setStep(1)}>
                  ← {getTranslation(locale, 'update', 'back')}
                </button>
                <h2 className="text-lg font-semibold mb-2 text-left">{getTranslation(locale, 'update', 'repo_files')}</h2>
                {loading && <div>{getTranslation(locale, 'update', 'loading')}</div>}
                <ul>
                  {repoTree.map((item: any) => (
                    <li
                      key={item.path}
                      className={`p-2 rounded cursor-pointer hover:bg-[#333] text-left truncate ${selectedFile === item.path ? 'bg-[#333]' : ''}`}
                      onClick={() => {
                        setSelectedFile(item.path);
                        fetchFileContent(selectedProject.repo, item.path);
                      }}
                    >
                      {item.path}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-3/5 sm:w-4/5 flex flex-col p-2 sm:p-4">
                <h2 className="text-lg font-semibold mb-2 text-left">{getTranslation(locale, 'update', 'code_editor')}</h2>
                {selectedFile ? (
                  <>
                    <div className="mb-2 text-sm text-secondary text-left">{selectedFile}</div>
                    <div className="flex-1 min-h-[240px] sm:min-h-[400px]">
                      <MonacoEditor
                        height={typeof window !== 'undefined' && window.innerWidth < 640 ? '220px' : '480px'}
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        language={selectedFile.endsWith('.js') ? 'javascript' : selectedFile.endsWith('.ts') ? 'typescript' : 'plaintext'}
                        value={fileContent}
                        onChange={v => setFileContent(v || "")}
                        options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
                      />
                    </div>
                    <button
                      className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold text-white disabled:opacity-50 self-start"
                      disabled={saving}
                      onClick={() => saveFileContent(selectedProject.repo, selectedFile, fileContent)}
                    >
                      {saving ? getTranslation(locale, 'update', 'saving') : getTranslation(locale, 'update', 'save_changes')}
                    </button>
                  </>
                ) : (
                  <div className="text-secondary text-left">{getTranslation(locale, 'update', 'select_file')}</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </main>
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-secondary border-t border-main mt-8 bg-footer transition-colors duration-300">
        <div className="mb-2 md:mb-0">{getTranslation(locale, 'update', 'copyright')}</div>
        <div>{getTranslation(locale, 'update', 'website')}</div>
      </footer>
    </div>
  );
}
