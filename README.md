# 🧠 AILMS — AI-Powered Learning Management System (Demo Platform)

<div align="center">
  <p align="center">
    <b>A next-generation full-stack EdTech demo platform leveraging OpenAI GPT models for adaptive tutoring, personalized course authoring, and student collaboration.</b><br>
    Engineered with React 19, Vite, Tailwind CSS v4, Node.js (Express), Python (FastAPI), and Auth0.
  </p>

  <p align="center">
    <a href="https://github.com/Akshayjg2204/AILMS"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="Repository" /></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/Python_FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/OpenAI_GPT--4-412991?style=flat-square&logo=openai&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Auth0-EB5424?style=flat-square&logo=auth0&logoColor=white" />
  </p>
</div>

---

## ✨ Design & Engineering Highlights

- **🤖 Context-Aware AI Tutor:** Embedded GPT-powered conversational assistant capable of answering questions in the context of the active lesson, generating explanations, and creating on-demand practice quizzes.
- **📚 Dynamic Course Generation:** Intelligent course authoring pipeline that outlines syllabus modules, generates lesson summaries, and tailors difficulty curves to individual student performance.
- **📊 Real-Time Progress Analytics:** Interactive student and instructor dashboards tracking lesson completion velocity, retention scores, and assessment milestones.
- **👥 Collaborative Community Hub:** Integrated peer discussion forums, course question-and-answer threads, and shared study notes.
- **🔐 Enterprise Authentication:** Robust user session management using Auth0 with JWT verification across frontend and backend boundaries.
- **⚡ Microservices Architecture:** Decoupled architecture separating the responsive React frontend, high-throughput Express API gateway, and dedicated Python AI inference workers.

---

## 🛠️ Microservices Architecture & Tech Stack

| Service Layer | Technology | Architectural Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 19, Vite, Tailwind CSS v4, Framer Motion | High-performance SPA with concurrent rendering and fluid UI animations |
| **Component Primitives** | Radix UI, Material UI (MUI), Lucide Icons | Accessible headless components, dialogs, sliders, and navigation |
| **API Gateway** | Node.js, Express, Axios | REST routing, user profiles, enrollment records, and route middleware |
| **AI Inference Engine** | Python, FastAPI, LangChain, OpenAI API | Prompt engineering pipelines, quiz generation, and LLM streaming |
| **Authentication** | Auth0 (`@auth0/auth0-react`) | Secure token lifecycle, role-based access, and federated login |
| **Database** | MongoDB / Mongoose | Scalable NoSQL persistence for user profiles, courses, and chat history |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- Python 3.9+
- npm, pnpm, or yarn
- OpenAI API Key

### 1. Repository Clone
```bash
git clone https://github.com/Akshayjg2204/AILMS.git
cd AILMS
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Backend Setup
```bash
cd ../backend
npm install
# Configure your .env file with your PORT and OPENAI_API_KEY
npm run dev
```

### 4. Python AI Services Setup
```bash
cd ../python_services
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

---

## 👨‍💻 Author

**Akshay Gaikwad**  
Founder & Lead Engineer at [Streamline.dev](https://github.com/Streamline-dev0)  
- 🌐 Portfolio: [stream-line.dev](https://stream-line.dev/)  
- 💼 LinkedIn: [linkedin.com/in/akshayjgaikwad](https://www.linkedin.com/in/akshayjgaikwad/)  
- 🐙 GitHub: [@Akshayjg2204](https://github.com/Akshayjg2204)  