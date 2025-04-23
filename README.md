FlashTalk – Instant Messenger
FlashTalk is a full-stack Instant Messenger web application developed as a student project. It allows users to register, log in, and access a protected chat interface. The application is built with React + Redux Toolkit (frontend) and Express + TypeScript (backend), with authentication powered by JWT and bcrypt.

🔧 Features
User registration and login

JWT-based session management

Password hashing with bcrypt

Protected routes and persisted login state

Modular backend with Express

Frontend protected routing with Redux state

📦 Tech Stack
Frontend: React, TypeScript, Redux Toolkit, Vite

Backend: Node.js, Express, TypeScript

Auth: JWT, bcrypt

Storage: users.json file (no database)

Styling: CSS Modules

🚀 Getting Started
1. Clone the repository
git clone https://github.com/your-username/flashtalk.git
cd flashtalk

2. Backend Setup
cd backend
npm install

Create a .env file in the backend/ directory:
JWT_SECRET=super-secret-key
SERVER_PORT=3001
SERVER_HOSTNAME=localhost

Ensure src/data/users.json exists:
[]

Then run the backend server:
npm run dev

3. Frontend Setup
cd frontend
npm install

Create a .env file in the root of the project:
VITE_API_BASE_URL=http://localhost:3001/api

Then run the frontend:
npm run dev

📂 Folder Structure
flashtalk/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── data/
│   │   └── ...
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── ...
│   └── .env

✅ Example Users
Preloaded users exist in users.json. Example login:
email: lyudmila@example.com
password: pass1234
