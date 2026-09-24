# ⚡ AI Playground

A high-performance, multi-functional AI tool suite powered by **Next.js 15**, **TypeScript**, **Tailwind CSS**, and the **Groq API**. This application delivers ultra-fast AI responses for various everyday utility tasks with smart dynamic model fallback handling.

---

## 🚀 Live Demo

- **Hosted URL:** [Add your Cloudflare / Vercel link here]
- **Repository:** [https://github.com/YOUR_USERNAME/ai-playground](https://github.com/YOUR_USERNAME/ai-playground)

---

## ✨ Features

- 🔥 **Roast Engine:** Generates sharp, humorous, and witty roasts for social media posts or profiles.
- ✨ **Caption Generator:** Crafts engaging captions with trending hashtags for Instagram, TikTok, and LinkedIn.
- 💻 **Code Explainer:** Breaks down complex code snippets into simple, easy-to-understand explanations.
- 🎭 **Meme Idea Generator:** Produces creative meme concepts, top text, and bottom text ideas.
- 📝 **Smart Summarizer:** Condenses long essays, articles, or documentation into clear key bullet points.
- 🔄 **Dynamic Model Selection:** Automatically filters active Groq LLMs and handles fallback logic gracefully.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI SDK:** [Groq SDK](https://groq.com/)
- **Deployment:** Cloudflare Pages / Vercel

---

## 🏗️ Architecture & Key Concepts

1. **API Integration & Fallback Logic (`app/api/generate/route.ts`):**
   - Fetches available LLM models dynamically from the Groq API.
   - Filters out non-text models (e.g., audio, whisper, moderation, guardrail models).
   - Iterates through active text-generation models to ensure request completion even if a specific model gets decommissioned.

2. **Responsive UI Component (`app/page.tsx`):**
   - State-driven multi-tool tab selection.
   - Clean slate-themed Dark UI built using modern Tailwind utility classes.
   - Real-time loading indicator and error handling states.

---

## 📂 Project Structure

```text
ai-playground/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts       # Backend API endpoint handling Groq integration
│   ├── layout.tsx             # Root layout with hydration error suppression
│   ├── page.tsx               # Main UI component with multi-tool tabs
│   └── globals.css            # Global Tailwind CSS styles
├── public/                    # Static assets
├── .env.local                 # Local environment variables (API keys)
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
