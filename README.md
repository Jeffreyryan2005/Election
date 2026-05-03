# 🗳️ VoteGuide AI — Election Process Education Assistant

> **Hack2Skill Virtual PromptWars — Challenge 2: Election Process Education**

An AI-powered, interactive web application that helps citizens understand the Indian election process, timelines, and steps in an engaging, accessible way. Powered by **Google Gemini AI**.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-blue) ![Cloud Run](https://img.shields.io/badge/Google-Cloud%20Run-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 Chosen Vertical

**Election Process Education** — Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

---

## 🧠 Approach & Logic

### Architecture

```
┌─────────────────────────────────────────────┐
│              Frontend (SPA)                  │
│  HTML5 + CSS3 + Vanilla JavaScript           │
│  ┌──────────┬──────────┬──────────┐          │
│  │ Timeline │ AI Chat  │  Quiz    │          │
│  │ Viewer   │ Interface│  Engine  │          │
│  └──────────┴──────────┴──────────┘          │
├─────────────────────────────────────────────┤
│              Backend (Express.js)             │
│  ┌──────────┬──────────┬──────────┐          │
│  │ REST API │ Security │ Gemini   │          │
│  │ Routes   │ Layer    │ Client   │          │
│  └──────────┴──────────┴──────────┘          │
├─────────────────────────────────────────────┤
│           Google Services                     │
│  ┌──────────┬──────────┐                     │
│  │ Gemini   │ Cloud    │                     │
│  │ AI       │ Run      │                     │
│  └──────────┴──────────┘                     │
└─────────────────────────────────────────────┘
```

### Design Decisions

1. **Google Gemini AI Integration** — Context-aware, non-partisan responses via carefully crafted system prompts with comprehensive Indian election knowledge
2. **Intelligent Fallback System** — Keyword-matched local responses ensure the app works even without an API key
3. **Single-Page Application** — Fast, smooth navigation without page reloads
4. **Mobile-First Responsive Design** — Accessible on all devices
5. **Progressive Enhancement** — Core content works without JavaScript; enhanced features layer on top

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📅 **Interactive Timeline** | Visual 7-phase election process timeline with detailed modal views |
| 🤖 **AI Assistant** | Google Gemini-powered chatbot for election Q&A with conversation context |
| 🧠 **Knowledge Quiz** | 10-question quiz with scoring, explanations, and grade system |
| ✅ **Voter Checklist** | Step-by-step preparation guide for election day |
| ❓ **FAQ Section** | Filterable frequently asked questions with accordion UI |
| 📊 **Election Statistics** | Key facts about India's electoral system |
| ♿ **Full Accessibility** | WCAG-compliant with ARIA labels, keyboard navigation, skip links |
| 🔒 **Security First** | Helmet, rate limiting, input sanitization, CSP headers |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js 18+, Express.js |
| **AI/ML** | Google Gemini 2.0 Flash |
| **Security** | Helmet, express-rate-limit, hpp, express-validator |
| **Testing** | Jest, Supertest |
| **Logging** | Winston |
| **Deployment** | Google Cloud Run, Docker |

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+ installed
- (Optional) Google Gemini API key from [aistudio.google.com](https://aistudio.google.com/apikey)

### Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd election

# Install dependencies
npm install

# Set up environment (optional - app works without API key)
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the server
npm start

# Visit http://localhost:8080
```

### Run Tests

```bash
npm test
```

### Docker

```bash
docker build -t election-education .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key election-education
```

---

## 📁 Project Structure

```
election/
├── server.js                    # Express server with security middleware
├── package.json                 # Dependencies and scripts
├── Dockerfile                   # Cloud Run deployment config
├── .env.example                 # Environment variable template
├── public/
│   ├── index.html               # Semantic HTML5 with ARIA labels
│   ├── css/styles.css           # Design system with animations
│   └── js/app.js                # Client-side SPA logic
├── src/
│   ├── data/electionData.js     # Structured election education data
│   ├── middleware/security.js   # Rate limiting, sanitization, headers
│   ├── routes/api.js            # REST API endpoints
│   ├── routes/assistant.js      # Gemini AI chat endpoints
│   └── utils/
│       ├── gemini.js            # Google Gemini client + prompt engineering
│       └── logger.js            # Winston structured logging
├── tests/
│   └── app.test.js              # Jest + Supertest test suite
└── README.md
```

---

## 🔒 Security Measures

- **Helmet.js** — HTTP security headers (CSP, HSTS, X-Frame-Options)
- **Rate Limiting** — 100 req/15min (API), 10 req/min (AI chat)
- **Input Sanitization** — XSS prevention, injection protection
- **HPP** — HTTP Parameter Pollution protection
- **CORS** — Configured cross-origin resource sharing
- **Non-root Docker** — Container runs as unprivileged user
- **Content Security Policy** — Restrictive CSP directives

---

## ♿ Accessibility

- WCAG 2.1 compliant semantic HTML
- Skip navigation link
- ARIA labels, roles, and live regions
- Keyboard navigable (all interactive elements)
- High contrast dark theme
- Screen reader friendly
- Focus management for modals and dialogs

---

## 🧪 Testing

The test suite validates:
- All API endpoints (GET/POST)
- Input validation and error handling
- Security headers presence
- Quiz scoring logic
- Data integrity (timeline order, quiz answers)
- AI fallback response quality
- SPA routing fallback

---

## ☁️ Google Services Integration

### Google Gemini AI
- Powers the intelligent Q&A assistant
- Comprehensive system prompt with Indian election knowledge
- Safety settings for responsible AI
- Conversation history for context-aware responses

### Google Cloud Run
- Containerized deployment via Dockerfile
- Auto-scaling and health checks
- Environment variable configuration
- Non-root container security

---

## 📝 Assumptions

1. Focus is on the **Indian election process** (ECI, Lok Sabha, Vidhan Sabha)
2. Content is **non-partisan** — no political party affiliations
3. The AI assistant provides **educational** information only, not legal advice
4. Users may access the app on mobile devices — **responsive design** is essential
5. The app should work **with or without** a Gemini API key (graceful fallback)

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for democracy | Powered by Google Gemini AI
</p>
