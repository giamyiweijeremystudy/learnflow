# LearnFlow — Deployment Guide
## GitHub + Cloudflare Pages · Step-by-Step

---

## 📁 File Structure Overview

```
learnflow/
│
├── index.html                  ← HTML entry point
├── vite.config.js              ← Build config
├── package.json                ← Dependencies
├── wrangler.toml               ← Cloudflare config
├── .gitignore
│
├── public/
│   ├── favicon.svg
│   └── _redirects              ← SPA routing for Cloudflare Pages
│
├── functions/
│   └── _middleware.js          ← Cloudflare Pages middleware (security headers)
│
└── src/
    ├── main.jsx                ← React entry point
    ├── App.jsx                 ← Router + shell (MAIN FILE)
    │
    ├── data/
    │   └── DATA.js             ← All data models, mock data, utilities
    │
    ├── styles/
    │   └── GRAPHICS.js         ← Colors, fonts, CSS strings, icons
    │
    ├── utils/
    │   └── AuthContext.jsx     ← Auth state & login/register logic
    │
    ├── components/
    │   ├── UI.jsx              ← Shared components (Button, Modal, Input…)
    │   ├── Sidebar.jsx         ← Navigation sidebar
    │   └── CourseCard.jsx      ← Reusable course card
    │
    └── pages/
        ├── AuthPage.jsx        ← Login & Register
        ├── Dashboard.jsx       ← Home dashboard
        ├── ExplorePage.jsx     ← Search & discovery
        ├── CourseView.jsx      ← Student course viewer
        ├── CourseEditor.jsx    ← Teacher course editor
        └── TeachPage.jsx       ← Teacher management hub
```

---

## 🚀 Step 1 — Set Up GitHub Repository

### 1.1 Create a new GitHub repo
1. Go to **https://github.com/new**
2. Name it `learnflow` (or anything you like)
3. Set it to **Public** (required for free Cloudflare Pages)
4. **Do NOT** initialize with README (you'll push existing files)
5. Click **Create repository**

### 1.2 Push your code

Open your terminal in the `learnflow/` project folder:

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial LearnFlow skeleton"

# Add your GitHub repo as origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/learnflow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub.

---

## ☁️ Step 2 — Deploy to Cloudflare Pages

### 2.1 Connect GitHub to Cloudflare Pages

1. Go to **https://dash.cloudflare.com**
2. In the left sidebar, click **Workers & Pages**
3. Click **Create Application** → **Pages** tab
4. Click **Connect to Git**
5. Authorize Cloudflare to access your GitHub account
6. Select your `learnflow` repository
7. Click **Begin setup**

### 2.2 Configure Build Settings

In the "Set up builds and deployments" screen:

| Setting | Value |
|---|---|
| **Project name** | `learnflow` |
| **Production branch** | `main` |
| **Framework preset** | `None` (or Vite — either works) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | *(leave blank)* |

### 2.3 Environment Variables (optional for now)

No environment variables are needed for the skeleton. Later when you add Cloudflare D1 or Workers Auth, you'll add them here.

### 2.4 Deploy!

Click **Save and Deploy**. 

Cloudflare will:
1. Clone your GitHub repo
2. Run `npm run build`
3. Deploy `dist/` to their global CDN

This takes ~60 seconds. You'll get a URL like:  
`https://learnflow-abc123.pages.dev`

---

## 🔁 Step 3 — Automatic Deployments (CI/CD)

Every time you push to `main`, Cloudflare Pages will **automatically redeploy**:

```bash
# Make a change, then:
git add .
git commit -m "Updated course card design"
git push
```

→ Cloudflare detects the push and rebuilds within ~1 minute.

**Preview Deployments**: Any push to a non-`main` branch creates a preview URL automatically.

---

## 💻 Step 4 — Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
```

Visit `http://localhost:5173`

**Demo login credentials:**
- Teacher: `alex@example.com` / `password123`
- Student: `jamie@example.com` / `password123`

---

## 🌐 Step 5 — Custom Domain (optional)

1. In Cloudflare Pages → your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g. `learnflow.yourdomain.com`)
4. If your domain is already on Cloudflare DNS: it auto-configures
5. If not: add a CNAME record pointing to your Pages URL

---

## 📋 Making Changes — Copy & Paste Workflow

The project is organized so you can paste entire files into Claude:

| Want to change... | Edit this file |
|---|---|
| Colors, fonts, animations, icons | `src/styles/GRAPHICS.js` |
| Data models, mock data, course logic | `src/data/DATA.js` |
| Login / auth logic | `src/utils/AuthContext.jsx` |
| Buttons, modals, inputs, shared UI | `src/components/UI.jsx` |
| Navigation sidebar | `src/components/Sidebar.jsx` |
| Course cards | `src/components/CourseCard.jsx` |
| App routing & shell | `src/App.jsx` |
| Login / register page | `src/pages/AuthPage.jsx` |
| Student dashboard | `src/pages/Dashboard.jsx` |
| Search & discovery | `src/pages/ExplorePage.jsx` |
| Course viewer (student) | `src/pages/CourseView.jsx` |
| Course editor (teacher) | `src/pages/CourseEditor.jsx` |
| Teacher management hub | `src/pages/TeachPage.jsx` |

---

## 🗺️ Roadmap — What to Build Next

### Phase 2 — Real Backend (Cloudflare Workers + D1)
- [ ] Replace `MOCK_USERS` with Cloudflare D1 database
- [ ] Add JWT auth via Cloudflare Workers
- [ ] Image uploads via Cloudflare R2
- [ ] Real-time features via Cloudflare Durable Objects

### Phase 3 — Learning Features
- [ ] Rich text editor (Tiptap or Quill)
- [ ] Video embedding (YouTube, Vimeo)
- [ ] Progress tracking & certificates
- [ ] Interactive code playgrounds
- [ ] Discussion threads per lesson
- [ ] AI-powered quiz generation

### Phase 4 — Social & Admin
- [ ] Class rosters & student progress dashboard
- [ ] Announcements & messaging
- [ ] Course analytics (completion rates, quiz scores)
- [ ] Co-teacher invite system

---

## ❓ Troubleshooting

**Build fails on Cloudflare?**
- Check the build logs in the Cloudflare Pages dashboard
- Make sure `Build command` is `npm run build`
- Make sure `Output directory` is `dist`

**Page shows blank after deploy?**
- Verify `public/_redirects` file exists with content: `/* /index.html 200`
- This is what makes React Router work correctly

**Routes 404 on refresh?**
- Same fix: ensure `_redirects` file is in the `public/` folder

**Local dev errors?**
- Run `npm install` first
- Make sure Node.js >= 18 is installed
