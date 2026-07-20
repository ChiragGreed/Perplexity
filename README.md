# 🔍 AskBase— AI-Powered Chat Assistant

A full-stack, Perplexity-inspired AI chat application featuring real-time streaming responses, internet search capabilities, email sending via AI tools, user authentication with email verification, and persistent chat history.

---

## ✨ Features

### 🤖 AI & Intelligence
- **Streaming AI Responses** — Real-time token-by-token streaming powered by Google Gemini (`gemini-3.1-flash-lite`) via LangChain agents
- **Internet Search (RAG)** — AI can perform live web searches using **Tavily** for up-to-date news and real-time data
- **Email Sending Tool** — AI can compose and send HTML emails via SendGrid when prompted by the user
- **Chat Title Generation** — Automatic, concise chat titles generated using **Mistral AI** (`mistral-small-2603`)
- **Conversation Context** — Full message history passed to the AI for coherent multi-turn conversations

### 💬 Chat Management
- Create new chats with auto-generated titles
- View and switch between existing chat sessions
- Delete individual chat sessions
- Persistent message history stored in MongoDB
- Message timestamps

### 🔐 Authentication
- User registration with **email verification** (via SendGrid)
- JWT-based login with secure HTTP-only cookies
- Resend email verification with **rate limiting**
- Input validation using `express-validator` and `zod`
- Password hashing with `bcryptjs`
- Protected routes (frontend & backend)

### ⚡ Real-Time Communication
- **Socket.IO** integration for bidirectional real-time streaming
- Socket rooms per user session — responses scoped to the requesting user only (no broadcast leaks)

### 🎨 Frontend
- **React 19** + **Vite** for blazing-fast development
- **Redux Toolkit** for global state management (auth & chat slices)
- **Tailwind CSS v4** for utility-first styling
- **React Router v7** with protected route wrappers
- `react-markdown` for rich AI response rendering
- Responsive design across desktop and mobile screens
- Modular Chat UI components (Header, Footer, Deletion Confirmation)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Redux Toolkit, React Router v7, Tailwind CSS v4, Socket.IO Client |
| **Backend** | Node.js, Express v5, Socket.IO |
| **AI / LLM** | LangChain, Google Gemini (chat), Mistral AI (title gen) |
| **Search** | Tavily (internet search tool) |
| **Email** | SendGrid (`@sendgrid/mail`) |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT, bcryptjs, cookie-parser |
| **Validation** | express-validator, zod |
| **Rate Limiting** | express-rate-limit |

---

## 📁 Project Structure

```
Perplexity-extraction/
├── Backend/
│   ├── server.js                   # Entry point — Express + Socket.IO server
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       │   ├── auth.controller.js  # Register, login, verify email, resend
│       │   ├── chat.controller.js  # Create, fetch, delete chats & messages
│       │   └── public.controller.js
│       ├── middleware/             # JWT auth middleware
│       ├── models/
│       │   ├── userModel.js
│       │   ├── chatModel.js
│       │   └── messageModel.js
│       ├── routes/
│       │   ├── authRoute.js
│       │   ├── chatRoute.js
│       │   └── publicRoute.js
│       ├── services/
│       │   ├── ai.service.js       # LangChain agent, streaming, tool binding
│       │   ├── internet.service.js # Tavily search
│       │   ├── emailService.js     # SendGrid email sender
│       │   └── socket.service.js   # Socket.IO instance
│       └── validations/
│
└── Frontend/
    └── src/
        ├── App.jsx
        ├── AppRoutes.jsx           # Public vs. protected routing
        ├── AppStore.js             # Redux store
        └── Features/
            ├── Auth/               # Login, Register, hooks, state, services
            └── Chat/               # Dashboard, components, hooks, state, services
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login, receive JWT cookie |
| `GET` | `/verify-email/:token` | Verify email |
| `POST` | `/resend-verification` | Resend verification (rate-limited) |
| `POST` | `/logout` | Logout, clear cookie |

### Chat — `/api/chat` (Protected)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/query` | Send message, trigger AI stream |
| `GET` | `/chats` | List all user chats |
| `GET` | `/messages/:chatId` | Get messages for a chat |
| `DELETE` | `/:chatId` | Delete a chat |

---

## 🔄 Streaming Architecture

```
User sends message  →  POST /api/chat/query
                              │
                    LangChain Agent invoked
                              │
               ┌──────────────┴──────────────┐
     internet_Search (Tavily)         send_email (SendGrid)
               └──────────────┬──────────────┘
                              │
               Token chunks → socket.emit("ResponseChunk", chunk)
                              │
               Frontend appends chunks to UI in real time
                              │
               Final response saved to DB
               Mistral generates chat title
```

---

## 🛣️ Development Milestones

| Milestone | What Was Built |
|---|---|
| **Foundation** | Express, MongoDB, JWT auth, email verification |
| **AI Integration** | Google Gemini + LangChain, chat controller & routes |
| **Real-time Streaming** | Socket.IO; AI streams token chunks to client |
| **Internet Search** | Tavily tool; AI searches the web for live data |
| **Email Tool** | AI agent sends emails via SendGrid |
| **Chat Management** | Create, list, fetch, delete chats + persistence |
| **Title Generation** | Mistral AI auto-generates chat titles |
| **Frontend Foundation** | React + Vite + Redux + Router + Tailwind |
| **Auth UI** | Login/Register with validation & loading states |
| **Protected Routes** | Route guard; unauthenticated users redirected |
| **Chat UI** | Dashboard, streaming display, markdown rendering |
| **Component Refactor** | Modular Header, Footer, Deletion Confirmation |
| **Responsive Design** | Mobile-friendly layouts across all screens |
| **Email Verification Flow** | Resend verification with rate limiting |
| **Bug Fixes** | Socket scoping, duplicate chat prevention |
| **Deployment Prep** | Production URLs, public/dist tracking |

---

## 🔒 Security Highlights

- Passwords hashed with **bcryptjs**
- JWT in **HTTP-only cookies** (not localStorage)
- Email verification required before access
- Rate limiting on sensitive endpoints
- Socket responses scoped per-user via `socket.emit` (not `io.emit`)
- Input validation on all auth endpoints

---

## 📄 Looks

<img width="1917" height="967" alt="Screenshot 2026-07-20 180047" src="https://github.com/user-attachments/assets/37f6f0e3-b9f0-451d-abd6-d53655b6733e" />
<img width="1917" height="967" alt="Screenshot 2026-07-20 180039" src="https://github.com/user-attachments/assets/3b53c192-aab5-4fd0-b2c0-f14a7f6ae19a" />
<img width="1917" height="967" alt="Screenshot 2026-07-20 180104" src="https://github.com/user-attachments/assets/6d8fc4a8-5792-47bc-becd-3aabccd0f4ae" />
<img width="1917" height="967" alt="Screenshot 2026-07-20 180317" src="https://github.com/user-attachments/assets/b1d697b2-a519-4c84-9a5c-9ec794607205" />
<img width="1917" height="967" alt="Screenshot 2026-07-20 180929" src="https://github.com/user-attachments/assets/c2082a17-1c0c-48e3-9de3-69fa9de3bae4" />
