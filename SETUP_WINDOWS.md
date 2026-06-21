# Windows Setup Guide — Yojana Sahayak

## Prerequisites (Install these FIRST if not already installed)

1. Node.js (v18 or above)
   Download: https://nodejs.org  → Click "LTS" version → Install
   After install, open Command Prompt and check: node --version

2. MongoDB Community Server
   Download: https://www.mongodb.com/try/download/community
   Install with default settings. MongoDB runs as a Windows service automatically.

3. VS Code
   Download: https://code.visualstudio.com

---

## Step 1 — Open the project in VS Code

1. Extract the ZIP file to a folder, e.g.: C:\Projects\yojana-sahayak
2. Open VS Code → File → Open Folder → select yojana-sahayak

---

## Step 2 — Setup BACKEND

Open a NEW terminal in VS Code (Terminal → New Terminal)

```
cd backend
npm install
```

This installs all these packages automatically (from package.json):
  - express          → Web server framework
  - mongoose         → MongoDB connection & models
  - bcryptjs         → Password hashing
  - jsonwebtoken     → JWT authentication
  - cors             → Allow frontend to call backend
  - dotenv           → Load .env config file
  - helmet           → Security headers
  - express-rate-limit → Prevent spam requests
  - express-validator  → Validate form inputs
  - morgan           → Request logging
  - @google/generative-ai → Gemini AI SDK
  - uuid             → Generate unique session IDs
  - nodemon          → Auto-restart server on file change (dev)

Then create your .env file:
```
copy .env.example .env
```

Open .env and set these values:
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/yojana-sahayak
  JWT_SECRET=mysecretkey123changeThis
  GEMINI_API_KEY=your_key_from_google_ai_studio

Get free Gemini API key at: https://aistudio.google.com/app/apikey

Seed the database with sample schemes:
```
npm run seed
```

Start the backend server:
```
npm run dev
```

You should see: "Yojana Sahayak server running on port 5000"

---

## Step 3 — Setup FRONTEND

Open a SECOND terminal in VS Code (click the + icon in terminal panel)

```
cd frontend
npm install
```

This installs all these packages (from package.json):
  - react            → UI library
  - react-dom        → Render React to browser
  - react-router-dom → Page routing (Chat, Home, Login etc.)
  - axios            → Make API calls to backend
  - react-hot-toast  → Show success/error notifications
  - framer-motion    → Smooth animations
  - lucide-react     → Icons
  - tailwindcss      → Utility CSS classes
  - vite             → Fast dev server & bundler
  - @vitejs/plugin-react → React support for Vite
  - autoprefixer     → CSS browser compatibility
  - postcss          → CSS processing

Start the frontend:
```
npm run dev
```

You should see: "Local: http://localhost:5173"

---

## Step 4 — Open in Browser

Go to: http://localhost:5173

---

## Running Both Together (Summary)

Terminal 1 (backend):
  cd backend
  npm run dev

Terminal 2 (frontend):
  cd frontend
  npm run dev

---

## Common Errors & Fixes

ERROR: 'node' is not recognized
  FIX: Install Node.js from nodejs.org and restart VS Code

ERROR: MongoDB connection failed
  FIX: Start MongoDB service:
       Press Win+R → type "services.msc" → find "MongoDB" → Start it
       OR run: net start MongoDB

ERROR: Port 5000 already in use
  FIX: Change PORT=5001 in your .env file

ERROR: npm install fails
  FIX: Run as administrator — right-click VS Code → "Run as administrator"

ERROR: Gemini API not working
  FIX: The app works without it using fallback responses. Just leave GEMINI_API_KEY blank.

---

## Folder Structure Explained

backend/
  server.js              ← Main entry point, starts Express server
  .env                   ← Your secret config (never share this)
  config/
    db.js                ← MongoDB connection
    gemini.js            ← Gemini AI setup
  models/
    User.js              ← User account schema
    Scheme.js            ← Government scheme schema
    Conversation.js      ← Chat history schema
    Notification.js      ← Alerts schema
  controllers/
    authController.js    ← Login, Register, Get user
    chatController.js    ← AI chat logic
    schemeController.js  ← Scheme CRUD & matching
    profileController.js ← Profile update
    notificationController.js ← Notifications
  routes/
    authRoutes.js        ← /api/auth/*
    chatRoutes.js        ← /api/chat/*
    schemeRoutes.js      ← /api/schemes/*
    profileRoutes.js     ← /api/profile/*
    notificationRoutes.js← /api/notifications/*
  middleware/
    auth.js              ← JWT token verification
    errorHandler.js      ← Global error handling
    validate.js          ← Input validation
  services/
    geminiService.js     ← Gemini AI response generation
    nlpService.js        ← Extract user info from chat text
    eligibilityService.js← Match user profile to schemes
  utils/
    seedSchemes.js       ← Add sample schemes to database

frontend/
  index.html             ← Root HTML file
  vite.config.js         ← Vite dev server config
  tailwind.config.js     ← Tailwind CSS colors & fonts
  postcss.config.js      ← PostCSS config
  src/
    main.jsx             ← React app entry point
    App.jsx              ← Routes setup
    index.css            ← Global styles + Tailwind
    context/
      AuthContext.jsx    ← Login state shared across app
      ChatContext.jsx    ← Chat messages shared across app
    hooks/
      useSpeech.js       ← Voice input (Web Speech API)
    services/
      api.js             ← All API calls to backend
    utils/
      session.js         ← Browser session ID
      helpers.js         ← Format currency, dates, colors
    pages/
      HomePage.jsx       ← Landing page
      ChatPage.jsx       ← AI chat interface
      SchemesPage.jsx    ← Browse all schemes
      SchemeDetailPage.jsx ← Single scheme details
      DashboardPage.jsx  ← User dashboard
      ProfilePage.jsx    ← Edit profile
      LoginPage.jsx      ← Login form
      RegisterPage.jsx   ← Register form
      NotificationsPage.jsx ← Alerts & reminders
    components/
      common/Navbar.jsx  ← Top navigation bar
      chat/
        ChatWindow.jsx   ← Full chat layout
        ChatBubble.jsx   ← Individual message bubble
        ChatInput.jsx    ← Text + voice input bar
        ProfileSidebar.jsx ← Extracted profile + matched schemes
      schemes/
        SchemeCard.jsx   ← Scheme list card
        SchemeFilter.jsx ← Filter sidebar
      dashboard/
        StatsCard.jsx    ← Stat number card
        SavedSchemes.jsx ← User saved schemes list
      profile/
        ProfileForm.jsx  ← Profile editing form
