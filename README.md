<div align="center">

# 🏛️ Yojana Sahayak — योजना सहायक

### AI-Powered Government Scheme Eligibility Assistant for Indian Citizens

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat&logo=mongodb)](https://mongodb.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)](https://vitejs.dev)

> *"Tell us about yourself — we'll find the right government scheme for you."*

**Frontend:** `http://localhost:5173` &nbsp;|&nbsp; **Backend API:** `http://localhost:5005/api`  
📖 **Comprehensive Project Architecture & Viva Guide:** See [PROJECT_EXPLANATION.md](file:///e:/PROJECTS/yojana-sahayak/yojana-sahayak/PROJECT_EXPLANATION.md)

</div>

---

## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [What is Yojana Sahayak?](#-what-is-yojana-sahayak)
3. [Key Features](#-key-features)
4. [How It Works — End-to-End Flow](#-how-it-works--end-to-end-flow)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [Database Models](#-database-models)
8. [API Endpoints](#-api-endpoints)
9. [AI & NLP Engine](#-ai--nlp-engine)
10. [Eligibility Matching Engine v5](#-eligibility-matching-engine-v5)
11. [Frontend Pages & Components](#-frontend-pages--components)
12. [Installation & Setup](#-installation--setup)
13. [Environment Variables](#-environment-variables)
14. [Data Source & Sync](#-data-source--sync)
15. [Future Scope](#-future-scope)
16. [Developer](#-developer)

---

## 🔴 Problem Statement

India has **4,000+ government welfare schemes** launched by Central and State Governments — covering scholarships, farmer subsidies, women empowerment, healthcare, housing, entrepreneurship, and pensions.

Yet **over 60% of eligible citizens never receive these benefits** because:

| Problem | Reality |
|---|---|
| **Lack of Awareness** | Citizens don't know which schemes exist for their profile |
| **Complex Eligibility Rules** | Legal language and bureaucratic jargon are hard to understand |
| **Scattered Portals** | Each ministry and state has a separate, disconnected website |
| **Language Barriers** | Portals are predominantly in English or formal, complex Hindi |
| **Middlemen Exploitation** | Unauthorized agents and operators charge fees and provide inaccurate info |
| **Disqualification on Technicalities** | Citizens apply without knowing minimum marks, income ceilings, or state domicile rules |

**Result:** Government welfare funds go unutilized. Deserving students miss scholarships, small farmers miss subsidies, and vulnerable citizens miss financial assistance.

---

## 💡 What is Yojana Sahayak?

**Yojana Sahayak (योजना सहायक)** is a full-stack, AI-powered web platform that acts as a **24×7 personal digital welfare assistant** for Indian citizens.

Instead of browsing dozens of confusing portals, users simply **have a conversation** — in Hindi, English, or Hinglish — or use a simple 3-step visual questionnaire:

- 🎙️ **Voice & Chat Interface:** Speak or type naturally; AI extracts demographic and socio-economic attributes without filling long forms.
- 🎯 **Eligibility Engine v5:** Evaluates users against a database of 1,000+ government schemes using 7 strict filter gates (State authority check, education hierarchy, occupation matching, elderly age limits, disability filters, and academic marks thresholds).
- 📊 **Explainable AI:** Clearly explains *why* you are eligible or *why* you were disqualified.
- 🔗 **Direct Official Applications:** Provides one-click deep links to exact scheme application pages on [MyScheme.gov.in](https://www.myscheme.gov.in).
- 📱 **Citizen Utilities:** One-click WhatsApp card sharing, print-ready document checklists, and bookmarking.

---

## ✨ Key Features

### 🤖 1. Conversational AI Assistant
- Chat naturally in **Hindi, English, or Hinglish**.
- Powered by **Google Gemini 1.5 Flash** with rule-based offline fallback.
- Context-aware session memory with **Smart Profile Merging** that flushes outdated context when switching roles (e.g. from student to widow).
- Maintains guest sessions via browser UUIDs and persistent histories for registered accounts.

### 🎙️ 2. Voice Input (Web Speech API)
- Speech-to-text supporting **Hindi (`hi-IN`)** and **Indian English (`en-IN`)**.
- Real-time live transcript display in the input bar.
- Tailored for rural users, senior citizens, and low-literacy populations.

### 🎯 3. 3-Step Interactive Scheme Finder (`/find-schemes`)
- A visual, point-and-click questionnaire wizard for users who prefer guided choices over open-ended typing.
- **Step 1:** Select Occupation and State.
- **Step 2:** Select Age, Gender, Caste Category, and Income bracket.
- **Step 3:** Instant eligibility matching with detailed match explanations.

### ⚖️ 4. Eligibility Matching Engine v5
- **Gate 1 (Authoritative State Filter):** Strict state validation via `scheme.state` and residency patterns.
- **Gate 2 (Education Hierarchy):** Prevents graduates from seeing primary school schemes.
- **Gate 3 (Occupation Gating):** Strict separation ensuring farmers don't see student scholarships and students don't see farmer subsidies.
- **Gate 4 (Elderly Gating):** Senior citizens (60+) are excluded from marriage and maternity grants.
- **Gate 5 (Disability Exclusion):** Non-disabled citizens do not receive Divyang-exclusive schemes.
- **Gate 6 (Postgrad Gating):** School students (10th/12th) are excluded from postgraduate university fellowships.
- **Gate 7 (Marks & Percentage Gating):** Evaluates user's score against minimum percentage cutoffs and division tiers.
- **Dynamic Relevance Scoring:** Boosts schemes matching user's specific state (+40/+30), 10th-grade students (+25), and widows (+150).

### 📄 5. Rich Scheme Details & Actions (`/schemes/:id`)
- Comprehensive dossier: Ministry, description, benefit amounts, and application steps.
- **Structured Criteria Badges:** Visual tags for Age, Gender, Category, Income, Occupation, and State.
- **Parsed Full Eligibility Points:** Formatted bullet-point breakdown of all legal prerequisites.
- **Document Checklist:** Clear list of required official certificates.
- **Direct Apply Button:** Deep-links directly to `https://www.myscheme.gov.in/schemes/{slug}`.
- **WhatsApp Share:** Formats scheme details with an isolated, clickable link ready to share on WhatsApp.
- **Copy Link:** One-click clipboard copy with automated fallback.
- **Print Checklist:** Generates a print-ready document checklist for offline office visits.

### 🔍 6. Scheme Directory with Live Filters
- Browse 1,000+ schemes with pagination.
- Multi-dimensional filters: Category, Level (Central vs State), and Keyword Search.

### 👤 7. User Profiles, Dashboard & Notifications
- JWT-authenticated accounts with bcrypt password protection.
- Track saved schemes, applied schemes, and profile completion percentage.
- Notification center for scheme deadline reminders and newly matched programs.

---

## 🔄 How It Works — End-to-End Flow

```
USER OPENS APPLICATION (Web Speech or Text)
                 │
                 ▼
┌──────────────────────────────────────────────┐
│           CONVERSATIONAL / WIZARD UI         │
│  User speaks: "Main Rajasthan se 10th pass   │
│  student hu, 75% marks hai, scholarship?"    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│          NLP SERVICE & PROFILE MERGE         │
│  - Regex Tokenizer + Gemini 1.5 Flash Fallback│
│  - State typo correction: "rajastahn" -> Raj │
│  - Extracts: state: Rajasthan, occ: student,  │
│    education: 10th, marksPercent: 75%        │
│  - Smart Merge: Flushes incompatible context │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│        ELIGIBILITY MATCHING ENGINE v5        │
│  Evaluates 1,000+ MongoDB schemes:           │
│  - Gate 1: Exclude schemes from other states │
│  - Gate 2: Exclude college/degree-only schemes│
│  - Gate 3: Exclude farmer/business schemes   │
│  - Gate 6: Exclude postgraduate schemes      │
│  - Gate 7: Check marks cutoff (75% >= min)   │
│  - Relevance Scoring: State (+40), 10th (+25)│
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│          GEMINI 1.5 FLASH RESPONSE           │
│  Generates conversational, empathetic advice │
│  in Hindi/English highlighting top schemes   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│            CLIENT UI INTERACTION             │
│  - Live profile chips in sidebar             │
│  - Scheme cards with match scores & reasons  │
│  - Scheme detail view + WhatsApp Share       │
│  - Direct Apply button -> MyScheme.gov.in    │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18.2 | Component-based user interface |
| **Vite** | 5.0 | High-performance build tool and dev server (Port 5173) |
| **Tailwind CSS** | 3.3 | Responsive utility styling with custom design tokens |
| **React Router DOM** | 6.20 | Client-side routing and protected routes |
| **Axios** | 1.6 | REST API client with JWT authorization interceptors |
| **Lucide React** | 0.294 | Clean modern UI icons |
| **React Hot Toast** | 2.4 | Elegant toast notifications |
| **Framer Motion** | 10.16 | Micro-animations and transitions |
| **Web Speech API** | Native | Voice input supporting Hindi and Indian English |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20+ | Server JavaScript runtime |
| **Express.js** | 4.18 | REST API framework (Port 5005) |
| **Mongoose** | 8.0 | MongoDB ODM and schema validation |
| **@google/generative-ai**| 0.21 | Google Gemini 1.5 Flash SDK |
| **JSON Web Token** | 9.0 | Stateless token-based authentication |
| **bcryptjs** | 2.4 | Salted password hashing (12 rounds) |
| **Helmet** | 7.1 | HTTP security headers |
| **Express Rate Limit** | 7.1 | DDoS and brute-force prevention |
| **CORS** | 2.8 | Origin filtering supporting Vercel and local origins |
| **UUID** | 9.0 | Unique guest session tracking |

### Database & Ingestion
| Technology | Purpose |
|---|---|
| **MongoDB (Local / Atlas)** | Primary NoSQL document store |
| **Kaggle Schemes Dataset** | Base dataset of 1,000+ government schemes |
| **data.gov.in (OGD Platform)**| Live central government scheme sync via official API |
| **MyScheme.gov.in** | Target portal for verified direct application links |

---

## 📁 Project Structure

```
yojana-sahayak/
│
├── PROJECT_EXPLANATION.md            ← Complete technical blueprint & viva prep guide
├── README.md                         ← Project overview and documentation
├── SETUP_WINDOWS.md                  ← Step-by-step Windows setup guide
├── vercel.json                       ← Root Vercel deployment configuration
│
├── backend/                          ← Node.js + Express API Server (Port 5005)
│   ├── server.js                     ← Server entry point, crash handlers, security, CORS
│   ├── .env                          ← Secret config (PORT=5005, DB, JWT, Gemini key)
│   ├── .env.example                  ← Environment template
│   ├── package.json                  ← Backend dependencies & scripts
│   │
│   ├── config/
│   │   ├── db.js                     ← MongoDB connection setup
│   │   └── gemini.js                 ← Google Gemini 1.5 Flash client setup
│   │
│   ├── models/                       ← Mongoose Schemas
│   │   ├── User.js                   ← User accounts, profile, saved & applied schemes
│   │   ├── Scheme.js                 ← Schemes, benefits, eligibility, slugs
│   │   ├── Conversation.js           ← Multi-turn chat message histories
│   │   └── Notification.js           ← User reminders and alerts
│   │
│   ├── controllers/                  ← Route Business Logic
│   │   ├── authController.js         ← Register, login, me
│   │   ├── chatController.js         ← AI chat, smart profile merge, context reset
│   │   ├── schemeController.js       ← Scheme catalog, filters, matching
│   │   ├── profileController.js      ← Profile updates, mark applied
│   │   └── notificationController.js ← Notification read/unread management
│   │
│   ├── routes/                       ← Express Route Endpoints
│   │   ├── authRoutes.js             ← /api/auth/*
│   │   ├── chatRoutes.js             ← /api/chat/*
│   │   ├── schemeRoutes.js           ← /api/schemes/*
│   │   ├── profileRoutes.js          ← /api/profile/*
│   │   └── notificationRoutes.js     ← /api/notifications/*
│   │
│   ├── middleware/
│   │   ├── auth.js                   ← JWT token verification
│   │   ├── errorHandler.js           ← Centralized error handling
│   │   └── validate.js               ← Input validation
│   │
│   ├── services/                     ← Intelligence Layer
│   │   ├── geminiService.js          ← Gemini 1.5 Flash conversational response & extraction
│   │   ├── nlpService.js             ← High-speed regex extraction & state typo mapping
│   │   └── eligibilityService.js     ← 7-Layer Eligibility Matching Engine v5
│   │
│   └── utils/
│       ├── seedSchemes.js            ← Seeds 1,000+ schemes from Kaggle CSV
│       ├── syncFromDataGov.js        ← Live sync from official India data.gov.in API
│       ├── scrapeMyScheme.js         ← MyScheme web scraping utility
│       └── schemes_data.csv          ← 12.8MB schemes dataset
│
└── frontend/                         ← React 18 + Vite Web App (Port 5173)
    ├── index.html                    ← HTML shell
    ├── vite.config.js                ← Vite dev config + API proxy to Port 5005
    ├── tailwind.config.js            ← Color palette (Teal, Paper Cream, Saffron)
    ├── package.json                  ← Frontend dependencies & scripts
    │
    └── src/
        ├── main.jsx                  ← Application mount
        ├── App.jsx                   ← React Router, providers, protected routes
        ├── index.css                 ← Design tokens & custom utilities
        │
        ├── context/
        │   ├── AuthContext.jsx       ← Auth token, user state, login/register
        │   └── ChatContext.jsx       ← Chat messages, profile chips, matching schemes
        │
        ├── hooks/
        │   └── useSpeech.js          ← Web Speech API voice recognition (hi-IN / en-IN)
        │
        ├── services/
        │   └── api.js                ← Axios endpoints with JWT authorization
        │
        ├── utils/
        │   ├── session.js            ← Guest UUID session generator
        │   └── helpers.js            ← Formatting, category badges, helpers
        │
        ├── pages/
        │   ├── HomePage.jsx          ← Landing page with categories & example queries
        │   ├── ChatPage.jsx          ← AI conversational interface with profile sidebar
        │   ├── OnboardingPage.jsx    ← 3-step interactive questionnaire (/find-schemes)
        │   ├── SchemesPage.jsx       ← Searchable, filterable scheme catalog
        │   ├── SchemeDetailPage.jsx  ← Full details, WhatsApp share, print, direct apply
        │   ├── DashboardPage.jsx     ← User command center with stats
        │   ├── ProfilePage.jsx       ← Demographic profile editor
        │   ├── NotificationsPage.jsx ← Alert management
        │   ├── LoginPage.jsx         ← Account login
        │   └── RegisterPage.jsx      ← New account registration
        │
        └── components/
            ├── common/Navbar.jsx     ← Header navigation (desktop & mobile)
            ├── chat/                 ← ChatWindow, ChatBubble, ChatInput, ProfileSidebar
            ├── schemes/              ← SchemeCard, SchemeFilter
            ├── dashboard/            ← StatsCard, SavedSchemes
            └── profile/              ← ProfileForm
```

---

## 🗄️ Database Models

### 1. Scheme Model (`models/Scheme.js`)
Stores government welfare schemes with structured criteria and official metadata:
```javascript
{
  name: String,
  nameHindi: String,
  slug: String,                 // Used for MyScheme.gov.in deep links
  description: String,
  category: String,             // education, agriculture, women, health, etc.
  level: String,                // central | state
  state: String,                // Authoritative state jurisdiction
  ministry: String,
  benefits: String,
  benefitsAmount: String,
  documentsRequired: [String],
  applicationProcess: String,
  portalLink: String,
  isActive: Boolean,
  tags: [String],
  eligibility: {
    minAge: Number,
    maxAge: Number,
    gender: String,             // male | female | all
    category: [String],         // sc, st, obc, ews, general, all
    occupation: [String],       // student, farmer, self-employed, etc.
    maxAnnualIncome: Number,
    states: [String],
    maritalStatus: String,
    isDisabled: Boolean,
    otherCriteria: String
  }
}
```

### 2. User Model (`models/User.js`)
Stores user credentials, complete demographic profiles, and saved/applied schemes:
```javascript
{
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,             // bcrypt hashed (12 salt rounds)
  profile: {
    age: Number,
    gender: String,
    state: String,
    district: String,
    occupation: String,
    annualIncome: Number,
    category: String,
    education: String,
    maritalStatus: String,
    isDisabled: Boolean,
    landHolding: Number
  },
  savedSchemes: [{ type: ObjectId, ref: 'Scheme' }],
  appliedSchemes: [{
    scheme: { type: ObjectId, ref: 'Scheme' },
    appliedAt: Date,
    status: String
  }],
  preferredLanguage: String,
  isProfileComplete: Boolean
}
```

---

## 🌐 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user credentials and profile | Yes |

### Chat & AI — `/api/chat`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/chat/message` | Send text/voice message; returns AI response & matches | Optional (Session/JWT) |
| `GET` | `/api/chat/history/:sessionId` | Retrieve conversation history | Yes |
| `DELETE` | `/api/chat/history/:sessionId` | Clear session conversation history | Yes |

### Schemes — `/api/schemes`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/schemes` | List all schemes with filters & pagination | No |
| `GET` | `/api/schemes/:id` | Get single scheme full details | No |
| `POST` | `/api/schemes/match` | Run 7-layer eligibility engine on custom profile | No |
| `POST` | `/api/schemes/:id/save` | Bookmark or remove a scheme | Yes |

### Profile & Tracking — `/api/profile`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/profile` | Get full user profile and tracking history | Yes |
| `PUT` | `/api/profile` | Update demographic attributes | Yes |
| `POST` | `/api/profile/apply/:schemeId` | Mark a scheme as applied | Yes |

### Notifications — `/api/notifications`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/notifications` | Fetch user alerts and deadline notifications | Yes |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read | Yes |
| `PUT` | `/api/notifications/:id/read` | Mark single notification as read | Yes |

---

## 🧠 AI & NLP Engine

### 1. Dual-Layer Extraction
1. **Regex Tokenizer (`nlpService.js`):** Fast extraction for 80% of routine requests. Normalizes common typos across all 36 Indian states and union territories (`"rajastahn"` ➔ `Rajasthan`, `"maharahstra"` ➔ `Maharashtra`). Maps educational milestones (`"cleared 10th"` ➔ `10th`, `"now in 11th"` ➔ `12th`) and marks percentages (`"got 75%"` ➔ `marksPercent: 75`).
2. **Gemini 1.5 Flash (`geminiService.js`):** Extracts subtle nuances from conversational Hindi/Hinglish sentences and synthesizes human-like explanations.

### 2. Smart Context Merge
`chatController.js` ensures that when a user switches contexts (e.g. from student inquiries to widow inquiries), role-specific fields (such as `marksPercent`) are flushed, preventing cross-domain validation bugs.

---

## ⚖️ Eligibility Matching Engine v5

The matching engine processes every scheme through **7 Sequential Filter Gates**:

1. **Gate 1 — State Authority:** If a scheme's `state` field is set to a different state than the user's domicile, it is immediately discarded.
2. **Gate 2 — Education Gating:** Graduate users never see primary school schemes (e.g. bicycle/uniform distribution).
3. **Gate 3 — Occupation Hard Mismatch:** Non-student occupations never receive student scholarships; students never receive farmer subsidies.
4. **Gate 4 — Elderly Gating:** Citizens 60+ are excluded from marriage and maternity programs.
5. **Gate 5 — Disability Exclusion:** Non-disabled users are excluded from Divyang-exclusive schemes.
6. **Gate 6 — Post-Graduate Exclusion:** 10th and 12th students are excluded from postgraduate and masters programs.
7. **Gate 7 — Academic Marks Threshold:** Scans scheme criteria for minimum percentages (e.g. 60%) or division tiers (First Division = 60%, Distinction = 75%). Users with lower scores are filtered out.

### Relevance Scoring
- **+40 points:** Scheme state strictly matches user state.
- **+30 points:** Scheme description explicitly mentions user state.
- **+150 points:** Explicit match for widow welfare schemes.
- **+25 points:** Specific boost for 10th-grade students on secondary school schemes.
- **+30 points:** Exact match on structured occupation field.
- **+15 points:** Per occupation keyword match (up to 3 keywords).

---

## 🖥️ Frontend Pages & Components

- **`HomePage` (`/`):** Dynamic category browser, interactive example query chips, feature highlights.
- **`ChatPage` (`/chat`):** Two-column workspace with live typing animation, microphone voice input, quick prompt chips, and a real-time profile sidebar.
- **`OnboardingPage` (`/find-schemes`):** 3-Step visual scheme discovery wizard for users who prefer guided selection over typing.
- **`SchemesPage` (`/schemes`):** Search and filter catalog with category dropdown, central/state level toggle, and pagination.
- **`SchemeDetailPage` (`/schemes/:id`):** Full scheme information, structured criteria pills, bullet-point requirements, documents checklist, direct MyScheme apply link, **WhatsApp Share**, **Copy Link**, and **Print Checklist**.
- **`DashboardPage` (`/dashboard`):** Personal dashboard with saved/applied counters and profile completion indicator.
- **`ProfilePage` (`/profile`):** Multi-section profile management form.
- **`NotificationsPage` (`/notifications`):** Alert and deadline management.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18 or above (Node 20 recommended) → https://nodejs.org
- MongoDB Community Server → https://www.mongodb.com/try/download/community
- Google Gemini API Key (Free tier) → https://aistudio.google.com/app/apikey

### 1. Clone Project
```bash
git clone https://github.com/BANSAL-TANISHA/Government-Scheme-Assistant.git
cd Government-Scheme-Assistant
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
copy .env.example .env
# Ensure PORT=5005, MONGO_URI, and GEMINI_API_KEY are configured

# Seed 1,000+ schemes into MongoDB
npm run seed

# Optional: Sync live schemes from official Open Government Data
node utils/syncFromDataGov.js

# Start backend server
npm run dev
# Server runs on: http://localhost:5005
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install

# Start Vite dev server
npm run dev
# App opens at: http://localhost:5173
```

---

## 🔑 Environment Variables

Create `backend/.env` with the following configuration:

```env
# Server Configuration (Port 5005 matches Vite proxy)
PORT=5005
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/yojana-sahayak

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_make_it_long
JWT_EXPIRE=7d

# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Official Open Government Data (data.gov.in) API Key
DATA_GOV_API_KEY=your_data_gov_in_api_key_here
```

> **Note:** The backend operates gracefully even without `GEMINI_API_KEY` by falling back to the local Regex Tokenizer and pre-configured responses.

---

## 📦 Data Source & Sync

1. **Kaggle Indian Government Schemes Dataset:**
   - 1,000+ schemes stored in `backend/utils/schemes_data.csv`.
   - Seeded into MongoDB using `npm run seed`.
2. **Official Open Government Data (data.gov.in):**
   - Live synchronization script `backend/utils/syncFromDataGov.js` queries central welfare datasets.
3. **Direct Application Links via MyScheme.gov.in:**
   - Deep links are generated dynamically: `https://www.myscheme.gov.in/schemes/{slug}`.

---

## 🔮 Future Scope

- 📱 **WhatsApp Bot Integration:** Allow citizens to interact via WhatsApp messages and voice notes using the WhatsApp Business API.
- 📷 **OCR Document Verification:** Auto-read Aadhaar cards, income certificates, and marksheets using Tesseract OCR to populate profiles automatically.
- ⚡ **APISetu & DigiLocker Integration:** Direct submission of scheme applications through Government of India APIs.
- 🌐 **Regional Indian Languages:** Expand voice and UI to Tamil, Telugu, Marathi, Bengali, and Gujarati.
- 📶 **Offline Kiosk Mode (PWA):** Enable Gram Panchayat kiosks to operate with local caching in low-connectivity areas.

---

## 👩‍💻 Developer

**Tanisha** — Full Stack & AI Developer  
*GitHub:* [@BANSAL-TANISHA](https://github.com/BANSAL-TANISHA)

Built as a portfolio demonstration of:
- Full-stack MERN engineering (React 18 + Node.js 20 + MongoDB 8.0)
- Hybrid AI architecture (Google Gemini 1.5 Flash + Custom Deterministic Rule Engine)
- Government open data integration (MyScheme.gov.in & data.gov.in)
- Production security standards (JWT, bcrypt, rate-limiting, CORS, Helmet)
- Accessible, citizen-centric product design for real-world social impact

---

<div align="center">

**Made with ❤️ for India 🇮🇳**

*Helping every Indian citizen discover the government schemes they deserve.*

</div>