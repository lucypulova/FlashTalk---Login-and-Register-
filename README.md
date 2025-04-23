# FlashTalk – Instant Messenger

**FlashTalk** is a full-stack Instant Messenger application developed as a student project. It allows users to register, log in, and access a protected chat interface. The application is built with **React + Redux Toolkit (frontend)** and **Express + TypeScript (backend)**. Authentication is handled using **JWT** and **bcrypt**, and user data is stored in a local JSON file.

## ✨ Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and persistent login state
- Modular Express backend and React frontend
- Clean architecture and easy scalability

## 🛠️ Tech Stack

**Frontend:**
- React
- TypeScript
- Redux Toolkit
- redux-persist
- Vite

**Backend:**
- Node.js
- Express
- TypeScript
- bcrypt
- jsonwebtoken

  
## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/lucypulova/FlashTalk-Login-and-Register
cd flashtalk
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory with the following content:

```
JWT_SECRET=super-secret-key
SERVER_PORT=8080
SERVER_HOSTNAME=localhost
```

Ensure that `src/data/users.json` exists with either:

```json
[]
```

or predefined users for testing.

Start the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the **root** of the frontend directory (next to `package.json`):

```
VITE_API_URL=http://localhost:8080/api/
```

Start the frontend development server:

```bash
npm run dev
```

---

### ✅ Done!

You can now:
- Register a new user
- Log in
- Access the protected chat page

## 🧪 Test Users

Preloaded users exist in `users.json`. You can use them to test login functionality.

Example:

```makefile
email: lyudmila@example.com
password: pass1234
```

## 🔒 Protected Frontend Pages

Some pages in FlashTalk are accessible only to authenticated users. These protected routes ensure that sensitive content, like the chat interface, is not available to users without a valid session.

- For example, the route `/chat` requires the user to be logged in with a valid **JWT token**.
- Authentication state is managed via **Redux Toolkit**.
- Persistent login is achieved using **redux-persist**, so the user remains logged in even after refreshing the page.
- Navigation is controlled using **React Router DOM**, with a custom `ProtectedRoute` wrapper that checks if the user has access before rendering a page.

If the token is missing or invalid, users are automatically redirected to the login page.

---

## 🧱 Key Components

Below is a list of essential components that make up the authentication and routing logic:

- **`authRoutes.ts`**  
  Handles public API routes for user registration and login. It validates input, hashes passwords using bcrypt, and issues JWT tokens upon successful login.

- **`authMiddleware.ts`**  
  A middleware function that checks for a valid JWT token in the request headers. If valid, it adds the user information to the request object; otherwise, it blocks access to protected routes.

- **`protectedRoutes.ts`**  
  Contains backend API endpoints that require authentication. These routes are only accessible to users who have a verified token (e.g., `/me`, `/settings`, `/logout`).

- **`RegisterForm.tsx` / `LoginForm.tsx`**  
  React components that provide UI and logic for user registration and login. They include client-side validation and communicate with the backend via Axios.

- **`Chat.tsx`**  
  The main protected page available only to authenticated users. It displays personalized content (e.g., welcome message) and provides a logout option.

- **`ProtectedRoute.tsx`**  
  A custom wrapper for React routes that checks if a valid token is present in the Redux store. If the user is not authenticated, it redirects them to `/login`.

These components together form the foundation of FlashTalk's secure user authentication flow, and they ensure that only authorized users can access private features of the application.
