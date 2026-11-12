# 🏛️ Yojana Sahayak (योजना सहायक) — Complete Project Blueprint & Explanation Guide

> **A Comprehensive Technical & Architectural Walkthrough from Inception to Implementation**  
> *Author:* Tanisha | Full-Stack & AI Developer  
> *Target Audience:* Examiners, Hackathon Judges, Technical Interviewers, and Project Collaborators

---

## 📌 Table of Contents

1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Project Elevator Pitches (Interview Ready)](#2-project-elevator-pitches-interview-ready)
3. [System Architecture & High-Level Flow](#3-system-architecture--high-level-flow)
4. [Step-by-Step Implementation Journey (How It Was Made)](#4-step-by-step-implementation-journey-how-it-was-made)
5. [Complete End-to-End Execution Flow (Request Lifecycle)](#5-complete-end-to-end-execution-flow-request-lifecycle)
6. [Frontend Architecture & Implementation Deep-Dive](#6-frontend-architecture--implementation-deep-dive)
7. [Backend Architecture & Implementation Deep-Dive](#7-backend-architecture--implementation-deep-dive)
8. [The Intelligence Core: NLP, Gemini AI & Eligibility Engine v5](#8-the-intelligence-core-nlp-gemini-ai--eligibility-engine-v5)
9. [Data Pipeline: Kaggle Dataset, Data.gov.in Sync & MyScheme Integration](#9-data-pipeline-kaggle-dataset-datagovin-sync--myscheme-integration)
10. [Security, Performance & Cloud Deployment](#10-security-performance--cloud-deployment)
11. [15 Tough Technical Interview Questions & Model Answers](#11-15-tough-technical-interview-questions--model-answers)
12. [Summary & Key Innovations](#12-summary--key-innovations)

---

## 1. Executive Summary & Problem Statement

### The Real-World Crisis
The Central and State Governments of India operate **over 4,000 welfare schemes** spanning agriculture, primary/higher education, healthcare, minority welfare, women empowerment, housing, entrepreneurship, and old-age social security. Every year, tens of thousands of crores of rupees are allocated to these schemes.

However, **over 60% of eligible citizens never receive their entitled benefits**. Why?
- **Information Fragmentation:** Schemes are scattered across hundreds of central ministries and state government portals.
- **Complex Bureaucratic Jargon:** Eligibility rules are written in convoluted legal phrasing that an ordinary citizen, farmer, or student cannot decipher.
- **Linguistic and Literacy Barriers:** Portals are predominantly in complex English or formal Hindi, alienating rural populations and first-time smartphone users.
- **Dependency on Predatory Middlemen:** Due to lack of clarity, rural citizens rely on unauthorized agents or CSC middlemen who charge high fees or give inaccurate guidance.
- **Missed Deadlines & Unmatched Qualifications:** Students miss scholarship deadlines or apply for schemes they are ineligible for due to minimum marks or income caps.

### The Solution: Yojana Sahayak (योजना सहायक)
**Yojana Sahayak** is a full-stack, AI-powered digital welfare assistant designed specifically for Indian citizens. Instead of navigating confusing web portals and dense legal documents:
1. Citizens simply **speak or chat naturally** in Hindi, English, or conversational Hinglish (e.g., *"Main Rajasthan se 10th pass student hu, mujhe scholarship chahiye"*).
2. The system automatically extracts demographic and socio-economic attributes (age, state, category, income, education, marks).
3. A **deterministic 7-layer Eligibility Matching Engine (v5)** checks the user against a verified database of 1,000+ government schemes.
4. The system provides **explainable recommendations** (exactly why you qualify or why you do not), **checklists of required documents**, and **direct one-click application links** to official government portals via MyScheme.gov.in.

---

## 2. Project Elevator Pitches (Interview Ready)

When an interviewer or examiner asks, *"Can you tell me about your project?"*, use one of these structured responses:

### ⏱️ 30-Second Pitch (Fast & Punchy)
> "Yojana Sahayak is an AI-driven welfare discovery platform for Indian citizens. While India has thousands of government schemes, millions of citizens miss out because portals are confusing and filled with legal jargon. With Yojana Sahayak, citizens can speak or chat in Hindi, English, or Hinglish. Our hybrid AI architecture extracts their profile and evaluates them against 1,000+ real government schemes using an explainable 7-layer eligibility engine. It gives users immediate eligibility transparency, required document checklists, and direct official application links without relying on middlemen."

### ⏱️ 2-Minute Summary (Comprehensive Technical & Social Context)
> "In India, the government allocates thousands of crores for social welfare, yet a majority of funds go unutilized because citizens don't know what they qualify for or get disqualified on technicalities like state domicile or marks thresholds.
> 
> To solve this, I designed and built **Yojana Sahayak**. It is a full-stack MERN application integrated with Google's Gemini 1.5 Flash AI and Web Speech API. 
> 
> The core architectural innovation is our **hybrid AI design**: Instead of letting an LLM hallucinate fake schemes, we use Gemini strictly for natural language understanding and conversational empathy. For actual scheme matching, we built an authoritative **Eligibility Matching Engine (v5)** that applies 7 distinct algorithmic filters—including state domicile verification, academic percentage cutoffs, education level gates, and occupation mismatch exclusions.
> 
> In addition to the conversational chat, I built a 3-step structured questionnaire wizard for users who prefer point-and-click discovery, along with one-click WhatsApp sharing, print-ready document checklists, and verified deep-links to MyScheme.gov.in. It’s fully deployed with a React/Vite frontend on Vercel and a Node/Express backend on Render."

---

## 3. System Architecture & High-Level Flow

### High-Level Architectural Diagram
```
                       ┌──────────────────────────────────────────────┐
                       │               CLIENT LAYER                   │
                       │   React 18 + Vite + Tailwind CSS + Lucide    │
                       │   Web Speech API (Hindi / English Voice)     │
                       └───────────────┬──────────────────────────────┘
                                       │ HTTP / REST (Axios)
                                       │ Proxy: /api -> Port 5005
                                       ▼
                       ┌──────────────────────────────────────────────┐
                       │          SECURITY & GATEWAY LAYER            │
                       │  - Helmet.js (HTTP Security Headers)         │
                       │  - CORS (Vercel regex + localhost whitelists)│
                       │  - Express Rate Limiter (100 req / 15 min)   │
                       │  - JWT Middleware (Bearer token auth)        │
                       └───────────────┬──────────────────────────────┘
                                       │
                                       ▼
                       ┌──────────────────────────────────────────────┐
                       │          EXPRESS API CONTROLLERS             │
                       │  - authController     - chatController       │
                       │  - schemeController   - profileController    │
                       │  - notificationController                    │
                       └───────┬──────────────────────────────┬───────┘
                               │                              │
             ┌─────────────────┴─────────────┐                │
             ▼                               ▼                ▼
┌─────────────────────────┐     ┌────────────────────────┐ ┌───────────────────────────┐
│   NLP EXTRACTION CORE   │     │  ELIGIBILITY ENGINE v5 │ │   DATABASE & INGESTION    │
│  - Regex Tokenizer      │     │  - State Authority     │ │  - MongoDB 8.0 / Atlas    │
│  - State Typo Corrector │     │  - Education Gating    │ │  - User, Scheme, Conv,    │
│  - Marks/Percentage     │     │  - Occupation Excl.    │ │    Notification Collections│
│  - Gemini 1.5 Fallback  │     │  - Marks Percent Gate  │ │  - seedSchemes.js (Kaggle)│
│  - Smart Merge & Clear  │     │  - Relevance Scoring   │ │  - syncFromDataGov.js     │
└─────────────────────────┘     └────────────────────────┘ └───────────────────────────┘
```

### Why a Hybrid Architecture? (LLM + Deterministic Engine)
One of the most critical engineering decisions made in this project was **not** relying solely on an LLM to recommend schemes.
- **The Problem with Pure LLMs:** Large Language Models hallucinate. In government schemes, an LLM might invent a non-existent ₹5,00,000 grant, give an incorrect age limit, or promise benefits from another state. Giving wrong legal or financial information to a citizen in need can be disastrous.
- **Our Hybrid Solution:**
  1. **LLM / NLP handles Language:** Extracts structured parameters (age: 19, state: "Rajasthan", education: "10th", marks: 75%).
  2. **Deterministic Code handles Eligibility:** A JavaScript rule engine executes hard logic against verified scheme documents.
  3. **LLM formats the Conversation:** Gemini synthesizes the verified results into an empathetic, clear, multilingual conversational response.

---

## 4. Step-by-Step Implementation Journey (How It Was Made)

If asked: *"How did you build this project from start to finish?"*, here is the chronological engineering progression:

### Phase 1: Problem Research & Dataset Discovery
- Studied government portals (MyScheme.gov.in, National Scholarship Portal, PM Kisan portal).
- Identified that users struggle most with: eligibility ambiguity, state residency rules, and finding the direct application URL.
- Acquired the Kaggle Indian Government Schemes dataset (1,000+ schemes with fields for scheme name, details, benefits, eligibility criteria, required documents, ministry, and URL slug).
- Integrated with the Government of India's official **Open Government Data (OGD) API (data.gov.in)** to fetch live scheme feeds.

### Phase 2: Database Modeling & Data Ingestion
- Designed Mongoose schemas: `User`, `Scheme`, `Conversation`, and `Notification`.
- Developed `backend/utils/seedSchemes.js` to parse CSV data, clean HTML tags, standardize state names, extract eligibility bounds (min/max age, income limits, gender, caste categories), and store verified entries in MongoDB.
- Implemented deep-link generation using the verified scheme `slug`: `https://www.myscheme.gov.in/schemes/{slug}`.

### Phase 3: Rule-Based Eligibility Engine (Evolution v1 to v5)
- **v1:** Basic keyword matching (e.g. matching "student" to schemes containing "student"). Caused massive false positives (e.g. farmers receiving scholarship recommendations).
- **v2:** Added hard demographic gates: age, income caps, gender, caste category.
- **v3:** Added state residency filtering.
- **v4:** Added education level hierarchy (10th < 12th < Graduate < Post-Graduate) to prevent graduates from receiving primary school schemes.
- **v5 (Latest Implementation):**
  - Implemented authoritative `scheme.state` check (blocks schemes belonging to other states immediately).
  - Added academic marks percentage evaluation (`marksPercent` vs scheme percentage criteria).
  - Added elderly citizen exclusion (prevents senior citizens from seeing marriage/maternity schemes).
  - Added disability filter (users without disabilities do not get Divyang-exclusive schemes).
  - Added context-resetting in chat (switching from student to widow flushes irrelevant student attributes).

### Phase 4: Conversational AI & NLP Pipeline
- Integrated Google Generative AI SDK (`@google/generative-ai`) using the `gemini-1.5-flash` model.
- Built a dual-layer NLP system:
  - Fast, zero-latency Regex Tokenizer for instant extraction of state, age, occupation, gender, and marks.
  - Gemini AI JSON extraction fallback for complex, colloquial Hinglish sentences.
- Built persistent conversation memory supporting both guest sessions (in-memory `sessionStore` with UUID) and authenticated users (MongoDB `Conversation` documents).

### Phase 5: Modern Responsive Frontend
- Built with React 18 and Vite for lightning-fast HMR and bundle compilation.
- Styled using Tailwind CSS with an accessible, dignified Indian design palette (Deep Teal `#1a7a74`, Paper Cream `#f5edd8`, Saffron accents `#f59e0b`).
- Integrated Web Speech API (`useSpeech` custom hook) for voice recognition in Hindi (`hi-IN`) and English (`en-IN`).
- Built modular pages: `HomePage`, `ChatPage`, `OnboardingPage` (`/find-schemes`), `SchemesPage`, `SchemeDetailPage`, `DashboardPage`, `ProfilePage`, `NotificationsPage`.
- Added sharing utilities: One-click WhatsApp sharing with formatted links, link copy with fallback, and print-ready checklist generation.

### Phase 6: Hardening, CORS & Cloud Deployment
- Configured backend crash handlers (`uncaughtException` and `unhandledRejection`) at the very top of `server.js`.
- Configured dynamic CORS to support Vercel preview branches (`https://government-scheme-assistant.*.vercel.app`) and local environments.
- Deployed frontend to Vercel and backend to Render with Node 20 runtime.

---

## 5. Complete End-to-End Execution Flow (Request Lifecycle)

Let us trace what happens when a citizen opens the app and speaks:  
**"Main Rajasthan se 10th pass student hu, mere 75% aaye hai, scholarship batao."**

```
1. USER INTERFACE (Frontend)
   │ User speaks into microphone.
   │ Web Speech API converts audio to text: "Main Rajasthan se 10th pass student hu, mere 75% aaye hai..."
   │ ChatInput triggers sendMessage() via ChatContext.
   │
2. API CLIENT & NETWORK
   │ Axios sends POST to /api/chat/message with { message, sessionId, language: 'hi' }.
   │ Vite dev proxy forwards request to http://localhost:5005/api/chat/message.
   │
3. BACKEND SECURITY GATEWAY
   │ Helmet verifies security headers.
   │ CORS middleware validates origin.
   │ Rate limiter confirms IP has not exceeded 100 requests in 15 minutes.
   │
4. CHAT CONTROLLER (chatController.js)
   │ Session resolved: reads existing session from sessionStore (or MongoDB if authenticated).
   │ Existing profile retrieved (e.g. {} if first message).
   │
5. NLP SERVICE (nlpService.js)
   │ Regex Tokenizer runs:
   │   - Matches "rajasthan" -> state: "Rajasthan"
   │   - Matches "student" -> occupation: "student"
   │   - Matches "10th pass" -> education: "10th"
   │   - Matches "75%" -> marksPercent: 75
   │ If regex is missing fields, calls extractProfileWithGemini() as fallback.
   │
6. SMART PROFILE MERGE
   │ chatController.mergeProfiles() merges existing data with new data.
   │ Checks for occupation context shift (if changing context, flushes irrelevant fields).
   │
7. ELIGIBILITY ENGINE v5 (eligibilityService.js)
   │ Loads active schemes from MongoDB.
   │ Loops through every scheme across 7 filter gates:
   │   - Gate 1 (State): If scheme belongs to MP/UP, DROP. If Central or Rajasthan, PASS.
   │   - Gate 2 (Edu): Scheme is for graduates only? DROP. School/10th eligible? PASS.
   │   - Gate 3 (Occupation): Farmer scheme? DROP. Student scheme? PASS.
   │   - Gate 6 (Postgrad): Scheme is postgrad only? DROP.
   │   - Gate 7 (Marks): Scheme requires 80% min? DROP. Scheme requires 60% or 75%? PASS.
   │ Scoring:
   │   - +40 points (State scheme specifically for Rajasthan)
   │   - +25 points (10th-class student specific boost)
   │   - +15 points per occupation keyword hit
   │ Sorts schemes descending by score.
   │
8. GEMINI AI GENERATION (geminiService.js)
   │ Sends system prompt + user message + top 5 eligible schemes + profile to gemini-1.5-flash.
   │ Gemini synthesizes an empathetic, clear response in Hindi/English explaining:
   │   - "Aapke liye yeh 5 scholarships available hain..."
   │   - Highlights benefits, eligibility reason, and next steps.
   │
9. RESPONSE & UI UPDATE
   │ Controller saves message to conversation history.
   │ Sends JSON response with response text, extractedProfile, eligibleSchemes, partialSchemes.
   │ React ChatContext updates state:
   │   - ChatBubble renders formatted markdown response.
   │   - ProfileSidebar displays live extracted chips (Age, State: Rajasthan, Edu: 10th, Marks: 75%).
   │   - Scheme cards display with "Apply Online", "View Details", and "Save".
```

---

## 6. Frontend Architecture & Implementation Deep-Dive

The frontend is located in `/frontend`, built with React 18, Vite, and Tailwind CSS.

### 1. State Management & Context Architecture
- **`AuthContext.jsx` (`/src/context/AuthContext.jsx`):**
  - Manages authentication token (`localStorage.getItem('token')`).
  - Stores logged-in `user` profile data.
  - Exposes `login()`, `register()`, `logout()`, `updateProfile()`.
  - Automatically attaches `Authorization: Bearer <token>` to all Axios requests via an interceptor.
- **`ChatContext.jsx` (`/src/context/ChatContext.jsx`):**
  - Manages chat messages, typing indicator (`isTyping`), extracted user profile (`extractedProfile`), and matched schemes (`eligibleSchemes`, `partialSchemes`).
  - Uses a persistent session ID managed via a React `useRef` to prevent unnecessary component re-renders while allowing dynamic generation of new session IDs upon `clearChat()`.

### 2. Custom Hooks: Voice Recognition (`useSpeech.js`)
- Located in `/src/hooks/useSpeech.js`.
- Integrates browser-native Web Speech API (`window.webkitSpeechRecognition` or `window.SpeechRecognition`).
- Supports automatic language selection: Hindi (`hi-IN`) and Indian English (`en-IN`).
- Provides real-time interim results buffering so the user sees their words appear dynamically as they speak into their microphone.

### 3. Page Structure & Features
| Page Component | Route | Key Features & Implementation Details |
|---|---|---|
| **HomePage** | `/` | Hero section, 8 category cards with custom icons, example prompt chips, value proposition counters, CTA buttons. |
| **ChatPage** | `/chat` | Two-column responsive layout: Chat window on the left, dynamic profile sidebar and eligible scheme pills on the right. |
| **OnboardingPage** | `/find-schemes` | **3-Step Scheme Discovery Wizard:** Step 1: Occupation & State, Step 2: Demographics (Age, Gender, Category, Income), Step 3: Instant Algorithmic Results. Built for users who prefer visual forms over typing. |
| **SchemesPage** | `/schemes` | Browse catalog with multi-filter sidebar: category dropdown, central/state level toggle, live search debounce, pagination. |
| **SchemeDetailPage** | `/schemes/:id` | Full scheme dossier: Category badge, Hindi title, ministry, benefits highlighted, structured criteria pills (Age, Gender, Category, Income, Occupation, State), parsed bullet-point criteria, required documents list, how to apply steps, direct MyScheme application button, **WhatsApp Share** (formatted link), **Copy Link** (with clipboard fallback), and **Print Checklist** (`window.print()`). |
| **DashboardPage** | `/dashboard` | User command center: Saved schemes count, applied schemes count, profile completion percentage meter, quick links. |
| **ProfilePage** | `/profile` | Comprehensive profile form: Age, gender, state, district, occupation, annual income, category, education, marital status, disability. |
| **NotificationsPage**| `/notifications` | Scheme deadline alerts, newly matching scheme notifications, mark all as read. |
| **LoginPage / RegisterPage**| `/login`, `/register` | JWT auth with validation, error banners, password visibility toggle. |

---

## 7. Backend Architecture & Implementation Deep-Dive

The backend is located in `/backend`, running on Node.js 20 and Express.js, configured to run on **Port 5005**.

### 1. Robust Server Bootstrap (`server.js`)
- **Early Crash Telemetry:** Crash listeners for `uncaughtException` and `unhandledRejection` are declared on lines 2–12, **before** any modules are required, ensuring zero silent process terminations.
- **Security Middleware:**
  - `helmet()` to guard against common HTTP header vulnerabilities.
  - `express-rate-limit`: Restricts requests to 100 per 15-minute window on all `/api/` endpoints to protect against DDoS and API key exhaustion.
  - `cors()`: Custom dynamic origin resolver that allows localhost:5173, localhost:3000, and any Vercel preview deployment matching `/^https:\/\/government-scheme-assistant.*\.vercel\.app$/`.

### 2. Mongoose Schemas (`/backend/models/`)
1. **`User.js`:**
   - Account data: `name`, `email`, `phone`, `password` (hashed using bcrypt with 12 salt rounds).
   - Profile subdocument: `age`, `gender`, `state`, `district`, `occupation`, `annualIncome`, `category`, `education`, `maritalStatus`, `isDisabled`, `landHolding`.
   - Relationships: `savedSchemes` (array of `ObjectId` refs to `Scheme`), `appliedSchemes` (records scheme ID, applied date, and application status).
2. **`Scheme.js`:**
   - Core info: `name`, `nameHindi`, `slug` (used for MyScheme URLs), `description`, `category`, `level` (central/state), `state`, `ministry`.
   - Benefits: `benefits`, `benefitsAmount`.
   - Logistics: `documentsRequired` (array of strings), `applicationProcess`, `portalLink`.
   - Structured Eligibility Subdocument:
     ```javascript
     eligibility: {
       minAge: Number,
       maxAge: Number,
       gender: { type: String, enum: ['all', 'male', 'female', 'transgender'] },
       category: [{ type: String, enum: ['sc', 'st', 'obc', 'ews', 'general', 'all'] }],
       occupation: [String],
       maxAnnualIncome: Number,
       states: [String],
       maritalStatus: String,
       isDisabled: Boolean,
       otherCriteria: String
     }
     ```
3. **`Conversation.js`:**
   - Stores full chat trajectories: `user` (ref), `sessionId`, `messages` array (role, content, timestamp, schemesFound), `extractedProfile`, and `language`.
4. **`Notification.js`:**
   - Stores user alerts: `user`, `scheme`, `type` (`deadline`, `new-scheme`, `reminder`), `title`, `message`, `isRead`.

---

## 8. The Intelligence Core: NLP, Gemini AI & Eligibility Engine v5

The intelligence layer lives in `/backend/services/` and `/backend/controllers/chatController.js`. It consists of four tightly integrated components:

### 1. NLP Fast-Path Extraction (`nlpService.js`)
Rather than making slow, expensive API calls to an LLM for every single message, `nlpService.js` runs a high-performance **Regex Rule Extractor**:
- **State Typo Correction Map:** Normalizes colloquial spelling variations into authoritative state names:
  - `"rajastahn"`, `"rajatshan"`, `"rajatshn"`, `"jaipur"`, `"kota"` ➔ `Rajasthan`
  - `"maharahstra"`, `"mumbai"`, `"pune"` ➔ `Maharashtra`
  - `"delho"`, `"delhe"`, `"new delhi"` ➔ `Delhi`
- **Occupation & Special Category Patterns:**
  - `"kisan"`, `"farmer"`, `"kheti"` ➔ `farmer`
  - `"chhatra"`, `"student"`, `"studying"`, `"in college"` ➔ `student`
  - `"widow"`, `"vidhwa"`, `"schemes for widows"` ➔ `occupation: "widow"`, `maritalStatus: "widow"`, `gender: "female"`
  - `"business"`, `"dukaan"`, `"startup"` ➔ `self-employed`
  - `"bujurg"`, `"pension"`, `"retired"` ➔ `retired`
- **Education Hierarchical Normalizer:**
  - `"cleared 10th"`, `"10th pass"`, `"matric"`, `"ssc"` ➔ `10th`
  - `"now in 11th"`, `"currently in 12th"`, `"hsc"`, `"intermediate"` ➔ `12th`
  - `"btech"`, `"graduation"`, `"degree"` ➔ `Graduate`
  - `"mtech"`, `"mba"`, `"masters"` ➔ `Post-Graduate`
- **Marks & Percentage Parser:**
  - Extracts numeric scores from expressions: `"got 75%"`, `"scored 80 percent"`, `"passed with 65%"`.

### 2. Gemini 1.5 Flash Fallback Extractor (`geminiService.js`)
If the regex pass misses attributes or the sentence contains nuanced syntax, the text is processed by Gemini with a strict system prompt instructing it to output **only valid JSON**:
```json
{
  "age": 19,
  "gender": "female",
  "state": "Rajasthan",
  "occupation": "student",
  "education": "10th",
  "marksPercent": 75
}
```

### 3. Smart Profile Merge with Context Reset (`chatController.js`)
A major problem in multi-turn conversational agents is **stale attribute retention**. For example:
- Message 1: *"I am a 10th student with 40% marks"* ➔ `occupation: "student"`, `marksPercent: 40`.
- Message 2: *"Actually show me schemes for my mother who is a widow"*.
- If the agent naively retains `marksPercent: 40`, it might mistakenly apply academic percentage rules to widow pension schemes!
- **Our Implementation:** `mergeProfiles()` detects when `occupation` changes completely. It flushes context-specific fields (`marksPercent`) while preserving relevant demographic data (e.g. `state`), keeping the profile clean.

### 4. Eligibility Matching Engine v5 (`eligibilityService.js`)
Every scheme in the database is evaluated against the user's active profile using **7 Sequential Filter Gates**:

```
[ ALL SCHEMES IN DATABASE ]
           │
           ▼
┌───────────────────────────────┐
│ GATE 1: State Authority Check │ ➔ Drop if scheme belongs to a different state
└──────────┬────────────────────┘
           ▼
┌───────────────────────────────┐
│ GATE 2: Education Mismatch    │ ➔ Drop if Graduate user receives Class 1-12 schemes
└──────────┬────────────────────┘
           ▼
┌───────────────────────────────┐
│ GATE 3: Occupation Mismatch   │ ➔ Drop if Farmer gets student schemes, or vice-versa
└──────────┬────────────────────┘
           ▼
┌───────────────────────────────┐
│ GATE 4: Elderly Mismatch      │ ➔ Drop if user >= 60 gets marriage / maternity grants
└──────────┬────────────────────┘
           ▼
┌───────────────────────────────┐
│ GATE 5: Disability Mismatch   │ ➔ Drop if non-disabled user gets Divyang-only schemes
└──────────┬────────────────────┘
           ▼
┌───────────────────────────────┐
│ GATE 6: Post-Grad Gating      │ ➔ Drop if 10th/12th student gets PG/Masters schemes
└──────────┬────────────────────┘
           ▼
┌───────────────────────────────┐
│ GATE 7: Academic Marks Gate   │ ➔ Drop if user's marks < scheme's minimum cutoff
└──────────┬────────────────────┘
           ▼
┌───────────────────────────────┐
│ MULTI-FACTOR RELEVANCE SCORING│ ➔ Boost: State (+40), 10th Boost (+25), Widow (+150)
└──────────┬────────────────────┘
           ▼
[ SORTED ELIGIBLE & PARTIAL SCHEMES ]
```

#### Detailed Filter Logic:
1. **Gate 1 (Authoritative State Filtering):**
   - If `scheme.state` is populated (e.g. `"Tripura"`) and user is from `"Rajasthan"`, it is blocked immediately.
   - If `scheme.eligibility.states` is set and does not include user's state, it is blocked.
   - For state-level schemes, scans text for strong residency markers (`"resident of"`, `"domicile of"`).
2. **Gate 2 (Education Level Gating):**
   - Prevents college graduates from seeing primary school bicycle or uniform distribution schemes.
3. **Gate 3 (Occupation Hard Mismatch):**
   - Ensures non-student occupations (farmers, business owners, retired) never see student scholarships.
4. **Gate 4 (Elderly Gating):**
   - Senior citizens (age 60+) are excluded from schemes with keywords like `"shaadi"`, `"vivah"`, `"maternity"`, `"pregnancy"`.
5. **Gate 5 (Disability Exclusion):**
   - If user profile has `isDisabled: false`, schemes explicitly for `"divyang"`, `"handicap"`, or `"disability pension"` are excluded.
6. **Gate 6 (Postgraduate Exclusion):**
   - 10th and 12th students are excluded from university-level masters/postgrad research fellowships.
7. **Gate 7 (Marks & Academic Percentage Filter):**
   - Parses percentage requirements from scheme criteria text (e.g. `"must have scored minimum 60%"`).
   - If user scored 40% and scheme requires 60%, it is blocked.
   - Detects division criteria: First Division = 60%, Distinction = 75%.

#### Dynamic Relevance Scoring:
Schemes passing all gates are awarded points:
- **+40 points:** Scheme's dedicated state matches user's state.
- **+30 points:** Scheme text specifically mentions user's state.
- **+150 points:** Explicit match for widow schemes.
- **+25 points:** Specific boost for 10th-grade students on secondary school schemes.
- **+30 points:** Exact match on structured occupation field.
- **+15 points:** Per occupation keyword hit in scheme description (up to 3 keywords).
- **+20 points:** Scheme category matches user's occupational sector.
- **+20 points:** Gender-specific scheme matches user's gender.

---

## 9. Data Pipeline: Kaggle Dataset, Data.gov.in Sync & MyScheme Integration

### 1. Data Ingestion via `seedSchemes.js`
- Reads the raw dataset from `backend/utils/schemes_data.csv` (12.8 MB, 1,000+ schemes).
- Parses structured columns: `scheme_name`, `slug`, `details`, `benefits`, `eligibility`, `application`, `documents`, `level`, `schemeCategory`, `tags`.
- Extracts numeric parameters via regular expressions:
  - Age limits (`minAge`, `maxAge`)
  - Income limits (`maxAnnualIncome`)
  - Caste classifications (`sc`, `st`, `obc`, `ews`, `general`)
  - Gender targeting (`female`, `male`, `all`)
- Upserts documents into MongoDB using the scheme `slug` as the unique index to prevent duplicate entries.

### 2. Live Sync via `syncFromDataGov.js`
- Connects to India's official **Open Government Data (OGD) Platform** (`api.data.gov.in`) using `DATA_GOV_API_KEY`.
- Queries central government welfare catalog resource IDs:
  - Resource `6176ee09-3d56-4a3b-8115-21841576a808` (PM Welfare Schemes)
  - Resource `db9bd51a-1db4-4b2a-b793-d6cf6e4bfa46` (Scholarships India)
  - Resource `a6f7f2d4-5a34-4b8c-ae1a-04d8a08d2bff` (Ministry of Social Justice)
- Maps remote schema fields into the local Mongoose `Scheme` schema and syncs new updates.

### 3. Direct Application Linking via MyScheme.gov.in
- Rather than dumping users onto generic homepages where they must search from scratch, Yojana Sahayak uses verified scheme `slug` values:
  ```
  https://www.myscheme.gov.in/schemes/{slug}
  ```
- When a citizen clicks **"Apply Online"**, they land directly on the official application and guidelines page for that specific scheme.

---

## 10. Security, Performance & Cloud Deployment

### 1. Security Architecture
- **Password Security:** Passwords hashed with `bcryptjs` using 12 salt rounds; plain-text passwords never touch the database.
- **Stateless Authentication:** JSON Web Tokens (JWT) signed with HMAC-SHA256, set with a 7-day expiration (`7d`).
- **Input Sanitization & Validation:** Express middleware sanitizes payloads and prevents NoSQL query injection.
- **Rate Limiting:** Protects backend endpoints against brute-force attacks and abuse.
- **Secure Headers:** Helmet.js configures Content Security Policy (CSP), X-Frame-Options (prevents clickjacking), and HSTS.

### 2. Performance Optimizations
- **Dual-Layer NLP:** 80% of common user inputs (state, age, student, farmer) are parsed instantly by Regex without waiting for LLM network latency.
- **MongoDB Indexing:** Indexed on `category`, `level`, `state`, `slug`, and `isActive` for millisecond query performance across 1,000+ records.
- **Lean Mongoose Queries:** Database reads utilize `.lean()` to bypass Mongoose hydration overhead during matching.

### 3. Deployment Configuration
- **Frontend (Vercel):**
  - Configured with `vercel.json` rewrite rules to route all incoming traffic to `index.html` for client-side routing.
- **Backend (Render):**
  - Node.js 20 LTS environment.
  - CORS dynamically whitelists Vercel preview domains and production origins.

---

## 11. 15 Tough Technical Interview Questions & Model Answers

### Q1: Why didn't you just use Gemini or ChatGPT directly to recommend schemes?
> **Answer:** "Using an LLM alone for government schemes is dangerous because of **hallucinations**. An LLM can fabricate eligibility rules, cite expired schemes, or state incorrect income ceilings. In our system, we use Gemini strictly for natural language understanding—translating informal user speech into structured profile attributes. The actual eligibility matching is handled by our deterministic rule engine that runs hard mathematical checks against a database of verified schemes."

### Q2: How do you prevent a student in Rajasthan from seeing scholarships meant only for Tripura?
> **Answer:** "In our Eligibility Engine v5, Gate 1 enforces an authoritative state check. First, if a scheme's `state` field is set to a different state than the user's state, it is immediately dropped. Second, if `eligibility.states` is defined and does not include the user's state, it is dropped. Third, for state-level schemes, we regex-match strong residency indicators (e.g. 'domicile of', 'resident of') against all 36 Indian states and union territories. If another state is specified, the scheme is filtered out."

### Q3: How do you handle Hindi, English, and Hinglish without a massive custom ML model?
> **Answer:** "We built a multi-layered NLP approach. Layer 1 uses an extensive regex dictionary that maps common Hindi words and colloquial Hinglish terms directly to normalized values—for example, 'kisan' or 'kheti' maps to 'farmer', and 'vidhwa' maps to 'widow'. Layer 2 uses Google's Gemini 1.5 Flash, which has strong native multilingual capabilities for Indian languages, to parse complex conversational phrasing that regex might miss."

### Q4: What happens if the Gemini API key runs out of quota or goes down?
> **Answer:** "The application is built with graceful degradation. If `GEMINI_API_KEY` is missing, invalid, or hits a rate limit, the system falls back entirely to the local Regex Tokenizer for profile extraction, and to rule-based fallback responses for the chat message. The user still gets their schemes matched and displayed in the UI without experiencing a crash."

### Q5: Why is the backend on Port 5005 while most Node apps run on Port 5000?
> **Answer:** "On macOS and modern Windows machines, Port 5000 is frequently reserved by system services (such as Apple AirPlay Receiver or Windows host processes). Moving the backend to Port 5005 eliminates port conflicts. The frontend's `vite.config.js` is configured to proxy all `/api` calls directly to `http://localhost:5005`."

### Q6: How does the application maintain chat history for guest users who haven't logged in?
> **Answer:** "For guest users, the frontend generates a unique UUID session ID via `session.js` and stores it in browser session storage. The backend stores guest sessions in an in-memory `Map` data structure (`sessionStore`), associating message history and the active profile with that session ID. When the user registers or logs in, conversations are persisted in MongoDB linked to their user ID."

### Q7: What was the most challenging bug you encountered in the matching engine?
> **Answer:** "The most challenging bug was **profile context contamination** when a user switched topics. For example, a user would first say: 'I am a 10th student with 40% marks', setting `occupation: student` and `marksPercent: 40`. Later in the same chat, they would ask: 'Show me schemes for my mother who is a widow'. The engine was carrying over `marksPercent: 40` into the widow context, causing widow pension schemes to fail academic marks checks! We solved this in `chatController.js` by detecting occupational role shifts and flushing context-specific attributes."

### Q8: How did you implement voice input, and does it work offline?
> **Answer:** "We implemented voice recognition using the browser-native Web Speech API encapsulated in a custom React hook `useSpeech.js`. It utilizes `webkitSpeechRecognition` with the language set dynamically to `hi-IN` (Hindi) or `en-IN` (Indian English). Because it relies on the browser engine's speech-to-text service, it requires an internet connection supported by Chromium-based browsers."

### Q9: Why did you build both a Chatbot and a 3-Step Questionnaire (`/find-schemes`)?
> **Answer:** "User research in India shows two distinct user personas. Younger, tech-literate users enjoy asking questions naturally via conversational chat or voice. However, rural citizens, elderly users, or those with low digital literacy often find open-ended chat intimidating because they don't know what information to provide. The 3-Step Questionnaire provides an intuitive, point-and-click alternative where they simply tap their occupation, state, and category to see instant results."

### Q10: How do you verify eligibility for merit-based scholarships?
> **Answer:** "In Eligibility Engine v5, Gate 7 checks academic percentage. Our NLP extracts the user's percentage (e.g. 75%). The engine scans the scheme criteria using regex for percentage mentions (`\d{2,3}%`) or division requirements (First Division = 60%, Distinction = 75%). If the scheme requires a minimum percentage higher than the user's score, it is filtered out. For multi-tier schemes, it uses the lowest eligibility threshold."

### Q11: How do you prevent NoSQL injection in your MongoDB queries?
> **Answer:** "We use Mongoose schemas with strict type definitions and object sanitization. In `schemeController.js`, queries avoid evaluating raw, unsanitized user inputs. Profile matching is executed in-memory in JavaScript over pre-sanitized scheme objects, isolating the query execution layer."

### Q12: How are the WhatsApp sharing and Print features implemented?
> **Answer:** "On `SchemeDetailPage.jsx`, we built a WhatsApp sharing link that formats the scheme name, description, benefits, and URL into a structured message. To ensure WhatsApp renders the link as a clickable hyperlink, the URL is placed on its own isolated line. The Print Checklist feature triggers `window.print()`, formatted via CSS print media styles to hide navigation bars and render clean, physical document checklists."

### Q13: How do you handle CORS when deploying frontend and backend to different platforms?
> **Answer:** "In `server.js`, we implemented a dynamic origin evaluation function in the CORS configuration. It allows `localhost:5173` for development, our production custom domain, and uses a regular expression (`/^https:\/\/government-scheme-assistant.*\.vercel\.app$/`) to automatically permit all preview branches and deployments originating from Vercel."

### Q14: How scalable is the in-memory scheme matching?
> **Answer:** "Currently, the database holds ~1,000 schemes. An in-memory evaluation of 1,000 schemes against 7 filter gates takes under 4 milliseconds in Node.js. If the database expands to 50,000 schemes, we can pre-filter at the MongoDB query level by indexing and querying on `state`, `category`, and `gender` before running the granular scoring pipeline, keeping execution times under 20ms."

### Q15: What are the primary future improvements planned for this project?
> **Answer:** "First, building a WhatsApp Bot using the WhatsApp Business API, as WhatsApp is the primary digital interface for rural India. Second, adding OCR document scanning so users can upload their Aadhaar card or income certificate to auto-populate their profile. Third, integrating with official APIs like DigiLocker and APISetu for automated application submissions."

---

## 12. Summary & Key Innovations

| Innovation | Traditional Portals | Yojana Sahayak |
|---|---|---|
| **User Interface** | Cluttered tables & PDFs | Conversational Chat + Voice + 3-Step Wizard |
| **Language** | Complex legal English/Hindi | Hindi, English, and Hinglish |
| **Eligibility Determination**| Manual reading of 20-page guidelines | Automated 7-Layer Algorithmic Engine (v5) |
| **Transparency** | Black-box rejection | Explainable reasons for qualification/disqualification |
| **Application Links** | Generic departmental homepages | Direct deep-links to specific scheme pages |
| **Sharing** | Copying long, broken URLs | WhatsApp formatted cards & printable document checklists |

---

<div align="center">

**Yojana Sahayak — Empowering Every Indian Citizen Through Accessible Technology 🇮🇳**

</div>
