# Manus AI | Memory-Driven Companion Agent

Manus AI is an advanced conversational agent designed to simulate long-term memory, emotional intelligence, and dynamic personality evolution. Unlike standard chatbots that forget you the moment you refresh the page, Manus actively studies your conversational patterns, tracks your emotional state, and builds a permanent psychological profile of you to dynamically curate an AI persona tailored specifically to your needs.

![Glassmorphism UI](https://img.shields.io/badge/UI-Glassmorphism-8b5cf6?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Prisma%20%7C%20Redis-10b981?style=flat-square)

---

## 🚀 The Core Innovation: 3-Tiered Memory System

This project implements a sophisticated multi-layer memory architecture to achieve true AI persistence:

1. **Short-Term Context (PostgreSQL):** Immediate conversational flow and recent chat history are instantly pulled into the LLM context so the AI never loses its train of thought during an active session.
2. **Long-Term Semantic Memory (Hindsight + Redis BullMQ):** Every conversation is asynchronously vectorized and stored in Hindsight via a background worker queue. This allows the AI to recall specific facts or nuances from weeks ago without blocking the instant UI response.
3. **Deep Psychological Profiling (Meta-Layer):** The backend actively analyzes the user's syntax, emotional signals (e.g., stressed, playful, reflective), and pacing. It generates a permanent `UserMemoryProfile` that governs how the AI will communicate with the user in the future (e.g., providing *grounding reassurance* vs *thoughtful introspection*).

---

## 🛠️ Tech Stack

### Frontend
- **React 19 + Vite**: Lightning-fast modern frontend.
- **Tailwind CSS v4**: Premium dark-mode glassmorphism aesthetics.
- **Framer Motion**: Fluid micro-animations.

### Backend
- **Node.js + Express**: Core API handling and business logic.
- **Prisma 7**: Database ORM with PostgreSQL driver adapter.
- **BullMQ + Redis**: Event-driven background task processing to prevent API latency during vector embedding.
- **Groq LLM**: High-speed, low-latency inference engine.
- **Vectorize Hindsight**: Specialized vector database for semantic memory retrieval.

---

## 🧠 System Architecture

```mermaid
graph TD
    A[React Frontend] -->|REST API| B(Express Backend)
    B -->|Fetch History| C[(PostgreSQL DB)]
    B -->|Fetch Profile| C
    B -->|Search Memories| D[Hindsight Vector DB]
    B -->|LLM Inference| E[Groq AI]
    B -->|Offload Task| F[Redis Queue]
    F -->|Process Async| G(BullMQ Worker)
    G -->|Embed & Store| D
    G -->|Profile Analysis| C
```

---

## ⚙️ Local Development Setup

Follow these steps to run the project locally.

### 1. Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL running locally (port 5432)
- Redis server running locally (port 6379)

### 2. Environment Variables
Create a `.env` file in the `/backend` folder with the following keys:
```env
PORT=5000
DATABASE_URL=postgresql://admin:admin@localhost:5432/ai_memory
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key
HINDSIGHT_API_KEY=your_hindsight_api_key
```

*(No `.env` is strictly required for the frontend during local dev, it will default to `localhost:5000`)*

### 3. Initialize the Backend
```bash
cd backend
npm install
npx prisma db push    # Push schema to Postgres
node seed.js          # Create initial User & Avatar IDs
npm run dev           # Start the Express API
```

### 4. Start the Background Worker
Open a **second terminal** window. The background worker is critical for processing memories asynchronously.
```bash
cd backend
npm run worker
```

### 5. Start the Frontend
Open a **third terminal** window.
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser!

---

## 🌐 Deployment Guide (Hackathon Ready)

Because this architecture utilizes persistent databases and background workers, it cannot be hosted entirely on "Serverless" platforms like Vercel.

1. **Database:** Host PostgreSQL on **Neon.tech** or **Supabase**.
2. **Queue:** Host Redis on **Upstash**.
3. **Backend & Worker:** Host the Node.js API on **Render.com** or **Railway**. *Note: You must deploy the backend twice on Render—once as a Web Service (for the API) and once as a Background Worker (for the BullMQ listener).*
4. **Frontend:** Host the React app on **Vercel**. You must set the `VITE_API_URL` environment variable in Vercel to point to your live Render API URL.

---

## 🔮 Hackathon Demo Flow
1. **Show the UI:** Highlight the premium glassmorphism, dynamic glowing borders, and modern chat interface.
2. **Show the Memory Recall:** Ask the AI a question, tell it a specific fact, and then ask it to recall that fact later. Point out the glowing "Brain Radar" UI element that triggers when memory is used.
3. **Show the Asynchronous Worker:** Keep a terminal window visible showing the Worker processing the vector embedding *after* the fast AI response has already been delivered to the UI.
4. **Show the Psychological Profile:** Navigate to the "Profile" page to reveal the hidden AI metrics: the user's Communication Style, Emotional Maturity, and Support Needs calculated by the system.
