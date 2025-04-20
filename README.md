# DevXhibit

DevXhibit is a modern, open-source platform that allows developers to showcase, update, and deploy their GitHub projects with ease. It features a beautiful, multi-language UI, seamless GitHub integration, and a community-driven project gallery.

---

## 🎬 Demo & Update Videos

- **Project Demo:**  
  [![DevXhibit Demo](public/devxhibit.mp4)](public/devxhibit.mp4)
- **Update Feature:**  
  [![Update Demo](public/update.mp4)](public/update.mp4)

---

## ✨ Features

- **GitHub Integration:** Connect your GitHub account and instantly import your repositories.
- **Project Gallery:** Explore and discover projects from the community.
- **Deploy Projects:** Deploy your projects directly from the platform.
- **Update Projects:** Edit and update your deployed projects with a visual editor.
- **Multi-language:** Supports English, Turkish, German, and Arabic.
- **Profile Management:** View and manage your uploaded projects and GitHub repos.
- **Modern UI:** Responsive, themeable, and accessible interface using Tailwind CSS and MUI.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Configure environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your GitHub OAuth credentials.
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19, Tailwind CSS, MUI, Framer Motion
- **Auth:** next-auth (GitHub OAuth)
- **3D/Visuals:** three.js, @react-three/fiber, @react-three/drei
- **Editor:** Monaco Editor
- **API:** Octokit (GitHub API)
- **i18n:** Custom multi-language support

---

## 🔑 Authentication

- Sign in with GitHub to access all features (deploy, update, profile, etc.).
- Your GitHub access token is used securely for repository access and updates.

---

## 📦 Project Structure

- `/app` - Main Next.js app (pages, components, API routes)
- `/public` - Static assets (including demo/update videos)
- `/locales` - Multi-language support
- `/styles` - Global and Tailwind CSS
- `/types` - TypeScript types

---

## 👥 Team & Contributors

- Ercan Yasin Yarmacı ([ercanyasin](mailto:ercanyasin.yarmaci@gmail.com))
- Muhammet Mahmut Atasever ([mahmutt](mailto:mahmutt.atasever@gmail.com))
- Nihat Tunalı (Academic Advisor)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌐 Multi-Language

DevXhibit supports English, Turkish, German, and Arabic. You can switch languages from the UI.

---

## 📢 Contact

For support or questions, please contact the team members listed above or open an issue.

---

## ⭐️ Star the Project!
If you like DevXhibit, please give us a star on GitHub!
