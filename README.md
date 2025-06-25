# AILMS - AI Learning Management System

AILMS is an AI-powered learning platform using GPT models for personalized education, course management and community collaboration. Built with React and microservices, it enables students to learn, manage courses and interact seamlessly.

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- OpenAI API Key

## Installation

### 1. Frontend Setup
```bash
cd frontend
npm install
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Python Services Setup
```bash
cd python_services
python -m venv venv
# For Windows
venv\Scripts\activate
# For Unix or MacOS
source venv/bin/activate
pip install -r requirements.txt
```

## Environment Setup

1. Create `.env` file in backend directory:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

2. Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000
VITE_CHATBOT_URL=http://localhost:8002
```

## Running the Application

1. Start the Frontend:
```bash
cd frontend
npm run dev
```

2. Start the Backend:
```bash
cd backend
npm start
```

3. Start the Python Services:
```bash
cd python_services
# Activate virtual environment first, then:
python proxy.py
```

4. Start the Chatbot Service:
```bash
cd python_services/chatbot
python main.py
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Chatbot Service: http://localhost:8002
- API Gateway: http://localhost:8000

## Features

1. AI Learning Assistant
2. Course Management
3. Community Tools
4. Modern Interface

## Deployment

For deployment on Netlify:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Set the following build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add your environment variables in Netlify dashboard

## Support

For any issues or questions, please open an issue in the GitHub repository. 