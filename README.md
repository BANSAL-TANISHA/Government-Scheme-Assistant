<div align="center">

# 🏛️ Yojana Sahayak — योजना सहायक

### AI-Powered Government Scheme Eligibility Assistant for Indian Citizens

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat&logo=mongodb)](https://mongodb.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)

> *"Tell us about yourself — we'll find the right government scheme for you."*

**Live Demo:** `http://localhost:5173` &nbsp;|&nbsp; **API Base:** `http://localhost:5000/api`

</div>

---

## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [What is Yojana Sahayak?](#-what-is-yojana-sahayak)
3. [Key Features](#-key-features)
4. [How It Works — End to End Flow](#-how-it-works--end-to-end-flow)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [Database Models](#-database-models)
8. [API Endpoints](#-api-endpoints)
9. [AI & NLP Engine](#-ai--nlp-engine)
10. [Eligibility Matching Engine](#-eligibility-matching-engine)
11. [Frontend Pages & Components](#-frontend-pages--components)
12. [Installation & Setup](#-installation--setup)
13. [Environment Variables](#-environment-variables)
14. [Data Source](#-data-source)
15. [Future Scope](#-future-scope)

---

## 🔴 Problem Statement

India has **4000+ government welfare schemes** launched by Central and State Governments — covering scholarships, farmer subsidies, women empowerment, housing, health, startups, pensions, and more.

Yet **a majority of eligible citizens never receive these benefits** because:

| Problem | Reality |
|---|---|
| **Lack of Awareness** | Citizens don't know which schemes exist for them |
| **Complex Eligibility** | Legal language is hard to understand |
| **Multiple Portals** | Each ministry/state has a different website |
| **Language Barriers** | Portals are mostly in English or formal Hindi |
| **Missed Deadlines** | No reminders for application opening/closing dates |
| **Dependency on Middlemen** | Agents/CSC operators charge fees or give wrong info |

**Result:** Government funds go unutilized. Students miss scholarships. Farmers miss subsidies. Women miss financial assistance.

---

## 💡 What is Yojana Sahayak?

**Yojana Sahayak (योजना सहायक)** is a full-stack AI-powered web application that acts as a **digital welfare assistant** for Indian citizens.

Instead of navigating complex government portals, users simply **have a conversation** — in Hindi, English, or Hinglish — and the AI:

- Understands who they are (age, gender, state, occupation, income, caste)
- Matches them with relevant government schemes from a database of 1000+ schemes
- Explains WHY they are eligible or not eligible
- Provides document checklists and direct application links
- Saves their profile for future instant recommendations
- Sends deadline alerts and reminders

### In One Line:
> *An AI-powered digital social worker, available 24×7, that helps every Indian citizen discover, understand, and access the government schemes they are entitled to — simply by having a conversation.*

---

## ✨ Key Features

### 🤖 1. Conversational AI Chat
- Users chat naturally in **Hindi, English, or Hinglish**
- AI extracts profile data automatically from conversation — no forms to fill
- Powered by **Google Gemini AI** with intelligent offline fallback
- Persistent chat history across sessions for logged-in users
- Chat session maintained using unique session IDs for guest users

### 🎙️ 2. Voice Input (Web Speech API)
- Users can **speak** instead of type
- Supports Hindi (`hi-IN`) and English voice recognition
- Ideal for rural users, elderly citizens, and low-literacy populations
- Live transcript shown in input box while speaking

### 🎯 3. Smart Eligibility Matching Engine
- Matches user profile against **1000+ government schemes**
- Uses a **multi-layer matching system:**
  - Layer 1: Hard eligibility checks (age, gender, income, state, category)
  - Layer 2: Occupation keyword matching (student, farmer, women, self-employed etc.)
  - Layer 3: Relevance scoring — most relevant schemes shown first
  - Layer 4: Exclusion logic — student scholarships never shown to farmers, other-state schemes excluded
- Returns: Eligible schemes, Partially eligible schemes, and reasons for each

### 📊 4. Explainable Recommendations
- Every scheme result shows **WHY you qualify**:
  - ✅ Age within range
  - ✅ Gender matches
  - ✅ Income within limit
  - ✅ Scheme specific to your state
- And **WHY you don't qualify** for others:
  - ❌ Only for SC/ST category
  - ❌ Only available in Maharashtra
  - ❌ Income exceeds ₹2.5 lakh limit
- Builds **transparency and trust** with citizens

### 🔍 5. Scheme Browser with Filters
- Browse all 1000+ schemes with filters:
  - Category (Education, Agriculture, Women, Health, Housing, etc.)
  - Government Level (Central / State)
  - Keyword Search
  - Pagination
- Each scheme card shows: Name, Category, Benefits, Ministry, Direct Apply Link

### 👤 6. User Profile System
- Register/Login with email and password (JWT authentication)
- Complete profile form with: Age, Gender, State, Occupation, Income, Category, Education, Marital Status, Disability
- Profile data used for **instant scheme matching** without re-chatting
- Saved schemes and applied schemes tracking
- Preferred language setting

### 🔖 7. Save & Track Schemes
- Bookmark any scheme for later reference
- Mark schemes as "Applied" to track application status
- Dashboard shows all saved and applied schemes at a glance

### 🔔 8. Notifications System
- Deadline alerts for saved schemes
- New scheme alerts based on user profile
- Read/unread notification management
- Mark all read in one click

### 📱 9. Dashboard
- Personal stats: Saved schemes count, Applied schemes count
- Quick actions: Chat, Browse, Profile
- Profile completion indicator
- Recent saved schemes list

### 🏠 10. Landing Page
- Category-wise quick access (8 categories with icons)
- Example queries to help users get started
- Feature highlights and value proposition
- Call-to-action for registration

### 📄 11. Scheme Detail Page
- Full scheme information: Name, Hindi name, Ministry, Description
- Benefits section with amount highlighted
- Eligibility criteria listed clearly
- Documents required checklist (all documents listed)
- How to Apply step-by-step process
- **Direct Apply Button** → Opens exact scheme page on MyScheme.gov.in
- "Ask AI" button → Takes user to chat with scheme context
- "Mark as Applied" button → Tracks in user profile

### 🔐 12. Authentication & Security
- JWT (JSON Web Token) based authentication
- bcrypt password hashing (12 salt rounds)
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS protection
- Input validation on all API endpoints

---

## 🔄 How It Works — End to End Flow

```
USER OPENS APP
     │
     ▼
┌─────────────────────────────────────┐
│         LANDING PAGE                │
│  - Browse categories                │
│  - See example queries              │
│  - Register / Login / Guest chat    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         CHAT INTERFACE              │
│  User types or speaks naturally:    │
│  "I'm a 20yr female student from   │
│   Rajasthan doing BTech"            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         NLP SERVICE                 │
│  Extracts from text:                │
│  age: 20                            │
│  gender: female                     │
│  state: Rajasthan                   │
│  occupation: student                │
│  education: Graduate (BTech)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      ELIGIBILITY MATCHING ENGINE    │
│                                     │
│  Loads 1000+ schemes from MongoDB   │
│                                     │
│  For each scheme:                   │
│  1. State filter → Skip MP schemes  │
│  2. Exclusion check → Skip farmer   │
│     schemes for students            │
│  3. Hard fails → Age/income/gender  │
│  4. Keyword scoring → Find student  │
│     scholarship keywords            │
│  5. Sort by relevance score         │
│                                     │
│  Result:                            │
│  ✅ Eligible: [5 schemes]           │
│  ⚠️  Partial: [3 schemes]           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         GEMINI AI SERVICE           │
│                                     │
│  Receives:                          │
│  - User message                     │
│  - Extracted profile                │
│  - Top 5 eligible schemes           │
│  - Chat history (last 10 messages)  │
│                                     │
│  Generates:                         │
│  - Natural language response        │
│  - Lists schemes with benefits      │
│  - Asks follow-up questions         │
│  - Explains eligibility clearly     │
│  - Supports Hindi/English           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         CHAT RESPONSE               │
│                                     │
│  AI Message shown in chat bubble    │
│  Scheme cards shown in sidebar      │
│  Profile extracted shown in sidebar │
│  User can click scheme → Detail page│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       SCHEME DETAIL PAGE            │
│                                     │
│  Full information + documents       │
│  Direct Apply Button →              │
│  Opens myscheme.gov.in/schemes/slug │
│  (exact scheme application page)    │
└─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.2 | UI component library |
| React Router DOM | 6.20 | Client-side routing |
| Vite | 5.0 | Build tool & dev server |
| Tailwind CSS | 3.3 | Utility-first CSS styling |
| Axios | 1.6 | HTTP API calls to backend |
| Lucide React | 0.294 | Icon library |
| React Hot Toast | 2.4 | Toast notifications |
| Framer Motion | 10.16 | Animations |
| Web Speech API | Browser native | Voice input (microphone) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | JavaScript runtime |
| Express.js | 4.18 | Web server framework |
| Mongoose | 8.0 | MongoDB ODM |
| JSON Web Token | 9.0 | Authentication tokens |
| bcryptjs | 2.4 | Password hashing |
| Helmet | 7.1 | HTTP security headers |
| Express Rate Limit | 7.1 | API rate limiting |
| Express Validator | 7.0 | Request input validation |
| Morgan | 1.10 | HTTP request logging |
| CORS | 2.8 | Cross-origin requests |
| dotenv | 16.3 | Environment variables |
| UUID | 9.0 | Unique session ID generation |
| csv-parser | - | Parse Kaggle CSV dataset |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | Primary database (NoSQL) |
| Mongoose | Schema definition and querying |
| MongoDB Atlas | Cloud hosting option |

### AI & Intelligence
| Technology | Purpose |
|---|---|
| Google Gemini Pro | Conversational AI responses |
| @google/generative-ai | Official Gemini SDK |
| Custom NLP Engine | Profile extraction from text |
| Custom Eligibility Engine | Scheme matching with scoring |

### Data Source
| Source | Purpose |
|---|---|
| Kaggle — Indian Government Schemes Dataset | 1000+ schemes with slug, benefits, documents, eligibility |
| MyScheme.gov.in (via slug) | Direct apply links for all schemes |

---

## 📁 Project Structure

```
yojana-sahayak/
│
├── backend/                          ← Node.js + Express API Server
│   ├── server.js                     ← Main entry point
│   ├── .env                          ← Secret config (not in git)
│   ├── .env.example                  ← Template for .env
│   ├── package.json                  ← Backend dependencies
│   │
│   ├── config/
│   │   ├── db.js                     ← MongoDB connection setup
│   │   └── gemini.js                 ← Google Gemini AI initialization
│   │
│   ├── models/                       ← MongoDB Mongoose Schemas
│   │   ├── User.js                   ← User accounts, profile, saved schemes
│   │   ├── Scheme.js                 ← Government scheme data model
│   │   ├── Conversation.js           ← Chat history storage
│   │   └── Notification.js           ← User alerts and reminders
│   │
│   ├── controllers/                  ← Business logic handlers
│   │   ├── authController.js         ← Register, Login, Get user
│   │   ├── chatController.js         ← AI chat message processing
│   │   ├── schemeController.js       ← Scheme CRUD and matching
│   │   ├── profileController.js      ← Profile update and tracking
│   │   └── notificationController.js ← Notification management
│   │
│   ├── routes/                       ← Express route definitions
│   │   ├── authRoutes.js             ← /api/auth/*
│   │   ├── chatRoutes.js             ← /api/chat/*
│   │   ├── schemeRoutes.js           ← /api/schemes/*
│   │   ├── profileRoutes.js          ← /api/profile/*
│   │   └── notificationRoutes.js     ← /api/notifications/*
│   │
│   ├── middleware/
│   │   ├── auth.js                   ← JWT token verification
│   │   ├── errorHandler.js           ← Global error handling
│   │   └── validate.js               ← Input validation middleware
│   │
│   ├── services/                     ← Core intelligence layer
│   │   ├── geminiService.js          ← Gemini AI response generation
│   │   ├── nlpService.js             ← Extract profile from chat text
│   │   └── eligibilityService.js     ← Scheme matching engine
│   │
│   └── utils/
│       └── seedSchemes.js            ← Load 1000+ schemes into MongoDB
│
│
├── frontend/                         ← React + Vite Application
│   ├── index.html                    ← Root HTML file
│   ├── vite.config.js                ← Vite + API proxy config
│   ├── tailwind.config.js            ← Custom colors and fonts
│   ├── postcss.config.js             ← PostCSS for Tailwind
│   ├── package.json                  ← Frontend dependencies
│   │
│   └── src/
│       ├── main.jsx                  ← React app entry point
│       ├── App.jsx                   ← Router setup + providers
│       ├── index.css                 ← Global styles + Tailwind
│       │
│       ├── context/
│       │   ├── AuthContext.jsx       ← Login state shared across app
│       │   └── ChatContext.jsx       ← Chat messages, profile, schemes
│       │
│       ├── hooks/
│       │   └── useSpeech.js          ← Voice input hook (Web Speech API)
│       │
│       ├── services/
│       │   └── api.js                ← All Axios API calls to backend
│       │
│       ├── utils/
│       │   ├── session.js            ← Browser session ID management
│       │   └── helpers.js            ← Currency format, date, category colors
│       │
│       ├── pages/                    ← Full page components (routes)
│       │   ├── HomePage.jsx          ← Landing page with categories
│       │   ├── ChatPage.jsx          ← AI chat interface
│       │   ├── SchemesPage.jsx       ← Browse all schemes with filters
│       │   ├── SchemeDetailPage.jsx  ← Single scheme full detail + apply
│       │   ├── DashboardPage.jsx     ← User personal dashboard
│       │   ├── ProfilePage.jsx       ← Edit user profile form
│       │   ├── LoginPage.jsx         ← Login with email/password
│       │   ├── RegisterPage.jsx      ← New account registration
│       │   └── NotificationsPage.jsx ← Alerts and deadline reminders
│       │
│       └── components/               ← Reusable UI components
│           ├── common/
│           │   └── Navbar.jsx        ← Top navigation (desktop + mobile)
│           ├── chat/
│           │   ├── ChatWindow.jsx    ← Full chat layout wrapper
│           │   ├── ChatBubble.jsx    ← Individual message bubble
│           │   ├── ChatInput.jsx     ← Text + voice input + quick prompts
│           │   └── ProfileSidebar.jsx← Extracted profile + matched schemes
│           ├── schemes/
│           │   ├── SchemeCard.jsx    ← Scheme grid card with save button
│           │   └── SchemeFilter.jsx  ← Filter sidebar (category/level/search)
│           ├── dashboard/
│           │   ├── StatsCard.jsx     ← Stats number display card
│           │   └── SavedSchemes.jsx  ← List of user saved schemes
│           └── profile/
│               └── ProfileForm.jsx   ← Complete profile editing form
│
├── README.md                         ← This file
└── SETUP_WINDOWS.md                  ← Step by step Windows setup guide
```

---

## 🗄️ Database Models

### User Model (`models/User.js`)
Stores registered user accounts and their complete profile.

```
User {
  name, email, phone, password (hashed)
  profile: {
    age, gender, state, district
    occupation, annualIncome, category
    education, maritalStatus, isDisabled
    landHolding (for farmers)
  }
  savedSchemes: [Scheme IDs]
  appliedSchemes: [{ scheme, appliedAt, status }]
  preferredLanguage, isProfileComplete
}
```

### Scheme Model (`models/Scheme.js`)
Stores all 1000+ government schemes with full detail.

```
Scheme {
  name, nameHindi, description
  category, level (central/state), state, ministry
  benefits, benefitsAmount
  documentsRequired: [string]
  applicationProcess, portalLink (direct MyScheme URL)
  isActive, tags: [string]
  eligibility: {
    minAge, maxAge, gender
    category: [sc/st/obc/ews/general]
    occupation: [student/farmer/...]
    maxAnnualIncome
    states: [state names]
    maritalStatus, isDisabled
  }
}
```

### Conversation Model (`models/Conversation.js`)
Stores full chat history per session.

```
Conversation {
  user (ref), sessionId
  messages: [{ role, content, timestamp, schemesFound }]
  extractedProfile: { age, gender, state, ... }
  language
}
```

### Notification Model (`models/Notification.js`)
Stores user alerts and deadline reminders.

```
Notification {
  user (ref), scheme (ref)
  type: deadline | new-scheme | reminder | status-update
  title, message, isRead
}
```

---

## 🌐 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user details | Yes |

### Chat — `/api/chat`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/chat/message` | Send message, get AI response + matched schemes | Optional |
| GET | `/api/chat/history/:sessionId` | Get full chat history | Yes |
| DELETE | `/api/chat/history/:sessionId` | Clear chat history | Yes |

### Schemes — `/api/schemes`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/schemes` | Get all schemes with filters & pagination | No |
| GET | `/api/schemes/:id` | Get single scheme full details | No |
| POST | `/api/schemes/match` | Match schemes against a profile | Optional |
| POST | `/api/schemes/:id/save` | Save/unsave a scheme | Yes |

### Profile — `/api/profile`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/profile` | Get user profile + saved schemes | Yes |
| PUT | `/api/profile` | Update user profile | Yes |
| POST | `/api/profile/apply/:schemeId` | Mark scheme as applied | Yes |

### Notifications — `/api/notifications`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/notifications` | Get all notifications | Yes |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes |
| PUT | `/api/notifications/:id/read` | Mark one as read | Yes |

---

## 🧠 AI & NLP Engine

### NLP Profile Extractor (`services/nlpService.js`)
Extracts structured profile data from natural language text using rule-based pattern matching.

**What it detects:**

| Field | Example Input | Extracted |
|---|---|---|
| Age | "I am 20 years old" | `age: 20` |
| Gender | "I am a girl / mahila" | `gender: female` |
| State | "from Jaipur / Rajasthan" | `state: Rajasthan` |
| Occupation | "I'm a student / kisan / farmer" | `occupation: student` |
| Education | "doing BTech / B.Tech" | `education: Graduate` |
| Income | "income 3 lakh / ₹3,00,000" | `annualIncome: 300000` |
| Category | "I am OBC / SC / ST" | `category: obc` |
| Disability | "I am divyang / disabled" | `isDisabled: true` |
| Land | "3 acres / 2 bigha" | `landHolding: 3` |

**Supports:** Hindi words (kisan, chhatra, mahila, padh raha), Hinglish, English

### Gemini AI Service (`services/geminiService.js`)
Generates natural language responses using Google Gemini Pro.

**System Prompt includes:**
- Role: Yojana Sahayak, India's welfare assistant
- Language: Hindi/English/Hinglish supported
- Task: Ask profile questions, explain eligibility, list schemes
- Context: Extracted profile + top 5 matched schemes injected per request
- Fallback: Rule-based responses when API key not available

---

## ⚖️ Eligibility Matching Engine

### How `eligibilityService.js` Works

The engine processes every scheme through **4 layers:**

**Layer 1 — State Filter**
If user mentioned their state, schemes from OTHER states are completely excluded by scanning scheme name + description for other state names.

**Layer 2 — Occupation Exclusion**
If user is a farmer, student scholarship schemes are excluded.
If user is a student, farmer subsidy schemes are excluded.
This prevents irrelevant schemes from appearing.

**Layer 3 — Hard Eligibility Fails**
Checks formal eligibility fields:
- Age too low/high → Excluded
- Wrong gender → Excluded
- Income exceeds limit → Excluded
- Wrong category → Excluded
- Wrong state → Excluded

**Layer 4 — Relevance Scoring**
Schemes that pass all filters get a **relevance score:**

| Match Type | Points |
|---|---|
| Occupation keyword match | +15 per keyword (max 3) |
| Category matches occupation | +20 |
| State mentioned in scheme | +20 |
| Explicit state match | +25 |
| Gender match | +20 |
| Age within range | +15 |
| Income within limit | +15 |
| Occupation field match | +30 |
| Women-focused keyword (female user) | +15 |

Schemes are sorted by score — highest relevance first.

**Status Determination:**
- Score ≥ 25 + no unknowns → **Eligible** ✅
- Score > 0 + some unknowns → **Partial** ⚠️
- Score = 0 or hard fail → **Ineligible** (not shown)

---

## 🖥️ Frontend Pages & Components

### Pages

| Page | Route | Description |
|---|---|---|
| HomePage | `/` | Landing page, categories, features, CTA |
| ChatPage | `/chat` | AI chat interface with sidebar |
| SchemesPage | `/schemes` | Browse + filter all schemes |
| SchemeDetailPage | `/schemes/:id` | Full scheme info + apply button |
| LoginPage | `/login` | Email/password login |
| RegisterPage | `/register` | New account creation |
| DashboardPage | `/dashboard` | Personal stats + saved schemes |
| ProfilePage | `/profile` | Edit profile form |
| NotificationsPage | `/notifications` | Alerts and reminders |

### Key Components

**ChatWindow** — Main chat layout with header, message list, and input area

**ChatBubble** — Individual message with support for bold text, newlines, and inline scheme cards

**ChatInput** — Text textarea + voice mic button + quick prompt chips + clear button

**ProfileSidebar** — Shows profile fields extracted from current chat + eligible scheme links

**SchemeCard** — Grid card with category badge, name, benefits, save button, apply link

**SchemeFilter** — Left sidebar with category dropdown, level toggle, and search input

**ProfileForm** — Complete form with all eligibility fields: age, gender, state, occupation, income, category, education, marital status, disability checkbox

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18 or above → https://nodejs.org
- MongoDB Community Server → https://www.mongodb.com/try/download/community
- VS Code → https://code.visualstudio.com

### Step 1 — Clone / Extract Project
```bash
# Extract the ZIP to your projects folder
# Example: C:\Projects\yojana-sahayak
```

### Step 2 — Backend Setup
```bash
cd backend
npm install

# Create .env file
copy .env.example .env
# Edit .env with your values (see Environment Variables below)

# Seed 1000+ schemes into MongoDB
npm run seed

# Start backend server
npm run dev
# Server starts at: http://localhost:5000
```

### Step 3 — Frontend Setup
```bash
# Open new terminal
cd frontend
npm install

# Start frontend dev server
npm run dev
# App opens at: http://localhost:5173
```

### Step 4 — Open in Browser
```
http://localhost:5173
```

---

## 🔑 Environment Variables

Create `backend/.env` file with these values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/yojana-sahayak

# JWT Authentication
JWT_SECRET=your_random_secret_key_here_make_it_long
JWT_EXPIRE=7d

# Google Gemini AI (Free tier available)
# Get key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

> **Note:** The app works without `GEMINI_API_KEY` using intelligent rule-based fallback responses. Gemini key is optional but recommended for best experience.

---

## 📦 Data Source

The application uses the **Indian Government Schemes Dataset** from Kaggle:

- **Source:** https://www.kaggle.com/datasets/jainamgada45/indian-government-schemes
- **Origin:** Data scraped from MyScheme.gov.in (Government of India)
- **Size:** 1000+ schemes
- **Format:** CSV with columns: `scheme_name`, `slug`, `details`, `benefits`, `eligibility`, `application`, `documents`, `level`, `schemeCategory`, `tags`

The `slug` column is used to build direct MyScheme.gov.in URLs:
```
https://www.myscheme.gov.in/schemes/{slug}
```

This gives users a **direct link to the official scheme application page** — no searching required.

---

## 🎨 Design System

| Element | Value |
|---|---|
| Primary Color | Deep Teal `#1a7a74` |
| Background | Paper Cream `#f5edd8` |
| Accent | Saffron `#f59e0b` |
| Heading Font | Space Grotesk |
| Body Font | Hind (supports Devanagari) |
| Border Radius | 12px (rounded-xl) |
| Shadow | Subtle `shadow-sm` |

---

## 🔮 Future Scope

| Feature | Description |
|---|---|
| **WhatsApp Bot** | Users can chat via WhatsApp using Twilio/Meta API |
| **OCR Document Upload** | Auto-read Aadhaar, income certificate to fill profile |
| **Application Auto-Fill** | AI fills government forms using user profile |
| **OTP Login** | Login via mobile OTP instead of password |
| **Regional Languages** | Full support for Tamil, Telugu, Marathi, Bengali |
| **Offline Kiosk Mode** | Works without internet for village kiosks |
| **SMS Alerts** | Deadline reminders via SMS using Twilio |
| **APISetu Integration** | Live scheme data from official government API |
| **Status Tracking** | Track application status across portals |
| **PWA Mobile App** | Install as mobile app from browser |

---

## 👩‍💻 Developer

**Tanisha** — Full Stack Developer

Project built for professional portfolio demonstrating:
- Full-stack web development (React + Node.js + MongoDB)
- AI/ML integration (Google Gemini, Custom NLP)
- Government data integration (MyScheme.gov.in / Kaggle)
- Production-ready architecture (JWT auth, rate limiting, error handling)
- Real-world social impact problem solving

---

## 📄 License

This project is built for educational and portfolio purposes.
Scheme data sourced from MyScheme.gov.in — Government of India open data.

---

<div align="center">

**Made with ❤️ for India 🇮🇳**

*Helping every Indian citizen discover the government schemes they deserve.*

</div>