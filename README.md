# Candiview

Candiview is a **Next.js application** designed for managing **job applications, candidates, and interview assessments** in an interactive and efficient way. It enables **candidates** to track their applications and AI-powered assessments, while **interviewers** can review applicants, scores, and interview history — all in one place.

---

## 🌐 Live Demo

🔗 [Candiview on Vercel](https://candiview.vercel.app/)

---

## 🚀 Features

* 👨‍💻 **Candidate Dashboard** – Track applications, next interview steps, and AI-assessment results
* 📝 **Resume Upload & Parsing** – Upload resumes for structured data extraction
* 🤖 **AI-Powered Evaluation** – Automated candidate evaluation with scoring & summaries
* 🎯 **Interviewer Dashboard** – View candidates, filter by job roles, and access Q&A history
* 💾 Persistent application data using APIs (with Clerk authentication)
* ⚡ Built with **Next.js 14 (App Router)**
* 🎨 Clean, responsive UI with Tailwind CSS + ShadCN

---

## 🛠️ Tech Stack

* **Next.js** – Full-stack React framework
* **Clerk** – Authentication & user management
* **React Context API** – State management for applications and candidates
* **Tailwind CSS** – Styling
* **ShadCN/UI & Lucide Icons** – Modern UI components
* **API Routes** – Handle job status, applications, and assessments

---

## 📦 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/candiview.git
cd candiview
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🗂️ Project Structure

```
candiview/
├── app/                     # Next.js App Router pages
│   ├── dashboard/           # Candidate & Interviewer dashboards
│   ├── api/                 # API routes for jobs & applications
│   └── _components/         # Header, Footer, shared components
├── context/                 # React Context (Applications, Candidates)
├── providers/               # Theme & global providers
├── public/                  # Static assets (icons, images)
├── styles/                  # Global styles
└── package.json             # Dependencies and scripts
```

---

## 🌍 Deployment

Deploy easily on **Vercel**:

1. Push your project to GitHub
2. Import repo into [Vercel](https://vercel.com)
3. Add **Clerk environment variables** in Vercel dashboard
4. Get your live link instantly

For more info, check the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 📖 Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Clerk Authentication](https://clerk.com/docs)
* [React Context](https://react.dev/reference/react/useContext)
* [Tailwind CSS](https://tailwindcss.com)
* [ShadCN/UI](https://ui.shadcn.com)
