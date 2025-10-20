# Personal Portfolio for Denis Collette

See it live at: <https://denis-collette.netlify.app/>.

This is the official repository for my personal portfolio website, built with Astro and Tailwind CSS. The goal of this project is to showcase my skills, projects, and provide an interactive way to view my professional experience.

**For the Narratica project:**
[More information on the librivox API used specially for this portfolio.](https://librivox.org/api/info)

## 🚀 Project Setup

1. **Clone the repository (or download the files):**

    ```bash
    git clone https://github.com/denis-collette/personnal-portfolio.git
    cd personnal-portfolio
    ```

2. **Install dependencies:**
    This project uses `npm`. Run the following command in the root directory:

    ```bash
    npm install
    ```

3. **Run the development server:**
    To see the site locally, run:

    ```bash
    npm run dev
    ```

    This will start a local development server, typically at `http://localhost:4321`.

## 🛠️ Tech Stack

* **Framework:** [Astro](https://astro.build/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Deployment:** To be decided (e.g., Vercel, Netlify, AWS Amplify)

## ✨ Features

* **Home Page:** A welcoming introduction.
* **Interactive CV:** An innovative and engaging way to present my resume.
* **Project Showcase:** A gallery of my development work.
* **Contact Information:** Ways to get in touch with me.

<!--
personnal-portfolio/
- public/
-- baseline.png
-- favicon.ico
-- logo.png
-- logoFull.png
- src/
-- components/
--- CVTimeline.astro
--- Didlycthulhudoo.astro
--- HomepageSubNav.astro
--- Icon.astro
--- Narratica.astro
--- PokemiltonGame.astro
-- layouts/
--- Layout.astro
-- pages/
--- api/
---- librivox.js
--- cv.astro
--- index.astro
--- projects.astro
--- success.astro
-- projects/
--- didlycthulhudoo/
---- assets/
----- 404.mp3
----- 404.png
----- delete.mp3
----- hello.mp3
----- logo.png
----- turtle.png
---- App.jsx
---- CreateEvent.jsx
---- Event.jsx
---- Header.jsx
---- Home.jsx
---- NoPage.jsx
---- index.css
---- mockApi.js
--- narratica/
---- assets/
----- favicon.ico
---- components/
----- AudioPlayerBar.tsx
----- Card.tsx
----- NavBar.tsx
----- Profile.jsx
----- SearchBar.tsx
----- SkeletonCard.tsx
---- hooks/
----- useLocalStorage.js
---- safeZone/
----- Visualizer.tsx
---- styles/
----- narratica.css
---- App.jsx
---- BookDetail.jsx
---- Library.jsx
--- pokemilton/
---- Arena.js
---- Game.js
---- Master.js
---- Pokemilton.js
---- World.js 
-- styles/
--- global.css
- .gitignore
- astro.config.mjs
- package-lock.json
- package.json
- README.md
- tailwind.config.mjs
- tsconfig.json
-->