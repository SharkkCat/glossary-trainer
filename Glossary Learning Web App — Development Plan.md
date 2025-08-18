# 📚 Glossary Learning Web App — Ultra-Lightweight Development Plan

A minimal, static web app to help Sidekick team members quiz themselves and learn glossary terms related to hardware, firmware, and software—especially useful in overcoming language barriers when working with manufacturers.

**🎯 Ultra-Lightweight Approach**: Pure static site with JSON data files (no backend, no database, no API)

---

## ✅ 1. Key Features

| Feature | Description |
|--------|-------------|
| **Category Selection** | Simple dropdown/grid to select glossary category |
| **Flashcard Mode** | Click to flip between term and definition |
| **MCQ Mode** | Choose correct definition from 4 options |
| **Single Session** | Complete one category per session |
| **Zero Setup** | No login, no signup, no user accounts |
| **Instant Load** | All data pre-loaded, works offline after first visit |
| **Mobile-First** | Responsive design optimized for phones and tablets |
| **Auto-Generated MCQs** | Distractors pulled from other terms in same category |

---

## 🏗️ 2. Ultra-Lightweight Architecture

### Frontend Only
- **Framework**: Vite + React (minimal setup)
- **Styling**: TailwindCSS (utility-first, no custom CSS needed)
- **Routing**: Simple state management (no React Router needed)
- **State**: useState + useEffect only
- **Data**: Static JSON files imported as modules

### No Backend Required
- **Data Storage**: JSON files in `/src/data/`
- **Deployment**: Static hosting (Vercel/Netlify/GitHub Pages)
- **Updates**: Edit JSON files and redeploy
- **Performance**: Instant loading, works offline

### Data Structure

#### File: `categories.json`
```json
[
  {"id": "hardware", "name": "Hardware Terms", "icon": "🔧"},
  {"id": "bluetooth", "name": "Bluetooth Terms", "icon": "📡"}
]
```

#### File: `terms.json`
```json
[
  {
    "id": "term_001",
    "categoryId": "hardware", 
    "term": "PCB",
    "definition": "Printed Circuit Board - connects electronic components",
    "example": "The PCB layout affects signal integrity"
  }
]
```

---

## 📁 3. Minimal File Structure

```
/glossary-trainer
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── CategorySelector.tsx    # Grid/list of categories
│   │   ├── Flashcard.tsx          # Flip animation component  
│   │   ├── MCQ.tsx                # Multiple choice quiz
│   │   └── SessionComplete.tsx    # End of session message
│   │
│   ├── data/
│   │   ├── categories.json        # List of glossary categories
│   │   └── terms.json            # All terms with definitions
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   ├── utils/
│   │   └── quiz.ts               # MCQ generation logic
│   │
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Vite entry point
│   └── index.css                 # Tailwind imports only
│
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```

**Key Simplifications:**
- ❌ No pages/ folder (single-page app)
- ❌ No services/ folder (no API calls)
- ❌ No .env file (no secrets needed)
- ❌ No routing library
- ❌ No assets/ folder initially

---

## 🧱 4. Ultra-Fast Implementation Plan

### Phase 1: Foundation (30 minutes)
- [ ] `npm create vite@latest glossary-trainer -- --template react-ts`
- [ ] Install Tailwind CSS
- [ ] Create basic TypeScript interfaces
- [ ] Set up minimal folder structure

### Phase 2: Data Setup (✅ COMPLETED)  
- [x] Create sample `categories.json` and `terms.json`
- [x] Build data import utilities
- [x] Test data loading in App component

**✅ Phase 2 Results:**
- **167 real terms** from Sidekick/Ora EN-CN Tech Glossary
- **12 categories** with Chinese/English/Pinyin data
- **Rich data structure** with notes and proper encoding
- **Fixed TailwindCSS** and TypeScript issues

### Phase 3: Core Components (60 minutes)
- [ ] Build CategorySelector with grid layout
- [ ] Build Flashcard with CSS flip animation
- [ ] Build MCQ with auto-generated distractors
- [ ] Build SessionComplete celebration

### Phase 4: App Logic (30 minutes)
- [ ] Implement session flow state machine
- [ ] Add term shuffling and navigation
- [ ] Connect all components in App.tsx

### Phase 5: Polish (30 minutes)
- [ ] Mobile-responsive Tailwind styling
- [ ] Keyboard shortcuts (Space = flip, Enter = next)
- [ ] Loading states and transitions
- [ ] Deploy to Vercel/Netlify

**Total Development Time: ~2.5 hours**

## 🚀 Quick Start Commands

```bash
# 1. Create project
npm create vite@latest glossary-trainer -- --template react-ts
cd glossary-trainer

# 2. Install dependencies  
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Start development
npm run dev
```

---

## 💡 Technical Decisions for Lightweight Approach

### Why Static JSON Over Database?
- ✅ Zero latency (no API calls)
- ✅ Works offline after first load  
- ✅ No backend maintenance
- ✅ Easy content updates (edit files)
- ✅ Free hosting on any static platform

### Why No React Router?
- ✅ Single-page app with state-based navigation
- ✅ Faster initial load
- ✅ Simpler state management
- ✅ Mobile app-like experience

### Auto-Generated MCQ Distractors
```typescript
// Smart distractor selection
function generateDistractors(correctTerm: Term, allTerms: Term[]) {
  return allTerms
    .filter(t => t.categoryId === correctTerm.categoryId)
    .filter(t => t.id !== correctTerm.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(t => t.definition);
}
```

---

## 📝 Core Requirements Summary

- ✅ **Zero Setup**: No accounts, no onboarding
- ✅ **Category-Based**: One topic per session  
- ✅ **Two Modes**: Flashcards + MCQ
- ✅ **Mobile-First**: Thumb-friendly design
- ✅ **Ultra-Fast**: < 3 hours total development
- ✅ **Zero Maintenance**: Static files only
