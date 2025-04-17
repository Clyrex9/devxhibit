"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [logoHover, setLogoHover] = useState(false);
  const [bio, setBio] = useState<string>("");
  const [repos, setRepos] = useState<any[]>([]);
  const [showRepos, setShowRepos] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const githubUsername = session?.user?.email?.split("@")[0] || session?.user?.name?.replace(/\s/g, "").toLowerCase();

  useEffect(() => {
    if (session?.user?.name) {
      fetch(`https://api.github.com/users/${githubUsername}`)
        .then(res => res.json())
        .then(data => setBio(data.bio || ""));
    }
  }, [session?.user?.name, githubUsername]);

  const fetchRepos = async () => {
    setLoadingRepos(true);
    const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`);
    const data = await res.json();
    setRepos(Array.isArray(data) ? data : []);
    setLoadingRepos(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-[#111] text-gray-100 font-sans">
        <Navbar />
        <main className="flex flex-col items-center flex-1 justify-center text-center px-4">
          <div className="bg-[#222] rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-xl mt-16">
            <h1 className="text-4xl font-extrabold mb-4 text-gray-100">Profil</h1>
            <p className="mb-6 text-gray-400">Profil bilgilerini görmek için giriş yapmalısın.</p>
            <button onClick={() => signIn("github")}
              className="px-8 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-lg font-semibold transition text-white shadow">
              Github ile Giriş
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#111] text-gray-100 font-sans">
      <Navbar />
      <main className="flex flex-col items-center flex-1 justify-center text-center px-4">
        <div className="bg-[#232323] rounded-2xl shadow-2xl p-10 flex flex-col items-center w-full max-w-2xl mb-10 border border-[#222] mt-8">
          <img src={session.user?.image || "https://github.com/identicons/github.png"} alt="Profil" className="w-28 h-28 rounded-full mb-6 border-4 border-[#181818] shadow-lg" />
          <h2 className="text-3xl font-extrabold mb-1 text-gray-100">{session.user?.name}</h2>
          <p className="text-gray-400 mb-2 text-lg">{session.user?.email}</p>
          {bio && <p className="text-gray-400 italic mb-6 text-center max-w-lg">{bio}</p>}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-2">
            <button
              onClick={() => {
                if (!showRepos) fetchRepos();
                setShowRepos(v => !v);
              }}
              className="flex-1 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow"
            >
              {showRepos ? "Repoları Gizle" : "Repo Listesini Göster"}
            </button>
            <button onClick={() => signOut()} className="flex-1 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition shadow">Çıkış Yap</button>
          </div>
        </div>
        {/* Github Repos */}
        {showRepos && (
          <div className="w-full max-w-2xl bg-[#181818] rounded-2xl p-8 mb-10 border border-[#222] shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-100">Github Repoları</h3>
            {loadingRepos ? (
              <div className="text-gray-400">Yükleniyor...</div>
            ) : repos.length === 0 ? (
              <div className="text-gray-400">Hiç repo bulunamadı.</div>
            ) : (
              <ul className="space-y-4">
                {repos.map((repo) => (
                  <li key={repo.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#232323] rounded-xl p-4 border border-[#222]">
                    <div className="mb-2 sm:mb-0">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline text-lg">{repo.name}</a>
                      <p className="text-xs text-gray-400 mt-1 max-w-md">{repo.description}</p>
                    </div>
                    <button
                      className="mt-2 sm:mt-0 ml-0 sm:ml-4 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow"
                      onClick={() => router.push("/develope")}
                    >Yükle</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* Siteye yüklenmiş projeler (placeholder) */}
        <div className="w-full max-w-2xl bg-[#181818] rounded-2xl p-8 border border-[#222] shadow-xl mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-100">Siteye Yüklenmiş Projeler</h3>
          <ul className="space-y-4">
            <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#232323] rounded-xl p-4 border border-[#222]">
              <div>
                <span className="font-semibold text-green-400 text-lg">devxhibit-landing</span>
                <p className="text-xs text-gray-400 mt-1">DevXhibit ana sayfa projesi</p>
              </div>
              <span className="mt-2 sm:mt-0 px-4 py-2 rounded-lg bg-gray-700 text-xs text-white">Yüklendi</span>
            </li>
            {/* Buraya gerçek projeler entegre edilebilir */}
          </ul>
        </div>
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