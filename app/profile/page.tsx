"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useLocale } from "../lib/useLocale";
import { getTranslation } from "../lib/i18n";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [logoHover, setLogoHover] = useState(false);
  const [bio, setBio] = useState<string>("");
  const [repos, setRepos] = useState<any[]>([]);
  const [showRepos, setShowRepos] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [locale] = useLocale();
  const [showProjectNameModal, setShowProjectNameModal] = useState(false);
  const [pendingRepo, setPendingRepo] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");

  // Use new authenticated API route for fetching repos
  const githubUsername = session?.user?.name;

  useEffect(() => {
    if (session?.user) {
      fetchRepos();
      fetch(`/api/github/user`)
        .then(res => res.json())
        .then(data => setBio(data.bio || ""));
    }
  }, [session]);

  const fetchRepos = async () => {
    setLoadingRepos(true);
    try {
      const res = await fetch("/api/github/repos");
      const data = await res.json();
      setRepos(Array.isArray(data) ? data : []);
    } catch (error) {
      setRepos([]);
    }
    setLoadingRepos(false);
    setShowRepos(true);
  };

  function handleLoadRepo(repoName: string) {
    setPendingRepo(repoName);
    setShowProjectNameModal(true);
  }

  function handleContinue() {
    if (pendingRepo && projectName.trim()) {
      setShowProjectNameModal(false);
      router.push(`/deploy?step=2&repo=${encodeURIComponent(projectName.trim())}`);
      setProjectName("");
      setPendingRepo(null);
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300 font-sans">
        <Navbar />
        <main className="flex flex-col items-center flex-1 justify-center text-center px-4">
          <div className="bg-card rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-xl mt-16 border border-main">
            <h1 className="text-4xl font-extrabold mb-4 text-main">
              {getTranslation(locale, 'profile', 'title')}
            </h1>
            <p className="mb-6 text-secondary">
              {getTranslation(locale, 'profile', 'description')}
            </p>
            <button onClick={() => signIn("github")}
              className="px-8 py-3 rounded-lg bg-main hover:bg-main transition-colors duration-300 text-lg font-semibold text-secondary shadow">
              {getTranslation(locale, 'profile', 'signInButton')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-main text-main transition-colors duration-300 font-sans">
      <Navbar />
      <main className="flex flex-col items-center flex-1 justify-center text-center px-4">
        <div className="bg-card rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-2xl mb-10 border border-main mt-8">
          <img src={session.user?.image || "https://github.com/identicons/github.png"} alt="Profil" className="w-28 h-28 rounded-full mb-6 border-4 border-main shadow-lg" />
          <h2 className="text-3xl font-extrabold mb-1 text-main">{session.user?.name}</h2>
          <p className="text-secondary mb-2 text-lg">{session.user?.email}</p>
          {bio && <p className="text-secondary italic mb-6 text-center max-w-lg">{bio}</p>}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-2">
            <button
              onClick={() => setShowRepos(v => !v)}
              className="flex-1 px-6 py-2 rounded-lg bg-main hover:bg-main transition-colors duration-300 text-white font-semibold shadow"
            >
              {showRepos ? getTranslation(locale, 'profile', 'hideReposButton') : getTranslation(locale, 'profile', 'showReposButton')}
            </button>
            <button onClick={() => signOut()} className="flex-1 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition shadow">
              {getTranslation(locale, 'profile', 'signOutButton')}
            </button>
          </div>
        </div>
        {/* Github Repos */}
        {showRepos && (
          <div className="w-full max-w-2xl bg-card rounded-2xl p-8 mb-10 border border-main shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-main">
              {getTranslation(locale, 'profile', 'githubReposTitle')}
            </h3>
            {loadingRepos ? (
              <div className="text-secondary">{getTranslation(locale, 'profile', 'loadingRepos')}</div>
            ) : repos.length === 0 ? (
              <div className="text-secondary">{getTranslation(locale, 'profile', 'noReposFound')}</div>
            ) : (
              <ul className="space-y-4">
                {repos.map((repo) => (
                  <li key={repo.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card rounded-xl p-4 border border-main">
                    <div className="mb-2 sm:mb-0">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline text-lg">{repo.name}</a>
                      <p className="text-xs text-secondary mt-1 max-w-md">{repo.description}</p>
                    </div>
                    <button
                      className="mt-2 sm:mt-0 ml-0 sm:ml-4 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow"
                      onClick={() => handleLoadRepo(repo.name)}
                    >
                      {getTranslation(locale, 'profile', 'loadButton')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* Siteye yüklenmiş projeler (placeholder) */}
        <div className="w-full max-w-2xl bg-card rounded-2xl p-8 border border-main shadow-xl mb-8">
          <h3 className="text-2xl font-bold mb-6 text-main">
            {getTranslation(locale, 'profile', 'loadedProjectsTitle')}
          </h3>
          <ul className="space-y-4">
            <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card rounded-xl p-4 border border-main">
              <div>
                <span className="font-semibold text-green-400 text-lg">devxhibit-landing</span>
                <p className="text-xs text-secondary mt-1">DevXhibit ana sayfa projesi</p>
              </div>
              <span className="mt-2 sm:mt-0 px-4 py-2 rounded-lg bg-gray-700 text-xs text-white">
                {getTranslation(locale, 'profile', 'loadedStatus')}
              </span>
            </li>
            {/* Buraya gerçek projeler entegre edilebilir */}
          </ul>
        </div>
      </main>
      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-8 py-6 text-sm text-secondary border-t border-main mt-8 bg-footer transition-colors duration-300">
        <div className="mb-2 md:mb-0">2025 DevXhibit   {getTranslation(locale, 'footer', 'copyright')}</div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">{getTranslation(locale, 'footer', 'termsOfUse')}</a>
          <a href="#" className="hover:underline">{getTranslation(locale, 'footer', 'privacyPolicy')}</a>
        </div>
      </footer>
      {showProjectNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-card p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col items-center">
            <h4 className="text-xl font-bold mb-4 text-main">{getTranslation(locale, 'profile', 'enterProjectName')}</h4>
            <input
              className="w-full px-4 py-2 rounded border border-main mb-4 text-main bg-main/10 focus:outline-none"
              placeholder="Project Name"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={handleContinue}
                disabled={!projectName.trim()}
              >
                {getTranslation(locale, 'profile', 'continueButton')}
              </button>
              <button
                className="flex-1 px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white font-semibold"
                onClick={() => { setShowProjectNameModal(false); setProjectName(""); setPendingRepo(null); }}
              >
                {getTranslation(locale, 'profile', 'cancelButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}